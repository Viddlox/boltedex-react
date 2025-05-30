import Search from "@/components/Search";
import Typewriter from "@/components/TypewriterText";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl backdrop-brightness-110 bg-blue-200/10 p-3 sm:p-4 border-b border-blue-400"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.6,
      }}
    >
      <motion.div
        className="flex flex-col gap-4 sm:hidden max-w-full"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row items-center justify-center gap-2">
              <h1 className="font-brand text-xl text-yellow-400 drop-shadow-lg text-center font-outline-2">
                Boltedex
              </h1>
              <img
                src="/pokemon_brand.png"
                alt="Boltedx"
                className="w-32 sm:w-40 h-12 sm:h-16 object-contain"
              />
            </div>
            <h2 className="font-sans text-sm text-black/90 drop-shadow-md text-center">
              <Typewriter
                text="Your trusty Pokédex"
                delay={1400}
                speed={50}
                className="text-lg"
                cursorClassName="text-black font-bold"
              />
            </h2>
          </div>
          <div className="flex justify-center w-full px-2">
            <Search />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="hidden sm:flex flex-row items-center justify-center gap-2 xl:gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex flex-row items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center justify-center h-12 sm:h-16 px-2 sm:px-4">
            <div className="flex flex-row items-center justify-center gap-2">
              <h1 className="font-brand font-outline-2 text-xl sm:text-2xl md:text-4xl text-yellow-400 drop-shadow-lg">
                Boltedex
              </h1>
              <img
                src="/pokemon_brand.png"
                alt="Boltedx"
                className="w-32 h-16 object-contain"
              />
            </div>
            <h2 className="font-sans text-lg text-black/90 drop-shadow-md">
              <Typewriter
                text="Your trusty Pokédex"
                delay={800}
                speed={50}
                cursorClassName="text-black font-bold"
              />
            </h2>
          </div>
          <Search />
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
