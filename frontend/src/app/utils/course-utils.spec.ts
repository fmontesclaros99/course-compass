import type { Course } from '../models/course.model';
import {
  COURSE_LEVEL_LABELS,
  filterCourses,
  getCourseOrThrow,
  getLevelLabel,
  groupByCategory,
  totalDuration,
} from './course-utils';

const courses: Course[] = [
  {
    id: 'c-101',
    title: 'TypeScript 5 Fundamentals',
    level: 'beginner',
    durationMins: 241,
    author: 'K. Hari',
    category: 'language',
    tags: ['typescript', 'types', 'generics'],
  },
  {
    id: 'c-102',
    title: 'Angular: Unit Testing',
    level: 'intermediate',
    durationMins: 150,
    author: 'Pluralsight',
    category: 'testing',
    tags: ['testing', 'vitest', 'angular-testing-library'],
  },
  {
    id: 'c-105',
    title: 'Multi-tenant Theming with CSS Custom Properties',
    level: 'advanced',
    durationMins: 220,
    author: 'Internal',
    category: 'ui',
    tags: ['theming', 'css', 'tokens'],
  },
];

describe('course-utils', () => {
  it('has a label for every level', () => {
    expect(getLevelLabel('beginner')).toBe('Beginner');
    expect(Object.keys(COURSE_LEVEL_LABELS)).toEqual(['beginner', 'intermediate', 'advanced']);
  });

  it('filters by text (case-insensitive), level and tag', () => {
    expect(filterCourses(courses, { text: 'ANGULAR' }).map((c) => c.id)).toEqual(['c-102']);
    expect(filterCourses(courses, { level: 'advanced' }).map((c) => c.id)).toEqual(['c-105']);
    expect(filterCourses(courses, { tag: 'generics' }).map((c) => c.id)).toEqual(['c-101']);
  });

  it('returns every course for an empty filter', () => {
    expect(filterCourses(courses, {}).length).toBe(3);
  });

  it('sums durations', () => {
    expect(totalDuration(courses)).toBe(611);
    expect(totalDuration([])).toBe(0);
  });

  it('groups courses by category', () => {
    const groups = groupByCategory(courses);
    expect(Object.keys(groups)).toEqual(['language', 'testing', 'ui']);
    expect(groups['testing']?.map((c) => c.id)).toEqual(['c-102']);
  });

  it('finds a course by id or throws', () => {
    expect(getCourseOrThrow(courses, 'c-101').title).toBe('TypeScript 5 Fundamentals');
    expect(() => getCourseOrThrow(courses, 'c-999')).toThrowError('Course not found: c-999');
  });
});