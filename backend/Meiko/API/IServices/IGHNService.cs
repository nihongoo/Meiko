namespace API.IServices
{
	public interface IGHNService
	{
		Task<decimal> CalculateShippingFeeAsync(
		string fromCityName,
		string fromDistrictName,
		string toCityName,
		string toDistrictName,
		string toWardName);

		Task<List<Province>> GetProvinceListAsync();
		Task<List<District>> GetDistrictListAsync(int provinceId);
		Task<List<Ward>> GetWardListAsync(int districtId);
	}
}
