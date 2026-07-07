using System.Device.Location;

namespace PIRS.Models.ReportModel
{
    public class SortReportModel
    {
        public GeoCoordinate? GeoCoordinate { get; set; } = null;
        public string? CompanyId { get; set; }
        public ReportStatus? Status { get; set; }
    }
}
