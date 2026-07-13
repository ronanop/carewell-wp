# GraphQL Skill — Care Well Medical Centre

## When to Use

Apply when writing GraphQL queries, fragments, fetchers, or debugging WordPress data fetching.

## Core Rules

- All GraphQL operations in `lib/wordpress/` — organized by type.
- Each query file exports: query string constant + async fetcher function.
- Use **fragments** for field sets used in 2+ queries.
- Use **cursor-based pagination** (`first`/`after`) — never offset.
- Use **variables** for all dynamic values — never string interpolation.
- Wrap fetchers with error handling and typed responses.
- Use React `cache()` to deduplicate identical queries in one render.

## File Organization

```
lib/wordpress/
├── client.ts              # graphql-request singleton
├── queries/               # Query strings + fetcher functions
├── fragments/             # Reusable field selections
└── mappers/               # Raw → typed transformations
```

## Naming Conventions

- Query constants: `GET_{ACTION}_{ENTITY}_QUERY`
- Fetcher functions: `get{Entity}()` or `get{Entity}By{Field}()`
- Fragments: `{NAME}_FRAGMENT`
- GraphQL fragment names: PascalCase (`fragment SeoFields on ...`)

## Standard Fragments

- `FeaturedImageFields` — sourceUrl, altText, mediaDetails
- `SeoFields` — title, metaDesc, opengraphTitle, opengraphDescription, opengraphImage
- `AuthorFields` — name, slug, avatar
- `ContentFields` — content (HTML), excerpt
- `CategoryFields` — name, slug, count

## Do's

- Test every query in WordPress GraphiQL IDE first.
- Request only fields needed for the specific view.
- Type all responses with TypeScript interfaces.
- Log query errors server-side with context.

## Don'ts

- Do not use GraphQL mutations — read-only integration.
- Do not inline GraphQL in component files.
- Do not fetch WordPress data in Client Components.
- Do not assume field names — verify in GraphiQL.

## Reference

Read `docs/11_GRAPHQL_STRUCTURE.md` and `docs/10_WORDPRESS_INTEGRATION.md`.
