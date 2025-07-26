import {
  ProductInfo,
  ProductClassification,
  DesignTheme,
  GeneratedContent,
  ProcessedImage,
  SerpApiResponse,
  RemoveBgResponse,
  CloudinaryUploadResponse,
  BrowseAiResponse,
  GroqChatResponse,
} from '@/types/landingPageGenerator';

// API Configuration
const API_CONFIG = {
  SERPAPI_KEY: import.meta.env.VITE_SERPAPI_KEY,
  REMOVEBG_KEY: import.meta.env.VITE_REMOVEBG_KEY,
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  BROWSEAI_API_KEY: import.meta.env.VITE_BROWSEAI_API_KEY,
  GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY,
};

// ===== SERP API SERVICE =====
export const serpApiService = {
  async searchProduct(query: string): Promise<SerpApiResponse> {
    const response = await fetch(
      `https://serpapi.com/search?engine=google&q=${encodeURIComponent(query)}&api_key=${API_CONFIG.SERPAPI_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`SerpAPI error: ${response.statusText}`);
    }
    
    return response.json();
  },

  async extractProductInfo(url: string): Promise<ProductInfo> {
    try {
      // First, try to get product info from the URL
      const domain = new URL(url).hostname;
      const searchQuery = `site:${domain} product details`;
      
      const searchResults = await this.searchProduct(searchQuery);
      
      // Extract product information from search results
      const productData = searchResults.organic_results[0];
      
      return {
        name: productData?.title || 'Unknown Product',
        description: productData?.snippet || 'Product description not available',
        price: this.extractPrice(productData?.snippet || ''),
        images: [], // Will be populated by Browse AI
        category: 'other',
        features: [],
        specifications: {},
        rating: productData?.rating,
      };
    } catch (error) {
      console.error('SerpAPI extraction error:', error);
      throw new Error('Failed to extract product information');
    }
  },

  extractPrice(text: string): number {
    const priceMatch = text.match(/[\$₹€£]?[\d,]+\.?\d*/);
    if (priceMatch) {
      return parseFloat(priceMatch[0].replace(/[^\d.]/g, ''));
    }
    return 0;
  },
};

// ===== BROWSE AI SERVICE =====
export const browseAiService = {
  async scrapeProductPage(url: string): Promise<ProductInfo> {
    try {
      const [apiKey, robotId] = API_CONFIG.BROWSEAI_API_KEY.split(':');
      
      const response = await fetch('https://api.browse.ai/v2/robots/' + robotId + '/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputParameters: {
            originUrl: url,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Browse AI error: ${response.statusText}`);
      }

      const taskData = await response.json();
      
      // Poll for task completion
      const result = await this.pollTaskCompletion(taskData.result.id, apiKey, robotId);
      
      return this.parseProductData(result);
    } catch (error) {
      console.error('Browse AI scraping error:', error);
      // Fallback to SerpAPI if Browse AI fails
      return serpApiService.extractProductInfo(url);
    }
  },

  async pollTaskCompletion(taskId: string, apiKey: string, robotId: string): Promise<BrowseAiResponse> {
    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(`https://api.browse.ai/v2/robots/${robotId}/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      const data = await response.json();
      
      if (data.result.status === 'successful') {
        return data.result;
      }
      
      if (data.result.status === 'failed') {
        throw new Error('Browse AI task failed');
      }

      // Wait 2 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    throw new Error('Browse AI task timeout');
  },

  parseProductData(result: BrowseAiResponse): ProductInfo {
    const { capturedTexts, capturedLists } = result.result;
    
    return {
      name: capturedTexts.productName || 'Unknown Product',
      description: capturedTexts.description || 'No description available',
      price: this.parsePrice(capturedTexts.price || '0'),
      originalPrice: this.parsePrice(capturedTexts.originalPrice || ''),
      images: capturedLists.images || [],
      category: capturedTexts.category || 'other',
      brand: capturedTexts.brand,
      features: capturedLists.features || [],
      specifications: capturedTexts.specifications || {},
      rating: parseFloat(capturedTexts.rating || '0'),
      reviews: parseInt(capturedTexts.reviewCount || '0'),
    };
  },

  parsePrice(priceText: string): number {
    const cleanPrice = priceText.replace(/[^\d.]/g, '');
    return parseFloat(cleanPrice) || 0;
  },
};

// ===== GROQ AI SERVICE =====
export const groqService = {
  async classifyProduct(productInfo: ProductInfo): Promise<ProductClassification> {
    const prompt = `Classify this product based on the information provided:
    
    Product Name: ${productInfo.name}
    Description: ${productInfo.description}
    Category: ${productInfo.category}
    Price: $${productInfo.price}
    
    Please classify this product and return a JSON object with:
    - category: one of [electronics, fashion, home, beauty, sports, books, other]
    - subcategory: specific subcategory
    - targetAudience: one of [men, women, unisex, kids, general]
    - priceRange: one of [budget, mid-range, premium, luxury] based on price
    
    Return only valid JSON.`;

    const response = await this.chatCompletion(prompt);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback classification
      return {
        category: 'other',
        subcategory: 'general',
        targetAudience: 'general',
        priceRange: productInfo.price < 50 ? 'budget' : productInfo.price < 200 ? 'mid-range' : 'premium',
      };
    }
  },

  async generateDesignTheme(classification: ProductClassification): Promise<DesignTheme> {
    const prompt = `Generate a design theme for a landing page for a ${classification.category} product in the ${classification.subcategory} subcategory, targeting ${classification.targetAudience} audience in the ${classification.priceRange} price range.

    Return a JSON object with:
    - name: theme name
    - colorPalette: { primary, secondary, accent, background, text, textLight } (hex colors)
    - fonts: { heading, body, accent } (Google Fonts names)
    - style: one of [modern, classic, minimalist, bold, elegant]
    
    Make sure colors are appropriate for the product category and target audience.
    Return only valid JSON.`;

    const response = await this.chatCompletion(prompt);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback theme
      return {
        name: 'Default Theme',
        colorPalette: {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          accent: '#F59E0B',
          background: '#FFFFFF',
          text: '#1F2937',
          textLight: '#6B7280',
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter',
          accent: 'Inter',
        },
        style: 'modern',
      };
    }
  },

  async generateContent(productInfo: ProductInfo, classification: ProductClassification): Promise<GeneratedContent> {
    const prompt = `Generate persuasive landing page content for this product:
    
    Product: ${productInfo.name}
    Description: ${productInfo.description}
    Price: $${productInfo.price}
    Category: ${classification.category}
    Target Audience: ${classification.targetAudience}
    
    Generate a JSON object with:
    - headline: compelling main headline (max 60 chars)
    - subheadline: supporting headline (max 120 chars)
    - description: detailed product description (2-3 paragraphs)
    - benefits: array of 5-7 key benefits
    - upsellCopy: persuasive upsell text
    - urgencyText: create urgency (limited time, stock, etc.)
    - ctaText: call-to-action button text
    - testimonials: array of 3 realistic testimonials with name, rating (1-5), text, verified: true
    - faq: array of 5 relevant FAQ items with question and answer
    
    Make it compelling and conversion-focused. Return only valid JSON.`;

    const response = await this.chatCompletion(prompt);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback content
      return {
        headline: `Amazing ${productInfo.name}`,
        subheadline: 'Get yours today with fast delivery!',
        description: productInfo.description,
        benefits: ['High Quality', 'Fast Shipping', 'Great Value', 'Customer Support'],
        upsellCopy: 'Limited time offer - get yours now!',
        urgencyText: 'Only few left in stock!',
        ctaText: 'Order Now',
        testimonials: [
          { name: 'John D.', rating: 5, text: 'Great product!', verified: true },
          { name: 'Sarah M.', rating: 5, text: 'Highly recommend!', verified: true },
          { name: 'Mike R.', rating: 4, text: 'Good value for money.', verified: true },
        ],
        faq: [
          { question: 'How long is shipping?', answer: '3-5 business days.' },
          { question: 'What is your return policy?', answer: '30-day money back guarantee.' },
        ],
      };
    }
  },

  async chatCompletion(prompt: string): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data: GroqChatResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  },
};

// ===== REMOVE.BG SERVICE =====
export const removeBgService = {
  async removeBackground(imageUrl: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image_url', imageUrl);
      formData.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': API_CONFIG.REMOVEBG_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Remove.bg API error: ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Background removal error:', error);
      // Return original image if background removal fails
      return imageUrl;
    }
  },

  async removeBackgroundFromFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image_file', file);
      formData.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': API_CONFIG.REMOVEBG_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Remove.bg API error: ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Background removal error:', error);
      throw error;
    }
  },
};

// ===== CLOUDINARY SERVICE =====
export const cloudinaryService = {
  async uploadImage(imageBlob: Blob, filename: string): Promise<CloudinaryUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', imageBlob, filename);
      formData.append('upload_preset', 'landing_pages'); // You'll need to create this preset
      formData.append('cloud_name', API_CONFIG.CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${API_CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Cloudinary upload error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  },

  async uploadImageFromUrl(imageUrl: string, filename: string): Promise<CloudinaryUploadResponse> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return this.uploadImage(blob, filename);
    } catch (error) {
      console.error('Cloudinary URL upload error:', error);
      throw error;
    }
  },

  generateOptimizedUrl(publicId: string, transformations: string = 'c_fill,w_800,h_600,q_auto,f_auto'): string {
    return `https://res.cloudinary.com/${API_CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
  },

  generateThumbnailUrl(publicId: string): string {
    return this.generateOptimizedUrl(publicId, 'c_thumb,w_200,h_200,q_auto,f_auto');
  },
};

