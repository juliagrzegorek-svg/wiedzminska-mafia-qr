import React from 'react';
import { createRoot } from 'react-dom/client';
import * as AppMod from './App.jsx';

// działa niezależnie od tego, czy w App.jsx masz:
//   export default function App() { ... }      (domyślny)
//   export function App() { ... }              (nazwany)
//   function App() { ... } export default App; (domyślny na końcu)
const RootApp = AppMod.default ?? AppMod.App;

if (!RootApp) {
  throw new Error('App.jsx musi eksportować domyślnie komponent albo nazwany "App".');
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
