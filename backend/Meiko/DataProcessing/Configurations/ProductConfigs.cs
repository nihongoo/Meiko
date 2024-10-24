using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Configurations
{
    internal class ProductConfigs : IEntityTypeConfiguration<Products>
    {
        public void Configure(EntityTypeBuilder<Products> builder)
        {
            builder.HasKey(p => p.Id);

            // Cấu hình quan hệ với Materials
            builder.HasOne(p => p.Materials)
                .WithMany(m => m.Products)
                .HasForeignKey(p => p.MaterialId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình quan hệ với Brands
            builder.HasOne(p => p.Brands)
                .WithMany(b => b.Products)
                .HasForeignKey(p => p.BrandId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình quan hệ với Categories
            builder.HasOne(p => p.Categories)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình quan hệ với TargretCustomers
            builder.HasOne(p => p.TargretCustomers)
                .WithMany(tc => tc.Products)
                .HasForeignKey(p => p.TargretCustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình quan hệ với ProductDetails
            builder.HasMany(p => p.ProductDetails)
                .WithOne(pd => pd.Products)
                .HasForeignKey(pd => pd.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình quan hệ với FavoriteProducts
            builder.HasMany(p => p.FavoriteProducts)
                .WithOne(fp => fp.Products)
                .HasForeignKey(fp => fp.IdProduct)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
