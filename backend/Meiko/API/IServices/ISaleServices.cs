using DataProcessing.Models;

namespace API.IServices
{
    public interface ISaleServices
    {
        public Task<Sales> GetSalesByIdAsync(Guid id);
        public Task<List<Sales>> GetAllSalesAsync();
        public Task AddSalesAsync(Sales sales);
        public Task UpdateSalesAsync(Sales sales);
        public Task DeleteSalesAsync(Guid id);
    }
}
