using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class Customers
    {
        [Key]
        [Required(ErrorMessage = "Id không được để trống.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Tên khách hàng không được để trống.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Tên khách hàng phải từ 3 đến 100 ký tự.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Giới tính không được để trống.")]
        public bool Sex { get; set; }

        [Required(ErrorMessage = "Ngày sinh không được để trống.")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime BirthDay { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được để trống.")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Email không được để trống.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải từ 0 đến 5.")]
        public int Status { get; set; }

        public Guid? IdAccount { get; set; }

        public virtual Accounts? Accounts { get; set; }
        public virtual ICollection<Address>? Address { get; set; }
        public virtual ICollection<VoucherDetails>? VoucherDetails { get; set; }
        public virtual ICollection<Bills>? Bills { get; set; }
        public virtual Carts? Carts { get; set; }
        public virtual ICollection<FavoriteProducts>? FavoriteProducts { get; set; }
    }
}
