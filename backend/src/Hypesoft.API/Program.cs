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
    var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins")
        .Get<string[]>() ?? new[] { "http://localhost:3000" };

    if (builder.Environment.IsDevelopment())
    {
        // Em Development, permitir origins configuradas + localhost comum
        options.AddPolicy("AllowedOrigins", policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials(); // Necessário para tokens/cookies
        });
    }
    else
    {
        // Em Production, apenas origins específicas
        options.AddPolicy("AllowedOrigins", policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
    }
});

// Application Services (MediatR, AutoMapper, FluentValidation)
builder.Services.AddApplicationServices();

// Infrastructure Services (MongoDB, Repositories)
builder.Services.AddInfrastructure(builder.Configuration);

// Database Seeder
builder.Services.AddScoped<Hypesoft.Infrastructure.Data.Seeders.DatabaseSeeder>();

// Health Checks
builder.Services.AddHealthCheckServices(builder.Configuration);

// Rate Limiting
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

// Swagger
builder.Services.AddSwaggerDocumentation();

// Keycloak Authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = builder.Configuration["Keycloak:Authority"];
        options.Audience = builder.Configuration["Keycloak:Audience"];
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
        
        // Configurações adicionais de validação
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(5)
        };
    });

builder.Services.AddAuthorization(options =>
{
    // Políticas de autorização podem ser adicionadas aqui conforme necessário
    // Exemplo: options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerDocumentation();
}

app.UseHttpsRedirection();

app.UseCors("AllowedOrigins");

// Rate Limiting
app.UseIpRateLimiting();

// Custom Middlewares
app.UseCustomMiddlewares();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed Database (apenas em desenvolvimento)
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var seeder = scope.ServiceProvider.GetRequiredService<Hypesoft.Infrastructure.Data.Seeders.DatabaseSeeder>();
    try
    {
        await seeder.SeedAsync();
        Log.Information("Database seeded successfully");
    }
    catch (Exception ex)
    {
        Log.Warning(ex, "An error occurred while seeding the database");
    }
}

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
