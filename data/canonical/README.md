# PCS Core Canonical Development Dataset

## Purpose
The canonical dataset is the authoritative development catalogue for PCS Core.
It exists to provide deterministic, repeatable seed data for local development, integration testing, demonstrations and supplier validation.

## Philosophy
- Deterministic: the same dataset produces the same records every run.
- Idempotent: repeated seed execution updates canonical records and avoids duplicates.
- Supplier independent: no production supplier feeds or credentials are required.
- Business aligned: catalogue names, pricing and inventory are domain-realistic.

## Folder Structure
- dataset.json: manifest and compatibility metadata.
- sports.json: primary sports list.
- categories.json: category taxonomy mapped to sports.
- brands.json: brand catalogue mapped to sports.
- attributes.json: product specification definitions.
- attribute-values.json: canonical specification values for generated product specs.
- products.json: deterministic product generation configuration.
- variants.json: deterministic variant generation profiles.
- inventory.json: warehouse and stock policies.
- pricing.json: supplier cost bands and markup defaults.
- suppliers.json: demonstration supplier records.
- customers.json: deterministic customer generation rules.
- orders.json: deterministic order generation rules.
- media.json: media URL and gallery conventions.

## Naming Conventions
- Codes are uppercase with module prefixes (example: SPORT-TENNIS, CAT-TEN-RACQUETS).
- Slugs are lowercase and kebab-case.
- Order numbers are fixed-width with ORD- prefix.
- Customer emails use canonical pattern: customer-{index}@{domain}.

## SKU Conventions
- Variant SKU format: {productCode}-{optionCode}.
- Product codes are deterministic: PRD-{categoryShort}-{sequence}.
- Option codes are profile-driven (example: SIZE-9, GRIP-L2, PACK-6).

## Versioning Rules
- Update dataset.json version for any breaking data shape or semantics change.
- Minor dataset updates should preserve compatibility with minimumPlatformVersion.
- Major platform changes require revisiting canonical structures before merge.

## Update Procedure
1. Update canonical JSON files in data/canonical.
2. Run npm run seed:reset.
3. Run npm run seed:validate.
4. Review generated report in docs/validation/MVP-002/reports/.
5. Commit dataset changes with report updates.

## Validation Expectations
- Manifest validates before any seed operation.
- Minimum entity counts satisfy MVP-002 thresholds.
- No duplicate SKUs or supplier-product duplicates.
- Every active variant has pricing and inventory.
- Every active product has media.

## Relationship To Supplier Feeds
Canonical data is supplier-neutral and remains the source of truth for development.
Supplier adapters should normalize external feed data into structures compatible with this dataset.
