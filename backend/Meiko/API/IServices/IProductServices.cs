using API.ViewModel;
using DataProcessing.Models;

namespace API.IServices
{
    public interface IProductServices
    {
        public Task<IEnumerable<Products>> GetAllAsync();
        public Task<IEnumerable<Products>> GetAllInfo();
        public Task<Products> GetByIdAsync(Guid id);
        public Task CreateAsync(ProductViewModel model, List<ProductDetailViewModel> productDetails);
        public Task UpdateAsync(Guid id, ProductViewModel model);
        public Task DeleteAsync(Guid id);
    }
}
