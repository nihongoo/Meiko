using API.IServices;
using RestSharp;

namespace API.Services
{
    public class GHNService : IGHNService
    {
        private readonly string _baseUrl;
        private readonly string _token;
        private readonly string _shopId;
        private readonly RestClient _client;

        public GHNService(IConfiguration configuration)
        {
            var ghnConfig = configuration.GetSection("GHN");
            _baseUrl = ghnConfig["BaseUrl"];
            _token = ghnConfig["token"];
            _shopId = ghnConfig["shopId"];
            _client = new RestClient( _baseUrl );
        }

        public async Task<string> CalculateShippingFeeAsync(int fromDistrict, int toDistrict, int weight, int length, int width, int height)
        {
            var request = new RestRequest("shipping-order/fee", Method.Post);
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("Token", _token);

            var body = new
            {
                shop_id = _shopId,
                from_district = fromDistrict,
                to_district = toDistrict,
                weight,
                length,
                width,
                height
            };

            request.AddJsonBody(body);

            var response = await _client.ExecuteAsync(request);
            return response.Content;
        }

        public async Task<string> TrackOrderAsync(string orderCode)
        {
            var request = new RestRequest("/shipping-order/status", Method.Post);
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("Token", _token);

            var body = new
            {
                order_code = orderCode
            };

            request.AddJsonBody(body);

            var response = await _client.ExecuteAsync(request);
            return response.Content;
        }
    }
}
