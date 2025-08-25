const pool = require('../db');
require('dotenv').config();

const products = [
  { 
    name: 'Gaming Laptop', 
    description: 'Powerful gaming laptop with RTX 4070 graphics', 
    price: 1499.99, 
    stock: 8,
    image_url: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&h=400&fit=crop'
  },
  { 
    name: 'iPhone 15 Pro', 
    description: 'Latest iPhone with titanium design and advanced camera', 
    price: 999.99, 
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop'
  },
  { 
    name: 'Wireless Headphones', 
    description: 'Premium noise-cancelling Bluetooth headphones', 
    price: 249.99, 
    stock: 12,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop'
  },
  { 
    name: '4K Monitor', 
    description: '27-inch 4K UHD IPS display with HDR', 
    price: 399.99, 
    stock: 6,
    image_url: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600&h=400&fit=crop'
  },
  { 
    name: 'Mechanical Keyboard', 
    description: 'RGB mechanical keyboard with Cherry MX switches', 
    price: 89.99, 
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=400&fit=crop'
  },
  { 
    name: 'Gaming Mouse', 
    description: 'Wireless gaming mouse with 25K DPI sensor', 
    price: 79.99, 
    stock: 18,
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop'
  },
  { 
    name: 'External SSD', 
    description: '1TB portable SSD with 1000MB/s transfer speeds', 
    price: 129.99, 
    stock: 10,
    image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=400&fit=crop'
  },
  { 
    name: 'HD Webcam', 
    description: '1080p webcam with built-in microphone and autofocus', 
    price: 69.99, 
    stock: 14,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
  },
  { 
    name: 'Smart Watch', 
    description: 'Fitness tracker with heart rate monitor and GPS', 
    price: 199.99, 
    stock: 7,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop'
  },
  { 
    name: 'Wireless Earbuds', 
    description: 'True wireless earbuds with 24hr battery life', 
    price: 129.99, 
    stock: 22,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop'
  }
];

async function seedProducts() {
  try {
    console.log(' Seeding 10 unique products...');
    
    let insertedCount = 0;
    
    for (const p of products) {
      try {
        const [result] = await pool.query(
          'INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
          [p.name, p.description, p.price, p.stock, p.image_url]
        );
        console.log(` Added: ${p.name}`);
        insertedCount++;
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`Skipped duplicate: ${p.name}`);
        } else {
          console.error(`Error inserting ${p.name}:`, err);
        }
      }
    }
    
    console.log(` ${insertedCount} products seeded successfully!`);
    
    // Verify the count
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM products');
    console.log(` Total products in database: ${rows[0].count}`);
    
  } catch (err) {
    console.error(' Error seeding products:', err);
  } finally {
    process.exit();
  }
}

seedProducts();