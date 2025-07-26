import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Wand2,
  Globe,
  Palette,
  Type,
  Image,
  Clock,
  ShoppingCart,
  Copy,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';

import {
  useGenerateLandingPage,
  useLandingPageState,
  useCountdownTimer,
  useCODOrder,
  useFormValidation,
  useAnalytics,
} from '@/hooks/useLandingPageGenerator';
import { GenerateLandingPageRequest, CODFormData } from '@/types/landingPageGenerator';
import { landingPageUtils } from '@/services/landingPageGenerator';

const LandingPageGenerator = () => {
  const [productUrl, setProductUrl] = useState('');
  const [customizations, setCustomizations] = useState<GenerateLandingPageRequest['customizations']>({
    urgencyLevel: 'medium',
    includeCountdown: true,
    countdownHours: 24,
  });

  const { currentStep, goToStep, publishLandingPage, publishedUrl, reset } = useLandingPageState();
  const { generate, isGenerating, progress, landingPageData, error, reset: resetGeneration } = useGenerateLandingPage();

  const handleGenerate = () => {
    if (!productUrl.trim()) {
      return;
    }

    goToStep('generating');
    generate({
      productUrl: productUrl.trim(),
      customizations,
    });
  };

  const handleReset = () => {
    reset();
    resetGeneration();
    setProductUrl('');
  };

  const handlePublish = () => {
    if (landingPageData) {
      publishLandingPage(landingPageData);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <Wand2 className="inline-block mr-2 h-8 w-8 text-purple-600" />
          AI Landing Page Generator
        </h1>
        <p className="text-xl text-muted-foreground">
          Transform any product URL into a high-converting COD landing page in minutes
        </p>
      </div>

      {currentStep === 'url-input' && (
        <UrlInputStep
          productUrl={productUrl}
          setProductUrl={setProductUrl}
          customizations={customizations}
          setCustomizations={setCustomizations}
          onGenerate={handleGenerate}
        />
      )}

      {currentStep === 'generating' && (
        <GeneratingStep
          progress={progress}
          error={error}
          onReset={handleReset}
        />
      )}

      {currentStep === 'preview' && landingPageData && (
        <PreviewStep
          landingPageData={landingPageData}
          onPublish={handlePublish}
          onReset={handleReset}
        />
      )}

      {currentStep === 'published' && publishedUrl && (
        <PublishedStep
          publishedUrl={publishedUrl}
          onReset={handleReset}
          copyToClipboard={copyToClipboard}
        />
      )}

      {landingPageData && progress?.completed && currentStep === 'generating' && (
        <div className="mt-6 text-center">
          <Button onClick={() => goToStep('preview')} size="lg">
            Preview Landing Page
          </Button>
        </div>
      )}
    </div>
  );
};

// URL Input Step Component
const UrlInputStep: React.FC<{
  productUrl: string;
  setProductUrl: (url: string) => void;
  customizations: any;
  setCustomizations: (customizations: any) => void;
  onGenerate: () => void;
}> = ({ productUrl, setProductUrl, customizations, setCustomizations, onGenerate }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            Enter Product URL
          </CardTitle>
          <CardDescription>
            Paste a product URL from Amazon, Flipkart, Myntra, or other supported platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="product-url">Product URL</Label>
            <Input
              id="product-url"
              type="url"
              placeholder="https://www.amazon.in/product-name/dp/..."
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="urgency-level">Urgency Level</Label>
              <Select
                value={customizations?.urgencyLevel}
                onValueChange={(value) => setCustomizations({ ...customizations, urgencyLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Gentle persuasion</SelectItem>
                  <SelectItem value="medium">Medium - Balanced urgency</SelectItem>
                  <SelectItem value="high">High - Maximum urgency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="countdown-hours">Countdown Duration (hours)</Label>
              <Input
                id="countdown-hours"
                type="number"
                min="1"
                max="168"
                value={customizations?.countdownHours || 24}
                onChange={(e) => setCustomizations({ 
                  ...customizations, 
                  countdownHours: parseInt(e.target.value) || 24 
                })}
              />
            </div>
          </div>

          <Button 
            onClick={onGenerate} 
            size="lg" 
            className="w-full"
            disabled={!productUrl.trim()}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Landing Page
          </Button>

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Supported platforms:</p>
            <div className="flex flex-wrap gap-2">
              {['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Nykaa', 'Shopify stores'].map(platform => (
                <Badge key={platform} variant="outline">{platform}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Generating Step Component
const GeneratingStep: React.FC<{
  progress: any;
  error: any;
  onReset: () => void;
}> = ({ progress, error, onReset }) => {
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={onReset} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating Your Landing Page
          </CardTitle>
          <CardDescription>
            Our AI is working hard to create your perfect landing page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {progress && (
            <>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{progress.message}</span>
                  <span>{progress.progress}%</span>
                </div>
                <Progress value={progress.progress} className="h-2" />
              </div>

              <div className="space-y-2">
                <GenerationStep 
                  icon={<Globe className="h-4 w-4" />}
                  title="Extracting product information"
                  completed={progress.progress > 10}
                  active={progress.step === 'extracting'}
                />
                <GenerationStep 
                  icon={<Palette className="h-4 w-4" />}
                  title="Analyzing and classifying product"
                  completed={progress.progress > 25}
                  active={progress.step === 'classifying'}
                />
                <GenerationStep 
                  icon={<Type className="h-4 w-4" />}
                  title="Generating design theme"
                  completed={progress.progress > 40}
                  active={progress.step === 'designing'}
                />
                <GenerationStep 
                  icon={<Wand2 className="h-4 w-4" />}
                  title="Creating persuasive content"
                  completed={progress.progress > 55}
                  active={progress.step === 'content'}
                />
                <GenerationStep 
                  icon={<Image className="h-4 w-4" />}
                  title="Processing product images"
                  completed={progress.progress > 70}
                  active={progress.step === 'images'}
                />
                <GenerationStep 
                  icon={<Clock className="h-4 w-4" />}
                  title="Setting up countdown timer"
                  completed={progress.progress > 85}
                  active={progress.step === 'countdown'}
                />
                <GenerationStep 
                  icon={<ShoppingCart className="h-4 w-4" />}
                  title="Configuring COD form"
                  completed={progress.progress > 95}
                  active={progress.step === 'form'}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Generation Step Component
const GenerationStep: React.FC<{
  icon: React.ReactNode;
  title: string;
  completed: boolean;
  active: boolean;
}> = ({ icon, title, completed, active }) => {
  return (
    <div className={`flex items-center space-x-3 p-2 rounded ${
      active ? 'bg-blue-50 text-blue-700' : completed ? 'text-green-600' : 'text-muted-foreground'
    }`}>
      <div className={`p-1 rounded ${
        completed ? 'bg-green-100' : active ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        {completed ? <CheckCircle className="h-4 w-4" /> : icon}
      </div>
      <span className="text-sm font-medium">{title}</span>
      {active && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
    </div>
  );
};

// Preview Step Component
const PreviewStep: React.FC<{
  landingPageData: any;
  onPublish: () => void;
  onReset: () => void;
}> = ({ landingPageData, onPublish, onReset }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Landing Page Preview</h2>
        <p className="text-muted-foreground">Review your generated landing page before publishing</p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <LandingPagePreview data={landingPageData} />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <ContentPreview data={landingPageData} />
        </TabsContent>

        <TabsContent value="design" className="space-y-4">
          <DesignPreview data={landingPageData} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-center space-x-4">
        <Button onClick={onReset} variant="outline">
          Generate New
        </Button>
        <Button onClick={onPublish} size="lg">
          Publish Landing Page
        </Button>
      </div>
    </div>
  );
};

// Landing Page Preview Component
const LandingPagePreview: React.FC<{ data: any }> = ({ data }) => {
  const { productInfo, content, theme, images } = data;

  return (
    <Card className="overflow-hidden">
      <div 
        className="p-8 text-center"
        style={{ 
          backgroundColor: theme.colorPalette.background,
          color: theme.colorPalette.text 
        }}
      >
        <h1 
          className="text-4xl font-bold mb-4"
          style={{ 
            color: theme.colorPalette.primary,
            fontFamily: theme.fonts.heading 
          }}
        >
          {content.headline}
        </h1>
        
        <p 
          className="text-xl mb-6"
          style={{ color: theme.colorPalette.textLight }}
        >
          {content.subheadline}
        </p>

        {images[0] && (
          <div className="mb-6">
            <img
              src={images[0].optimizedUrl}
              alt={productInfo.name}
              className="mx-auto max-w-md h-64 object-contain rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="mb-6">
          <div className="text-3xl font-bold" style={{ color: theme.colorPalette.accent }}>
            {landingPageUtils.formatPrice(productInfo.price)}
          </div>
          {productInfo.originalPrice && productInfo.originalPrice > productInfo.price && (
            <div className="text-lg text-gray-500 line-through">
              {landingPageUtils.formatPrice(productInfo.originalPrice)}
            </div>
          )}
        </div>

        <Button 
          size="lg" 
          className="mb-4"
          style={{ 
            backgroundColor: theme.colorPalette.accent,
            color: 'white'
          }}
        >
          {content.ctaText}
        </Button>

        <p className="text-sm font-medium" style={{ color: theme.colorPalette.primary }}>
          {content.urgencyText}
        </p>
      </div>
    </Card>
  );
};

// Content Preview Component
const ContentPreview: React.FC<{ data: any }> = ({ data }) => {
  const { content } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generated Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-medium">Headline</Label>
            <p className="text-lg font-bold">{content.headline}</p>
          </div>
          
          <div>
            <Label className="font-medium">Subheadline</Label>
            <p>{content.subheadline}</p>
          </div>
          
          <div>
            <Label className="font-medium">Description</Label>
            <p className="text-sm text-muted-foreground">{content.description}</p>
          </div>
          
          <div>
            <Label className="font-medium">Key Benefits</Label>
            <ul className="list-disc list-inside space-y-1">
              {content.benefits.map((benefit: string, index: number) => (
                <li key={index} className="text-sm">{benefit}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Design Preview Component
const DesignPreview: React.FC<{ data: any }> = ({ data }) => {
  const { theme } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Design Theme: {theme.name}</CardTitle>
          <CardDescription>Style: {theme.style}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-medium">Color Palette</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {Object.entries(theme.colorPalette).map(([name, color]) => (
                <div key={name} className="text-center">
                  <div 
                    className="w-full h-12 rounded border mb-2"
                    style={{ backgroundColor: color as string }}
                  />
                  <p className="text-xs font-medium capitalize">{name}</p>
                  <p className="text-xs text-muted-foreground">{color as string}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="font-medium">Typography</Label>
            <div className="space-y-2 mt-2">
              <div>
                <span className="text-sm text-muted-foreground">Heading: </span>
                <span style={{ fontFamily: theme.fonts.heading }}>{theme.fonts.heading}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Body: </span>
                <span style={{ fontFamily: theme.fonts.body }}>{theme.fonts.body}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Published Step Component
const PublishedStep: React.FC<{
  publishedUrl: string;
  onReset: () => void;
  copyToClipboard: (text: string) => void;
}> = ({ publishedUrl, onReset, copyToClipboard }) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <CheckCircle className="mr-2 h-6 w-6 text-green-600" />
            Landing Page Published!
          </CardTitle>
          <CardDescription>
            Your landing page is now live and ready to convert visitors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <Label className="text-sm font-medium">Landing Page URL</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input value={publishedUrl} readOnly className="flex-1" />
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(publishedUrl)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(publishedUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={onReset} variant="outline" className="w-full">
              Create Another
            </Button>
            <Button 
              onClick={() => window.open(publishedUrl, '_blank')}
              className="w-full"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Live Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPageGenerator;