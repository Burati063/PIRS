using PIRS.Models.UserModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace PIRS.Models.ReportModel
{
    public class ReportUpvote
    {
        public int Id { get; set; }
        public UserModel.AppUser User { get; set; }
    }
}
