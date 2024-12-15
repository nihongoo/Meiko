namespace API.Models
{
	public class ShippingRequest
	{
		public string FromCityName { get; set; } // Tên thành phố nơi gửi
		public string FromDistrictName { get; set; } // Tên quận nơi gửi
		public string ToCityName { get; set; } // Tên thành phố nơi nhận
		public string ToDistrictName { get; set; } // Tên quận nơi nhận
		public string ToWardName { get; set; } // Tên xã/phường nơi nhận
	}
}
