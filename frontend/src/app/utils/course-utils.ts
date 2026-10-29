 // course-utils.ts — LEGACY MODULE, pre-strict (seeded into the training repo on Day 1)
 // Purpose: Day 2 TypeScript strict-conversion target. Seed exactly as-is.
 // Expected end-state lives in em-provided-items/README.md#day-2 (EM ONLY).
 
 export function getLevelLabel(course: any) {
   if (course.level == 1) return 'Beginner';
   if (course.level == 2) return 'Intermediate';
   if (course.level == 3) return 'Advanced';
   return course.level;
 }
 
 export function filterCourses(courses: any[], query: any) {
   return courses.filter(c =>
     c.title.toLowerCase().includes(query.text.toLowerCase()) &&
     (query.level ? c.level == query.level : true) &&
     (query.tag ? c.tags.includes(query.tag) : true)
   );
 }
 
 export function totalDuration(courses: any[]) {
   let total = 0;
   for (const c of courses) total += c.durationMins;
   return total;
 }
 
 export function groupByCategory(courses: any[]) {
   const groups = {};
   for (const c of courses) {
     if (!groups[c.category]) groups[c.category] = [];
     groups[c.category].push(c);
   }
   return groups;
 }
 
 export function getCourseOrThrow(courses: any[], id: any) {
   const found = courses.find(c => c.id == id);
   if (!found) throw new Error('missing');
   return found;
 }