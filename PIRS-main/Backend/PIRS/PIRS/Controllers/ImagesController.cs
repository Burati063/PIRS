using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PIRS.Models.ReportModel;
using PIRS.Models.UserModel;
using static System.Net.Mime.MediaTypeNames;

namespace PIRS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IWebHostEnvironment webHostEnvironment;
        private readonly UserManager<AppUser> _userManager;
        public ImagesController(IWebHostEnvironment webHostEnvironment,UserManager<AppUser> userManager)
        {
            this.webHostEnvironment = webHostEnvironment;
            this._userManager = userManager;
        }

        [HttpGet]
        public IActionResult GetImage(string id)
        {
            var pathToFile = Path.Combine(webHostEnvironment.WebRootPath, "Images");
            pathToFile = Path.Combine(pathToFile, id);
            var stream = System.IO.File.OpenRead(pathToFile);
            return File(stream,  "image/"+id.Substring(id.IndexOf(".")));
        }
        [HttpPost("PostCompanyLogo")]
        public async Task<IActionResult> PostCompanyLogo(string id,IFormFile imgFile)
        {
            string uploadFolder = Path.Combine(webHostEnvironment.WebRootPath, "Images", "CompanyLogo");
            if (imgFile != null)
            {
                var fileName = Guid.NewGuid().ToString() + "_" + imgFile.FileName;
                var uniqueCFileName = Path.Combine(uploadFolder, fileName);
                using (var filestream = new FileStream(uniqueCFileName, FileMode.Create))
                {
                    imgFile.CopyTo(filestream);
                }
                var company = await _userManager.FindByIdAsync(id);
                if(company != null)
                {
                    company.Logo = Path.Combine("Images", "CompanyLogo", fileName);
                    var result = await _userManager.UpdateAsync(company);
                    return Ok(result);
                }
                else
                {
                    return NotFound();
                }
            }
            return BadRequest("could not find the image you sent");
        }
        [HttpPut("PutCompanyLogo")]
        public async Task<IActionResult> PutCompanyLogo(string id, IFormFile imgFile)
        {
            var company = await _userManager.FindByIdAsync(id);
            if (company != null)
            {
                var uploadFolder = Path.Combine(webHostEnvironment.WebRootPath, "Images", "CompanyLogo");
                var AbsLocation = Path.Combine(webHostEnvironment.WebRootPath, company.Logo);
                System.IO.File.Delete(AbsLocation);
                if (imgFile != null)
                {
                    var fileName = Guid.NewGuid().ToString() + "_" + imgFile.FileName;
                    var uniqueCFileName = Path.Combine(uploadFolder, fileName);
                    using (var filestream = new FileStream(uniqueCFileName, FileMode.Create))
                    {
                        imgFile.CopyTo(filestream);
                    }

                    company.Logo = Path.Combine( "CompnayLogo", fileName);
                    _userManager.UpdateAsync(company);
                    return Ok(company);
                }
                return NotFound();
            }
            else
            {
                return NotFound();
            }

            //string uploadFolder = Path.Combine(webHostEnvironment.WebRootPath, "Images", "CompanyLogo");
            
        }

    }
}
