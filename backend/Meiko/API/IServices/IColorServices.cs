using DataProcessing.Models;

namespace API.IServices
{
    public interface IColorServices
    {
        public Task<List<Colors>> GetAll();
        public Task<Colors> GetById(Guid id);
        public Task Create(Colors colors);
        public Task Update(Colors colors);
        public Task Delete(Guid id);
    }
}
