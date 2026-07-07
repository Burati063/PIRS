

using PIRS.Models.ReportModel;
using PIRS.Models.TransactionModel;

namespace PIRS.Models.UserModel
{
    public interface IUserRepository
    {
        void AddContractor(AppUser contractor);
        AppUser UpdateContractor(AppUser contractor);
        Transaction GetbyId(int id);
        List<Report> GetAll();
        Report GetReportById(int id);
    }
}
