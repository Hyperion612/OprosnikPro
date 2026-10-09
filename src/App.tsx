import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { Home } from './components/Home';
import { Builder } from './components/Builder';
import { RunSurvey } from './components/RunSurvey';
import { Results } from './components/Results';
import { Stats } from './components/Stats';
import { Admin } from './components/Admin';

function Router() {
  const { currentUser } = useApp();
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash) window.location.hash = '#/';
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Apply theme
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      document.documentElement.dataset.theme = saved;
    }
  }, []);

  const path = route.replace('#', '');
  const parts = path.split('/').filter(Boolean);

  // Public survey route
  if (parts[0] === 'survey' && parts[1]) {
    return (
      <Layout>
        <RunSurvey surveyId={parts[1]} />
      </Layout>
    );
  }

  // Auth required
  if (!currentUser) {
    return (
      <Layout>
        <Auth />
      </Layout>
    );
  }

  // Protected routes
  let content: React.ReactNode;

  switch (parts[0]) {
    case 'home':
      content = <Home />;
      break;
    case 'builder':
      content = <Builder />;
      break;
    case 'edit':
      content = <Builder surveyId={parts[1]} />;
      break;
    case 'run':
      content = <RunSurvey surveyId={parts[1]} />;
      break;
    case 'results':
      content = <Results surveyId={parts[1]} />;
      break;
    case 'stats':
      content = <Stats />;
      break;
    case 'admin':
      content = <Admin />;
      break;
    default:
      // Default route based on role
      if (currentUser.role === 'admin') {
        content = <Admin />;
      } else {
        content = <Home />;
      }
  }

  return <Layout>{content}</Layout>;
}

function AppContent() {
  return <Router />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
