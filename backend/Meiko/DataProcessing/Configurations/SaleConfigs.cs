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
    internal class SaleConfigs : IEntityTypeConfiguration<Sales>
    {
        public void Configure(EntityTypeBuilder<Sales> builder)
        {
            builder.HasKey(s => s.Id);

            // Cấu hình quan hệ với ProductDetails
            builder.HasMany(s => s.SaleProducts)
                .WithOne(pd => pd.sales)
                .HasForeignKey(pd => pd.SaleId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
