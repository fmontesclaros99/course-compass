import type { CategoryDto } from '../models/api-contract';
import type { Course } from '../models/course.model';
import { filterBy, findById, groupBy } from './collection-utils';

const courses: Course[] = [
  {
    id: 'c-101',
    title: 'TypeScript 5 Fundamentals',
    level: 'beginner',
    durationMins: 241,
    author: 'K. Hari',
    category: 'language',
    tags: ['typescript'],
  },
  {
    id: 'c-103',
    title: 'ASP.NET Core Web API Fundamentals',
    level: 'intermediate',
    durationMins: 210,
    author: 'Pluralsight',
    category: 'backend',
    tags: ['aspnet-core'],
  },
  {
    id: 'c-106',
    title: 'Entity Framework Core in Action',
    level: 'intermediate',
    durationMins: 190,
    author: 'Internal',
    category: 'backend',
    tags: ['ef-core'],
  },
];

describe('collection-utils', () => {
  describe('filterBy', () => {
    it('keeps items whose property equals the value', () => {
      expect(filterBy(courses, 'level', 'intermediate').map((c) => c.id)).toEqual(['c-103', 'c-106']);
    });

    it('works with any item type', () => {
      const categories: CategoryDto[] = [
        { slug: 'ui', label: 'UI & Styling' },
        { slug: 'backend', label: 'Backend' },
      ];
      expect(filterBy(categories, 'slug', 'ui')).toEqual([{ slug: 'ui', label: 'UI & Styling' }]);
    });

    it('rejects values of the wrong type at compile time', () => {
      // @ts-expect-error 'expert' is not a CourseLevel
      expect(filterBy(courses, 'level', 'expert')).toEqual([]);
      // @ts-expect-error 'rating' is not a key of Course
      expect(filterBy(courses, 'rating', 5)).toEqual([]);
    });
  });

  describe('findById', () => {
    it('returns the matching item or undefined', () => {
      expect(findById(courses, 'c-103')?.title).toBe('ASP.NET Core Web API Fundamentals');
      expect(findById(courses, 'c-999')).toBeUndefined();
    });

    it('only accepts items that have a string id', () => {
      const categories: CategoryDto[] = [{ slug: 'ui', label: 'UI & Styling' }];
      // @ts-expect-error CategoryDto has no id
      expect(findById(categories, 'ui')).toBeUndefined();
    });
  });

  describe('groupBy', () => {
    it('groups items by the returned key', () => {
      const byLevel = groupBy(courses, (c) => c.level);
      expect(byLevel.intermediate?.map((c) => c.id)).toEqual(['c-103', 'c-106']);
      expect(byLevel.advanced).toBeUndefined();
    });
  });
});