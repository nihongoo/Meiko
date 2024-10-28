using API.IServices;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class CategoryServices : ICategoryServices
    {
        public readonly AppDbContext _dbcontext;
        public CategoryServices(AppDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public async Task Create(Categories categories)
        {
            _dbcontext.Categories.Add(categories);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task Delete(Guid id)
        {
            var item = await GetById(id);
            _dbcontext.Categories.Remove(item);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task<List<Categories>> GetAll()
        {
            return await _dbcontext.Categories.ToListAsync();
        }

        public async Task<Categories> GetById(Guid id)
        {
            return await _dbcontext.Categories.FindAsync(id);
        }

        public Task Update(Categories categories)
        {
            throw new NotImplementedException();
        }
    }
}
