import Search from "@/components/Search";
import Typewriter from "@/components/TypewriterText";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl backdrop-brightness-105 bg-blue-300/30 p-3 sm:p-4 dot-border"
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
            <div className="flex flex-row items-center justify-center gap-4">
              <img
                src="/pokeball.png"
                alt="pokeball"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />

              <h1 className="font-brand text-2xl sm:text-3xl text-yellow-400 drop-shadow-lg text-center pokemon-title">
                Boltedex
              </h1>
              <img
                src="/pokeball.png"
                alt="pokeball"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain -scale-x-100"
              />
            </div>
            <Typewriter
              text="Your trusty Pokédex"
              delay={1400}
              speed={50}
              className="text-xl font-sans"
              cursorClassName="text-black font-bold"
            />
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
        <div className="flex flex-row items-center sm:gap-2">
          <img
            src="/pokeball.png"
            alt="pokeball"
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
          />
          <div className="flex flex-col items-start justify-center h-12 sm:h-16 px-2 sm:px-4">
            <h1 className="font-brand pokemon-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-yellow-400 drop-shadow-lg">
              Boltedex
            </h1>
            <h2 className="font-sans text-lg">
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
