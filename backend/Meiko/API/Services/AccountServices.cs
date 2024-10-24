using API.DTO;
using API.IServices;
using DataProcessing.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace API.Services
{
    public class AccountService : IAccountServices
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _appDbContext;

        public AccountService(UserManager<ApplicationUser> userManager, IConfiguration configuration, AppDbContext appDbContext)
        {
            _userManager = userManager;
            _configuration = configuration;
            _appDbContext = appDbContext;
        }

        public async Task<JwtTokenDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                throw new UnauthorizedAccessException("Tài khoản hoặc mật khẩu không đúng.");
            }

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(ClaimTypes.Role, user.Role), // thêm vai trò vào claims
                new Claim(JwtRegisteredClaimNames.Jti, user.Id)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtTokenDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Role = user.Role 
            };
        }


        public async Task<IdentityResult> RegisterCustomerAsync(RegisterCustomerDto registerDto)
        {
            var accountExists = await _userManager.FindByNameAsync(registerDto.Username);
            if (accountExists != null)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Tên tài khoản đã tồn tại." });
            }

            var newAccount = new ApplicationUser
            {
                UserName = registerDto.Username,
                Email = registerDto.Email,
                Role = "Customer", // Đặt vai trò cho khách hàng
                Status = 1,
                CreatTime = DateTime.Now,
            };

            var result = await _userManager.CreateAsync(newAccount, registerDto.Password);
            if (!result.Succeeded)
            {
                return IdentityResult.Failed(new IdentityError { Description = string.Join(", ", result.Errors.Select(e => e.Description)) });
            }

            // Tạo đối tượng Customer
            var customer = new Customers
            {
                Id = Guid.NewGuid(),
                Name = registerDto.Name,
                Sex = registerDto.Sex,
                BirthDay = registerDto.BirthDay,
                PhoneNumber = registerDto.PhoneNumber,
                Email = registerDto.Email,
                ApplicationUserId = newAccount.Id // liên kết với tài khoản người dùng
            };

            await _appDbContext.Customers.AddAsync(customer);
            await _appDbContext.SaveChangesAsync();

            return IdentityResult.Success;
        }

        public async Task<IdentityResult> RegisterStaffAsync(RegisterStaffDto registerDto)
        {
            var accountExists = await _userManager.FindByNameAsync(registerDto.Username);
            if (accountExists != null)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Tên tài khoản đã tồn tại." });
            }

            var newAccount = new ApplicationUser
            {
                UserName = registerDto.Username,
                Email = registerDto.Email,
                Role = "Staff", // Đặt vai trò cho nhân viên
                Status = 1,
                CreatTime = DateTime.Now,
            };

            var result = await _userManager.CreateAsync(newAccount, registerDto.Password);
            if (!result.Succeeded)
            {
                return IdentityResult.Failed(new IdentityError { Description = string.Join(", ", result.Errors.Select(e => e.Description)) });
            }
            var staffcode = GenerateStaffCode();

            // Tạo đối tượng Staff
            var staff = new Staffs
            {
                Id = Guid.NewGuid(),
                StaffCode = staffcode,
                StaffName = registerDto.StaffName,
                PhoneNumber = registerDto.PhoneNumber,
                Email = registerDto.Email,
                DateJoin = registerDto.DateJoin,
                Address = registerDto.Address,
                ApplicationUserId = newAccount.Id // liên kết với tài khoản người dùng
            };

            await _appDbContext.Staffs.AddAsync(staff);
            await _appDbContext.SaveChangesAsync();

            return IdentityResult.Success;
        }
        private string GenerateStaffCode()
        {
            string prefix = "KH";
            var random = new Random();
            var randomNumbers = random.Next(10000, 99999);

            return $"{prefix}{randomNumbers}";
        }
    }
}
