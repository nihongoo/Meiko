using API.DTO;
using API.IServices;
using DataProcessing.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
        private readonly ICartServices _cartServices;

        public AccountService(UserManager<ApplicationUser> userManager, IConfiguration configuration, AppDbContext appDbContext
            , ICartServices cartServices)
        {
            _userManager = userManager;
            _configuration = configuration;
            _appDbContext = appDbContext;
            _cartServices = cartServices;
        }

        public async Task<ApplicationUser> GetAccountByIdAsync(Guid addressId)
        {
            return await _appDbContext.Users.FindAsync(addressId);
        }

        public async Task<IEnumerable<ApplicationUser>> GetAllAccountsAsync()
        {
            return await _appDbContext.Users.ToListAsync();
        }

        public async Task<JwtTokenDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Tài khoản không tồn tại.");
            }
            if (!await _userManager.CheckPasswordAsync(user, loginDto.Password))
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
            // Kiểm tra các trường bắt buộc
            if (string.IsNullOrEmpty(registerDto.Username) || string.IsNullOrEmpty(registerDto.Password) ||
                string.IsNullOrEmpty(registerDto.Email) || string.IsNullOrEmpty(registerDto.PhoneNumber))
            {
                return IdentityResult.Failed(new IdentityError { Description = "Các trường bắt buộc không được để trống." });
            }

            // Kiểm tra định dạng email
            if (!IsValidEmail(registerDto.Email))
            {
                return IdentityResult.Failed(new IdentityError { Description = "Email không hợp lệ." });
            }

            // Kiểm tra số điện thoại
            if (!IsValidPhoneNumber(registerDto.PhoneNumber))
            {
                return IdentityResult.Failed(new IdentityError { Description = "Số điện thoại không hợp lệ." });
            }

            // Kiểm tra mật khẩu có đủ độ dài và độ phức tạp
            if (registerDto.Password.Length < 6)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Mật khẩu phải có ít nhất 6 ký tự." });
            }

            // Kiểm tra tài khoản đã tồn tại chưa
            var accountExists = await _userManager.FindByNameAsync(registerDto.Username);
            if (accountExists != null)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Tên tài khoản đã tồn tại." });
            }

            // Kiểm tra email đã tồn tại chưa
            var emailExists = await _userManager.FindByEmailAsync(registerDto.Email);
            if (emailExists != null)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Email đã được sử dụng." });
            }
            // Kiểm tra số điện thoại đã tồn tại chưa
            var phoneExists = await _appDbContext.Users.AnyAsync(u => u.PhoneNumber == registerDto.PhoneNumber);
            if (phoneExists)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Số điện thoại đã được sử dụng." });
            }

            // Tạo đối tượng ApplicationUser
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
                ApplicationUserId = newAccount.Id
            };

            await _appDbContext.Customers.AddAsync(customer);
            await _appDbContext.SaveChangesAsync();

            //Tạo giỏ hàng cho tài khoản
            await _cartServices.CreateCartAsync(customer.Id);

            return IdentityResult.Success;
        }

        public async Task<IdentityResult> RegisterStaffAsync(RegisterStaffDto registerDto)
        {
            // Kiểm tra các trường bắt buộc
            if (string.IsNullOrEmpty(registerDto.Username) || string.IsNullOrEmpty(registerDto.Password) ||
                string.IsNullOrEmpty(registerDto.Email) || string.IsNullOrEmpty(registerDto.PhoneNumber))
            {
                return IdentityResult.Failed(new IdentityError { Description = "Các trường bắt buộc không được để trống." });
            }

            // Kiểm tra định dạng email
            if (!IsValidEmail(registerDto.Email))
            {
                return IdentityResult.Failed(new IdentityError { Description = "Email không hợp lệ." });
            }

            // Kiểm tra số điện thoại
            if (!IsValidPhoneNumber(registerDto.PhoneNumber))
            {
                return IdentityResult.Failed(new IdentityError { Description = "Số điện thoại không hợp lệ." });
            }

            // Kiểm tra mật khẩu có đủ độ dài và độ phức tạp
            if (registerDto.Password.Length < 6)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Mật khẩu phải có ít nhất 6 ký tự." });
            }

            // Kiểm tra tài khoản đã tồn tại chưa
            var accountExists = await _userManager.FindByNameAsync(registerDto.Username);
            if (accountExists != null)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Tên tài khoản đã tồn tại." });
            }

            // Kiểm tra email đã tồn tại chưa
            var emailExists = await _userManager.FindByEmailAsync(registerDto.Email);
            if (emailExists != null)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Email đã được sử dụng." });
            }
            // Kiểm tra số điện thoại đã tồn tại chưa
            var phoneExists = await _appDbContext.Users.AnyAsync(u => u.PhoneNumber == registerDto.PhoneNumber);
            if (phoneExists)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Số điện thoại đã được sử dụng." });
            }
            // Tạo đối tượng ApplicationUser
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

            var staffcode = await GenerateUniqueStaffCodeAsync();

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

        private async Task<string> GenerateUniqueStaffCodeAsync()
        {
            string prefix = "NV";
            var random = new Random();
            string staffCode;
            do
            {
                var randomNumbers = random.Next(10000, 99999);
                staffCode = $"{prefix}{randomNumbers}";

                // Kiểm tra xem mã này có đã tồn tại trong cơ sở dữ liệu không
            } while (await _appDbContext.Staffs.AnyAsync(s => s.StaffCode == staffCode));

            return staffCode;
        }

        // Hàm kiểm tra định dạng email
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        // Hàm kiểm tra số điện thoại
        private bool IsValidPhoneNumber(string phoneNumber)
        {
            // Kiểm tra số điện thoại có 10 chữ số và chỉ chứa số
            return !string.IsNullOrEmpty(phoneNumber) && phoneNumber.Length == 10 && phoneNumber.All(char.IsDigit);
        }
    }
}
