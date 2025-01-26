using System.ComponentModel.DataAnnotations;

public class Point 
{
    [Key]
    public int Id { get; set; }

    [Range(1, 5)]
    [Required]
    public int Value { get; set; }

    [MaxLength(500)] // You can limit the description length if needed
    public string Description { get; set; }
}
