using AspNetCoreRateLimit;
using Hypesoft.API.Extensions;
using Hypesoft.Infrastructure.Configurations;
using Serilog;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "Hypesoft.API")
    .WriteTo.Console()
    .WriteTo.File("logs/hypesoft-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Application Services (MediatR, AutoMapper, FluentValidation)
builder.Services.AddApplicationServices();

// Infrastructure Services (MongoDB, Repositories)
builder.Services.AddInfrastructure(builder.Configuration);

// Health Checks
builder.Services.AddHealthCheckServices(builder.Configuration);

// Rate Limiting
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

// Swagger
builder.Services.AddSwaggerDocumentation();

// Keycloak Authentication (commented out for now - will be configured later)
// builder.Services.AddAuthentication("Bearer")
//     .AddJwtBearer("Bearer", options =>
//     {
//         options.Authority = builder.Configuration["Keycloak:Authority"];
//         options.Audience = builder.Configuration["Keycloak:Audience"];
//         options.RequireHttpsMetadata = false; // Set to true in production
//     });

// builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerDocumentation();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

// Rate Limiting
app.UseIpRateLimiting();

// Custom Middlewares
app.UseCustomMiddlewares();

// Authentication & Authorization
// app.UseAuthentication();
// app.UseAuthorization();

app.MapControllers();

// Health Checks
app.MapHealthChecks("/health", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var result = System.Text.Json.JsonSerializer.Serialize(new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                exception = e.Value.Exception?.Message,
                duration = e.Value.Duration.ToString()
            })
        });
        await context.Response.WriteAsync(result);
    }
});

app.MapHealthChecks("/health/ready");
app.MapHealthChecks("/health/live");

try
{
    Log.Information("Starting Hypesoft API");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
