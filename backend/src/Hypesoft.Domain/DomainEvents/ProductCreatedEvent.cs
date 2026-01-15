using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.DomainEvents;

public class ProductCreatedEvent
{
    public Product Product { get; }
    public DateTime OccurredOn { get; }

    public ProductCreatedEvent(Product product)
    {
        Product = product;
        OccurredOn = DateTime.UtcNow;
    }
}
