import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import HomePage from '@/components/pages/HomePage';
import ChallengesPage from '@/components/pages/ChallengesPage';
import TrackPage from '@/components/pages/TrackPage';
import RecipesPage from '@/components/pages/RecipesPage';
import TeamPage from '@/components/pages/TeamPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white font-body">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="challenges" element={<ChallengesPage />} />
            <Route path="track" element={<TrackPage />} />
            <Route path="recipes" element={<RecipesPage />} />
            <Route path="team" element={<TeamPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;