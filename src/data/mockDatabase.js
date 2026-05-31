const initialDatabase = {
  shirts: [
    { id: 's1', name: 'Midnight Silk Blend', price: 45, image: 'https://placehold.co/400x500/0f172a/ffffff?text=Midnight+Silk' },
    { id: 's2', name: 'Ocean Breathe Tee', price: 30, image: 'https://placehold.co/400x500/0f172a/ffffff?text=Ocean+Breathe' },
    { id: 's3', name: 'Crystal Clear Button-Up', price: 60, image: 'https://placehold.co/400x500/0f172a/ffffff?text=Crystal+Button-Up' },
    { id: 's4', name: 'Frosted Glass Polo', price: 40, image: 'https://placehold.co/400x500/0f172a/ffffff?text=Frosted+Polo' },
  ],
  pants: [
    { id: 'p1', name: 'Deep Sea Chinos', price: 55, image: 'https://placehold.co/400x500/020617/ffffff?text=Deep+Sea+Chinos' },
    { id: 'p2', name: 'Wave Runner Joggers', price: 45, image: 'https://placehold.co/400x500/020617/ffffff?text=Wave+Joggers' },
    { id: 'p3', name: 'Abyss Formal Trousers', price: 75, image: 'https://placehold.co/400x500/020617/ffffff?text=Abyss+Trousers' },
    { id: 'p4', name: 'Aqua Denim Jeans', price: 65, image: 'https://placehold.co/400x500/020617/ffffff?text=Aqua+Denim' },
  ],
  combinations: [
    { 
      id: 'c1', 
      name: 'The Executive Wave', 
      price: 120, 
      shirtId: 's3', 
      pantId: 'p3',
      image: 'https://placehold.co/600x400/083344/ffffff?text=The+Executive+Wave+Pair'
    },
    { 
      id: 'c2', 
      name: 'Casual Current', 
      price: 70, 
      shirtId: 's2', 
      pantId: 'p2',
      image: 'https://placehold.co/600x400/083344/ffffff?text=Casual+Current+Pair'
    },
  ]
};
  export default initialDatabase;