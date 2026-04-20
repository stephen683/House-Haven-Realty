// Maps construction stages to hero image paths. These are branded SVG
// illustrations (B/W line art) in public/images/pipeline/stages/. Swap to
// real photographs by dropping JPG files into the same directory and
// flipping the extension here — the UI uses whatever this map returns.

import type { StageKey } from './permit-stages'

export const STAGE_IMAGE: Record<StageKey, string> = {
  permitted: '/images/pipeline/stages/permitted.svg',
  site_prep: '/images/pipeline/stages/site_prep.svg',
  foundation: '/images/pipeline/stages/foundation.svg',
  framing: '/images/pipeline/stages/framing.svg',
  dried_in: '/images/pipeline/stages/dried_in.svg',
  finishing: '/images/pipeline/stages/finishing.svg',
  near_listing: '/images/pipeline/stages/near_listing.svg',
}
