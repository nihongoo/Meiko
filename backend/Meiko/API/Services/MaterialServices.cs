using API.IServices;
using API.ViewModel;
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
        public async Task Create(MaterialViewModel materialViewModel)
        {
            var material = new Materials
            {
                Id = Guid.NewGuid(),
                Name = materialViewModel.Name,
                Status = 1,
            };

            _dbcontext.Materials.Add(material);
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

        public async Task Update(Guid id, MaterialViewModel materialViewModel)
        {
            var material = await _dbcontext.Materials.FindAsync(id);
            if (material == null) throw new Exception("Brand not found");

            material.Name = materialViewModel.Name;
            material.Status = 1;

            await _dbcontext.SaveChangesAsync();
        }
    }
}
