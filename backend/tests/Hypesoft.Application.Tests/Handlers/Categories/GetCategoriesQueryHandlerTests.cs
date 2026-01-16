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

public class GetCategoriesQueryHandlerTests
{
    private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
    private readonly IMapper _mapper;

    public GetCategoriesQueryHandlerTests()
    {
        _categoryRepositoryMock = new Mock<ICategoryRepository>();

        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = mapperConfig.CreateMapper();
    }

    [Fact]
    public async Task Handle_ShouldReturnAllCategories()
    {
        // Arrange
        var query = new GetCategoriesQuery();

        var categories = new List<Category>
        {
            new Category("Category 1", "Description 1"),
            new Category("Category 2", "Description 2"),
            new Category("Category 3", "Description 3")
        };

        _categoryRepositoryMock
            .Setup(x => x.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(categories);

        var handler = new GetCategoriesQueryHandler(_categoryRepositoryMock.Object, _mapper);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(3);
        result.Select(c => c.Name).Should().Contain("Category 1", "Category 2", "Category 3");
    }
}
