import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { RecyclerAuthProvider, useRecyclerAuth } from './context/RecyclerAuthContext';
import { RecyclerDesktopLayout } from './components/RecyclerDesktopLayout';

// Recycler Web Screens ONLY
import { RecyclerLoginScreen } from './screens/recycler/RecyclerLoginScreen';
import { RecyclerRegisterScreen } from './screens/recycler/RecyclerRegisterScreen';
import { RecyclerHomeScreen } from './screens/recycler/RecyclerHomeScreen';
import { RecyclerLotsScreen } from './screens/recycler/RecyclerLotsScreen';
import { RecyclerVerifyScreen } from './screens/recycler/RecyclerVerifyScreen';
import { RecyclerTransactionsScreen } from './screens/recycler/RecyclerTransactionsScreen';
import { RecyclerPricesScreen } from './screens/recycler/RecyclerPricesScreen';
import { RecyclerProfileScreen } from './screens/recycler/RecyclerProfileScreen';

const RecyclerLayoutWrapper: React.FC = () => {
  const { isAuthenticated, isLoading } = useRecyclerAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs font-bold text-slate-500">
        Authenticating Recycler Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/recycler/login" replace />;
  }

  return (
    <RecyclerDesktopLayout>
      <Outlet />
    </RecyclerDesktopLayout>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <RecyclerAuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              {/* Web Application is Recycler ONLY - Default Root Redirects to Recycler Dashboard */}
              <Route path="/" element={<Navigate to="/recycler/home" replace />} />
              <Route path="/recycler" element={<Navigate to="/recycler/home" replace />} />
              <Route path="/collector/*" element={<Navigate to="/recycler/home" replace />} />

              {/* Recycler Auth Routes */}
              <Route path="/recycler/login" element={<RecyclerLoginScreen />} />
              <Route path="/recycler/register" element={<RecyclerRegisterScreen />} />

              {/* Recycler Operations Dashboard Routes (Protected) */}
              <Route element={<RecyclerLayoutWrapper />}>
                <Route path="/recycler/home" element={<RecyclerHomeScreen />} />
                <Route path="/recycler/lots" element={<RecyclerLotsScreen />} />
                <Route path="/recycler/verify-queue" element={<RecyclerVerifyScreen />} />
                <Route path="/recycler/verify/:id" element={<RecyclerVerifyScreen />} />
                <Route path="/recycler/transactions" element={<RecyclerTransactionsScreen />} />
                <Route path="/recycler/prices" element={<RecyclerPricesScreen />} />
                <Route path="/recycler/profile" element={<RecyclerProfileScreen />} />
              </Route>

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/recycler/home" replace />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </RecyclerAuthProvider>
    </LanguageProvider>
  );
};

export default App;
