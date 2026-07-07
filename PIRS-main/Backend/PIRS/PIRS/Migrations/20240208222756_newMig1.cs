using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PIRS.Migrations
{
    public partial class newMig1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_AspNetUsers_HiringCompanyId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_HiringCompanyId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "HiringCompanyId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "HiringCompanyId",
                table: "AspNetUsers",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_HiringCompanyId",
                table: "AspNetUsers",
                column: "HiringCompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_AspNetUsers_HiringCompanyId",
                table: "AspNetUsers",
                column: "HiringCompanyId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
