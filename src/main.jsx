// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import WitcherDeck from "./components/WitcherDeck.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(<WitcherDeck />);
