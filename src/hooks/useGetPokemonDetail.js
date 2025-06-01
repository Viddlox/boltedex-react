import { useQuery } from "@tanstack/react-query";
import getPokemonDetail from "@/services/request-config/getPokemonDetail";

export const useGetPokemonDetail = ({ name }) => {
  return useQuery({
    queryKey: ["pokemon-detail", name],
    queryFn: () => getPokemonDetail({ name }),
    enabled: !!name,
  });
};

export default useGetPokemonDetail;
