import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import type { ApiState } from '../../models/api-state';
import type { Course } from '../../models/course.model';
import { getLevelLabel } from '../../utils/course-utils';
import { toApiState } from '../../utils/to-api-state';
import { CourseService } from '../course.service';

/** Detail page for /courses/:id. */
@Component({
  selector: 'app-course-detail',
  imports: [RouterLink],
  templateUrl: './course-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseDetailComponent {
  private readonly courseService = inject(CourseService);

  /** The `:id` route parameter (set by withComponentInputBinding). */
  readonly id = input.required<Course['id']>();

  protected readonly levelLabel = getLevelLabel;

  /** loading → success | error, from GET /courses/{id}; reloads when the id changes. */
  protected readonly state = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.courseService.getCourse(id).pipe(toApiState()))),
    { initialValue: { status: 'loading' } satisfies ApiState<Course> },
  );
}