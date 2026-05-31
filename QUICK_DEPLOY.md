# 🚀 Quick Deployment Checklist

## Before Deploying

### 1. API Keys & Environment
- [ ] Set `VITE_GEMINI_API_KEY` in platform environment variables (if using AI features)
  - Get key from: https://aistudio.google.com/apikey
  - This is optional - app works without it

### 2. Build Test
```bash
npm install          # Install latest deps
npm run lint         # Check for errors
npm run build        # Build for production
npm run preview      # Test production build locally
```

### 3. Files to Deploy
- Only the `dist/` folder needs to be deployed
- Everything else stays in your repo

---

## Deploy to Netlify

1. Go to https://netlify.com and sign in
2. Click "New site from Git"
3. Select your GitHub repository
4. Settings should auto-detect:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Go to "Site settings" → "Environment variables"
6. Add: `VITE_GEMINI_API_KEY` (your API key)
7. Click "Deploy site"
8. ✅ Done! Your site is live

---

## Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite configuration
5. Go to "Settings" → "Environment Variables"
6. Add: `VITE_GEMINI_API_KEY` (your API key)
7. Click "Deploy"
8. ✅ Done! Your site is live

---

## Deploy to GitHub Pages

```bash
npm run build
# Copy dist folder contents to gh-pages branch
# Push to GitHub
# Go to repo Settings → Pages → Select gh-pages branch
```

---

## Post-Deployment

### Verify Everything Works

1. **Products Page**
   - [ ] Can see shirts, pants, combinations
   - [ ] Images load correctly

2. **Shopping Cart**
   - [ ] Can add items to cart
   - [ ] Cart badge shows count
   - [ ] Cart persists after refresh

3. **Checkout**
   - [ ] Can fill in delivery form
   - [ ] City selection changes delivery charge
   - [ ] Total updates correctly

4. **Order Confirmation**
   - [ ] Order ID displays
   - [ ] Delivery address shows
   - [ ] Amount due shows correct total

5. **Performance**
   - [ ] Page loads in <2 seconds
   - [ ] Mobile view is responsive
   - [ ] No console errors

### Test on Different Devices
- [ ] Desktop browser
- [ ] Mobile browser
- [ ] Tablet browser

### Check Browser Compatibility
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Troubleshooting

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### AI Features Not Working
- Verify `VITE_GEMINI_API_KEY` is set correctly
- Check it's a valid Google Gemini API key
- It's optional - app works without it

### Cart Not Persisting
- Check if localStorage is enabled in browser
- Check browser DevTools → Application → Local Storage

### Deploy Fails
- Ensure `dist/` folder is being published
- Check build logs for errors
- Verify all environment variables are set

---

## Environment Variables Reference

| Variable | Required | Where to Get |
|----------|----------|--------------|
| `VITE_GEMINI_API_KEY` | Optional | https://aistudio.google.com/apikey |
| `VITE_ENV` | Optional | Auto-detected by platform |

---

## Platform-Specific Settings

### Netlify
- Automatic builds on git push
- SPA redirects configured in `netlify.toml`
- Environment variables in Site settings

### Vercel
- Automatic builds on git push
- Vite auto-detected
- Environment variables in Project settings

### GitHub Pages
- Manual deployment required
- Use `gh-pages` npm package or manual push

---

## Performance Tips

✅ Already configured:
- Code splitting for vendors
- CSS minification
- JS minification
- No source maps in production
- Optimized images with placeholders

---

## Security Checklist

- [ ] API keys stored as environment variables (not in code)
- [ ] No sensitive data in localStorage
- [ ] No console.logs left in production code
- [ ] HTTPS enabled on hosting platform

---

## Support & Help

**Netlify Docs**: https://docs.netlify.com/
**Vercel Docs**: https://vercel.com/docs
**Vite Docs**: https://vitejs.dev/
**React Docs**: https://react.dev/

---

## What's Included in This Project

✅ Complete e-commerce flow
✅ Cash on Delivery payment
✅ Pakistani rupee pricing
✅ Delivery charges by city
✅ Order confirmation
✅ Cart persistence
✅ Responsive design
✅ AI stylist (optional)
✅ Production-ready code

---

## File Structure for Deployment

```
dist/
├── index.html          # Main page
├── assets/
│   ├── index-*.js      # React bundle
│   ├── react-vendor-*.js
│   ├── lucide-*.js
│   └── index-*.css     # Styles
└── favicon.svg         # Icon
```

All files in `dist/` are served by your hosting platform.

---

**Ready to deploy? Choose your platform and follow the steps above!**

For more details, see README.md and DEPLOYMENT.md
