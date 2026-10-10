import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { GameButton } from "@/components/ui/GameButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Brain, Play, BookOpen, ShoppingBag, Trophy, XCircle, CheckCircle } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-blue-200 rounded-full blur-2xl opacity-40" />

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center mb-12 z-10"
      >
        <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-xl mb-6">
          <Brain className="w-16 h-16 text-primary mr-4" />
          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-primary tracking-tight">
            Brain Battle
          </h1>
        </div>
        <p className="text-xl text-muted-foreground font-body font-medium max-w-md mx-auto">
          ¡Desafía a tus amigos en una batalla de ingenio! 
          Responde preguntas, gana puntos y desbloquea personajes geniales.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-col gap-4 w-full max-w-sm z-10"
      >
        <GameButton 
          size="xl" 
          onClick={() => setLocation("/select")}
          className="w-full flex items-center justify-center gap-3"
        >
          <Play className="w-8 h-8 fill-current" />
          Empezar Juego
        </GameButton>

        <div className="grid grid-cols-2 gap-4">
          <GameButton 
            variant="secondary" 
            size="lg" 
            onClick={() => setShowRules(true)}
            className="flex flex-col items-center justify-center gap-2"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-sm">Cómo jugar</span>
          </GameButton>

          <GameButton 
            variant="accent" 
            size="lg" 
            onClick={() => setLocation("/store")}
            className="flex flex-col items-center justify-center gap-2"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="text-sm">Tienda</span>
          </GameButton>
        </div>
      </motion.div>

      {/* Rules Modal */}
      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm border-4 border-secondary/20 rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-display font-bold text-center text-foreground mb-4">
              Reglas del Juego
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 font-body">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900">2 Jugadores</h4>
                <p className="text-blue-700 text-sm">Tomen turnos para responder preguntas de 3 niveles diferentes.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-2xl">
              <div className="bg-green-100 p-2 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-green-900">Puntuación</h4>
                <p className="text-green-700 text-sm">+1 Punto por cada respuesta correcta.</p>
                <p className="text-green-800 text-xs font-bold mt-1">BONO: ¡3 correctas seguidas = +1 punto extra!</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-2xl">
              <div className="bg-red-100 p-2 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="font-bold text-red-900">¡Cuidado!</h4>
                <p className="text-red-700 text-sm">3 respuestas incorrectas seguidas = -1 punto de penalización.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-2xl">
              <div className="bg-yellow-100 p-2 rounded-xl">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-bold text-yellow-900">Ganar</h4>
                <p className="text-yellow-700 text-sm">¡El que termine primero o tenga el puntaje más alto gana!</p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <GameButton className="w-full" onClick={() => setShowRules(false)}>
              ¡Entendido!
            </GameButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
