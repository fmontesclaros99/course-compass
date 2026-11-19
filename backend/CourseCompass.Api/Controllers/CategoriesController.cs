using CourseCompass.Api.Models;
using CourseCompass.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CourseCompass.Api.Controllers;

[ApiController]
[Route("api/categories")]
public sealed class CategoriesController(ICategoryService categories) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CategoryDto>>> GetCategories(CancellationToken cancellationToken)
    {
        return Ok(await categories.GetCategoriesAsync(cancellationToken));
    }
}