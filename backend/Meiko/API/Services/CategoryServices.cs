using API.IServices;
using API.ViewModel;
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
        public async Task Create(CategoryViewModel categoryViewModel)
        {
            var category = new Categories
            {
                Id = Guid.NewGuid(),
                Name = categoryViewModel.Name,
                Status = categoryViewModel.Status
            };

            _dbcontext.Categories.Add(category);
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

        public async Task Update(CategoryViewModel categoryViewModel)
        {
            var category = await _dbcontext.Categories.FindAsync(categoryViewModel.Id);
            if (category == null) throw new Exception("Brand not found");

            category.Name = categoryViewModel.Name;
            category.Status = categoryViewModel.Status;

            await _dbcontext.SaveChangesAsync();
        }
    }
}
