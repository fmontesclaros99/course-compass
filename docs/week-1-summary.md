# Week 1 summary: TypeScript depth + testing foundation

Week 1 built the CourseCompass frontend on a fullstack scaffold: strict TypeScript, shared API contract types, a Vitest + Angular Testing Library harness, and a search → list → detail feature running on the json-server mock.

## What I built each day

| Day | Focus | What landed | PR |
|---|---|---|---|
| 1 | Setup | Angular 19 + ASP.NET Core (.NET 8) scaffold, json-server mock (`db.json`), CI for both apps, branch protection | [#1](https://github.com/fmontesclaros99/course-compass/pull/1) |
| 2 | TypeScript I | Legacy `course-utils.ts` converted to strict TypeScript; [migration notes](ts-migration-notes.md) | [#2](https://github.com/fmontesclaros99/course-compass/pull/2) |
| 3 | TypeScript II | Generic helpers (`filterBy`, `findById`, `groupBy`), `ApiState<T>` discriminated union, `CourseLevel` derived from `COURSE_LEVELS`, `exactOptionalPropertyTypes`, API contract types (`CourseDto`, `CategoryDto`, `ApiError`) | [#3](https://github.com/fmontesclaros99/course-compass/pull/3) |
| 4 | Testing I | Karma/Jasmine replaced with Vitest + Angular Testing Library, `CourseService`, `CourseListComponent`, type-check step in CI, CI on every PR | [#4](https://github.com/fmontesclaros99/course-compass/pull/4) |
| 5 | Integration I | Search → list → detail feature on the json-server mock, component tests, UI polish, CI checks required on `main`. Review fixes: DTO mapping with level validation and an injected API base URL (#4), `filterBy` limited to primitive properties (#3) | Day 5 PR |

## By the numbers
- **Tests:** 41 across 10 spec files, all passing. They cover the utilities, models, service, the API state helper, the app shell, and the course list, search and detail components.
- **CI:** `frontend-ci` (lint, type-check, tests, production build) and `backend-ci` (restore, build) run on every PR. Both are required to merge into `main`.
- **PRs:** #1–#3 squash-merged into `main`. #4 and the Day 5 PR are in review.
- **`any` in app code:** none. ESLint's `no-explicit-any` rule checks this in CI.

## What strict types caught
The legacy `getLevelLabel` compared `course.level` with `1`, `2` and `3`, but `db.json` stores `"beginner"`, `"intermediate"` and `"advanced"`. No branch could ever match. With `CourseLevel` as a string union, `level === 1` doesn't compile (TS2367). A runtime check couldn't catch this, because the check itself was the bug.

## Baseline scores (Day 1)
| Assessment | Baseline |
|---|---|
| Pluralsight Skill IQ: TypeScript | 87 |
| Pluralsight Skill IQ: Angular 15 | 137 |
| Pluralsight Skill IQ: ASP.NET Core 6 Web API | 81 |

## Next week
Week 2 builds the ASP.NET Core API that replaces the json-server mock: controllers, DTOs and validation (Day 6), EF Core and the database (Day 7), and wiring the frontend to the API (Day 8). Then fullstack testing and coverage (Day 9) and the walkthrough (Day 10). The API implements the contract types from Day 3.