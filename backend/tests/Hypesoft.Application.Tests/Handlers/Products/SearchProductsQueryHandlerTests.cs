using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Application.Mappings;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.ValueObjects;
using Moq;
using Xunit;

namespace Hypesoft.Application.Tests.Handlers.Products;

public class SearchProductsQueryHandlerTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    private readonly IMapper _mapper;

    public SearchProductsQueryHandlerTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
        _categoryRepositoryMock = new Mock<ICategoryRepository>();

        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = mapperConfig.CreateMapper();
    }

    [Fact]
    public async Task Handle_WithSearchTerm_ShouldReturnMatchingProducts()
    {
        // Arrange
        var searchTerm = "laptop";
        var query = new SearchProductsQuery { SearchTerm = searchTerm };

        var products = new List<Product>
        {
            new Product("Laptop Dell", new Money(3000m, "BRL"), "cat1", new StockQuantity(5)),
            new Product("Laptop HP", new Money(2500m, "BRL"), "cat1", new StockQuantity(3))
        };

        var category = new Category("Eletrônicos", "Description");

        _productRepositoryMock
            .Setup(x => x.SearchByNameAsync(searchTerm, It.IsAny<CancellationToken>()))
            .ReturnsAsync(products);

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync("cat1", It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        var handler = new SearchProductsQueryHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
        result.All(p => p.Name.ToLower().Contains(searchTerm.ToLower())).Should().BeTrue();
    }

    [Fact]
    public async Task Handle_WithEmptySearchTerm_ShouldReturnEmpty()
    {
        // Arrange
        var searchTerm = "";
        var query = new SearchProductsQuery { SearchTerm = searchTerm };

        _productRepositoryMock
            .Setup(x => x.SearchByNameAsync(searchTerm, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Enumerable.Empty<Product>());

        var handler = new SearchProductsQueryHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }
}
