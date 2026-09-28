import { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Atelier App Error Boundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('atelier_vera_cart');
      localStorage.removeItem('atelier_vera_products');
      localStorage.removeItem('atelier_vera_wishlist');
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#141414] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-white border border-[#E8E6DF] p-8 shadow-sm space-y-4">
            <h1 className="font-serif text-3xl font-normal text-stone-900">Atelier Véra</h1>
            <p className="text-xs uppercase tracking-widest text-stone-500">Notice</p>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              We encountered a client display anomaly. Please refresh your session to reload our latest boutique collection.
            </p>
            <button
              onClick={this.handleReset}
              className="mt-2 px-6 py-2.5 bg-[#141414] text-white hover:bg-black text-xs uppercase tracking-wider font-medium"
            >
              Reload Atelier
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
