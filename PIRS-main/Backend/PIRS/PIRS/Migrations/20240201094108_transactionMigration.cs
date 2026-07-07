using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PIRS.Migrations
{
    public partial class transactionMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompanyId",
                table: "Transactions",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContractorId",
                table: "Transactions",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateTime",
                table: "Transactions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<double>(
                name: "Payment",
                table: "Transactions",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "ReportId",
                table: "Transactions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_CompanyId",
                table: "Transactions",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_ContractorId",
                table: "Transactions",
                column: "ContractorId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_ReportId",
                table: "Transactions",
                column: "ReportId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_AspNetUsers_CompanyId",
                table: "Transactions",
                column: "CompanyId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_AspNetUsers_ContractorId",
                table: "Transactions",
                column: "ContractorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Reports_ReportId",
                table: "Transactions",
                column: "ReportId",
                principalTable: "Reports",
                principalColumn: "ReportId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_AspNetUsers_CompanyId",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_AspNetUsers_ContractorId",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Reports_ReportId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_CompanyId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_ContractorId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_ReportId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "ContractorId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "DateTime",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "Payment",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "ReportId",
                table: "Transactions");
        }
    }
}
