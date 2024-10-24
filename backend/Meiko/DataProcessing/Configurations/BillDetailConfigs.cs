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
    internal class BillDetailConfigs : IEntityTypeConfiguration<BillDetails>
    {
        public void Configure(EntityTypeBuilder<BillDetails> builder)
        {
            builder.HasKey(bd => bd.Id);


            builder.Property(bd => bd.Quantity)
                .IsRequired()
                .HasDefaultValue(1)
                .HasConversion<int>()
                .HasComment("Số lượng sản phẩm trong chi tiết hóa đơn");

            builder.Property(bd => bd.Price)
                .IsRequired()
                .HasPrecision(18, 2)
                .HasComment("Giá của sản phẩm trong chi tiết hóa đơn");

            builder.Property(bd => bd.Status)
                .IsRequired()
                .HasDefaultValue(1)
                .HasConversion<int>()
                .HasComment("Trạng thái chi tiết hóa đơn: 0-Hủy, 1-Đang xử lý, 2-Hoàn thành");

            builder.HasOne(bd => bd.Bills)
                .WithMany(b => b.BillDetails)
                .HasForeignKey(bd => bd.BillId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(bd => bd.ProductDetails)
                .WithMany(pd => pd.BillDetails)
                .HasForeignKey(bd => bd.ProductDetailId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
