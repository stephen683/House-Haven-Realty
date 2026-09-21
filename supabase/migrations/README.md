# Migrations

One file per applied migration, named `<version>_<name>.sql`, matching
`supabase_migrations.schema_migrations` on the project exactly. Sorting the
filenames gives true apply order.

## Why the names look like this

These files were reconstructed from the remote ledger on 2026-09-21, after the
repo had drifted to 8 files against 29 applied migrations. The old sequential
names (`003_value_tool.sql`, `005_permit_stages.sql`) also misrepresented
order: `005`–`007` were applied on 20 April, `003`–`004` on 6 May. Timestamp
prefixes remove the ambiguity. `001_initial_schema.sql` keeps its name because
its recorded version really is `001`.

## Rules

- Work applied through the Supabase MCP or the dashboard **must** be committed
  here in the same change. The ledger is not a backup of the repo.
- Never renumber or edit an applied file. History is append-only; correct a
  mistake with a new migration.
- New SQL functions must be closed to browser roles explicitly. Default
  privileges for functions could not be made to exclude PUBLIC on this
  instance — see `20260902185721_close_app_functions_to_browser_roles.sql`,
  whose verify block audits every app-owned function and is the pattern to
  copy.

## Checking for drift

```bash
SUPABASE_ACCESS_TOKEN=<token> node scripts/check-migration-drift.mjs
```

Exits non-zero if anything applied is missing here, or anything here was never
applied.
