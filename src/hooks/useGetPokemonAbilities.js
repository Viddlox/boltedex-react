import { useQuery } from "@tanstack/react-query";
import getPokemonAbilities from "@/services/request-config/getPokemonAbilities";

export const useGetPokemonAbilities = ({ name }) => {
  return useQuery({
    queryKey: ["pokemon-abilities", name],
    queryFn: () => getPokemonAbilities({ name }),
    enabled: !!name,
  });
};
