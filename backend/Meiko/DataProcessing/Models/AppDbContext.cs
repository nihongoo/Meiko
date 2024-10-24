using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Models
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext()
        {

        }

        public AppDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Address> Address { get; set; }
        public DbSet<BillDetails> BillDetails { get; set; }
        public DbSet<Bills> Bills { get; set; }
        public DbSet<Brands> Brands { get; set; }
        public DbSet<CartDetails> CartDetails { get; set; }
        public DbSet<Carts> Carts { get; set; }
        public DbSet<Categories> Categories { get; set; }
        public DbSet<Colors> Colors { get; set; }
        public DbSet<Customers> Customers { get; set; }
        public DbSet<FavoriteProducts> FavoriteProducts { get; set; }
        public DbSet<Images> Images { get; set; }
        public DbSet<Materials> Materials { get; set; }
        public DbSet<ProductDetails> ProductDetails { get; set; }
        public DbSet<Products> Products { get; set; }
        public DbSet<Sales> Sales { get; set; }
        public DbSet<Sizes> Sizes { get; set; }
        public DbSet<Staffs> Staffs { get; set; }
        public DbSet<TargretCustomers> TargretCustomers { get; set; }
        public DbSet<VoucherDetails> VoucherDetails { get; set; }
        public DbSet<Vouchers> Vouchers { get; set; }
        public DbSet<Banners> Banners { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=MSI;Database =DATN; Trusted_Connection = True; TrustServerCertificate = True");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
<<<<<<< HEAD
=======
            base.OnModelCreating(modelBuilder);
<<<<<<< HEAD
>>>>>>> cuong
=======
>>>>>>> cuong
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
