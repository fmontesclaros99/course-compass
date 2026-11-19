namespace CourseCompass.Api.Models;

/// <summary>GET /api/categories. Matches CategoryDto in the frontend's api-contract.ts.</summary>
public sealed record CategoryDto(string Slug, string Label);