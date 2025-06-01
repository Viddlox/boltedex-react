import boltedexAPI from "@/services/axios-instance/boltedexAPI";

const getPokemonDetail = async ({ name }) => {
	const response = await boltedexAPI.get(`/detail/${name}`);
	return response.data;
};

export default getPokemonDetail;

