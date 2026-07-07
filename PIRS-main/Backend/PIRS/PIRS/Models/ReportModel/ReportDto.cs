using PIRS.Models.UserModel;

namespace PIRS.Models.ReportModel
{
    public class ReportDto<T>
    {
    public int ReportId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? UserId { get; set; }
    public string? CompanyId { get; set; }
    public string? ContractorId { get; set; }
    public Location? location { get; set; }
    public double? awardAmount { get; set; }
    public ReportStatus? status { get; set; } = ReportStatus.newReport;
    public DateTime? DateTime { get; set; }
    public List<ReportUpvoteDto>? upvotes { get; set; }
    public List<T>? pictures { get; set; }
    }
}
