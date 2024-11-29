using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
	public class ShippingAddress
	{
		[Key]
		[Required(ErrorMessage = "Id không được để trống.")]
		public Guid Id { get; set; }

		[Required(ErrorMessage = "Tên người nhận không được để trống.")]
		[StringLength(100, MinimumLength = 3, ErrorMessage = "Tên người nhận phải từ 3 đến 100 ký tự.")]
		public string RecipientName { get; set; }

		[Required(ErrorMessage = "Số điện thoại không được để trống.")]
		[Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
		public string PhoneNumber { get; set; }

		[Required(ErrorMessage = "Địa chỉ chi tiết không được để trống.")]
		[StringLength(200, ErrorMessage = "Địa chỉ chi tiết không được vượt quá 200 ký tự.")]
		public string AddressDetail { get; set; }

		[Required(ErrorMessage = "Thành phố không được để trống.")]
		public string City { get; set; }

		[Required(ErrorMessage = "Quận/Huyện không được để trống.")]
		public string District { get; set; }

		[Required(ErrorMessage = "Phường/Xã không được để trống.")]
		public string Ward { get; set; }

		[Required(ErrorMessage = "Trạng thái không được để trống.")]
		[Range(0, 5, ErrorMessage = "Trạng thái phải từ 0 đến 5.")]
		public int Status { get; set; }

		public Guid? BillId { get; set; }
		public virtual Bills? Bill { get; set; }
	}
}
