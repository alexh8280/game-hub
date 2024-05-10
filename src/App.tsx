import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import MainPage from "./components/MainPage";
import { useState } from "react";
import { FavoritesProvider } from "./contexts/FavoritesContext";

function App() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const toggleFavorite = (gameId: string) => {
    if (favorites.includes(gameId)) {
      setFavorites(favorites.filter((id) => id !== gameId));
    } else {
      setFavorites([...favorites, gameId]);
    }
  };
  return (
    <FavoritesProvider>
      <Router>
        <Routes>
          <Route
            path="/main"
            element={
              <MainPage favorites={favorites} toggleFavorite={toggleFavorite} />
            }
          />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
