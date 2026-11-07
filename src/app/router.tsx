import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { RequireAuth } from '../components/auth/RequireAuth';
import { HomePage } from '../pages/HomePage';
import { AirCargoPage } from '../pages/AirCargoPage';
import { SeaCargoPage } from '../pages/SeaCargoPage';
import { ServicesPage } from '../pages/ServicesPage';
import { FacilitiesPage } from '../pages/FacilitiesPage';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TermsPage } from '../pages/TermsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { LoginPage } from '../pages/LoginPage';
import { AdminDashboard } from '../pages/AdminDashboard';
import { SOPPage } from '../pages/SOPPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <AdminDashboard />
      </RequireAuth>
    ),
  },
  {
    path: '/sop',
    element: (
      <RequireAuth>
        <SOPPage />
      </RequireAuth>
    ),
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'tariffs/air-cargo',
        element: <AirCargoPage />,
      },
      {
        path: 'tariffs/sea-cargo',
        element: <SeaCargoPage />,
      },
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: 'facilities',
        element: <FacilitiesPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
