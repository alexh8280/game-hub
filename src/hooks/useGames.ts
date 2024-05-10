import useData from "./useData";
import { GameQuery } from "../components/MainPage";
import React from "react";

export interface Platform {
  id: number;
  name: string;
  slug: string;
}

export interface Game {
  id: number;
  name: string;
  background_image: string;
  parent_platforms: { platform: Platform }[];
  metacritic: number;
  rating_top: number;
}

const useGames = (
  gameQuery: GameQuery,
  favorites: string[],
  showOnlyFavorites: boolean,
) => {
  const { data, error, isLoading } = useData<Game>(
    "/games",
    {
      params: {
        genres: gameQuery.genre?.id,
        platforms: gameQuery.platform?.id,
        ordering: gameQuery.sortOrder,
        search: gameQuery.searchText,
      },
    },
    [gameQuery, favorites, showOnlyFavorites],
  );

  const filteredData = React.useMemo(() => {
    return showOnlyFavorites
      ? data.filter((game) => favorites.includes(game.id.toString()))
      : data;
  }, [data, favorites, showOnlyFavorites]);

  return { data: filteredData, error, isLoading };
};

export default useGames;
