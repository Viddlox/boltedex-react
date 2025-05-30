import boltedexAPI from "@/services/axios-instance/boltedexAPI";

const getPokemons = async ({ query = "", cursor = 0, limit = 20 }) => {
  const response = await boltedexAPI.get("/search", {
    params: { query, cursor, limit },
  });
  return response.data;
};

export default getPokemons;
