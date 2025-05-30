const computeHeightWeightSI = (height, weight) => {
  const heightInMeters = height / 10;
  const heightInInches = heightInMeters * 39.37;
  let feet = Math.floor(heightInInches / 12);
  let inches = Math.ceil(heightInInches % 12);
  if (inches === 12) {
    feet += 1;
    inches = 0;
  }
  const pounds = (weight * 0.220462).toFixed(0);

  return {
    height: `${feet}'${inches}"`,
    weight: `${pounds} lbs`,
  };
};

export default computeHeightWeightSI;
