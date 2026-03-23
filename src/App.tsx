import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Loader2, AlertTriangle } from 'lucide-react';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Discovery = lazy(() => import('./pages/Discovery'));
const Rankings = lazy(() => import('./pages/Rankings'));
const Admin = lazy(() => import('./pages/Admin'));
const InfluencerDetail = lazy(() => import('./pages/InfluencerDetail'));

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-stone-50 text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-red-100">
            <AlertTriangle size={40} />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tight">Something went wrong</h2>
            <p className="text-stone-500 font-medium leading-relaxed">
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-6 bg-white border border-stone-200 rounded-2xl text-left text-xs text-red-500 overflow-auto max-w-2xl w-full font-mono">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-96">
    <Loader2 className="animate-spin text-emerald-600" size={48} />
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discovery" element={<Discovery />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/influencer/:id" element={<InfluencerDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}
