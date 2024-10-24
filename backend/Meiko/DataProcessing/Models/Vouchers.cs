using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class Vouchers
    {
        [Key]
        [Required(ErrorMessage = "Id không được để trống.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Mã voucher không được để trống.")]
        [StringLength(50, MinimumLength = 5, ErrorMessage = "Mã voucher phải từ 5 đến 50 ký tự.")]
        public string VoucherCode { get; set; }

        [Required(ErrorMessage = "Giá trị không được để trống.")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá trị phải lớn hơn hoặc bằng 0.")]
        public double Value { get; set; }

        [Required(ErrorMessage = "Số lượng không được để trống.")]
        [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn hoặc bằng 1.")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Ngày bắt đầu không được để trống.")]
        public DateTime StartDay { get; set; }

        [Required(ErrorMessage = "Ngày kết thúc không được để trống.")]
        [CustomDateRange("StartDay", ErrorMessage = "Ngày kết thúc phải lớn hơn ngày bắt đầu.")]
        public DateTime EndDay { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 2, ErrorMessage = "Trạng thái phải từ 0 đến 2.")]
        public int Status { get; set; }

        public virtual ICollection<VoucherDetails>? VoucherDetails { get; set; }
        public virtual ICollection<Bills>? Bills { get; set; }

    }
}
