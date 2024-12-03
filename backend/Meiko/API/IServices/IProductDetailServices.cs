using API.DTO;
using API.ViewModel;
using DataProcessing.Models;

namespace API.IServices
{
    public interface IProductDetailServices
    {
        public Task<IEnumerable<ProductDetails>> GetAllAsync();
        public Task<ProductDetails> GetByIdAsync(Guid id);
        public Task<List<ProductDetails>> GetDetailsAsync(Guid id);
        public Task CreateAsync(ProductDetailViewModel model);
        public Task UpdateAsync(ProductDetailDto model);
        public Task DeleteAsync(Guid id);
        public Task<List<ProductDetails>> Search(string query);
        public Task<List<SoldOffViewModel>> GetForSoldOff();
    }
}
