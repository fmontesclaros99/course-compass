import { Routes } from '@angular/router';

import { CourseDetailComponent } from './courses/course-detail/course-detail.component';
import { CourseSearchComponent } from './courses/course-search/course-search.component';

export const routes: Routes = [
  { path: '', component: CourseSearchComponent, title: 'CourseCompass' },
  { path: 'courses/:id', component: CourseDetailComponent, title: 'Course details | CourseCompass' },
  { path: '**', redirectTo: '' },
];