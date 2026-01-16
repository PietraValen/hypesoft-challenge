using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.Handlers.Categories;
using Hypesoft.Application.Mappings;
using Hypesoft.Application.Queries.Categories;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Moq;
using Xunit;

namespace Hypesoft.Application.Tests.Handlers.Categories;

public class GetCategoryByIdQueryHandlerTests
{
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    private readonly IMapper _mapper;

    public GetCategoryByIdQueryHandlerTests()
    {
        _categoryRepositoryMock = new Mock<ICategoryRepository>();

        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = mapperConfig.CreateMapper();
    }

    [Fact]
    public async Task Handle_WithValidId_ShouldReturnCategory()
    {
        // Arrange
        var categoryId = "category123";
        var query = new GetCategoryByIdQuery { Id = categoryId };

        var category = new Category("Test Category", "Description");

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        var handler = new GetCategoryByIdQueryHandler(_categoryRepositoryMock.Object, _mapper);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(category.Id);
        result.Name.Should().Be(category.Name);
        result.Description.Should().Be(category.Description);
    }

    [Fact]
    public async Task Handle_WithNonExistentId_ShouldReturnNull()
    {
        // Arrange
        var categoryId = "nonexistent";
        var query = new GetCategoryByIdQuery { Id = categoryId };

        _categoryRepositoryMock
            .Setup(x => x.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category?)null);

        var handler = new GetCategoryByIdQueryHandler(_categoryRepositoryMock.Object, _mapper);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().BeNull();
    }
}
