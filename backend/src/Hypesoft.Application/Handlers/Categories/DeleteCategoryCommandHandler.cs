using Hypesoft.Application.Commands.Categories;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Categories;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Unit>
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IProductRepository _productRepository;

    public DeleteCategoryCommandHandler(
        ICategoryRepository categoryRepository,
        IProductRepository productRepository)
    {
        _categoryRepository = categoryRepository;
        _productRepository = productRepository;
    }

    public async Task<Unit> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
        if (category == null)
        {
            throw new KeyNotFoundException($"Category with ID {request.Id} not found");
        }

        // Check if category has products
        var products = await _productRepository.GetByCategoryIdAsync(request.Id, cancellationToken);
        if (products.Any())
        {
            throw new InvalidOperationException(
                $"Cannot delete category '{category.Name}' because it has {products.Count()} associated products");
        }

        await _categoryRepository.DeleteAsync(request.Id, cancellationToken);
        return Unit.Value;
    }
}
