using API.IServices;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class BrandServices : IBrandServices
    {
        public readonly AppDbContext _dbcontext;
        public BrandServices(AppDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public async Task Create(Brands brands)
        {
            _dbcontext.Brands.Add(brands);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task Delete(Guid id)
        {
            var item = await GetById(id);
            _dbcontext.Brands.Remove(item);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task<List<Brands>> GetAll()
        {
            return await _dbcontext.Brands.ToListAsync();
        }

        public async Task<Brands> GetById(Guid id)
        {
            return await _dbcontext.Brands.FindAsync(id);
        }

        public Task Update(Brands brands)
        {
            throw new NotImplementedException();
        }
    }
}
