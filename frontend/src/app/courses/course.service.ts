import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { type Observable, map } from 'rxjs';

import { API_BASE_URL } from '../api-base-url';
import { ApiContractError, type CourseDto } from '../models/api-contract';
import { COURSE_LEVELS, type Course } from '../models/course.model';

/** Converts an API course into the app's Course, rejecting a level the app doesn't know. */
export function toCourse(dto: CourseDto): Course {
  const level = COURSE_LEVELS.find((known) => known === dto.level);
  if (level === undefined) {
    throw new ApiContractError('level', `Course ${dto.id} has an unknown level: ${String(dto.level)}.`);
  }
  return {
    id: dto.id,
    title: dto.title,
    level,
    durationMins: dto.durationMins,
    author: dto.author,
    category: dto.category,
    tags: dto.tags,
  };
}

/** Loads courses from the API. */
@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly coursesUrl = `${inject(API_BASE_URL)}/courses`;

  /** GET /courses */
  getCourses(): Observable<Course[]> {
    return this.http.get<CourseDto[]>(this.coursesUrl).pipe(map((dtos) => dtos.map(toCourse)));
  }

  /** GET /courses/{id} */
  getCourse(id: Course['id']): Observable<Course> {
    return this.http
      .get<CourseDto>(`${this.coursesUrl}/${encodeURIComponent(id)}`)
      .pipe(map(toCourse));
  }
}