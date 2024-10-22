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
    internal class VoucherConfigs : IEntityTypeConfiguration<Vouchers>
    {
        public void Configure(EntityTypeBuilder<Vouchers> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(v => v.VoucherCode)
                .IsRequired()
                .HasMaxLength(50)
                .HasComment("Mã voucher không được để trống.");

            builder.Property(v => v.Value)
                .IsRequired()
                .HasComment("Giá trị không được để trống.");

            builder.Property(v => v.Quantity)
                .IsRequired()
                .HasComment("Số lượng không được để trống.");

            builder.Property(v => v.StartDay)
                .IsRequired()
                .HasComment("Ngày bắt đầu không được để trống.");

            builder.Property(v => v.EndDay)
                .IsRequired()
                .HasComment("Ngày kết thúc không được để trống.");

            builder.Property(v => v.Status)
                .IsRequired()
                .HasComment("Trạng thái không được để trống.");

            // Cấu hình mối quan hệ với VoucherDetails
            builder.HasMany(v => v.VoucherDetails)
                .WithOne(vd => vd.Vouchers)
                .HasForeignKey(vd => vd.VoucherId)
                .OnDelete(DeleteBehavior.Cascade); 

            // Cấu hình mối quan hệ với Bills
            builder.HasMany(v => v.Bills)
                .WithOne(b => b.Vouchers)
                .HasForeignKey(b => b.VoucherId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
