import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCharacters, useCreateUser, useUser } from "@/hooks/use-game-api";
import { GameButton } from "@/components/ui/GameButton";
import { Avatar } from "@/components/ui/Avatar";
import { Check, ArrowLeft, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Character } from "@shared/schema";

export default function CharacterSelect() {
  const [, setLocation] = useLocation();
  const { data: characters, isLoading } = useCharacters();
  const { mutate: createUser } = useCreateUser();
  const { toast } = useToast();
  
  const [p1Name, setP1Name] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [p1Char, setP1Char] = useState<Character | null>(null);
  const [p2Char, setP2Char] = useState<Character | null>(null);

  // Real-time user data to show unlocked characters and points
  const { data: user1 } = useUser(p1Name.trim());
  const { data: user2 } = useUser(p2Name.trim());

  const handleStart = () => {
    if (!p1Name.trim() || !p2Name.trim()) {
      toast({ title: "Nombres requeridos", description: "Por favor ingresa los nombres de ambos jugadores.", variant: "destructive" });
      return;
    }
    if (!p1Char || !p2Char) {
      toast({ title: "Personajes requeridos", description: "Por favor selecciona un personaje para cada jugador.", variant: "destructive" });
      return;
    }

    const p1Data = { name: p1Name.trim(), username: p1Name.trim(), charId: p1Char.id, score: 0, streakCorrect: 0, streakWrong: 0 };
    const p2Data = { name: p2Name.trim(), username: p2Name.trim(), charId: p2Char.id, score: 0, streakCorrect: 0, streakWrong: 0 };

    createUser({ username: p1Data.username });
    createUser({ username: p2Data.username });

    const gameState = {
      p1: p1Data,
      p2: p2Data,
    };
    
    sessionStorage.setItem("player1", JSON.stringify({ username: p1Data.username }));
    sessionStorage.setItem("player2", JSON.stringify({ username: p2Data.username }));
    sessionStorage.setItem("brainBattleState", JSON.stringify(gameState));
    setLocation("/game");
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <div className="max-w-6xl mx-auto w-full h-full flex flex-col p-4 md:p-8">
        <header className="flex items-center justify-between mb-6 shrink-0">
          <GameButton 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Volver
          </GameButton>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-slate-800">Selección de Personaje</h1>
          <div className="w-20" />
        </header>

        <div className="flex-1 flex flex-col md:flex-row gap-8 mb-6 min-h-0 overflow-hidden">
          {/* Player 1 Column */}
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-white flex flex-col min-h-0 overflow-hidden">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-2xl font-display font-bold text-primary">Jugador 1</h2>
              {user1 && (
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                  <Coins className="w-4 h-4" /> {user1.points}
                </div>
              )}
            </div>
            
            <div className="mb-6 shrink-0">
              <label className="block text-sm font-bold text-muted-foreground mb-2 ml-2">Nombre o Usuario</label>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => {
                  if (e.target.value.length <= 12) {
                    setP1Name(e.target.value);
                  }
                }}
                placeholder="Ingresa nombre..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 font-bold text-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
              {user1 && <p className="text-xs text-green-500 font-bold mt-1 ml-2">¡Usuario encontrado!</p>}
            </div>

            <div className="space-y-3 flex-1 flex flex-col min-h-0">
              <label className="block text-sm font-bold text-muted-foreground ml-2 shrink-0">Elige Avatar</label>
              <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
                <div className="grid grid-cols-3 gap-4 py-2">
                  {isLoading ? (
                    <div className="col-span-3 text-center py-8 text-muted-foreground">Cargando avatars...</div>
                  ) : (
                    characters?.map((char) => {
                      const isSelected = p1Char?.id === char.id;
                      const isUnlocked = char.cost === 0 || user1?.unlockedCharacters?.includes(char.id);
                      
                      return (
                        <button
                          key={char.id}
                          type="button"
                          disabled={!isUnlocked}
                          onClick={() => setP1Char(char)}
                          className={cn(
                            "relative aspect-square rounded-2xl flex items-center justify-center transition-all duration-200 border-4",
                            isSelected 
                              ? "border-primary bg-primary/10 scale-105 shadow-md z-10" 
                              : isUnlocked ? "border-transparent hover:bg-slate-100" : "border-slate-100 opacity-40 grayscale cursor-not-allowed"
                          )}
                        >
                          <Avatar id={char.id} size="lg" locked={!isUnlocked} />
                          {isSelected && (
                            <div className="absolute -top-3 -right-3 bg-primary text-white rounded-full p-1.5 shadow-lg z-20">
                              <Check className="w-4 h-4" strokeWidth={4} />
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center justify-center shrink-0">
            <div className="h-full w-px bg-slate-200" />
            <div className="absolute bg-slate-100 rounded-full p-4 border-4 border-white shadow-sm font-display font-bold text-slate-400">
              VS
            </div>
          </div>

          {/* Player 2 Column */}
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-white flex flex-col min-h-0 overflow-hidden">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-2xl font-display font-bold text-secondary">Jugador 2</h2>
              {user2 && (
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                  <Coins className="w-4 h-4" /> {user2.points}
                </div>
              )}
            </div>
            
            <div className="mb-6 shrink-0">
              <label className="block text-sm font-bold text-muted-foreground mb-2 ml-2">Nombre o Usuario</label>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => {
                  if (e.target.value.length <= 12) {
                    setP2Name(e.target.value);
                  }
                }}
                placeholder="Ingresa nombre..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 font-bold text-lg focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all"
              />
              {user2 && <p className="text-xs text-green-500 font-bold mt-1 ml-2">¡Usuario encontrado!</p>}
            </div>

            <div className="space-y-3 flex-1 flex flex-col min-h-0">
              <label className="block text-sm font-bold text-muted-foreground ml-2 shrink-0">Elige Avatar</label>
              <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
                <div className="grid grid-cols-3 gap-4 py-2">
                  {isLoading ? (
                    <div className="col-span-3 text-center py-8 text-muted-foreground">Cargando avatars...</div>
                  ) : (
                    characters?.map((char) => {
                      const isSelected = p2Char?.id === char.id;
                      const isUnlocked = char.cost === 0 || user2?.unlockedCharacters?.includes(char.id);

                      return (
                        <button
                          key={char.id}
                          type="button"
                          disabled={!isUnlocked}
                          onClick={() => setP2Char(char)}
                          className={cn(
                            "relative aspect-square rounded-2xl flex items-center justify-center transition-all duration-200 border-4",
                            isSelected 
                              ? "border-secondary bg-secondary/10 scale-105 shadow-md z-10" 
                              : isUnlocked ? "border-transparent hover:bg-slate-100" : "border-slate-100 opacity-40 grayscale cursor-not-allowed"
                          )}
                        >
                          <Avatar id={char.id} size="lg" locked={!isUnlocked} />
                          {isSelected && (
                            <div className="absolute -top-3 -right-3 bg-secondary text-white rounded-full p-1.5 shadow-lg z-20">
                              <Check className="w-4 h-4" strokeWidth={4} />
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-6 shrink-0">
          <GameButton size="xl" onClick={handleStart} className="px-16 shadow-xl shadow-primary/25">
            ¡Listos para la batalla!
          </GameButton>
        </div>
      </div>
    </div>
  );
}
