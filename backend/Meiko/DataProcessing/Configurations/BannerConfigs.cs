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
    internal class BannerConfigs : IEntityTypeConfiguration<Banners>
    {
        public void Configure(EntityTypeBuilder<Banners> builder)
        {
            builder.HasKey(x => x.Id);
        }
    }
}
