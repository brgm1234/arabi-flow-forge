import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Star,
  Truck,
  Shield,
  Clock,
  CheckCircle,
  Phone,
  MapPin,
  CreditCard,
} from 'lucide-react';

import { 
  LandingPageData, 
  CODFormData 
} from '@/types/landingPageGenerator';
import { 
  useCountdownTimer, 
  useCODOrder, 
  useFormValidation,
  useAnalytics 
} from '@/hooks/useLandingPageGenerator';
import { landingPageUtils } from '@/services/landingPageGenerator';

interface CODLandingPageProps {
  data: LandingPageData;
  landingPageId: string;
}

const CODLandingPage: React.FC<CODLandingPageProps> = ({ data, landingPageId }) => {
  const { productInfo, content, theme, images, countdown, codForm } = data;
  const { timeLeft, isExpired, formatTime } = useCountdownTimer(countdown.endTime);
  const { submitOrder, isSubmitting, orderResult } = useCODOrder();
  const { errors, validateForm, clearFieldError } = useFormValidation();
  const { trackPageView, trackCTAClick, trackFormStart, trackFormSubmit, trackOrderComplete } = useAnalytics(landingPageId);

  const [formData, setFormData] = useState<CODFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    quantity: 1,
    variant: '',
  });

  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  const handleCTAClick = () => {
    trackCTAClick();
    setShowOrderForm(true);
    trackFormStart();
  };

  const handleInputChange = (field: keyof CODFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const handleSubmitOrder = () => {
    const isValid = validateForm(formData, codForm.validationRules);
    
    if (!isValid) {
      return;
    }

    trackFormSubmit();
    
    submitOrder({
      landingPageId,
      formData,
      productInfo: {
        name: productInfo.name,
        price: productInfo.price,
        variant: formData.variant,
      },
    });
  };

  useEffect(() => {
    if (orderResult?.success && orderResult.orderId) {
      trackOrderComplete(orderResult.orderId, productInfo.price * formData.quantity);
    }
  }, [orderResult, productInfo.price, formData.quantity, trackOrderComplete]);

  const discount = landingPageUtils.calculateDiscount(
    productInfo.originalPrice || 0, 
    productInfo.price
  );

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: theme.colorPalette.background,
        fontFamily: theme.fonts.body 
      }}
    >
      {/* Header */}
      <div 
        className="text-center py-12 px-4"
        style={{ color: theme.colorPalette.text }}
      >
        <h1 
          className="text-4xl md:text-6xl font-bold mb-4"
          style={{ 
            color: theme.colorPalette.primary,
            fontFamily: theme.fonts.heading 
          }}
        >
          {content.headline}
        </h1>
        
        <p 
          className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto"
          style={{ color: theme.colorPalette.textLight }}
        >
          {content.subheadline}
        </p>

        {/* Countdown Timer */}
        {!isExpired && (
          <div className="mb-8">
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: theme.colorPalette.accent }}
            >
              {countdown.title}
            </h3>
            <div className="flex justify-center space-x-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <div 
                    className="text-3xl font-bold px-3 py-2 rounded"
                    style={{ 
                      backgroundColor: theme.colorPalette.accent,
                      color: 'white'
                    }}
                  >
                    {formatTime(value)}
                  </div>
                  <div className="text-sm mt-1 capitalize">{unit}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Product Images */}
          <div className="space-y-4">
            {images[0] && (
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                <img
                  src={images[0].optimizedUrl}
                  alt={productInfo.name}
                  className="w-full h-full object-contain bg-white"
                />
              </div>
            )}
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square rounded overflow-hidden">
                    <img
                      src={image.thumbnailUrl}
                      alt={`${productInfo.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h2 
                className="text-3xl font-bold mb-2"
                style={{ color: theme.colorPalette.text }}
              >
                {productInfo.name}
              </h2>
              
              {productInfo.brand && (
                <p 
                  className="text-lg mb-4"
                  style={{ color: theme.colorPalette.textLight }}
                >
                  by {productInfo.brand}
                </p>
              )}

              {/* Rating */}
              {productInfo.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(productInfo.rating!) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {productInfo.rating} ({productInfo.reviews} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span 
                  className="text-4xl font-bold"
                  style={{ color: theme.colorPalette.accent }}
                >
                  {landingPageUtils.formatPrice(productInfo.price)}
                </span>
                
                {productInfo.originalPrice && productInfo.originalPrice > productInfo.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {landingPageUtils.formatPrice(productInfo.originalPrice)}
                    </span>
                    <Badge 
                      variant="destructive"
                      className="text-sm"
                    >
                      {discount}% OFF
                    </Badge>
                  </>
                )}
              </div>
              
              <p 
                className="text-sm font-medium"
                style={{ color: theme.colorPalette.primary }}
              >
                {content.urgencyText}
              </p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Benefits:</h3>
              <ul className="space-y-2">
                {content.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Free Delivery</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium">Secure Payment</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <p className="text-sm font-medium">Quick Delivery</p>
              </div>
            </div>

            {/* CTA Button */}
            {!showOrderForm && (
              <Button
                size="lg"
                className="w-full text-lg py-6"
                style={{ 
                  backgroundColor: theme.colorPalette.accent,
                  color: 'white'
                }}
                onClick={handleCTAClick}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {content.ctaText}
              </Button>
            )}
          </div>
        </div>

        {/* Order Form */}
        {showOrderForm && (
          <div className="max-w-md mx-auto mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <Phone className="inline-block mr-2 h-5 w-5" />
                  Complete Your Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderResult?.success ? (
                  <div className="text-center space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    <h3 className="text-xl font-bold text-green-600">Order Placed!</h3>
                    <p className="text-sm text-muted-foreground">
                      Order ID: <span className="font-mono">{orderResult.orderId}</span>
                    </p>
                    <p>{orderResult.message}</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="10-digit mobile number"
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="address">Complete Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="House/Flat No, Street, Landmark"
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className={errors.state ? 'border-red-500' : ''}
                        />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          placeholder="6 digits"
                          className={errors.pincode ? 'border-red-500' : ''}
                        />
                        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Select
                        value={formData.quantity.toString()}
                        onValueChange={(value) => handleInputChange('quantity', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(10)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Price per item:</span>
                        <span>{landingPageUtils.formatPrice(productInfo.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span>{formData.quantity}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span style={{ color: theme.colorPalette.accent }}>
                          {landingPageUtils.formatPrice(productInfo.price * formData.quantity)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting}
                      className="w-full"
                      style={{ 
                        backgroundColor: theme.colorPalette.accent,
                        color: 'white'
                      }}
                    >
                      {isSubmitting ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Pay when the product is delivered to your doorstep
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Testimonials */}
        {content.testimonials.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">What Our Customers Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {content.testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm mb-3">"{testimonial.text}"</p>
                    <p className="text-sm font-medium">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {content.faq.length > 0 && (
          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {content.faq.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">{faq.question}</h4>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CODLandingPage;