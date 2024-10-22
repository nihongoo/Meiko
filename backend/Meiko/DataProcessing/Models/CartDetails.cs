using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class CartDetails
    {
        [Key]
        [Required(ErrorMessage = "Id không được để trống.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Số lượng không được để trống.")]
        [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn hoặc bằng 1.")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Giá không được để trống.")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá phải lớn hơn hoặc bằng 0.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải từ 0 đến 5.")]
        public int Status { get; set; }

        [Required(ErrorMessage = "Id giỏ hàng không được để trống.")]
        public Guid CartId { get; set; }

        [Required(ErrorMessage = "Id chi tiết sản phẩm không được để trống.")]
        public Guid ProductDetailsId { get; set; }

        public virtual Carts? Carts { get; set; }
        public virtual ProductDetails? ProductDetails { get; set; }
    }
}
