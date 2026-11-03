import type { CourseLevel } from './course.model';

/*
 * Shared API contract: the JSON shapes the CourseCompass API sends.
 * json-server serves these from db.json in Week 1; the ASP.NET Core API
 * implements the same shapes in Week 2.
 */

/** GET /courses, GET /courses/{id} */
export interface CourseDto {
  id: string;
  title: string;
  level: CourseLevel;
  durationMins: number;
  author: string;
  category: string;
  tags: string[];
}

/** GET /categories */
export interface CategoryDto {
  slug: string;
  label: string;
}

/**
 * Every way an API call can fail, as the frontend sees it.
 * Every variant has a message the UI can show; `kind` tells the variants apart.
 */
export type ApiError =
  | { readonly kind: 'network'; readonly message: string }
  | { readonly kind: 'not-found'; readonly message: string }
  | {
      readonly kind: 'validation';
      readonly message: string;
      readonly fieldErrors: Readonly<Record<string, readonly string[]>>;
    }
  | { readonly kind: 'server'; readonly status: number; readonly message: string };