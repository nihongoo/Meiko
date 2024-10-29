using API.ViewModel;
using DataProcessing.Models;
namespace API.IServices
{
    public interface IMaterialServices
    {
        public Task<List<Materials>> GetAll();
        public Task<Materials> GetById(Guid id);
        public Task Create(MaterialViewModel materialViewModel);
        public Task Update(MaterialViewModel materialViewModel);
        public Task Delete(Guid id);

    }
}
