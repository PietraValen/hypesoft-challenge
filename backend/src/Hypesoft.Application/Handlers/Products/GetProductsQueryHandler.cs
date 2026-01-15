using AutoMapper;
using Hypesoft.Application.DTOs.Common;
using Hypesoft.Application.DTOs.Products;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, PagedResultDto<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public GetProductsQueryHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<PagedResultDto<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var (products, totalCount) = await _productRepository.GetPagedAsync(
            request.PageNumber,
            request.PageSize,
            request.CategoryId,
            request.Status,
            cancellationToken);

        var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products).ToList();

        // Enrich with category names
        var categoryIds = productDtos.Select(p => p.CategoryId).Distinct().ToList();
        var categories = await Task.WhenAll(
            categoryIds.Select(id => _categoryRepository.GetByIdAsync(id, cancellationToken)));

        var categoryDict = categories
            .Where(c => c != null)
            .ToDictionary(c => c!.Id, c => c!.Name);

        foreach (var productDto in productDtos)
        {
            if (categoryDict.TryGetValue(productDto.CategoryId, out var categoryName))
            {
                productDto.CategoryName = categoryName;
            }
        }

        return new PagedResultDto<ProductDto>
        {
            Items = productDtos,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };
    }
}
