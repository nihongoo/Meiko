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
    internal class VoucherDetailConfigs : IEntityTypeConfiguration<VoucherDetails>
    {
        public void Configure(EntityTypeBuilder<VoucherDetails> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(vd => vd.VoucherId)
                .IsRequired()
                .HasComment("Id voucher không được để trống.");

            builder.Property(vd => vd.CustomerId)
                .IsRequired()
                .HasComment("Id khách hàng không được để trống.");

            builder.Property(vd => vd.Status)
                .IsRequired()
                .HasDefaultValue(0) 
                .HasComment("Trạng thái không được để trống.");

            // Cấu hình mối quan hệ với Vouchers
            builder.HasOne(vd => vd.Vouchers)
                .WithMany(v => v.VoucherDetails) 
                .HasForeignKey(vd => vd.VoucherId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình mối quan hệ với Customers
            builder.HasOne(vd => vd.Customers)
                .WithMany(c => c.VoucherDetails) 
                .HasForeignKey(vd => vd.CustomerId)
                .OnDelete(DeleteBehavior.Cascade); 
        }
    }
}
