using FluentAssertions;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Repositories;
using Xunit;

namespace Hypesoft.Infrastructure.Tests.Repositories;

// Nota: Testes de integração reais com MongoDB requerem MongoDB em execução
// Estes testes validam a estrutura e tipos dos repositórios
public class ProductRepositoryTests
{
    [Fact]
    public void ProductRepository_Type_ShouldImplementIProductRepository()
    {
        // Assert
        typeof(ProductRepository).Should().Implement<IProductRepository>();
    }

    [Fact]
    public void CategoryRepository_Type_ShouldImplementICategoryRepository()
    {
        // Assert
        typeof(CategoryRepository).Should().Implement<ICategoryRepository>();
    }
}
