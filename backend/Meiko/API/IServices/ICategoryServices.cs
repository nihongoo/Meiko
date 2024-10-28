using DataProcessing.Models;

namespace API.IServices
{
    public interface ICategoryServices
    {
        public Task<List<Categories>> GetAll();
        public Task<Categories> GetById(Guid id);
        public Task Create(Categories categories);
        public Task Update(Categories categories);
        public Task Delete(Guid id);
    }
}
