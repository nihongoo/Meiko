using API.ViewModel;
using DataProcessing.Models;

namespace API.IServices
{
    public interface IProductDetailServices
    {
        public Task<IEnumerable<ProductDetails>> GetAllAsync();
        public Task<ProductDetails> GetByIdAsync(Guid id);
        public Task CreateAsync(ProductDetailViewModel model);
        public Task UpdateAsync(ProductDetailViewModel model);
        public Task DeleteAsync(Guid id);
    }
}
