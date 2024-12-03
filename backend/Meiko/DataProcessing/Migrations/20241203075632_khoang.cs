using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataProcessing.Migrations
{
    public partial class khoang : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiaChiNguoiNhan",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "EmailNguoiNhan",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "GiamGia",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "LoaiHoaDon",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "NgayGiaoHang",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "NgayNhanHang",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "NgayThanhToan",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "PhuongThucThanhToan",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "SDTNguoiNhan",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "TenNguoiNhan",
                table: "Bills");

            migrationBuilder.RenameColumn(
                name: "PhiVanChuyen",
                table: "Bills",
                newName: "ShippingFee");

            migrationBuilder.RenameColumn(
                name: "LyDoKhachHuy",
                table: "Bills",
                newName: "ReasonForCancellation");

            migrationBuilder.RenameColumn(
                name: "KhachThanhToan",
                table: "Bills",
                newName: "PaymentAmount");

            migrationBuilder.RenameColumn(
                name: "CreateDate",
                table: "Bills",
                newName: "CreatedDate");

            migrationBuilder.AlterColumn<decimal>(
                name: "Total",
                table: "Bills",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m,
                comment: "Tổng số tiền của hóa đơn",
                oldClrType: typeof(double),
                oldType: "float(18)",
                oldPrecision: 18,
                oldScale: 2,
                oldDefaultValue: 0.0,
                oldComment: "Tổng số tiền của hóa đơn");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Bills",
                type: "int",
                nullable: false,
                defaultValue: 0,
                comment: "Trạng thái hóa đơn, từ 0 đến 10",
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 1,
                oldComment: "Trạng thái hóa đơn, từ 0 đến 5");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfRecept",
                table: "Bills",
                type: "datetime2",
                nullable: true,
                comment: "Ngày nhận hàng thực tế");

            migrationBuilder.AddColumn<DateTime>(
                name: "DeliveryDate",
                table: "Bills",
                type: "datetime2",
                nullable: true,
                comment: "Ngày giao hàng dự kiến");

            migrationBuilder.AddColumn<bool>(
                name: "IsShipping",
                table: "Bills",
                type: "bit",
                nullable: false,
                defaultValue: false,
                comment: "Có giao hàng hay không?");

            migrationBuilder.AddColumn<DateTime>(
                name: "PaymentDate",
                table: "Bills",
                type: "datetime2",
                nullable: true,
                comment: "Ngày thanh toán hóa đơn");

            migrationBuilder.CreateTable(
                name: "PaymentHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false, comment: "Ngày tạo ra trạng thái"),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false, comment: "Số tiền khách đã giao dịch"),
                    PaymentMethod = table.Column<int>(type: "int", nullable: false, defaultValue: 0, comment: "Phương thức thanh toán được sử dụng khi giao dịch"),
                    Status = table.Column<int>(type: "int", nullable: false, defaultValue: 0, comment: "Trạng thái của 1 lần thanh toán"),
                    BillId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PaymentHistories_Bills_BillId",
                        column: x => x.BillId,
                        principalTable: "Bills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ShippingAddresses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RecipientName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    AddressDetail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    City = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    District = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Ward = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    BillId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingAddresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShippingAddresses_Bills_BillId",
                        column: x => x.BillId,
                        principalTable: "Bills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StatusHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false, comment: "Ngày tạo ra trạng thái"),
                    StatusType = table.Column<int>(type: "int", nullable: false, comment: "Danh sách trạng thái mà hoá đơn đã trải qua"),
                    Note = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true, comment: "Ghi chú tối đa 256 kí tự"),
                    WhoCreatedThis = table.Column<Guid>(type: "uniqueidentifier", nullable: false, comment: "Ai là người đổi trạng thái đơn hàng?"),
                    BillId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StatusHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StatusHistories_Bills_BillId",
                        column: x => x.BillId,
                        principalTable: "Bills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PaymentHistories_BillId",
                table: "PaymentHistories",
                column: "BillId");

            migrationBuilder.CreateIndex(
                name: "IX_ShippingAddresses_BillId",
                table: "ShippingAddresses",
                column: "BillId");

            migrationBuilder.CreateIndex(
                name: "IX_StatusHistories_BillId",
                table: "StatusHistories",
                column: "BillId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaymentHistories");

            migrationBuilder.DropTable(
                name: "ShippingAddresses");

            migrationBuilder.DropTable(
                name: "StatusHistories");

            migrationBuilder.DropColumn(
                name: "DateOfRecept",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "DeliveryDate",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "IsShipping",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "PaymentDate",
                table: "Bills");

            migrationBuilder.RenameColumn(
                name: "ShippingFee",
                table: "Bills",
                newName: "PhiVanChuyen");

            migrationBuilder.RenameColumn(
                name: "ReasonForCancellation",
                table: "Bills",
                newName: "LyDoKhachHuy");

            migrationBuilder.RenameColumn(
                name: "PaymentAmount",
                table: "Bills",
                newName: "KhachThanhToan");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "Bills",
                newName: "CreateDate");

            migrationBuilder.AlterColumn<double>(
                name: "Total",
                table: "Bills",
                type: "float(18)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0.0,
                comment: "Tổng số tiền của hóa đơn",
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2,
                oldDefaultValue: 0m,
                oldComment: "Tổng số tiền của hóa đơn");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Bills",
                type: "int",
                nullable: false,
                defaultValue: 1,
                comment: "Trạng thái hóa đơn, từ 0 đến 5",
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0,
                oldComment: "Trạng thái hóa đơn, từ 0 đến 10");

            migrationBuilder.AddColumn<string>(
                name: "DiaChiNguoiNhan",
                table: "Bills",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true,
                comment: "Địa chỉ người nhận không vượt quá 200 ký tự");

            migrationBuilder.AddColumn<string>(
                name: "EmailNguoiNhan",
                table: "Bills",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                comment: "Email người nhận, tuân theo chuẩn Email");

            migrationBuilder.AddColumn<double>(
                name: "GiamGia",
                table: "Bills",
                type: "float",
                nullable: false,
                defaultValue: 0.0,
                comment: "Giá trị giảm giá của hóa đơn");

            migrationBuilder.AddColumn<string>(
                name: "LoaiHoaDon",
                table: "Bills",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                comment: "Loại hóa đơn, không quá 50 ký tự");

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayGiaoHang",
                table: "Bills",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                comment: "Ngày giao hàng dự kiến");

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayNhanHang",
                table: "Bills",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                comment: "Ngày nhận hàng thực tế");

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayThanhToan",
                table: "Bills",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                comment: "Ngày thanh toán hóa đơn");

            migrationBuilder.AddColumn<string>(
                name: "PhuongThucThanhToan",
                table: "Bills",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                comment: "Phương thức thanh toán, không quá 50 ký tự");

            migrationBuilder.AddColumn<string>(
                name: "SDTNguoiNhan",
                table: "Bills",
                type: "nvarchar(15)",
                maxLength: 15,
                nullable: true,
                comment: "Số điện thoại người nhận, tối đa 15 ký tự");

            migrationBuilder.AddColumn<string>(
                name: "TenNguoiNhan",
                table: "Bills",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                comment: "Tên người nhận không được vượt quá 100 ký tự");
        }
    }
}
