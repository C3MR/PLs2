import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md text-center" dir="rtl">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">٤٠٤ - الصفحة غير موجودة</CardTitle>
            <CardDescription>
              عذراً، الصفحة التي تبحث عنها غير موجودة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/">
                <Home className="h-4 w-4 ml-2" />
                العودة للصفحة الرئيسية
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotFound;
