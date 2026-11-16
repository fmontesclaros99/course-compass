import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { COURSE_LEVELS, type Course, type CourseLevel } from '../../models/course.model';
import { filterCourses, getLevelLabel } from '../../utils/course-utils';
import { toApiState } from '../../utils/to-api-state';
import { CourseListComponent } from '../course-list/course-list.component';
import { CourseService } from '../course.service';

/** Search page: loads all courses, filters them by title and level, opens the detail page. */
@Component({
  selector: 'app-course-search',
  imports: [CourseListComponent],
  templateUrl: './course-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseSearchComponent {
  private readonly router = inject(Router);

  protected readonly levels = COURSE_LEVELS;
  protected readonly levelLabel = getLevelLabel;

  protected readonly text = signal('');
  protected readonly level = signal<CourseLevel | undefined>(undefined);

  /** loading → success | error, from GET /courses. */
  protected readonly state = toSignal(inject(CourseService).getCourses().pipe(toApiState()), {
    requireSync: true,
  });

  /** The loaded courses that match the search text and level. */
  protected readonly results = computed<Course[]>(() => {
    const state = this.state();
    if (state.status !== 'success') {
      return [];
    }
    const text = this.text();
    const level = this.level();
    return filterCourses(state.data, level === undefined ? { text } : { text, level });
  });

  protected onLevelChange(value: string): void {
    // '' (All levels) matches no level, so find() returns undefined and the filter is cleared.
    this.level.set(COURSE_LEVELS.find((level) => level === value));
  }

  protected openCourse(id: Course['id']): void {
    void this.router.navigate(['/courses', id]);
  }
}