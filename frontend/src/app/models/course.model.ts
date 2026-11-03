import type { ElementOf } from '../utils/type-utils';

/** Every valid level, in display order. The CourseLevel type is derived from this list. */
export const COURSE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

/** Difficulty levels used by the course data (db.json). */
export type CourseLevel = ElementOf<typeof COURSE_LEVELS>;

export interface Course {
  readonly id: string;
  title: string;
  level: CourseLevel;
  durationMins: number;
  author: string;
  category: string;
  tags: readonly string[];
}

export interface CourseFilter {
  text?: string;
  level?: CourseLevel;
  tag?: string;
}