namespace vegeatery.Models
{
    public class Reservation
    {
        public int Id { get; set; } // Primary Key
        public DateOnly ReservationDate { get; set; } // The selected date for the reservation
        public string TimeSlot { get; set; } // The selected timeslot, e.g., "12:30 PM"
        public string CustomerName { get; set; } // Name of the customer
        public string CustomerEmail { get; set; } // Email of the customer
        public string CustomerPhone { get; set; } // Phone number of the customer
        public string Status { get; set; } // e.g., "Pending", "Seated", "Cancelled", "No-Show"
        public ICollection<Table> Tables { get; set; } = new List<Table>();

    }
}
