// Import all Pokemon type background images
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

const getCardBackgroundByType = (types) => {
  let type = types.length == 2 ? types[1] : types[0];
  const normalizedType = type?.toLowerCase();
  return typeBackgrounds[normalizedType] || typeBackgrounds.normal;
};

export default getCardBackgroundByType;
