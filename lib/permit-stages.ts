// Maps Metro Nashville ePermits inspection task codes → consumer-facing
// construction stages. Code-owned: new inspector codes ship via PR, not a DB row.

export type StageKey =
  | 'permitted'
  | 'site_prep'
  | 'foundation'
  | 'framing'
  | 'dried_in'
  | 'finishing'
  | 'near_listing'

export type StageStatus = 'pending' | 'in_progress' | 'completed' | 'blocked'

export interface StageDef {
  key: StageKey
  label: string
  order: number
  taskCodes: readonly string[]
  description: string
}

export const STAGE_LADDER: readonly StageDef[] = [
  {
    key: 'permitted',
    order: 1,
    label: 'Permitted',
    taskCodes: ['CAPRMTISSD', 'CABOKTOPAY'],
    description: 'Metro has issued the building permit.',
  },
  {
    key: 'site_prep',
    order: 2,
    label: 'Site prep',
    taskCodes: ['SWGRADE', 'PWRAMP', 'PWADDRESS', 'SWFLDPLN'],
    description: 'Grading, driveway ramp, and site work underway.',
  },
  {
    key: 'foundation',
    order: 3,
    label: 'Foundation',
    taskCodes: ['CABFOOT', 'CABFOUND', 'CABSLAB'],
    description: 'Footings, foundation walls, or slab inspections.',
  },
  {
    key: 'framing',
    order: 4,
    label: 'Framing',
    taskCodes: ['CABFRAME', 'CABFCEIL', 'CABFWALL', 'CABFLELV'],
    description: 'Structural framing, walls, ceilings, floor elevations.',
  },
  {
    key: 'dried_in',
    order: 5,
    label: 'Dried-in',
    taskCodes: ['CABPROG'],
    description: 'Progress check — typically roof and windows installed.',
  },
  {
    key: 'finishing',
    order: 6,
    label: 'Finishing',
    taskCodes: ['CABFINAL'],
    description: 'Building final scheduled — interiors nearing done.',
  },
  {
    key: 'near_listing',
    order: 7,
    label: 'Near listing / U&O',
    taskCodes: ['CABUO', 'CATREE', 'WSUSWRAVL', 'PWURMPCRB', 'SWUGRADE'],
    description: 'Use & Occupancy approvals — expect listing within ~30 days.',
  },
]

const PASS_RESULTS = new Set(['APPROVED', 'PASS', 'COND', 'N/A', 'RVWNOTRQ', 'IGNORE', 'ISSUED', 'OK TO PAY'])
const FAIL_RESULTS = new Set(['REJECTED', 'FAIL', 'DISAPPROVED'])

export interface EPermitsCase {
  caseID: number
  caseNumber: string
  location: string
  statusCode: string
  status: string
  issued: string | null
  accepted: string | null
  modified: string | null
  availableInspectCount: number
  scheduledCount: number
  projectScope: string
}

export interface EPermitsCaseTask {
  caseTaskID: number
  caseID: number
  taskCode: string
  taskType: string
  isInspection: string
  description: string
  scheduledDate: string | null
  assignedTo: string
  performedBy: string
  clearedBy: string
  result: string
  completedBy: string
  modified: string | null
  inspectionMessage: string
  inspectionNote: string
  targetEndDate: string | null
  recommendedDate: string | null
}

export interface StageTaskView {
  code: string
  description: string
  result: string
  scheduledDate: string | null
  completedBy: string
  modified: string | null
}

export interface StageView {
  key: StageKey
  label: string
  order: number
  description: string
  status: StageStatus
  completedAt: string | null
  scheduledAt: string | null
  tasks: StageTaskView[]
}

export interface ComputedStages {
  currentStage: StageKey
  stages: StageView[]
  unmapped: string[]
}

const warnedCodes = new Set<string>()

function taskView(t: EPermitsCaseTask): StageTaskView {
  return {
    code: t.taskCode,
    description: t.description,
    result: (t.result || '').trim(),
    scheduledDate: t.scheduledDate,
    completedBy: (t.completedBy || '').trim(),
    modified: t.modified,
  }
}

function latestDate(dates: (string | null)[]): string | null {
  const valid = dates.filter((d): d is string => Boolean(d))
  if (valid.length === 0) return null
  return valid.sort().at(-1) ?? null
}

function latestByCode(tasks: EPermitsCaseTask[]): Map<string, EPermitsCaseTask> {
  // When an inspection is failed and re-run under the same code, Metro writes a
  // second row with a later `modified` timestamp. The latest row wins — a
  // rejected-then-approved check should not leave the whole stage blocked.
  const out = new Map<string, EPermitsCaseTask>()
  for (const t of tasks) {
    const existing = out.get(t.taskCode)
    if (!existing) {
      out.set(t.taskCode, t)
      continue
    }
    const a = new Date(existing.modified || existing.scheduledDate || 0).getTime()
    const b = new Date(t.modified || t.scheduledDate || 0).getTime()
    if (b >= a) out.set(t.taskCode, t)
  }
  return out
}

