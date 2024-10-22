using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing
{
    public class Accounts
    {
        [Key]
        [Required(ErrorMessage = "Id không được để trống.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Tên đăng nhập không được để trống.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Tên đăng nhập phải từ 3 đến 50 ký tự.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được để trống.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu phải từ 6 đến 100 ký tự.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải từ 0 đến 5.")]
        public int Status { get; set; }

        [Required(ErrorMessage = "Vai trò không được để trống.")]
        [StringLength(20, ErrorMessage = "Vai trò không được vượt quá 20 ký tự.")]
        public string Role { get; set; }

        [Required(ErrorMessage = "Thời gian tạo không được để trống.")]
        public DateTime CreatTime { get; set; }

        public Guid? IdStaff { get; set; }

        public Guid? IdCustomer { get; set; }

        public virtual Staffs? Staffs { get; set; }
        public virtual Customers? Customers { get; set; }
    }
}
