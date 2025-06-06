import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { FixedSizeGrid as Grid } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

import Header from "@/components/Header";
import PokemonCardMemo from "@/components/PokemonCard";
import PokemonCardSkeleton from "@/components/PokemonCardSkeleton";

import { useGetPokemons } from "@/hooks/useGetPokemons";
import { useSearchQueryStore } from "@/stores/manageSearchQuery";
import useDebounce from "@/hooks/useDebounce";

const HomePage = () => {
  const { searchQuery, isSearching } = useSearchQueryStore();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetPokemons({ query: debouncedSearchQuery });

  const gridRef = useRef();
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    columnCount: 1,
  });

  const pokemons = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );

  // Reset scroll position when search query changes
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTo({ scrollLeft: 0, scrollTop: 0 });
    }
  }, [debouncedSearchQuery]);

  // Calculate grid dimensions based on screen size
  useEffect(() => {
    const calculateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let columnCount;
      if (width >= 1280) columnCount = 5; // xl
      else if (width >= 1024) columnCount = 4; // lg
      else if (width >= 768) columnCount = 3; // md
      else columnCount = 1; // sm

      setDimensions({
        width: Math.max(width - 32, 320), // Account for padding, min width
        height: height - 120, // Account for header height
        columnCount,
      });
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);

    return () => window.removeEventListener("resize", calculateDimensions);
  }, []);

  // Calculate grid layout
  const { columnWidth, rowHeight, itemCount } = useMemo(() => {
    const { width, columnCount } = dimensions;
    const columnWidth = Math.floor(
      width / columnCount - (columnCount == 1 ? +16 : 0)
    );

    // Card contains: header (h-2 but content makes it ~48px), image (h-20=80px),
    // height/weight (h-4=16px), types (h-8=32px), stats grid (flex-grow ~120px), footer (h-8=32px)
    const headerHeight = 60; // CardHeader with title and Pokemon ID (needs more space)
    const imageHeight = 80; // Fixed h-20 (80px) for image area
    const metaHeight = 32; // Height/weight info (needs more space than h-4)
    const typesHeight = 40; // Type badges (needs more space than h-8)
    const statsHeight = 160; // Stats grid (flex-grow, 6 stats need more vertical space)
    const footerHeight = 48; // Footer button (needs more space than h-8)
    const cardPadding = 32; // Card internal padding (px-3 and other spacing)
    const cellPadding = 24; // Grid cell padding (12px on each side)

    const rowHeight =
      headerHeight +
      imageHeight +
      metaHeight +
      typesHeight +
      statsHeight +
      footerHeight +
      cardPadding +
      cellPadding;

    // When searching or loading, show skeleton cards
    const isSearchingOrLoading = isSearching || isLoading;
    
    let rowCount;
    if (isSearchingOrLoading && pokemons.length === 0) {
      // Show a grid of skeleton cards when searching/loading with no results yet
      const skeletonCount = columnCount * 3; // Show 3 rows of skeletons
      rowCount = Math.ceil(skeletonCount / columnCount);
    } else {
      rowCount = Math.ceil(pokemons.length / columnCount);
    }

    // Add extra rows if we have more data to load (for pagination)
    const itemCount = hasNextPage ? rowCount + 1 : rowCount;

    return { columnWidth, rowHeight, itemCount };
  }, [dimensions, pokemons.length, hasNextPage, isSearching, isLoading]);

  // Check if item is loaded
  const isItemLoaded = useCallback(
    (index) => {
      // If we're searching/loading and have no pokemons, nothing is loaded
      if ((isSearching || isLoading) && pokemons.length === 0) {
        return false;
      }
      
      const actualItemIndex = index * dimensions.columnCount;
      return actualItemIndex < pokemons.length;
    },
    [pokemons.length, dimensions.columnCount, isSearching, isLoading]
  );

  // Load more items
  const loadMoreItems = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Cell renderer for the grid
  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }) => {
      const index = rowIndex * dimensions.columnCount + columnIndex;
      const pokemon = pokemons[index];

      // Show skeletons when searching/loading or when loading more items
      const isSearchingOrLoading = isSearching || isLoading;
      const shouldShowSkeleton = !pokemon && (
        isSearchingOrLoading || 
        (hasNextPage && rowIndex >= Math.floor(pokemons.length / dimensions.columnCount))
      );

      if (shouldShowSkeleton) {
        return (
          <div
            style={{
              ...style,
              padding: "12px",
            }}
          >
            <PokemonCardSkeleton />
          </div>
        );
      }

      if (!pokemon) {
        // Return empty div for incomplete row slots (no more data expected)
        return <div style={style} />;
      }

      return (
        <div
          style={{
            ...style,
            padding: "12px",
          }}
        >
          <PokemonCardMemo pokemon={pokemon} />
        </div>
      );
    },
    [pokemons, dimensions.columnCount, hasNextPage, isSearching, isLoading]
  );

  if (dimensions.width === 0 || dimensions.height === 0) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <Loader2 size={40} className="animate-spin text-red-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-48 sm:pt-28 md:pt-28 px-4 hide-scrollbar side-borders min-h-screen">
        <div className="w-full flex justify-center">
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
            threshold={5} // Start loading when 5 items from the end
          >
            {({ onItemsRendered, ref }) => (
              <Grid
                ref={(grid) => {
                  gridRef.current = grid;
                  ref(grid);
                }}
                columnCount={dimensions.columnCount}
                columnWidth={columnWidth}
                height={dimensions.height}
                rowCount={itemCount}
                rowHeight={rowHeight}
                width={dimensions.width}
                className="hide-scrollbar"
                onItemsRendered={({
                  visibleRowStartIndex,
                  visibleRowStopIndex,
                  overscanRowStartIndex,
                  overscanRowStopIndex,
                }) => {
                  onItemsRendered({
                    overscanStartIndex: overscanRowStartIndex,
                    overscanStopIndex: overscanRowStopIndex,
                    visibleStartIndex: visibleRowStartIndex,
                    visibleStopIndex: visibleRowStopIndex,
                  });
                }}
                style={{
                  outline: "none",
                }}
                overscanRowCount={2}
                overscanColumnCount={0}
              >
                {Cell}
              </Grid>
            )}
          </InfiniteLoader>
        </div>
      </main>
    </>
  );
};

export default HomePage;
