using Hypesoft.Application.DTOs.Categories;
using MediatR;

namespace Hypesoft.Application.Queries.Categories;

public class GetCategoryByIdQuery : IRequest<CategoryDto?>
{
    public string Id { get; set; } = string.Empty;
}
