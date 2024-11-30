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
	internal class PaymentHistoryConfigs : IEntityTypeConfiguration<PaymentHistory>
	{
		public void Configure(EntityTypeBuilder<PaymentHistory> builder)
		{
			builder.HasKey(ph => ph.Id);

			builder.Property(ph => ph.CreatedDate)
				.IsRequired()
				.HasComment("Ngày tạo ra trạng thái");

			builder.Property(ph => ph.Amount)
				.IsRequired()
				.HasComment("Số tiền khách đã giao dịch");

			builder.Property(ph => ph.PaymentMethod)
				.IsRequired()
				 .HasDefaultValue(PaymentMethods.TienMat)
				.HasComment("Phương thức thanh toán được sử dụng khi giao dịch");

			builder.Property(ph => ph.Status)
				.IsRequired()
				.HasDefaultValue(StatusForPayment.OnDinh)
				.HasComment("Trạng thái của 1 lần thanh toán");

			builder.HasOne(b => b.Bill)
				.WithMany(ph => ph.PaymentHistories)
				.HasForeignKey(a => a.BillId)
				.OnDelete(DeleteBehavior.Restrict);
		}
	}
}
