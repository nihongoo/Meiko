using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class VoucherDetails
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Id voucher không được để trống.")]
        public Guid VoucherId { get; set; }

        [Required(ErrorMessage = "Id khách hàng không được để trống.")]
        public Guid CustomerId { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải từ 0 đến 5.")]
        public int Status { get; set; }

        public virtual Vouchers? Vouchers { get; set; }
        public virtual Customers? Customers { get; set; }
    }
}
