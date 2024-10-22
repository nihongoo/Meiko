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
    internal class MaterialConfigs : IEntityTypeConfiguration<Materials>
    {
        public void Configure(EntityTypeBuilder<Materials> builder)
        {
            builder.HasKey(m => m.Id);

            // Cấu hình quan hệ với Products
            builder.HasMany(m => m.Products)
                .WithOne(p => p.Materials)
                .HasForeignKey(p => p.MaterialId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
