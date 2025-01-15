namespace vegeatery.Models
{
    public class Tier
    {
        public int TierId { get; set; }
        public string TierName { get; set; } = string.Empty; // Bronze, Silver, Gold
        public int MinPoints { get; set; }
    }
}
