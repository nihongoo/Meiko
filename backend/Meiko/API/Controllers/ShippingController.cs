using API.IServices;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShippingController : Controller
    {
        private readonly IGHNService _ghnService;
        public ShippingController(IGHNService iGHNService)
        {
            _ghnService = iGHNService;
        }
        [HttpPost("calculate-fee")]
        public async Task<IActionResult> CalculateShippingFee([FromBody] CalculateFeeRequest request)
        {
            var result = await _ghnService.CalculateShippingFeeAsync(
                request.FromDistrictID,
                request.ToDistrictID,
                request.Weight,
                request.Length,
                request.Width,
                request.Height);

            return Ok(result);
        }
        [HttpPost("track-order")]
        public async Task<IActionResult> TrackOrder([FromBody] TrackOrderRequest request)
        {
            var result = await _ghnService.TrackOrderAsync(request.OrderCode);
            return Ok(result);
        }
    }
    public class CalculateFeeRequest
    {
        [JsonProperty("from_district_id")]
        public int FromDistrictID { get; set; }

        [JsonProperty("from_ward_code")]
        public string FromWardCode { get; set; } = "DefaultWardCode";

        [JsonProperty("to_district_id")]
        public int ToDistrictID { get; set; }

        [JsonProperty("to_ward_code")]
        public string ToWardCode { get; set; } = "DefaultWardCode";

        [JsonProperty("service_id")]
        public int ServiceID { get; set; }

        [JsonProperty("height")]
        public int Height { get; set; }

        [JsonProperty("length")]
        public int Length { get; set; }

        [JsonProperty("weight")]
        public int Weight { get; set; }

        [JsonProperty("width")]
        public int Width { get; set; }

        [JsonProperty("insurance_value")]
        public int InsuranceValue { get; set; }

        [JsonProperty("cod_failed_amount")]
        public int CODFailedAmount { get; set; }

        [JsonProperty("items")]
        public List<Item> Items { get; set; }
    }

    public class Item
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("quantity")]
        public int Quantity { get; set; }

        [JsonProperty("height")]
        public int Height { get; set; }

        [JsonProperty("weight")]
        public int Weight { get; set; }

        [JsonProperty("length")]
        public int Length { get; set; }

        [JsonProperty("width")]
        public int Width { get; set; }
    }

    public class TrackOrderRequest
    {
        public string OrderCode { get; set; }
    }
}
