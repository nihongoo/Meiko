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
    internal class BillConfigs : IEntityTypeConfiguration<Bills>
    {
        public void Configure(EntityTypeBuilder<Bills> builder)
        {
            // Định nghĩa khóa chính
            builder.HasKey(b => b.Id);

            // Cấu hình các thuộc tính
            builder.Property(b => b.BillCode)
                .HasMaxLength(50)
                .IsRequired(false)  // Có thể để null
                .HasComment("Mã hóa đơn, không quá 50 ký tự");

            builder.Property(b => b.IsShipping)
                .IsRequired()
                .HasComment("Có giao hàng hay không?");

            builder.Property(b => b.Total)
                .IsRequired()
                .HasDefaultValue(0)
                .HasPrecision(18, 2)
                .HasComment("Tổng số tiền của hóa đơn");

            builder.Property(b => b.CreatedDate)
                .IsRequired()
                .HasComment("Ngày tạo hóa đơn");

            builder.Property(b => b.DeliveryDate)
                .IsRequired(false)
                .HasComment("Ngày giao hàng dự kiến");

            builder.Property(b => b.DateOfRecept)
                .IsRequired(false)
                .HasComment("Ngày nhận hàng thực tế");

            builder.Property(b => b.PaymentDate)
				.IsRequired(false)
				.HasComment("Ngày thanh toán hóa đơn");

            builder.Property(b => b.Status)
                .IsRequired()
                .HasDefaultValue(StatusType.TaoHoaDon)
                .HasComment("Trạng thái hóa đơn, từ 0 đến 10");

            builder.Property(b => b.PaymentAmount)
                .HasDefaultValue(0)
                .HasPrecision(18, 2)
                .HasComment("Số tiền khách thanh toán");

            builder.Property(b => b.ShippingFee)
                .HasDefaultValue(0)
                .HasPrecision(18, 2)
                .HasComment("Phí vận chuyển của hóa đơn");

            builder.Property(b => b.ReasonForCancellation)
                .HasMaxLength(500)
                .HasComment("Lý do khách hàng hủy hóa đơn, không quá 500 ký tự");

            // Cấu hình quan hệ với Customers
            builder.HasOne(b => b.Customers)
                .WithMany(c => c.Bills)
                .HasForeignKey(b => b.CustomerId)
                .OnDelete(DeleteBehavior.SetNull);

            // Cấu hình quan hệ với Vouchers
            builder.HasOne(b => b.Vouchers)
                .WithMany(v => v.Bills)
                .HasForeignKey(b => b.VoucherId)
                .OnDelete(DeleteBehavior.SetNull);

            // Cấu hình quan hệ với Staffs
            builder.HasOne(b => b.Staffs)
                .WithMany(s => s.Bills)
                .HasForeignKey(b => b.StaffId)
                .OnDelete(DeleteBehavior.SetNull);

            // Cấu hình quan hệ với BillDetails
            builder.HasMany(b => b.BillDetails)
                .WithOne(bd => bd.Bills)
                .HasForeignKey(bd => bd.BillId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình quan hệ với ShippingAddresses
			builder.HasMany(b => b.ShippingAddresses)
				.WithOne(sa => sa.Bill)
				.HasForeignKey(b => b.BillId)
				.OnDelete(DeleteBehavior.Cascade);

			// Cấu hình quan hệ với StatusHistories
			builder.HasMany(b => b.StatusHistories)
				.WithOne(sh => sh.Bill)
				.HasForeignKey(b => b.BillId)
				.OnDelete(DeleteBehavior.Cascade);

			// Cấu hình quan hệ với PaymentHistories
			builder.HasMany(b => b.PaymentHistories)
				.WithOne(ph => ph.Bill)
				.HasForeignKey(b => b.BillId)
				.OnDelete(DeleteBehavior.Cascade);
		}
    }
}
