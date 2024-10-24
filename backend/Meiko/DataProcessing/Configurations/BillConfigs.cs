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

            builder.Property(b => b.Total)
                .IsRequired()
                .HasDefaultValue(0)
                .HasPrecision(18, 2)
                .HasComment("Tổng số tiền của hóa đơn");

            builder.Property(b => b.CreateDate)
                .IsRequired()
                .HasComment("Ngày tạo hóa đơn");

            builder.Property(b => b.NgayGiaoHang)
                .IsRequired()
                .HasComment("Ngày giao hàng dự kiến");

            builder.Property(b => b.NgayNhanHang)
                .IsRequired()
                .HasComment("Ngày nhận hàng thực tế");

            builder.Property(b => b.NgayThanhToan)
                .IsRequired()
                .HasComment("Ngày thanh toán hóa đơn");

            builder.Property(b => b.Status)
                .IsRequired()
                .HasDefaultValue(1)
                .HasComment("Trạng thái hóa đơn, từ 0 đến 5");

            builder.Property(b => b.TenNguoiNhan)
                .HasMaxLength(100)
                .HasComment("Tên người nhận không được vượt quá 100 ký tự");

            builder.Property(b => b.EmailNguoiNhan)
                .HasMaxLength(100)
                .HasComment("Email người nhận, tuân theo chuẩn Email");

            builder.Property(b => b.SDTNguoiNhan)
                .HasMaxLength(15)
                .HasComment("Số điện thoại người nhận, tối đa 15 ký tự");

            builder.Property(b => b.DiaChiNguoiNhan)
                .HasMaxLength(200)
                .HasComment("Địa chỉ người nhận không vượt quá 200 ký tự");

            builder.Property(b => b.GiamGia)
                .HasDefaultValue(0)
                .HasComment("Giá trị giảm giá của hóa đơn");

            builder.Property(b => b.KhachThanhToan)
                .HasDefaultValue(0)
                .HasPrecision(18, 2)
                .HasComment("Số tiền khách thanh toán");

            builder.Property(b => b.PhiVanChuyen)
                .HasDefaultValue(0)
                .HasPrecision(18, 2)
                .HasComment("Phí vận chuyển của hóa đơn");

            builder.Property(b => b.LyDoKhachHuy)
                .HasMaxLength(500)
                .HasComment("Lý do khách hàng hủy hóa đơn, không quá 500 ký tự");

            builder.Property(b => b.LoaiHoaDon)
                .HasMaxLength(50)
                .HasComment("Loại hóa đơn, không quá 50 ký tự");

            builder.Property(b => b.PhuongThucThanhToan)
                .HasMaxLength(50)
                .HasComment("Phương thức thanh toán, không quá 50 ký tự");

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
        }
    }
}