// ===== IMAGE PROCESSING SERVICE =====
export const imageProcessingService = {
  async processProductImages(images: string[]): Promise<ProcessedImage[]> {
    const processedImages: ProcessedImage[] = [];

    for (const imageUrl of images) {
      try {
        // Remove background
        const backgroundRemovedUrl = await removeBgService.removeBackground(imageUrl);
        
        // Convert to blob for Cloudinary upload
        const response = await fetch(backgroundRemovedUrl);
        const blob = await response.blob();
        
        // Upload to Cloudinary
        const uploadResult = await cloudinaryService.uploadImage(blob, `product_${Date.now()}.png`);
        
        // Generate optimized URLs
        const optimizedUrl = cloudinaryService.generateOptimizedUrl(uploadResult.public_id);
        const thumbnailUrl = cloudinaryService.generateThumbnailUrl(uploadResult.public_id);

        processedImages.push({
          original: imageUrl,
          backgroundRemoved: backgroundRemovedUrl,
          cloudinaryUrl: uploadResult.secure_url,
          optimizedUrl,
          thumbnailUrl,
        });
      } catch (error) {
        console.error(`Error processing image ${imageUrl}:`, error);
        // Add original image if processing fails
        processedImages.push({
          original: imageUrl,
          backgroundRemoved: imageUrl,
          cloudinaryUrl: imageUrl,
          optimizedUrl: imageUrl,
          thumbnailUrl: imageUrl,
        });
      }
    }

    return processedImages;
  },
};