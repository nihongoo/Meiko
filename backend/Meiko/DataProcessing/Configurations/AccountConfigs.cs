using DataProcessing.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Config
{
    internal class AccountConfigs : IEntityTypeConfiguration<Accounts>
    {
        public void Configure(EntityTypeBuilder<Accounts> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Username)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(a => a.Password)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.Status)
                .IsRequired();

            builder.Property(a => a.Role)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(a => a.CreatTime)
                .IsRequired();

            // Cấu hình mối quan hệ với Staffs
            builder.HasOne(a => a.Staffs)
                .WithOne(s => s.Accounts)
                .HasForeignKey<Accounts>(a => a.IdStaff)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình mối quan hệ với Customers
            builder.HasOne(a => a.Customers)
                .WithOne(c => c.Accounts)
                .HasForeignKey<Accounts>(a => a.IdCustomer)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
