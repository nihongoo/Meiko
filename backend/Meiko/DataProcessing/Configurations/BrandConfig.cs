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
    internal class BrandConfig : IEntityTypeConfiguration<Brands>
    {
        public void Configure(EntityTypeBuilder<Brands> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Name)
                .IsRequired()
                .HasMaxLength(100)
                .HasComment("Tên thương hiệu phải từ 3 đến 100 ký tự");

            builder.Property(b => b.BrandCode)
                .IsRequired()
                .HasComment("Mã thương hiệu lớn hơn 0");

            builder.Property(b => b.Status)
                .IsRequired()
                .HasDefaultValue(1)
                .HasComment("Trạng thái thương hiệu từ 0 đến 5");

            builder.HasMany(b => b.Products)
                .WithOne(p => p.Brands)
                .HasForeignKey(p => p.BrandId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
