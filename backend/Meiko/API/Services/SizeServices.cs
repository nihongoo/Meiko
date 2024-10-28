using API.IServices;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class SizeServices : ISizeServices
    {
        public readonly AppDbContext _dbcontext;
        public SizeServices(AppDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public async Task Create(Sizes sizes)
        {
            _dbcontext.Sizes.Add(sizes);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task Delete(Guid id)
        {
            var item = await GetById(id);
            _dbcontext.Sizes.Remove(item);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task<List<Sizes>> GetAll()
        {
            return await _dbcontext.Sizes.ToListAsync();
        }

        public async Task<Sizes> GetById(Guid id)
        {
            return await _dbcontext.Sizes.FindAsync(id);
        }

        public Task Update(Sizes sizes)
        {
            throw new NotImplementedException();
        }
    }
}
