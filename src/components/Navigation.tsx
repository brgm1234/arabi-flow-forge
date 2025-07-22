import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Eye, ShoppingCart, User } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="bg-card border-b shadow-saas">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-saas rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg">ArabiFlow</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <NavLink to="/">
              {({ isActive }) => (
                <Button variant={isActive ? "default" : "ghost"} size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  الرئيسية
                </Button>
              )}
            </NavLink>
            
            <NavLink to="/preview">
              {({ isActive }) => (
                <Button variant={isActive ? "default" : "ghost"} size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  معاينة
                </Button>
              )}
            </NavLink>
            
            <NavLink to="/orders">
              {({ isActive }) => (
                <Button variant={isActive ? "default" : "ghost"} size="sm" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  الطلبات
                </Button>
              )}
            </NavLink>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;