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
    internal class ProductDetailConfig : IEntityTypeConfiguration<ProductDetails>
    {
        public void Configure(EntityTypeBuilder<ProductDetails> builder)
        {
            builder.HasKey(pd => pd.Id);

            // Cấu hình quan hệ với Products
            builder.HasOne(pd => pd.Products)
                .WithMany(p => p.ProductDetails)
                .HasForeignKey(pd => pd.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình quan hệ với Colors
            builder.HasOne(pd => pd.Colors)
                .WithMany(c => c.ProductDetails)
                .HasForeignKey(pd => pd.ColorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình quan hệ với Sales
            builder.HasOne(pd => pd.Sales)
                .WithMany(s => s.ProductDetails)
                .HasForeignKey(pd => pd.SaleId)
                .OnDelete(DeleteBehavior.SetNull);

            // Cấu hình quan hệ với Sizes
            builder.HasOne(pd => pd.Sizes)
                .WithMany(s => s.ProductDetails) 
                .HasForeignKey(pd => pd.SizeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
