namespace vegeatery.Dtos
{

	internal class UserDto
	{
		public int Id { get; set; }
		public string Username { get; set; }
		public string Email { get; set; }
		public string DateofBirth { get; set; }
		public string ContactNumber { get; set; }
		public string Gender { get; set; }
		public string DietPreference { get; set; }
		public string AllergyInfo { get; set; }
		public string MealTypes { get; set; }
		public string Address { get; set; }
		public bool Promotions { get; set; }
		public bool Agreement { get; set; }
		public int TotalPoints { get; set; }
		public string JwtToken { get; set; }
		public DateTime CreatedAt { get; set; }
		public int RoleId { get; set; }
		public string RoleName { get; set; }
		public Guid CartId { get; set; }
	}
}
