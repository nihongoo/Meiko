using DataProcessing.Models;

namespace API.IServices
{
    public interface ITargetServices
    {
        public Task<List<TargretCustomers>> GetAll();
        public Task<TargretCustomers> GetById(Guid id);
        public Task Create(TargretCustomers targretCustomers);
        public Task Update(TargretCustomers targretCustomers);
        public Task Delete(Guid id);
    }
}
