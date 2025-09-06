import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import SecurityHeaders from "@/components/SecurityHeaders";
import Index from "./pages/Index";
import AdminSetup from "./pages/AdminSetup";

import ClientLogin from "./pages/ClientLogin";
import SecureAuth from "./pages/SecureAuth";
import EmailVerification from "./pages/EmailVerification";
import PropertyRequest from "./pages/PropertyRequest";
import PropertyEdit from "./pages/dashboard/PropertyEdit";

import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";
import RequestsManagement from "./pages/dashboard/RequestsManagement";
import ClientsManagement from "./pages/dashboard/ClientsManagement";
import ReportsManagement from "./pages/dashboard/ReportsManagement";
import PropertiesManagement from "./pages/dashboard/PropertiesManagement";
import Analytics from "./pages/dashboard/Analytics";
import PropertyMap from "./pages/dashboard/PropertyMap";
import Appointments from "./pages/dashboard/Appointments";
import Messages from "./pages/dashboard/Messages";
import CallsManagement from "./pages/dashboard/CallsManagement";
import Notifications from "./pages/dashboard/Notifications";
import RolesManagement from "./pages/dashboard/RolesManagement";
import FileManagement from "./pages/dashboard/FileManagement";
import UsersManagement from "./pages/dashboard/UsersManagement";
import CRMDashboard from "./pages/dashboard/CRMDashboard";
import NotificationsManagement from "./pages/dashboard/NotificationsManagement";
import MarketAnalysis from "./pages/dashboard/MarketAnalysis";
import DatabaseManagement from "./pages/dashboard/DatabaseManagement";
import SecurityManagement from "./pages/dashboard/SecurityManagement";
import Settings from "./pages/dashboard/Settings";
import Help from "./pages/dashboard/Help";
import ProtectedComponent from "./components/ProtectedComponent";
import EnhancedProtectedRoute from "./components/EnhancedProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <SecurityHeaders />
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          <Route path="/auth/verify" element={<EmailVerification />} />
          <Route path="/client-portal" element={<ClientLogin />} />
          <Route path="/secure-auth" element={<SecureAuth />} />
          <Route path="/dashboard/properties/edit/:id" element={<PropertyEdit />} />
          <Route path="/property-request" element={<PropertyRequest />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <EnhancedProtectedRoute 
              requireAuth={true}
              allowedRoles={['admin', 'super_admin', 'manager', 'employee', 'agent']}
              fallbackMessage="تحتاج إلى صلاحيات موظف للوصول إلى لوحة التحكم"
            >
              <DashboardLayout />
            </EnhancedProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="requests" element={<RequestsManagement />} />
            <Route path="clients" element={<ClientsManagement />} />
            <Route path="properties" element={<PropertiesManagement />} />
            <Route path="reports" element={<ReportsManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="map" element={<PropertyMap />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="messages" element={<Messages />} />
            <Route path="calls" element={<CallsManagement />} />
            <Route path="roles" element={
              <ProtectedComponent requiredPermissions={['users:read', 'users:roles']}>
                <RolesManagement />
              </ProtectedComponent>
            } />
            <Route path="files" element={<FileManagement />} />
            <Route path="users" element={
              <ProtectedComponent requiredPermissions={['users:read']}>
                <UsersManagement />
              </ProtectedComponent>
            } />
            <Route path="crm" element={
              <ProtectedComponent requiredPermissions={['users:read']}>
                <CRMDashboard />
              </ProtectedComponent>
            } />
            <Route path="market-analysis" element={<MarketAnalysis />} />
            <Route path="database" element={<DatabaseManagement />} />
            <Route path="security" element={<SecurityManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
            <Route path="notifications" element={<NotificationsManagement />} />
          </Route>
          
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
  </QueryClientProvider>
);

export default App;
