using CourseCompass.Api.Entities;

namespace CourseCompass.Api.Data;

/// <summary>The courses and categories from db.json, so the API starts with the same data as the json-server mock.</summary>
public static class SeedData
{
    public static IReadOnlyList<Category> Categories { get; } =
    [
        new() { Slug = "language", Label = "Languages" },
        new() { Slug = "testing", Label = "Testing" },
        new() { Slug = "backend", Label = "Backend" },
        new() { Slug = "ui", Label = "UI & Styling" },
    ];

    public static IReadOnlyList<Course> Courses { get; } =
    [
        new() { Id = "c-101", Title = "TypeScript 5 Fundamentals", Level = "beginner", DurationMins = 241, Author = "K. Hari", Category = "language", Tags = ["typescript", "types", "generics"] },
        new() { Id = "c-102", Title = "Angular: Unit Testing", Level = "intermediate", DurationMins = 150, Author = "Pluralsight", Category = "testing", Tags = ["testing", "vitest", "angular-testing-library"] },
        new() { Id = "c-103", Title = "ASP.NET Core Web API Fundamentals", Level = "intermediate", DurationMins = 210, Author = "Pluralsight", Category = "backend", Tags = ["aspnet-core", "web-api", "ef-core"] },
        new() { Id = "c-104", Title = "Responsive Layouts with Tailwind CSS", Level = "beginner", DurationMins = 200, Author = "Internal", Category = "ui", Tags = ["tailwind", "responsive", "css"] },
        new() { Id = "c-105", Title = "Multi-tenant Theming with CSS Custom Properties", Level = "advanced", DurationMins = 220, Author = "Internal", Category = "ui", Tags = ["theming", "css", "tokens"] },
        new() { Id = "c-106", Title = "Entity Framework Core in Action", Level = "intermediate", DurationMins = 190, Author = "Internal", Category = "backend", Tags = ["ef-core", "database", "migrations"] },
    ];
}