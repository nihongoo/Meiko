using API.IServices;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;

namespace API.Services
{
    public class OtpService : IOtpService
    {
        private readonly AppDbContext _dbContext;

        public OtpService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<string> GenerateAndStoreOtpAsync(string email)
        {
            // Vô hiệu hóa các mã OTP cũ nếu có
            var existingOtps = await _dbContext.otps
                .Where(o => o.Email == email && o.ExpirationTime > DateTime.UtcNow)
                .ToListAsync();

            // Xóa tất cả mã OTP cũ
            if (existingOtps.Any())
            {
                _dbContext.otps.RemoveRange(existingOtps);
                await _dbContext.SaveChangesAsync();
            }

            //Tạo mã OTP mới
            var otpCode = GenerateRandomOtpCode();
            var otp = new Otp
            {
                Email = email,
                Code = otpCode,
                CreatedAt = DateTime.UtcNow,
                ExpirationTime = DateTime.UtcNow.AddMinutes(30)
            };

            _dbContext.otps.Add(otp);
            await _dbContext.SaveChangesAsync();

            return otpCode;
        }

        public async Task<bool> VerifyOtpAsync(string email, string otp)
        {
            try
            {
                var otpRecord = await _dbContext.otps
                    .FirstOrDefaultAsync(o => o.Email == email && o.Code == otp);

                if (otpRecord == null || otpRecord.ExpirationTime < DateTime.UtcNow)
                {
                    return false;
                }

                _dbContext.otps.Remove(otpRecord);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi xác nhận OTP: {ex.Message}");
                return false;
            }
        }

        private string GenerateRandomOtpCode(int length = 6)
        {
            Random random = new Random();
            string otpCode = "";
            for (int i = 0; i < length; i++)
            {
                otpCode += random.Next(0, 10).ToString();
            }
            return otpCode;
        }
    }
}
