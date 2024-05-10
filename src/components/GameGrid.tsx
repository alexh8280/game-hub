import { SimpleGrid, Text } from "@chakra-ui/react";
import useGames from "../hooks/useGames";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";
import GameCardContainer from "./GameCardContainer";
import { GameQuery } from "./MainPage";
import { useEffect, useState } from "react";
import { PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { putItem, tableName, getUser } from "../services/dbService";

interface Props {
  gameQuery: GameQuery;
  showOnlyFavorites: boolean;
}

const GameGrid = ({ gameQuery, showOnlyFavorites }: Props) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { data, error, isLoading } = useGames(
    gameQuery,
    favorites,
    showOnlyFavorites,
  );
  const skeletons = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const userData = await getUser(userId);
        if (userData && userData.favorites && userData.favorites.SS) {
          setFavorites(userData.favorites.SS);
        }
      } else {
        console.error("User ID not found in localStorage");
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (id: number) => {
    const idStr = id.toString();
    const prevFavorites = favorites;
    const newFavorites = prevFavorites.includes(idStr)
      ? prevFavorites.filter((favoriteId) => favoriteId !== idStr)
      : [...prevFavorites, idStr];

    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("Error: No user ID available");
      return;
    }

    // Retrieve the current user data
    const currentUser = await getUser(userId);

    // Update the favorites in the database
    const params: PutItemCommandInput = {
      TableName: tableName,
      Item: {
        ...currentUser,
        userId: { S: userId },
        favorites: { SS: newFavorites },
      },
    };

    try {
      await putItem(params);
      setFavorites(newFavorites); // Update the state after the async operation
    } catch (err) {
      console.error("Error updating favorites in database:", err);
    }
  };

  if (error) return <Text>{error}</Text>;

  return (
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      padding="10px"
      spacing={6}
    >
      {isLoading &&
        skeletons.map((skeleton) => (
          <GameCardContainer key={skeleton}>
            <GameCardSkeleton />
          </GameCardContainer>
        ))}
      {data.map((game) => (
        <GameCardContainer key={game.id}>
          <GameCard
            game={game}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            isFavorite={favorites.includes(game.id.toString())}
          />
        </GameCardContainer>
      ))}
    </SimpleGrid>
  );
};

export default GameGrid;
