using API.ViewModel;
using DataProcessing.Models;

namespace API.IServices
{
    public interface ISizeServices
    {
        public Task<List<Sizes>> GetAll();
        public Task<Sizes> GetById(Guid id);
        public Task Create(SizeViewModel sizeViewModel);
        public Task Update(Guid id, SizeViewModel sizeViewModel);
        public Task Delete(Guid id);
    }
}
