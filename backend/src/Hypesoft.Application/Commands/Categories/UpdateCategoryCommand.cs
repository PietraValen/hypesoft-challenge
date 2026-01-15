using Hypesoft.Application.DTOs.Categories;
using MediatR;

namespace Hypesoft.Application.Commands.Categories;

public class UpdateCategoryCommand : IRequest<CategoryDto>
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
