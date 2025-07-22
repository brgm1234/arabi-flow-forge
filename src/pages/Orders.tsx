import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search, Eye, Phone, MapPin, Calendar, Package, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

interface Order {
  id: string;
  customerName: string;
  phone: string;
  product: string;
  address: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  amount: string;
  date: string;
  source: string;
}

const Orders = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'أحمد محمد العلي',
      phone: '0551234567',
      product: 'ساعة ذكية متقدمة',
      address: 'الرياض، حي النخيل، شارع الملك فهد',
      status: 'pending',
      amount: '899 ريال',
      date: '2024-01-15',
      source: 'صفحة الهبوط 1'
    },
    {
      id: 'ORD-002', 
      customerName: 'فاطمة أحمد السالم',
      phone: '0559876543',
      product: 'سماعات لاسلكية عالية الجودة',
      address: 'جدة، حي الزهراء، طريق الملك عبدالعزيز',
      status: 'confirmed',
      amount: '299 ريال',
      date: '2024-01-14',
      source: 'صفحة الهبوط 2'
    },
    {
      id: 'ORD-003',
      customerName: 'محمد عبدالله الحربي',
      phone: '0554567890',
      product: 'جهاز لوحي للأعمال',
      address: 'الدمام، حي الشاطئ، شارع الخليج العربي',
      status: 'shipped',
      amount: '1,299 ريال',
      date: '2024-01-13',
      source: 'صفحة الهبوط 3'
    },
    {
      id: 'ORD-004',
      customerName: 'نورا سالم القحطاني',
      phone: '0556789012',
      product: 'ساعة ذكية متقدمة',
      address: 'مكة المكرمة، حي العزيزية، طريق الحرم',
      status: 'delivered',
      amount: '899 ريال',
      date: '2024-01-12',
      source: 'صفحة الهبوط 1'
    },
    {
      id: 'ORD-005',
      customerName: 'خالد إبراهيم الناصر',
      phone: '0553456789',
      product: 'سماعات لاسلكية عالية الجودة',
      address: 'المدينة المنورة، حي الحرة الشرقية، شارع النبوي',
      status: 'cancelled',
      amount: '299 ريال',
      date: '2024-01-11',
      source: 'صفحة الهبوط 2'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'confirmed':
        return 'مؤكد';
      case 'shipped':
        return 'قيد الشحن';
      case 'delivered':
        return 'تم التسليم';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone.includes(searchTerm) ||
    order.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportExcel = () => {
    toast({
      title: "تم التصدير بنجاح",
      description: "تم تصدير الطلبات إلى ملف Excel",
    });
  };

  const handleViewOrder = (orderId: string) => {
    toast({
      title: "عرض الطلب",
      description: `عرض تفاصيل الطلب ${orderId}`,
    });
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة الطلبات</h1>
            <p className="text-muted-foreground">مراقبة وإدارة جميع طلبات الدفع عند الاستلام</p>
          </div>
          <Button onClick={handleExportExcel} className="gap-2">
            <Download className="h-4 w-4" />
            تصدير إلى Excel
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-saas">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold">{orderStats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-saas">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">في الانتظار</p>
                  <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-saas">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">مؤكدة</p>
                  <p className="text-2xl font-bold text-blue-600">{orderStats.confirmed}</p>
                </div>
                <Phone className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-saas">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">تم التسليم</p>
                  <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="shadow-saas-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>قائمة الطلبات</CardTitle>
                <CardDescription>جميع طلبات الدفع عند الاستلام</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث في الطلبات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>اسم العميل</TableHead>
                    <TableHead>رقم الهاتف</TableHead>
                    <TableHead>المنتج</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            المصدر: {order.source}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.phone}
                        </div>
                      </TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        {order.amount}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(order.status)}
                        >
                          {getStatusText(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {order.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(order.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">لا توجد طلبات تطابق البحث</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Orders;