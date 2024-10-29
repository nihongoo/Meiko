namespace API.IServices
{
    public interface IOtpService
    {
        public Task<string> GenerateAndStoreOtpAsync(string email);
        public Task<bool> VerifyOtpAsync(string email, string otp);
    }
}
