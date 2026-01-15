using AutoMapper;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.DTOs.Categories;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Categories;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CategoryDto>
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public CreateCategoryCommandHandler(ICategoryRepository categoryRepository, IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        // Check if category with same name already exists
        var exists = await _categoryRepository.ExistsByNameAsync(request.Name, cancellationToken);
        if (exists)
        {
            throw new InvalidOperationException($"Category with name '{request.Name}' already exists");
        }

        var category = new Domain.Entities.Category(request.Name, request.Description);
        var createdCategory = await _categoryRepository.AddAsync(category, cancellationToken);

        return _mapper.Map<CategoryDto>(createdCategory);
    }
}
