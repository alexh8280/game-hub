import React from "react";
import { Game } from "../hooks/useGames";
import {
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
  IconButton,
} from "@chakra-ui/react";
import PlatformIconList from "./PlatformIconList";
import CriticScore from "./CriticScore";
import getCroppedImageUrl from "../services/image-url";
import Emoji from "./Emoji";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface Props {
  game: Game;
  favorites: string[];
  toggleFavorite: (id: number) => void;
  isFavorite: boolean;
}

const GameCard = ({ game, favorites, toggleFavorite, isFavorite }: Props) => {
  return (
    <Card>
      <Image src={getCroppedImageUrl(game.background_image)} />
      <CardBody>
        <HStack justifyContent="space-between" marginBottom={3}>
          <PlatformIconList
            platforms={game.parent_platforms.map((p) => p.platform)}
          />
          <CriticScore score={game.metacritic} />
        </HStack>
        <Heading fontSize="2xl">
          {game.name}
          <HStack justifyContent="space-between">
            <Emoji rating={game.rating_top} />
            <IconButton
              marginTop={3}
              aria-label="Favorite"
              icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
              onClick={() => toggleFavorite(game.id)}
            />
          </HStack>
        </Heading>
      </CardBody>
    </Card>
  );
};

export default GameCard;
