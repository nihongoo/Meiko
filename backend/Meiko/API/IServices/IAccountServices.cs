using API.DTO;
using DataProcessing.Models;
using Microsoft.AspNetCore.Identity;

namespace API.IServices
{
    public interface IAccountServices
    {
        public Task<JwtTokenDto> LoginAsync(LoginDto loginDto);
        public Task<IdentityResult> RegisterCustomerAsync(RegisterCustomerDto registerDto);
        public Task<IdentityResult> RegisterStaffAsync(RegisterStaffDto registerDto);
    }
}
