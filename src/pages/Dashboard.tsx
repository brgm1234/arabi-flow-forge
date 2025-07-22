import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Zap, TrendingUp, ArrowRight, Link, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

interface GeneratedPage {
  id: string;
  url: string;
  title: string;
  status: 'generating' | 'completed' | 'published';
  createdAt: string;
  orders: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentPages] = useState<GeneratedPage[]>([
    {
      id: '1',
      url: 'https://example.com/product-1',
      title: 'ساعة ذكية متقدمة',
      status: 'completed',
      createdAt: '2024-01-15',
      orders: 12
    },
    {
      id: '2', 
      url: 'https://example.com/product-2',
      title: 'سماعات لاسلكية عالية الجودة',
      status: 'published',
      createdAt: '2024-01-14',
      orders: 28
    },
    {
      id: '3',
      url: 'https://example.com/product-3', 
      title: 'جهاز لوحي للأعمال',
      status: 'generating',
      createdAt: '2024-01-13',
      orders: 0
    }
  ]);

  const handleGenerate = async () => {
    if (!url.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رابط المنتج",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "تم إنشاء الصفحة بنجاح",
        description: "تم إنشاء صفحة الهبوط باللغة العربية",
      });
      navigate('/preview', { state: { url } });
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'published':
        return <Globe className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generating':
        return 'bg-warning';
      case 'completed':
        return 'bg-success';
      case 'published':
        return 'bg-primary';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            مولد صفحات الهبوط العربية بالذكاء الاصطناعي
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            أدخل رابط منتجك واحصل على صفحة هبوط احترافية باللغة العربية مع نظام الدفع عند الاستلام
          </p>
        </div>

        {/* Main Generator */}
        <Card className="max-w-2xl mx-auto mb-12 shadow-saas-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              إنشاء صفحة جديدة
            </CardTitle>
            <CardDescription>
              الصق رابط المنتج أدناه لإنشاء صفحة هبوط بالذكاء الاصطناعي
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/product"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                dir="ltr"
              />
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 gradient-saas hover:opacity-90"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    إنشاء الصفحة
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-saas">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الصفحات</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <Globe className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-saas">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-saas">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">معدل التحويل</p>
                  <p className="text-2xl font-bold">12.5%</p>
                </div>
                <Zap className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Pages */}
        <Card className="shadow-saas">
          <CardHeader>
            <CardTitle>الصفحات الأخيرة</CardTitle>
            <CardDescription>قائمة بآخر الصفحات التي تم إنشاؤها</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStatusColor(page.status)} text-white`}>
                      {getStatusIcon(page.status)}
                    </div>
                    <div>
                      <h3 className="font-medium">{page.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Link className="h-3 w-3" />
                        {page.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium">{page.orders}</p>
                      <p className="text-xs text-muted-foreground">طلبات</p>
                    </div>
                    <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                      {page.status === 'generating' ? 'جاري الإنشاء' : 
                       page.status === 'completed' ? 'مكتمل' : 'منشور'}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/preview')}>
                      عرض
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;