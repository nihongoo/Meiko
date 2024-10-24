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
    internal class ImageConfig : IEntityTypeConfiguration<Images>
    {
        public void Configure(EntityTypeBuilder<Images> builder)
        {
            builder.HasKey(i => i.Id);

            builder.HasOne(i => i.ProductDetails)
                .WithMany(pd => pd.Images)
                .HasForeignKey(i => i.ProductDetailId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
