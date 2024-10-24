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
    internal class ColorConfigs : IEntityTypeConfiguration<Colors>
    {
        public void Configure(EntityTypeBuilder<Colors> builder)
        {
            // Khóa chính
            builder.HasKey(c => c.Id);

            // Cấu hình thuộc tính Hex
            builder.Property(c => c.Hex)
                .IsRequired()
                .HasComment("Mã màu không được để trống.")
                .HasMaxLength(7); // Chiều dài tối đa của mã màu hex

            // Cấu hình thuộc tính Status
            builder.Property(c => c.Status)
                .IsRequired()
                .HasComment("Trạng thái không được để trống.");

            // Thiết lập quan hệ với ProductDetails
            builder.HasMany(c => c.ProductDetails)
                .WithOne(pd => pd.Colors) 
                .HasForeignKey(pd => pd.ColorId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
