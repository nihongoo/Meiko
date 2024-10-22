using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing
{
    public class Carts
    {
        [Key]
        [Required(ErrorMessage = "Id không được để trống.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Thời gian tạo không được để trống.")]
        public DateTime CreateTime { get; set; }

        [Required(ErrorMessage = "Tổng tiền không được để trống.")]
        [Range(0, double.MaxValue, ErrorMessage = "Tổng tiền phải lớn hơn hoặc bằng 0.")]
        public decimal Total { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải từ 0 đến 5.")]
        public int Status { get; set; }

        [Required(ErrorMessage = "Id khách hàng không được để trống.")]
        public Guid CustomerId { get; set; }

        public virtual Customers? Customers { get; set; }
        public virtual ICollection<CartDetails>? CartDetails { get; set; }
    }
}
