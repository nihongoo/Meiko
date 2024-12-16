using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataProcessing.Migrations
{
    public partial class Khoang : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RequestRefunds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    requester = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BillId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    AmountRefund = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequestRefunds", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RefundItem",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RequestRefundId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefundItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefundItem_RequestRefunds_RequestRefundId",
                        column: x => x.RequestRefundId,
                        principalTable: "RequestRefunds",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RefundItem_RequestRefundId",
                table: "RefundItem",
                column: "RequestRefundId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RefundItem");

            migrationBuilder.DropTable(
                name: "RequestRefunds");
        }
    }
}
