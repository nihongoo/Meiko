using API.ViewModel;
using DataProcessing.Models;

namespace API.IServices
{
    public interface IColorServices
    {
        public Task<List<Colors>> GetAll();
        public Task<Colors> GetById(Guid id);
        public Task Create(ColorViewModel colorViewModel);
        public Task Update(ColorViewModel colorViewModel);
        public Task Delete(Guid id);
    }
}
