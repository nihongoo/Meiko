using API.IServices;
using API.ViewModel;
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
        public async Task Create(ColorViewModel colorViewModel)
        {
            var color = new Colors
            {
                Id = Guid.NewGuid(),
                Name = colorViewModel.Name,
                Hex = colorViewModel.Hex,
                Status = colorViewModel.Status
            };

            _dbcontext.Colors.Add(color);
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

        public async Task Update(ColorViewModel colorViewModel)
        {
            var color = await _dbcontext.Colors.FindAsync(colorViewModel.Id);
            if (color == null) throw new Exception("Brand not found");

            color.Name = colorViewModel.Name;
            color.Hex = colorViewModel.Hex;
            color.Status = colorViewModel.Status;

            await _dbcontext.SaveChangesAsync();
        }
    }
}
