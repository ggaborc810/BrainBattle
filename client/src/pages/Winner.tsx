import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { GameButton } from "@/components/ui/GameButton";
import { Avatar } from "@/components/ui/Avatar";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Gift, ArrowRight } from "lucide-react";
import { useUser, useUpdatePoints } from "@/hooks/use-game-api";

export default function Winner() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<any>(null);

  const username = data?.winner?.name || "";
  const { data: user } = useUser(username);
  const { mutate: updatePoints } = useUpdatePoints();

  useEffect(() => {
    const saved = sessionStorage.getItem("brainBattleWinner");
    if (saved) {
      const parsedData = JSON.parse(saved);
      setData(parsedData);
      
      // Big Celebration
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, []);

  useEffect(() => {
    if (data?.winner && user && !data.pointsUpdated) {
      // Game already updates points incrementally during the match
      // So here we only mark it as updated or add a bonus if needed
      setData((prev: any) => ({ ...prev, pointsUpdated: true }));
    }
  }, [data, user, updatePoints]);

  if (!data) return null;

  const { winner, p1, p2 } = data;
  const isTie = !winner;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Background beams */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-black opacity-80" />
      
      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          {isTie ? (
            <div className="bg-white rounded-[3rem] p-12 text-center shadow-2xl border-8 border-slate-200">
              <h1 className="text-6xl font-display font-black text-slate-800 mb-6 uppercase">¡Empate!</h1>
              <div className="flex justify-center gap-8 mb-8">
                <Avatar id={p1.charId} />
                <Avatar id={p2.charId} />
              </div>
              <p className="text-2xl font-bold text-slate-500">¡Ambos jugadores anotaron {(p1.score ?? 0).toString()} puntos!</p>
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] p-12 text-center shadow-2xl border-8 border-yellow-400 relative">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 p-4 rounded-full shadow-lg">
                <Trophy className="w-16 h-16 fill-current" />
              </div>

              <h1 className="text-6xl font-display font-black text-yellow-500 mb-2 mt-8 uppercase">¡GANADOR!</h1>
              <h2 className="text-4xl font-display font-bold text-slate-800 mb-8 uppercase tracking-tight">{winner.name}</h2>
              
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, -5, 5, 0] 
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Avatar id={winner.charId} className="w-40 h-40 border-8 border-yellow-200" />
                </motion.div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6 mb-8">
                <div className="text-sm font-bold text-yellow-600 uppercase tracking-widest mb-1">Puntaje Total</div>
                <div className="text-5xl font-black text-yellow-500">{(winner.score ?? 0).toString()} Puntos</div>
                <div className="text-sm font-bold text-green-600 mt-2">¡Incluye +3 puntos de bonificación por ganar!</div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GameButton size="xl" onClick={() => setLocation("/select")} className="px-8 flex items-center gap-2">
                  Jugar de nuevo <ArrowRight className="w-5 h-5" />
                </GameButton>
                
                <GameButton variant="neutral" size="xl" onClick={() => setLocation("/store")} className="px-8 flex items-center gap-2">
                  Ir a la Tienda <Gift className="w-5 h-5" />
                </GameButton>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
