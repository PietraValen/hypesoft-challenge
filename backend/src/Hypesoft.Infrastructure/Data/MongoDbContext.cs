using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Hypesoft.Infrastructure.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MongoDB") 
            ?? throw new InvalidOperationException("MongoDB connection string is not configured");
        
        var client = new MongoClient(connectionString);
        var databaseName = configuration["MongoDB:DatabaseName"] ?? "hypesoft";
        _database = client.GetDatabase(databaseName);

        CreateIndexes();
    }

    public IMongoCollection<T> GetCollection<T>(string collectionName)
    {
        return _database.GetCollection<T>(collectionName);
    }

    private void CreateIndexes()
    {
        // Product indexes
        var productsCollection = _database.GetCollection<Domain.Entities.Product>("products");
        
        var productNameIndex = new CreateIndexModel<Domain.Entities.Product>(
            Builders<Domain.Entities.Product>.IndexKeys.Text(p => p.Name),
            new CreateIndexOptions { Name = "product_name_text" });
        
        var productCategoryIndex = new CreateIndexModel<Domain.Entities.Product>(
            Builders<Domain.Entities.Product>.IndexKeys.Ascending(p => p.CategoryId),
            new CreateIndexOptions { Name = "product_category_index" });
        
        var productStatusIndex = new CreateIndexModel<Domain.Entities.Product>(
            Builders<Domain.Entities.Product>.IndexKeys.Ascending(p => p.Status),
            new CreateIndexOptions { Name = "product_status_index" });

        productsCollection.Indexes.CreateMany(new[] 
        { 
            productNameIndex, 
            productCategoryIndex, 
            productStatusIndex 
        });

        // Category indexes
        var categoriesCollection = _database.GetCollection<Domain.Entities.Category>("categories");
        
        var categoryNameIndex = new CreateIndexModel<Domain.Entities.Category>(
            Builders<Domain.Entities.Category>.IndexKeys.Ascending(c => c.Name),
            new CreateIndexOptions { Name = "category_name_index", Unique = true });

        categoriesCollection.Indexes.CreateOne(categoryNameIndex);
    }
}
