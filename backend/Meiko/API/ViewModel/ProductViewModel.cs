using System.ComponentModel.DataAnnotations;

namespace API.ViewModel
{
    public class ProductViewModel
    {
        [Required(ErrorMessage = "Tên sản phẩm không được để trống.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Tên sản phẩm phải từ 3 đến 100 ký tự.")]
        public string Name { get; set; }

        [StringLength(500, ErrorMessage = "Mô tả sản phẩm không được vượt quá 500 ký tự.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Mã sản phẩm không được để trống.")]
        [StringLength(20, ErrorMessage = "Mã sản phẩm không được vượt quá 20 ký tự.")]
        public string ProductCode { get; set; }

        public string ImageUrl { get; set; }

        [StringLength(50, ErrorMessage = "Thời gian bảo hành không được vượt quá 50 ký tự.")]
        public string? WarrantyPeriod { get; set; }

        [Required(ErrorMessage = "Thời gian tạo không được để trống.")]
        public DateTime CreateTime { get; set; }

        [Required(ErrorMessage = "Trạng thái không được để trống.")]
        [Range(0, 5, ErrorMessage = "Trạng thái phải từ 0 đến 5.")]
        public int Status { get; set; }

        [Required(ErrorMessage = "Mã vật liệu không được để trống.")]
        public Guid MaterialId { get; set; }

        [Required(ErrorMessage = "Mã thương hiệu không được để trống.")]
        public Guid BrandId { get; set; }

        [Required(ErrorMessage = "Mã danh mục không được để trống.")]
        public Guid CategoryId { get; set; }

        [Required(ErrorMessage = "Mã khách hàng mục tiêu không được để trống.")]
        public Guid TargretCustomerId { get; set; }
    }
}
