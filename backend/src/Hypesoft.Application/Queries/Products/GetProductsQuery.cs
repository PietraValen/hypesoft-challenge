using Hypesoft.Application.DTOs.Common;
using Hypesoft.Application.DTOs.Products;
using Hypesoft.Domain.Enums;
using MediatR;

namespace Hypesoft.Application.Queries.Products;

public class GetProductsQuery : IRequest<PagedResultDto<ProductDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? CategoryId { get; set; }
    public ProductStatus? Status { get; set; }
}
