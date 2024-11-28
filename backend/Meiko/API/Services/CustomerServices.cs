using API.IServices;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class CustomerServices : ICustomerServices
    {
        private readonly AppDbContext _appDbContext;
        public CustomerServices(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<IEnumerable<Customers>> GetAllCustomersAsync()
        {
            return await _appDbContext.Customers.ToListAsync();
        }

        public async Task<Customers> GetCustomerByIdAsync(Guid customerId)
        {
            return await _appDbContext.Customers.FindAsync(customerId);
        }

        public async Task<bool> UpdateCustomerAsync(CustomerViewModel customer)
        {
            var existingCustomer = await _appDbContext.Customers.FindAsync(customer.Id);
            if (existingCustomer == null)
                return false;

            existingCustomer.Name = customer.Name;
            existingCustomer.Sex = customer.Sex;
            existingCustomer.BirthDay = customer.BirthDay;
            existingCustomer.PhoneNumber = customer.PhoneNumber;
            existingCustomer.Email = customer.Email;
            existingCustomer.Status = customer.Status;

            _appDbContext.Customers.Update(existingCustomer);
            return await _appDbContext.SaveChangesAsync() >0;
        }
    }
}
