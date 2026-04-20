import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute, StaffRoute, DoctorRoute } from "@/components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Unauthorized } from "./pages/Unauthorized";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AppShell } from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import Visits from "./pages/Visits";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/unauthorized" element={<Unauthorized />} />

    {/* Protected routes */}
    <Route
      path="/dashboard"
      element={
        <StaffRoute>
          <Dashboard />
        </StaffRoute>
      }
    />

    <Route
      path="/app"
      element={
        <StaffRoute>
          <AppShell />
        </StaffRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="patients" element={<Patients />} />
      <Route path="patients/:id" element={<PatientDetail />} />
      <Route path="visits" element={<Visits />} />
      <Route
        path="settings"
        element={
          <DoctorRoute>
            <Settings />
          </DoctorRoute>
        }
      />
    </Route>

    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
