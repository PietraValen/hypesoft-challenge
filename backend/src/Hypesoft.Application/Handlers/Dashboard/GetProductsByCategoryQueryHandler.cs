using AutoMapper;
using Hypesoft.Application.DTOs.Dashboard;
using Hypesoft.Application.Queries.Dashboard;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Dashboard;

public class GetProductsByCategoryQueryHandler : IRequestHandler<GetProductsByCategoryQuery, IEnumerable<CategoryProductCountDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public GetProductsByCategoryQueryHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryProductCountDto>> Handle(
        GetProductsByCategoryQuery request,
        CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetAllAsync(cancellationToken);
        var allProducts = await _productRepository.GetAllAsync(cancellationToken);

        var result = categories.Select(category =>
        {
            var productCount = allProducts.Count(p => p.CategoryId == category.Id);
            return new CategoryProductCountDto
            {
                CategoryId = category.Id,
                CategoryName = category.Name,
                ProductCount = productCount
            };
        }).ToList();

        return result;
    }
}
