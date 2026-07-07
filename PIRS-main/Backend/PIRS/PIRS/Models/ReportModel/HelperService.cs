using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query;
using PIRS.Models.UserModel;
using System.ComponentModel.Design;
using System.Data;

namespace PIRS.Models.ReportModel
{
    [NonController]
    public class HelperService
    {
        /*
        * saves images in local file storage wwwroot/images/report
         */
        public readonly IWebHostEnvironment _webHostEnvironment;
        private readonly UserManager<AppUser> _userManager;
        private readonly HttpContext _httpContext;
        public HelperService(IWebHostEnvironment webHostEnvironment, UserManager<AppUser> userManager,HttpContext httpContext)
        {
            _webHostEnvironment = webHostEnvironment;
            _userManager = userManager;
            _httpContext = httpContext;
        }
        public List<ImageGallery> SaveImages(List<IFormFile> images)
        {
            var savedPictures = new List<ImageGallery>();
            string uploadFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Images", "Report");
            if(images != null)
            foreach (var img in images)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + img.FileName;
                var uniqueCFileName = Path.Combine(uploadFolder, fileName);
                using(var filestream = new FileStream(uniqueCFileName, FileMode.Create))
                {
                    img.CopyTo(filestream);   
                }
                var productGallary = new ImageGallery();
                productGallary.Image = Path.Combine("Images", "Report", fileName);
                savedPictures.Add(productGallary);
            }
            return savedPictures;
        }
        public List<ImageGallery> GetImages(List<ImageGallery> images)
        {
            var savedImages = new List<ImageGallery>();
            if(images !=null)
            foreach(var img in images)
            {
                var ImgUrl = _httpContext.Request.Scheme+"://"+_httpContext.Request.Host+"/"+img.Image.Replace("\\","/");
                savedImages.Add(new ImageGallery { Id= img.Id,Image=ImgUrl});
            }
            return savedImages;
        }

        public ReportDto<ImageGallery> ToDto(Report report)
        {

            var reportDto = new ReportDto<ImageGallery>()
            {
                ReportId = report.ReportId,
                Title = report.Title,
                Description = report.Description,
                location = report.location,
                status = report.status,
                DateTime = report.DateTime,
                pictures = GetImages(report.pictures)
            };
            reportDto.upvotes = new List<ReportUpvoteDto>();
            if(report.upvotes !=null)
                foreach(var upv in report.upvotes)
                {
                    reportDto.upvotes.Add(new ReportUpvoteDto() { Id=upv.Id,UserId=upv.User.Id });
                }

            reportDto.CompanyId = report.Company != null ? report.Company.Id : null;
            reportDto.UserId = report.User != null ? report.User.Id : null;
            reportDto.ContractorId = report.Contractor != null ? report.Contractor.Id : null;
            // Calculating the award amount 
            if (report.Company != null)
            {
                if ((!string.IsNullOrEmpty(report.Company.Formula)) && (!report.Company.Formula.Equals("string")))
                {
                    // u - number of upvotes
                    // d - number of days since posting
                    var u = report.upvotes!=null?report.upvotes.Count():0;
                    var d = report.DateTime != null ? (DateTime.Now - report.DateTime).TotalDays : 0;
                    var formula = report.Company.Formula;
                    formula = formula.Replace("u", u.ToString());
                    formula = formula.Replace("U", u.ToString());
                    formula = formula.Replace("d", d.ToString());
                    formula = formula.Replace("D", d.ToString());

                    reportDto.awardAmount = Convert.ToDouble(new DataTable().Compute(formula,string.Empty));
                }
            }
            return reportDto;
        }
        public async Task<Report> ToModel(ReportDto<IFormFile> reportDto)
        {
            var report = new Report()
            {
                ReportId = reportDto.ReportId,
                Title = reportDto.Title,
                Description = reportDto.Description,
                Company = await _userManager.FindByIdAsync(reportDto.CompanyId),
                User = await _userManager.FindByIdAsync(reportDto.UserId),
                Contractor = await _userManager.FindByIdAsync(reportDto.ContractorId),
                location = new Location()
                {
                    Course = reportDto.location != null ? reportDto.location.Course : 0,
                    Speed = reportDto.location != null ?reportDto.location.Speed : 0,
                    Latitude = reportDto.location!=null?reportDto.location.Latitude:0,
                    Longitude = reportDto.location != null ? reportDto.location.Longitude:0,
                    Altitude = reportDto.location != null ? reportDto.location.Altitude:0,
                    HorizontalAccuracy = reportDto.location != null ? reportDto.location.HorizontalAccuracy:0.9,
                    VerticalAccuracy = reportDto.location != null ? reportDto.location.VerticalAccuracy:0.9
                },
                awardAmount = reportDto.awardAmount,
                status = reportDto.status,
                DateTime = DateTime.Now,
                pictures = SaveImages(reportDto.pictures)
            };
            /*
            report.upvotes = new List<ReportUpvote>();
            if(reportDto.upvotes !=null)
            foreach(var upvote in reportDto.upvotes)
            {
                    var upv = new ReportUpvote();
                    upv.User = await _userManager.FindByIdAsync(upvote.UserId);
                    report.upvotes.Add(upv);
            }*/
            return report;
        }

    }
}
