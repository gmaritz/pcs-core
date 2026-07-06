
---

## Prisma Workflow

When a specification requires Prisma schema changes, use this sequence:

1. Stop active dev/watch processes (for example `npm run dev`).
2. Create and apply a migration:

```bash
npm run prisma:migrate -- --name <migration_name>
```

3. Regenerate Prisma Client:

```bash
npm run prisma:generate
```

4. Validate TypeScript compilation:

```bash
npm run build
```

5. Start the dev server again.

Note:
On Windows/OneDrive, active Node watch processes can lock Prisma engine files and cause `EPERM` rename errors during `prisma generate`.
