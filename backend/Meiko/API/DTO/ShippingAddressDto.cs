using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
	public class ShippingAddressDto
	{
		public Guid Id { get; set; }
		public string RecipientName { get; set; }
		public string PhoneNumber { get; set; }
		public string AddressDetail { get; set; }
		public string City { get; set; }
		public string District { get; set; }
		public string Ward { get; set; }
		public int Status { get; set; }
		public Guid? BillId { get; set; }
	}
}
