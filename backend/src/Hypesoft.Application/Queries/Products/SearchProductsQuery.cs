using Hypesoft.Application.DTOs.Products;
using MediatR;

namespace Hypesoft.Application.Queries.Products;

public class SearchProductsQuery : IRequest<IEnumerable<ProductDto>>
{
    public string SearchTerm { get; set; } = string.Empty;
}
