// CourseReportService.cs — LEGACY MODULE (seeded into the training repo on Day 1)
// Purpose: Day 7 EF Core drill target. Seed exactly as-is, WITHOUT any flaw-tagged comments.
// The scoring key lives in em-provided-items/README.md#day-7 (EM ONLY).
// Early visibility of the code is acceptable: it is her codebase from Day 1, and the
// measurement on Day 7 is the fix plus the PR review, not surprise.

using Microsoft.EntityFrameworkCore;

namespace CourseCompass.Api.Services;

public class CourseReportService
{
    private readonly CourseCompassDbContext _db;

    public CourseReportService(CourseCompassDbContext db)
    {
        _db = db;
    }

    public List<CourseSummary> GetCourseSummariesWithAuthors()
    {
        var result = new List<CourseSummary>();
        var courses = _db.Courses.ToList();
        foreach (var c in courses)
        {
            var author = _db.Authors.Where(a => a.Id == c.AuthorId).FirstOrDefault();
            var ratings = _db.Ratings.Where(r => r.CourseId == c.Id).ToList();
            result.Add(new CourseSummary
            {
                Title = c.Title,
                AuthorName = author.Name,
                AverageRating = ratings.Average(r => r.Stars)
            });
        }
        return result.OrderByDescending(s => s.AverageRating).ToList();
    }

    public List<Course> Search(string term)
    {
        var all = _db.Courses.AsEnumerable();
        return all.Where(c => c.Title.ToLower().Contains(term.ToLower()))
                  .OrderBy(c => c.Title)
                  .ToList();
    }
}
