import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-sky-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-400 rounded-xl flex items-center justify-center shadow-lg shadow-sky-400/20">
              <Gamepad2 className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Plaxa™ Game Plaza</h1>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">v1.0.0 // stable</p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-sky-400/50 transition-colors text-sm"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                layoutId={game.id}
                onClick={() => setSelectedGame(game)}
                className="group relative bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden cursor-pointer game-card-hover"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-sky-400 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {game.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg">No games found matching your search.</p>
          </div>
        )}
      </main>

      {/* Game Player Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              layoutId={selectedGame.id}
              className={`relative bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 ${
                isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl aspect-video'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <h2 className="font-bold text-lg">{selectedGame.title}</h2>
                  <span className="px-2 py-0.5 bg-sky-400/10 text-sky-400 text-[10px] font-mono uppercase tracking-wider rounded border border-sky-400/20">
                    Live Session
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a
                    href={selectedGame.iframeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => {
                      setSelectedGame(null);
                      setIsFullscreen(false);
                    }}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-zinc-400 hover:text-red-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 bg-black relative">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-sm">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            <span>© 2024 Plaxa™ Game Plaza. All rights reserved.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
