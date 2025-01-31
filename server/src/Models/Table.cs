namespace vegeatery.Models
{
  using System.Text.Json.Serialization;

public class Table
{
    public int Id { get; set; }
    public string TableNumber { get; set; }
    public int Capacity { get; set; }
    public string Status { get; set; }

    [JsonIgnore] // Prevents circular references
    public ICollection<Reservation> Reservations { get; set; }
}

}