function classifyStage(
  _taskCodes: readonly string[],
  tasksInBucket: EPermitsCaseTask[],
  caseRow: EPermitsCase,
  stageKey: StageKey,
): { status: StageStatus; completedAt: string | null; scheduledAt: string | null; tasks: StageTaskView[] } {
  const tasks = tasksInBucket.map(taskView)

  if (stageKey === 'permitted') {
    const isIssued =
      caseRow.statusCode === 'ISSUE' ||
      tasks.some((t) => t.code === 'CAPRMTISSD' && t.result)
    if (isIssued) {
      return {
        status: 'completed',
        completedAt: caseRow.issued ?? latestDate(tasks.map((t) => t.modified)),
        scheduledAt: null,
        tasks,
      }
    }
    return { status: 'pending', completedAt: null, scheduledAt: null, tasks }
  }

  const current = Array.from(latestByCode(tasksInBucket).values())
  const withResult = current.filter((t) => (t.result || '').trim())
  const currentFailed = withResult.filter((t) => FAIL_RESULTS.has((t.result || '').toUpperCase()))
  const allCurrentPassed =
    withResult.length > 0 &&
    withResult.every((t) => PASS_RESULTS.has((t.result || '').toUpperCase()))
  const futureScheduled = tasks.filter(
    (t) => t.scheduledDate && new Date(t.scheduledDate).getTime() > Date.now(),
  )
  const anyActivity = tasks.some(
    (t) => t.result || t.completedBy || (t.scheduledDate && t.scheduledDate.length > 0),
  )

  if (currentFailed.length > 0) {
    const latestFail = currentFailed
      .map((t) => t.modified)
      .filter((d): d is string => Boolean(d))
      .sort()
      .at(-1) ?? null
    return { status: 'blocked', completedAt: null, scheduledAt: latestFail, tasks }
  }

  if (allCurrentPassed) {
    return {
      status: 'completed',
      completedAt: latestDate(current.map((t) => t.modified)),
      scheduledAt: null,
      tasks,
    }
  }

  if (futureScheduled.length > 0 || anyActivity) {
    return {
      status: 'in_progress',
      completedAt: null,
      scheduledAt: latestDate(futureScheduled.map((t) => t.scheduledDate)),
      tasks,
    }
  }

  return { status: 'pending', completedAt: null, scheduledAt: null, tasks }
}

export function computeStages(
  caseRow: EPermitsCase,
  tasks: EPermitsCaseTask[],
): ComputedStages {
  const codeToStage = new Map<string, StageKey>()
  for (const stage of STAGE_LADDER) {
    for (const code of stage.taskCodes) codeToStage.set(code, stage.key)
  }

  const bucketed = new Map<StageKey, EPermitsCaseTask[]>()
  for (const stage of STAGE_LADDER) bucketed.set(stage.key, [])

  const unmapped: string[] = []
  for (const t of tasks) {
    const key = codeToStage.get(t.taskCode)
    if (key) {
      bucketed.get(key)!.push(t)
    } else {
      if (!warnedCodes.has(t.taskCode)) {
        warnedCodes.add(t.taskCode)
        console.warn('[permit-stages] unmapped task code', t.taskCode, t.description)
      }
      unmapped.push(t.taskCode)
    }
  }

  const stages: StageView[] = STAGE_LADDER.map((def) => {
    const cls = classifyStage(def.taskCodes, bucketed.get(def.key) ?? [], caseRow, def.key)
    return {
      key: def.key,
      label: def.label,
      order: def.order,
      description: def.description,
      ...cls,
    }
  })

  // Implicit promotion: if a later stage is completed/in_progress but an earlier
  // one is still pending, mark the earlier as completed. Metro inspectors
  // sometimes skip codes; don't punish the UI.
  for (let i = stages.length - 1; i >= 1; i--) {
    if (stages[i].status === 'completed' || stages[i].status === 'in_progress') {
      for (let j = 0; j < i; j++) {
        if (stages[j].status === 'pending') {
          stages[j] = { ...stages[j], status: 'completed' }
        }
      }
      break
    }
  }

  const inProgress = stages.find((s) => s.status === 'in_progress')
  const blocked = stages.find((s) => s.status === 'blocked')
  const lastCompleted = [...stages].reverse().find((s) => s.status === 'completed')
  const currentStage: StageKey =
    inProgress?.key ?? blocked?.key ?? lastCompleted?.key ?? 'permitted'

  return { currentStage, stages, unmapped: Array.from(new Set(unmapped)) }
}

export function stageDef(key: StageKey): StageDef {
  const def = STAGE_LADDER.find((s) => s.key === key)
  if (!def) throw new Error(`Unknown stage key: ${key}`)
  return def
}

export function expectedListingWindow(stage: StageKey): string {
  switch (stage) {
    case 'permitted':
      return 'Likely 6–9 months away'
    case 'site_prep':
      return 'Likely 5–8 months away'
    case 'foundation':
      return 'Likely 4–6 months away'
    case 'framing':
      return 'Likely 3–5 months away'
    case 'dried_in':
      return 'Likely 2–3 months away'
    case 'finishing':
      return 'Likely 30–60 days away'
    case 'near_listing':
      return 'Likely 2–4 weeks away'
  }
}
