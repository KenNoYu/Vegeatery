namespace vegeatery.Models
{
    public class ReservationLog
    {
        public int Id { get; set; } // Primary Key
        public int ReservationId { get; set; } // Foreign Key to Reservation
        public Reservation? Reservation { get; set; } // Navigation Property
        public DateTime? LogDate { get; set; } // Timestamp for the log entry
        public string Action { get; set; }
        public DateOnly ReservationDate { get; set; }
        public string TimeSlot { get; set; }
        public string Tables { get; set; }
        public string DoneBy { get; set; }
    }
}
