using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs.Products;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Application.Mappings;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Enums;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.ValueObjects;
using Moq;
using Xunit;

namespace Hypesoft.Application.Tests.Handlers.Products;

public class UpdateProductCommandHandlerTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    private readonly IMapper _mapper;

    public UpdateProductCommandHandlerTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
        _categoryRepositoryMock = new Mock<ICategoryRepository>();

        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = mapperConfig.CreateMapper();
    }

    [Fact]
    public async Task Handle_WithValidCommand_ShouldUpdateProduct()
    {
        // Arrange
        var productId = "product123";
        var categoryId = "category123";
        var command = new UpdateProductCommand
        {
            Id = productId,
            Name = "Updated Product",
            Description = "Updated Description",
            Price = 200.50m,
            Currency = "BRL",
            CategoryId = categoryId,
            Status = ProductStatus.Active
        };

        var existingProduct = new Product(
            "Original Product",
            new Money(100m, "BRL"),
            categoryId,
            new StockQuantity(10),
            "Original Description");

        var category = new Category("Test Category", "Description");

        _productRepositoryMock
            .Setup(x => x.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingProduct);

        _categoryRepositoryMock
            .Setup(x => x.ExistsAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        _productRepositoryMock
            .Setup(x => x.UpdateAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var handler = new UpdateProductCommandHandler(
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
        _productRepositoryMock.Verify(x => x.UpdateAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentProduct_ShouldThrowException()
    {
        // Arrange
        var productId = "nonexistent";
        var command = new UpdateProductCommand
        {
            Id = productId,
            Name = "Updated Product",
            Price = 200m,
            Currency = "BRL",
            CategoryId = "category123",
            Status = ProductStatus.Active
        };

        _productRepositoryMock
            .Setup(x => x.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        var handler = new UpdateProductCommandHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_WithInvalidCategory_ShouldThrowException()
    {
        // Arrange
        var productId = "product123";
        var invalidCategoryId = "nonexistent";
        var command = new UpdateProductCommand
        {
            Id = productId,
            Name = "Updated Product",
            Price = 200m,
            Currency = "BRL",
            CategoryId = invalidCategoryId,
            Status = ProductStatus.Active
        };

        var existingProduct = new Product(
            "Original Product",
            new Money(100m, "BRL"),
            "oldCategory",
            new StockQuantity(10),
            "Original Description");

        _productRepositoryMock
            .Setup(x => x.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingProduct);

        _categoryRepositoryMock
            .Setup(x => x.ExistsAsync(invalidCategoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var handler = new UpdateProductCommandHandler(
            _productRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _mapper);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            handler.Handle(command, CancellationToken.None));
    }
}
