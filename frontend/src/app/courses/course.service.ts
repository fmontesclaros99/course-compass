import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';

import type { CourseDto } from '../models/api-contract';
import type { Course } from '../models/course.model';

/** json-server (npm run mock:api) serves db.json on this port. */
export const COURSES_API_URL = 'http://localhost:3000/courses';

/** Loads courses from the API. */
@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly http = inject(HttpClient);

  /** GET /courses */
  getCourses(): Observable<Course[]> {
    return this.http.get<CourseDto[]>(COURSES_API_URL);
  }
}