// Top 15 Nashville ZIPs for NashBuilds landing pages

export interface ZipMeta {
  zip: string
  name: string
  area: string
  lat: number
  lng: number
}

export const NASHBUILDS_ZIPS: ZipMeta[] = [
  { zip: '37013', name: 'Antioch', area: 'Southeast Nashville', lat: 36.059, lng: -86.672 },
  { zip: '37027', name: 'Brentwood', area: 'Williamson County', lat: 36.033, lng: -86.783 },
  { zip: '37203', name: 'Midtown / The Gulch', area: 'Downtown Nashville', lat: 36.153, lng: -86.788 },
  { zip: '37204', name: '12 South / Berry Hill', area: 'South Nashville', lat: 36.118, lng: -86.776 },
  { zip: '37205', name: 'Belle Meade / West End', area: 'West Nashville', lat: 36.131, lng: -86.859 },
  { zip: '37206', name: 'East Nashville', area: 'East Nashville', lat: 36.187, lng: -86.745 },
  { zip: '37207', name: 'North Nashville / Dickerson', area: 'North Nashville', lat: 36.211, lng: -86.774 },
  { zip: '37209', name: 'The Nations / Sylvan Park', area: 'West Nashville', lat: 36.152, lng: -86.823 },
  { zip: '37211', name: 'South Nashville / Nolensville Pk', area: 'South Nashville', lat: 36.079, lng: -86.738 },
  { zip: '37212', name: 'Hillsboro Village / Belmont', area: 'Midtown Nashville', lat: 36.133, lng: -86.801 },
  { zip: '37215', name: 'Green Hills', area: 'South Nashville', lat: 36.104, lng: -86.812 },
  { zip: '37217', name: 'Donelson / Hermitage', area: 'East Davidson County', lat: 36.153, lng: -86.621 },
  { zip: '37218', name: 'Bordeaux / Whites Creek', area: 'North Davidson County', lat: 36.235, lng: -86.844 },
  { zip: '37220', name: 'Oak Hill / Crieve Hall', area: 'South Nashville', lat: 36.072, lng: -86.778 },
  { zip: '37221', name: 'Bellevue', area: 'West Nashville', lat: 36.077, lng: -86.918 },
]

export const ZIP_META_MAP = Object.fromEntries(
  NASHBUILDS_ZIPS.map((z) => [z.zip, z]),
)
