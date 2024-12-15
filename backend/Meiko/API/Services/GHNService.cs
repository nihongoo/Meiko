using System;
using System.Threading.Tasks;
using System.Text.Json;
using RestSharp;
using CloudinaryDotNet.Actions;
using System.Net;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using API.IServices;

public class GHNService : IGHNService
{
	private readonly string _token; // Thay YOUR_API_TOKEN bằng Token thật
	private readonly RestClient _client;

	public GHNService(IConfiguration configuration)
	{
		_client = new RestClient("https://online-gateway.ghn.vn/shiip/public-api");
		var ghnConfig = configuration.GetSection("GHN");
		_token = ghnConfig["token"];
	}

	// Hàm tính phí giao hàng dựa trên tên
	public async Task<decimal> CalculateShippingFeeAsync(
		string fromCityName,
		string fromDistrictName,
		string toCityName,
		string toDistrictName,
		string toWardName)
	{
		// Bước 1: Lấy DistrictID của nơi gửi và nơi nhận
		int fromDistrictID = await GetDistrictIDAsync(fromCityName, fromDistrictName);
		int toDistrictID = await GetDistrictIDAsync(toCityName, toDistrictName);

		// Bước 2: Lấy WardCode của nơi nhận (dựa trên quận/huyện)
		string toWardCode = await GetWardCodeAsync(toDistrictID, toWardName);

		// Bước 3: Chuẩn bị request tính phí
		var feeRequest = new FeeRequest
		{
			ServiceID = 53320, // Ví dụ: Dịch vụ GHN mặc định
			FromDistrictID = fromDistrictID,
			ToDistrictID = toDistrictID,
			ToWardCode = toWardCode,
			Weight = 1000, // Trọng lượng gói hàng (gram)
			Length = 20,   // Kích thước gói hàng
			Width = 20,
			Height = 20
		};

		var request = new RestRequest("v2/shipping-order/fee", Method.Post);
		AddHeaders(request);
		request.AddJsonBody(feeRequest);

		// Bước 4: Gửi request và parse kết quả
		var response = await _client.ExecuteAsync(request);
		if (!response.IsSuccessful)
			throw new Exception($"Lỗi API: {response.StatusCode} - {response.Content}");

		var feeResponse = JsonSerializer.Deserialize<FeeResponse>(response.Content);
		return feeResponse?.Data?.Total ?? 0;
	}

	// Hàm lấy DistrictID dựa trên tên thành phố và quận/huyện
	private async Task<int> GetDistrictIDAsync(string cityName, string districtName)
	{
		// Gọi API để lấy danh sách thành phố
		var cityList = await GetProvinceListAsync();
		var city = cityList.Find(c => c.ProvinceName == cityName);
		if (city == null)
			throw new Exception($"Không tìm thấy thành phố: {cityName}");

		// Gọi API để lấy danh sách quận/huyện dựa trên ProvinceID
		var districtList = await GetDistrictListAsync(city.ProvinceID);
		var district = districtList.Find(d => d.DistrictName == districtName);
		if (district == null)
			throw new Exception($"Không tìm thấy quận/huyện: {districtName}");

		return district.DistrictID;
	}

	// Hàm lấy WardCode dựa trên DistrictID và tên xã/phường
	private async Task<string> GetWardCodeAsync(int districtId, string wardName)
	{
		var wardList = await GetWardListAsync(districtId);
		var ward = wardList.Find(w => w.WardName == wardName);
		if (ward == null)
			throw new Exception($"Không tìm thấy xã/phường: {wardName}");

		return ward.WardCode;
	}

	// Hàm lấy danh sách tỉnh/thành phố
	public async Task<List<Province>> GetProvinceListAsync()
	{
		var request = new RestRequest("master-data/province", Method.Get);
		AddHeaders(request);

		var response = await _client.ExecuteAsync(request);
		if (!response.IsSuccessful)
			throw new Exception($"Lỗi API: {response.StatusCode} - {response.Content}");

		var result = JsonSerializer.Deserialize<ApiResponse<Province>>(response.Content);
		return result?.Data ?? new List<Province>();
	}

	// Hàm lấy danh sách quận/huyện theo ProvinceID
	public async Task<List<District>> GetDistrictListAsync(int provinceId)
	{
		var request = new RestRequest("master-data/district", Method.Get);
		AddHeaders(request);
		request.AddParameter("province_id", provinceId);

		var response = await _client.ExecuteAsync(request);
		if (!response.IsSuccessful)
			throw new Exception($"Lỗi API: {response.StatusCode} - {response.Content}");

		var result = JsonSerializer.Deserialize<ApiResponse<District>>(response.Content);
		return result?.Data ?? new List<District>();
	}

	// Hàm lấy danh sách xã/phường theo DistrictID
	public async Task<List<Ward>> GetWardListAsync(int districtId)
	{
		var request = new RestRequest("master-data/ward", Method.Get);
		AddHeaders(request);
		request.AddParameter("district_id", districtId);

		var response = await _client.ExecuteAsync(request);
		if (!response.IsSuccessful)
			throw new Exception($"Lỗi API: {response.StatusCode} - {response.Content}");

		var result = JsonSerializer.Deserialize<ApiResponse<Ward>>(response.Content);
		return result?.Data ?? new List<Ward>();
	}

	// Thêm header Token cho request
	private void AddHeaders(RestRequest request)
	{
		request.AddHeader("Token", _token);
	}
}

public class Province
{
	public int ProvinceID { get; set; } // ID của Tỉnh/Thành phố
	public string ProvinceName { get; set; } // Tên Tỉnh/Thành phố
	public string Code { get; set; } // Mã của Tỉnh/Thành phố (VD: "HN" cho Hà Nội)
}

public class District
{
	public int DistrictID { get; set; } // ID của Quận/Huyện
	public string DistrictName { get; set; } // Tên Quận/Huyện
	public int ProvinceID { get; set; } // ID của Tỉnh/Thành phố tương ứng
	public string Code { get; set; } // Mã của Quận/Huyện
}

public class Ward
{
	public string WardCode { get; set; } // Mã của Xã/Phường
	public string WardName { get; set; } // Tên Xã/Phường
	public int DistrictID { get; set; } // ID của Quận/Huyện tương ứng
}


public class FeeRequest
{
	public int ServiceID { get; set; }
	public int FromDistrictID { get; set; }
	public int ToDistrictID { get; set; }
	public string ToWardCode { get; set; }
	public int Weight { get; set; }
	public int Length { get; set; }
	public int Width { get; set; }
	public int Height { get; set; }
}

public class FeeResponse
{
	public int Code { get; set; }
	public FeeData Data { get; set; }
}

public class FeeData
{
	public int Total { get; set; }
}

public class ApiResponse<T>
{
	public int Code { get; set; } // Mã phản hồi (200 nếu thành công)
	public List<T> Data { get; set; } // Dữ liệu trả về (List hoặc object tùy theo API)
}