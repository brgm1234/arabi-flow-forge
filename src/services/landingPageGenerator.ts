import {
  LandingPageData,
  GenerateLandingPageRequest,
  GenerationProgress,
  CountdownTimer,
  CODFormData,
  CODOrderRequest,
} from '@/types/landingPageGenerator';
import {
  serpApiService,
  browseAiService,
  groqService,
  imageProcessingService,
} from './realApiServices';

export class LandingPageGenerator {
  private progressCallback?: (progress: GenerationProgress) => void;

  constructor(progressCallback?: (progress: GenerationProgress) => void) {
    this.progressCallback = progressCallback;
  }

  private updateProgress(step: string, progress: number, message: string, error?: string) {
    if (this.progressCallback) {
      this.progressCallback({
        step,
        progress,
        message,
        completed: progress === 100,
        error,
      });
    }
  }

  async generateLandingPage(request: GenerateLandingPageRequest): Promise<LandingPageData> {
    try {
      this.updateProgress('starting', 0, 'Starting landing page generation...');

      // Step 1: Extract product information
      this.updateProgress('extracting', 10, 'Extracting product information from URL...');
      const productInfo = await this.extractProductInfo(request.productUrl);

      // Step 2: Classify product
      this.updateProgress('classifying', 25, 'Classifying product type and target audience...');
      const classification = await groqService.classifyProduct(productInfo);

      // Step 3: Generate design theme
      this.updateProgress('designing', 40, 'Generating design theme and color palette...');
      const theme = await groqService.generateDesignTheme(classification);

      // Step 4: Generate content
      this.updateProgress('content', 55, 'Generating persuasive content and copy...');
      const content = await groqService.generateContent(productInfo, classification);

      // Step 5: Process images
      this.updateProgress('images', 70, 'Processing product images...');
      const processedImages = await imageProcessingService.processProductImages(productInfo.images);

      // Step 6: Create countdown timer
      this.updateProgress('countdown', 85, 'Setting up countdown timer...');
      const countdown = this.createCountdownTimer(request.customizations);

      // Step 7: Configure COD form
      this.updateProgress('form', 95, 'Configuring COD form...');
      const codForm = this.createCODForm();

      this.updateProgress('completed', 100, 'Landing page generated successfully!');

      return {
        productInfo,
        classification,
        theme,
        content,
        images: processedImages,
        countdown,
        codForm,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.updateProgress('error', 0, 'Generation failed', errorMessage);
      throw error;
    }
  }

  private async extractProductInfo(url: string) {
    try {
      // First try Browse AI for detailed scraping
      return await browseAiService.scrapeProductPage(url);
    } catch (error) {
      console.warn('Browse AI failed, falling back to SerpAPI:', error);
      // Fallback to SerpAPI
      return await serpApiService.extractProductInfo(url);
    }
  }

  private createCountdownTimer(customizations?: GenerateLandingPageRequest['customizations']): CountdownTimer {
    const hours = customizations?.countdownHours || 24;
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + hours);

    const urgencyLevel = customizations?.urgencyLevel || 'medium';
    
    const titles = {
      low: 'Special Offer Ends Soon',
      medium: 'Limited Time Offer',
      high: 'FLASH SALE - Ends Today!',
    };

    return {
      endTime,
      title: titles[urgencyLevel],
      urgencyLevel,
    };
  }

  private createCODForm() {
    return {
      enabled: true,
      fields: ['name', 'phone', 'email', 'address', 'city', 'state', 'pincode', 'quantity'],
      validationRules: {
        name: { required: true, minLength: 2 },
        phone: { required: true, pattern: /^[0-9]{10}$/ },
        email: { required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        address: { required: true, minLength: 10 },
        city: { required: true, minLength: 2 },
        state: { required: true, minLength: 2 },
        pincode: { required: true, pattern: /^[0-9]{6}$/ },
        quantity: { required: true, min: 1, max: 10 },
      },
    };
  }
}

// COD Order Processing Service
export const codOrderService = {
  async submitOrder(request: CODOrderRequest): Promise<{ orderId: string; success: boolean; message: string }> {
    try {
      // Validate form data
      this.validateCODForm(request.formData);

      // Generate order ID
      const orderId = this.generateOrderId();

      // In a real implementation, you would:
      // 1. Save order to database
      // 2. Send confirmation SMS/email
      // 3. Notify fulfillment team
      // 4. Integrate with logistics partner

      // For now, we'll simulate the order processing
      await this.processOrder(orderId, request);

      return {
        orderId,
        success: true,
        message: 'Order placed successfully! You will receive a confirmation call within 2 hours.',
      };
    } catch (error) {
      return {
        orderId: '',
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process order',
      };
    }
  },

  validateCODForm(formData: CODFormData) {
    const errors: string[] = [];

    if (!formData.name || formData.name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone)) {
      errors.push('Phone number must be 10 digits');
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Invalid email format');
    }

    if (!formData.address || formData.address.length < 10) {
      errors.push('Address must be at least 10 characters long');
    }

    if (!formData.city || formData.city.length < 2) {
      errors.push('City is required');
    }

    if (!formData.state || formData.state.length < 2) {
      errors.push('State is required');
    }

    if (!formData.pincode || !/^[0-9]{6}$/.test(formData.pincode)) {
      errors.push('Pincode must be 6 digits');
    }

    if (!formData.quantity || formData.quantity < 1 || formData.quantity > 10) {
      errors.push('Quantity must be between 1 and 10');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  },

  generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `COD-${timestamp}-${random}`.toUpperCase();
  },

  async processOrder(orderId: string, request: CODOrderRequest): Promise<void> {
    // Simulate order processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log order for processing (in real implementation, save to database)
    console.log('Order processed:', {
      orderId,
      landingPageId: request.landingPageId,
      customer: request.formData,
      product: request.productInfo,
      timestamp: new Date().toISOString(),
    });

    // Here you would typically:
    // 1. Save to database
    // 2. Send confirmation SMS
    // 3. Email order details
    // 4. Notify fulfillment team
    // 5. Create logistics entry
  },
};

// Utility functions
export const landingPageUtils = {
  generateLandingPageId(): string {
    return `lp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  },

  calculateDiscount(originalPrice: number, currentPrice: number): number {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  },

  formatCountdownTime(endTime: Date): { days: number; hours: number; minutes: number; seconds: number } {
    const now = new Date().getTime();
    const end = endTime.getTime();
    const difference = end - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  },

  generateMetaTags(landingPageData: LandingPageData) {
    const { productInfo, content } = landingPageData;
    
    return {
      title: `${content.headline} - ${productInfo.name}`,
      description: content.subheadline,
      keywords: [
        productInfo.name,
        productInfo.category,
        productInfo.brand,
        'COD',
        'Cash on Delivery',
        'Buy Online',
      ].filter(Boolean).join(', '),
      ogImage: landingPageData.images[0]?.optimizedUrl || '',
      ogTitle: content.headline,
      ogDescription: content.subheadline,
    };
  },

  validateProductUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      const supportedDomains = [
        'amazon.com',
        'amazon.in',
        'flipkart.com',
        'myntra.com',
        'ajio.com',
        'nykaa.com',
        'shopify.com',
        'woocommerce.com',
      ];
      
      return supportedDomains.some(domain => 
        parsedUrl.hostname.includes(domain)
      );
    } catch {
      return false;
    }
  },
};