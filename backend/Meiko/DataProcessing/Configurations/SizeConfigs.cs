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
    internal class SizeConfigs : IEntityTypeConfiguration<Sizes>
    {
        public void Configure(EntityTypeBuilder<Sizes> builder)
        {
            builder.HasKey(s => s.Id);

            // Cấu hình quan hệ với ProductDetails
            builder.HasMany(s => s.ProductDetails)
                .WithOne(pd => pd.Sizes)
                .HasForeignKey(pd => pd.SizeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
