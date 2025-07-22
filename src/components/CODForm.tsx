import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MapPin, User, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderData {
  fullName: string;
  phone: string;
  address: string;
  notes: string;
}

const CODForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<OrderData>({
    fullName: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof OrderData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "تم تأكيد الطلب بنجاح",
        description: "سيتم التواصل معك لتأكيد التفاصيل",
      });
      
      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        address: "",
        notes: ""
      });
    }, 2000);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg">
      <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          اطلب الآن - الدفع عند الاستلام
        </CardTitle>
        <p className="text-blue-100">اطلب منتجك بسهولة وادفع عند وصوله إليك</p>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2 text-gray-700 font-medium">
              <User className="h-4 w-4" />
              الاسم الكامل *
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="أدخل اسمك الكامل"
              className="h-12 text-lg border-2 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700 font-medium">
              <Phone className="h-4 w-4" />
              رقم الهاتف *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="05xxxxxxxx"
              className="h-12 text-lg border-2 focus:border-blue-500"
              dir="ltr"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-gray-700 font-medium">
              <MapPin className="h-4 w-4" />
              العنوان الكامل *
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="أدخل عنوانك الكامل مع تفاصيل الحي والمدينة"
              className="min-h-[100px] text-lg border-2 focus:border-blue-500 resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-700 font-medium">
              ملاحظات إضافية (اختياري)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="أي ملاحظات خاصة بالطلب"
              className="min-h-[80px] border-2 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-bold text-yellow-800 mb-2">شروط الدفع عند الاستلام:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• سيتم التواصل معك لتأكيد الطلب خلال 24 ساعة</li>
              <li>• الدفع نقداً عند استلام المنتج</li>
              <li>• فحص المنتج قبل الدفع متاح</li>
              <li>• رسوم الشحن: مجاني للطلبات أكثر من 500 ريال</li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                جاري إرسال الطلب...
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-3" />
                تأكيد الطلب - الدفع عند الاستلام
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CODForm;