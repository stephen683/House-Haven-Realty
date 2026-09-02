import { test, expect, type Page, type Route } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const fx = (name: string) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', `${name}.json`), 'utf8'))

const PNG_1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
)

/**
 * Waits for MapLibre to load the permits source and returns how many pins it
 * actually rendered. Source features are data (no GPU needed); rendered
 * features need WebGL, which headless may provide via SwiftShader.
 */
async function expectMapLoaded(page: Page, expectedSource: number) {
  await page.waitForFunction(
    (n) => {
      const m = (window as unknown as {
        __pipelineMap?: { isStyleLoaded(): boolean; querySourceFeatures(s: string): unknown[] }
      }).__pipelineMap
      return !!m && m.isStyleLoaded() && m.querySourceFeatures('permits').length >= n
    },
    expectedSource,
    { timeout: 30_000 },
  )
  return page.evaluate(() => {
    const m = (window as unknown as {
      __pipelineMap?: { queryRenderedFeatures(o: { layers: string[] }): unknown[] }
    }).__pipelineMap
    return m?.queryRenderedFeatures({ layers: ['permits-circle'] }).length ?? -1
  })
}

/** Every URL the page requests, so tests can assert what the UI asked the API for. */
async function mockNetwork(page: Page) {
  const searchRequests: URL[] = []

  await page.route('**/api/pipeline/search**', (route: Route) => {
    const url = new URL(route.request().url())
    searchRequests.push(url)
    const body = fx('search')
    // Reflect a couple of filters so the count visibly changes.
    if (url.searchParams.get('propertyType') === 'condo') {
      body.results = body.results.filter((r: { propertyType: string }) => r.propertyType === 'condo')
      body.total = 30
      body.totalPages = 2
    }
    if (url.searchParams.get('bedroomsMin')) {
      body.results = body.results.filter((r: { bedrooms: number | null }) => r.bedrooms !== null)
      body.total = body.results.length
      body.totalPages = 1
    }
    return route.fulfill({ json: body })
  })
  await page.route('**/api/pipeline/suggest**', (route) => route.fulfill({ json: fx('suggest') }))
  await page.route('**/api/suggest**', (route) => route.fulfill({ json: { suggestions: [] } }))
  await page.route('**/api/permits/geojson**', (route) => route.fulfill({ json: fx('geojson') }))
  await page.route('**/api/pipeline/scores**', (route) => route.fulfill({ json: { scores: [], meta: {} } }))
  await page.route('**/api/pipeline/permit/**', (route) => route.fulfill({ status: 404, json: {} }))
  await page.route('**basemaps.cartocdn.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'image/png', body: PNG_1x1 }),
  )
  return searchRequests
}

