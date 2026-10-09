import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Reader from './pages/Reader';
import StoryPage from './pages/StoryPage';
import ThemeController from './styles/ThemeController';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeController>
        <Routes>
          <Route path="/:slug/citaj" element={<Reader />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/:slug" element={<StoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeController>
    </BrowserRouter>
  );
}
