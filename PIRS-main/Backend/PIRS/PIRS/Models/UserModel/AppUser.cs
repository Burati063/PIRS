using Microsoft.AspNetCore.Identity;

namespace PIRS.Models.UserModel
{
    public partial class AppUser:IdentityUser
    {
        // Company
        public string? Logo { get; set; }
        //Company
        public string? Formula { get; set; }
        // Company and Contractor 
        public string PaymentInfo { get; } = "CHASECK_TEST-rsh3UiMpIBytuEGhtyBPKtRU6ziR7Anj";
        // Name
        public string? Name { get; set; }
        // For contractor 
        public string? HiringCompanyId { get; set; } = null;
        //public string FirstName { get; set; }
        //public string LastName { get; set; }

    }
}
