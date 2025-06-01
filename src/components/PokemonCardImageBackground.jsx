import { cn } from "@/lib/utils";

import psychic from "@/assets/psychic.webp";
import fairy from "@/assets/fairy.webp";
import poison from "@/assets/poison.webp";
import electric from "@/assets/electric.webp";
import steel from "@/assets/steel.webp";
import fighting from "@/assets/fighting.webp";
import ghost from "@/assets/ghost.webp";
import normal from "@/assets/normal.webp";
import flying from "@/assets/flying.webp";
import ice from "@/assets/ice.webp";
import water from "@/assets/water.webp";
import fire from "@/assets/fire.webp";
import dragon from "@/assets/dragon.webp";
import dark from "@/assets/dark.webp";
import rock from "@/assets/rock.webp";
import bug from "@/assets/bug.webp";
import ground from "@/assets/ground.webp";
import grass from "@/assets/grass.webp";

const typeBackgrounds = {
  normal,
  fire,
  water,
  electric,
  grass,
  ice,
  fighting,
  poison,
  ground,
  flying,
  psychic,
  bug,
  rock,
  ghost,
  dragon,
  dark,
  steel,
  fairy,
};

const PokemonCardImageBackground = ({
  types = [],
  className = "",
  children,
  onClick = () => {},
}) => {

  const handleClick = () => {
    onClick();
  };

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "w-full flex justify-center items-center bg-cover bg-center flex-shrink-0",
          className
        )}
        style={{ backgroundImage: `url(${typeBackgrounds[types[0]]})` }}
        onClick={handleClick}
      >
        {types && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${typeBackgrounds[types[1]]})`,
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
            }}
          />
        )}
        <div className="relative z-20 w-full h-full flex justify-center items-center">{children}</div>
      </div>
    </div>
  );
};

export default PokemonCardImageBackground;
