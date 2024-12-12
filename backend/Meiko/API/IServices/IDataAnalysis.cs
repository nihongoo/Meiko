using API.DTO;

namespace API.IServices
{
	public interface IDataAnalysis
	{
		public Task<DataAnalysisAllDTO> General();
		public Task<List<TopProductForDayDto>> TopProductForDay(DateTime Day);
		public Task<List<TopProductForDayDto>> TopProduct(DateTime? date = null);
		public Task<List<TopCustomerDto>> TopCustomer();
	}
}
