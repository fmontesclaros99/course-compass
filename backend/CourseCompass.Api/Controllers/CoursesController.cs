// CoursesController.cs — LEGACY MODULE (seeded into the training repo on Day 1)
// Purpose: Day 6 ASP.NET Core drill target. Seed exactly as-is, WITHOUT any flaw-tagged comments.
// The scoring key lives in em-provided-items/README.md#day-6 (EM ONLY).
// Early visibility of the code is acceptable: it is her codebase from Day 1, and the
// measurement on Day 6 is the fix plus the PR review, not surprise.

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CourseCompass.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly CourseCompassDbContext _db;

    public CoursesController(CourseCompassDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var courses = _db.Courses.ToList();
        return Ok(courses);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var course = _db.Courses.Where(c => c.Id == id).FirstOrDefault();
        return Ok(course);
    }

    [HttpPost]
    public IActionResult Create(Course course)
    {
        try
        {
            _db.Courses.Add(course);
            _db.SaveChangesAsync().Wait();
            return Ok(course);
        }
        catch (Exception)
        {
            return Ok(new { message = "something went wrong" });
        }
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        var course = _db.Courses.Find(id);
        _db.Courses.Remove(course);
        _db.SaveChanges();
        return Ok("deleted");
    }
}
