using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Extention
{
	public class ToolDB<T> : IToolDB<T> where T : class
	{
		private readonly AppDbContext _dbContext;
		private readonly DbSet<T> _dbSet;
		public ToolDB(AppDbContext dbContext)
		{
			_dbContext = dbContext;
			_dbSet = _dbContext.Set<T>();
		}

		public async Task<List<T>> Search(string query, string prod)
		{
			try
			{
				if (string.IsNullOrWhiteSpace(query))
				{
					return await _dbSet.ToListAsync();
				}

				var result = await _dbSet
					.Where(x => EF.Property<string>(x, prod).ToLower().Contains(query.ToLower()))
					.ToListAsync();
				return result;
			}
			catch (Exception ex)
			{
				throw new Exception("Đã có lỗi: " + ex.Message);
			}
		}
	}
}
