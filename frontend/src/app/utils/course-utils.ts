import { CourseLevel, Course, CourseFilter } from "../models/course.model";

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

export function groupByCategory(courses: readonly Course[]): Record<string, Course[]> {
  const groups: Record<string, Course[]> = {};

  for (const course of courses) {
    const group = groups[course.category];
    if (group) {
      group.push(course);
    } else {
      groups[course.category] = [course];
    }
  }

  return groups;
}

export function getCourseOrThrow(courses: readonly Course[], id: Course['id']): Course {
  const found = courses.find((course) => course.id === id);
  if (found === undefined) {
    throw new Error(`Course not found: ${id}`);
  }
  return found;
}