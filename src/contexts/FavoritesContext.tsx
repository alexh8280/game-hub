// FavoritesContext.tsx
import React, { createContext, useState, useContext } from "react";

interface FavoritesContextProps {
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
}

export const FavoritesContext = createContext<
  FavoritesContextProps | undefined
>(undefined);

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
