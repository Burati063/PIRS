using Microsoft.AspNetCore.Http;
using PIRS.Models.TransactionModel;
using Microsoft.AspNetCore.Identity;
using PIRS.Models.UserModel;
using PIRS.Models.ReportModel;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ChapaNET;

namespace PIRS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly UserManager<AppUser> _userManager;
        private readonly IReportRepository _reportRepository;

        public TransactionController(ITransactionRepository transactionRepository, UserManager<AppUser> userManager, IReportRepository reportRepository)
        {
            _transactionRepository = transactionRepository;
            _userManager = userManager;
            _reportRepository = reportRepository;
        }

        [HttpPost]
        public async Task<ActionResult<TransactionDto>> Add(TransactionDto transactionDto)
        {
            AppUser company = await _userManager.FindByIdAsync(transactionDto.CompanyId);
            var contractor = await _userManager.FindByIdAsync(transactionDto.ContractorId);
            var report = _reportRepository.GetById(transactionDto.ReportId);

            Chapa chapa = new("CHASECK_TEST-rsh3UiMpIBytuEGhtyBPKtRU6ziR7Anj");

            var ID = Chapa.GetUniqueRef();

            var Request = new ChapaRequest(
                amount: transactionDto.Payment,
                email: "golden1flying1eagle@gmail.com",
                firstName: company.Name,
                lastName: "Company",
                tx_ref: ID,
                callback_url: "http://localhost:5173/company",
                customDescription: "Payment for resolution of "+report.Title,
                customLogo: company.Logo,
                customTitle:"Contractor Payment"
            );
            var Result = await chapa.RequestAsync(Request);
            if (Result.Status.Equals("success"))
            {
                var transaction = new Transaction
                {
                    Id = transactionDto.Id,
                    Payment = transactionDto.Payment,
                    DateTime = transactionDto.DateTime,
                    Company = company,
                    Contractor = contractor,
                    Report = report
                };
                var transact = _transactionRepository.add(transaction);
                return Ok(new { Transaction = transactionDto, result = Result });
            }
            else
            {
                return Ok(new { Transaction = transactionDto, result = Result });
            }
        }
        
        [HttpGet]
        [Route("GetById/{id}")]
        public ActionResult<TransactionDto> GetById(int id)
        {
            var transaction = _transactionRepository.GetById(id);
            var transactionDto = new TransactionDto
            {
                Id = transaction.Id,
                Payment = transaction.Payment,
                DateTime = transaction.DateTime,
                CompanyId = transaction.Company?.Id,
                ContractorId = transaction.Contractor?.Id,
                ReportId = transaction.Report.ReportId
            };

            return Ok(transactionDto);
        }

        [HttpGet]
        [Route("GetAll")]
        public ActionResult<List<TransactionDto>> GetAll()
        {
            var transactions = _transactionRepository.GetAll();
            var transactionDtos = transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                Payment = t.Payment,
                DateTime = t.DateTime,
                CompanyId = t.Company?.Id,
                ContractorId = t.Contractor?.Id,
                ReportId = t.Report.ReportId
            }).ToList();

            return Ok(transactionDtos);
        }
        [HttpGet]
        [Route("GetAllByContractor/{contractorId}")]
        public ActionResult<List<TransactionDto>> GetAllByContractor(string contractorId)
        {
            var transactions = _transactionRepository.GetAll().Where(t => t.Contractor?.Id == contractorId);
            var transactionDtos = transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                Payment = t.Payment,
                DateTime = t.DateTime,
                CompanyId = t.Company?.Id,
                ContractorId = t.Contractor?.Id,
                ReportId = t.Report.ReportId
            }).ToList();

            return Ok(transactionDtos);
        }

        [HttpGet]
        [Route("GetAllByCompany/{companyId}")]
        public ActionResult<List<TransactionDto>> GetAllByCompany(string companyId)
        {
            var transactions = _transactionRepository.GetAll().Where(t => t.Company?.Id == companyId);
            var transactionDtos = transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                Payment = t.Payment,
                DateTime = t.DateTime,
                CompanyId = t.Company?.Id,
                ContractorId = t.Contractor?.Id,
                ReportId = t.Report.ReportId
            }).ToList();

            return Ok(transactionDtos);
        }
    }
}