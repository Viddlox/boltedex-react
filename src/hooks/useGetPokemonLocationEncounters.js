import { useQuery } from "@tanstack/react-query";
import getPokemonLocationEncounters from "@/services/request-config/getPokemonLocationEncounters";

export const useGetPokemonLocationEncounters = ({ name }) => {
  return useQuery({
    queryKey: ["pokemon-location-encounters", name],
    queryFn: () => getPokemonLocationEncounters({ name }),
    enabled: !!name,
  });
};
