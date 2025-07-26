// Landing Page Generator Types

export interface ProductInfo {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand?: string;
  features: string[];
  specifications: Record<string, string>;
  rating?: number;
  reviews?: number;
}

export interface ProductClassification {
  category: 'electronics' | 'fashion' | 'home' | 'beauty' | 'sports' | 'books' | 'other';
  subcategory: string;
  targetAudience: 'men' | 'women' | 'unisex' | 'kids' | 'general';
  priceRange: 'budget' | 'mid-range' | 'premium' | 'luxury';
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textLight: string;
}

export interface FontPairing {
  heading: string;
  body: string;
  accent: string;
}

export interface DesignTheme {
  name: string;
  colorPalette: ColorPalette;
  fonts: FontPairing;
  style: 'modern' | 'classic' | 'minimalist' | 'bold' | 'elegant';
}

export interface GeneratedContent {
  headline: string;
  subheadline: string;
  description: string;
  benefits: string[];
  upsellCopy: string;
  urgencyText: string;
  ctaText: string;
  testimonials: Testimonial[];
  faq: FAQ[];
}

export interface Testimonial {
  name: string;
  rating: number;
  text: string;
  avatar?: string;
  verified: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ProcessedImage {
  original: string;
  backgroundRemoved: string;
  cloudinaryUrl: string;
  optimizedUrl: string;
  thumbnailUrl: string;
}

export interface CountdownTimer {
  endTime: Date;
  title: string;
  urgencyLevel: 'low' | 'medium' | 'high';
}

export interface CODFormData {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  quantity: number;
  variant?: string;
}

export interface LandingPageData {
  productInfo: ProductInfo;
  classification: ProductClassification;
  theme: DesignTheme;
  content: GeneratedContent;
  images: ProcessedImage[];
  countdown: CountdownTimer;
  codForm: {
    enabled: boolean;
    fields: string[];
    validationRules: Record<string, any>;
  };
}

export interface GenerationProgress {
  step: string;
  progress: number;
  message: string;
  completed: boolean;
  error?: string;
}

// API Response Types
export interface SerpApiResponse {
  search_metadata: {
    status: string;
    created_at: string;
  };
  search_parameters: {
    q: string;
    engine: string;
  };
  organic_results: Array<{
    title: string;
    link: string;
    snippet: string;
    price?: string;
    rating?: number;
  }>;
}

export interface RemoveBgResponse {
  data: {
    result_b64: string;
    foreground_type: string;
    foreground_top: number;
    foreground_left: number;
    foreground_width: number;
    foreground_height: number;
  };
}

export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
}

export interface BrowseAiResponse {
  result: {
    capturedLists: Record<string, any[]>;
    capturedTexts: Record<string, string>;
    inputParameters: Record<string, any>;
  };
  status: string;
  finishedAt: string;
}

export interface GroqChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Generation Request Types
export interface GenerateLandingPageRequest {
  productUrl: string;
  customizations?: {
    colorPreference?: string;
    stylePreference?: string;
    targetAudience?: string;
    urgencyLevel?: 'low' | 'medium' | 'high';
    includeCountdown?: boolean;
    countdownHours?: number;
  };
}

export interface CODOrderRequest {
  landingPageId: string;
  formData: CODFormData;
  productInfo: {
    name: string;
    price: number;
    variant?: string;
  };
}