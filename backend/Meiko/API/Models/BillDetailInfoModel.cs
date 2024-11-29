using System.ComponentModel.DataAnnotations;

namespace API.Models
{
	public class BillDetailInfoModel
	{
		[Required(ErrorMessage = "Số lượng không được để trống.")]
		[Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0.")]
		public int Quantity { get; set; }

		[Required(ErrorMessage = "Trạng thái không được để trống.")]
		[Range(0, 2, ErrorMessage = "Trạng thái phải từ 0 đến 2.")]
		public int Status { get; set; }

		[Required(ErrorMessage = "Id hóa đơn không được để trống.")]
		public Guid BillId { get; set; }

		[Required(ErrorMessage = "Id chi tiết sản phẩm không được để trống.")]
		public Guid ProductDetailId { get; set; }
	}
}
