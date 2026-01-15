using FluentValidation;
using Hypesoft.Application.Interfaces;
using Hypesoft.Application.Mappings;
using Hypesoft.Infrastructure.Configurations;
using MediatR;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using MongoDB.Driver;
using System.Reflection;

namespace Hypesoft.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // MediatR
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Application.Commands.Products.CreateProductCommand).Assembly));

        // AutoMapper
        services.AddAutoMapper(typeof(MappingProfile));

        // FluentValidation
        services.AddValidatorsFromAssembly(typeof(Application.Commands.Products.CreateProductCommand).Assembly);

        // Current User Service (placeholder - will be implemented with Keycloak)
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        return services;
    }

    public static IServiceCollection AddHealthCheckServices(this IServiceCollection services, IConfiguration configuration)
    {
        // MongoDB health check - will be configured when correct package version is available
        services.AddHealthChecks();

        return services;
    }
}

// Placeholder implementation - will be replaced with Keycloak integration
public class CurrentUserService : ICurrentUserService
{
    public string? UserId => null;
    public string? UserName => null;
    public bool IsAuthenticated => false;
    public IEnumerable<string> Roles => Enumerable.Empty<string>();
}
