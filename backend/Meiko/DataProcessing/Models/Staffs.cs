using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class Staffs
    {
        [Key]
        [Required(ErrorMessage = "Id không được để trống.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Mã nhân viên không được để trống.")]
        [StringLength(20, ErrorMessage = "Mã nhân viên không được vượt quá 20 ký tự.")]
        public string StaffCode { get; set; }

        [Required(ErrorMessage = "Tên nhân viên không được để trống.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Tên nhân viên phải từ 3 đến 100 ký tự.")]
        public string StaffName { get; set; }

        [Required(ErrorMessage = "Email không được để trống.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được để trống.")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        public string PhoneNumber { get; set; }

        [StringLength(200, ErrorMessage = "Địa chỉ không được vượt quá 200 ký tự.")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Ngày tham gia không được để trống.")]
        public DateTime DateJoin { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải từ 0 đến 5.")]
        public int Status { get; set; }

        public string? ApplicationUserId { get; set; }

<<<<<<< HEAD
        public virtual Accounts? Accounts { get; set; }
=======
        public virtual ApplicationUser? ApplicationUser { get; set; }
>>>>>>> cuong
        public virtual ICollection<Bills>? Bills { get; set; }

    }
}
