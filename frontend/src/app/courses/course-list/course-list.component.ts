import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import type { Course } from '../../models/course.model';
import { getLevelLabel } from '../../utils/course-utils';

/** Shows a list of courses. Emits the course id when a row is clicked. */
@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseListComponent {
  readonly courses = input.required<readonly Course[]>();
  readonly selected = output<Course['id']>();

  protected readonly levelLabel = getLevelLabel;
}