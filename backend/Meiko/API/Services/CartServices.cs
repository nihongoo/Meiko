using API.IServices;
using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
	public class CartServices : ICartServices
	{
		public readonly AppDbContext _dbcontext;
        public CartServices(AppDbContext db)
        {
            _dbcontext = db;
        }
        public async Task<bool> CreateCartAsync(Guid CustomerId)
		{
			using (var dbTransaction = _dbcontext.Database.BeginTransaction())
			{
				try
				{
					await _dbcontext.Carts.AddAsync(new Carts()
					{
						Id = Guid.NewGuid(),
						CreateTime = DateTime.Now,
						Total = 0,
						Status = 0,
						CustomerId = CustomerId
					});

					_dbcontext.SaveChanges();

					dbTransaction.Commit();
					return true;

				}catch (Exception ex)
				{
					dbTransaction.Rollback();

					Console.WriteLine(ex.Message);
					return false;
				}
			}
		}

		public async Task<bool> DeleteCartAsync(Guid CustomerId)
		{
			using (var dbTransaction = _dbcontext.Database.BeginTransaction())
			{
				try
				{
					var cart = await _dbcontext.Carts.Where(c => c.CustomerId == CustomerId).FirstOrDefaultAsync();

					_dbcontext.Carts.Remove(cart);

					_dbcontext.SaveChanges();

					dbTransaction.Commit();
					return true;

				}
				catch (Exception ex)
				{
					dbTransaction.Rollback();

					Console.WriteLine(ex.Message);
					return false;
				}
			}
		}

		public async Task<IEnumerable<Carts>> GetAllCartAsync()
		{
			return await _dbcontext.Carts.ToListAsync();
		}

		public async Task<Carts> GetCartByCustomerIdAsync(Guid CustomerId)
		{
			var result = await _dbcontext.Carts.Where(c => c.CustomerId == CustomerId).FirstOrDefaultAsync();
			return result;
		}

		public async Task<bool> UpdateCartAsync(Guid CartId, int? Status)
		{
			using (var dbTransaction = _dbcontext.Database.BeginTransaction())
			{
				try
				{
					var cart = await _dbcontext.Carts.FindAsync(CartId);
					if (cart == null) return false;

					_dbcontext.CartDetails.Where(cd => cd.CartId == CartId).ToList()
						.ForEach(cd =>
						{
							cart.Total += cd.Price;
						});

					if(Status != null) cart.Status = (int)Status;

					_dbcontext.Update(cart);
					_dbcontext.SaveChanges();

					dbTransaction.Commit();
					return true;

				}
				catch (Exception ex)
				{
					dbTransaction.Rollback();

					Console.WriteLine(ex.Message);
					return false;
				}
			}
		}
	}
}
