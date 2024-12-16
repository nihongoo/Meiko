using System;
using System.Threading.Tasks;
using System.Text.Json;
using RestSharp;
using CloudinaryDotNet.Actions;
using System.Net;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using API.IServices;
using Newtonsoft.Json;

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

        // Bước 3: Lấy danh sách dịch vụ khả dụng
        var serviceRequest = new
        {
            shop_id = 5120610,
            from_district = fromDistrictID,
            to_district = toDistrictID,
        };

        var serviceEndpoint = new RestRequest("v2/shipping-order/available-services", Method.Post);
        AddHeaders(serviceEndpoint);
        serviceEndpoint.AddJsonBody(serviceRequest);
        var serviceResponse = await _client.ExecuteAsync(serviceEndpoint);
        if (!serviceResponse.IsSuccessful)
            throw new Exception($"Lỗi API lấy danh sách dịch vụ: {serviceResponse.StatusCode} - {serviceResponse.Content}");

        var availableServices = JsonConvert.DeserializeObject<AvailableServicesResponse>(serviceResponse.Content); 
        var selectedService = availableServices?.Data?.FirstOrDefault();
        if (selectedService == null)
            throw new Exception("Không có dịch vụ vận chuyển khả dụng cho tuyến đường này.");

        int serviceId = selectedService.ServiceId;
        var request = new RestRequest("v2/shipping-order/fee", Method.Post);
		AddHeaders(request);
        request.AddHeader("ShopId", "5120610");
        var payload = new
        {
            from_district_id = fromDistrictID,
            service_id = serviceId,
            service_type_id = (int?)null, 
            to_district_id = toDistrictID,
            to_ward_code = toWardCode,
            height = 50,
            length = 20,
            weight = 200,
            width = 20,
            insurance_value = 10000,
            cod_failed_amount = 2000,
            coupon = (string)null, // null
            items = new[]
            {
                new {
                    name = "TEST1",
                    quantity = 1,
                    height = 200,
                    weight = 1000,
                    length = 200,
                    width = 200
                }
            }
        };
		request.AddJsonBody(payload);
        // Bước 4: Gửi request và parse kết quả
        var response = await _client.ExecuteAsync(request);
		if (!response.IsSuccessful)
			throw new Exception($"Lỗi API: {response.StatusCode} - {response.Content}");

		var feeResponse = JsonConvert.DeserializeObject<FeeResponse>(response.Content);
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

		var result = JsonConvert.DeserializeObject<ApiResponse<Province>>(response.Content);
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

		var result = JsonConvert.DeserializeObject<ApiResponse<District>>(response.Content);
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

		var result = JsonConvert.DeserializeObject<ApiResponse<Ward>>(response.Content);
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
    public List<T> Data { get; set; }
    public string Message { get; set; }
    public bool Success { get; set; }
}

public class AvailableServicesResponse
{
    public int Code { get; set; } // Mã trạng thái (200, 400,...)
    public string CodeMessageValue { get; set; } // Giá trị thông điệp mã lỗi (nếu có)
    public List<ServiceData> Data { get; set; }
    public string Message { get; set; } // Thông điệp từ API
}
public class ServiceData
{
    [JsonProperty("service_id")]
    public int ServiceId { get; set; }

    [JsonProperty("short_name")]
    public string ShortName { get; set; }

    [JsonProperty("service_type_id")]
    public int ServiceTypeId { get; set; }

    [JsonProperty("config_fee_id")]
    public string ConfigFeeId { get; set; }

    [JsonProperty("extra_cost_id")]
    public string ExtraCostId { get; set; }

    [JsonProperty("standard_config_fee_id")]
    public string StandardConfigFeeId { get; set; }

    [JsonProperty("standard_extra_cost_id")]
    public string StandardExtraCostId { get; set; }

    [JsonProperty("ecom_config_fee_id")]
    public int EcomConfigFeeId { get; set; }

    [JsonProperty("ecom_extra_cost_id")]
    public int EcomExtraCostId { get; set; }

    [JsonProperty("ecom_standard_config_fee_id")]
    public int EcomStandardConfigFeeId { get; set; }

    [JsonProperty("ecom_standard_extra_cost_id")]
    public int EcomStandardExtraCostId { get; set; }
}