using PIRS.Models.UserModel;

namespace PIRS.Models.ReportModel
{
    public class Report
    {
        public int ReportId {  get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; } 
        public AppUser? User { get; set; } 
        public AppUser? Company { get; set; }
        public AppUser? Contractor { get; set; } 
        public Location? location { get; set; } 
        public double? awardAmount { get; set; } 
        public ReportStatus? status { get; set; } = ReportStatus.newReport;
        public DateTime DateTime { get; set; } = DateTime.Now;
        public List<ReportUpvote>? upvotes { get; set; } 
        public List<ImageGallery>? pictures { get; set; } 
    }
}
