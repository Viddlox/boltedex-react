import { useState, useEffect } from "react"
import { Input } from "@/components/ui/8bit/input"
import { motion } from "framer-motion"
import { Search as SearchIcon, Loader2 } from "lucide-react"

import { useSearchQueryStore } from "@/stores/manageSearchQuery";
import useDebounce from "@/hooks/useDebounce";

const Search = () => {
  const { searchQuery, setSearchQuery } = useSearchQueryStore();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isSearching, setIsSearching] = useState(false);

  // Show loading when user is typing but search hasn't been triggered yet
  useEffect(() => {
    if (searchQuery !== debouncedSearchQuery && searchQuery.length > 0) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery, debouncedSearchQuery]);
  
  return (
    <motion.div
      className="flex items-center w-full max-w-[280px] sm:w-[300px] space-x-4 px-3 py-2"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      <div className="relative w-full">
        <Input 
          type="search" 
          placeholder="Search for a Pokémon" 
          className="w-full bg-white pr-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin text-red-500" />
          ) : (
            <SearchIcon className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Search
