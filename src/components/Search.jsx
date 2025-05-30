import { Input } from "@/components/ui/8bit/input"
import { motion } from "framer-motion"

const Search = () => {
  return (
    <motion.div
      className="flex items-center w-full max-w-[280px] sm:w-[300px] space-x-4 px-3 py-2"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      <Input type="search" placeholder="Search for a Pokémon" className="w-full bg-white"/>
    </motion.div>
  )
}

export default Search
