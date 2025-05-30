const constElementColorMapper = (type, opacity = 0.5) => {
  const baseColors = {
    normal: `rgba(168, 168, 120, ${opacity})`,
    fire: `rgba(240, 128, 48, ${opacity})`,
    water: `rgba(104, 144, 240, ${opacity})`,
    electric: `rgba(248, 208, 48, ${opacity})`,
    grass: `rgba(120, 200, 80, ${opacity})`,
    ice: `rgba(152, 216, 216, ${opacity})`,
    fighting: `rgba(192, 48, 40, ${opacity})`,
    poison: `rgba(160, 64, 160, ${opacity})`,
    ground: `rgba(224, 192, 104, ${opacity})`,
    flying: `rgba(168, 144, 240, ${opacity})`,
    psychic: `rgba(248, 88, 136, ${opacity})`,
    bug: `rgba(168, 184, 32, ${opacity})`,
    rock: `rgba(184, 160, 56, ${opacity})`,
    ghost: `rgba(112, 88, 152, ${opacity})`,
    dragon: `rgba(112, 56, 248, ${opacity})`,
    dark: `rgba(112, 88, 72, ${opacity})`,
    steel: `rgba(184, 184, 208, ${opacity})`,
    fairy: `rgba(238, 153, 172, ${opacity})`,
  };

  return baseColors[type.toLowerCase()] || `rgba(128, 128, 128, ${opacity})`;
};

export default constElementColorMapper;
