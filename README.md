# LazyMint - Digital Creator Platform

LazyMint empowers creators to securely engage fans and distribute unique digital content without crypto complexities, offering lazy minting of verifiable campaign data to Algorand.

## ✨ Features

- **No Crypto Complexity**: Fans can claim digital content without wallets or crypto knowledge
- **AI-Powered Creation**: Generate content, backgrounds, and artistic QR codes
- **Firebase Integration**: Secure authentication and real-time data management
- **RevenueCat Monetization**: Subscription tiers with feature gating
- **Algorand Blockchain**: Optional campaign metadata verification
- **Responsive Design**: Beautiful UI that works on all devices

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + ShadcN/UI
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Payments**: RevenueCat Web SDK
- **Blockchain**: Algorand (via Firebase Cloud Functions)
- **Routing**: React Router v6

## 🛠️ Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd lazymint
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Fill in your Firebase and RevenueCat configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# RevenueCat Configuration  
VITE_REVENUECAT_API_KEY=your_revenuecat_api_key
```

4. **Start development server**
```bash
npm run dev
```

## 🔧 Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Enable Storage for file uploads
5. Deploy the provided Cloud Functions for backend functionality
6. Copy your configuration to `.env`

## 💳 RevenueCat Setup

1. Create account at [revenuecat.com](https://revenuecat.com)
2. Create a new project and configure Web platform
3. Connect your Stripe account for billing
4. Set up product offerings and entitlements
5. Copy your API keys to `.env`

**Important**: RevenueCat Web SDK requires Stripe for payment processing. Ensure your Stripe account is properly connected.

## 🌐 Deployment

### Netlify Deployment

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Netlify**
- Connect your GitHub repository to Netlify
- Set build command: `npm run build`
- Set publish directory: `dist`
- Add environment variables in Netlify dashboard

3. **Configure custom domain**
- Add your custom domain (e.g., www.lazymint.me)
- Configure DNS settings as instructed by Netlify

### Environment Variables for Production

Ensure all environment variables are set in your deployment environment:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN` 
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_REVENUECAT_API_KEY`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN/UI components
│   ├── layout/         # Header, Footer, Navigation
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   └── demo/           # Demo mode components
├── pages/              # Page components
│   ├── auth/           # Login, Register pages
│   ├── dashboard/      # Dashboard pages
│   └── demo/           # Demo pages
├── stores/             # Zustand state management
├── config/             # Configuration files
└── lib/                # Utility functions
```

## 🎯 Subscription Tiers

- **Free**: 1 campaign, 100 claims/month, basic analytics
- **Basic ($9.99/month)**: 5 campaigns, 1,000 claims, AI generation
- **Pro ($29.99/month)**: Unlimited campaigns, unlimited claims, Algorand logging

## 🔒 Security Features

- Email verification for all claims
- Firebase security rules
- Rate limiting on Cloud Functions
- CORS protection
- Environment variable security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@lazymint.me or join our Discord community.

## 🏆 Built for Hackathons

This project demonstrates:
- **Make More Money Challenge**: RevenueCat subscription integration
- **Blockchain Challenge**: Algorand lazy minting
- **Deploy Challenge**: Netlify deployment ready
- **One-Shot Competition**: Complete solution in single prompt

---

**Built with ⚡ Bolt.new** - The fastest way to build full-stack applications.