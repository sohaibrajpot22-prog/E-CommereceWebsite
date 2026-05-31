# Glass Apparel - Premium E-Commerce Platform

![Glass Apparel](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-8-purple) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-teal) ![License](https://img.shields.io/badge/License-MIT-green)

A modern, fully-featured e-commerce platform for premium glass-themed apparel. Built with React, Vite, and Tailwind CSS with complete checkout flow, Cash on Delivery (COD) support, and Pakistani rupee pricing.

## ✨ Key Features

### 🛍️ Complete Shopping Experience
- **Product Browsing**: Curated collection of premium shirts, pants, and outfit combinations
- **Smart Cart**: Add/remove items, manage quantities, persistent cart using localStorage
- **Order Management**: Full checkout flow with delivery information and order confirmation

### 💳 Payment & Delivery (Pakistani Focus)
- **Cash on Delivery (COD)**: Pay when your order arrives
- **Dynamic Delivery Charges** (Pakistani Cities):
  - Karachi & Lahore: Rs. 250
  - Islamabad & Peshawar: Rs. 350
  - Quetta: Rs. 400
  - Other cities: Rs. 500
- **Order Tracking**: Real-time status updates and confirmation details

### 🤖 AI-Powered Features
- **AI Stylist**: Generate outfit combinations using Google Gemini API
- **AI Enhancements**: Smart product naming and pricing suggestions

### 🎨 Beautiful Design
- **Glass-morphism UI**: Modern, premium aesthetic with frosted glass effects
- **Smooth Animations**: Fade-in animations, loading states, hover effects
- **Fully Responsive**: Perfect on desktop, tablet, and mobile devices
- **Dark Theme**: Eye-friendly dark interface with teal accents

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd glass-apparel

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Lint code for errors
npm run lint
```

## 🌐 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `VITE_GEMINI_API_KEY`
5. Deploy!

### Vercel
1. Import project from GitHub
2. Vercel auto-configures for Vite
3. Add environment variables in project settings
4. Deploy with one click!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📁 Project Structure

```
src/
├── components/              # Reusable components
│   ├── Background.jsx      # Animated background
│   ├── BubblesLoader.jsx   # Loading animation
│   ├── FadeIn.jsx          # Scroll fade animation
│   └── Sidebar.jsx         # Navigation sidebar
├── views/                  # Page views
│   ├── HomeView.jsx        # Landing page
│   ├── ProductGrid.jsx     # Product listings
│   ├── CombinationsView.jsx # Outfit pairs
│   ├── CartView.jsx        # Shopping cart
│   ├── CheckoutView.jsx    # Checkout form
│   ├── OrderConfirmationView.jsx # Order success
│   └── AdminView.jsx       # Product management
├── services/
│   └── geminiApi.js        # Google Gemini integration
├── data/
│   └── mockDatabase.js     # Sample product data
├── cartManager.js          # Cart utilities
├── priceCalculator.js      # Pricing & delivery logic
├── orderStorage.js         # Order persistence
├── App.jsx                 # Main component
└── main.jsx               # Entry point
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| Tailwind CSS 4 | Styling |
| Lucide React | Icons |
| localStorage | Client-side data persistence |
| Google Gemini API | AI features |

## 📝 Environment Variables

```env
# Google Gemini API Key (for AI Stylist)
VITE_GEMINI_API_KEY=your_api_key_here

# App environment
VITE_ENV=development  # development, preview, or production
```

Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey).

## 💡 Features in Detail

### Shopping Cart
- Real-time item addition/removal
- Quantity management with +/- buttons
- Price calculation per item
- Persistent storage across sessions
- Quick view of cart total

### Checkout Process
1. Cart Review → 2. Delivery Information → 3. Order Summary → 4. Place Order (COD) → 5. Order Confirmation

### Order Storage
- Orders saved in browser localStorage
- Unique order IDs with timestamps
- Complete order history retrieval

### Admin Panel
- Add/delete products
- AI Enhancement for product names
- Real-time inventory management

## 🎯 Pakistani Market Features

✅ Rupee (Rs.) Pricing - All prices in PKR
✅ City-Based Delivery - Optimized for major Pakistani cities
✅ Cash on Delivery - Most popular payment method
✅ Local Phone Format Support

## 📄 License

MIT License - Feel free to use this project for personal and commercial purposes.

---

**Ready to deploy? Check out our [Deployment Guide](./DEPLOYMENT.md)!**

