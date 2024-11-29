using API.IServices;
using API.ViewModel;
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
        public async Task Create(BrandViewModel model)
        {
            var brand = new Brands
            {
                Id = Guid.NewGuid(),
                Name = model.Name,
                BrandCode = model.BrandCode,
                Status = 1,
        };

            _dbcontext.Brands.Add(brand);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task Delete(Guid id)
        {
            var item = await GetById(id);
            if (item == null)
            {
                throw new KeyNotFoundException($"Brand với Id = {id} không tồn tại.");
            }
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

        public async Task Update(Guid id, BrandViewModel model)
        {
            var brand = await _dbcontext.Brands.FindAsync(id);
            if (brand == null) throw new Exception("Brand not found");

            brand.Name = model.Name;
            brand.BrandCode = model.BrandCode;
            brand.Status = 1;

            await _dbcontext.SaveChangesAsync();
        }
    }
}
