const db = {
  shirts: [
    {
      id: "prod_01",
      name: "Classic Oxford",
      price: "45",
      description: "A timeless classic. This Oxford shirt offers a tailored fit with premium breathable cotton, perfect for formal meetings or casual evenings. Designed to keep you comfortable all day long.",
      image: "https://picsum.photos/200/300?random=4",
      rating: 4.8,
      reviews: 124,
      quantity: 15, // NORMAL STOCK
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'White', hex: '#ffffff' },
        { name: 'Light Blue', hex: '#bae6fd' },
        { name: 'Navy', hex: '#1e3a8a' }
      ]
    },
    {
      id: "prod_02",
      name: "Midnight Joggers",
      price: "50",
      description: "Experience ultimate comfort. Crafted from high-quality stretch fabric, these joggers feature a modern tailored fit, perfect for intense workouts or relaxed street style.",
      image: "https://picsum.photos/200/300?random=3",
      rating: 4.9,
      reviews: 89,
      quantity: 3, // LOW STOCK - Will trigger the "Hurry up!" warning
      sizes: ['M', 'L', 'XL'],
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Charcoal', hex: '#334155' }
      ]
    },
    {
      id: "prod_03",
      name: "Urban Chinos",
      price: "55",
      description: "Versatile, durable, and sharply styled. The Urban Chinos bring a sleek silhouette to your everyday wardrobe without compromising on mobility and comfort.",
      image: "https://picsum.photos/200/300.jpg",
      rating: 4.5,
      reviews: 45,
      quantity: 0, // SOLD OUT - Will show stamp and disable buttons
      sizes: ['30', '32', '34', '36'],
      colors: [
        { name: 'Khaki', hex: '#d4d4d8' },
        { name: 'Olive', hex: '#3f6212' },
        { name: 'Navy', hex: '#1e3a8a' }
      ]
    },
    {
      id: "prod_04",
      name: "Linen Breeze",
      price: "60",
      description: "Beat the heat with our ultra-lightweight Linen Breeze shirt. Naturally breathable and stylishly wrinkled for that ultimate relaxed vacation aesthetic.",
      image: "https://picsum.photos/200/300?random=1",
      rating: 4.7,
      reviews: 210,
      quantity: 8, // NORMAL STOCK
      sizes: ['S', 'M', 'L', 'XXL'],
      colors: [
        { name: 'Cream', hex: '#fef3c7' },
        { name: 'Sage', hex: '#bbf7d0' }
      ]
    }
  ],
  pants: [
    {
      id: "prod_29",
      name: "Classic Oxford",
      price: "45",
      description: "A timeless classic. This Oxford shirt offers a tailored fit with premium breathable cotton, perfect for formal meetings or casual evenings. Designed to keep you comfortable all day long.",
      image: "https://picsum.photos/200/300?random=4",
      rating: 4.8,
      reviews: 124,
      quantity: 15, // NORMAL STOCK
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'White', hex: '#ffffff' },
        { name: 'Light Blue', hex: '#bae6fd' },
        { name: 'Navy', hex: '#1e3a8a' }
      ]
    },
    {
      id: "prod_77",
      name: "Midnight Joggers",
      price: "50",
      description: "Experience ultimate comfort. Crafted from high-quality stretch fabric, these joggers feature a modern tailored fit, perfect for intense workouts or relaxed street style.",
      image: "https://picsum.photos/200/300?random=3",
      rating: 4.9,
      reviews: 89,
      quantity: 3, // LOW STOCK - Will trigger the "Hurry up!" warning
      sizes: ['M', 'L', 'XL'],
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Charcoal', hex: '#334155' }
      ]
    },
    {
      id: "prod_03",
      name: "Urban Chinos",
      price: "55",
      description: "Versatile, durable, and sharply styled. The Urban Chinos bring a sleek silhouette to your everyday wardrobe without compromising on mobility and comfort.",
      image: "https://picsum.photos/200/300.jpg",
      rating: 4.5,
      reviews: 45,
      quantity: 0, // SOLD OUT - Will show stamp and disable buttons
      sizes: ['30', '32', '34', '36'],
      colors: [
        { name: 'Khaki', hex: '#d4d4d8' },
        { name: 'Olive', hex: '#3f6212' },
        { name: 'Navy', hex: '#1e3a8a' }
      ]
    },
    {
      id: "prod_22",
      name: "Linen Breeze",
      price: "60",
      description: "Beat the heat with our ultra-lightweight Linen Breeze shirt. Naturally breathable and stylishly wrinkled for that ultimate relaxed vacation aesthetic.",
      image: "https://picsum.photos/200/300?random=1",
      rating: 4.7,
      reviews: 210,
      quantity: 8, // NORMAL STOCK
      sizes: ['S', 'M', 'L', 'XXL'],
      colors: [
        { name: 'Cream', hex: '#fef3c7' },
        { name: 'Sage', hex: '#bbf7d0' }
      ]
    }
  ],
  
  combinations: [
    {
      id: "combo_01",
      name: "The Executive Wave",
      price: "120",
      description: "A complete professional look curated by our top stylists. Includes our signature tailored shirt and premium trousers. Ready to wear, ready to impress.",
      image: "https://picsum.photos/200/300?random=2",
      rating: 5.0,
      reviews: 32,
      quantity: 5, // LOW STOCK
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Navy/Grey', hex: '#1e3a8a' }
      ]
    }
  ]
};

export default db;