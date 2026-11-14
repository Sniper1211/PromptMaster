import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage';
import LocaleNormalizer from './components/common/LocaleNormalizer';

// Route-level code splitting: only the home page ships in the initial bundle.
const PromptDetailPage = lazy(() => import('./pages/PromptDetailPage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const GuidesPage = lazy(() => import('./pages/GuidesPage'));
const GuideArticlePage = lazy(() => import('./pages/GuideArticlePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const RouteFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-white font-sans" aria-busy="true">
    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" aria-label="Loading" />
  </div>
);

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <LocaleNormalizer />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* English (default, no prefix) */}
            <Route path="/" element={<HomePage />} />
            <Route path="/collections/:slug" element={<CollectionPage />} />
            <Route path="/prompt/:id" element={<PromptDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/guides/:slug" element={<GuideArticlePage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/add" element={<AdminPage />} />
            <Route path="/admin/edit/:id" element={<AdminPage />} />

            {/* Chinese (/zh prefix) */}
            <Route path="/zh" element={<HomePage />} />
            <Route path="/zh/collections/:slug" element={<CollectionPage />} />
            <Route path="/zh/prompt/:id" element={<PromptDetailPage />} />
            <Route path="/zh/about" element={<AboutPage />} />
            <Route path="/zh/contact" element={<ContactPage />} />
            <Route path="/zh/guides" element={<GuidesPage />} />
            <Route path="/zh/guides/:slug" element={<GuideArticlePage />} />
            <Route path="/zh/privacy" element={<PrivacyPolicy />} />
            <Route path="/zh/terms" element={<TermsOfService />} />
            <Route path="/zh/admin" element={<AdminPage />} />
            <Route path="/zh/admin/add" element={<AdminPage />} />
            <Route path="/zh/admin/edit/:id" element={<AdminPage />} />

            {/* Legacy URLs: 308 redirects are configured in vercel.json; these cover client-side navigation. */}
            <Route path="/prompts" element={<Navigate to="/" replace />} />
            <Route path="/discover" element={<Navigate to="/" replace />} />
            <Route path="/zh/prompts" element={<Navigate to="/zh" replace />} />
            <Route path="/zh/discover" element={<Navigate to="/zh" replace />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
