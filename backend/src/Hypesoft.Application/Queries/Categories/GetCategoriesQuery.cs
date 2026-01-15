using Hypesoft.Application.DTOs.Categories;
using MediatR;

namespace Hypesoft.Application.Queries.Categories;

public class GetCategoriesQuery : IRequest<IEnumerable<CategoryDto>>
{
}
