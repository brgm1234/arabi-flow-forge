import { useState, useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  LandingPageData,
  GenerateLandingPageRequest,
  GenerationProgress,
  CODFormData,
  CODOrderRequest,
} from '@/types/landingPageGenerator';
import { LandingPageGenerator, codOrderService, landingPageUtils } from '@/services/landingPageGenerator';

// Hook for generating landing pages
export const useGenerateLandingPage = () => {
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [landingPageData, setLandingPageData] = useState<LandingPageData | null>(null);
  const generatorRef = useRef<LandingPageGenerator | null>(null);

  const generateMutation = useMutation({
    mutationFn: async (request: GenerateLandingPageRequest) => {
      // Validate URL first
      if (!landingPageUtils.validateProductUrl(request.productUrl)) {
        throw new Error('Unsupported product URL. Please use URLs from Amazon, Flipkart, Myntra, or other supported platforms.');
      }

      // Create generator with progress callback
      generatorRef.current = new LandingPageGenerator((progress) => {
        setProgress(progress);
      });

      const result = await generatorRef.current.generateLandingPage(request);
      setLandingPageData(result);
      return result;
    },
    onSuccess: (data) => {
      toast.success('Landing page generated successfully!');
      setProgress(null);
    },
    onError: (error: Error) => {
      toast.error(`Generation failed: ${error.message}`);
      setProgress({
        step: 'error',
        progress: 0,
        message: error.message,
        completed: false,
        error: error.message,
      });
    },
  });

  const reset = useCallback(() => {
    setProgress(null);
    setLandingPageData(null);
    generateMutation.reset();
  }, [generateMutation]);

  return {
    generate: generateMutation.mutate,
    isGenerating: generateMutation.isPending,
    progress,
    landingPageData,
    error: generateMutation.error,
    reset,
  };
};

// Hook for COD order processing
export const useCODOrder = () => {
  const [orderResult, setOrderResult] = useState<{ orderId: string; success: boolean; message: string } | null>(null);

  const submitOrderMutation = useMutation({
    mutationFn: async (request: CODOrderRequest) => {
      return await codOrderService.submitOrder(request);
    },
    onSuccess: (result) => {
      setOrderResult(result);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error: Error) => {
      const errorResult = {
        orderId: '',
        success: false,
        message: error.message,
      };
      setOrderResult(errorResult);
      toast.error(`Order failed: ${error.message}`);
    },
  });

  const resetOrder = useCallback(() => {
    setOrderResult(null);
    submitOrderMutation.reset();
  }, [submitOrderMutation]);

  return {
    submitOrder: submitOrderMutation.mutate,
    isSubmitting: submitOrderMutation.isPending,
    orderResult,
    resetOrder,
  };
};

// Hook for countdown timer
export const useCountdownTimer = (endTime: Date) => {
  const [timeLeft, setTimeLeft] = useState(() => landingPageUtils.formatCountdownTime(endTime));
  const [isExpired, setIsExpired] = useState(false);

  const updateTimer = useCallback(() => {
    const newTimeLeft = landingPageUtils.formatCountdownTime(endTime);
    setTimeLeft(newTimeLeft);
    
    const expired = newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
                   newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0;
    setIsExpired(expired);
    
    return !expired;
  }, [endTime]);

  // Start timer on mount
  useState(() => {
    const interval = setInterval(() => {
      const shouldContinue = updateTimer();
      if (!shouldContinue) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  return {
    timeLeft,
    isExpired,
    formatTime: (time: number) => time.toString().padStart(2, '0'),
  };
};

// Hook for form validation
export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((name: string, value: any, rules: any) => {
    const fieldErrors: string[] = [];

    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      fieldErrors.push(`${name} is required`);
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      fieldErrors.push(`${name} must be at least ${rules.minLength} characters`);
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      fieldErrors.push(`${name} must be less than ${rules.maxLength} characters`);
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      fieldErrors.push(`${name} format is invalid`);
    }

    if (value && rules.min && value < rules.min) {
      fieldErrors.push(`${name} must be at least ${rules.min}`);
    }

    if (value && rules.max && value > rules.max) {
      fieldErrors.push(`${name} must be no more than ${rules.max}`);
    }

    return fieldErrors;
  }, []);

  const validateForm = useCallback((formData: Record<string, any>, validationRules: Record<string, any>) => {
    const newErrors: Record<string, string> = {};

    Object.keys(validationRules).forEach(fieldName => {
      const fieldValue = formData[fieldName];
      const rules = validationRules[fieldName];
      const fieldErrors = validateField(fieldName, fieldValue, rules);
      
      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors[0]; // Show first error
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateForm,
    validateField,
    clearErrors,
    clearFieldError,
    hasErrors: Object.keys(errors).length > 0,
  };
};

// Hook for managing landing page state
export const useLandingPageState = () => {
  const [currentStep, setCurrentStep] = useState<'url-input' | 'generating' | 'preview' | 'published'>('url-input');
  const [landingPageId, setLandingPageId] = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const goToStep = useCallback((step: typeof currentStep) => {
    setCurrentStep(step);
  }, []);

  const generateLandingPageId = useCallback(() => {
    const id = landingPageUtils.generateLandingPageId();
    setLandingPageId(id);
    return id;
  }, []);

  const publishLandingPage = useCallback((data: LandingPageData) => {
    const id = landingPageId || generateLandingPageId();
    const url = `${window.location.origin}/landing/${id}`;
    setPublishedUrl(url);
    setCurrentStep('published');
    
    // In a real implementation, you would save the landing page data to a database
    // and make it accessible at the generated URL
    localStorage.setItem(`landing_page_${id}`, JSON.stringify(data));
    
    return url;
  }, [landingPageId, generateLandingPageId]);

  const reset = useCallback(() => {
    setCurrentStep('url-input');
    setLandingPageId(null);
    setPublishedUrl(null);
  }, []);

  return {
    currentStep,
    landingPageId,
    publishedUrl,
    goToStep,
    generateLandingPageId,
    publishLandingPage,
    reset,
  };
};

// Hook for analytics tracking
export const useAnalytics = (landingPageId: string) => {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    // In a real implementation, you would send this to your analytics service
    console.log('Analytics Event:', {
      landingPageId,
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
    });

    // Example: Send to Google Analytics, Mixpanel, etc.
    // gtag('event', eventName, properties);
  }, [landingPageId]);

  const trackPageView = useCallback(() => {
    trackEvent('page_view');
  }, [trackEvent]);

  const trackCTAClick = useCallback(() => {
    trackEvent('cta_click');
  }, [trackEvent]);

  const trackFormStart = useCallback(() => {
    trackEvent('form_start');
  }, [trackEvent]);

  const trackFormSubmit = useCallback(() => {
    trackEvent('form_submit');
  }, [trackEvent]);

  const trackOrderComplete = useCallback((orderId: string, orderValue: number) => {
    trackEvent('order_complete', { orderId, orderValue });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackCTAClick,
    trackFormStart,
    trackFormSubmit,
    trackOrderComplete,
  };
};