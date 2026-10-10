import { useState } from "react";
import { useLocation } from "wouter";
import { useCharacters, useUser, useUnlockCharacter } from "@/hooks/use-game-api";
import { GameButton } from "@/components/ui/GameButton";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowLeft, Coins, Lock, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Store() {
  const [, setLocation] = useLocation();
  const { data: characters } = useCharacters();
  const [username, setUsername] = useState(() => {
    const p1 = sessionStorage.getItem("player1");
    if (p1) return JSON.parse(p1).username;
    return "";
  });
  const { data: user } = useUser(username);
  const { mutate: unlock, isPending } = useUnlockCharacter();
  const { toast } = useToast();

  const handleBuy = (charId: number, cost: number) => {
    if (!user) return;
    
    if ((user?.points ?? 0) < cost) {
      toast({ title: "¡Puntos insuficientes!", variant: "destructive" });
      return;
    }

    unlock({ username, characterId: charId }, {
      onSuccess: () => {
        toast({ title: "¡Personaje desbloqueado!", className: "bg-green-500 text-white" });
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <GameButton variant="ghost" size="sm" onClick={() => setLocation("/")} className="gap-2">
            <ArrowLeft className="w-5 h-5" /> Volver
          </GameButton>
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold">
            <Coins className="w-5 h-5" />
            <span>{user ? user.points : 0} Puntos</span>
          </div>
        </header>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-extrabold text-slate-800 mb-4">Tienda de Personajes</h1>
          
          <div className="max-w-md mx-auto relative">
             <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa usuario para ver puntos..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-center font-bold focus:outline-none focus:border-accent"
            />
            {!user && username.length > 2 && (
              <p className="text-sm text-red-400 mt-2">Usuario no encontrado</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters?.map((char) => {
            const isUnlocked = user?.unlockedCharacters?.includes(char.id) || char.cost === 0;
            const canAfford = user ? (user.points ?? 0) >= char.cost : false;

            return (
              <motion.div
                key={char.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-6 shadow-lg border-2 border-slate-100 flex flex-col items-center relative overflow-hidden"
              >
                {/* Cost Badge */}
                <div className="absolute top-4 right-4 font-bold text-sm bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
                  {char.cost === 0 ? "GRATIS" : <><Coins className="w-3 h-3 text-yellow-500" /> {char.cost}</>}
                </div>

                <div className="mb-4 relative">
                  <Avatar id={char.id} size="xl" locked={!isUnlocked && char.cost > 0} />
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-12 h-12 text-slate-400 drop-shadow-md" />
                    </div>
                  )}
                </div>

                <h3 className="font-display font-bold text-xl mb-4">{char.name}</h3>

                {isUnlocked ? (
                  <GameButton variant="ghost" disabled className="w-full bg-green-50 text-green-600">
                    <Check className="w-4 h-4 mr-2" /> Comprado
                  </GameButton>
                ) : (
                  <GameButton 
                    variant="accent" 
                    className="w-full"
                    disabled={!canAfford || !user || isPending}
                    onClick={() => handleBuy(char.id, char.cost)}
                  >
                    {isPending ? "Comprando..." : `Comprar por ${char.cost}`}
                  </GameButton>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
