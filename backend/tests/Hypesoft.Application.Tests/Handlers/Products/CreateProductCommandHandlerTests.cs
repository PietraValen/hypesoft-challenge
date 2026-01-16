using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs.Products;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Application.Mappings;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.ValueObjects;
using Moq;
using Xunit;

namespace Hypesoft.Application.Tests.Handlers.Products;

public class CreateProductCommandHandlerTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    private readonly IMapper _mapper;

    public CreateProductCommandHandlerTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
        _categoryRepositoryMock = new Mock<ICategoryRepository>();

        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = mapperConfig.CreateMapper();
    }

    [Fact]
    public async Task Handle_WithValidCommand_ShouldCreateProduct()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Name = "Test Product",
            Description = "Test Description",
            Price = 100.50m,
            Currency = "BRL",
            CategoryId = "category123",
            StockQuantity = 10
        };

        var category = new Category("Test Category", "Description");
        _categoryRepositoryMock
            .Setup(x => x.ExistsAsync(command.CategoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(command.CategoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        _productRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product p, CancellationToken ct) => p);

        var handler = new CreateProductCommandHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be(command.Name);
        result.Price.Should().Be(command.Price);
        result.CategoryId.Should().Be(command.CategoryId);
        _productRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentCategory_ShouldThrowException()
    {
        // Arrange
        var command = new CreateProductCommand
        {
            Name = "Test Product",
            Price = 100m,
            Currency = "BRL",
            CategoryId = "nonexistent",
            StockQuantity = 10
        };

        _categoryRepositoryMock
            .Setup(x => x.ExistsAsync(command.CategoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var handler = new CreateProductCommandHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => 
            handler.Handle(command, CancellationToken.None));
    }
}
