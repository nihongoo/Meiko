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
    internal class TargretCustomerConfigs : IEntityTypeConfiguration<TargretCustomers>
    {
        public void Configure(EntityTypeBuilder<TargretCustomers> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(tc => tc.Status)
                .IsRequired()
                .HasDefaultValue(0);

            // Cấu hình mối quan hệ với Products
            builder.HasMany(tc => tc.Products)
                .WithOne(p => p.TargretCustomers)
                .HasForeignKey(p => p.TargretCustomerId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
