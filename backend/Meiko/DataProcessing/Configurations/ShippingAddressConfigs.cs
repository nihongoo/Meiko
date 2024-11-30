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
    internal class ShippingAddressConfigs : IEntityTypeConfiguration<ShippingAddress>
    {
        public void Configure(EntityTypeBuilder<ShippingAddress> builder)
        {
            // Định nghĩa khóa chính
            builder.HasKey(a => a.Id);

            // Cấu hình các thuộc tính
            builder.Property(a => a.RecipientName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.PhoneNumber)
                .IsRequired()
                .HasMaxLength(15)
                .IsUnicode(false);

            builder.Property(a => a.AddressDetail)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(a => a.City)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(a => a.District)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(a => a.Ward)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(a => a.Status)
                .IsRequired()
                .HasDefaultValue(1)
                .HasConversion<int>();

            builder.HasOne(b => b.Bill)
                .WithMany(c => c.ShippingAddresses)
                .HasForeignKey(a => a.BillId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
