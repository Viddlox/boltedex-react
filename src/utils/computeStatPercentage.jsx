const computeStatPercentage = (baseStats = {}) => {
	const maxByStat = {
	  hp: 255,
	  attack: 190,
	  defense: 230,
	  specialAttack: 194,
	  specialDefense: 230,
	  speed: 180,
	};
  
	const normalizedStats = {};
  
	for (const [stat, value] of Object.entries(baseStats)) {
	  const percentage = (value / maxByStat[stat]) * 100;
	  normalizedStats[stat] = Math.round(percentage);
	}
	return normalizedStats;
  };
  

export default computeStatPercentage;
