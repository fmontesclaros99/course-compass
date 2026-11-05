import type { CourseDto } from '../models/api-contract';

/** The six courses seeded in db.json, typed against the API contract. Test-only data. */
export const SEED_COURSES: readonly CourseDto[] = [
  { id: 'c-101', title: 'TypeScript 5 Fundamentals', level: 'beginner', durationMins: 241, author: 'K. Hari', category: 'language', tags: ['typescript', 'types', 'generics'] },
  { id: 'c-102', title: 'Angular: Unit Testing', level: 'intermediate', durationMins: 150, author: 'Pluralsight', category: 'testing', tags: ['testing', 'vitest', 'angular-testing-library'] },
  { id: 'c-103', title: 'ASP.NET Core Web API Fundamentals', level: 'intermediate', durationMins: 210, author: 'Pluralsight', category: 'backend', tags: ['aspnet-core', 'web-api', 'ef-core'] },
  { id: 'c-104', title: 'Responsive Layouts with Tailwind CSS', level: 'beginner', durationMins: 200, author: 'Internal', category: 'ui', tags: ['tailwind', 'responsive', 'css'] },
  { id: 'c-105', title: 'Multi-tenant Theming with CSS Custom Properties', level: 'advanced', durationMins: 220, author: 'Internal', category: 'ui', tags: ['theming', 'css', 'tokens'] },
  { id: 'c-106', title: 'Entity Framework Core in Action', level: 'intermediate', durationMins: 190, author: 'Internal', category: 'backend', tags: ['ef-core', 'database', 'migrations'] },
];