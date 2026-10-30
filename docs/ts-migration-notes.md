# TS Migration Notes — `course-utils.ts` (Day 2)

**Question:** Which runtime conditionals did the type system just replace?

## Short answer

The legacy file had six runtime conditionals. Two of them are replaced by types that make the bad case impossible to write. One is still there, but the compiler forces it, so I can't forget it. The other three stay on purpose, because they depend on data the compiler can't see. All of this rests on removing `any`: the file now has none, and ESLint's `no-explicit-any` rule checks that in CI.

| # | Legacy conditional | Verdict | What does the work now |
|---|---|---|---|
| 1 | `if (course.level == 1/2/3) … return course.level` | **Replaced** | `CourseLevel` union + `Record<CourseLevel, string>` |
| 2 | `c.id == id` and `c.level == query.level` (loose `==`) | **Replaced** | Typed `string` / `CourseLevel` values compared with `===` |
| 3 | `if (!groups[c.category]) groups[c.category] = []` | **Enforced** | `noUncheckedIndexedAccess` types it as `Course[] \| undefined`, so the guard is required |
| 4 | `query.level ? … : true` | **Kept** | Still a runtime check |
| 5 | `query.tag ? … : true` | **Kept** | Still a runtime check |
| 6 | `if (!found) throw new Error('missing')` | **Kept** | Still a runtime check |

## What the types replaced

**1. The level `if` chain and its fallback**

The old `getLevelLabel` checked for `1`, `2` and `3`, and returned the raw value if nothing matched. That's now one lookup in `COURSE_LEVEL_LABELS`, a `Record<CourseLevel, string>`. The fallback is gone because there's no "unknown level" left to fall back to. `CourseLevel` only allows three values, so `getLevelLabel('expert')` doesn't compile. The `Record` also has to define a label for every level. If someone adds a fourth level later, the label map won't compile until it gets one.

This one was also hiding a real bug. The old code compared against `1`, `2` and `3`, but `db.json` stores `"beginner"`, `"intermediate"` and `"advanced"`. None of the branches could ever match, so every course got its raw value back. With the union type, `level === 1` doesn't compile at all (TS2367: the types have no overlap). A runtime `if` couldn't catch this, because the `if` *was* the bug.

**2. Loose equality (`==`) as a safety net**

The old code used `==` for `id` and `level`, which quietly converts types before comparing (`'1' == 1` is `true`). That hid mismatches instead of surfacing them. Now `id` is typed as `Course['id']` (a `string`) and `level` as `CourseLevel`, so both sides of each comparison are known. I use `===`, and comparing the wrong types is a compile error rather than a silent conversion.

**3. The missing-group check (enforced, not removed)**

This check is still in `groupByCategory`, but it's no longer something I have to remember. With `noUncheckedIndexedAccess`, `groups[course.category]` is typed as `Course[] | undefined`, which is the truth: the group might not exist yet. Calling `.push()` on it without the `if (group)` guard doesn't compile. Before, forgetting this check meant a runtime crash. Now, skipping it is impossible.

To me, this is the most useful part of the flag. It doesn't remove the check; it makes leaving it out a compile error.

## Where the types made me *add* a check

The old `filterCourses` called `query.text.toLowerCase()` with no check at all, so it crashed whenever `text` was missing. In `CourseFilter`, `text` is now optional (`text?: string`), so the compiler makes me handle the missing case. `filter.text?.trim().toLowerCase() ?? ''` does that: no text means "match everything".

## What still has to happen at runtime

Conditionals 4–6 stay, because they're about data the compiler can't see:

- **Optional filters** (`filter.level === undefined`, `filter.tag === undefined`). "No filter" is a valid input, not an error. What the types did change is the input itself: `level` can only be one of three valid values, and `tag` is a `string` checked against a `readonly string[]`.
- **Course not found** in `getCourseOrThrow`. Whether an id exists depends on the data, so the throw stays. What changed is that the function now returns `Course` instead of `any`, so callers don't have to guess what they got back.
- **API responses.** Types describe data, they don't validate it. If the API sends `level: "expert"`, TypeScript won't catch it at runtime. That boundary is what the Day 3 API contract (`CourseDto`, `ApiError`) is for.

## Takeaway

Before, the code only worked if everyone remembered to pass the right kind of object and every function remembered to check its input. Now the `Course` type defines the shape in one place, and the compiler checks it everywhere automatically. The runtime checks that are left aren't about types anymore. They answer questions only the actual data can answer, like whether a course with a given id exists.
