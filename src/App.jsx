import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import NavBar from './components/NavBar/NavBar';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ExplorePage from './pages/ExplorePage/ExplorePage';
import CommunityPage from './pages/CommunityPage/CommunityPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage/PlaylistDetailPage';
import CreatePlaylistPage from './pages/CreatePlaylistPage/CreatePlaylistPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';

export default function App() {
  return (
    <BrowserRouter basename="/my-community">
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
          <Route path="/create" element={<CreatePlaylistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
