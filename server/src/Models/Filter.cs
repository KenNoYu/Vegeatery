using System;
using System.Collections.Generic;
using System.Linq;

namespace vegeatery.Models
{
    public class ProductFilter
    {
        public string? ProductName { get; set; }
        public int? CategoryId { get; set; }
        public int? MinProductPoints { get; set; }
        public int? MaxProductPoints { get; set; }
        public decimal? MinProductPrice { get; set; }
        public decimal? MaxProductPrice { get; set; }
        public bool? IsDiscounted { get; set; }
        public decimal? MinCalories { get; set; }
        public decimal? MaxCalories { get; set; }

        // Apply filters to the product list
        public IQueryable<Product> ApplyFiltering(IQueryable<Product> products)
        {
            var filteredProducts = products;

            if (CategoryId.HasValue)
            {
                filteredProducts = filteredProducts.Where(p => p.CategoryId == CategoryId);
            }

            if (MinProductPoints.HasValue)
            {
                filteredProducts = filteredProducts.Where(p => p.ProductPoints >= MinProductPoints);
            }

            if (MaxProductPoints.HasValue)
            {
                filteredProducts = filteredProducts.Where(p => p.ProductPoints <= MaxProductPoints);
            }

            if (MinProductPrice.HasValue)
            {
                filteredProducts = filteredProducts.Where(p => p.ProductPrice >= MinProductPrice);
            }

            if (MaxProductPrice.HasValue)
            {
                filteredProducts = filteredProducts.Where(p => p.ProductPrice <= MaxProductPrice);
            }   

            if (MinCalories.HasValue)
            {
                filteredProducts = filteredProducts.Where(p => p.Calories >= MinCalories);
            }

            if (MaxCalories.HasValue)
            {
                filteredProducts = filteredProducts.Where(p => p.Calories <= MaxCalories);
            }

            if (IsDiscounted.HasValue)
            {
                filteredProducts = filteredProducts.Where(p => p.DiscountPercentage.HasValue == IsDiscounted);
            }

            return filteredProducts;
        }
    }
}
