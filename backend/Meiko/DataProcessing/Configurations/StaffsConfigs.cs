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
    internal class StaffsConfigs : IEntityTypeConfiguration<Staffs>
    {
        public void Configure(EntityTypeBuilder<Staffs> builder)
        {
            builder.HasKey(s => s.Id);

            // Cấu hình quan hệ với Accounts
            builder.HasOne(s => s.Accounts)
                .WithOne(a => a.Staffs)
                .HasForeignKey<Staffs>(s => s.IdAccount)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình quan hệ với Bills
            builder.HasMany(s => s.Bills)
                .WithOne(b => b.Staffs)
                .HasForeignKey(b => b.StaffId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
