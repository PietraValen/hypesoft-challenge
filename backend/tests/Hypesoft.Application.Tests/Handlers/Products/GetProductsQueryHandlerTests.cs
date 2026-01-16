using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.DTOs.Common;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Application.Mappings;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Enums;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.ValueObjects;
using Moq;
using Xunit;

namespace Hypesoft.Application.Tests.Handlers.Products;

public class GetProductsQueryHandlerTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    private readonly IMapper _mapper;

    public GetProductsQueryHandlerTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
        _categoryRepositoryMock = new Mock<ICategoryRepository>();

        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = mapperConfig.CreateMapper();
    }

    [Fact]
    public async Task Handle_WithPagination_ShouldReturnPagedResults()
    {
        // Arrange
        var query = new GetProductsQuery
        {
            PageNumber = 1,
            PageSize = 10
        };

        var products = new List<Product>
        {
            new Product("Product 1", new Money(100m, "BRL"), "cat1", new StockQuantity(10)),
            new Product("Product 2", new Money(200m, "BRL"), "cat1", new StockQuantity(20))
        };

        var category = new Category("Category 1", "Description");

        _productRepositoryMock
            .Setup(x => x.GetPagedAsync(query.PageNumber, query.PageSize, null, null, It.IsAny<CancellationToken>()))
            .ReturnsAsync((products, products.Count));

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync("cat1", It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        var handler = new GetProductsQueryHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().HaveCount(2);
        result.PageNumber.Should().Be(query.PageNumber);
        result.PageSize.Should().Be(query.PageSize);
        result.TotalCount.Should().Be(2);
    }

    [Fact]
    public async Task Handle_WithCategoryFilter_ShouldFilterByCategory()
    {
        // Arrange
        var categoryId = "cat1";
        var query = new GetProductsQuery
        {
            PageNumber = 1,
            PageSize = 10,
            CategoryId = categoryId
        };

        var products = new List<Product>
        {
            new Product("Product 1", new Money(100m, "BRL"), categoryId, new StockQuantity(10))
        };

        var category = new Category("Category 1", "Description");

        _productRepositoryMock
            .Setup(x => x.GetPagedAsync(query.PageNumber, query.PageSize, categoryId, null, It.IsAny<CancellationToken>()))
            .ReturnsAsync((products, products.Count));

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        var handler = new GetProductsQueryHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().HaveCount(1);
        result.Items.First().CategoryId.Should().Be(categoryId);
    }

    [Fact]
    public async Task Handle_WithStatusFilter_ShouldFilterByStatus()
    {
        // Arrange
        var status = ProductStatus.Active;
        var query = new GetProductsQuery
        {
            PageNumber = 1,
            PageSize = 10,
            Status = status
        };

        var products = new List<Product>
        {
            new Product("Product 1", new Money(100m, "BRL"), "cat1", new StockQuantity(10))
        };

        var category = new Category("Category 1", "Description");

        _productRepositoryMock
            .Setup(x => x.GetPagedAsync(query.PageNumber, query.PageSize, null, status, It.IsAny<CancellationToken>()))
            .ReturnsAsync((products, products.Count));

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync("cat1", It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        var handler = new GetProductsQueryHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().HaveCount(1);
    }
}
