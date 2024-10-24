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
    internal class CartDetailConfigs : IEntityTypeConfiguration<CartDetails>
    {
        public void Configure(EntityTypeBuilder<CartDetails> builder)
        {
            builder.HasKey(cd => cd.Id);

            // Cấu hình thuộc tính Quantity
            builder.Property(cd => cd.Quantity)
                .IsRequired()
                .HasDefaultValue(1)
                .HasComment("Số lượng phải lớn hơn hoặc bằng 1");

            // Cấu hình thuộc tính Price
            builder.Property(cd => cd.Price)
                .IsRequired()
                .HasColumnType("decimal(18,2)")
                .HasComment("Giá phải lớn hơn hoặc bằng 0");

            // Cấu hình thuộc tính Status
            builder.Property(cd => cd.Status)
                .IsRequired()
                .HasDefaultValue(1)
                .HasComment("Trạng thái phải từ 0 đến 5");

            // Cấu hình thuộc tính CartId (khóa ngoại)
            builder.HasOne(cd => cd.Carts)
                .WithMany(c => c.CartDetails)
                .HasForeignKey(cd => cd.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình thuộc tính ProductDetailsId (khóa ngoại)
            builder.HasOne(cd => cd.ProductDetails)
                .WithMany(pd => pd.CartDetails)
                .HasForeignKey(cd => cd.ProductDetailsId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
