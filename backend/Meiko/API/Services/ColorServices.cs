using API.IServices;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class ColorServices : IColorServices
    {
        public readonly AppDbContext _dbcontext;
        public ColorServices(AppDbContext appDbContext)
        {
            _dbcontext = appDbContext;
        }
        public async Task Create(Colors colors)
        {
            _dbcontext.Colors.Add(colors);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task Delete(Guid id)
        {
            var item = await GetById(id);
            _dbcontext.Colors.Remove(item);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task<List<Colors>> GetAll()
        {
            return await _dbcontext.Colors.ToListAsync();
        }

        public async Task<Colors> GetById(Guid id)
        {
            return await _dbcontext.Colors.FindAsync(id);
        }

        public Task Update(Colors colors)
        {
            throw new NotImplementedException();
        }
    }
}
