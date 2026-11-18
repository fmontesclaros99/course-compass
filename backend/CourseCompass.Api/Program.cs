using CourseCompass.Api.Services;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;

var builder = WebApplication.CreateBuilder(args);

// In-memory data until EF Core arrives on Day 7. Singletons, so the data lives as long as the app.
builder.Services.AddSingleton<ICourseService, InMemoryCourseService>();
builder.Services.AddSingleton<ICategoryService, InMemoryCategoryService>();

// Validation errors use the JSON property names ("title", not "Title"), matching the frontend's fieldErrors.
builder.Services.AddControllers(options =>
    options.ModelMetadataDetailsProviders.Add(new SystemTextJsonValidationMetadataProvider()));

// Every error response (400, 404, 409, 500) is a ProblemDetails body.
builder.Services.AddProblemDetails();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// First in the pipeline, so it catches exceptions from everything after it: logs them and returns a 500 ProblemDetails.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.MapControllers();

app.Run();