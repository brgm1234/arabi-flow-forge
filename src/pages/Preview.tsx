import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Globe, Share, Star, Shield, Truck, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import CODForm from "@/components/CODForm";

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock landing page data
  const pageData = {
    title: "ساعة ذكية متقدمة - Apple Watch Series 9",
    originalPrice: "1,299 ريال",
    salePrice: "899 ريال",
    discount: "31%",
    description: "ساعة ذكية متطورة مع أحدث التقنيات لمراقبة الصحة واللياقة البدنية. تصميم أنيق ومقاوم للماء مع بطارية تدوم طوال اليوم.",
    features: [
      "شاشة عرض عالية الدقة",
      "مقاومة للماء حتى 50 متر",
      "مراقبة معدل ضربات القلب",
      "نظام GPS مدمج",
      "بطارية تدوم 18 ساعة"
    ],
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
    ]
  };

  const handlePublish = (platform: string) => {
    toast({
      title: "تم النشر بنجاح",
      description: `تم نشر الصفحة على ${platform}`,
    });
  };

  const handleDownload = () => {
    toast({
      title: "تم التحميل",
      description: "تم تحميل ملف HTML بنجاح",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للرئيسية
            </Button>
            <div>
              <h1 className="text-2xl font-bold">معاينة صفحة الهبوط</h1>
              <p className="text-muted-foreground">راجع الصفحة قبل النشر</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              تحميل HTML
            </Button>
            <Button variant="outline" onClick={() => handlePublish('WordPress')}>
              <Globe className="h-4 w-4 mr-2" />
              WordPress
            </Button>
            <Button onClick={() => handlePublish('Shopify')}>
              <Share className="h-4 w-4 mr-2" />
              Shopify
            </Button>
          </div>
        </div>

        {/* Preview Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Landing Page Preview */}
          <div className="lg:col-span-2">
            <Card className="shadow-saas-lg overflow-hidden">
              <div className="bg-gradient-to-b from-slate-50 to-white p-8 rtl font-arabic">
                {/* Header */}
                <div className="text-center mb-8">
                  <Badge className="mb-4 bg-red-500 text-white">
                    خصم حصري {pageData.discount}
                  </Badge>
                  <h1 className="text-3xl font-bold mb-4 text-gray-900">
                    {pageData.title}
                  </h1>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="text-3xl font-bold text-green-600">
                      {pageData.salePrice}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      {pageData.originalPrice}
                    </span>
                  </div>
                </div>

                {/* Product Images */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {pageData.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`صورة المنتج ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>

                {/* Product Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">وصف المنتج</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {pageData.description}
                  </p>
                  
                  <h3 className="text-xl font-bold mb-4">المميزات الرئيسية</h3>
                  <ul className="space-y-2">
                    {pageData.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">ضمان المنتج</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Truck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">شحن مجاني</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Phone className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">دعم 24/7</p>
                  </div>
                </div>

                {/* COD Form */}
                <CODForm />
              </div>
            </Card>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الصفحة</CardTitle>
                <CardDescription>تخصيص محتوى الصفحة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان المنتج</Label>
                  <Input id="title" defaultValue={pageData.title} />
                </div>
                <div>
                  <Label htmlFor="price">السعر</Label>
                  <Input id="price" defaultValue={pageData.salePrice} />
                </div>
                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea id="description" defaultValue={pageData.description} rows={4} />
                </div>
                <Button className="w-full">
                  تحديث المعاينة
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إحصائيات المعاينة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>المشاهدات</span>
                    <span className="font-bold">245</span>
                  </div>
                  <div className="flex justify-between">
                    <span>النقرات</span>
                    <span className="font-bold">32</span>
                  </div>
                  <div className="flex justify-between">
                    <span>معدل التحويل</span>
                    <span className="font-bold text-green-600">13.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Preview;