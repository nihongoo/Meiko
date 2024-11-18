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

            builder.HasMany(p => p.SaleProducts)
            .WithOne(pd => pd.Productdetail)
            .HasForeignKey(pd => pd.ProductDetailId);

            // Cấu hình quan hệ với Sizes
            builder.HasOne(pd => pd.Sizes)
                .WithMany(s => s.ProductDetails) 
                .HasForeignKey(pd => pd.SizeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
