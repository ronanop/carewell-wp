# Care Well Medical Centre — Development Workflow

## Purpose

Define the development process, branching strategy, code review practices, and agent workflow for building the CWMC frontend.

## Responsibilities

Establish a repeatable workflow that ensures quality, documentation compliance, and efficient collaboration between developers and AI agents.

## Architecture

### Development Lifecycle

```
1. Read Documentation → 2. Plan Implementation → 3. Build Feature
  → 4. Test Locally → 5. Code Review → 6. Deploy Preview → 7. Merge → 8. Production
```

### Branch Strategy

| Branch | Purpose | Deploys To |
|--------|---------|-----------|
| `main` | Production-ready code | Production (Vercel) |
| `develop` | Integration branch | Staging preview |
| `feature/{name}` | New features | PR preview |
| `fix/{name}` | Bug fixes | PR preview |

### Agent Workflow (Cursor AI)

Every AI agent session must follow this sequence:

1. **Read** relevant docs from `docs/` before writing any code.
2. **Read** applicable skills from `skills/` for domain guidance.
3. **Follow** Cursor rules in `.cursor/rules/` automatically.
4. **Implement** only what is requested — no scope creep.
5. **Verify** with `npm run lint` and `npm run build`.
6. **Do not** create CMS, APIs, auth, or backend services.

### Local Development Setup

```bash
# Clone repository
git clone <repo-url>
cd carewell-next

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with WordPress GraphQL URL

# Start development server
npm run dev

# Run linting
npm run lint

# Production build test
npm run build
```

## Best Practices

- Read `docs/01_PROJECT_OVERVIEW.md` at the start of every new feature.
- Consult route-specific docs before implementing pages.
- One feature per PR — keep changes focused and reviewable.
- Test WordPress GraphQL queries in GraphiQL before adding to codebase.
- Run production build locally before pushing.

## Folder Examples

```
docs/                          # Read before coding
skills/                        # Domain-specific agent guidance
.cursor/rules/                 # Automatic AI agent rules
.env.example                   # Environment template
```

## Naming Conventions

- Feature branches: `feature/service-listing-page`.
- Fix branches: `fix/blog-pagination-error`.
- PR titles: `[Feature] Add service listing page` or `[Fix] Resolve blog pagination`.
- Commit messages: conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`).

## Production Recommendations

- Require PR review before merge to `main`.
- Vercel Preview Deployments on every PR for visual QA.
- WordPress staging environment for testing content integration.
- Document any deviation from architecture in relevant `docs/` file.

## Common Mistakes

- Starting implementation without reading project documentation.
- Building multiple features in one PR.
- Skipping local build test before pushing.
- Modifying WordPress from the Next.js project.
- Adding dependencies without updating `docs/03_TECH_STACK.md`.

## Scalability Considerations

- Feature branches enable parallel development by multiple agents/developers.
- Documentation-driven development scales knowledge across team changes.
- Preview deployments catch integration issues before production.

## Do's

- Start every session by reading relevant documentation.
- Keep PRs small and focused (under 400 lines changed).
- Update documentation when making architectural changes.
- Test on mobile viewport during development.

## Don'ts

- Do not push directly to `main` without PR review.
- Do not skip documentation reading step.
- Do not install packages without justification.
- Do not modify `.cursor/rules/` without team agreement.
- Do not proceed to implementation when requirements are unclear — ask first.

## Future Expansion

- GitHub Actions CI: lint, type-check, build, Lighthouse audit.
- Automated PR description generation from commit messages.
- Staging environment with WordPress content sync.
- Release notes automation from conventional commits.
