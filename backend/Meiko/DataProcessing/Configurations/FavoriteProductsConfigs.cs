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
    internal class FavoriteProductsConfigs : IEntityTypeConfiguration<FavoriteProducts>
    {
        public void Configure(EntityTypeBuilder<FavoriteProducts> builder)
        {
            builder.HasKey(fp => new { fp.IdProduct, fp.IdCustomer });

            // Cấu hình quan hệ với Products
            builder.HasOne(fp => fp.Products)
                .WithMany(p => p.FavoriteProducts)
                .HasForeignKey(fp => fp.IdProduct)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình quan hệ với Customers
            builder.HasOne(fp => fp.Customers)
                .WithMany(c => c.FavoriteProducts)
                .HasForeignKey(fp => fp.IdCustomer)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
