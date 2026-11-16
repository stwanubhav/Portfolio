import React, { useState } from 'react';
import { Route, Switch } from 'wouter';
import { NeuralBackground } from './components/NeuralBackground';
import { LoadingScreen } from './components/LoadingScreen';
import { Home } from './pages/Home';
import { ProjectsPage } from './pages/Projects';

export const App: React.FC = () => {
  const [showBootLoader, setShowBootLoader] = useState(true);

  React.useEffect(() => {
    // Strictly disable browser automatic scroll restoration so page always starts at top
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleLoadingComplete = () => {
    setShowBootLoader(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
  };

  const handleReboot = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setShowBootLoader(true);
  };

  return (
    <div className="min-h-screen bg-[#040508] text-slate-100 relative selection:bg-purple-600 selection:text-white overflow-x-hidden">
      {/* Cinematic Cyberpunk System Loading Screen on Initial Boot & Manual Trigger */}
      {showBootLoader && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {/* Global CRT Scanline Raster Overlay */}
      <div className="fixed inset-0 crt-scanlines opacity-25 pointer-events-none z-30" aria-hidden="true" />

      {/* Interactive Neural Canvas Background */}
      <NeuralBackground />

      {/* Router Switch matching portfolio-main architecture */}
      <Switch>
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/project" component={ProjectsPage} />
        <Route path="/contact">
          {() => <Home onReboot={handleReboot} initialContactOpen={true} buildStart={!showBootLoader} />}
        </Route>
        <Route>
          {() => <Home onReboot={handleReboot} buildStart={!showBootLoader} />}
        </Route>
      </Switch>
    </div>
  );
};

export default App;
