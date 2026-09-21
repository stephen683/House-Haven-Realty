import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

// All three genuine buyer leads this site has produced came through the
// structured search form; the free-text contact form produced none in five
// months. These pin the funnel to that finding.

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')

describe('the structured form is on the pages buyers land on', () => {
  for (const page of ['app/homes-for-sale/page.tsx', 'app/buyers/page.tsx']) {
    it(`${page} renders HomeSearchForm`, () => {
      expect(read(page)).toContain('<HomeSearchForm />')
    })
  }
})

describe('every intake form asks where', () => {
  for (const form of ['components/forms/ContactForm.tsx', 'components/forms/HomeSearchForm.tsx']) {
    it(`${form} has an areas field backed by the shared suggestions`, () => {
      const src = read(form)
      expect(src).toMatch(/name="areas"/)
      expect(src).toContain('PLACE_SUGGESTIONS')
      expect(src).toContain('list={placesId}')
    })

    it(`${form} gives the datalist a per-instance id`, () => {
      // Two forms on one page sharing a datalist id is invalid HTML and an
      // accessibility defect; useId() keeps them distinct.
      const src = read(form)
      expect(src).toContain('useId()')
      expect(src).not.toContain('id="nashville-places"')
    })
  }

  it('the contact form sends the area to the server, not just the browser', () => {
    // A field the route never sees cannot help triage.
    expect(read('components/forms/ContactForm.tsx')).toMatch(/Areas: \$\{data\.get\('areas'\)\}/)
  })
})

describe('the contact form still accepts free text', () => {
  it('the area is optional and the message is required', () => {
    const src = read('components/forms/ContactForm.tsx')
    expect(src).toMatch(/name="areas"[\s\S]{0,400}?placeholder=/)
    expect(src).not.toMatch(/name="areas"[\s\S]{0,200}?required/)
    expect(src).toMatch(/name="message"[\s\S]{0,120}?required/)
  })
})
