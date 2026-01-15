using MediatR;

namespace Hypesoft.Application.Commands.Categories;

public class DeleteCategoryCommand : IRequest<Unit>
{
    public string Id { get; set; } = string.Empty;
}
