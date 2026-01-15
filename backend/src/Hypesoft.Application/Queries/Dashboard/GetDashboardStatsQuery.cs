using Hypesoft.Application.DTOs.Dashboard;
using MediatR;

namespace Hypesoft.Application.Queries.Dashboard;

public class GetDashboardStatsQuery : IRequest<DashboardStatsDto>
{
}
