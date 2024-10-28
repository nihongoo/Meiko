using API.ViewModel;
using DataProcessing.Models;

namespace API.IServices
{
    public interface ITargetServices
    {
        public Task<List<TargretCustomers>> GetAll();
        public Task<TargretCustomers> GetById(Guid id);
        public Task Create(TargretCustomerViewModel targretCustomer);
        public Task Update(TargretCustomerViewModel targretCustomers);
        public Task Delete(Guid id);
    }
}