test.describe('Nashville Pipeline search', () => {
  test('search bar, grouped suggestions, keyboard select, chips, results', async ({ page }, info) => {
    const requests = await mockNetwork(page)
    await page.goto('/pipeline')

    const input = page.getByTestId('search-input')
    await expect(input).toBeVisible()
    await expect(input).toHaveAttribute('role', 'combobox')

    // Mobile: results are behind the List toggle; desktop shows them always.
    if (info.project.name === 'mobile') await page.getByTestId('view-list').click()

    // Results list renders real data with public redaction (no house numbers).
    const rows = page.getByTestId('result-row')
    await expect(rows.first()).toBeVisible()
    await expect(rows).toHaveCount(8)
    await expect(rows.first()).toContainText('SUMMIT OAKS CT')
    await expect(rows.first()).not.toContainText('784 ')
    await expect(page.getByTestId('results-count')).toContainText('3,513 permits')

    // Coverage is stated from the data, including the recorded rates.
    await expect(page.getByTestId('coverage-line')).toContainText('363 days')
    await expect(page.getByTestId('coverage-line')).toContainText('beds on 17%')

    // Nulls are labelled, never hidden.
    await expect(page.getByTestId('result-row').filter({ hasText: 'ATHENS WAY' }))
      .toContainText('beds/baths not on permit')

    // Typeahead: grouped, keyboard-navigable.
    await input.fill('ryan')
    const listbox = page.getByTestId('search-listbox')
    await expect(listbox).toBeVisible()
    await expect(listbox).toContainText('Builders')
    await expect(listbox).toContainText('NVR, INC. T/A RYAN HOMES')
    await expect(listbox).toContainText('180 permits')
    await expect(listbox).toContainText('Streets')

    await input.press('ArrowDown') // freetext -> first builder
    await expect(listbox.getByRole('option', { name: /NVR, INC/ })).toHaveAttribute('aria-selected', 'true')
    await input.press('Enter')

    await expect(page.getByTestId('active-chips')).toContainText('NVR, INC. T/A RYAN HOMES')
    await expect.poll(() => requests.at(-1)?.searchParams.get('contractor')).toBe('NVR, INC. T/A RYAN HOMES')

    await page.screenshot({ path: `e2e/screenshots/${info.project.name}-search.png`, fullPage: false })
  })

  test('map pins come from the cache-backed GeoJSON and respond to filters', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'desktop only')
    await mockNetwork(page)
    await page.goto('/pipeline')
    const rendered = await expectMapLoaded(page, 21)
    // Software WebGL may or may not be available headless; the source-feature
    // count above is the hard assertion, rendering is reported.
    console.log(`[map] rendered pins: ${rendered}`)

    // A property-type filter narrows the map to the same set the list shows.
    await page.getByTestId('filters-toggle').click()
    await page.getByTestId('filter-property-types').getByRole('button', { name: 'Condo' }).click()
    await page.keyboard.press('Escape')
    await expect
      .poll(() => page.evaluate(() => {
        const m = (window as unknown as { __pipelineMap?: { getFilter(id: string): unknown } }).__pipelineMap
        return JSON.stringify(m?.getFilter('permits-circle') ?? null)
      }))
      .toContain('"condo"')
  })

  test('filters: condo + 3 beds + 2.5 baths + ZIP drive the API and the map', async ({ page }, info) => {
    const requests = await mockNetwork(page)
    await page.goto('/pipeline')

    await page.getByTestId('filters-toggle').click()
    const panel = page.getByTestId('filters-panel')
    await expect(panel).toBeVisible()
    await expect(panel.getByTestId('recorded-note')).toContainText('Condo and duplex permits almost never list them')

    await panel.getByTestId('filter-property-types').getByRole('button', { name: 'Condo' }).click()
    await expect.poll(() => requests.at(-1)?.searchParams.get('propertyType')).toBe('condo')

    await panel.getByTestId('filter-beds').getByRole('button', { name: '3+' }).click()
    await panel.getByTestId('filter-baths').getByRole('button', { name: '2.5+' }).click()
    await panel.getByTestId('filter-zips').getByRole('button', { name: /37206/ }).click()
    await panel.getByTestId('filter-zips').getByRole('button', { name: /37216/ }).click()

    await expect.poll(() => requests.at(-1)?.searchParams.get('bedroomsMin')).toBe('3')
    await expect.poll(() => requests.at(-1)?.searchParams.get('bathroomsMin')).toBe('2.5')
    await expect.poll(() => requests.at(-1)?.searchParams.get('zip')).toBe('37206,37216')
    await expect(page.getByTestId('filters-toggle')).toContainText('4')

    await page.screenshot({ path: `e2e/screenshots/${info.project.name}-filters.png`, fullPage: false })

    // Close the panel; chips show every active filter and can clear it.
    if (info.project.name === 'mobile') await panel.getByRole('button', { name: 'Done', exact: true }).click()
    else await page.keyboard.press('Escape')
    await expect(panel).toBeHidden()

    const chips = page.getByTestId('active-chips')
    await expect(chips).toContainText('condo')
    await expect(chips).toContainText('3+ beds')
    await expect(chips).toContainText('2.5+ baths')
    await expect(chips).toContainText('37206')
    await chips.getByRole('button', { name: /Remove Beds filter/ }).click()
    await expect.poll(() => requests.at(-1)?.searchParams.has('bedroomsMin')).toBe(false)
  })

  test('mobile: map/list toggle shows one surface at a time', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'mobile only')
    await mockNetwork(page)
    await page.goto('/pipeline')

    await expect(page.getByTestId('map-region')).toBeVisible()
    await expect(page.getByTestId('results-region')).toBeHidden()

    await page.getByTestId('view-list').click()
    await expect(page.getByTestId('results-region')).toBeVisible()
    await expect(page.getByTestId('map-region')).toBeHidden()
    await expect(page.getByTestId('view-list')).toContainText('3.5K')
    await page.screenshot({ path: 'e2e/screenshots/mobile-list.png' })

    await page.getByTestId('view-map').click()
    await expect(page.getByTestId('map-region')).toBeVisible()
    await expectMapLoaded(page, 21)
    await page.screenshot({ path: 'e2e/screenshots/mobile-map.png' })
  })

  test('empty result set is stated once, on whichever surface is visible', async ({ page }, info) => {
    await mockNetwork(page)
    // Registered after mockNetwork: Playwright matches the most recent route first.
    await page.route('**/api/pipeline/search**', (route) =>
      route.fulfill({ json: { ...fx('search'), results: [], total: 0, totalPages: 1 } }),
    )
    await page.goto('/pipeline')

    if (info.project.name === 'desktop') {
      // Map and list side by side; the list owns the empty state, the map overlay stays out of the way.
      await expect(page.getByTestId('map-region')).toBeVisible()
      await expect(page.getByTestId('results-region')).toBeVisible()
      await expect(page.getByTestId('results-panel')).toContainText('No permits match')
      await expect(page.getByTestId('map-empty')).toBeHidden()
    } else {
      // Map view is the only surface on screen, so the overlay carries the message.
      await expect(page.getByTestId('map-empty')).toBeVisible()
      await page.getByTestId('view-list').click()
      await expect(page.getByTestId('results-panel')).toContainText('No permits match')
    }
    // Lead capture is wired into the empty state.
    await expect(page.getByRole('button', { name: /Get alerts/ }).last()).toBeVisible()
  })
})
