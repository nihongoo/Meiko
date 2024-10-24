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
    internal class CartConfigs : IEntityTypeConfiguration<Carts>
    {
        public void Configure(EntityTypeBuilder<Carts> builder)
        {
            builder.HasKey(c => c.Id);

            // Cấu hình thuộc tính CreateTime
            builder.Property(c => c.CreateTime)
                .IsRequired()
                .HasComment("Thời gian tạo không được để trống");

            // Cấu hình thuộc tính Total
            builder.Property(c => c.Total)
                .IsRequired()
                .HasColumnType("decimal(18,2)")
                .HasComment("Tổng tiền phải lớn hơn hoặc bằng 0");

            // Cấu hình thuộc tính Status
            builder.Property(c => c.Status)
                .IsRequired()
                .HasDefaultValue(1)
                .HasComment("Trạng thái phải từ 0 đến 5");

            builder.HasOne(c => c.Customers)
                .WithOne(cu => cu.Carts)
                .HasForeignKey<Carts>(c => c.CustomerId)
                .OnDelete(DeleteBehavior.Cascade); 

            // Cấu hình mối quan hệ với CartDetails
            builder.HasMany(c => c.CartDetails)
                .WithOne(cd => cd.Carts)
                .HasForeignKey(cd => cd.CartId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
