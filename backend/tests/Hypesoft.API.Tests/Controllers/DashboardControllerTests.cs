using FluentAssertions;
using Hypesoft.API.Controllers;
using Hypesoft.Application.DTOs.Dashboard;
using Hypesoft.Application.Queries.Dashboard;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Hypesoft.API.Tests.Controllers;

public class DashboardControllerTests
{
    private readonly Mock<IMediator> _mediatorMock;
    private readonly Mock<ILogger<DashboardController>> _loggerMock;
    private readonly DashboardController _controller;

    public DashboardControllerTests()
    {
        _mediatorMock = new Mock<IMediator>();
        _loggerMock = new Mock<ILogger<DashboardController>>();
        _controller = new DashboardController(_mediatorMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task GetDashboardStats_ShouldReturnOkResult()
    {
        // Arrange
        var statsDto = new DashboardStatsDto
        {
            TotalProducts = 100,
            TotalCategories = 10,
            TotalStockValue = 50000m,
            Currency = "BRL",
            LowStockProductsCount = 5,
            OutOfStockProductsCount = 2
        };

        _mediatorMock
            .Setup(x => x.Send(It.IsAny<GetDashboardStatsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(statsDto);

        // Act
        var result = await _controller.GetDashboardStats();

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetLowStockProducts_ShouldReturnOkResult()
    {
        // Arrange
        var products = new List<Application.DTOs.Products.ProductDto>
        {
            new Application.DTOs.Products.ProductDto { Id = "1", Name = "Product 1", StockQuantity = 5 },
            new Application.DTOs.Products.ProductDto { Id = "2", Name = "Product 2", StockQuantity = 3 }
        };

        _mediatorMock
            .Setup(x => x.Send(It.IsAny<Application.Queries.Products.GetLowStockProductsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(products);

        // Act
        var result = await _controller.GetLowStockProducts();

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetProductsByCategory_ShouldReturnOkResult()
    {
        // Arrange
        var categoryProducts = new List<CategoryProductCountDto>
        {
            new CategoryProductCountDto { CategoryId = "cat1", CategoryName = "Category 1", ProductCount = 10 },
            new CategoryProductCountDto { CategoryId = "cat2", CategoryName = "Category 2", ProductCount = 5 }
        };

        _mediatorMock
            .Setup(x => x.Send(It.IsAny<GetProductsByCategoryQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoryProducts);

        // Act
        var result = await _controller.GetProductsByCategory();

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }
}
