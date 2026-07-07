namespace PIRS.Models.UserModel
{
    public class AppUserDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string? Logo { get; set; }
        //Company
        public string? Formula { get; set; }
        // Company and Contractor 
        public string? PaymentInfo { get; set; }
        // Name
        public string? Name { get; set; }
        // For contractor 
        public string HiringCompanyId { get; set; } = null;
        // Rating for Contractor optional

    }
}
