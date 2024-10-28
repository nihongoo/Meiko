using API.IServices;
using API.ViewModel;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class TargetServices : ITargetServices
    {
        public readonly AppDbContext _dbcontext;
        public TargetServices(AppDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public async Task Create(TargretCustomerViewModel targretCustomers)
        {
            var targetcustomer = new TargretCustomers
            {
                Id = Guid.NewGuid(),
                Name = targretCustomers.Name,
                Status = targretCustomers.Status
            };

            _dbcontext.TargretCustomers.Add(targetcustomer);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task Delete(Guid id)
        {
            var item = await GetById(id);
            _dbcontext.TargretCustomers.Remove(item);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task<List<TargretCustomers>> GetAll()
        {
            return await _dbcontext.TargretCustomers.ToListAsync();
        }

        public async Task<TargretCustomers> GetById(Guid id)
        {
            return await _dbcontext.TargretCustomers.FindAsync(id);
        }

        public async Task Update(TargretCustomerViewModel targretCustomers)
        {
            var targetCustimer = await _dbcontext.TargretCustomers.FindAsync(targretCustomers.Id);
            if (targetCustimer == null) throw new Exception("Brand not found");

            targetCustimer.Name = targretCustomers.Name;
            targetCustimer.Status = targretCustomers.Status;

            await _dbcontext.SaveChangesAsync();
        }
    }
}
