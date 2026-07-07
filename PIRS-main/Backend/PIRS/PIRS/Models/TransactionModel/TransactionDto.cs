using PIRS.Models.UserModel;

namespace PIRS.Models.TransactionModel
{
    public class TransactionDto
    {
        public int Id { get; set; }
        public double Payment { get; set; }
        public DateTime DateTime { get; set; }
        public int ReportId { get; set; }
        public string CompanyId { get; set; }
        public string ContractorId { get; set; }
    }
}
