using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace vegeatery.Migrations
{
    /// <inheritdoc />
    public partial class AddFeedbackTitleToGeneralFeedback : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FeedbackTitle",
                table: "GeneralFeedbacks",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FeedbackTitle",
                table: "GeneralFeedbacks");
        }
    }
}
