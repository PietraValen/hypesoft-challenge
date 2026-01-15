using Hypesoft.Application.DTOs.Dashboard;
using Hypesoft.Application.Queries.Dashboard;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Dashboard;

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public GetDashboardStatsQueryHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        var totalProducts = await _productRepository.CountAsync(cancellationToken);
        var totalCategories = await _categoryRepository.CountAsync(cancellationToken);
        var lowStockProducts = await _productRepository.GetLowStockProductsAsync(cancellationToken);
        var allProducts = await _productRepository.GetAllAsync(cancellationToken);

        var lowStockCount = lowStockProducts.Count();
        var outOfStockCount = allProducts.Count(p => p.IsOutOfStock());
        var totalStockValue = allProducts
            .Where(p => p.Status == Domain.Enums.ProductStatus.Active)
            .Sum(p => p.Price.Amount * p.StockQuantity.Quantity);

        return new DashboardStatsDto
        {
            TotalProducts = (int)totalProducts,
            TotalCategories = (int)totalCategories,
            TotalStockValue = totalStockValue,
            Currency = "BRL",
            LowStockProductsCount = lowStockCount,
            OutOfStockProductsCount = outOfStockCount
        };
    }
}
