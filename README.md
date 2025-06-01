# 🎮 BolteDex React - Interactive Pokémon Encyclopedia

<div align="center">
  <img src="demo.gif" alt="BolteDex React Demo" width="800" style="border-radius: 10px; margin: 20px 0;">
</div>

<div align="center">
  <p>
    <em>A modern, interactive Pokémon encyclopedia built with React and powered by the PokéAPI</em>
  </p>
  
  <p>
    <a href="https://boltedex.up.railway.app/" target="_blank">
      <img src="https://img.shields.io/badge/🚀_Live_Demo-FF6B6B?style=for-the-badge&logoColor=white" alt="Live Demo" />
    </a>
  </p>
  
  ![React](https://img.shields.io/badge/React-19.x-blue?style=for-the-badge&logo=react)
  ![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=000&style=for-the-badge)
</div>

## 🌟 Overview

BolteDex React is a comprehensive Pokémon encyclopedia that brings the world of Pokémon to life through an immersive, retro-inspired interface. Explore detailed Pokémon cards, discover evolution chains, and dive deep into the stats, abilities, and locations of your favorite Pokémon.

### ✨ Key Features

- 🖱️ **Seamless Infinite Scroll** - Virtualization to efficiently render 1000+ Pokémon data
- 🎴 **Interactive Pokémon Cards** - Beautiful, animated cards with hover effects and detailed information
- 🔄 **Evolution Chains** - Visual evolution trees with sprite carousels for each evolution stage  
- 🗺️ **Location Data** - Discover where to find Pokémon in their natural habitats
- 📊 **Comprehensive Stats** - Base stats with visual progress bars and percentage calculations
- 🎭 **Multiple Sprite Views** - Front, back, shiny variants with smooth carousel navigation
- 💫 **Smooth Animations** - Powered by Framer Motion for delightful user interactions
- 📱 **Responsive Design** - Optimized for all screen sizes
- 🎨 **Retro 8-bit Theme** - Custom UI components with nostalgic gaming aesthetics
- ⚡ **Performance Optimized** - Smart caching and lazy loading

## 🚀 Tech Stack

### Core Framework
- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **JavaScript/JSX** - Type-safe development ready for TypeScript migration

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Custom 8-bit Components** - Retro-themed card, button, and dialog components
- **Framer Motion** - Production-ready motion library for React
- **Lucide React** - Beautiful, customizable icon library
- **React Window** - Virtualization library for highly efficient rendering of large datasets

### Data Management
- **TanStack Query (React Query)** - Powerful data synchronization for React
- **Custom Hooks** - Modular data fetching with built-in caching
- **PokéAPI Integration** - Official Pokémon REST API

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **Modern ES6+** - Latest JavaScript features and syntax

## 📁 Project Structure

```
src/
├── config/
│   ├── index.js # Global .env instance
├── components/           # Reusable UI components
│   ├── ui/8bit/         # Custom retro-themed components
│   ├── PokemonCard.jsx  # Main Pokémon card component
│   └── PokemonCardDetails.jsx  # Detailed view with tabs
├── hooks/               # Custom React hooks for data fetching
│   ├── useGetPokemonAbilities.js
│   ├── useGetPokemonEvolutionChain.js
│   └── useGetPokemonLocationEncounters.js
├── utils/               # Utility functions and mappers
│   ├── computeStatPercentage.js
│   ├── pokemonTypeMapper.js
│   └── imageNameMapper.js
└── assets/              # Static assets and images
```

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/boltedex-react.git
   cd boltedex-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure .env**
   ```.env
   VITE_API_URL=http://localhost:8080
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   vite
   ```

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 📚 Key Libraries & Dependencies

### UI & Styling
- **@radix-ui/react-\*** - Headless UI primitives for accessibility
- **tailwindcss** - Utility-first CSS framework
- **framer-motion** - Animation library for React
- **lucide-react** - Icon library with 1000+ icons

### Data Fetching & State
- **@tanstack/react-query** - Data synchronization and caching
- **axios** (or fetch) - HTTP client for API requests
- **zustand** - Search result caching

### Development
- **@vitejs/plugin-react** - React plugin for Vite
- **eslint** - JavaScript linting utility
- **postcss** - CSS transformation tool

## 🗄️ Caching Strategy

### React Query Implementation
BolteDex uses TanStack Query for intelligent data caching and synchronization:

```javascript
// Example: Infinite query caching
export const useGetPokemons = ({ query = "", limit = 20 }) => {
  return useInfiniteQuery({
    queryKey: ["pokemons", { query, limit }],
    queryFn: ({ pageParam }) =>
      getPokemons({ query, cursor: pageParam, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
  });
};
```

```javascript
// Example: Query client and localStorage persistence setup
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24,
});
```

### Caching Benefits
- **Automatic Background Updates** - Fresh data without user intervention
- **Optimistic Updates** - Instant UI feedback
- **Smart Refetching** - Only fetch when necessary
- **Memory Management** - Automatic garbage collection of unused data
- **Offline Support** - Cached data available without network

## 🎨 Component Architecture

### PokemonCard Component
- **Responsive Grid Layout** - Adapts to different screen sizes
- **Hover Animations** - Smooth transitions and effects
- **Modal Integration** - Detailed view in overlay dialogs
- **Image Lazy Loading** - Performance optimization

### PokemonCardDetails Component
- **Tabbed Interface** - Overview, Evolution, Locations
- **Scrollable Sections** - Fixed height with overflow handling
- **Visual Indicators** - Chevron icons for scrollable content
- **Carousel Navigation** - Multiple sprite views per Pokémon

## 🔮 Future Enhancements

- [ ] **Search & Filtering** - Find Pokémon by name, type, or generation
- [ ] **Favorites System** - Save and organize favorite Pokémon
- [ ] **Type Effectiveness Chart** - Interactive type matchup calculator
- [ ] **Pokémon Comparison** - Side-by-side stat comparisons
- [ ] **Progressive Web App** - Offline functionality and mobile app experience
- [ ] **Dark/Light Theme** - User preference theming
- [ ] **Advanced Animations** - More sophisticated motion designs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️</p>
  <p>
    <a href="#-overview">Back to Top</a>
  </p>
</div>
