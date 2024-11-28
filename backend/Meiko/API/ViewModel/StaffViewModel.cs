using System.ComponentModel.DataAnnotations;

namespace API.ViewModel
{
	public class StaffViewModel
	{
		[Required(ErrorMessage = "Id không được để trống.")]
		public Guid Id { get; set; }

		[Required(ErrorMessage = "Tên nhân viên không được để trống.")]
		public string StaffName { get; set; }

		[Required(ErrorMessage = "Email không được để trống.")]
		[EmailAddress(ErrorMessage = "Email không hợp lệ.")]
		public string Email { get; set; }

		[Required(ErrorMessage = "Số điện thoại không được để trống.")]
		[Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
		public string PhoneNumber { get; set; }

		[StringLength(200, ErrorMessage = "Địa chỉ không được vượt quá 200 ký tự.")]
		public string Address { get; set; }

		[Required(ErrorMessage = "Ngày tham gia không được để trống.")]
		[DataType(DataType.Date)]
		public DateTime DateJoin { get; set; }

		[Required(ErrorMessage = "Trạng thái không được để trống.")]
		[Range(0, 5, ErrorMessage = "Trạng thái phải từ 0 đến 5.")]
		public int Status { get; set; }
	}
}
