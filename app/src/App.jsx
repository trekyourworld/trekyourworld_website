import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import AutoScrollToTop from './components/ui/AutoScrollToTop';
import { AuthProvider } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserProtectedRoute from './components/auth/UserProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import AuthCallback from './components/auth/AuthCallback';
import { analyticsService } from './services/api/analytics';

// Lazy-loaded components for better performance
const HomePage = lazy(() => import('./components/home/HomePage'));
const TreksPage = lazy(() => import('./components/treks/TreksPage'));
const ContactPage = lazy(() => import('./components/contact/ContactPage'));
const GuidesPage = lazy(() => import('./components/guides/GuidesPage'));
const UserProfilePage = lazy(() => import('./components/profile/UserProfilePage'));

// Admin components
const Dashboard = lazy(() => import('./components/admin/dashboard/Dashboard'));
const ManageTreks = lazy(() => import('./components/admin/dashboard/ManageTreks'));
const ManageUsers = lazy(() => import('./components/admin/dashboard/ManageUsers'));
const Analytics = lazy(() => import('./components/admin/dashboard/Analytics'));
const Settings = lazy(() => import('./components/admin/dashboard/Settings'));

// Loading component for suspense fallback
const LoadingFallback = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

function App() {

    useEffect(() => {
        const userId = localStorage.getItem('user_id') || generateUserId();
        localStorage.setItem('user_id', userId);

        analyticsService.trackVisitor(userId).catch((err) => console.error(err))
    })

    const generateUserId = () => {
        return `user_${Math.random().toString(36).substr(2, 9)}`;
    }

    return (
        <AuthProvider>
            <Router>
                <AutoScrollToTop />
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={
                            <Suspense fallback={<LoadingFallback />}>
                                <HomePage />
                            </Suspense>
                        } />
                        <Route path="/treks" element={
                            <Suspense fallback={<LoadingFallback />}>
                                <TreksPage />
                            </Suspense>
                        } />
                        <Route path="/guides" element={
                            <Suspense fallback={<LoadingFallback />}>
                                <GuidesPage />
                            </Suspense>
                        } />
                        <Route path="/contact" element={
                            <Suspense fallback={<LoadingFallback />}>
                                <ContactPage />
                            </Suspense>
                        } />
                        {/* User Profile Route */}
                        <Route path="/profile" element={
                            <UserProtectedRoute>
                                <Suspense fallback={<LoadingFallback />}>
                                    <UserProfilePage />
                                </Suspense>
                            </UserProtectedRoute>
                        } />
                    </Route>

                    {/* Login route */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* OAuth callback route */}
                    <Route path="/auth/callback" element={<AuthCallback />} />

                    {/* Protected admin routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={
                            <Suspense fallback={<LoadingFallback />}>
                                <Dashboard />
                            </Suspense>
                        } />
                        <Route path="treks" element={
                            <Suspense fallback={<LoadingFallback />}>
                                <ManageTreks />
                            </Suspense>
                        } />
                        <Route path="users" element={
                            <Suspense fallback={<LoadingFallback />}>
                                <ManageUsers />
                            </Suspense>
                        } />
                        <Route path="analytics" element={
                            <Suspense fallback={<LoadingFallback />}>
                                <Analytics />
                            </Suspense>
                        } />
                        <Route path="settings" element={
                            <Suspense fallback={<LoadingFallback />}>
                                <Settings />
                            </Suspense>
                        } />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
