using Microsoft.AspNetCore.Components.Routing;
using System.Device;
using System.Device.Location;
using System.Reflection;

namespace PIRS.Models.ReportModel
{
    public interface IReportRepository
    {
        void Add(Report report);
        Report Update(Report report);
        Report Delete (Report report);
        List<Report> GetAll();
        Report GetById(int id);
        List<Report> GetByUser(int id);
        List<Report> GetByCompany(int id);
        List<Report> GetByCompany(int id,ReportStatus status);
        List<Report> GetByContractor(int id);
        List<Report> GetByLocation(GeoCoordinate location);
        //sorts on all parameters compnay, dateTime, Upvotes, location, status 
        List<Report> Sort(string? companyId, GeoCoordinate? geoCoordinate, ReportStatus? status);
    }
}
