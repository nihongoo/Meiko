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
    internal class CategoryConfigs : IEntityTypeConfiguration<Categories>
    {
        public void Configure(EntityTypeBuilder<Categories> builder)
        {
            builder.HasKey(c => c.Id);

            // Đặt tên bảng (nếu cần)
            builder.ToTable("Categories");

            // Cấu hình thuộc tính Status
            builder.Property(c => c.Status)
                .IsRequired()
                .HasComment("Trạng thái là bắt buộc.")
                .HasConversion<int>(); 

            // Thiết lập quan hệ với Products
            builder.HasMany(c => c.Products)
                .WithOne(p => p.Categories)
                .HasForeignKey(p => p.CategoryId) 
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
