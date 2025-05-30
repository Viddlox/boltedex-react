import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Loader2 } from "lucide-react";

import Header from "@/components/Header";
import PokemonCard from "@/components/PokemonCard";

import { useGetPokemons } from "@/hooks/useGetPokemons";

const CHUNK_SIZE = 20;
const DOM_PAGE_SIZE = CHUNK_SIZE * 2;

const HomePage = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPokemons({ limit: CHUNK_SIZE });

  const currentIndex = useRef(0);
  const startElmObserver = useRef();
  const lastElmObserver = useRef();
  const listRef = useRef();
  const [listItems, setListItems] = useState([]);
  const itemsCounter = useRef(0);

  const pokemons = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );

  const maxItemCount = data.pages[0].results.totalCount;
  const hasMore = hasNextPage && !isFetchingNextPage;

  // Initial state, initially list is assigned 20 items then on every update list is appended with 10 items
  useEffect(() => {
    if (!pokemons || !pokemons.length) {
      return;
    }
    itemsCounter.current = itemsCounter.current + 1;
    if (itemsCounter.current === 1) {
      fetchNextPage();
      return;
    }
    if (itemsCounter.current === 2) {
      setListItems(pokemons);
      return;
    }
  }, [pokemons, fetchNextPage]);

  // Calculate starting index of list from where it needs to be updated
  const getVirtualScrollArea = (isScrollDown) => {
    const increment = CHUNK_SIZE;
    let firstIndex;

    if (isScrollDown) {
      firstIndex = currentIndex.current + increment;
    } else {
      firstIndex = currentIndex.current - increment;
    }

    if (firstIndex < 0) {
      firstIndex = 0;
    }

    return firstIndex;
  };

  // Append next elements to list
  const reDrawDOM = useCallback(
    (firstIndex) => {
      const items = [];
      for (let i = 0; i < DOM_PAGE_SIZE; i++) {
        if (pokemons[i + firstIndex]) {
          items.push(pokemons[i + firstIndex]);
        }
      }
      setListItems([...items]);
    },
    [pokemons]
  );

  // Get number from style
  const extractNumber = (st) => Number(st.substring(0, st.length - 2));

  // Update top and bottom padding to virtualize scrolling
  const updateTopBottomPaddings = useCallback((isScrollDown) => {
    if (currentIndex.current === 0) {
      return;
    }
    const container = document.querySelector(".pokemon-list");
    const currentPaddingTop = extractNumber(container.style.paddingTop || "0px");
    const currentPaddingBottom = extractNumber(container.style.paddingBottom || "0px");
    const remPaddingsVal = 170 * CHUNK_SIZE + 10;
    if (isScrollDown) {
      container.style.paddingTop = currentPaddingTop + remPaddingsVal + "px";
      container.style.paddingBottom =
        currentPaddingBottom === 0
          ? "0px"
          : currentPaddingBottom - remPaddingsVal + "px";
    } else {
      container.style.paddingBottom =
        currentPaddingBottom + remPaddingsVal + "px";
      container.style.paddingTop =
        currentPaddingTop === 0
          ? "0px"
          : currentPaddingTop - remPaddingsVal + "px";
    }
  }, []);

  // When top of list is reached
  const topReachedCallback = useCallback(
    (entry) => {
      if (currentIndex.current === 0) {
        const container = document.querySelector(".pokemon-list");
        container.style.paddingTop = "0px";
        container.style.paddingBottom = "0px";
      }
      if (entry.isIntersecting && currentIndex.current !== 0) {
        const firstIndex = getVirtualScrollArea(false);
        updateTopBottomPaddings(false);
        reDrawDOM(firstIndex);
        currentIndex.current = firstIndex;
      }
    },
    [updateTopBottomPaddings, reDrawDOM]
  );

  // When bottom of list is reached
  const bottomReachedCallback = useCallback(
    (entry) => {
      
      if (currentIndex.current === maxItemCount - DOM_PAGE_SIZE) {
        console.log(maxItemCount, DOM_PAGE_SIZE);
        return;
      }
      if (entry.isIntersecting) {
        const firstIndex = getVirtualScrollArea(true);
        if (pokemons[firstIndex + CHUNK_SIZE]) {
          currentIndex.current = firstIndex;
          updateTopBottomPaddings(true);
          reDrawDOM(firstIndex);
        } else {
          if (hasMore) {
            fetchNextPage();
            return;
          }
        }
      }
    },
    [updateTopBottomPaddings, hasMore, maxItemCount, reDrawDOM, pokemons, fetchNextPage]
  );

  // Top element that act as triggers for initiating changes
  const topWatcherElmRef = useCallback(
    (node) => {
      if (startElmObserver.current) startElmObserver.current.disconnect();
      startElmObserver.current = new IntersectionObserver((entries) => {
        topReachedCallback(entries[0]);
      });
      if (node) startElmObserver.current.observe(node);
    },
    [topReachedCallback]
  );

  // Bottom element that act as triggers for initiating changes
  const bottomWatcherElmRef = useCallback(
    (node) => {
      if (lastElmObserver.current) lastElmObserver.current.disconnect();
      lastElmObserver.current = new IntersectionObserver((entries) => {
        bottomReachedCallback(entries[0]);
      });
      if (node) lastElmObserver.current.observe(node);
    },
    [bottomReachedCallback]
  );

  const PokemonList = ({
    listItems = [],
    topWatcherElmRef,
    bottomWatcherElmRef,
    listRef,
    loading,
  }) => {
    return useMemo(() => {
      return (
        <div
          ref={listRef}
          className="h-[calc(100vh-200px)] overflow-auto"
          style={{
            scrollBehavior: "smooth",
            overscrollBehavior: "none",
          }}
        >
          <div className="pokemon-list" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full">
                {listItems.map((pokemon, index) => (
                  <div
                    ref={
                      listItems.length >= 20
                        ? index === 0
                          ? topWatcherElmRef
                          : index === listItems.length - 1
                          ? bottomWatcherElmRef
                          : undefined
                        : undefined
                    }
                    key={pokemon.id || index}
                    className="pokemon-card-wrapper"
                  >
                    <PokemonCard pokemon={pokemon} />
                  </div>
                ))}
              </div>
            </div>
            
            {loading && listItems.length && (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-red-500" />
              </div>
            )}
          </div>
          
          {loading && !listItems.length && (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-red-500" />
            </div>
          )}
        </div>
      );
    }, [
      listItems,
      topWatcherElmRef,
      bottomWatcherElmRef,
      listRef,
      loading,
    ]);
  };

  return (
    <div className="App">
      <main className="min-h-screen w-full pt-48 sm:pt-32 md:pt-32 px-4">
        <Header />
        <PokemonList
          listItems={listItems}
          topWatcherElmRef={topWatcherElmRef}
          bottomWatcherElmRef={bottomWatcherElmRef}
          listRef={listRef}
          loading={isFetchingNextPage}
        />
      </main>
    </div>
  );
};

export default HomePage;