using AutoMapper;
using Hypesoft.Application.DTOs.Products;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public class GetLowStockProductsQueryHandler : IRequestHandler<GetLowStockProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public GetLowStockProductsQueryHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetLowStockProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetLowStockProductsAsync(cancellationToken);
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

        return productDtos;
    }
}
