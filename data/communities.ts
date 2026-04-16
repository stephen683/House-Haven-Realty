// Community directory — ROADMAP Section 7.
// `content` is the long-form copy for the community page. Fair-Housing-safe:
// describe amenities, commute, schools, lifestyle — never demographics.

export interface CommunityContentSection {
  heading: string
  body: string
}

export interface Community {
  slug: string
  name: string
  county: string
  state: 'TN'
  zips: string[]
  tier: 1 | 2 | 3
  tagline: string
  distanceFromNashville: string
  /** Approximate centroid used for map and structured data. */
  lat: number
  lng: number
  metaDescription: string
  content: CommunityContentSection[]
  nearby: string[]
}

export const communities: Community[] = [
  {
    slug: 'joelton',
    name: 'Joelton',
    county: 'Davidson',
    state: 'TN',
    zips: ['37080'],
    tier: 1,
    tagline: 'Country living, city close.',
    distanceFromNashville: '~20 min to downtown Nashville',
    lat: 36.3237,
    lng: -86.8722,
    metaDescription:
      'Explore Joelton, TN — a rural Davidson County community just 20 minutes from downtown Nashville. Homes, schools, Beaman Park, and market data from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Joelton',
        body: "Joelton sits in the northwestern corner of Davidson County, where Nashville fades out into rolling pasture, wooded ridges, and long country driveways. It is one of the last places inside the Nashville city limits where you can still find a few acres, a wraparound porch, and a creek running across your back property line without a 45-minute commute. Most residents describe it as the perfect compromise — the peace of a small rural town with downtown Nashville only about 20 minutes south on I-24.",
      },
      {
        heading: 'Location and commute',
        body: 'Joelton is anchored by Exit 42 on Interstate 24, which drops you at downtown Nashville in roughly 20 minutes off-peak and 30 minutes during rush hour. Briley Parkway (I-440) connects Joelton commuters to the BNA airport, Opryland, and the eastern suburbs without fighting downtown traffic. For healthcare workers, Ascension Saint Thomas West, TriStar Skyline, and Vanderbilt are all 25 to 30 minutes away.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Housing in the 37080 ZIP code ranges from mid-century ranches on small lots near Old Hickory Boulevard to custom-built homes on 3- to 10-acre parcels tucked along Clarksville Pike and Eatons Creek Road. Buyers typically see single-family homes from the high $300s for in-town cottages up to $1M+ for newer custom builds on acreage. New construction is active but not saturated, making Joelton a strong match for buyers who want privacy and land without giving up Metro Nashville services.',
      },
      {
        heading: 'Schools',
        body: 'Joelton is served by Metro Nashville Public Schools: Joelton Elementary, Joelton Middle, and Whites Creek High School. Families also have access to MNPS choice zones and nearby private options in Goodlettsville and Ashland City. Verify current attendance zones with MNPS before making a purchase decision, as zones are periodically updated.',
      },
      {
        heading: 'Parks and outdoor life',
        body: "Joelton's crown jewel is Beaman Park — 1,700 acres of old-growth forest, wildflower hikes, and the Henry Hollow Loop Trail, all about five minutes from most Joelton homes. Marrowbone Lake sits just north of town for bass fishing and kayaking. Residents who want a farmers-market Saturday can be in downtown Goodlettsville or the Nashville Farmers' Market in under 25 minutes.",
      },
      {
        heading: 'Why House Haven knows Joelton',
        body: "Our team has helped Joelton buyers navigate everything from well-and-septic contingencies to agricultural-use tax transitions — things a template national brokerage rarely gets right the first time. If you're comparing a Joelton home against a Greenbrier or Ashland City property, we can walk you through the pros and cons from real closed transactions in all three communities.",
      },
    ],
    nearby: ['whites-creek', 'ashland-city', 'greenbrier', 'madison'],
  },
  {
    slug: 'ashland-city',
    name: 'Ashland City',
    county: 'Cheatham',
    state: 'TN',
    zips: ['37015'],
    tier: 1,
    tagline: "Cheatham County's river town, 25 minutes from Nashville.",
    distanceFromNashville: '~25 min to downtown Nashville',
    lat: 36.2734,
    lng: -87.0639,
    metaDescription:
      'Ashland City, TN homes for sale and lifestyle guide. Cumberland River access, small-town charm, and quick commutes to Nashville — with market data from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Ashland City',
        body: 'Ashland City is the Cheatham County seat and the river town most Nashville commuters discover when they want more house, more land, and more quiet than Davidson County can give them at the same price. Main Street still has the feel of a small Southern town — a diner, the courthouse square, a river walk — but the growth around Highway 12 has brought newer subdivisions, grocery anchors, and commuter-friendly infrastructure.',
      },
      {
        heading: 'Location and commute',
        body: 'Ashland City sits directly west of Nashville along the Cumberland River. Highway 12 (Ashland City Highway) is the main commuter artery and drops you at The Nations and West Nashville in about 20 minutes. Downtown Nashville is typically a 25- to 30-minute drive depending on time of day. Ascension Saint Thomas has a major hospital campus in Ashland City, which means many residents do not commute at all.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'The Ashland City market covers a wide spectrum: starter homes in established subdivisions, new construction in planned communities off Chapmansboro Road and Highway 49, and rural acreage properties north of town toward Pleasant View. Entry-level single-family homes typically start in the mid $300s, with newer custom builds on acreage stretching above $1M.',
      },
      {
        heading: 'Schools',
        body: 'Ashland City is served by Cheatham County Schools, including Cheatham Middle School and Cheatham County Central High School. Several Christian and homeschool cooperatives also operate in the area. Zones change over time, so buyers should confirm directly with the district before committing.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'The Cumberland River Bicentennial Trail starts in downtown Ashland City and runs 3.7 miles along a former rail bed — it is one of the most loved walking and biking spots in Middle Tennessee. Sycamore Creek, Cheatham Dam, and the river itself make Ashland City a fishing, kayaking, and pontoon-boating community.',
      },
      {
        heading: 'Why House Haven knows Ashland City',
        body: 'Our agents regularly close homes in Ashland City and the surrounding Cheatham County corridor. We can speak to everything from HOA realities in the newer subdivisions off Highway 49 to well/septic expectations on rural acreage north of town.',
      },
    ],
    nearby: ['pegram', 'kingston-springs', 'joelton'],
  },
  {
    slug: 'greenbrier',
    name: 'Greenbrier',
    county: 'Robertson',
    state: 'TN',
    zips: ['37073'],
    tier: 1,
    tagline: 'Affordable small-town living off I-65.',
    distanceFromNashville: '~30 min to downtown Nashville',
    lat: 36.4267,
    lng: -86.8058,
    metaDescription:
      'Greenbrier, TN real estate and community guide. A fast-growing Robertson County small town with I-65 access, strong schools, and approachable prices.',
    content: [
      {
        heading: 'What it feels like to live in Greenbrier',
        body: "Greenbrier is exactly what a lot of Nashville commuters are looking for: a genuine small town with its own identity, not a far-out subdivision of Nashville. Residents shop at the local grocery, kids play at the city park on Saturday, and football Friday night is a real community event. Growth is happening — new subdivisions are working their way up Highway 41 — but it still feels like Robertson County, not a metroplex spillover.",
      },
      {
        heading: 'Location and commute',
        body: 'Greenbrier is anchored by Exit 108 on I-65, about 30 minutes north of downtown Nashville. Commuters who work in Germantown, MetroCenter, or downtown typically report 35 to 45 minute door-to-door drives depending on time of day. For healthcare workers, NorthCrest Medical Center in Springfield is less than 15 minutes away.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Greenbrier is one of the more affordable doorsteps into Robertson County. Entry-level single-family homes typically start in the high $200s to low $300s, with newer construction in the mid $300s to mid $400s and rural acreage properties going higher. This makes it a strong option for first-time buyers and move-up buyers leaving Sumner or Davidson County.',
      },
      {
        heading: 'Schools',
        body: 'Greenbrier is served by Robertson County Schools: Greenbrier Elementary, Greenbrier Middle, and Greenbrier High. Families should verify current zones with the district directly, as rapid growth has triggered periodic rezoning conversations.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Greenbrier City Park offers baseball, playgrounds, and walking paths. Nearby, Port Royal State Park in Adams and the Cumberland River boat ramps give residents weekend outdoor options without driving back toward Nashville.',
      },
      {
        heading: 'Why House Haven knows Greenbrier',
        body: "We have buyers and sellers across the I-65 corridor, and Greenbrier is one of the communities we actively track. We can tell you which subdivisions are holding value, where the road widening is coming, and how commute times really feel on a Tuesday morning versus what Google Maps claims.",
      },
    ],
    nearby: ['springfield', 'white-house', 'coopertown'],
  },
  {
    slug: 'springfield',
    name: 'Springfield',
    county: 'Robertson',
    state: 'TN',
    zips: ['37172'],
    tier: 1,
    tagline: "Robertson County's historic seat, growing fast.",
    distanceFromNashville: '~35 min to downtown Nashville',
    lat: 36.5092,
    lng: -86.8839,
    metaDescription:
      'Springfield, TN homes and neighborhood guide from House Haven Realty. Historic Robertson County seat with new construction, strong healthcare jobs, and small-town charm.',
    content: [
      {
        heading: 'What it feels like to live in Springfield',
        body: 'Springfield is the Robertson County seat, and you can feel it. The downtown square still has the courthouse at its center, a handful of locally owned restaurants, and Saturday morning farmers market energy. Outside the square, Springfield is the fastest-growing part of the county — new construction, retail expansion along Memorial Boulevard, and a healthcare job base anchored by NorthCrest Medical Center.',
      },
      {
        heading: 'Location and commute',
        body: 'Springfield sits at the intersection of Highway 431 and Highway 41, about 35 minutes north of downtown Nashville via I-65. Many Springfield residents work locally (NorthCrest, schools, county government, manufacturing) and commute times feel shorter than the mileage suggests because traffic is rarely an all-day issue.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Springfield has a broad housing stock: historic homes on Main Street, mid-century ranches and cottages in the older neighborhoods, and active new construction in subdivisions on the south and east sides of town. Entry-level single-family homes typically run in the high $200s to low $300s, with newer construction in the mid $300s and custom acreage homes above.',
      },
      {
        heading: 'Schools',
        body: 'Springfield is served by Robertson County Schools, including Springfield High School and a network of elementary and middle schools. The district has been actively planning for growth. Buyers should confirm current attendance zones with the district before making a decision.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'J. Travis Price Park is the county parks anchor, with walking trails, disc golf, and athletic fields. Residents also take advantage of Dunbar Cave State Park in nearby Clarksville and Port Royal State Park for weekend outings.',
      },
      {
        heading: 'Why House Haven knows Springfield',
        body: 'We have worked Springfield from downtown historic homes to brand-new construction off Memorial Boulevard. We can help you understand where to expect appreciation, which builders are actively delivering, and how school zones may shift with new subdivisions.',
      },
    ],
    nearby: ['greenbrier', 'coopertown', 'white-house'],
  },
  {
    slug: 'thompsons-station',
    name: 'Thompsons Station',
    county: 'Williamson',
    state: 'TN',
    zips: ['37179'],
    tier: 1,
    tagline: 'Williamson County growth, minus the Franklin price tag.',
    distanceFromNashville: '~35 min to downtown Nashville',
    lat: 35.8062,
    lng: -86.9125,
    metaDescription:
      'Thompsons Station, TN real estate guide from House Haven Realty. Williamson County schools, fast new construction, and a value alternative to Franklin and Brentwood.',
    content: [
      {
        heading: 'What it feels like to live in Thompsons Station',
        body: 'Thompsons Station is the Williamson County town a lot of buyers discover after they price out of Franklin and Brentwood. It offers the same highly regarded Williamson County school system and the same I-65 commute, but with newer homes, larger lots, and meaningfully lower prices per square foot than its neighbors to the north. Growth has been aggressive — this is one of the most active new-construction markets in Middle Tennessee — and the town is still working to balance that growth with small-town character.',
      },
      {
        heading: 'Location and commute',
        body: 'Thompsons Station sits on I-65 at Exit 59 (Peytonsville Road) and Exit 61 (Goose Creek Bypass), roughly 35 minutes south of downtown Nashville in off-peak traffic. Cool Springs is a 10-minute drive, which makes it a strong fit for Nashville commuters who want a mix of big-city work and small-town home life.',
      },
      {
        heading: 'Housing stock and price range',
        body: "Thompsons Station is dominated by newer subdivisions — Bridgemore Village, Tollgate Village, Cherry Grove, Canterbury, and many more — with floor plans ranging from attached townhomes in the mid $400s to large single-family homes approaching or exceeding $1.5M. There is also a strong supply of resale homes from the past 10 to 15 years and a smaller pocket of historic properties near the town's original core.",
      },
      {
        heading: 'Schools',
        body: 'Thompsons Station is served by Williamson County Schools, widely considered one of the strongest public districts in Tennessee. Specific zones depend on address, and with new schools coming online the district has rezoned parts of Thompsons Station periodically — buyers should confirm current zones before committing.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Preservation Park offers walking trails, open fields, and event space. The Harpeth River winds through parts of Williamson County nearby, and Timberland Park in Leipers Fork is a short drive west for hiking and views along the Natchez Trace.',
      },
      {
        heading: 'Why House Haven knows Thompsons Station',
        body: "We actively help clients compare Thompsons Station to Spring Hill, Nolensville, and Franklin. Each of those markets has a different long-term growth pattern, school zone math, and resale profile — and we can walk you through exactly what that means for your budget and timeline.",
      },
    ],
    nearby: ['fairview', 'franklin', 'spring-hill', 'nolensville'],
  },
  {
    slug: 'bordeaux',
    name: 'Bordeaux',
    county: 'Davidson',
    state: 'TN',
    zips: ['37207', '37208'],
    tier: 1,
    tagline: 'North Nashville value, with serious new-construction activity.',
    distanceFromNashville: '~10 min to downtown Nashville',
    lat: 36.1912,
    lng: -86.8311,
    metaDescription:
      'Bordeaux and Brick Church Pike homes for sale and neighborhood guide. North Nashville value, heavy new construction, and House Haven Realty market intel.',
    content: [
      {
        heading: 'What it feels like to live in Bordeaux',
        body: 'Bordeaux is the North Nashville neighborhood most buyers stumble onto when they realize the downtown core has priced them out. It sits just across the Cumberland River from MetroCenter, close enough to downtown that you can see the skyline, and it has become one of the most active new-construction pockets inside the I-440 loop. Older streets still feel residential and quiet; newer infill blocks are being redrawn house by house.',
      },
      {
        heading: 'Location and commute',
        body: 'Bordeaux is minutes from Exit 86 on I-65, with downtown Nashville about 10 minutes away, Germantown and MetroCenter about 5, and BNA airport roughly 20. The commuter math here is hard to beat — most Bordeaux residents reach downtown faster than neighbors in Franklin or Hendersonville.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Bordeaux has two markets running at once. Older single-family homes and duplexes from the 1950s-1970s still trade in the low-to-mid $300s, especially closer to Clarksville Pike. Modern tall-and-skinny new builds and detached townhomes on Brick Church Pike and Buena Vista have pushed newer construction into the high $400s to $600s. Investor activity is meaningful — we see many buyers holding one unit of a two-on-a-lot build as a primary and renting the other.',
      },
      {
        heading: 'Schools',
        body: 'Bordeaux is served by Metro Nashville Public Schools, with families also accessing MNPS choice schools and nearby magnet options. School zones here have shifted with recent boundary updates, so verify current zoning with MNPS before committing to an address.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Hartman Park, Watkins Park, and the Cumberland River greenway system all connect through this part of North Nashville. Bells Bend and Beaman Park are a short drive northwest for hiking and paddling, and downtown attractions are always close enough to feel spontaneous rather than planned.',
      },
      {
        heading: 'Why House Haven knows Bordeaux',
        body: 'We have walked Bordeaux block by block with first-time buyers, investor buyers, and families moving into new construction. We can tell you which streets are appreciating, where the infill is adding value, and where an older home is worth more to a flipper than to you.',
      },
    ],
    nearby: ['whites-creek', 'madison', 'inglewood', 'joelton'],
  },
  {
    slug: 'whites-creek',
    name: 'Whites Creek',
    county: 'Davidson',
    state: 'TN',
    zips: ['37189'],
    tier: 1,
    tagline: 'Rural Davidson County acreage, still inside the city limits.',
    distanceFromNashville: '~20 min to downtown Nashville',
    lat: 36.2798,
    lng: -86.8392,
    metaDescription:
      'Whites Creek, TN real estate and neighborhood guide. Rural Davidson County acreage, Beaman Park access, and affordable prices — minutes from Nashville.',
    content: [
      {
        heading: 'What it feels like to live in Whites Creek',
        body: 'Whites Creek is one of the last corners of Davidson County where you can still buy acreage, keep a horse, and commute to downtown Nashville in under half an hour. It is technically inside the city limits, which means Metro services apply, but the feel is decidedly rural — narrow two-lane roads, tree lines instead of fences, and long gravel driveways leading to brick ranches or custom farmhouse builds.',
      },
      {
        heading: 'Location and commute',
        body: 'Whites Creek Pike (Highway 431) is the main artery, running directly into downtown Nashville in about 20 minutes off-peak. I-24 access at Exit 42 is a few minutes north. For healthcare workers, TriStar Skyline is just south of the neighborhood; Vanderbilt is about 25 minutes downtown.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Whites Creek has a broad housing stock: older ranches on small-to-mid lots near the historic district, bigger homes on 3-10 acre parcels on Old Hickory Boulevard and Knight Road, and periodic new custom builds on larger acreage. Entry-level single-family homes run mid-$300s, with acreage properties and newer custom builds stretching into the $800s and above.',
      },
      {
        heading: 'Schools',
        body: 'Whites Creek is served by Metro Nashville Public Schools, including Whites Creek High School. Several private and charter options in nearby Madison and Goodlettsville are within reach for families who want alternatives. Confirm zones directly with MNPS before making an offer.',
      },
      {
        heading: 'Parks and outdoor life',
        body: "Beaman Park is the crown jewel — 1,700 acres of old-growth forest, hiking trails, and the Henry Hollow Loop less than five minutes from most Whites Creek homes. The neighborhood also has quick access to the Cumberland River, Marrowbone Lake, and Bells Bend Outdoor Center.",
      },
      {
        heading: 'Why House Haven knows Whites Creek',
        body: 'We have closed homes in Whites Creek on city water and on well, on septic and on sewer, and on lots big enough to need a brush hog. We know the inspection issues to watch for here and which streets hold their value best over time.',
      },
    ],
    nearby: ['joelton', 'bordeaux', 'madison'],
  },
  {
    slug: 'madison',
    name: 'Madison',
    county: 'Davidson',
    state: 'TN',
    zips: ['37115'],
    tier: 1,
    tagline: 'The North Nashville suburb everyone is watching.',
    distanceFromNashville: '~15 min to downtown Nashville',
    lat: 36.2565,
    lng: -86.7133,
    metaDescription:
      'Madison, TN homes for sale and neighborhood guide. Gallatin Pike growth, new retail, and strong commuter access to downtown Nashville from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Madison',
        body: 'Madison is the North Nashville suburb that spent a decade being overlooked and is now one of the most closely watched corners of Davidson County. Gallatin Pike — the neighborhood&rsquo;s main drag — is in the middle of a real revitalization: new restaurants, a growing music venue scene, and commercial investment that hasn&rsquo;t quite reached the East Nashville price point yet.',
      },
      {
        heading: 'Location and commute',
        body: 'Madison sits between Exit 90 and Exit 92 on I-65, about 15 minutes from downtown Nashville. Briley Parkway makes it easy to reach BNA, Opry Mills, and the Donelson/Hermitage corridor. Nashville General Hospital, TriStar Skyline, and Vanderbilt are all within 20 minutes.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Madison&rsquo;s housing stock is a mix of mid-century ranches, postwar bungalows, and newer infill construction. Entry-level homes still run in the mid-to-high $300s, which is rare for anything inside the I-440 loop equivalent. Newer builds and heavily renovated homes trend into the $500s, and small multi-family investment opportunities are active.',
      },
      {
        heading: 'Schools',
        body: 'Madison is served by Metro Nashville Public Schools with MNPS choice zone access. Private and magnet options are within reach. Buyers should confirm zoning with the district before committing to an address.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Cedar Hill Park, Peeler Park along the Cumberland, and the Stones River greenway all anchor Madison&rsquo;s outdoor life. The neighborhood also benefits from quick access to Opryland, the Cumberland River, and the broader Music Valley entertainment district.',
      },
      {
        heading: 'Why House Haven knows Madison',
        body: 'Madison is one of our most active markets for buyers who want a real neighborhood inside the city, not a subdivision pretending to be one. We have helped clients navigate older homes with foundation questions, newer infill with HOA details, and small multi-family buildings that make good first-investment properties.',
      },
    ],
    nearby: ['inglewood', 'bordeaux', 'donelson', 'whites-creek'],
  },
  {
    slug: 'pegram',
    name: 'Pegram',
    county: 'Cheatham',
    state: 'TN',
    zips: ['37143'],
    tier: 1,
    tagline: 'Tiny Harpeth River town, minutes from West Nashville.',
    distanceFromNashville: '~25 min to downtown Nashville',
    lat: 36.1045,
    lng: -87.0495,
    metaDescription:
      'Pegram, TN real estate and lifestyle guide. A small Harpeth River town in Cheatham County, 25 minutes from Nashville, with a mix of rural charm and commuter convenience.',
    content: [
      {
        heading: 'What it feels like to live in Pegram',
        body: 'Pegram is a small Cheatham County town perched along the Harpeth River, and for years it was the quiet-kept secret of Nashville commuters who wanted something more rural than Bellevue and more affordable than Ashland City. A few stoplights, a longtime general store, a volunteer fire department — and homes tucked along ridges and bottomland that feel hours from the city, even though downtown Nashville is less than half an hour away.',
      },
      {
        heading: 'Location and commute',
        body: 'Pegram sits at Exit 188 on I-40, about 25 minutes west of downtown Nashville off-peak. The Nations and West Nashville are about 15 minutes away, making it one of the shorter "rural-feel" commutes in Middle Tennessee. The small downtown hub of Kingston Springs is just a few miles west.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Pegram homes range from cottage-style single-family on small lots near town to custom homes on several acres along the river and the ridgelines. Entry-level single family typically starts in the high $300s, with acreage and custom builds reaching well above $700k. Inventory is usually thin, so buyers should be ready to move when the right home lists.',
      },
      {
        heading: 'Schools',
        body: 'Pegram is served by Cheatham County Schools. Specific zones depend on address and can change — verify with the district before committing.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'The Harpeth River defines Pegram&rsquo;s outdoor life — canoeing, kayaking, and fishing right out your back door. Harpeth River State Park is a short drive and Montgomery Bell State Park&rsquo;s trails are within 20 minutes. Many Pegram buyers are specifically chasing that outdoor access.',
      },
      {
        heading: 'Why House Haven knows Pegram',
        body: 'We have handled Pegram deals ranging from starter homes with simple inspections to ridge-top builds that needed well-and-septic scrutiny and flood-zone review. We know which parts of town flood, which do not, and how to read a Harpeth River property report.',
      },
    ],
    nearby: ['kingston-springs', 'ashland-city', 'fairview'],
  },
  {
    slug: 'kingston-springs',
    name: 'Kingston Springs',
    county: 'Cheatham',
    state: 'TN',
    zips: ['37082'],
    tier: 1,
    tagline: 'Small-town character, big-time commuter value.',
    distanceFromNashville: '~25 min to downtown Nashville',
    lat: 36.0984,
    lng: -87.1119,
    metaDescription:
      'Kingston Springs, TN homes for sale and community guide. Harpeth River access, small-town charm, and a 25-minute commute to Nashville — from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Kingston Springs',
        body: 'Kingston Springs is the Cheatham County town that sold a generation of Nashville commuters on the idea that you can have a real small-town mailing address and still be at your downtown desk in under half an hour. The downtown area is compact, the river is always nearby, and the community calendar fills up fast around the annual July 4th fireworks and summer events at the city park.',
      },
      {
        heading: 'Location and commute',
        body: 'Kingston Springs sits at Exit 188 and Exit 192 on I-40, with downtown Nashville about 25 minutes east. West Nashville, The Nations, and Sylvan Park are all about 15 minutes away. For families with one commuter and one flexible work schedule, Kingston Springs is one of the easiest compromises in Middle Tennessee.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Kingston Springs has a surprisingly wide price range: cottages on small in-town lots starting in the low $400s, subdivision homes in the $500s-$600s, and custom builds on acreage stretching past $1M. Most housing stock is single-family — condos and townhomes are rare here.',
      },
      {
        heading: 'Schools',
        body: 'Kingston Springs is served by Cheatham County Schools. Families should confirm attendance zones with the district before making a decision, and several Christian and co-op options operate nearby.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Harpeth River State Park, Montgomery Bell State Park, and the Narrows of the Harpeth are all within a short drive. Burns Park and downtown Kingston Springs host events year-round, and river access means summers revolve around tubing, kayaking, and fishing.',
      },
      {
        heading: 'Why House Haven knows Kingston Springs',
        body: 'We have represented buyers moving to Kingston Springs from Bellevue, Franklin, and out-of-state relocations. We know the subdivisions that hold their value, the older properties worth restoring, and the rural parcels where inspection details really matter.',
      },
    ],
    nearby: ['pegram', 'ashland-city', 'fairview', 'burns'],
  },
  {
    slug: 'white-house',
    name: 'White House',
    county: 'Robertson',
    state: 'TN',
    zips: ['37188'],
    tier: 1,
    tagline: 'Straddling Robertson and Sumner, growing every year.',
    distanceFromNashville: '~30 min to downtown Nashville',
    lat: 36.4672,
    lng: -86.6525,
    metaDescription:
      'White House, TN real estate and neighborhood guide. A fast-growing suburb on the Robertson-Sumner line with strong commuter access to Nashville — from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in White House',
        body: 'White House is the suburb that literally straddles two counties — part of the city sits in Robertson and part in Sumner — and that dual identity is part of the charm. It has grown steadily for the last decade as Nashville commuters pushed north on I-65 looking for more house, more yard, and a smaller-town feel than Goodlettsville or Hendersonville.',
      },
      {
        heading: 'Location and commute',
        body: 'White House sits at Exit 108 on I-65, about 30 minutes north of downtown Nashville. Commuters reach MetroCenter and Germantown in roughly 35 minutes. The north end of the city touches Portland and Orlinda; the south side is close to Goodlettsville retail.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'White House has become one of the more active new-construction markets in the I-65 north corridor, with subdivisions on both sides of the highway adding inventory in the high $300s to high $500s. Older resale homes in established neighborhoods can be found lower, and acreage parcels at the outer edges of town go higher.',
      },
      {
        heading: 'Schools',
        body: 'Because White House straddles the county line, students attend either Robertson County Schools or Sumner County Schools depending on the side of the line their home sits on. This is one of the few places in Middle Tennessee where asking which side of the street matters is a serious question — always confirm the school district assignment before you buy.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Municipal Park and the White House Greenway anchor outdoor life in town. Drakes Creek, Cross Plains, and the surrounding rural Robertson County countryside provide quick access to state-park-quality outdoor experiences for weekend trips.',
      },
      {
        heading: 'Why House Haven knows White House',
        body: 'We have handled both Robertson-side and Sumner-side closings in White House and can talk you through the school-district math, which subdivisions have active HOAs, and which builders have been delivering the best product.',
      },
    ],
    nearby: ['springfield', 'greenbrier', 'coopertown'],
  },
  {
    slug: 'coopertown',
    name: 'Coopertown',
    county: 'Robertson',
    state: 'TN',
    zips: ['37047'],
    tier: 1,
    tagline: 'Small and rural, big on acreage.',
    distanceFromNashville: '~30 min to downtown Nashville',
    lat: 36.3931,
    lng: -86.9525,
    metaDescription:
      'Coopertown, TN homes and real estate guide. A small rural Robertson County town with acreage, privacy, and easy I-24 access — from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Coopertown',
        body: 'Coopertown is the Robertson County town you drive through if you take Highway 49 from Springfield to Ashland City — and that is part of its appeal. Small, rural, and thoroughly uncrowded, it attracts buyers who want land, privacy, and a mailing address that does not show up on most Nashville relocation guides.',
      },
      {
        heading: 'Location and commute',
        body: 'Coopertown sits between I-24 (Exit 24) and I-65 (Exit 108), giving it flexible access in either direction. Downtown Nashville is about 30 minutes on a good day; Ascension Saint Thomas Midtown and Vanderbilt are within 30-35 minutes.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Coopertown&rsquo;s housing stock is dominated by single-family homes on larger lots, with plenty of options for buyers who want 2 to 10 acres. Entry-level homes start in the low $300s, with acreage properties and newer custom builds stretching into the $600s and beyond.',
      },
      {
        heading: 'Schools',
        body: 'Coopertown is served by Robertson County Schools. Zones can change — confirm current attendance zones with the district.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Coopertown itself is small, but residents quickly access Port Royal State Park, Dunbar Cave State Park in Clarksville, and the Cumberland River. Most weekends in Coopertown revolve around being outside, not being in traffic.',
      },
      {
        heading: 'Why House Haven knows Coopertown',
        body: 'We have closed rural Robertson County homes with every kind of quirk — septic systems, private wells, shared driveways, agricultural-use tax transitions. Coopertown is exactly the kind of market where having an agent who has seen those deals before pays for itself.',
      },
    ],
    nearby: ['springfield', 'greenbrier', 'white-house'],
  },
  {
    slug: 'dickson',
    name: 'Dickson',
    county: 'Dickson',
    state: 'TN',
    zips: ['37055'],
    tier: 1,
    tagline: 'Big enough to have everything, small enough to know your neighbors.',
    distanceFromNashville: '~45 min to downtown Nashville',
    lat: 36.0770,
    lng: -87.3878,
    metaDescription:
      'Dickson, TN homes and community guide. A growing Middle Tennessee city 45 minutes from Nashville with affordable prices and strong local amenities — from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Dickson',
        body: 'Dickson is the largest city in Dickson County and one of the more complete small cities in Middle Tennessee — hospital, retail, restaurants, parks, and neighborhoods for every budget. It sits far enough west to feel distinctly separate from Nashville, but close enough that a one-way commute is still a real option for households who need it.',
      },
      {
        heading: 'Location and commute',
        body: 'Dickson sits at Exit 172 on I-40, about 45 minutes west of downtown Nashville in off-peak traffic. TriStar Horizon Medical Center is right in town, and many Dickson residents do not commute at all. For those who do, The Nations and West Nashville are typically a 35-minute drive.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Dickson offers one of the widest price ranges in the region: entry-level single-family homes in the $200s, modern subdivisions in the $300s and $400s, and custom-built homes on acreage reaching higher. The price-per-square-foot value is hard to match inside Metro Nashville.',
      },
      {
        heading: 'Schools',
        body: 'Dickson is served by Dickson County Schools. Zones should be confirmed with the district directly, and several private and church-based options operate in the area.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Dickson&rsquo;s city park system is robust, and Montgomery Bell State Park — one of the best state parks in Middle Tennessee — is just minutes east of town with trails, cabins, a lake, and a golf course.',
      },
      {
        heading: 'Why House Haven knows Dickson',
        body: 'We have helped clients who were priced out of Williamson County find more home in Dickson than they ever expected, and we have walked Dickson sellers through listings that went under contract in days. Our local knowledge covers both the in-town neighborhoods and the outlying acreage parcels.',
      },
    ],
    nearby: ['burns', 'charlotte', 'fairview'],
  },
  {
    slug: 'burns',
    name: 'Burns',
    county: 'Dickson',
    state: 'TN',
    zips: ['37029'],
    tier: 1,
    tagline: 'Rural Dickson County, surrounded by state park land.',
    distanceFromNashville: '~40 min to downtown Nashville',
    lat: 36.0467,
    lng: -87.3083,
    metaDescription:
      'Burns, TN real estate and neighborhood guide. A small rural Dickson County community bordering Montgomery Bell State Park, close to Nashville — from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Burns',
        body: 'Burns is a small rural community tucked against Montgomery Bell State Park — and that proximity defines daily life there. The town itself is quiet, the roads narrow and wooded, and most properties feel more like weekend retreats than suburban commutes. For buyers who prioritize land, privacy, and outdoor access, Burns is a genuine under-the-radar option.',
      },
      {
        heading: 'Location and commute',
        body: 'Burns sits along Highway 96 just off I-40, with downtown Nashville about 40 minutes east. White Bluff, Dickson, and Fairview are all close neighbors. Commuters who work downtown a few days a week tend to make Burns work better than a daily grind.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Burns is dominated by single-family homes on larger lots and acreage parcels. Entry-level prices start in the mid $300s, and acreage properties with newer builds can stretch well above $700k depending on land and finishes.',
      },
      {
        heading: 'Schools',
        body: 'Burns is served by Dickson County Schools. Buyers should verify current attendance zones with the district.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Montgomery Bell State Park is the headliner — nearly 4,000 acres of trails, lakes, and cabins directly adjacent to Burns. Harpeth River access and Narrows of the Harpeth are a short drive northeast.',
      },
      {
        heading: 'Why House Haven knows Burns',
        body: 'Rural Dickson County real estate lives and dies on inspections: wells, septic, road maintenance agreements, and easements. We have closed enough deals out here to know what to look for and what to walk away from.',
      },
    ],
    nearby: ['dickson', 'charlotte', 'kingston-springs'],
  },
  {
    slug: 'charlotte',
    name: 'Charlotte',
    county: 'Dickson',
    state: 'TN',
    zips: ['37036'],
    tier: 1,
    tagline: 'Dickson County&rsquo;s historic seat, quiet and affordable.',
    distanceFromNashville: '~50 min to downtown Nashville',
    lat: 36.1789,
    lng: -87.3411,
    metaDescription:
      'Charlotte, TN real estate and community guide. The historic seat of Dickson County with affordable homes and small-town character — from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Charlotte',
        body: 'Charlotte is the original county seat of Dickson County — older than much of Middle Tennessee — and its historic courthouse square still anchors the town. Life here runs on a slower clock than the Nashville metro. Neighbors know each other. Bigger shopping happens a short drive east in Dickson proper.',
      },
      {
        heading: 'Location and commute',
        body: 'Charlotte is about 10 minutes north of Dickson off Highway 48. Downtown Nashville is roughly 50 minutes away, which makes Charlotte less of a daily-commuter option and more of a home base for remote workers, local employees, and retirees.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Charlotte has a mix of historic homes near the square, mid-century ranches, and acreage parcels in the surrounding countryside. Entry-level homes can still be found in the $200s, with newer builds in the $300s and $400s and larger acreage properties going higher.',
      },
      {
        heading: 'Schools',
        body: 'Charlotte is served by Dickson County Schools. Confirm attendance zones with the district before making a decision.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'The surrounding Dickson County countryside offers access to Montgomery Bell State Park, the Harpeth River, and miles of rural riding and hiking. Downtown Charlotte itself is walkable in the best small-town sense.',
      },
      {
        heading: 'Why House Haven knows Charlotte',
        body: 'Charlotte is the kind of market where patience and local knowledge win. We help buyers evaluate older homes honestly — what is charming character versus what is a major renovation project — and price sellers so their home sells in a reasonable window rather than sitting for months.',
      },
    ],
    nearby: ['dickson', 'burns'],
  },
  {
    slug: 'fairview',
    name: 'Fairview',
    county: 'Williamson',
    state: 'TN',
    zips: ['37062'],
    tier: 1,
    tagline: 'Williamson County, minus the Franklin price tag.',
    distanceFromNashville: '~35 min to downtown Nashville',
    lat: 35.9822,
    lng: -87.1306,
    metaDescription:
      'Fairview, TN real estate and community guide. Western Williamson County with strong schools, forest trails, and real value compared to Franklin and Brentwood.',
    content: [
      {
        heading: 'What it feels like to live in Fairview',
        body: 'Fairview is the western edge of Williamson County — and for buyers who love the idea of Williamson County schools but not the price tag of Franklin or Brentwood, it is often the answer. Bowie Nature Park sits in the middle of town, giving Fairview an outdoor-first character that is unusual for suburban Tennessee. The downtown area is small and functional; most new growth is happening in subdivisions along Highway 100.',
      },
      {
        heading: 'Location and commute',
        body: 'Fairview is reached via Highway 100 or I-840. Downtown Nashville is about 35 minutes east via 100, and Bellevue is about 20 minutes. Franklin is a 25-minute drive for buyers who want to keep shopping and dining options close.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Fairview offers a range from older farmhouse-style homes on several acres to newer subdivision builds. Entry-level single-family starts in the high $400s, with newer subdivisions running into the $600s and $700s and larger acreage properties reaching $1M+.',
      },
      {
        heading: 'Schools',
        body: 'Fairview is served by Williamson County Schools, consistently rated among the strongest public districts in Tennessee. Attendance zones can shift as new schools come online — always confirm zones with the district before committing.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Bowie Nature Park is the headliner — 722 acres of trails, fishing lakes, and nature programs right in the middle of town. Montgomery Bell State Park and the Natchez Trace Parkway are both within a 20-minute drive.',
      },
      {
        heading: 'Why House Haven knows Fairview',
        body: 'We help Williamson County buyers regularly compare Fairview against Franklin, Thompsons Station, and Bellevue. Each of those markets has different commute and price math, and we can walk you through the tradeoffs with real closed-deal context.',
      },
    ],
    nearby: ['thompsons-station', 'kingston-springs', 'burns'],
  },
  {
    slug: 'watertown',
    name: 'Watertown',
    county: 'Wilson',
    state: 'TN',
    zips: ['37184'],
    tier: 1,
    tagline: 'The small Wilson County town with a postcard-perfect square.',
    distanceFromNashville: '~45 min to downtown Nashville',
    lat: 36.0972,
    lng: -86.1361,
    metaDescription:
      'Watertown, TN real estate and community guide. A historic Wilson County town with a classic downtown square and affordable homes — from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Watertown',
        body: 'Watertown is the Wilson County town people rediscover every time they drive its historic square. Antique shops, a restored train depot, and a town-wide calendar of festivals give Watertown a character that bigger Middle Tennessee suburbs simply cannot replicate. Life here moves at a pace that feels intentional rather than slow.',
      },
      {
        heading: 'Location and commute',
        body: 'Watertown sits along I-40 at Exit 232, about 45 minutes east of downtown Nashville. Lebanon is about 15 minutes west, and Mount Juliet is 25 minutes closer to Nashville for buyers who commute a few days a week.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Watertown has a mix of historic homes near the square, newer subdivision builds, and rural acreage properties on the surrounding county roads. Entry-level homes start in the high $200s to low $300s, with newer construction in the $400s and acreage properties going higher.',
      },
      {
        heading: 'Schools',
        body: 'Watertown is served by Wilson County Schools, including the Watertown High School campus right in town. Buyers should verify zones with the district.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Watertown&rsquo;s square is the social center, but Cedars of Lebanon State Park is a short drive away and offers hiking, camping, and a spring-fed pool. The town hosts regular festivals and the Tennessee Central Railway Museum&rsquo;s excursion trains.',
      },
      {
        heading: 'Why House Haven knows Watertown',
        body: 'Wilson County real estate moves on relationships and market timing. We know which Watertown streets hold the best resale value, which subdivisions are well-run, and where a rural acreage property is really worth the extra commute.',
      },
    ],
    nearby: ['lebanon'],
  },
  {
    slug: 'lebanon',
    name: 'Lebanon',
    county: 'Wilson',
    state: 'TN',
    zips: ['37087'],
    tier: 1,
    tagline: 'Wilson County&rsquo;s growth engine on the I-40 corridor.',
    distanceFromNashville: '~35 min to downtown Nashville',
    lat: 36.2081,
    lng: -86.2911,
    metaDescription:
      'Lebanon, TN real estate and market guide. A fast-growing Wilson County city on the I-40 corridor with strong commuter access to Nashville — from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Lebanon',
        body: 'Lebanon is the Wilson County seat and one of the most active growth markets in Middle Tennessee. Historic downtown blocks sit next to modern retail on South Hartmann, and the neighborhoods around them range from century-old craftsman homes to brand-new subdivisions. Cumberland University anchors the education scene and adds a real college-town dimension to daily life.',
      },
      {
        heading: 'Location and commute',
        body: 'Lebanon sits on I-40 at Exit 238, about 35 minutes east of downtown Nashville. Mount Juliet is 15 minutes west, and BNA airport is about 25 minutes away. Many Lebanon residents work locally — Tractor Supply&rsquo;s headquarters and Cumberland University are both major employers.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Lebanon has one of the widest housing ranges in Wilson County: historic homes near the square, mid-century ranches, active new construction subdivisions along Highway 109, and acreage properties in the outlying countryside. Entry-level single family starts in the $300s, with newer subdivisions in the $400s and $500s.',
      },
      {
        heading: 'Schools',
        body: 'Lebanon is served by Lebanon Special School District (K-8) and Wilson County Schools (9-12). This split is unusual for the area and important to understand before you buy — verify zones for your specific address.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Cedars of Lebanon State Park offers over 9,000 acres of hiking, camping, and a spring-fed pool just south of town. Don Fox Park and Timberlake Nature Park handle everyday outdoor needs inside the city.',
      },
      {
        heading: 'Why House Haven knows Lebanon',
        body: 'Lebanon closings often hinge on the same questions: which side of town, which school district, and how to price against fast-moving new construction inventory. We help buyers and sellers navigate all three with real comparative data.',
      },
    ],
    nearby: ['watertown'],
  },
  {
    slug: 'inglewood',
    name: 'Inglewood',
    county: 'Davidson',
    state: 'TN',
    zips: ['37216'],
    tier: 1,
    tagline: 'East Nashville&rsquo;s quieter, more affordable neighbor.',
    distanceFromNashville: '~10 min to downtown Nashville',
    lat: 36.2146,
    lng: -86.7275,
    metaDescription:
      'Inglewood, TN (37216) real estate and neighborhood guide. East Nashville&rsquo;s more affordable neighbor, with character and strong commuter access — from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Inglewood',
        body: 'Inglewood is East Nashville&rsquo;s quieter, more residential neighbor. It has the same mid-century brick cottages and bungalows, many of the same tree-lined streets, and a slower vibe that appeals to buyers who love the East Nashville character but want more yard, less bar noise, and a better price per square foot. Riverside Village anchors the walkable part of the neighborhood.',
      },
      {
        heading: 'Location and commute',
        body: 'Inglewood is minutes from Briley Parkway and I-65, with downtown Nashville about 10 minutes away. BNA airport is roughly 15 minutes. For commuters, the combination of proximity and lower entry prices is one of the strongest value plays inside Davidson County.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Inglewood&rsquo;s housing stock is dominated by brick cottages, ranches, and bungalows from the 1940s-1960s, many sitting on generous lots. Entry-level homes run in the mid-to-high $400s, with renovated properties and infill new construction in the $600s and above. Compared to Five Points or Lockeland Springs, Inglewood still offers meaningful savings.',
      },
      {
        heading: 'Schools',
        body: 'Inglewood is served by Metro Nashville Public Schools with MNPS choice access. Confirm current zones directly with the district before committing.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Shelby Park, Shelby Bottoms Greenway, and the Cumberland River are all within minutes. Riverside Village anchors a small but growing walkable commercial strip with coffee, restaurants, and independent shops.',
      },
      {
        heading: 'Why House Haven knows Inglewood',
        body: 'Inglewood closings require knowing the foundations, the lot grading, and which streets are seeing the best appreciation. We have closed enough homes here to tell you exactly which questions to ask at an inspection.',
      },
    ],
    nearby: ['madison', 'donelson', 'bordeaux'],
  },
  {
    slug: 'donelson',
    name: 'Donelson',
    county: 'Davidson',
    state: 'TN',
    zips: ['37214'],
    tier: 1,
    tagline: 'The Davidson County neighborhood closest to BNA.',
    distanceFromNashville: '~15 min to downtown Nashville',
    lat: 36.1722,
    lng: -86.6706,
    metaDescription:
      'Donelson, TN (37214) homes for sale and neighborhood guide. Davidson County living next to BNA airport and Percy Priest Lake — from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Donelson',
        body: 'Donelson is the Davidson County neighborhood that spent decades being defined by its proximity to the airport and is now being redefined by new coffee shops, townhome development, and the transformation of the old Donelson Plaza into mixed-use space. It feels established but is visibly evolving, which is part of why both buyers and investors have been paying closer attention.',
      },
      {
        heading: 'Location and commute',
        body: 'Donelson sits on the east side of Davidson County along I-40, with downtown Nashville about 15 minutes west. BNA airport is essentially next door, which matters enormously for frequent travelers. Percy Priest Lake is a five-minute drive south.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Donelson has a mix of mid-century brick ranches, postwar bungalows, new infill single-family homes, and a growing number of detached townhomes. Entry-level homes run in the mid $400s; renovated and new construction typically sit in the $500s-$700s.',
      },
      {
        heading: 'Schools',
        body: 'Donelson is served by Metro Nashville Public Schools including Donelson Christian Academy as a private option. Verify public school zones with MNPS.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Two Rivers Park, Percy Priest Lake, Hermitage Golf Course, and the Stones River Greenway are all within minutes. For outdoor-first households who also need a quick commute, Donelson is one of the best setups in the city.',
      },
      {
        heading: 'Why House Haven knows Donelson',
        body: 'We have helped Donelson buyers understand flight-path noise, Percy Priest Lake flood considerations, and which infill townhomes have been delivering real value versus rushed product. That local context is the difference between a good purchase and a regretted one.',
      },
    ],
    nearby: ['inglewood', 'madison'],
  },

  // ─── TIER 2 ──────────────────────────────────────────────

  {
    slug: 'hendersonville',
    name: 'Hendersonville',
    county: 'Sumner',
    state: 'TN',
    zips: ['37075'],
    tier: 2,
    tagline: 'Lake life on Old Hickory, minutes from Nashville.',
    distanceFromNashville: '~25 min to downtown Nashville',
    lat: 36.3048,
    lng: -86.6200,
    metaDescription:
      'Hendersonville, TN homes for sale and neighborhood guide. Old Hickory Lake living in Sumner County — schools, parks, and market data from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Hendersonville',
        body: 'Hendersonville wraps around Old Hickory Lake in a way that gives the whole city a resort-adjacent vibe without the resort pricing. Johnny Cash and June Carter lived here for decades, and that combination of celebrity legacy and genuine small-town warmth still defines the place. Streets of Indian Lake gives you suburban retail without driving to Cool Springs, and the lake access — from marinas to public parks — is the quality-of-life differentiator families mention most.',
      },
      {
        heading: 'Location and commute',
        body: 'Hendersonville sits on the north side of Old Hickory Lake along Vietnam Veterans Boulevard and Route 31E. Downtown Nashville is about 25 minutes via I-65 or Gallatin Pike. The commute into Rivergate, Goodlettsville, and Madison is even shorter.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'You will find everything from 1970s lakefront ranches to new master-planned subdivisions with pools and clubhouses. Entry-level homes start in the mid $300s; lakefront and luxury properties push well into the $800s and beyond. The market rewards lake proximity heavily.',
      },
      {
        heading: 'Schools',
        body: 'Hendersonville is served by Sumner County Schools, one of the higher-performing districts in Middle Tennessee. Hendersonville High School, Station Camp High, and Pope John Paul II High School (private) are all within the area.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Old Hickory Lake is the headline — boating, fishing, paddleboarding, and sunset watching are everyday activities here. Drakes Creek Park, Sanders Ferry Park, and the Hendersonville Greenway add land-based options.',
      },
      {
        heading: 'Why House Haven knows Hendersonville',
        body: 'We help Hendersonville buyers navigate flood zone considerations on lakefront lots, HOA structures in the newer subdivisions, and the meaningful pricing differences between lake-view, lake-access, and lakefront properties. Those distinctions can mean six figures.',
      },
    ],
    nearby: ['gallatin', 'goodlettsville', 'madison'],
  },
  {
    slug: 'gallatin',
    name: 'Gallatin',
    county: 'Sumner',
    state: 'TN',
    zips: ['37066'],
    tier: 2,
    tagline: 'Sumner County\'s growing seat with small-town roots.',
    distanceFromNashville: '~30 min to downtown Nashville',
    lat: 36.3887,
    lng: -86.4466,
    metaDescription:
      'Gallatin, TN homes for sale and community guide. Sumner County seat with a revitalized square, Old Hickory Lake access, and strong schools — from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Gallatin',
        body: 'Gallatin is Sumner County\'s county seat and it feels like a town that knows it is growing but has not abandoned its identity. The downtown square has been revitalized with local restaurants and shops. Volunteer State Community College anchors the west side. There is a tangible sense of community investment here — new parks, upgraded infrastructure, and steady residential development without the runaway sprawl some neighboring towns have experienced.',
      },
      {
        heading: 'Location and commute',
        body: 'Gallatin sits at the intersection of Route 31E and Route 109, about 30 minutes northeast of downtown Nashville. The drive into Hendersonville takes about 10 minutes, and the Gallatin Pike corridor connects directly into East Nashville.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Gallatin offers a wide range from older in-town bungalows near the square to new subdivisions with modern floorplans. Entry-level starts in the mid $200s to low $300s, making it one of the most accessible markets in the Nashville metro for first-time buyers.',
      },
      {
        heading: 'Schools',
        body: 'Sumner County Schools serves Gallatin, with Gallatin High School and Station Camp High School as the primary public options. Vol State Community College provides local higher education.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Lock 4 Park on the Cumberland River, Triple Creek Park, and Old Hickory Lake access make outdoor recreation a daily option. The Gallatin Civic Center includes sports facilities and community programming.',
      },
      {
        heading: 'Why House Haven knows Gallatin',
        body: 'We have guided buyers into Gallatin who were priced out of Hendersonville or wanted more land for the dollar. We understand which neighborhoods are appreciating fastest and where new development is headed based on permit activity.',
      },
    ],
    nearby: ['hendersonville', 'portland', 'white-house'],
  },
  {
    slug: 'goodlettsville',
    name: 'Goodlettsville',
    county: 'Davidson/Sumner',
    state: 'TN',
    zips: ['37072'],
    tier: 2,
    tagline: 'Two-county value play on Nashville\'s north side.',
    distanceFromNashville: '~20 min to downtown Nashville',
    lat: 36.3231,
    lng: -86.7133,
    metaDescription:
      'Goodlettsville, TN homes for sale — straddling Davidson and Sumner counties with lower taxes and quick Nashville access. Community guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Goodlettsville',
        body: 'Goodlettsville straddles the Davidson-Sumner county line, which creates an unusual dynamic: some addresses get Sumner County schools while being minutes from Nashville amenities. The Rivergate area anchors commercial activity, and the Goodlettsville Antique Mall district has a quiet charm. It is not flashy, but households who prioritize value, highway access, and pragmatic living gravitate here.',
      },
      {
        heading: 'Location and commute',
        body: 'Goodlettsville sits along I-65 about 20 minutes north of downtown Nashville. Rivergate Mall and its surrounding retail corridor make daily errands easy. Hendersonville and Madison are both a short drive away.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'A mix of 1960s-80s ranch homes, townhomes near Rivergate, and newer subdivision builds. Homes typically start in the low $300s, making Goodlettsville one of the more affordable options this close to Nashville.',
      },
      {
        heading: 'Schools',
        body: 'Depending on which side of the county line a home sits, students attend either Metro Nashville Public Schools or Sumner County Schools. This is critical to verify before purchasing.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Moss Wright Park is the centerpiece — 125 acres with sports fields, playgrounds, a fishing lake, and walking trails. The Mansker Creek area offers greenway connections.',
      },
      {
        heading: 'Why House Haven knows Goodlettsville',
        body: 'The county-line split in Goodlettsville affects property tax rates, school districts, and even garbage pickup. We help buyers understand exactly which jurisdiction their home falls in and what that means for their monthly costs.',
      },
    ],
    nearby: ['hendersonville', 'madison', 'whites-creek'],
  },
  {
    slug: 'portland',
    name: 'Portland',
    county: 'Sumner',
    state: 'TN',
    zips: ['37148'],
    tier: 2,
    tagline: 'Strawberry-town charm at Nashville\'s northern edge.',
    distanceFromNashville: '~45 min to downtown Nashville',
    lat: 36.5817,
    lng: -86.5164,
    metaDescription:
      'Portland, TN homes for sale — Sumner County\'s strawberry capital with affordable land and small-town living. Community guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Portland',
        body: 'Portland is best known for the Middle Tennessee Strawberry Festival, but day-to-day it is a small agricultural town that has started attracting Nashville commuters who want acreage and affordability. The pace is slower here, the lots are bigger, and the cost per square foot is meaningfully lower than anything inside the Nashville urban core.',
      },
      {
        heading: 'Location and commute',
        body: 'Portland sits about 45 minutes north of Nashville along Route 109 and Route 52. Gallatin is about 20 minutes south. The commute is real, but remote workers and hybrid employees have been making it work.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Homes in Portland range from farmhouses on multi-acre lots to newer subdivision builds. The market is one of the most affordable in the Nashville metro, with many homes available in the $200s and $300s.',
      },
      {
        heading: 'Schools',
        body: 'Portland is served by Sumner County Schools, including Portland High School. The school system has invested in updated facilities in recent years.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Richland Park provides sports fields and community gathering space. The surrounding countryside offers horseback riding, farm life, and open-sky living that is increasingly hard to find this close to a major metro.',
      },
      {
        heading: 'Why House Haven knows Portland',
        body: 'We help buyers in Portland understand well and septic considerations on rural lots, the trajectory of development coming north from Gallatin, and how to evaluate land purchases for future value.',
      },
    ],
    nearby: ['gallatin', 'white-house', 'springfield'],
  },
  {
    slug: 'hermitage',
    name: 'Hermitage',
    county: 'Davidson',
    state: 'TN',
    zips: ['37076'],
    tier: 2,
    tagline: 'Andrew Jackson\'s backyard, now Nashville\'s east-side value play.',
    distanceFromNashville: '~20 min to downtown Nashville',
    lat: 36.1721,
    lng: -86.5856,
    metaDescription:
      'Hermitage, TN homes for sale and neighborhood guide. Davidson County living near Percy Priest Lake and The Hermitage — market data from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Hermitage',
        body: 'Hermitage is the Davidson County community that quietly offers some of the best price-per-square-foot value east of Nashville. Andrew Jackson\'s Hermitage estate is the historical anchor, but daily life revolves around Percy Priest Lake access, the Lebanon Pike commercial corridor, and neighborhoods that range from established brick ranches to new construction infill.',
      },
      {
        heading: 'Location and commute',
        body: 'Hermitage sits east of Nashville along I-40 and Lebanon Pike. Downtown is about 20 minutes west; Mt. Juliet and Lebanon are a short drive east. Percy Priest Lake runs along the southern edge.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'The housing mix includes mid-century ranches, 1990s subdivisions, and new construction townhomes. Entry-level homes start in the low $300s, with larger family homes in the $400s-$500s.',
      },
      {
        heading: 'Schools',
        body: 'Hermitage is served by Metro Nashville Public Schools, including McGavock High School. Several private options are within driving distance.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Percy Priest Lake, Long Hunter State Park, and the Stones River Greenway are all accessible from Hermitage. This is a strong area for fishing, kayaking, and trail running.',
      },
      {
        heading: 'Why House Haven knows Hermitage',
        body: 'We help Hermitage buyers identify which neighborhoods are seeing the strongest appreciation, navigate the flood zone considerations near Percy Priest, and understand the difference between addressed Hermitage and adjacent Mt. Juliet for school purposes.',
      },
    ],
    nearby: ['donelson', 'mt-juliet', 'antioch'],
  },
  {
    slug: 'antioch',
    name: 'Antioch',
    county: 'Davidson',
    state: 'TN',
    zips: ['37013'],
    tier: 2,
    tagline: 'Nashville\'s most diverse and undervalued neighborhood.',
    distanceFromNashville: '~20 min to downtown Nashville',
    lat: 36.0590,
    lng: -86.6722,
    metaDescription:
      'Antioch, TN homes for sale — southeast Davidson County with diverse dining, affordable homes, and rapid development. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Antioch',
        body: 'Antioch is southeast Davidson County\'s most dynamic neighborhood. The international dining scene along Nolensville Pike is genuinely world-class — Korean, Kurdish, Mexican, Somali, and Vietnamese food within a single mile. Antioch has been one of Nashville\'s most affordable areas for years, and investment is now following: new mixed-use development, greenway extensions, and commercial upgrades are reshaping perceptions.',
      },
      {
        heading: 'Location and commute',
        body: 'Antioch is centered around the I-24 and Harding Place interchange, about 20 minutes from downtown Nashville. Nolensville Pike connects north into the city, and Murfreesboro Pike runs east toward Smyrna and La Vergne.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Antioch offers some of the lowest entry points in Davidson County — starter homes in the mid $200s to low $300s. The range extends through the $400s for renovated and new-construction properties.',
      },
      {
        heading: 'Schools',
        body: 'Antioch is served by Metro Nashville Public Schools, including Antioch High School and Cane Ridge High School. Verify specific school zones as they have shifted with redistricting.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Mill Creek Greenway, Antioch Community Center, and nearby Percy Priest Lake provide outdoor access. The ongoing investment in greenway connectivity is expanding options year over year.',
      },
      {
        heading: 'Why House Haven knows Antioch',
        body: 'We help buyers see past outdated perceptions of Antioch and evaluate specific pockets where appreciation is outpacing the metro average. The neighborhood-by-neighborhood variation in Antioch is wider than almost anywhere else in Nashville.',
      },
    ],
    nearby: ['hermitage', 'la-vergne', 'donelson'],
  },
  {
    slug: 'bellevue',
    name: 'Bellevue',
    county: 'Davidson',
    state: 'TN',
    zips: ['37221'],
    tier: 2,
    tagline: 'West Nashville\'s neighborhood anchor — parks, schools, and Harpeth River.',
    distanceFromNashville: '~20 min to downtown Nashville',
    lat: 36.0767,
    lng: -86.9178,
    metaDescription:
      'Bellevue, TN homes for sale — west Nashville living with Harpeth River access, strong retail, and established neighborhoods. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Bellevue',
        body: 'Bellevue is the west Nashville community that families discover when they want Davidson County schools, a suburban feel, and a reasonable commute. The One Bellevue Place development and surrounding retail make daily life convenient. The Harpeth River winds through, giving the area a green, tree-covered character that feels more removed from the city than the 20-minute drive would suggest.',
      },
      {
        heading: 'Location and commute',
        body: 'Bellevue sits along I-40 west of Nashville, with Highway 70 South as the main commercial corridor. Downtown is about 20 minutes east. Pegram and Kingston Springs are a short drive west.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Bellevue features established 1980s-2000s subdivisions, some new construction, and pockets of larger lots near the Harpeth River. Prices range from the low $300s for starter homes to $600s+ for larger properties.',
      },
      {
        heading: 'Schools',
        body: 'Bellevue is served by Metro Nashville Public Schools, including Hillwood High School cluster. Bellevue Middle School and Harpeth Valley Elementary are well-regarded within the MNPS system.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'The Harpeth River is the recreational anchor — kayaking and float trips are a Bellevue way of life. Red Caboose Park, Warner Parks (Edwin and Percy), and the planned Bellevue Greenway additions extend the outdoor options.',
      },
      {
        heading: 'Why House Haven knows Bellevue',
        body: 'We help Bellevue buyers understand which subdivisions sit in flood zones along the Harpeth, where new development is planned, and how the west Nashville corridor is evolving with mixed-use investment.',
      },
    ],
    nearby: ['pegram', 'kingston-springs', 'fairview'],
  },
  {
    slug: 'old-hickory',
    name: 'Old Hickory',
    county: 'Davidson',
    state: 'TN',
    zips: ['37138'],
    tier: 2,
    tagline: 'Historic DuPont village on Old Hickory Lake.',
    distanceFromNashville: '~20 min to downtown Nashville',
    lat: 36.2459,
    lng: -86.6494,
    metaDescription:
      'Old Hickory, TN homes for sale — historic village with lake access and character homes in Davidson County. Community guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Old Hickory',
        body: 'Old Hickory was built as a company town for the DuPont powder plant during World War I, and that origin story still shows in the walkable village layout, the uniform Craftsman-style homes, and the community-centered feel. It sits on Old Hickory Lake with genuine waterfront access. The village has become a draw for buyers who want character, lake proximity, and Davidson County proximity without paying East Nashville prices.',
      },
      {
        heading: 'Location and commute',
        body: 'Old Hickory sits on the north shore of Old Hickory Lake, east of Madison and south of Hendersonville. Downtown Nashville is about 20 minutes via I-65 or Gallatin Pike.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'The Old Hickory Village section features original Craftsman homes from the 1920s-1940s. Surrounding areas have mid-century and newer builds. Village homes start in the $200s-$300s; lakefront properties command significantly more.',
      },
      {
        heading: 'Schools',
        body: 'Old Hickory is served by Metro Nashville Public Schools. DuPont-Hadley Middle School is located within the village. Verify current zone assignments with MNPS.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Old Hickory Lake is the centerpiece — boat launches, fishing, and lakeside parks are walking distance in the village. Old Hickory Beach at the dam is a popular summer destination.',
      },
      {
        heading: 'Why House Haven knows Old Hickory',
        body: 'We help Old Hickory buyers understand the historic overlay restrictions in the village, evaluate lakefront versus lake-access pricing, and identify which renovation projects are worth the investment in these character homes.',
      },
    ],
    nearby: ['hendersonville', 'madison', 'hermitage'],
  },
  {
    slug: 'murfreesboro',
    name: 'Murfreesboro',
    county: 'Rutherford',
    state: 'TN',
    zips: ['37127', '37128', '37129', '37130'],
    tier: 2,
    tagline: 'Tennessee\'s fastest-growing city, 30 minutes from Nashville.',
    distanceFromNashville: '~35 min to downtown Nashville',
    lat: 35.8456,
    lng: -86.3903,
    metaDescription:
      'Murfreesboro, TN homes for sale — Rutherford County seat, MTSU, and one of Tennessee\'s fastest-growing cities. Market guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Murfreesboro',
        body: 'Murfreesboro has been one of the fastest-growing cities in Tennessee for over a decade, and the infrastructure has largely kept pace. The historic downtown square is walkable and active. Middle Tennessee State University brings energy and culture. The commercial corridors along Medical Center Parkway and Memorial Boulevard make Murfreesboro a self-contained city, not just a Nashville bedroom community.',
      },
      {
        heading: 'Location and commute',
        body: 'Murfreesboro sits about 35 minutes southeast of Nashville along I-24. The commute into Nashville during rush hour is the main trade-off — plan for 45-60 minutes during peak times.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Murfreesboro has a massive range — from 1950s homes near the square to brand-new master-planned communities on the outskirts. Entry-level starts in the low $300s; new construction in popular subdivisions typically ranges from $400s-$600s.',
      },
      {
        heading: 'Schools',
        body: 'Rutherford County Schools is one of the largest and strongest school systems in Tennessee. Siegel, Riverdale, Oakland, and Blackman High Schools all serve Murfreesboro families.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Stones River National Battlefield, Barfield Crescent Park (with the Wilderness Station), and the Greenway system provide extensive outdoor recreation. Percy Priest Lake is accessible from the northern edge.',
      },
      {
        heading: 'Why House Haven knows Murfreesboro',
        body: 'We help Nashville-area buyers evaluate whether the Murfreesboro commute trade-off works for their lifestyle, which of the rapidly expanding subdivisions are delivering real value, and where the next wave of commercial development is headed.',
      },
    ],
    nearby: ['smyrna', 'la-vergne'],
  },
  {
    slug: 'smyrna',
    name: 'Smyrna',
    county: 'Rutherford',
    state: 'TN',
    zips: ['37167'],
    tier: 2,
    tagline: 'Nissan-anchored, family-forward, and halfway between Nashville and Murfreesboro.',
    distanceFromNashville: '~25 min to downtown Nashville',
    lat: 35.9828,
    lng: -86.5186,
    metaDescription:
      'Smyrna, TN homes for sale — Rutherford County community with Nissan plant, strong schools, and family neighborhoods. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Smyrna',
        body: 'Smyrna sits between Nashville and Murfreesboro and benefits from both without being defined by either. The Nissan manufacturing plant is the economic anchor and the largest employer, giving the town a stable economic base. Sam Davis Home provides historical character. The town has invested heavily in parks and recreation in recent years.',
      },
      {
        heading: 'Location and commute',
        body: 'Smyrna is along I-24 about 25 minutes from downtown Nashville. La Vergne is immediately north, Murfreesboro is 10 minutes south. The central position makes it viable for commuters in either direction.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Smyrna offers predominantly newer construction — many 2000s-2020s subdivisions with modern floorplans. Prices start in the low $300s for townhomes and range into the $500s for single-family.',
      },
      {
        heading: 'Schools',
        body: 'Rutherford County Schools serves Smyrna, including Smyrna High School and La Vergne High School for addresses near the boundary.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Sharp Springs Park, Lee Victory Recreation Park, and the Smyrna Greenway provide extensive outdoor options. Percy Priest Lake is a short drive north.',
      },
      {
        heading: 'Why House Haven knows Smyrna',
        body: 'We help Smyrna buyers identify which subdivisions offer the strongest long-term value, understand the school zone boundaries that split between Smyrna and La Vergne, and evaluate new construction options against resale.',
      },
    ],
    nearby: ['la-vergne', 'murfreesboro', 'antioch'],
  },
  {
    slug: 'la-vergne',
    name: 'La Vergne',
    county: 'Rutherford',
    state: 'TN',
    zips: ['37086'],
    tier: 2,
    tagline: 'Percy Priest Lake access at an entry-level price point.',
    distanceFromNashville: '~20 min to downtown Nashville',
    lat: 36.0156,
    lng: -86.5819,
    metaDescription:
      'La Vergne, TN homes for sale — Rutherford County\'s most affordable entry to the Nashville metro with lake access. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in La Vergne',
        body: 'La Vergne is the Rutherford County community closest to Nashville, and it offers one of the most accessible entry points into the metro housing market. Percy Priest Lake runs along its northern border. The town has been investing in its own identity with downtown improvements and park upgrades rather than accepting the bedroom-community label.',
      },
      {
        heading: 'Location and commute',
        body: 'La Vergne sits at the I-24 and I-840 intersection, about 20 minutes from downtown Nashville. This position makes it central to Nashville, Murfreesboro, and Smyrna employment centers.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'La Vergne is one of the most affordable communities in the Nashville metro, with homes starting in the mid $200s. Most inventory is 1990s-2010s subdivision builds, with some new construction pushing into the $400s.',
      },
      {
        heading: 'Schools',
        body: 'La Vergne is served by Rutherford County Schools, with La Vergne High School as the primary public option.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Percy Priest Lake access and Veterans Memorial Park are the main outdoor draws. The Stones River Greenway extension is planned to improve connectivity.',
      },
      {
        heading: 'Why House Haven knows La Vergne',
        body: 'We guide first-time buyers into La Vergne who need to stay under $300k and want to build equity in a market that is appreciating as Nashville pushes outward. Understanding which subdivisions are positioned for the strongest growth is what we bring to the conversation.',
      },
    ],
    nearby: ['smyrna', 'antioch', 'murfreesboro'],
  },
  {
    slug: 'franklin',
    name: 'Franklin',
    county: 'Williamson',
    state: 'TN',
    zips: ['37064', '37067', '37069'],
    tier: 2,
    tagline: 'Historic charm meets Williamson County polish.',
    distanceFromNashville: '~25 min to downtown Nashville',
    lat: 35.9251,
    lng: -86.8689,
    metaDescription:
      'Franklin, TN homes for sale — Williamson County\'s crown jewel with a historic Main Street, top schools, and luxury living. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Franklin',
        body: 'Franklin consistently ranks among the best places to live in Tennessee, and the downtown Main Street is the reason most people fall in love on their first visit. The Civil War history, the independent shops and restaurants, the Pilgrimage Music Festival, and the Williamson County school system create a package that is hard to match. Cool Springs adds major retail and corporate office space to the south.',
      },
      {
        heading: 'Location and commute',
        body: 'Franklin is about 25 minutes south of Nashville along I-65. Cool Springs is the commercial hub. The commute to downtown Nashville is manageable but I-65 traffic during peak hours is the main friction point.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Franklin\'s market starts higher than most Nashville suburbs. Townhomes and condos begin in the $400s; single-family homes in established neighborhoods range from $500s to well over $1M. Historic homes near downtown command premium pricing.',
      },
      {
        heading: 'Schools',
        body: 'Williamson County Schools is consistently ranked among the top school districts in Tennessee. Franklin High School, Centennial High School, and Independence High School are all highly regarded.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Pinkerton Park, the Harpeth River, and the Franklin Greenway system provide extensive outdoor access. Eastern Flank Battlefield Park combines history with open green space.',
      },
      {
        heading: 'Why House Haven knows Franklin',
        body: 'We help Franklin buyers navigate the significant price variation between cool-springs-area subdivisions and historic-district adjacency, understand HOA structures in the larger master-planned communities, and identify value in a market where the average home price requires careful strategy.',
      },
    ],
    nearby: ['brentwood', 'thompsons-station', 'nolensville'],
  },
  {
    slug: 'brentwood',
    name: 'Brentwood',
    county: 'Williamson',
    state: 'TN',
    zips: ['37027'],
    tier: 2,
    tagline: 'Nashville\'s premier address for families and executives.',
    distanceFromNashville: '~20 min to downtown Nashville',
    lat: 36.0331,
    lng: -86.7828,
    metaDescription:
      'Brentwood, TN homes for sale — Williamson County luxury living with top-rated schools and executive neighborhoods. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Brentwood',
        body: 'Brentwood is Nashville\'s most established luxury suburb. The tree-lined streets, manicured neighborhoods, and Williamson County schools create an environment that corporate relocations and established families consistently choose. It is not trendy — it is proven. The Brentwood Library, Maryland Farms business park, and Smith Park recreation complex reflect a city that invests in quality infrastructure.',
      },
      {
        heading: 'Location and commute',
        body: 'Brentwood sits directly south of Nashville along I-65 and Old Hickory Boulevard. Downtown Nashville is about 20 minutes north. Franklin and Cool Springs are 10 minutes south.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Brentwood skews toward larger single-family homes on generous lots. The market floor is roughly $600k for smaller or older homes, with most inventory in the $800k-$1.5M range. Estate properties push well beyond $2M.',
      },
      {
        heading: 'Schools',
        body: 'Williamson County Schools serves Brentwood — Brentwood High School and Ravenwood High School are both highly ranked nationally. This is the single biggest draw for families.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Smith Park, Marcella Vivrette Smith Park (360 acres of wilderness), Crockett Park, and the Brentwood Greenway system provide excellent outdoor options within city limits.',
      },
      {
        heading: 'Why House Haven knows Brentwood',
        body: 'We help buyers navigate Brentwood\'s distinct sub-markets — from the governor\'s club area to the older-growth neighborhoods near Maryland Farms. Understanding the HOA structures, school zone boundaries between Brentwood High and Ravenwood, and where the value-per-dollar peaks is what we bring.',
      },
    ],
    nearby: ['franklin', 'nolensville', 'antioch'],
  },
  {
    slug: 'nolensville',
    name: 'Nolensville',
    county: 'Williamson',
    state: 'TN',
    zips: ['37135'],
    tier: 2,
    tagline: 'Williamson County schools with a small-town Main Street.',
    distanceFromNashville: '~25 min to downtown Nashville',
    lat: 35.9523,
    lng: -86.6694,
    metaDescription:
      'Nolensville, TN homes for sale — Williamson County living with a growing Main Street village and new-construction neighborhoods. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Nolensville',
        body: 'Nolensville is the Williamson County community that has exploded in the last decade — from a quiet crossroads town to one of the most sought-after family markets in Middle Tennessee. The historic Nolensville Road Main Street is being curated with local shops and restaurants. New master-planned subdivisions surround the town in every direction, and the Williamson County school assignment is the primary driver.',
      },
      {
        heading: 'Location and commute',
        body: 'Nolensville sits about 25 minutes southeast of Nashville along Nolensville Road. Brentwood is to the north, Murfreesboro to the southeast. The commute is manageable but Nolensville Road itself can be congested during peak hours.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Nolensville is dominated by new construction and near-new subdivisions. Townhomes start in the $400s; single-family homes range from the low $500s to $800s+ in premium communities like Bent Creek and Sherwood Green.',
      },
      {
        heading: 'Schools',
        body: 'Williamson County Schools serves Nolensville, with Nolensville High School (opened 2016) as the primary high school. The school district is the number-one reason families move here.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Mill Creek runs through the area, and Nolensville Park provides community recreation. The surrounding countryside offers a pastoral quality that newer subdivisions have worked to preserve.',
      },
      {
        heading: 'Why House Haven knows Nolensville',
        body: 'We help buyers navigate the new-construction landscape in Nolensville — which builders deliver on promises, which communities have the strongest HOA management, and where the next phases of development will shape long-term property values.',
      },
    ],
    nearby: ['brentwood', 'franklin', 'thompsons-station'],
  },
  {
    slug: 'spring-hill',
    name: 'Spring Hill',
    county: 'Williamson/Maury',
    state: 'TN',
    zips: ['37174'],
    tier: 2,
    tagline: 'Two-county growth engine south of Franklin.',
    distanceFromNashville: '~35 min to downtown Nashville',
    lat: 35.7511,
    lng: -86.9300,
    metaDescription:
      'Spring Hill, TN homes for sale — straddling Williamson and Maury counties with GM plant jobs, new construction, and rapid growth. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Spring Hill',
        body: 'Spring Hill has been one of Tennessee\'s fastest-growing cities, straddling the Williamson-Maury county line. The GM manufacturing plant is the economic anchor. The growth is visible everywhere — new subdivisions, new schools, new retail. The trade-off for the energy and affordability is that infrastructure is actively catching up.',
      },
      {
        heading: 'Location and commute',
        body: 'Spring Hill sits about 35 minutes south of Nashville along I-65 and US-31. Franklin and Cool Springs are 15 minutes north. Columbia is 15 minutes south.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Spring Hill is overwhelmingly new construction — master-planned communities with modern floorplans, community pools, and walkable amenities. Prices start in the mid $300s and range into the $600s for larger homes in premium communities.',
      },
      {
        heading: 'Schools',
        body: 'The county line is critical here: Williamson County side addresses get WCS schools, Maury County side addresses get MCPS. This single factor can mean a $50k+ difference in comparable home prices. Verify before purchasing.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Spring Hill has invested in new park development including Harvey Park, Port Royal State Park is nearby, and Saturn Parkway provides green corridors.',
      },
      {
        heading: 'Why House Haven knows Spring Hill',
        body: 'We help Spring Hill buyers navigate the Williamson/Maury county line — the school district, tax rate, and long-term appreciation differences between two homes on the same street can be significant. We also track which builders and subdivisions are delivering on quality versus cutting corners in a fast-growth market.',
      },
    ],
    nearby: ['thompsons-station', 'franklin'],
  },
  {
    slug: 'mt-juliet',
    name: 'Mt. Juliet',
    county: 'Wilson',
    state: 'TN',
    zips: ['37122'],
    tier: 2,
    tagline: 'Wilson County\'s booming suburb on the Providence corridor.',
    distanceFromNashville: '~25 min to downtown Nashville',
    lat: 36.2001,
    lng: -86.5186,
    metaDescription:
      'Mt. Juliet, TN homes for sale — Wilson County\'s fastest-growing city with Providence Marketplace, strong schools, and family neighborhoods. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Mt. Juliet',
        body: 'Mt. Juliet has transformed from a small Wilson County town into one of Nashville\'s most desirable suburbs. Providence Marketplace is the commercial anchor — a massive mixed-use development with retail, dining, and entertainment. The city calls itself "The City Between the Lakes" (Old Hickory and Percy Priest), and that geography shapes the outdoor lifestyle.',
      },
      {
        heading: 'Location and commute',
        body: 'Mt. Juliet sits along I-40 about 25 minutes east of Nashville. Hermitage is to the west, Lebanon to the east. The Providence exit has become the commercial center of Wilson County.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Mt. Juliet offers a mix of established 1990s-2000s subdivisions and new construction. Prices range from the mid $300s for townhomes to $600s+ for larger family homes in premium communities.',
      },
      {
        heading: 'Schools',
        body: 'Wilson County Schools serves Mt. Juliet — Mt. Juliet High School and West Wilson Middle School are strong performers. The school system is a major draw for families.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Charlie Daniels Park, Cedar Creek Sports Complex, and Percy Priest Lake access provide recreation. The greenway system is expanding with the city\'s growth.',
      },
      {
        heading: 'Why House Haven knows Mt. Juliet',
        body: 'We help Mt. Juliet buyers understand the difference between the Providence corridor and the older parts of town, evaluate which new subdivisions are positioned for the strongest appreciation, and navigate the Wilson County school zone boundaries.',
      },
    ],
    nearby: ['hermitage', 'lebanon'],
  },
  {
    slug: 'pleasant-view',
    name: 'Pleasant View',
    county: 'Cheatham',
    state: 'TN',
    zips: ['37146'],
    tier: 2,
    tagline: 'Rolling hills and acreage in Cheatham County.',
    distanceFromNashville: '~30 min to downtown Nashville',
    lat: 36.3917,
    lng: -87.0375,
    metaDescription:
      'Pleasant View, TN homes for sale — Cheatham County rural living with Nashville access and affordable acreage. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Pleasant View',
        body: 'Pleasant View is the Cheatham County community for buyers who want land, privacy, and a rural feel without disconnecting from Nashville entirely. The rolling hills, horse properties, and multi-acre lots define the landscape. There is no downtown to speak of — this is a residential community built around country living.',
      },
      {
        heading: 'Location and commute',
        body: 'Pleasant View sits about 30 minutes northwest of Nashville along Highway 41A. Springfield is 15 minutes north, and Joelton is nearby. Clarksville is about 30 minutes northwest.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Homes in Pleasant View tend to sit on larger lots — one to five acres is common. Prices range from the mid $300s for smaller properties to $600s+ for homes with significant acreage.',
      },
      {
        heading: 'Schools',
        body: 'Cheatham County Schools serves Pleasant View, with Pleasant View Elementary and Cheatham County Central High School as the primary options.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'The rural setting is the recreation — horseback riding, gardening, and open-sky living. Nearby Beaman Park and Sycamore Creek add structured outdoor options.',
      },
      {
        heading: 'Why House Haven knows Pleasant View',
        body: 'We help buyers evaluating Pleasant View understand well and septic requirements on rural lots, the Cheatham County property tax advantages, and how to compare acreage value between Pleasant View and neighboring communities.',
      },
    ],
    nearby: ['joelton', 'springfield', 'coopertown'],
  },
  {
    slug: 'cross-plains',
    name: 'Cross Plains',
    county: 'Robertson',
    state: 'TN',
    zips: ['37049'],
    tier: 2,
    tagline: 'Small-town Robertson County at its most authentic.',
    distanceFromNashville: '~40 min to downtown Nashville',
    lat: 36.5489,
    lng: -86.6889,
    metaDescription:
      'Cross Plains, TN homes for sale — quiet Robertson County living with affordable acreage and Nashville access. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Cross Plains',
        body: 'Cross Plains is the kind of small town where the general store still matters and everyone knows the mail carrier by name. It sits in northern Robertson County and has remained genuinely rural even as Nashville\'s growth pushes outward. Buyers come here for land, quiet, and a cost of living that feels like a different state.',
      },
      {
        heading: 'Location and commute',
        body: 'Cross Plains is about 40 minutes north of Nashville along Highway 25 and Highway 76. Springfield is 15 minutes west, Portland about 15 minutes east.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Cross Plains offers farmhouses, ranch homes on acreage, and some newer construction. The market is highly affordable — many homes in the $200s and $300s with meaningful land included.',
      },
      {
        heading: 'Schools',
        body: 'Robertson County Schools serves Cross Plains, with East Robertson Elementary and High School cluster.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'The rural setting provides open space, and the community hosts seasonal events. The surrounding farmland and rolling hills offer a peaceful lifestyle.',
      },
      {
        heading: 'Why House Haven knows Cross Plains',
        body: 'We help buyers looking for land and affordability understand the Cross Plains market — well and septic considerations, road frontage versus landlocked parcels, and the realistic commute times to Nashville employment centers.',
      },
    ],
    nearby: ['springfield', 'portland', 'white-house'],
  },
  {
    slug: 'orlinda',
    name: 'Orlinda',
    county: 'Robertson',
    state: 'TN',
    zips: ['37141'],
    tier: 2,
    tagline: 'Quiet corners of Robertson County, tobacco-road charm.',
    distanceFromNashville: '~45 min to downtown Nashville',
    lat: 36.6056,
    lng: -86.7228,
    metaDescription:
      'Orlinda, TN homes for sale — rural Robertson County living with farmland, affordable homes, and authentic small-town character. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Orlinda',
        body: 'Orlinda is a tiny community in northern Robertson County that sits along the Kentucky border. It is as rural as the Nashville metro gets — tobacco barns, cattle fences, and gravel roads are part of the daily landscape. For buyers who want maximum land for minimum cost and are willing to drive, Orlinda delivers.',
      },
      {
        heading: 'Location and commute',
        body: 'Orlinda is about 45 minutes north of Nashville. Springfield is 20 minutes south. The commute is the primary trade-off for the land and pricing.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Homes in Orlinda are predominantly farmhouses and rural builds on multi-acre lots. Pricing is among the lowest in the Nashville metro area, with properties available in the $200s.',
      },
      {
        heading: 'Schools',
        body: 'Robertson County Schools serves Orlinda. Jo Byrns High School is the local high school.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'The lifestyle is the outdoors — farming, horseback riding, hunting, and open-sky living. Cross Plains and Springfield provide the nearest structured recreation.',
      },
      {
        heading: 'Why House Haven knows Orlinda',
        body: 'We help Orlinda buyers understand rural property considerations — land surveys, fence-line agreements, agricultural exemptions, and the realistic value trajectory for properties at the edge of Nashville\'s growth radius.',
      },
    ],
    nearby: ['cross-plains', 'springfield', 'coopertown'],
  },
  {
    slug: 'millersville',
    name: 'Millersville',
    county: 'Sumner',
    state: 'TN',
    zips: ['37072'],
    tier: 2,
    tagline: 'Small-city independence between Goodlettsville and Hendersonville.',
    distanceFromNashville: '~25 min to downtown Nashville',
    lat: 36.3700,
    lng: -86.7100,
    metaDescription:
      'Millersville, TN homes for sale — small Sumner County city with independent governance, low taxes, and proximity to Hendersonville. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Millersville',
        body: 'Millersville is a small incorporated city in Sumner County that sits between Goodlettsville and Hendersonville. It has maintained its own governance and identity despite being surrounded by larger communities. The vibe is quiet, residential, and family-oriented — a place where people know their neighbors.',
      },
      {
        heading: 'Location and commute',
        body: 'Millersville sits along Louisville Highway, about 25 minutes from downtown Nashville. Hendersonville is minutes to the east, Goodlettsville to the south.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Millersville has a mix of established homes and some new development. Prices are generally competitive with Goodlettsville and slightly below Hendersonville, ranging from the $300s to $500s.',
      },
      {
        heading: 'Schools',
        body: 'Sumner County Schools serves Millersville. Students typically attend schools in the Hendersonville or Station Camp clusters.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Millersville Community Center and Park provides local recreation. Old Hickory Lake and Hendersonville\'s parks are a short drive away.',
      },
      {
        heading: 'Why House Haven knows Millersville',
        body: 'We help buyers understand Millersville\'s unique position — independent city services with Sumner County schools, competitive pricing relative to neighbors, and the implications of ongoing residential development.',
      },
    ],
    nearby: ['goodlettsville', 'hendersonville', 'white-house'],
  },
  {
    slug: 'white-bluff',
    name: 'White Bluff',
    county: 'Dickson',
    state: 'TN',
    zips: ['37187'],
    tier: 2,
    tagline: 'Dickson County\'s quiet eastern edge.',
    distanceFromNashville: '~35 min to downtown Nashville',
    lat: 36.1078,
    lng: -87.2222,
    metaDescription:
      'White Bluff, TN homes for sale — small Dickson County community with rural character, affordable homes, and Nashville access. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in White Bluff',
        body: 'White Bluff is a small community on the eastern edge of Dickson County that offers rural living with a shorter drive into Nashville than Dickson proper. The town has a quiet, unassuming character — no commercial strip to speak of, just residential neighborhoods, country roads, and the Harpeth River nearby.',
      },
      {
        heading: 'Location and commute',
        body: 'White Bluff sits along Highway 47 about 35 minutes west of Nashville. Dickson is 10 minutes west, and Fairview is nearby to the south. The commute along I-40 is the primary route to Nashville.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'White Bluff offers affordable homes on larger lots, with prices typically in the $200s to $400s. Many properties include one or more acres.',
      },
      {
        heading: 'Schools',
        body: 'Dickson County Schools serves White Bluff, with White Bluff Elementary and Creek Wood High School.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'The Harpeth River provides canoe and kayak access. Montgomery Bell State Park is a short drive south for hiking, golf, and lake recreation.',
      },
      {
        heading: 'Why House Haven knows White Bluff',
        body: 'We help buyers exploring the Dickson County corridor understand where White Bluff fits relative to Dickson and Burns for pricing, school quality, and commute considerations.',
      },
    ],
    nearby: ['dickson', 'burns', 'fairview'],
  },

  // ─── TIER 3 — Nashville Core Neighborhoods ───────────────

  {
    slug: 'east-nashville',
    name: 'East Nashville',
    county: 'Davidson',
    state: 'TN',
    zips: ['37206', '37216'],
    tier: 3,
    tagline: 'Nashville\'s creative heartbeat, five minutes from downtown.',
    distanceFromNashville: '~5 min to downtown Nashville',
    lat: 36.1866,
    lng: -86.7447,
    metaDescription:
      'East Nashville homes for sale — Five Points, Lockeland Springs, Inglewood-adjacent. The neighborhood that defined Nashville\'s creative renaissance. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in East Nashville',
        body: 'East Nashville is the neighborhood that put Nashville\'s cultural renaissance on the map. Five Points is the commercial heart — coffee shops, live music venues, restaurants, and bars clustered around a walkable intersection. The housing stock transitions from Victorian and Craftsman bungalows near Shelby Park to newer townhome infill further out. The vibe is creative, independent, and proud of it. East Nashville residents tend to know their neighbors, support local businesses, and care deeply about the neighborhood\'s identity.',
      },
      {
        heading: 'Location and commute',
        body: 'East Nashville sits directly across the Cumberland River from downtown, connected by the Woodland Street and Shelby Avenue bridges. The commute to downtown is 5-10 minutes. Gallatin Pike runs north into Madison and Hendersonville.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'The East Nashville market has appreciated dramatically over the past decade. Original bungalows and Victorians that sold for $150k in 2012 now command $500k-$800k+ depending on condition and proximity to Five Points. New construction townhomes range from $450k-$700k. The market rewards character and walkability.',
      },
      {
        heading: 'Schools',
        body: 'East Nashville is served by Metro Nashville Public Schools, including East Nashville Magnet High School (a selective magnet program). Lockeland Design Center Elementary is a sought-after option. Verify zone assignments with MNPS.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Shelby Park and Shelby Bottoms Greenway are the outdoor anchors — 960 acres of floodplain, trails, and river access within the neighborhood. The East Nashville Greenway connects to the city\'s broader trail system.',
      },
      {
        heading: 'Why House Haven knows East Nashville',
        body: 'We help buyers navigate East Nashville\'s micro-neighborhoods — the pricing difference between a street near Five Points and one near Gallatin Pike can be $100k for the same square footage. Understanding flood zone considerations along the Cumberland, teardown vs. renovation economics, and which blocks are still appreciating is what we bring.',
      },
    ],
    nearby: ['inglewood', 'donelson', 'germantown'],
  },
  {
    slug: 'germantown',
    name: 'Germantown',
    county: 'Davidson',
    state: 'TN',
    zips: ['37208'],
    tier: 3,
    tagline: 'Nashville\'s oldest neighborhood, now its most walkable.',
    distanceFromNashville: 'Adjacent to downtown Nashville',
    lat: 36.1792,
    lng: -86.7867,
    metaDescription:
      'Germantown Nashville homes for sale — historic neighborhood with walkability, restaurants, and Bicentennial Capitol Mall. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Germantown',
        body: 'Germantown is Nashville\'s oldest neighborhood and arguably its most walkable. The brick row houses, Bicentennial Capitol Mall, and the restaurant scene along 4th Avenue and 5th Avenue create a distinctly urban lifestyle that feels more Brooklyn than Tennessee. The Farmers\' Market and Bicentennial Park anchor the south end. New condo and townhome development has transformed portions of the neighborhood while preserving the historic streetscape.',
      },
      {
        heading: 'Location and commute',
        body: 'Germantown sits immediately north of the State Capitol, within walking or biking distance of downtown. Many residents walk to work. Salemtown and The Nations are adjacent to the west.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Germantown offers original Victorian cottages (some dating to the 1860s), renovated historic rowhouses, and modern condos and townhomes. Prices range from $400k for smaller units to $800k+ for single-family homes. Historic properties command premiums.',
      },
      {
        heading: 'Schools',
        body: 'Metro Nashville Public Schools serves Germantown. The area is within the Hume-Fogg Academic Magnet district for high school. Verify current zone assignments with MNPS.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Bicentennial Capitol Mall State Park is the main green space — 19 acres of open park with a view of the Capitol. Nashville Farmers\' Market operates year-round at the park\'s edge.',
      },
      {
        heading: 'Why House Haven knows Germantown',
        body: 'We help Germantown buyers understand the historic overlay restrictions that affect renovations, the HOA structures in newer condo developments, and the real cost of maintaining a 150-year-old house in a neighborhood where character is the whole point.',
      },
    ],
    nearby: ['east-nashville', 'salemtown', 'the-nations'],
  },
  {
    slug: 'the-gulch',
    name: 'The Gulch',
    county: 'Davidson',
    state: 'TN',
    zips: ['37203'],
    tier: 3,
    tagline: 'Nashville\'s luxury urban core — condos, dining, and city views.',
    distanceFromNashville: 'Downtown Nashville',
    lat: 36.1522,
    lng: -86.7878,
    metaDescription:
      'The Gulch Nashville condos and homes for sale — luxury urban living with walkability, rooftop dining, and downtown Nashville access. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in The Gulch',
        body: 'The Gulch is Nashville\'s most urban neighborhood — a former railroad gulch transformed into a dense, walkable district of condo towers, boutique hotels, and high-end restaurants. The "What Lifts You" wings mural is the Instagram landmark, but daily life is really about the walkability: groceries at Whole Foods, coffee, dinner, and nightlife without moving your car. It attracts young professionals, empty nesters, and anyone who wants a zero-commute urban lifestyle.',
      },
      {
        heading: 'Location and commute',
        body: 'The Gulch sits between Broadway and 8th Avenue South, directly adjacent to downtown and Music Row. There is no commute — you are already there. Most residents walk, bike, or scooter to work.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'The Gulch is almost entirely condos and luxury apartments. Condo prices range from the high $300s for studios to $1M+ for penthouses with skyline views. HOA fees are a significant consideration in every building.',
      },
      {
        heading: 'Schools',
        body: 'The Gulch does not have neighborhood schools given its urban density. Metro Nashville Public Schools serves the area, with magnet options accessible citywide.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'The neighborhood is walkable but not park-heavy. Centennial Park (1.5 miles) and the Gulch-to-Greenway connector provide outdoor access. The rooftop pools in condo buildings are the real outdoor lifestyle here.',
      },
      {
        heading: 'Why House Haven knows The Gulch',
        body: 'We help Gulch buyers compare the dozen-plus condo buildings on factors that matter: HOA health, rental restriction policies, parking, noise from Broadway, and which buildings are actually appreciating versus just holding value. The details in The Gulch are everything.',
      },
    ],
    nearby: ['germantown', '12-south', 'edgehill-music-row'],
  },
  {
    slug: '12-south',
    name: '12 South',
    county: 'Davidson',
    state: 'TN',
    zips: ['37204'],
    tier: 3,
    tagline: 'Nashville\'s curated Main Street — boutiques, brunch, and bungalows.',
    distanceFromNashville: '~10 min to downtown Nashville',
    lat: 36.1244,
    lng: -86.7911,
    metaDescription:
      '12 South Nashville homes for sale — walkable neighborhood with boutique shopping, Draper James, and some of Nashville\'s most desirable bungalows. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in 12 South',
        body: '12 South is the neighborhood that looks like it was curated for a lifestyle magazine — and in many ways it was, organically, by the small business owners who invested here. The 12th Avenue South commercial strip includes Draper James (Reese Witherspoon\'s brand), Imogene + Willie, and a rotating roster of Nashville\'s best restaurants. The residential streets behind the strip are tree-lined and walkable, with Craftsman bungalows and newer infill.',
      },
      {
        heading: 'Location and commute',
        body: '12 South is about 10 minutes from downtown Nashville, tucked between Belmont University and the Sevier Park area. Wedgewood-Houston and Berry Hill are adjacent.',
      },
      {
        heading: 'Housing stock and price range',
        body: '12 South is one of Nashville\'s most expensive neighborhoods on a per-square-foot basis. Original bungalows in good condition start around $700k; renovated and new construction ranges from $800k to well over $1M.',
      },
      {
        heading: 'Schools',
        body: 'Metro Nashville Public Schools serves 12 South. Julia Green Elementary is a popular option. Belmont University provides a college-town energy to the area.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Sevier Park anchors the south end of the neighborhood with open green space, a community center, and a farmers\' market. The 12 South strip itself is the daily outdoor experience — walking the neighborhood is the lifestyle.',
      },
      {
        heading: 'Why House Haven knows 12 South',
        body: 'We help 12 South buyers understand that the premium is real but not uniform — one block can make a $100k+ difference. We also navigate the renovation considerations on historic bungalows and help investors understand short-term rental regulations that have tightened significantly in this area.',
      },
    ],
    nearby: ['berry-hill', 'melrose', 'wedgewood-houston'],
  },
  {
    slug: 'sylvan-park',
    name: 'Sylvan Park',
    county: 'Davidson',
    state: 'TN',
    zips: ['37209'],
    tier: 3,
    tagline: 'West Nashville\'s most walkable neighborhood — McCabe Park to Murphy Road.',
    distanceFromNashville: '~10 min to downtown Nashville',
    lat: 36.1522,
    lng: -86.8233,
    metaDescription:
      'Sylvan Park Nashville homes for sale — walkable west Nashville with McCabe Park, Murphy Road restaurants, and coveted bungalows. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Sylvan Park',
        body: 'Sylvan Park is the west Nashville neighborhood that everyone wants but few homes turn over. The grid streets are walkable, the trees are mature, and the Murphy Road restaurant row (Park Cafe, McCabe Pub, Soy Bistro) provides daily-life convenience. McCabe Park and the adjacent golf course give it a green, neighborhood-centered feel that is rare this close to downtown.',
      },
      {
        heading: 'Location and commute',
        body: 'Sylvan Park sits about 10 minutes west of downtown along Charlotte Pike. The Nations is immediately west, and West End is to the east.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Sylvan Park is predominantly 1940s-1960s bungalows and ranch homes on smaller lots, with some new construction infill. Prices range from the mid $500s for original-condition homes to $900k+ for renovated or new builds. Inventory is perennially tight.',
      },
      {
        heading: 'Schools',
        body: 'Metro Nashville Public Schools serves Sylvan Park. Sylvan Park Elementary is within the neighborhood. Hillwood High School serves as the zoned high school.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'McCabe Park is the neighborhood anchor — 37 acres with a community center, playground, tennis courts, and the McCabe Golf Course. The Charlotte Pike greenway connects to the broader trail system.',
      },
      {
        heading: 'Why House Haven knows Sylvan Park',
        body: 'Low inventory means Sylvan Park homes sell fast — we help buyers compete in multiple-offer situations and understand the renovation vs. teardown economics on the older bungalow stock.',
      },
    ],
    nearby: ['the-nations', 'bellevue', 'west-end-midtown'],
  },
  {
    slug: 'green-hills',
    name: 'Green Hills',
    county: 'Davidson',
    state: 'TN',
    zips: ['37215'],
    tier: 3,
    tagline: 'Nashville\'s established address — upscale retail and top schools.',
    distanceFromNashville: '~15 min to downtown Nashville',
    lat: 36.1039,
    lng: -86.8117,
    metaDescription:
      'Green Hills Nashville homes for sale — upscale Nashville living with The Mall at Green Hills, top schools, and established luxury neighborhoods. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Green Hills',
        body: 'Green Hills is Nashville\'s established upscale address — the kind of neighborhood where longtime residents and country music executives have lived for decades. The Mall at Green Hills anchors the commercial side with Nordstrom, Tiffany, and Louis Vuitton. The residential streets are tree-lined and quiet, with generously sized lots and well-maintained homes. It is not trendy — it is proven.',
      },
      {
        heading: 'Location and commute',
        body: 'Green Hills sits along Hillsboro Pike about 15 minutes from downtown Nashville. Belmont and Lipscomb Universities are nearby. Belle Meade is to the west.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Green Hills offers a range from 1960s ranch homes starting around $600k to multi-million-dollar estates. The average home price is significantly above the Nashville metro median. Lot sizes are larger than urban Nashville neighborhoods.',
      },
      {
        heading: 'Schools',
        body: 'Metro Nashville Public Schools serves Green Hills — Julia Green Elementary and Hillsboro High School are the primary public options. Multiple private school options (MBA, USN, Ensworth) are nearby, which is a major draw.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Warner Parks (Edwin and Percy) are accessible from Green Hills — 3,100+ acres of forested trails, one of the largest urban parks in the country. The Bluebird Cafe in Green Hills is a Nashville cultural institution.',
      },
      {
        heading: 'Why House Haven knows Green Hills',
        body: 'We help Green Hills buyers navigate the significant price spread between different pockets of the neighborhood, understand the school zoning nuances between Julia Green and other elementary options, and evaluate renovation potential on older ranch homes in a market where teardowns are increasingly common.',
      },
    ],
    nearby: ['hillsboro-village', '12-south', 'sylvan-park'],
  },
  {
    slug: 'berry-hill',
    name: 'Berry Hill',
    county: 'Davidson',
    state: 'TN',
    zips: ['37204'],
    tier: 3,
    tagline: 'Nashville\'s smallest city — recording studios and creative industry.',
    distanceFromNashville: '~10 min to downtown Nashville',
    lat: 36.1178,
    lng: -86.7761,
    metaDescription:
      'Berry Hill Nashville homes for sale — tiny independent city within Nashville known for recording studios and creative businesses. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Berry Hill',
        body: 'Berry Hill is a tiny incorporated city (less than one square mile) completely surrounded by Nashville. It is known for its concentration of recording studios, creative businesses, and a quietly cool commercial strip along Bransford Avenue. The residential areas are modest but increasingly sought-after as 12 South and Melrose pricing pushes buyers into adjacent neighborhoods.',
      },
      {
        heading: 'Location and commute',
        body: 'Berry Hill sits along Thompson Lane and Bransford Avenue, about 10 minutes from downtown Nashville. 12 South, Melrose, and Wedgewood-Houston are all adjacent.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Berry Hill\'s residential stock is small — mostly mid-century ranch homes and bungalows. Prices range from the $400s to $700s depending on condition and lot size. The independent city status means separate city taxes (which are lower than Nashville\'s).',
      },
      {
        heading: 'Schools',
        body: 'Berry Hill has its own elementary school — Berry Hill Elementary, within the Metro Nashville school system. Middle and high school students attend MNPS zoned schools.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Berry Hill Park provides neighborhood green space. Sevier Park and the broader 12 South walkable district are minutes away.',
      },
      {
        heading: 'Why House Haven knows Berry Hill',
        body: 'Berry Hill\'s separate city status creates tax and governance implications that most Nashville agents overlook. We help buyers understand the practical differences of living in Berry Hill versus Nashville proper.',
      },
    ],
    nearby: ['12-south', 'melrose', 'wedgewood-houston'],
  },
  {
    slug: 'melrose',
    name: 'Melrose',
    county: 'Davidson',
    state: 'TN',
    zips: ['37204'],
    tier: 3,
    tagline: 'South Nashville\'s up-and-coming corridor between 12 South and Berry Hill.',
    distanceFromNashville: '~10 min to downtown Nashville',
    lat: 36.1178,
    lng: -86.7833,
    metaDescription:
      'Melrose Nashville homes for sale — emerging south Nashville neighborhood with proximity to 12 South and strong appreciation. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Melrose',
        body: 'Melrose is the south Nashville neighborhood that has been quietly appreciating as 12 South and Berry Hill pricing pushed buyers south along 8th Avenue. The 8th Avenue South corridor is the commercial spine — restaurants, bars, and creative businesses have been steadily filling in. The residential streets have a mix of original homes and new infill.',
      },
      {
        heading: 'Location and commute',
        body: 'Melrose runs along 8th Avenue South and Franklin Pike, about 10 minutes from downtown. 12 South is to the west, Berry Hill to the east, Wedgewood-Houston to the north.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Melrose offers original ranch homes, bungalows, and an increasing number of new-construction townhomes and single-family builds. Prices range from the mid $400s to $700s+.',
      },
      {
        heading: 'Schools',
        body: 'Metro Nashville Public Schools serves Melrose — Glendale Elementary and Wright Middle School are in the area. Verify current zone assignments.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Sevier Park is accessible from Melrose, and the Melrose area benefits from the broader south Nashville greenway system.',
      },
      {
        heading: 'Why House Haven knows Melrose',
        body: 'We help buyers see Melrose as the value play relative to 12 South — similar proximity, similar trajectory, but with more room on pricing. Understanding which streets and blocks are appreciating fastest is what we bring.',
      },
    ],
    nearby: ['12-south', 'berry-hill', 'wedgewood-houston'],
  },
  {
    slug: 'wedgewood-houston',
    name: 'Wedgewood-Houston',
    county: 'Davidson',
    state: 'TN',
    zips: ['37204', '37210'],
    tier: 3,
    tagline: 'Nashville\'s art district — galleries, breweries, and industrial-chic living.',
    distanceFromNashville: '~5 min to downtown Nashville',
    lat: 36.1389,
    lng: -86.7711,
    metaDescription:
      'Wedgewood-Houston Nashville homes for sale — art galleries, breweries, adaptive reuse lofts, and rapid development south of downtown. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Wedgewood-Houston',
        body: 'Wedgewood-Houston — "WeHo" to locals — is Nashville\'s art district. The neighborhood has transformed from industrial warehouses into a dense mix of galleries, breweries (Southern Grist, Jackalope), and adaptive reuse residential developments. The Houston Station food hall and the growing Chestnut Hill commercial strip give it daily-life convenience. The development pace is fast, and the neighborhood looks different every six months.',
      },
      {
        heading: 'Location and commute',
        body: 'Wedgewood-Houston sits directly south of downtown between I-65 and I-40. Downtown is about 5 minutes north. The Gulch, 12 South, and Melrose are all adjacent.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'WeHo offers adaptive reuse lofts, new construction condos and townhomes, and a shrinking number of original single-family homes. Prices range from $350k for condos to $800k+ for new single-family builds.',
      },
      {
        heading: 'Schools',
        body: 'Metro Nashville Public Schools serves the area. Given the neighborhood\'s urban density, families typically evaluate magnet and private school options.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Fort Negley Park and the adjacent Nashville Adventure Science Center provide green space and family activities. The neighborhood is more walkable to restaurants than to parks.',
      },
      {
        heading: 'Why House Haven knows Wedgewood-Houston',
        body: 'WeHo is changing so fast that comps from six months ago may not reflect current values. We track development announcements, rezoning activity, and which buildings are delivering quality versus cutting corners in a neighborhood where every block has active construction.',
      },
    ],
    nearby: ['the-gulch', '12-south', 'melrose'],
  },
  {
    slug: 'edgehill-music-row',
    name: 'Edgehill / Music Row',
    county: 'Davidson',
    state: 'TN',
    zips: ['37203'],
    tier: 3,
    tagline: 'Where Nashville\'s music industry meets urban living.',
    distanceFromNashville: 'Adjacent to downtown Nashville',
    lat: 36.1506,
    lng: -86.7950,
    metaDescription:
      'Edgehill and Music Row Nashville homes for sale — urban Nashville between Vanderbilt and downtown with recording studios and rapid redevelopment. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Edgehill / Music Row',
        body: 'Edgehill and Music Row sit between Vanderbilt and downtown in a zone of active transformation. Music Row is the historic home of Nashville\'s recording industry — RCA Studio B, ASCAP, BMI — but residential development has been steadily replacing some of the older commercial buildings. Edgehill to the south is a historically significant neighborhood experiencing significant investment and change.',
      },
      {
        heading: 'Location and commute',
        body: 'This area sits directly between Vanderbilt University and downtown Nashville. You can walk to The Gulch, Midtown, or campus in minutes.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'The area has a mix of new luxury condos, townhomes, and remaining single-family homes. Condo prices start in the $400s; single-family homes range from $500k to $900k+ depending on lot size and condition.',
      },
      {
        heading: 'Schools',
        body: 'Metro Nashville Public Schools serves the area. The proximity to Vanderbilt and Belmont universities creates a college-town atmosphere.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Music Row Roundabout and the Owen Bradley Park are small but central green spaces. Centennial Park is a 10-minute walk west.',
      },
      {
        heading: 'Why House Haven knows Edgehill / Music Row',
        body: 'This area is in flux — understanding which blocks are being rezoned for density, which historic structures are protected, and where the development pipeline is heading is critical for buyers making a purchase in this transitional zone.',
      },
    ],
    nearby: ['the-gulch', 'hillsboro-village', 'west-end-midtown'],
  },
  {
    slug: 'hillsboro-village',
    name: 'Hillsboro Village',
    county: 'Davidson',
    state: 'TN',
    zips: ['37212'],
    tier: 3,
    tagline: 'Nashville\'s college-town village — Belmont, Pancake Pantry, and walkability.',
    distanceFromNashville: '~10 min to downtown Nashville',
    lat: 36.1328,
    lng: -86.8014,
    metaDescription:
      'Hillsboro Village Nashville homes for sale — walkable neighborhood near Belmont University with Pancake Pantry, Belcourt Theatre, and charming streets. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Hillsboro Village',
        body: 'Hillsboro Village is Nashville\'s college-adjacent walkable village — the Belcourt Theatre, Pancake Pantry, and a strip of independent shops create a neighborhood commercial district with genuine character. Belmont University provides energy and foot traffic. The residential streets behind the strip have some of Nashville\'s most charming homes.',
      },
      {
        heading: 'Location and commute',
        body: 'Hillsboro Village sits along 21st Avenue South between Vanderbilt and Belmont. Downtown is about 10 minutes north. Green Hills is 5 minutes south.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Hillsboro Village has Tudor cottages, Craftsman bungalows, and newer infill. The walkability premium is real — homes start in the $600s and push past $1M for renovated properties on desirable streets.',
      },
      {
        heading: 'Schools',
        body: 'Metro Nashville Public Schools serves the area. Eakin Elementary is nearby. Hillsboro High School is the zoned high school.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Fannie Mae Dees Park ("Dragon Park") is the beloved neighborhood gathering spot. Centennial Park is a short walk north.',
      },
      {
        heading: 'Why House Haven knows Hillsboro Village',
        body: 'We help Hillsboro Village buyers understand the parking and rental-regulation realities of living near a university, evaluate the renovation math on older homes, and compete in a market where inventory is perpetually tight.',
      },
    ],
    nearby: ['green-hills', 'edgehill-music-row', '12-south'],
  },
  {
    slug: 'west-end-midtown',
    name: 'West End / Midtown',
    county: 'Davidson',
    state: 'TN',
    zips: ['37203'],
    tier: 3,
    tagline: 'Vanderbilt, Centennial Park, and Nashville\'s central corridor.',
    distanceFromNashville: 'Adjacent to downtown Nashville',
    lat: 36.1528,
    lng: -86.8056,
    metaDescription:
      'West End and Midtown Nashville homes and condos for sale — Vanderbilt area, Centennial Park, and the heart of Nashville\'s urban core. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in West End / Midtown',
        body: 'West End and Midtown form Nashville\'s central corridor between downtown and the suburbs. Centennial Park (home of the full-scale Parthenon replica) is the green anchor. Vanderbilt University provides the academic atmosphere. The Midtown bar scene along Division Street is the nightlife center. West End Avenue itself is a commercial boulevard with restaurants, offices, and the entrance to Belle Meade.',
      },
      {
        heading: 'Location and commute',
        body: 'There is essentially no commute — West End/Midtown is Nashville\'s geographic center. Downtown, Music Row, The Gulch, and Germantown are all within 10 minutes.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'The area is heavy on condos and apartments, with some single-family pockets near Vanderbilt. Condos range from $300k-$800k; single-family homes near campus push well past $1M.',
      },
      {
        heading: 'Schools',
        body: 'Metro Nashville Public Schools serves the area. The proximity to Vanderbilt and multiple private schools makes this a popular area for families with school-age children despite the urban density.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Centennial Park is the crown jewel — 132 acres with the Parthenon, Lake Watauga, walking paths, and events throughout the year. It is Nashville\'s equivalent of Central Park.',
      },
      {
        heading: 'Why House Haven knows West End / Midtown',
        body: 'We help condo buyers in Midtown compare buildings on the factors that matter most — HOA health, noise levels from Division Street, parking, and which buildings allow short-term rentals versus those that have prohibited them.',
      },
    ],
    nearby: ['germantown', 'sylvan-park', 'hillsboro-village'],
  },
  {
    slug: 'salemtown',
    name: 'Salemtown',
    county: 'Davidson',
    state: 'TN',
    zips: ['37208'],
    tier: 3,
    tagline: 'Germantown\'s quieter neighbor with rapid new construction.',
    distanceFromNashville: 'Adjacent to downtown Nashville',
    lat: 36.1825,
    lng: -86.7950,
    metaDescription:
      'Salemtown Nashville homes for sale — north Nashville neighborhood adjacent to Germantown with new townhomes and rapid development. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Salemtown',
        body: 'Salemtown sits between Germantown and the Cumberland River, and it has experienced some of Nashville\'s most dramatic transformation over the past decade. New-construction townhomes now stand alongside original shotgun houses. The Morgan Park area has been the epicenter of development. The neighborhood offers Germantown-adjacent walkability at a slightly lower price point.',
      },
      {
        heading: 'Location and commute',
        body: 'Salemtown is immediately west of Germantown and north of downtown, within walking or biking distance of Bicentennial Mall and the State Capitol.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'New construction townhomes dominate recent inventory, typically in the $500k-$750k range. Original shotgun houses and cottages range from $300k-$500k depending on condition.',
      },
      {
        heading: 'Schools',
        body: 'Metro Nashville Public Schools serves Salemtown. The area is close to several magnet program options.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Morgan Park is the neighborhood green space. The Germantown Farmers\' Market and Bicentennial Mall are walking distance.',
      },
      {
        heading: 'Why House Haven knows Salemtown',
        body: 'Salemtown\'s rapid development creates wide price variation within a few blocks. We help buyers understand which new construction is quality-built versus volume-built, and where the remaining appreciation potential sits relative to Germantown pricing.',
      },
    ],
    nearby: ['germantown', 'the-nations', 'east-nashville'],
  },
  {
    slug: 'the-nations',
    name: 'The Nations',
    county: 'Davidson',
    state: 'TN',
    zips: ['37209'],
    tier: 3,
    tagline: 'West Nashville\'s hottest transformation — from industrial to residential.',
    distanceFromNashville: '~10 min to downtown Nashville',
    lat: 36.1700,
    lng: -86.8289,
    metaDescription:
      'The Nations Nashville homes for sale — west Nashville neighborhood with rapid new construction, breweries, and strong appreciation. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in The Nations',
        body: 'The Nations is west Nashville\'s most dramatic transformation story. What was an industrial and working-class neighborhood a decade ago is now dense with new-construction townhomes, breweries (Harding House, Tennessee Brew Works taproom), coffee shops, and a strong sense of neighborhood identity. The 51st Avenue corridor is the commercial spine. The speed of change has been remarkable even by Nashville standards.',
      },
      {
        heading: 'Location and commute',
        body: 'The Nations sits along Centennial Boulevard about 10 minutes from downtown Nashville. Sylvan Park is to the east, Charlotte Pike to the north.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'The Nations is dominated by new-construction townhomes and single-family infill, typically in the $500k-$800k range. Remaining original homes on larger lots occasionally list in the $400s-$500s.',
      },
      {
        heading: 'Schools',
        body: 'Metro Nashville Public Schools serves The Nations. Verify current zone assignments as the area straddles multiple school clusters.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'England Park and the West Nashville Greenway provide neighborhood recreation. The 606 development corridor is adding community spaces.',
      },
      {
        heading: 'Why House Haven knows The Nations',
        body: 'The Nations has so much new construction that quality varies widely. We help buyers evaluate builder reputation, understand the difference between the 51st corridor and the quieter residential streets, and assess whether a tall-and-skinny townhome is the right fit versus a wider traditional build.',
      },
    ],
    nearby: ['sylvan-park', 'germantown', 'salemtown'],
  },
  {
    slug: 'lockeland-springs',
    name: 'Lockeland Springs',
    county: 'Davidson',
    state: 'TN',
    zips: ['37206'],
    tier: 3,
    tagline: 'East Nashville\'s most charming sub-neighborhood — Victorians and walkability.',
    distanceFromNashville: '~5 min to downtown Nashville',
    lat: 36.1783,
    lng: -86.7556,
    metaDescription:
      'Lockeland Springs Nashville homes for sale — Victorian homes, Lockeland Table, and one of East Nashville\'s most walkable streets. Guide from House Haven Realty.',
    content: [
      {
        heading: 'What it feels like to live in Lockeland Springs',
        body: 'Lockeland Springs is the sub-neighborhood within East Nashville that commands the highest premiums — and for good reason. The streets are tree-lined and walkable, the Victorian and Craftsman architecture is beautifully preserved, and the commercial strip along Woodland Street (Lockeland Table, Margot Cafe) creates genuine neighborhood dining. Lockeland Design Center Elementary is one of the most sought-after public elementary schools in Nashville.',
      },
      {
        heading: 'Location and commute',
        body: 'Lockeland Springs sits in the heart of East Nashville, within walking distance of Five Points. Downtown Nashville is about 5 minutes across the river.',
      },
      {
        heading: 'Housing stock and price range',
        body: 'Victorian and Craftsman homes dominate, many beautifully restored. Prices range from $550k for homes needing work to $1M+ for turnkey Victorians on desirable streets. This is the most expensive pocket of East Nashville.',
      },
      {
        heading: 'Schools',
        body: 'Lockeland Design Center Elementary is within the neighborhood and is a magnet-style program that draws families from across the city. This school zone is a major property value driver.',
      },
      {
        heading: 'Parks and outdoor life',
        body: 'Shelby Park and the Shelby Bottoms Greenway are the outdoor anchors. The neighborhood\'s walkable streets and mature tree canopy make daily walks part of the lifestyle.',
      },
      {
        heading: 'Why House Haven knows Lockeland Springs',
        body: 'We help buyers navigate Lockeland Springs\' premium market — understanding which streets command the highest premiums, evaluating the renovation economics on historic homes, and competing in a market where desirable listings receive multiple offers within days.',
      },
    ],
    nearby: ['east-nashville', 'inglewood', 'donelson'],
  },
]

export const communityBySlug = Object.fromEntries(
  communities.map((c) => [c.slug, c]),
)
