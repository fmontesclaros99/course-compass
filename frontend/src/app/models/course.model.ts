export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

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