export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Weight Management' | 'Recovery' | 'Performance' | 'Essentials' | 'Anti-Aging' | 'Bundles';
  description: string;
  image: string;
  badge?: string;
  isNew?: boolean;
  inStock: boolean;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Added for full article view
  date: string;
  category: string;
  readTime: string;
}

export interface COADocument {
  id: string;
  productName: string;
  batchNumber: string;
  purity: string;
  date: string;
}