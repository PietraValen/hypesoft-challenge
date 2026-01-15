using Hypesoft.Application.DTOs.Categories;
using MediatR;

namespace Hypesoft.Application.Commands.Categories;

public class CreateCategoryCommand : IRequest<CategoryDto>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
