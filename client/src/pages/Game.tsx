import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuestions, useUpdatePoints } from "@/hooks/use-game-api";
import { GameButton } from "@/components/ui/GameButton";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface PlayerState {
  name: string;
  charId: number;
  score: number;
  streakCorrect: number;
  streakWrong: number;
}

export default function Game() {
  const [location, setLocation] = useLocation();
  const { data: questions, isLoading } = useQuestions();
  const { mutate: updatePoints } = useUpdatePoints();

  const [p1, setP1] = useState<PlayerState | null>(null);
  const [p2, setP2] = useState<PlayerState | null>(null);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  const [p1QIndex, setP1QIndex] = useState(0);
  const [p2QIndex, setP2QIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState<
    "correct" | "wrong" | "bonus" | "penalty" | null
  >(null);
  const [levelTransition, setLevelTransition] = useState<{
    from: number;
    to: number;
    playerName: string;
  } | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("brainBattleState");
    if (!saved) {
      setLocation("/");
      return;
    }
    const parsed = JSON.parse(saved);

    setP1({
      name: parsed.p1.username || parsed.p1.name || "Jugador 1",
      charId: Number(parsed.p1.charId),
      score: 0,
      streakCorrect: 0,
      streakWrong: 0,
    });
    setP2({
      name: parsed.p2.username || parsed.p2.name || "Jugador 2",
      charId: Number(parsed.p2.charId),
      score: 0,
      streakCorrect: 0,
      streakWrong: 0,
    });
  }, [setLocation]);

  const [p1Questions, setP1Questions] = useState<any[]>([]);
  const [p2Questions, setP2Questions] = useState<any[]>([]);

  useEffect(() => {
    if (questions) {
      // Create separate shuffled sets for each player
      const q = [...questions];
      const p1Q = q.filter(q => q.level === 1).sort(() => Math.random() - 0.5).slice(0, 5)
        .concat(q.filter(q => q.level === 2).sort(() => Math.random() - 0.5).slice(0, 5))
        .concat(q.filter(q => q.level === 3).sort(() => Math.random() - 0.5).slice(0, 5));
      
      const p2Q = q.filter(q => q.level === 1).sort(() => Math.random() - 0.5).slice(0, 5)
        .concat(q.filter(q => q.level === 2).sort(() => Math.random() - 0.5).slice(0, 5))
        .concat(q.filter(q => q.level === 3).sort(() => Math.random() - 0.5).slice(0, 5));

      setP1Questions(p1Q);
      setP2Questions(p2Q);
    }
  }, [questions]);

  if (isLoading || !questions || !p1 || !p2 || p1Questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const currentPlayerQuestions = currentTurn === 1 ? p1Questions : p2Questions;
  const currentQIndex = currentTurn === 1 ? p1QIndex : p2QIndex;
  const setQIndex = currentTurn === 1 ? setP1QIndex : setP2QIndex;

  if (p1QIndex >= p1Questions.length || p2QIndex >= p2Questions.length) {
    const winner = p1.score > p2.score ? p1 : p2.score > p1.score ? p2 : null;

    // Update points only at the end
    if (winner) {
      updatePoints({ username: winner.name, points: winner.score + 3 });
      // Update loser points too (their base score)
      const loser = winner === p1 ? p2 : p1;
      updatePoints({ username: loser.name, points: loser.score });
    } else {
      // Tie
      updatePoints({ username: p1.name, points: p1.score });
      updatePoints({ username: p2.name, points: p2.score });
    }

    sessionStorage.setItem(
      "brainBattleWinner",
      JSON.stringify({ p1, p2, winner }),
    );
    setLocation("/winner");
    return null;
  }

  const currentQuestion = currentPlayerQuestions[currentQIndex];
  const currentPlayer = currentTurn === 1 ? p1 : p2;
  const setPlayer = currentTurn === 1 ? setP1 : setP2;
  const isP1Turn = currentTurn === 1;

  const handleAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    let pointsToAdd = 0;
    let feedbackType: "correct" | "wrong" | "bonus" | "penalty" = isCorrect
      ? "correct"
      : "wrong";

    if (isCorrect) {
      pointsToAdd = 1;
      const newStreak = currentPlayer.streakCorrect + 1;

      if (newStreak >= 3 && newStreak % 3 === 0) {
        pointsToAdd += 1;
        feedbackType = "bonus";
      }

      setPlayer((prev) =>
        prev
          ? {
              ...prev,
              score: prev.score + pointsToAdd,
              streakCorrect: newStreak,
              streakWrong: 0,
            }
          : null,
      );

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7, x: isP1Turn ? 0.2 : 0.8 },
        colors: isP1Turn ? ["#3b82f6", "#60a5fa"] : ["#db2777", "#f472b6"],
      });
    } else {
      const newWrongStreak = currentPlayer.streakWrong + 1;

      if (newWrongStreak >= 3) {
        pointsToAdd = -1;
        feedbackType = "penalty";
      }

      setPlayer((prev) =>
        prev
          ? {
              ...prev,
              score: Math.max(0, prev.score + pointsToAdd),
              streakCorrect: 0,
              streakWrong: newWrongStreak,
            }
          : null,
      );
    }

    // NO INCREMENTAL UPDATES HERE ANYMORE

    setShowFeedback(feedbackType);

    setTimeout(() => {
      setShowFeedback(null);
      if (isCorrect) {
        const nextIndex = currentQIndex + 1;
        const currentLevel = currentQuestion.level;
        const nextQuestion = currentPlayerQuestions[nextIndex];

        if (nextQuestion && nextQuestion.level > currentLevel) {
          setLevelTransition({
            from: currentLevel,
            to: nextQuestion.level,
            playerName: currentPlayer.name,
          });
          setTimeout(() => {
            setLevelTransition(null);
            setQIndex(nextIndex);
            setCurrentTurn((prev) => (prev === 1 ? 2 : 1));
          }, 4000);
          return;
        }

        if (nextIndex % 5 === 0 && nextIndex < currentPlayerQuestions.length) {
          const nextLevel = Math.floor(nextIndex / 5) + 1;
          setLevelTransition({
            from: nextLevel - 1,
            to: nextLevel,
            playerName: currentPlayer.name,
          });
          setTimeout(() => {
            setLevelTransition(null);
            setQIndex(nextIndex);
            setCurrentTurn((prev) => (prev === 1 ? 2 : 1));
          }, 4000);
          return;
        }

        setQIndex(nextIndex);
      } else {
        // If wrong, stay on same index so the question repeats in the player's next turn
      }
      setCurrentTurn((prev) => (prev === 1 ? 2 : 1));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden relative">
      <AnimatedBackground 
        topic={currentQuestion.topic} 
        questionText={currentQuestion.question}
        emojis={currentQuestion.emojis}
      />
      <AnimatePresence>
        {levelTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center p-12 bg-white rounded-[3rem] shadow-2xl border-8 border-white/20 max-w-lg mx-4"
            >
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
              <h2 className="text-4xl font-display font-black text-slate-800 mb-4 uppercase tracking-tight">
                ¡{levelTransition.playerName}, has pasado al Nivel{" "}
                {levelTransition.to}!
              </h2>
              <div className="h-2 w-24 bg-primary/20 mx-auto rounded-full mb-6" />
              <p className="text-2xl font-bold text-primary mb-2">
                ¡Nivel {levelTransition.from} Completado!
              </p>
              <p className="text-xl text-slate-500 font-medium">
                ¡Prepárate! Las preguntas serán cada vez más difíciles...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <header className="bg-white/95 backdrop-blur-sm border-b-2 border-slate-100 p-6 md:px-12 shadow-sm relative z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div
            className={`flex items-center gap-6 transition-opacity duration-300 ${!isP1Turn ? "opacity-50 grayscale" : "scale-105"}`}
          >
            <Avatar
              id={p1.charId}
              size="lg"
              className="ring-6 ring-primary/20"
            />
            <div>
              <div className="font-display font-bold text-2xl text-foreground">
                {p1.name}
              </div>
              <div className="flex items-center gap-2 text-primary font-bold text-2xl">
                <Trophy className="w-6 h-6 fill-current" />{" "}
                {(p1.score ?? 0).toString()}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-slate-100 px-6 py-2 rounded-full text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Nivel {currentQuestion.level}
            </div>
            <div className="text-3xl font-display font-black text-slate-300">
              VS
            </div>
          </div>

          <div
            className={`flex items-center gap-6 flex-row-reverse text-right transition-opacity duration-300 ${isP1Turn ? "opacity-50 grayscale" : "scale-105"}`}
          >
            <Avatar
              id={p2.charId}
              size="lg"
              className="ring-6 ring-secondary/20"
            />
            <div>
              <div className="font-display font-bold text-2xl text-foreground">
                {p2.name}
              </div>
              <div className="flex items-center gap-2 justify-end text-secondary font-bold text-2xl">
                {(p2.score ?? 0).toString()}{" "}
                <Trophy className="w-6 h-6 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
        <div className="w-full max-w-3xl relative">
          <div className="mb-8 space-y-4 text-center">
            <motion.div
              key={currentTurn}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "inline-block px-8 py-3 rounded-2xl font-display font-black text-2xl uppercase tracking-widest border-4 shadow-lg",
                isP1Turn
                  ? "bg-primary text-white border-primary/20"
                  : "bg-secondary text-white border-secondary/20",
              )}
            >
              Turno de {currentPlayer.name}
            </motion.div>

            <ProgressBar
              current={currentQIndex + 1}
              total={currentPlayerQuestions.length}
              label={`Pregunta ${currentQIndex + 1}`}
              color={isP1Turn ? "bg-primary" : "bg-secondary"}
            />
          </div>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
              >
                <div
                  className={cn(
                    "p-8 rounded-3xl shadow-2xl border-4 transform rotate-[-5deg]",
                    showFeedback === "correct" &&
                      "bg-green-100 border-green-500 text-green-700",
                    showFeedback === "wrong" &&
                      "bg-red-100 border-red-500 text-red-700",
                    showFeedback === "bonus" &&
                      "bg-yellow-100 border-yellow-500 text-yellow-700",
                    showFeedback === "penalty" &&
                      "bg-orange-100 border-orange-500 text-orange-700",
                  )}
                >
                  <h2 className="text-5xl font-display font-black text-center mb-2">
                    {showFeedback === "correct" && "¡Genial!"}
                    {showFeedback === "wrong" && "¡Uy!"}
                    {showFeedback === "bonus" && "¡BONO!"}
                    {showFeedback === "penalty" && "¡PENALIZACIÓN!"}
                  </h2>
                  <p className="text-xl font-bold text-center opacity-90">
                    {showFeedback === "correct" && "+1 Punto"}
                    {showFeedback === "wrong" && "Intenta la siguiente"}
                    {showFeedback === "bonus" && "+1 Punto Extra"}
                    {showFeedback === "penalty" && "-1 Punto de Penalización"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={`${currentTurn}-${currentQIndex}`}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border-b-8 border-slate-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-6 py-2 rounded-bl-3xl font-bold text-sm">
              {currentQuestion.topic}
            </div>

            <h3 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10 leading-tight">
              {currentQuestion.question}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, idx) => (
                <GameButton
                  key={idx}
                  variant="neutral"
                  size="lg"
                  className="w-full text-left justify-start hover:border-primary/50 hover:bg-blue-50/50"
                  onClick={() => !showFeedback && handleAnswer(idx)}
                  disabled={!!showFeedback}
                >
                  <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mr-3 text-sm font-bold group-hover:bg-white group-hover:text-primary transition-colors">
                    {String(String.fromCharCode(65 + idx))}
                  </span>
                  {option}
                </GameButton>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
