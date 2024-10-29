using API.ViewModel;
using DataProcessing.Models;

namespace API.IServices
{
    public interface IBrandServices
    {
        public Task<List<Brands>> GetAll();
        public Task<Brands> GetById(Guid id);
        public Task Create(BrandViewModel model);
        public Task Update(BrandViewModel model);
        public Task Delete(Guid id);
    }
}
