using CourseCompass.Api.Models;
using CourseCompass.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CourseCompass.Api.Controllers;

[ApiController]
[Route("api/courses")]
public sealed class CoursesController(ICourseService courses) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CourseDto>>> GetCourses(CancellationToken cancellationToken)
    {
        return Ok(await courses.GetCoursesAsync(cancellationToken));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CourseDto>> GetCourse(string id, CancellationToken cancellationToken)
    {
        var course = await courses.GetCourseAsync(id, cancellationToken);
        return course is null ? NotFound() : Ok(course);
    }

    [HttpPost]
    public async Task<ActionResult<CourseDto>> CreateCourse(CreateCourseDto course, CancellationToken cancellationToken)
    {
        var created = await courses.CreateCourseAsync(course, cancellationToken);
        if (created is null)
        {
            return Problem(
                statusCode: StatusCodes.Status409Conflict,
                title: "Course already exists",
                detail: $"A course titled '{course.Title.Trim()}' already exists.");
        }

        return CreatedAtAction(nameof(GetCourse), new { id = created.Id }, created);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(string id, CancellationToken cancellationToken)
    {
        return await courses.DeleteCourseAsync(id, cancellationToken) ? NoContent() : NotFound();
    }
}