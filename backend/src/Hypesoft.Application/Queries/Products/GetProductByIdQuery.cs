using Hypesoft.Application.DTOs.Products;
using MediatR;

namespace Hypesoft.Application.Queries.Products;

public class GetProductByIdQuery : IRequest<ProductDto?>
{
    public string Id { get; set; } = string.Empty;
}
