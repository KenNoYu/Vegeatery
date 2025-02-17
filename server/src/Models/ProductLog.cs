namespace vegeatery.Models
{
    public class ProductLog
    {
        public int ProductLogId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Action { get; set; }  // e.g., "Stock updated", "Product deactivated"
        public int PreviousStock { get; set; }
        public int NewStock { get; set; }
        public bool PreviousIsActive { get; set; }
        public bool NewIsActive { get; set; }
        public DateTime ChangedAt { get; set; }
    }
}
