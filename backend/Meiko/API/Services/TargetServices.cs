using API.IServices;
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
        public async Task Create(TargretCustomers targretCustomers)
        {
            _dbcontext.TargretCustomers.Add(targretCustomers);
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

        public Task Update(TargretCustomers targretCustomers)
        {
            throw new NotImplementedException();
        }
    }
}
