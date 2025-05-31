// Import all Pokemon type background images
import psychic from "@/assets/psychic.jpg";
import fairy from "@/assets/fairy.webp";
import poison from "@/assets/poison.jpg";
import electric from "@/assets/electric.png";
import steel from "@/assets/steel.webp";
import fighting from "@/assets/fighting.jpg";
import ghost from "@/assets/ghost.webp";
import normal from "@/assets/normal.png";
import flying from "@/assets/flying.jpg";
import ice from "@/assets/ice.jpg";
import water from "@/assets/water.jpg";
import fire from "@/assets/fire.png";
import dragon from "@/assets/dragon.png";
import dark from "@/assets/dark.png";
import rock from "@/assets/rock.png";
import bug from "@/assets/bug.jpg";
import ground from "@/assets/ground.jpg";
import grass from "@/assets/grass.png";

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
