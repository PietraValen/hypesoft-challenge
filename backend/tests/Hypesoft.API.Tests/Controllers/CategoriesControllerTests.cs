using FluentAssertions;
using Hypesoft.API.Controllers;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.DTOs.Categories;
using Hypesoft.Application.Queries.Categories;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Hypesoft.API.Tests.Controllers;

public class CategoriesControllerTests
{
    private readonly Mock<IMediator> _mediatorMock;
    private readonly Mock<ILogger<CategoriesController>> _loggerMock;
    private readonly CategoriesController _controller;

    public CategoriesControllerTests()
    {
        _mediatorMock = new Mock<IMediator>();
        _loggerMock = new Mock<ILogger<CategoriesController>>();
        _controller = new CategoriesController(_mediatorMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task GetCategories_ShouldReturnOkResult()
    {
        // Arrange
        var categories = new List<CategoryDto>
        {
            new CategoryDto { Id = "1", Name = "Category 1" },
            new CategoryDto { Id = "2", Name = "Category 2" }
        };

        _mediatorMock
            .Setup(x => x.Send(It.IsAny<GetCategoriesQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(categories);

        // Act
        var result = await _controller.GetCategories();

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetCategoryById_WithExistingId_ShouldReturnOkResult()
    {
        // Arrange
        var categoryDto = new CategoryDto
        {
            Id = "123",
            Name = "Test Category"
        };

        _mediatorMock
            .Setup(x => x.Send(It.IsAny<GetCategoryByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoryDto);

        // Act
        var result = await _controller.GetCategoryById("123");

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetCategoryById_WithNonExistentId_ShouldReturnNotFound()
    {
        // Arrange
        _mediatorMock
            .Setup(x => x.Send(It.IsAny<GetCategoryByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((CategoryDto?)null);

        // Act
        var result = await _controller.GetCategoryById("nonexistent");

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task CreateCategory_WithValidDto_ShouldReturnCreatedResult()
    {
        // Arrange
        var createDto = new CreateCategoryDto
        {
            Name = "New Category",
            Description = "Description"
        };

        var categoryDto = new CategoryDto
        {
            Id = "new123",
            Name = "New Category"
        };

        _mediatorMock
            .Setup(x => x.Send(It.IsAny<CreateCategoryCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoryDto);

        // Act
        var result = await _controller.CreateCategory(createDto);

        // Assert
        result.Should().BeOfType<CreatedAtActionResult>();
    }

    [Fact]
    public async Task CreateCategory_WithDuplicateName_ShouldReturnBadRequest()
    {
        // Arrange
        var createDto = new CreateCategoryDto
        {
            Name = "Existing Category",
            Description = "Description"
        };

        _mediatorMock
            .Setup(x => x.Send(It.IsAny<CreateCategoryCommand>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("Category already exists"));

        // Act
        var result = await _controller.CreateCategory(createDto);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task UpdateCategory_WithValidDto_ShouldReturnOkResult()
    {
        // Arrange
        var updateDto = new UpdateCategoryDto
        {
            Name = "Updated Category",
            Description = "Updated Description"
        };

        var categoryDto = new CategoryDto
        {
            Id = "123",
            Name = "Updated Category"
        };

        _mediatorMock
            .Setup(x => x.Send(It.IsAny<UpdateCategoryCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoryDto);

        // Act
        var result = await _controller.UpdateCategory("123", updateDto);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task UpdateCategory_WithNonExistentId_ShouldReturnNotFound()
    {
        // Arrange
        var updateDto = new UpdateCategoryDto
        {
            Name = "Updated Category",
            Description = "Description"
        };

        _mediatorMock
            .Setup(x => x.Send(It.IsAny<UpdateCategoryCommand>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new KeyNotFoundException("Category not found"));

        // Act
        var result = await _controller.UpdateCategory("nonexistent", updateDto);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task DeleteCategory_WithExistingId_ShouldReturnNoContent()
    {
        // Arrange
        _mediatorMock
            .Setup(x => x.Send(It.IsAny<DeleteCategoryCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(MediatR.Unit.Value);

        // Act
        var result = await _controller.DeleteCategory("123");

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task DeleteCategory_WithNonExistentId_ShouldReturnNotFound()
    {
        // Arrange
        _mediatorMock
            .Setup(x => x.Send(It.IsAny<DeleteCategoryCommand>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new KeyNotFoundException("Category not found"));

        // Act
        var result = await _controller.DeleteCategory("nonexistent");

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task DeleteCategory_WithCategoryInUse_ShouldReturnBadRequest()
    {
        // Arrange
        _mediatorMock
            .Setup(x => x.Send(It.IsAny<DeleteCategoryCommand>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("Category has associated products"));

        // Act
        var result = await _controller.DeleteCategory("123");

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
    }
}
