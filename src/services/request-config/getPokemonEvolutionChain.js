import boltedexAPI from "@/services/axios-instance/boltedexAPI";

const getPokemonEvolutionChain = async ({ name }) => {
  const response = await boltedexAPI.get(`/evolution/${name}`);
  return response.data;
};

export default getPokemonEvolutionChain;
