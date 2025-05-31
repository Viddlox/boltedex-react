import normal from "@/assets/icons/normal.svg";
import fire from "@/assets/icons/fire.svg";
import water from "@/assets/icons/water.svg";
import electric from "@/assets/icons/electric.svg";
import grass from "@/assets/icons/grass.svg";
import ice from "@/assets/icons/ice.svg";
import poison from "@/assets/icons/poison.svg";
import ground from "@/assets/icons/ground.svg";
import rock from "@/assets/icons/rock.svg";
import psychic from "@/assets/icons/psychic.svg";
import ghost from "@/assets/icons/ghost.svg";
import dragon from "@/assets/icons/dragon.svg";
import dark from "@/assets/icons/dark.svg";
import steel from "@/assets/icons/steel.svg";
import fairy from "@/assets/icons/fairy.svg";
import fighting from "@/assets/icons/fighting.svg";
import flying from "@/assets/icons/flying.svg";
import bug from "@/assets/icons/bug.svg";

const pokemonTypeMapper = {
  normal: {
    src: normal,
    color: "bg-gray-400/50", // Neutral beige/tan
  },
  fire: {
    src: fire,
    color: "bg-orange-500/50", // Classic fire red
  },
  water: {
    src: water,
    color: "bg-blue-500/50", // Ocean blue
  },
  electric: {
    src: electric,
    color: "bg-yellow-400/50", // Electric yellow (perfect as is)
  },
  grass: {
    src: grass,
    color: "bg-green-500/50", // Nature green
  },
  ice: {
    src: ice,
    color: "bg-cyan-300/50", // Icy light blue
  },
  poison: {
    src: poison,
    color: "bg-purple-500/50", // Toxic purple
  },
  ground: {
    src: ground,
    color: "bg-amber-600/50", // Earthy brown/orange
  },
  rock: {
    src: rock,
    color: "bg-stone-500/50", // Rocky gray-brown
  },
  psychic: {
    src: psychic,
    color: "bg-pink-400/50", // Psychic pink (perfect as is)
  },
  ghost: {
    src: ghost,
    color: "bg-indigo-600/50", // Dark purple-blue
  },
  dragon: {
    src: dragon,
    color: "bg-violet-600/50", // Mystical purple
  },
  dark: {
    src: dark,
    color: "bg-slate-700/50", // Dark gray-black
  },
  steel: {
    src: steel,
    color: "bg-slate-400/50", // Metallic silver
  },
  fairy: {
    src: fairy,
    color: "bg-pink-300/50", // Light magical pink
  },
  fighting: {
    src: fighting,
    color: "bg-red-700/50", // Deep fighting red
  },
  flying: {
    src: flying,
    color: "bg-sky-400/50", // Sky blue
  },
  bug: {
    src: bug,
    color: "bg-lime-500/50", // Bug green
  },
};

export default pokemonTypeMapper;
