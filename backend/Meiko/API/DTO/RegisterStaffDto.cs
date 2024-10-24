using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class RegisterStaffDto
    {
        [Required(ErrorMessage = "Tên tài khoản không được để trống.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được để trống.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Email không được để trống.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mã nhân viên không được để trống.")]
        [StringLength(20, ErrorMessage = "Mã nhân viên không được vượt quá 20 ký tự.")]
        public string StaffCode { get; set; }

        [Required(ErrorMessage = "Tên nhân viên không được để trống.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Tên nhân viên phải từ 3 đến 100 ký tự.")]
        public string StaffName { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được để trống.")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Ngày tham gia không được để trống.")]
        public DateTime DateJoin { get; set; }

        [StringLength(200, ErrorMessage = "Địa chỉ không được vượt quá 200 ký tự.")]
        public string Address { get; set; }
    }
}
