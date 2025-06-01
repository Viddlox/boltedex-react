import boltedexAPI from "@/services/axios-instance/boltedexAPI";

const getPokemonAbilities = async ({ name }) => {
  const response = await boltedexAPI.get(`/abilities/${name}`);
  return response.data;
};

export default getPokemonAbilities;
