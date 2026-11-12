import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import PromptDetailPage from './pages/PromptDetailPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import GuidesPage from './pages/GuidesPage';
import GuideArticlePage from './pages/GuideArticlePage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Legacy URLs: 301 redirects are configured in vercel.json; these cover client-side navigation. */}
          <Route path="/prompts" element={<Navigate to="/" replace />} />
          <Route path="/discover" element={<Navigate to="/" replace />} />
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
