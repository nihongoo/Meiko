using DataProcessing.Models;

namespace API.IServices
{
    public interface IEmailService
    {
        public Task SendOtpEmailAsync(string toEmail, string otpCode);
        public Task SendVoucherEmailAsync(string toEmail, string subject, Vouchers voucher, string customerEmail);
    }
}
