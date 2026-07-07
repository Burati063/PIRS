using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using PIRS.Models.ReportModel;
using PIRS.Models.UserModel;
using System.Device.Location;
using System.Security.Permissions;

namespace PIRS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [RequestSizeLimit(100_000_000)]
    public class ReportController : ControllerBase
    {
        private readonly IReportRepository _reportRepository;
        private readonly UserManager<AppUser> _userManager;
        private readonly HelperService helperService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ReportController(UserManager<AppUser> userManager,IReportRepository reportRepository,IWebHostEnvironment webHostEnvironment,IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _reportRepository = reportRepository;
            _webHostEnvironment = webHostEnvironment;
            helperService = new HelperService(webHostEnvironment,userManager,httpContextAccessor.HttpContext);
        }
        [HttpPost]
        public async Task<ActionResult<ReportDto<ImageGallery>>> Create([FromForm] ReportDto<IFormFile> reportDto)
        {
            Console.WriteLine(reportDto);
            var report = await helperService.ToModel(reportDto);
            _reportRepository.Add(report);
            return helperService.ToDto(report);
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<ReportDto<ImageGallery>>> Update([FromForm]ReportDto<IFormFile> reportDto)
        {
            var newReport = await helperService.ToModel(reportDto);
            var oldReport = _reportRepository.GetById(reportDto.ReportId);
            if (oldReport == null)
                return NotFound();
            if(oldReport.pictures != null)
            foreach (var img in oldReport.pictures)
            {
                var AbsLocation = Path.Combine(_webHostEnvironment.WebRootPath, img.Image);
                System.IO.File.Delete(AbsLocation);
            }
            oldReport.Title = newReport.Title;
            oldReport.Description = newReport.Description;
            oldReport.User = newReport.User;
            oldReport.Company = newReport.Company;
            oldReport.Contractor = newReport.Contractor;
            oldReport.location = newReport.location;
            oldReport.awardAmount = newReport.awardAmount;
            oldReport.status = newReport.status;
            oldReport.DateTime = newReport.DateTime;
            /*
            if (oldReport.upvotes == null)
                oldReport.upvotes = new List<ReportUpvote>();
            else
                oldReport.upvotes.Clear();
            if (reportDto.upvotes != null)
                foreach (var upvote in reportDto.upvotes)
                {
                    var upv = new ReportUpvote();
                    upv.User = await _userManager.FindByIdAsync(upvote.UserId);
                    upv.Id = upvote.Id;
                    oldReport.upvotes.Add(upv);
                }
            */
            if (newReport.pictures != null)
            {
                if (oldReport.pictures != null)
                {
                    foreach (var img in oldReport.pictures)
                    {
                        var AbsLocation = Path.Combine(_webHostEnvironment.WebRootPath, img.Image);
                        System.IO.File.Delete(AbsLocation);
                    }
                    oldReport.pictures.Clear();
                }
                else
                {
                    oldReport.pictures = new List<ImageGallery>();
                }
                foreach (var pic in newReport.pictures)
                {
                    oldReport.pictures.Add(pic);
                }
            }

            _reportRepository.Update(oldReport);
            return helperService.ToDto(oldReport);
        }
        [HttpPost("Upvote")]
        public async Task<ActionResult<List<ReportUpvote>>> Upvote([FromQuery] int reportId,string userId)
        {
            var report = _reportRepository.GetById(reportId);
            var user = await _userManager.FindByIdAsync(userId);
            if((user == null)|| (report == null)) 
            {
                return NotFound();
            }
            if(report.upvotes !=null)
            {
                report.upvotes.Add(new ReportUpvote() { User=user});
                _reportRepository.Update(report);
            }
            else
            {
                report.upvotes = new List<ReportUpvote>();
                report.upvotes.Add(new ReportUpvote() { User = user });
                _reportRepository.Update(report);

            }
            return report.upvotes;
        }
        [HttpDelete("Upvote")]
        public async Task<ActionResult<List<ReportUpvote>>> DeleteUpvote(int reportId, int upvoteId)
        {
            var report = _reportRepository.GetById(reportId);
            if ((report != null) &&(report.upvotes != null))
            {
                report.upvotes.Remove(report.upvotes.FirstOrDefault(upv=> upv.Id==upvoteId));
                _reportRepository.Update(report);
            }
            else
            {
                return NotFound();
            }
            return report.upvotes;
        }
        [HttpPut("UpdateStatus")]
        public async Task<ActionResult<Report>> UpdateStatus(int reportId, ReportStatus status,string contractorId)
        {
            var contractor = await _userManager.FindByIdAsync(contractorId);
            var report = _reportRepository.GetById(reportId);
            Report res;
            if ((report != null)&&(contractor != null))
            {
                report.Contractor = contractor;
                report.status = status;
                res = _reportRepository.Update(report);
            }
            else
            {
                return NotFound();
            }
            return res;
        }
        [HttpDelete]
        [Authorize]
        public ActionResult<ReportDto<ImageGallery>> Delete(int id)
        {
            Report report = _reportRepository.GetById(id);
            if(report == null)
                return NotFound();
            foreach(var img in report.pictures)
            {
                var AbsLocation = Path.Combine(_webHostEnvironment.WebRootPath, img.Image);
                System.IO.File.Delete(AbsLocation);
            }
            report = _reportRepository.Delete(report);
            return helperService.ToDto(report);
        }
        [HttpGet]
        public ActionResult<List<ReportDto<ImageGallery>>> GetAll() 
        {
            var reports = _reportRepository.GetAll();
            var reportsDto = new List<ReportDto<ImageGallery>>();
            if (reports == null)
                return NotFound();
            foreach (var item in reports)
            {
                var reportDto = helperService.ToDto(item);
                reportsDto.Add(reportDto);
            }
            return reportsDto;
        }
        [HttpGet("{id}",Name ="GetById")]
        [ActionName("GetById")]
        [Authorize]
        public ActionResult<ReportDto<ImageGallery>> GetById(int id)
        {
            var report = _reportRepository.GetById(id);
            if(report==null)
                return NotFound();
            return helperService.ToDto(report);
        }
        [HttpGet("GetByContractor",Name ="GetByContractor")]
        public ActionResult<List<ReportDto<ImageGallery>>> GetByContractor(int id)
        {
            List<ReportDto<ImageGallery>> reportDtos = new List<ReportDto<ImageGallery>>();
            var reports = _reportRepository.GetByContractor(id);
            if(reports == null)
                return NotFound();
            foreach(var item in reports)
            {
                reportDtos.Add( helperService.ToDto(item));
            }
            return reportDtos;
        }
        [HttpGet("GetByUser", Name = "GetByUser")]
        public ActionResult<List<ReportDto<ImageGallery>>> GetByUser(int id)
        {
            List<ReportDto<ImageGallery>> reportDtos = new List<ReportDto<ImageGallery>>();
            var reports = _reportRepository.GetByUser(id);
            if (reports == null)
                return NotFound();
            foreach (var item in reports)
            {
                reportDtos.Add(helperService.ToDto(item));
            }
            return reportDtos;
        }
        [HttpGet("GetByCompany", Name = "GetByCompany")]
        public ActionResult<List<ReportDto<ImageGallery>>> GetByCompnany(int id, ReportStatus reportStatus)
        {
            List<ReportDto<ImageGallery>> reportDtos = new List<ReportDto<ImageGallery>>();
            var reports = _reportRepository.GetByCompany(id,reportStatus);
            if (reports == null)
                return NotFound();
            foreach (var item in reports)
            {
                reportDtos.Add(helperService.ToDto(item));
            }
            return reportDtos;
        }
        /*//**/
        [HttpGet("GetByLocation", Name = "GetByLocation")]
        public ActionResult<List<ReportDto<ImageGallery>>> GetByLocation([FromQuery]GeoCoordinate geoCoordinate)
        {
            List<ReportDto<ImageGallery>> reportDtos = new List<ReportDto<ImageGallery>>();
            var reports = _reportRepository.GetByLocation(geoCoordinate);
            if (reports == null)
                return NotFound();
            foreach (var item in reports)
            {
                reportDtos.Add(helperService.ToDto(item));
            }
            return reportDtos;
        }
        [HttpGet("Sort")]
        public ActionResult Sort([FromQuery] SortReportModel sort)
        {
            var reports = _reportRepository.Sort(sort.CompanyId, sort.GeoCoordinate, sort.Status);
            var reportDtos = new List<ReportDto<ImageGallery>>();
            foreach(Report r in reports)
            {
                reportDtos.Add(helperService.ToDto(r));
            }
            return Ok(reportDtos);
        }

    }

}
