# Glass Apparel - E-Commerce Website

A premium e-commerce platform for glass-themed apparel with AI-powered styling recommendations, complete checkout flow with Cash on Delivery (COD), and Pakistani rupee pricing.

## Features

✨ **Beautiful UI**
- Glass-morphism design with smooth animations
- Responsive layout for all devices
- Interactive product showcase

🛍️ **Shopping Experience**
- Browse shirts, pants, and outfit combinations
- Add items to cart with quantity management
- Persistent cart using localStorage

💳 **Checkout & Payments**
- Complete checkout form with validation
- **Cash on Delivery (COD)** payment method
- Delivery charges based on Pakistani cities:
  - Karachi: Rs. 250
  - Lahore: Rs. 250
  - Islamabad: Rs. 350
  - Peshawar: Rs. 350
  - Quetta: Rs. 400
  - Other cities: Rs. 500

📦 **Order Management**
- Order confirmation with detailed tracking
- Order history stored locally
- Email confirmation support

🤖 **AI Features**
- AI Stylist: Generate outfit combinations using Google Gemini API
- AI Enhancement: Enhance product names and pricing suggestions

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Icons**: Lucide React
- **State Management**: React Hooks, localStorage
- **Build**: Vite with optimized chunks

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd glass-apparel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Google Gemini API key (optional for AI features)
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder ready for deployment.

## Deployment Options

### Netlify (Recommended)

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Set environment variables in Settings → Build & deploy → Environment
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API key
8. Deploy!

### Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite configuration
6. Set environment variables:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API key
7. Deploy!

### GitHub Pages

```bash
npm run build
# Deploy dist folder to gh-pages branch
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Background.jsx
│   ├── BubblesLoader.jsx
│   ├── FadeIn.jsx
│   └── Sidebar.jsx
├── views/              # Page components
│   ├── HomeView.jsx
│   ├── ProductGrid.jsx
│   ├── CombinationsView.jsx
│   ├── CartView.jsx
│   ├── CheckoutView.jsx
│   ├── OrderConfirmationView.jsx
│   └── AdminView.jsx
├── services/           # API integrations
│   └── geminiApi.js
├── data/              # Mock data
│   └── mockDatabase.js
├── cartManager.js     # Cart utilities
├── priceCalculator.js # Pricing logic
├── orderStorage.js    # Order persistence
├── App.jsx            # Main app component
├── App.css            # Global styles
└── main.jsx           # Entry point
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Breakdown

### Cart Management
- Add/remove items
- Update quantities
- Real-time total calculation
- Persistent storage

### Checkout Process
1. Review cart items
2. Enter delivery information
3. Select delivery city (auto-calculates charges)
4. Review order summary
5. Place order (COD)
6. Receive order confirmation with tracking

### Order Storage
- Orders stored in browser's localStorage
- Order ID generation with timestamp
- Customer details retention
- Order history available

## Environment Variables

```env
VITE_GEMINI_API_KEY=your_api_key_here    # For AI Stylist feature
VITE_ENV=development                      # development, preview, or production
```

Get a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

## Troubleshooting

**AI Stylist not working?**
- Ensure `VITE_GEMINI_API_KEY` is set correctly
- Check browser console for API errors

**Cart not persisting?**
- Clear browser cache and try again
- Check if localStorage is enabled

**Build errors?**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

## Performance Optimizations

- Code splitting with lazy loading
- Optimized bundle size (~200KB gzipped)
- CSS minification
- Image optimization with Tailwind
- Efficient state management

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

All rights reserved © 2025 Glass Apparel

## Support

For issues or questions, please create an issue in the repository.

---

**Made with ❤️ using React and Tailwind CSS**
