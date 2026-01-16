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

public class CreateCategoryCommandHandlerTests
{
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    private readonly IMapper _mapper;

    public CreateCategoryCommandHandlerTests()
    {
        _categoryRepositoryMock = new Mock<ICategoryRepository>();

        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = mapperConfig.CreateMapper();
    }

    [Fact]
    public async Task Handle_WithValidCommand_ShouldCreateCategory()
    {
        // Arrange
        var command = new CreateCategoryCommand
        {
            Name = "New Category",
            Description = "Description"
        };

        _categoryRepositoryMock
            .Setup(x => x.ExistsByNameAsync(command.Name, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        _categoryRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category c, CancellationToken ct) => c);

        var handler = new CreateCategoryCommandHandler(_categoryRepositoryMock.Object, _mapper);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be(command.Name);
        result.Description.Should().Be(command.Description);
        _categoryRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithDuplicateName_ShouldThrowException()
    {
        // Arrange
        var command = new CreateCategoryCommand
        {
            Name = "Existing Category",
            Description = "Description"
        };

        _categoryRepositoryMock
            .Setup(x => x.ExistsByNameAsync(command.Name, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var handler = new CreateCategoryCommandHandler(_categoryRepositoryMock.Object, _mapper);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            handler.Handle(command, CancellationToken.None));

        _categoryRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
