using DataProcessing.Models;

namespace API.IServices
{
    public interface ISizeServices
    {
        public Task<List<Sizes>> GetAll();
        public Task<Sizes> GetById(Guid id);
        public Task Create(Sizes sizes);
        public Task Update(Sizes sizes);
        public Task Delete(Guid id);
    }
}
