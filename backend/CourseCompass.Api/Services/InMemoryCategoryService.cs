using CourseCompass.Api.Data;
using CourseCompass.Api.Models;

namespace CourseCompass.Api.Services;

/// <summary>Serves the seed categories until EF Core arrives on Day 7. Read-only, so no lock is needed.</summary>
public sealed class InMemoryCategoryService : ICategoryService
{
    public Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default)
    {
        IReadOnlyList<CategoryDto> categories = SeedData.Categories.Select(c => c.ToDto()).ToList();
        return Task.FromResult(categories);
    }
}