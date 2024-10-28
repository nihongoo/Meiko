using DataProcessing.Models;

namespace API.IServices
{
    public interface IBrandServices
    {
        public Task<List<Brands>> GetAll();
        public Task<Brands> GetById(Guid id);
        public Task Create(Brands brands);
        public Task Update(Brands brands);
        public Task Delete(Guid id);
    }
}
