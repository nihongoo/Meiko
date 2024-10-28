using API.IServices;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class MaterialServices : IMaterialServices
    {
        public readonly AppDbContext _dbcontext;
        public MaterialServices(AppDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public async Task Create(Materials materials)
        {
            _dbcontext.Materials.Add(materials);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task Delete(Guid id)
        {
            var item = await GetById(id);
            _dbcontext.Materials.Remove(item);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task<List<Materials>> GetAll()
        {
            return await _dbcontext.Materials.ToListAsync();
        }

        public async Task<Materials> GetById(Guid id)
        {
            return await _dbcontext.Materials.FindAsync(id);
        }

        public Task Update(Materials materials)
        {
            throw new NotImplementedException();
        }
    }
}
