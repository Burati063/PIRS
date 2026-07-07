using System.Device.Location;

namespace PIRS.Models.ReportModel
{
    public class Location : GeoCoordinate
    {
        public int? LocationId { get; set; }
    }
}
