import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-100 text-stone-900 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-stone-200 text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              Ein Fehler ist aufgetreten
            </h1>
            <p className="text-stone-600 text-sm mb-6">
              Die Anwendung konnte nicht geladen werden. Klicke unten, um die Seite neu zu laden oder den Speicher zurückzusetzen.
            </p>
            {this.state.error && (
              <pre className="bg-stone-50 border border-stone-200 text-stone-700 text-xs p-3 rounded-lg text-left overflow-x-auto mb-6 max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Seite neu laden
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium transition flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Home className="w-4 h-4" />
                Speicher leeren & neu starten
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
