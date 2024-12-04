namespace API.IServices
{
    public interface IGHNService
    {
        Task<string> CalculateShippingFeeAsync(int fromDistrict, int toDistrict, int weight, int length, int width, int height);
        Task<string> TrackOrderAsync(string orderCode);
    }
}
