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
    internal class SaleProductConfigs : IEntityTypeConfiguration<SaleProducts>
    {
        public void Configure(EntityTypeBuilder<SaleProducts> builder)
        {
            builder.HasKey(pd => new { pd.ProductDetailId, pd.SaleId });

            builder.HasOne(pd => pd.Productdetail)
                .WithMany(p => p.SaleProducts)
                .HasForeignKey(pd => pd.ProductDetailId)
                .OnDelete(DeleteBehavior.Cascade); // Xóa sản phẩm cũng xóa các giảm giá liên quan

            // Cấu hình khóa ngoại với bảng Discount
            builder.HasOne(pd => pd.sales)
                .WithMany(d => d.SaleProducts)
                .HasForeignKey(pd => pd.SaleId)
                .OnDelete(DeleteBehavior.Restrict); // Không xóa giảm giá nếu sản phẩm bị xóa

            // Thiết lập kiểu dữ liệu cho các thuộc tính
            builder.Property(pd => pd.DiscountedPrice)
                .HasColumnType("decimal(18,2)"); // Kiểu dữ liệu cho giá sau khi giảm

            // Ngày bắt đầu giảm giá là bắt buộc
            builder.Property(pd => pd.EffectiveDate)
                .IsRequired();

            // Ngày hết hạn là tùy chọn
            builder.Property(pd => pd.ExpiryDate)
                .IsRequired(false);
        }
    }
}
