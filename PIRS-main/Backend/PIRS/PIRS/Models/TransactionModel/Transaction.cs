using Microsoft.Extensions.Diagnostics.HealthChecks;
using PIRS.Models.UserModel;

namespace PIRS.Models.TransactionModel
{
    public class Transaction
    {
        public int Id { get; set; }
        public double Payment { get; set; }
        public DateTime DateTime { get; set; }
        public ReportModel.Report Report { get; set; }
        public AppUser? Company { get; set; }
        public AppUser? Contractor { get; set; }
    }
}
