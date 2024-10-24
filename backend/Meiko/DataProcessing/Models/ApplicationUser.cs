using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class ApplicationUser : IdentityUser
    {
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
