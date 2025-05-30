import constStatMapper from "@/utils/statMapper";

const computeStatPercentage = (baseStats = {}) => {
	const maxByStat = {
		hp: 255,
		attack: 200,
		defense: 250,
		specialAttack: 200,
		specialDefense: 250,
		speed: 200,
	};

	const normalizedStats = {};

	for (const [stat, value] of Object.entries(baseStats)) {
		const statValue = Number(value) || 0;
		const maxValue = maxByStat[stat];
		let statRounded;

		if (maxValue) {
			const percentage = Math.min((statValue / maxValue) * 100, 100);
			statRounded = Math.round(percentage);
			const mappedStat = constStatMapper[stat] || stat;
			normalizedStats[mappedStat] = statRounded;
		} else {
			const mappedStat = constStatMapper[stat] || stat;
			normalizedStats[mappedStat] = 0;
		}
	}
	
	return normalizedStats;
};

export default computeStatPercentage;
