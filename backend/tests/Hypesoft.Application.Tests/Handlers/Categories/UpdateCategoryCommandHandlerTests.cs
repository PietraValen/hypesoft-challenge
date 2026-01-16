using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.Handlers.Categories;
using Hypesoft.Application.Mappings;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Moq;
using Xunit;

namespace Hypesoft.Application.Tests.Handlers.Categories;

public class UpdateCategoryCommandHandlerTests
{
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    private readonly IMapper _mapper;

    public UpdateCategoryCommandHandlerTests()
    {
        _categoryRepositoryMock = new Mock<ICategoryRepository>();

        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = mapperConfig.CreateMapper();
    }

    [Fact]
    public async Task Handle_WithValidCommand_ShouldUpdateCategory()
    {
        // Arrange
        var categoryId = "category123";
        var command = new UpdateCategoryCommand
        {
            Id = categoryId,
            Name = "Updated Category",
            Description = "Updated Description"
        };

        var existingCategory = new Category("Original Category", "Original Description");

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingCategory);

        _categoryRepositoryMock
            .Setup(x => x.UpdateAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var handler = new UpdateCategoryCommandHandler(_categoryRepositoryMock.Object, _mapper);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be(command.Name);
        result.Description.Should().Be(command.Description);
        _categoryRepositoryMock.Verify(x => x.UpdateAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentCategory_ShouldThrowException()
    {
        // Arrange
        var categoryId = "nonexistent";
        var command = new UpdateCategoryCommand
        {
            Id = categoryId,
            Name = "Updated Category",
            Description = "Description"
        };

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category?)null);

        var handler = new UpdateCategoryCommandHandler(_categoryRepositoryMock.Object, _mapper);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            handler.Handle(command, CancellationToken.None));

        _categoryRepositoryMock.Verify(x => x.UpdateAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
