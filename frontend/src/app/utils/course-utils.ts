import { CourseLevel, Course, CourseFilter } from "../models/course.model";
import { findById, groupBy } from "./collection-utils";

export const COURSE_LEVEL_LABELS: Readonly<Record<CourseLevel, string>> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function getLevelLabel(level: CourseLevel): string {
  return COURSE_LEVEL_LABELS[level];
}

export function filterCourses(courses: readonly Course[], filter: CourseFilter): Course[] {
  const text = filter.text?.trim().toLowerCase() ?? '';

  return courses.filter(
    (course) =>
      course.title.toLowerCase().includes(text) &&
      (filter.level === undefined || course.level === filter.level) &&
      (filter.tag === undefined || course.tags.includes(filter.tag)),
  );
}

export function totalDuration(courses: readonly Course[]): number {
  return courses.reduce((total, course) => total + course.durationMins, 0);
}

export function groupByCategory(courses: readonly Course[]): Partial<Record<string, Course[]>> {
  return groupBy(courses, (course) => course.category);
}

export function getCourseOrThrow(courses: readonly Course[], id: Course['id']): Course {
  const found = findById(courses, id);
  if (found === undefined) {
    throw new Error(`Course not found: ${id}`);
  }
  return found;
}