const computeHeightWeightSI = (height, weight) => {
  const feet = Math.floor(height / 12);
  const inches = height % 12;
  const pounds = (weight * 0.220462).toFixed(0);

  return {
    height: `${feet}'${inches}"`,
    weight: `${pounds} lbs`,
  };
};

export default computeHeightWeightSI;
