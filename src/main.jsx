import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Damskie from "./Damskie";
import Meskie from "./Meskie";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/damskie" element={<Damskie />}/>
      <Route path="/meskie" element={<Meskie />}/>
    </Routes>
  </BrowserRouter>,
);
