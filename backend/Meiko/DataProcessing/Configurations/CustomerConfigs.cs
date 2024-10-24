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
    internal class CustomerConfigs : IEntityTypeConfiguration<Customers>
    {
        public void Configure(EntityTypeBuilder<Customers> builder)
        {
            builder.HasKey(c => c.Id);

            // Đặt tên bảng (nếu cần)
            builder.ToTable("Customers");

            builder.Property(c => c.Sex)
                .IsRequired()
                .HasComment("Giới tính không được để trống.");

            builder.Property(c => c.BirthDay)
                .IsRequired()
                .HasComment("Ngày sinh không được để trống.");

            builder.Property(c => c.PhoneNumber)
                .IsRequired()
                .HasComment("Số điện thoại không được để trống.");

            builder.Property(c => c.Email)
                .IsRequired()
                .HasComment("Email không được để trống.");

            // Cấu hình thuộc tính Status
            builder.Property(c => c.Status)
                .IsRequired()
                .HasComment("Trạng thái không được để trống.");

            builder.HasOne(c => c.Accounts)
                .WithOne(a => a.Customers)
                .HasForeignKey<Customers>(c => c.IdAccount)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình quan hệ với Address
            builder.HasMany(c => c.Address)
                .WithOne(a => a.Customers) // Giả sử Address có thuộc tính Customers
                .HasForeignKey(a => a.CustomerId) // Giả sử Address có CustomerId
                .OnDelete(DeleteBehavior.Cascade); // Hành động xóa

            // Cấu hình quan hệ với VoucherDetails
            builder.HasMany(c => c.VoucherDetails)
                .WithOne(vd => vd.Customers) // Giả sử VoucherDetails có thuộc tính Customers
                .HasForeignKey(vd => vd.CustomerId) // Giả sử VoucherDetails có CustomerId
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình quan hệ với Bills
            builder.HasMany(c => c.Bills)
                .WithOne(b => b.Customers) // Giả sử Bills có thuộc tính Customers
                .HasForeignKey(b => b.CustomerId) // Giả sử Bills có CustomerId
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình quan hệ với Carts
            builder.HasOne(c => c.Carts)
                .WithOne(c => c.Customers) // Giả sử Carts có thuộc tính Customers
                .HasForeignKey<Carts>(c => c.CustomerId) // Carts có CustomerId
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
