// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import * as AppMod from './App.jsx';
import './styles.css';

const RootApp = AppMod.default ?? AppMod.App;
if (!RootApp) throw new Error('App.jsx musi eksportować domyślnie komponent albo nazwany "App".');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
