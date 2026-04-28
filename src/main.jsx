import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/damskie" element={<App ids={[1159538, 63899, 54100, 44824, 36394, 28021, 21455]} sexLetter="K"/>}/>
      <Route path="/meskie" element={<App ids={[1159536, 63900, 54099, 44825, 36398, 28021, 21454]} sexLetter="M"/>}/>
    </Routes>
  </BrowserRouter>,
);
