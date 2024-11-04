using API.ViewModel;
using DataProcessing.Models;

namespace API.IServices
{
    public interface ICategoryServices
    {
        public Task<List<Categories>> GetAll();
        public Task<Categories> GetById(Guid id);
        public Task Create(CategoryViewModel categoryViewModel);
        public Task Update(Guid id, CategoryViewModel categoryViewModel);
        public Task Delete(Guid id);
    }
}
