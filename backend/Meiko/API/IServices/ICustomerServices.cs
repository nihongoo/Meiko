using DataProcessing.Models;

namespace API.IServices
{
    public interface ICustomerServices
    {
        public Task<IEnumerable<Customers>> GetAllCustomersAsync();
        public Task<Customers> GetCustomerByIdAsync(Guid customerId);
        public Task<bool> UpdateCustomerAsync(Customers customer);
    }
}
