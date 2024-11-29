using DataProcessing.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataProcessing.Configurations
{
	internal class StatusHistoryConfigs : IEntityTypeConfiguration<StatusHistory>
	{
		public void Configure(EntityTypeBuilder<StatusHistory> builder)
		{
			builder.HasKey(sh => sh.Id);

			builder.Property(sh => sh.CreatedDate)
				.IsRequired()
				.HasComment("Ngày tạo ra trạng thái");

			builder.Property(sh => sh.StatusType)
				.IsRequired()
				.HasComment("Danh sách trạng thái mà hoá đơn đã trải qua");

			builder.Property(sh => sh.Note)
				.HasMaxLength(256)
				.IsRequired(false)
				.HasComment("Ghi chú tối đa 256 kí tự");

			builder.Property(sh => sh.WhoCreatedThis)
				.IsRequired()
				.HasComment("Ai là người đổi trạng thái đơn hàng?");

			builder.HasOne(b => b.Bill)
				.WithMany(c => c.StatusHistories)
				.HasForeignKey(a => a.BillId)
				.OnDelete(DeleteBehavior.Restrict);
		}
	}
}
