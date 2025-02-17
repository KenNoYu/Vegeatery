namespace vegeatery.Models
{
    public class PointsHistory
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int Points { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}
