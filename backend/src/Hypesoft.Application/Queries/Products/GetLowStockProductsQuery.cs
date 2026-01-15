using Hypesoft.Application.DTOs.Products;
using MediatR;

namespace Hypesoft.Application.Queries.Products;

public class GetLowStockProductsQuery : IRequest<IEnumerable<ProductDto>>
{
}
