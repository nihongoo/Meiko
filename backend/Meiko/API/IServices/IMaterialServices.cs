using DataProcessing.Models;
namespace API.IServices
{
    public interface IMaterialServices
    {
        public Task<List<Materials>> GetAll();
        public Task<Materials> GetById(Guid id);
        public Task Create(Materials materials);
        public Task Update(Materials materials);
        public Task Delete(Guid id);

    }
}
