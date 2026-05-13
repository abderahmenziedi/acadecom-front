import { Component } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * ErrorBoundary - Capture les erreurs React et les affiche proprement
 * Évite les white screens au déploiement
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-950 p-4">
          <div className="max-w-md w-full space-y-4">
            <div className="flex justify-center">
              <div className="bg-red-100 dark:bg-red-900 rounded-full p-3">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Oups ! Une erreur est survenue</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {this.state.error?.message || 'Une erreur inattendue s\'est produite.'}
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
            >
              Réessayer
            </button>
            <a
              href="/"
              className="block w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition text-center"
            >
              Retour à l'accueil
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
