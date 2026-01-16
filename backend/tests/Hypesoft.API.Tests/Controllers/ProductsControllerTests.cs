using FluentAssertions;
using Hypesoft.API.Controllers;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs.Products;
using Hypesoft.Application.Queries.Products;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Hypesoft.API.Tests.Controllers;

public class ProductsControllerTests
{
    private readonly Mock<IMediator> _mediatorMock;
    private readonly Mock<ILogger<ProductsController>> _loggerMock;
    private readonly ProductsController _controller;

    public ProductsControllerTests()
    {
        _mediatorMock = new Mock<IMediator>();
        _loggerMock = new Mock<ILogger<ProductsController>>();
        _controller = new ProductsController(_mediatorMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task GetProducts_ShouldReturnOkResult()
    {
        // Arrange
        var pagedResult = new Application.DTOs.Common.PagedResultDto<ProductDto>
        {
            Items = new List<ProductDto>
            {
                new ProductDto { Id = "1", Name = "Product 1", Price = 100m }
            },
            PageNumber = 1,
            PageSize = 10,
            TotalCount = 1
        };

        _mediatorMock
            .Setup(x => x.Send(It.IsAny<GetProductsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(pagedResult);

        // Act
        var result = await _controller.GetProducts();

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetProductById_WithExistingId_ShouldReturnOkResult()
    {
        // Arrange
        var productDto = new ProductDto
        {
            Id = "123",
            Name = "Test Product",
            Price = 100m
        };

        _mediatorMock
            .Setup(x => x.Send(It.IsAny<GetProductByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(productDto);

        // Act
        var result = await _controller.GetProductById("123");

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetProductById_WithNonExistentId_ShouldReturnNotFound()
    {
        // Arrange
        _mediatorMock
            .Setup(x => x.Send(It.IsAny<GetProductByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((ProductDto?)null);

        // Act
        var result = await _controller.GetProductById("nonexistent");

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task CreateProduct_WithValidDto_ShouldReturnCreatedResult()
    {
        // Arrange
        var createDto = new CreateProductDto
        {
            Name = "New Product",
            Price = 100m,
            Currency = "BRL",
            CategoryId = "category123",
            StockQuantity = 10
        };

        var productDto = new ProductDto
        {
            Id = "new123",
            Name = "New Product",
            Price = 100m
        };

        _mediatorMock
            .Setup(x => x.Send(It.IsAny<CreateProductCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(productDto);

        // Act
        var result = await _controller.CreateProduct(createDto);

        // Assert
        result.Should().BeOfType<CreatedAtActionResult>();
    }

    [Fact]
    public async Task DeleteProduct_WithExistingId_ShouldReturnNoContent()
    {
        // Arrange
        _mediatorMock
            .Setup(x => x.Send(It.IsAny<DeleteProductCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(MediatR.Unit.Value);

        // Act
        var result = await _controller.DeleteProduct("123");

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }
}
