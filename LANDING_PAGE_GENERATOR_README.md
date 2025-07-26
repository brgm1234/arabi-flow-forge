# 🚀 AI Landing Page Generator

A powerful AI-driven system that transforms any product URL into high-converting COD (Cash on Delivery) landing pages using real API integrations.

## 🌟 Features

### Core Functionality
- **Product URL Analysis**: Extract product information from major e-commerce platforms
- **AI-Powered Classification**: Automatically categorize products and determine target audience
- **Dynamic Design Generation**: Create custom color palettes and typography based on product type
- **Persuasive Content Creation**: Generate compelling headlines, descriptions, and copy using AI
- **Image Processing**: Remove backgrounds and optimize product images
- **Countdown Timers**: Add urgency with customizable countdown timers
- **COD Form Integration**: Fully functional Cash on Delivery order forms
- **Real-time Analytics**: Track user interactions and conversion metrics

### API Integrations

#### 1. **SerpAPI** - Product Information Extraction
- **Purpose**: Extract product details from search results
- **Usage**: Fallback for product information when direct scraping fails
- **Features**: Price extraction, product titles, descriptions

#### 2. **Browse AI** - Web Scraping
- **Purpose**: Direct product page scraping for detailed information
- **Usage**: Primary method for extracting comprehensive product data
- **Features**: Images, specifications, pricing, reviews

#### 3. **Groq AI** - Content Generation
- **Purpose**: AI-powered content creation and classification
- **Model**: Mixtral-8x7b-32768
- **Features**: 
  - Product classification
  - Design theme generation
  - Persuasive copywriting
  - Content personalization

#### 4. **Remove.bg** - Image Processing
- **Purpose**: Remove backgrounds from product images
- **Usage**: Create clean, professional product images
- **Features**: Automatic background removal, image optimization

#### 5. **Cloudinary** - Image Management
- **Purpose**: Image hosting, optimization, and transformation
- **Features**: 
  - Automatic image optimization
  - Multiple format support
  - CDN delivery
  - Thumbnail generation

## 🏗️ Architecture

### File Structure
```
src/
├── types/
│   └── landingPageGenerator.ts    # TypeScript definitions
├── services/
│   ├── realApiServices.ts         # API service integrations
│   └── landingPageGenerator.ts    # Main orchestration service
├── hooks/
│   └── useLandingPageGenerator.ts # React hooks for UI integration
├── pages/
│   └── LandingPageGenerator.tsx   # Main generator interface
├── components/
│   └── CODLandingPage.tsx        # Landing page template
└── .env                          # API keys and configuration
```

### Data Flow
1. **URL Input**: User provides product URL
2. **Product Extraction**: Browse AI scrapes product data (fallback to SerpAPI)
3. **AI Classification**: Groq AI classifies product and target audience
4. **Design Generation**: AI creates custom design theme and color palette
5. **Content Creation**: AI generates persuasive copy and marketing content
6. **Image Processing**: Remove.bg processes product images
7. **Image Upload**: Cloudinary hosts and optimizes images
8. **Landing Page Assembly**: Components are combined into final landing page
9. **COD Integration**: Functional order form with validation

## 🚀 Quick Start

### 1. Environment Setup
Create a `.env` file with your API keys:

```env
VITE_SERPAPI_KEY=your_serpapi_key
VITE_REMOVEBG_KEY=your_removebg_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
VITE_BROWSEAI_API_KEY=your_browseai_api_key
VITE_GROQ_API_KEY=your_groq_api_key
```

### 2. Usage Example

```typescript
import { useGenerateLandingPage } from '@/hooks/useLandingPageGenerator';

const MyComponent = () => {
  const { generate, isGenerating, progress, landingPageData } = useGenerateLandingPage();

  const handleGenerate = () => {
    generate({
      productUrl: 'https://www.amazon.in/product-url',
      customizations: {
        urgencyLevel: 'high',
        countdownHours: 24,
        includeCountdown: true,
      },
    });
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={isGenerating}>
        Generate Landing Page
      </button>
      {progress && <div>Progress: {progress.progress}%</div>}
      {landingPageData && <div>Landing page generated!</div>}
    </div>
  );
};
```

## 📋 API Reference

### Core Services

#### LandingPageGenerator Class
```typescript
const generator = new LandingPageGenerator((progress) => {
  console.log(`${progress.step}: ${progress.progress}%`);
});

const landingPage = await generator.generateLandingPage({
  productUrl: 'https://example.com/product',
  customizations: {
    urgencyLevel: 'medium',
    countdownHours: 48,
  },
});
```

#### COD Order Service
```typescript
import { codOrderService } from '@/services/landingPageGenerator';

const result = await codOrderService.submitOrder({
  landingPageId: 'lp_123',
  formData: {
    name: 'John Doe',
    phone: '9876543210',
    address: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    quantity: 1,
  },
  productInfo: {
    name: 'Product Name',
    price: 999,
  },
});
```

### React Hooks

#### useGenerateLandingPage
```typescript
const {
  generate,           // Function to start generation
  isGenerating,       // Boolean loading state
  progress,           // Progress object with step info
  landingPageData,    // Generated landing page data
  error,              // Error object if generation fails
  reset,              // Function to reset state
} = useGenerateLandingPage();
```

#### useCODOrder
```typescript
const {
  submitOrder,        // Function to submit COD order
  isSubmitting,       // Boolean loading state
  orderResult,        // Order result with success/error info
  resetOrder,         // Function to reset order state
} = useCODOrder();
```

