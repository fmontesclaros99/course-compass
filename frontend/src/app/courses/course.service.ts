import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';

import { API_BASE_URL } from '../api-base-url';
import type { CourseDto } from '../models/api-contract';
import type { Course } from '../models/course.model';

/** Loads courses from the API. */
@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly coursesUrl = `${inject(API_BASE_URL)}/courses`;

  /** GET /courses */
  getCourses(): Observable<Course[]> {
    return this.http.get<CourseDto[]>(this.coursesUrl);
  }

  /** GET /courses/{id} */
  getCourse(id: Course['id']): Observable<Course> {
    return this.http.get<CourseDto>(`${this.coursesUrl}/${encodeURIComponent(id)}`);
  }
}