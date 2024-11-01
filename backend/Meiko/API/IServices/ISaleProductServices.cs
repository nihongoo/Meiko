using DataProcessing.Models;

namespace API.IServices
{
    public interface ISaleProductServices
    {
        public Task<List<SaleProducts>> GetAllSalesProductsAsync();
    }
}