#### useCountdownTimer
```typescript
const {
  timeLeft,           // Object with days, hours, minutes, seconds
  isExpired,          // Boolean indicating if timer expired
  formatTime,         // Function to format time with leading zeros
} = useCountdownTimer(endDate);
```

## 🎨 Customization

### Design Themes
The system automatically generates design themes based on:
- Product category (electronics, fashion, home, etc.)
- Target audience (men, women, unisex, kids, general)
- Price range (budget, mid-range, premium, luxury)

### Content Personalization
AI-generated content includes:
- Compelling headlines optimized for conversion
- Product descriptions with benefit-focused copy
- Urgency-inducing text based on urgency level
- Testimonials and social proof
- FAQ sections relevant to product category

### Countdown Timer Options
```typescript
customizations: {
  urgencyLevel: 'low' | 'medium' | 'high',
  countdownHours: number,
  includeCountdown: boolean,
}
```

## 🔧 Configuration

### Supported Platforms
- Amazon (amazon.com, amazon.in)
- Flipkart (flipkart.com)
- Myntra (myntra.com)
- Ajio (ajio.com)
- Nykaa (nykaa.com)
- Shopify stores
- WooCommerce stores

### Image Processing Settings
- Background removal: Automatic
- Optimization: Auto quality, format conversion
- CDN delivery: Global CloudFront distribution
- Thumbnails: 200x200px for gallery views

### Form Validation Rules
```typescript
validationRules: {
  name: { required: true, minLength: 2 },
  phone: { required: true, pattern: /^[0-9]{10}$/ },
  email: { required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  address: { required: true, minLength: 10 },
  city: { required: true, minLength: 2 },
  state: { required: true, minLength: 2 },
  pincode: { required: true, pattern: /^[0-9]{6}$/ },
  quantity: { required: true, min: 1, max: 10 },
}
```

## 📊 Analytics & Tracking

### Built-in Events
- `page_view`: Landing page viewed
- `cta_click`: Call-to-action button clicked
- `form_start`: Order form started
- `form_submit`: Order form submitted
- `order_complete`: Order successfully placed

### Usage
```typescript
const { trackEvent, trackPageView, trackCTAClick } = useAnalytics(landingPageId);

// Custom event tracking
trackEvent('custom_event', { property: 'value' });

// Built-in event tracking
trackPageView();
trackCTAClick();
```

## 🚀 Deployment

### Environment Variables
Ensure all API keys are properly configured in your production environment:

```bash
# SerpAPI for product information
VITE_SERPAPI_KEY=your_key_here

# Remove.bg for image processing
VITE_REMOVEBG_KEY=your_key_here

# Cloudinary for image hosting
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret

# Browse AI for web scraping
VITE_BROWSEAI_API_KEY=your_api_key

# Groq for AI content generation
VITE_GROQ_API_KEY=your_api_key
```

### Build and Deploy
```bash
npm run build
npm run preview  # Test production build locally
```

## 🔒 Security Considerations

### API Key Management
- All API keys are prefixed with `VITE_` for client-side access
- In production, consider using a backend proxy for sensitive operations
- Implement rate limiting to prevent API abuse

### Data Privacy
- Order data is processed locally and not stored permanently
- Customer information should be handled according to privacy regulations
- Implement proper data encryption for sensitive information

## 🐛 Troubleshooting

### Common Issues

#### API Errors
```typescript
// Handle API failures gracefully
try {
  const result = await generator.generateLandingPage(request);
} catch (error) {
  console.error('Generation failed:', error.message);
  // Implement fallback logic
}
```

#### Image Processing Failures
- The system automatically falls back to original images if processing fails
- Check Remove.bg API limits and quota
- Verify image URLs are accessible

#### Content Generation Issues
- Groq API has rate limits - implement proper retry logic
- Fallback content is provided if AI generation fails
- Monitor API usage and costs

### Debug Mode
```typescript
// Enable detailed logging
const generator = new LandingPageGenerator((progress) => {
  console.log('Generation Progress:', progress);
});
```

## 📈 Performance Optimization

### Image Optimization
- Cloudinary automatically optimizes images for web delivery
- Lazy loading implemented for better page performance
- WebP format used when supported

### API Efficiency
- Parallel processing where possible
- Caching implemented for repeated requests
- Graceful degradation for API failures

### Bundle Size
- Tree shaking enabled for unused code elimination
- Dynamic imports for large components
- Optimized build configuration

## 🤝 Contributing

### Adding New Platforms
1. Update `landingPageUtils.validateProductUrl()` with new domains
2. Implement platform-specific scraping logic in Browse AI
3. Test with various product URLs from the platform

### Extending AI Capabilities
1. Modify prompts in `groqService` for better content generation
2. Add new content types (videos, animations, etc.)
3. Implement A/B testing for different content variations

### Custom Design Themes
1. Extend `DesignTheme` interface with new properties
2. Update theme generation logic in Groq service
3. Implement theme preview functionality

## 📄 License

This project is part of a larger application system. Please refer to the main project license for usage terms.

---

## 🆘 Support

For technical support or questions:
1. Check the troubleshooting section above
2. Review API documentation for each service
3. Test with sample product URLs to verify setup
4. Monitor browser console for detailed error messages

The system is designed to be robust with multiple fallback mechanisms to ensure landing pages are generated even if some APIs fail.