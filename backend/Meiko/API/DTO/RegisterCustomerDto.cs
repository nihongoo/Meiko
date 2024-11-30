using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class RegisterCustomerDto
    {
        [Required(ErrorMessage = "Tên tài khoản không được để trống.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được để trống.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Email không được để trống.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Tên khách hàng không được để trống.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Tên khách hàng phải từ 3 đến 100 ký tự.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Giới tính không được để trống.")]
        public bool Sex { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được để trống.")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        public string PhoneNumber { get; set; }
    }
}
