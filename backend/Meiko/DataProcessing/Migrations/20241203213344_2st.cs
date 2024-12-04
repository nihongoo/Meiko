using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataProcessing.Migrations
{
    public partial class _2st : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "customerId",
                table: "Reviews",
                newName: "CustomerId");

            migrationBuilder.AddColumn<string>(
                name: "CustomerAvatar",
                table: "Reviews",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustomerName",
                table: "Reviews",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "HelpfulCount",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "ParentReviewId",
                table: "Reviews",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UnhelpfulCount",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomerAvatar",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "CustomerName",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "HelpfulCount",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "ParentReviewId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "UnhelpfulCount",
                table: "Reviews");

            migrationBuilder.RenameColumn(
                name: "CustomerId",
                table: "Reviews",
                newName: "customerId");
        }
    }
}
