import boltedexAPI from "@/services/axios-instance/boltedexAPI";

const getPokemonLocationEncounters = async ({ name }) => {
  const response = await boltedexAPI.get(`/location/${name}`);
  return response.data;
};

export default getPokemonLocationEncounters;
