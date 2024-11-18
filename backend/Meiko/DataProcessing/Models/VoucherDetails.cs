using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
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
        [Range(0, 1, ErrorMessage = "Trạng thái phải là 0 (chưa dùng) hoặc 1 (đã dùng).")]
        public int Status { get; set; }

        [JsonIgnore]
        public virtual Vouchers? Vouchers { get; set; }

        [JsonIgnore]
        public virtual Customers? Customers { get; set; }
    }
}
