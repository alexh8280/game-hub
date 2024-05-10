import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Show,
  Switch,
} from "@chakra-ui/react";
import NavBar from "./NavBar";
import GameGrid from "./GameGrid";
import GenreList from "./GenreList";
import React, { useEffect, useState } from "react";
import { Genre } from "../hooks/useGenres";
import PlatformSelector from "./PlatformSelector";
import { Platform } from "../hooks/useGames";
import SortSelector from "./SortSelector";
import GameHeading from "./GameHeading";
import { useNavigate } from "react-router-dom";

interface MainPageProps {
  favorites: string[];
  toggleFavorite: (gameId: string) => void;
}

export interface GameQuery {
  genre: Genre | null;
  platform: Platform | null;
  sortOrder: string;
  searchText: string;
}

const MainPage: React.FC<MainPageProps> = ({ favorites, toggleFavorite }) => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [gameQuery, setGameQuery] = useState<GameQuery>({} as GameQuery);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    if (!username) {
      navigate("/"); // navigate to landing page
    }
  }, [username, navigate]);

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        lg: "200px 1fr",
      }}
    >
      <GridItem area="nav">
        <NavBar
          onSearch={(searchText) => setGameQuery({ ...gameQuery, searchText })}
          username={username ? username : ""}
        />
      </GridItem>
      <Show above="lg">
        <GridItem area="aside" paddingX={5}>
          <GenreList
            selectedGenre={gameQuery.genre}
            onSelectGenre={(genre) => setGameQuery({ ...gameQuery, genre })}
          />
        </GridItem>
      </Show>

      <GridItem area="main">
        <Box paddingLeft={2}>
          <GameHeading gameQuery={gameQuery} />
          <Flex marginBottom={5}>
            <Box marginRight={5}>
              <PlatformSelector
                selectedPlatform={gameQuery.platform}
                onSelectPlatform={(platform) =>
                  setGameQuery({ ...gameQuery, platform })
                }
              />
            </Box>
            <Box marginRight={5}>
              <SortSelector
                sortOrder={gameQuery.sortOrder}
                onSelectSortOrder={(sortOrder) =>
                  setGameQuery({ ...gameQuery, sortOrder })
                }
              />
            </Box>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="show-favorites-switch" mb="0">
                Show only favorites
              </FormLabel>
              <Switch
                id="show-favorites-switch"
                isChecked={showOnlyFavorites}
                onChange={(e) => setShowOnlyFavorites(e.target.checked)}
              />
            </FormControl>
          </Flex>
        </Box>
        <GameGrid gameQuery={gameQuery} showOnlyFavorites={showOnlyFavorites} />
      </GridItem>
    </Grid>
  );
};

export default MainPage;
