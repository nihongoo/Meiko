using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class ProductDetails
    {
        [Key]
        [Required(ErrorMessage = "Id không được để trống.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Mã chi tiết sản phẩm không được để trống.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Mã chi tiết sản phẩm phải từ 3 đến 50 ký tự.")]
        public string ProductDetailCode { get; set; }

        [Required(ErrorMessage = "Số lượng không được để trống.")]
        [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn hoặc bằng 0.")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Cân nặng không được để trống.")]
        [Range(0, double.MaxValue, ErrorMessage = "Cân nặng phải lớn hơn 0.")]
        public double Weight { get; set; }

        [Required(ErrorMessage = "Giá nhập không được để trống.")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá nhập phải lớn hơn hoặc bằng 0.")]
        public decimal ImportPrice { get; set; }

        [Required(ErrorMessage = "Giá bán không được để trống.")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá bán phải lớn hơn hoặc bằng 0.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Thời gian tạo không được để trống.")]
        public DateTime CreatTime { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải từ 0 đến 5.")]
        public int Status { get; set; }

        [Required(ErrorMessage = "Id sản phẩm không được để trống.")]
        public Guid ProductId { get; set; }

        [Required(ErrorMessage = "Id màu sắc không được để trống.")]
        public Guid ColorId { get; set; }

        [Required(ErrorMessage = "Id kích thước không được để trống.")]
        public Guid SizeId { get; set; }

        public virtual Products? Products { get; set; }
        public virtual Colors? Colors { get; set; }
        [JsonIgnore]
        public virtual ICollection<SaleProducts> SaleProducts { get; set; }
        public virtual Sizes? Sizes { get; set; }
        [JsonIgnore]
        public virtual ICollection<CartDetails>? CartDetails { get; set; }
        [JsonIgnore]
        public virtual ICollection<BillDetails>? BillDetails { get; set; }

        public virtual ICollection<Images>? Images { get; set; }
    }
}
