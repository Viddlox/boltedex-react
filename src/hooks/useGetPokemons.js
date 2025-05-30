import { useInfiniteQuery } from "@tanstack/react-query";

import getPokemons from "@/services/request-config/getPokemons";

export const useGetPokemons = ({ query = "", limit = 20 }) => {
  return useInfiniteQuery({
    queryKey: ["pokemons", { query, limit }],
    queryFn: ({ pageParam }) =>
      getPokemons({ query, cursor: pageParam, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
  });
};
