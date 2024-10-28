namespace API.IServices
{
    public interface IEmailService
    {
        public Task SendOtpEmailAsync(string toEmail, string otpCode);
    }
}
