import React, { useState } from 'react';
import { Landing } from './components/Landing';
import { Editor } from './components/Editor';
import { AppView } from './types';

function App() {
  const [view, setView] = useState<AppView>('landing');

  return (
    <div className="bg-slate-900 min-h-screen text-slate-50">
      {view === 'landing' && (
        <Landing onStart={() => setView('editor')} />
      )}
      {view === 'editor' && (
        <Editor onBack={() => setView('landing')} />
      )}
    </div>
  );
}

export default App;