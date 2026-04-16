// Team data — sourced from ROADMAP Section 2
// TODO: bios are placeholders until live agent pages are scraped; see TODO.md

export interface TeamMember {
  slug: string
  name: string
  title: string
  email?: string
  phone?: string
  headshotUrl: string
  bioPageUrl: string
  bio: string
  hidden?: boolean
  sortOrder: number
}

export const teamMembers: TeamMember[] = [
  {
    slug: 'stephen-delahoussaye',
    name: 'Stephen Delahoussaye',
    title: 'Broker | Owner',
    email: 'Stephen@househavenrealty.com',
    phone: '(615) 624-4766',
    headshotUrl:
      'https://media.agentaprd.com/sites/213/BQXPwDi7x8QXhtLq9sNIHxFrNatzeVTpTA.webp',
    bioPageUrl: 'https://househavenrealty.com/meet-stephen-delahoussaye/',
    bio:
      "Stephen is the broker and owner of House Haven Realty, a boutique Nashville brokerage he founded to help Middle Tennessee families buy, sell, and invest with a level of care that feels more like family than a transaction. Licensed since 2016, Stephen has closed 219+ homes totaling over $124 million in volume. His story began at the University of Tennessee at Chattanooga, where an internship at Vanderbilt Bone and Joint Clinic taught him that his real passion wasn't medicine — it was people. That connection is what brought him to real estate, and it's what drives him today. In 2019 he launched the Rent Less, Own More! initiative to empower first-time homebuyers with the tools, knowledge, and confidence to make the home buying process smooth, simple, and fun.",
    sortOrder: 1,
  },
  {
    slug: 'camil-medina',
    name: 'Camil Medina',
    title: 'Director of Operations',
    headshotUrl: 'https://media.agentaprd.com/sites/213/Camil-hs.webp',
    bioPageUrl: 'https://househavenrealty.com/meet-camil-medina/',
    bio:
      "Camil runs the day-to-day of House Haven Realty, making sure every client, every file, and every agent has what they need to thrive. As Director of Operations she is the connective tissue of the brokerage — organized, warm, and relentlessly client-focused.",
    sortOrder: 2,
  },
  {
    slug: 'sarah-harris',
    name: 'Sarah Harris',
    title: 'Transaction Coordinator',
    headshotUrl: 'https://media.agentaprd.com/sites/213/sarah-headshot.webp',
    bioPageUrl: 'https://househavenrealty.com/meet-sarah-harris/',
    bio:
      "Sarah coordinates every House Haven transaction from contract to close, keeping deadlines, paperwork, and people moving in the same direction. Clients describe working with Sarah as the moment a complicated process starts to feel simple.",
    sortOrder: 3,
  },
  {
    slug: 'olivia-mortensen',
    name: 'Olivia Mortensen',
    title: 'REALTOR®',
    headshotUrl: 'https://media.agentaprd.com/sites/213/olivia-headshot.webp',
    bioPageUrl: 'https://househavenrealty.com/meet-olivia-mortensen/',
    bio:
      'Olivia is a Nashville REALTOR® with House Haven Realty, guiding buyers and sellers through Middle Tennessee with the same warmth and attention to detail that defines the House Haven team.',
    hidden: true, // confirm with Stephen whether to surface
    sortOrder: 4,
  },
  {
    slug: 'james-belote',
    name: 'James Belote',
    title: 'REALTOR®',
    headshotUrl: 'https://media.agentaprd.com/sites/213/james-belote-portrait.webp',
    bioPageUrl: 'https://househavenrealty.com/meet-james-belote/',
    bio:
      'James brings a patient, consultative approach to every House Haven client. Whether you are a first-time buyer finding your way or a seasoned seller preparing for your next chapter, James treats the search like it is his own family.',
    sortOrder: 5,
  },
  {
    slug: 'josh-zehring',
    name: 'Josh Zehring',
    title: 'REALTOR®',
    headshotUrl: 'https://media.agentaprd.com/sites/213/josh-headshot-1.webp',
    bioPageUrl: 'https://househavenrealty.com/meet-josh-zehring/',
    bio:
      'Josh is a House Haven REALTOR® who loves helping Middle Tennessee families put down roots. His knowledge of the Nashville metro — from downtown lofts to small-town acreage — means clients always feel informed, never pressured.',
    sortOrder: 6,
  },
  {
    slug: 'matthew-valluzzi',
    name: 'Matthew Valluzzi',
    title: 'REALTOR®',
    headshotUrl: 'https://media.agentaprd.com/sites/213/matthew-valluzzi.webp',
    bioPageUrl: 'https://househavenrealty.com/meet-matthew-valluzzi/',
    bio:
      'Matthew is a House Haven REALTOR® known for his deep neighborhood knowledge and ability to translate complex market data into clear next steps for his clients.',
    sortOrder: 7,
  },
  {
    slug: 'amber-bouldin',
    name: 'Amber Bouldin',
    title: 'REALTOR®',
    headshotUrl: 'https://media.agentaprd.com/sites/213/amber-bouldin-headshot.webp',
    bioPageUrl: 'https://househavenrealty.com/meet-amber-bouldin/',
    bio:
      'Amber helps buyers and sellers across Nashville and Middle Tennessee with the personal, hands-on attention that House Haven is known for. She believes every client deserves a REALTOR® who listens first and advises second.',
    sortOrder: 8,
  },
  {
    slug: 'chuck-starks',
    name: 'Chuck Starks',
    title: 'REALTOR®',
    headshotUrl: 'https://media.agentaprd.com/sites/213/chuck-starks-headshot.webp',
    bioPageUrl: 'https://househavenrealty.com/meet-chuck-starks/',
    bio:
      'Chuck brings a calm, steady presence to every House Haven transaction. His clients know him as someone who answers the phone, sweats the details, and advocates like family.',
    sortOrder: 9,
  },
  {
    slug: 'philip-elliott',
    name: 'Philip Elliott',
    title: 'REALTOR®',
    headshotUrl: 'https://media.agentaprd.com/sites/213/Philip-Elliott-hs.webp',
    bioPageUrl: 'https://househavenrealty.com/meet-philip-elliott/',
    bio:
      'Philip is a Nashville native at heart and a House Haven REALTOR® who loves showing newcomers why Middle Tennessee feels like home faster than anywhere else in the country.',
    sortOrder: 10,
  },
  {
    slug: 'maria-morales',
    name: 'Maria Morales',
    title: 'Digital Operations Manager',
    headshotUrl: 'https://media.agentaprd.com/sites/213/maria-morales-headshot.webp',
    bioPageUrl: 'https://househavenrealty.com/meet-maria-morales',
    bio:
      'Maria keeps the House Haven engine running behind the scenes — from marketing systems to client communications — so our agents can stay focused on the people in front of them.',
    sortOrder: 11,
  },
]

export const visibleTeam = teamMembers
  .filter((m) => !m.hidden)
  .sort((a, b) => a.sortOrder - b.sortOrder)
