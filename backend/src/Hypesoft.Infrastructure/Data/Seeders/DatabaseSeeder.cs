using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Enums;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.ValueObjects;

namespace Hypesoft.Infrastructure.Data.Seeders;

public class DatabaseSeeder
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public DatabaseSeeder(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task SeedAsync()
    {
        // Verificar se já existem dados
        var existingCategories = await _categoryRepository.GetAllAsync();
        if (existingCategories.Any())
        {
            return; // Já tem dados, não precisa popular
        }

        // Criar categorias de exemplo
        var electronics = new Category("Eletrônicos", "Produtos eletrônicos e tecnologia");
        var clothing = new Category("Roupas", "Vestuário e acessórios");
        var food = new Category("Alimentos", "Produtos alimentícios");
        var books = new Category("Livros", "Livros e materiais de leitura");

        var savedElectronics = await _categoryRepository.AddAsync(electronics);
        var savedClothing = await _categoryRepository.AddAsync(clothing);
        var savedFood = await _categoryRepository.AddAsync(food);
        var savedBooks = await _categoryRepository.AddAsync(books);

        // Criar produtos de exemplo
        var products = new List<Product>
        {
            new Product(
                "Smartphone Samsung Galaxy",
                new Money(1299.99m, "BRL"),
                savedElectronics.Id,
                new StockQuantity(25),
                "Smartphone Android com 128GB de armazenamento",
                ProductStatus.Active),

            new Product(
                "Notebook Dell Inspiron",
                new Money(3499.99m, "BRL"),
                savedElectronics.Id,
                new StockQuantity(15),
                "Notebook com processador Intel i7 e 16GB RAM",
                ProductStatus.Active),

            new Product(
                "Camiseta Básica",
                new Money(49.90m, "BRL"),
                savedClothing.Id,
                new StockQuantity(100),
                "Camiseta básica de algodão, várias cores",
                ProductStatus.Active),

            new Product(
                "Tênis Esportivo",
                new Money(299.90m, "BRL"),
                savedClothing.Id,
                new StockQuantity(8), // Estoque baixo
                "Tênis esportivo para corrida",
                ProductStatus.Active),

            new Product(
                "Arroz 5kg",
                new Money(24.90m, "BRL"),
                savedFood.Id,
                new StockQuantity(50),
                "Pacote de arroz branco 5kg",
                ProductStatus.Active),

            new Product(
                "Feijão 1kg",
                new Money(8.50m, "BRL"),
                savedFood.Id,
                new StockQuantity(3), // Estoque baixo
                "Pacote de feijão preto 1kg",
                ProductStatus.Active),

            new Product(
                "Livro: Clean Code",
                new Money(89.90m, "BRL"),
                savedBooks.Id,
                new StockQuantity(12),
                "Livro sobre boas práticas de programação",
                ProductStatus.Active),

            new Product(
                "Livro: Domain-Driven Design",
                new Money(99.90m, "BRL"),
                savedBooks.Id,
                new StockQuantity(5), // Estoque baixo
                "Livro sobre Domain-Driven Design",
                ProductStatus.Active)
        };

        foreach (var product in products)
        {
            await _productRepository.AddAsync(product);
        }
    }
}
