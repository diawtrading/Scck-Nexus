# AGENTS.md

This document guides code‑agents operating in this repository. It defines common build, lint, and test workflows, plus code‑style expectations. It also documents any Cursor or Copilot rules if present.

Note: This copy reflects the current repo state (Node.js backend with an Express API and SQLite). Adaptations may be needed for other stacks.

- Build, Lint, Test Commands
- Code Style Guidelines
- Repository Conventions
- Cursor & Copilot Rules (if present)
- Quick Task Examples

1) Build, lint, test commands
- Install dependencies
  - npm ci
  - If no package-lock.json exists, use npm install
- Build frontend (if exists)
  - npm run build
- Run unit tests (Jest)
  - npm test
- Run a single test by name (Jest)
  - npm test -- -t "Login should succeed"
- Run a single test file
  - npm test -- tests/api/auth.test.js
- Run all tests with a specific pattern (e.g., integration tests)
  - npm test -- -i
- Lint (if ESLint is configured)
  - npm run lint  OR  npx eslint .
- Type checks (if TypeScript is added later)
  - npm run typecheck  (or tsc --noEmit)

- Practical sequencing for deployment gates
  - npm ci && npm run lint && npm test -- -i && npm run build

2) Code style guidelines
- General philosophy
  - Favor clarity, readability, and maintainability over clever tricks.
  - Add comments where intent is not obvious; avoid noise comments.
- Imports and requires
  - Group built‑ins first, then third‑party, then local modules.
  - Use consistent path style: relative or absolute as per project norms.
  - Order: require('fs'), require('path'), require('express'), etc.
- Formatting and indentation
  - Use 4 spaces per indentation level (consistent with server.js).
  - End statements with semicolons; prefer explicit returns.
- Names and types
  - Functions: camelCase (getUser, createOrder).
  - Classes: PascalCase (UserService, ApiController).
  - Constants: ALL_CAPS or camelCase depending on project convention; prefer camelCase for runtime constants and ALL_CAPS for flags.
- Error handling
  - Propagate errors with meaningful messages.
  - In Express, centralize error handling in middleware; avoid leaking stacks to production.
- Async code patterns
  - Use async/await where possible; properly handle try/catch blocks.
  - Return consistent JSON error shapes (e.g., { success: false, error: { code, message } }).
- API design notes
  - Validate inputs with Joi or a similar schema tool used in the repo.
  - Normalize error messages and avoid leaking internal details to clients.
- Testing philosophy
  - Write tests that exercise critical paths, not only happy paths.
  - Use descriptive test names and organize tests by feature area.
- Documentation and comments
  - Document public APIs and modules with brief JSDoc blocks when helpful.
- Security considerations
  - Never log secrets; avoid exposing tokens or passwords in responses.
  - Validate and sanitize all user input; use helmet, rate limiting, and proper CORS rules.
- Versioning and releases
  - Follow semantic versioning where applicable; include release notes in CHANGELOG.md.
- Accessibility and UX notes (where applicable)
  - Consider API ergonomics for other teams consuming the backend.

3) Repository conventions
- File layout guidance
  - Server entry: server.js at repo root.
  - API routes under /api, with separate modules for each resource.
  - Database adapter under db/; ensure a single interface for queries (ERPDatabase in this repo).
- Testing conventions
  - Place tests under tests/ or per-feature under tests/<module>.
  - Use Jest conventions; async tests return promises.
- Logging and observability
  - Use Morgan/Helmet in Express; log enough context for debugging without leaking secrets.
- Migration and data safety
  - Keep a migrations/ directory; guard migrations with idempotent scripts when possible.
- CI hints
  - Prefer repository‑level scripts that can be run locally for reproducibility before pushing.

4) Cursor rules (Cursor integration)
- Cursor rules
  - If a repository includes Cursor rules (.cursor/rules/ or .cursorrules), agents must apply them when modifying code.
  - In this repo, no Cursor rules were detected; include them if you introduce Cursor tooling.

5) Copilot rules
- Copilot instructions
  - If a file .github/copilot-instructions.md exists, follow its guidance for patching and design decisions.
- In this repo, no Copilot rules file detected; add one if Copilot policy is in place.

6) Quick task templates for agents
- Implement a new API endpoint: createResource
- Add unit tests for createResource
- Lint and format before PR
- Update README with API usage examples

7) Examples and sample code snippets
- Node.js common require ordering
  const fs = require('fs');
  const path = require('path');
  const express = require('express');
  const app = express();

8) Final notes
- This AGENTS.md should evolve with the project. Revisit whenever new languages are added, or tooling changes (lint, type checks, CI) become part of the baseline.
