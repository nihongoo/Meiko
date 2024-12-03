using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
	public class ProductDetailDto
	{
		public Guid Id { get; set; }

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

		[Required(ErrorMessage = "Trạng thái không được để trống.")]
		public int Status { get; set; }

	}
}
