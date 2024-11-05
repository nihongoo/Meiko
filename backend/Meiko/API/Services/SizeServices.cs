using API.IServices;
using API.ViewModel;
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
        public async Task Create(SizeViewModel sizeViewModel)
        {
            var size = new Sizes
            {
                Id = Guid.NewGuid(),
                Name = sizeViewModel.Name,
                Status = 1
            };

            _dbcontext.Sizes.Add(size);
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

        public async Task Update(Guid id, SizeViewModel sizeViewModel)
        {
            var size = await _dbcontext.Sizes.FindAsync(id);
            if (size == null) throw new Exception("Brand not found");

            size.Name = sizeViewModel.Name;
            size.Status = sizeViewModel.Status;

            await _dbcontext.SaveChangesAsync();
        }
    }
}
