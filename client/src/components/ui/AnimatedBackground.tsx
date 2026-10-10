import { motion } from "framer-motion";
import { useMemo } from "react";

interface AnimatedBackgroundProps {
  topic: string;
  questionText: string;
  emojis?: string[];
}

const topicEmojis: Record<string, string[]> = {
  Naturaleza: ["🦅", "🐿️", "🦔", "🐻", "🦩", "🦜", "🐠", "🐙", "🦈", "🐊", "🦎", "🐸", "🌲", "🌳", "🌴", "🌺", "🌻", "🦋", "🐝", "🦗"],
  "Medio Ambiente": ["🌍", "🌱", "♻️", "🌊", "🌲", "☀️", "💧", "🍃", "🌿", "🏞️", "🌈", "💨", "🔋", "🚲", "🌻"],
  Ciencia: ["🔬", "🧪", "⚗️", "🌡️", "☀️", "🧬", "⚛️", "🔭", "🌍", "🌙", "⭐"],
  "Arte y Literatura e Historia": ["📚", "🎨", "📜", "🎭", "🎻", "🏛️", "🖋️", "📖", "⛵", "🌍"],
};

const questionKeywords: Record<string, string[]> = {
  avestruz: ["🦤", "🏃", "💨", "🌴", "🏜️", "🐣", "🥚", "🌾"],
  perla: ["🦪", "💎", "✨", "🌊", "🐚", "💍", "🌟"],
  ostra: ["🦪", "💎", "✨", "🌊", "🐚", "🐟", "🌟"],
  nácar: ["🦪", "💎", "✨", "🌊", "🐚", "💍", "🌟"],
  araña: ["🕷️", "🕸️", "🐛", "🦗", "🪲", "🌿", "🍂"],
  arácnido: ["🕷️", "🕸️", "🐛", "🦗", "🪲", "🌿", "🍂"],
  delfín: ["🐬", "🌊", "💦", "🐟", "🦈", "🐋", "🌅", "⚓"],
  mamífero: ["🐬", "🐋", "🦭", "🐳", "🌊", "🐟", "💙"],
  gallo: ["🐓", "🌅", "☀️", "🌄", "🐔", "🌾", "🏡", "🎵"],
  nutria: ["🦦", "💎", "🪨", "🌊", "🐟", "🦐", "💙", "🌿"],
  piedra: ["🦦", "💎", "🪨", "✨", "🌊", "🐚"],
  rata: ["🐀", "🐭", "🧀", "😂", "🎉", "😄", "🐾"],
  ratón: ["🐀", "🐭", "🧀", "😂", "🎉", "😄", "🐾"],
  cosquillas: ["🐭", "😂", "🎉", "😄", "🤣", "💕"],
  rana: ["🐸", "🌿", "💧", "🪷", "🦎", "🌺", "🍃", "💚"],
  piel: ["🐸", "🌿", "💧", "🪷", "🍃", "💚"],
  océano: ["🌊", "🐠", "🐙", "🦈", "🐚", "🐋", "🦑", "🐡", "🌅"],
  planta: ["🌱", "🌿", "🌺", "🌻", "🌳", "☀️", "💧", "🍃"],
  luz: ["☀️", "💡", "✨", "🌅", "🌊", "🌱"],
  sol: ["☀️", "🌞", "😎", "🏖️", "🌴", "🧴", "🌅"],
  crema: ["☀️", "🧴", "🏖️", "😎", "🌴", "🌊", "👙"],
  ultravioleta: ["☀️", "🧴", "🏖️", "😎", "🌴", "🌊", "🌞"],
  ave: ["🦅", "🐦", "🦜", "🦢", "🦩", "🐤", "🪶", "🌳"],
  pájaro: ["🦅", "🐦", "🦜", "🦢", "🦩", "🐤", "🪶", "🌳"],
  ornitóloga: ["🦅", "🐦", "🦜", "🦢", "🦩", "🐤", "📚", "🔬", "🪶"],
  agua: ["💧", "🌊", "🚿", "🌧️", "💦", "🐟", "🐋", "💙"],
  salada: ["🌊", "🧂", "🐟", "🦈", "🐋", "🌍", "💧"],
  papel: ["📄", "🌲", "🌳", "📰", "✂️", "📚", "🍃"],
  árbol: ["🌲", "🌳", "🌴", "🍂", "🍃", "🌿", "🐦", "🐿️"],
  antártida: ["🐧", "❄️", "🌨️", "🏔️", "🐻‍❄️", "🦭", "⛄", "🧊"],
  coche: ["🚗", "⛽", "🛣️", "💨", "🚙", "🌍", "🌱"],
  combustible: ["⛽", "🚗", "🛢️", "💨", "🌍", "🌱", "♻️"],
  velocidad: ["🚗", "💨", "🛣️", "⚡", "🏎️", "🌍"],
  kioto: ["🌍", "🏛️", "🌱", "💨", "🌡️", "🤝", "♻️", "🌿"],
  protocolo: ["🌍", "🏛️", "🌱", "💨", "🌡️", "🤝", "♻️"],
  gases: ["💨", "🌡️", "🌍", "🏭", "♻️", "🌱", "🌿"],
  ecologista: ["🌍", "🌱", "♻️", "🌿", "🦋", "💚", "🌳", "🐝"],
  naturaleza: ["🌲", "🌳", "🦋", "🐦", "🌺", "🌿", "💚", "🏞️"],
  bolsa: ["🛍️", "♻️", "🌍", "🌱", "🌿", "💚", "🌊"],
  reutilizable: ["♻️", "🌍", "🌱", "💚", "🌿", "🛍️"],
  grifo: ["🚿", "💧", "🦷", "💦", "🪥", "🌊", "♻️"],
  dientes: ["🦷", "🪥", "💧", "🚿", "😁", "✨"],
  extinción: ["🐻‍❄️", "🦏", "🐘", "🌍", "❤️", "🦁", "🐯", "💔"],
  oso: ["🐻", "🐻‍❄️", "❄️", "🏔️", "🌨️", "🐟", "🦭"],
  polar: ["🐻‍❄️", "❄️", "🌨️", "🏔️", "🐧", "⛄", "🧊", "🦭"],
  tigre: ["🐯", "🦁", "🌿", "💀", "🦴", "🏛️"],
  peligro: ["🐻‍❄️", "🦏", "🐘", "❤️", "🌍", "💔", "🐯"],
};

function getEmojisForQuestion(topic: string, questionText: string, providedEmojis?: string[]): string[] {
  if (providedEmojis && providedEmojis.length > 0) {
    return providedEmojis;
  }
  
  const lowerQuestion = questionText.toLowerCase();
  
  for (const [keyword, emojis] of Object.entries(questionKeywords)) {
    if (lowerQuestion.includes(keyword)) {
      return emojis;
    }
  }
  
  return topicEmojis[topic] || topicEmojis["Naturaleza"];
}

interface FloatingElement {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  direction: "up" | "down" | "left" | "right" | "diagonal" | "wave";
}

export function AnimatedBackground({ topic, questionText, emojis: providedEmojis }: AnimatedBackgroundProps) {
  const emojis = getEmojisForQuestion(topic, questionText, providedEmojis);
  
  const floatingElements = useMemo(() => {
    const elements: FloatingElement[] = [];
    const directions: FloatingElement["direction"][] = ["up", "down", "left", "right", "diagonal", "wave"];
    
    const cornerPositions = [
      { x: 8, y: 15 },
      { x: 88, y: 15 },
      { x: 8, y: 35 },
      { x: 88, y: 35 },
      { x: 8, y: 55 },
      { x: 88, y: 55 },
      { x: 15, y: 80 },
      { x: 85, y: 80 },
      { x: 30, y: 85 },
      { x: 50, y: 85 },
      { x: 70, y: 85 },
    ];
    
    for (let i = 0; i < cornerPositions.length; i++) {
      const pos = cornerPositions[i];
      elements.push({
        id: i,
        emoji: emojis[i % emojis.length],
        x: pos.x + (Math.random() * 4 - 2),
        y: pos.y + (Math.random() * 4 - 2),
        size: 50 + Math.random() * 40,
        duration: 5 + Math.random() * 5,
        delay: Math.random() * 2,
        direction: directions[Math.floor(Math.random() * directions.length)],
      });
    }
    return elements;
  }, [emojis]);

  const getAnimationVariants = (element: FloatingElement) => {
    const movement = 80;
    
    switch (element.direction) {
      case "up":
        return {
          y: [0, -movement, 0],
          rotate: [-8, 8, -8],
        };
      case "down":
        return {
          y: [0, movement, 0],
          rotate: [8, -8, 8],
        };
      case "left":
        return {
          x: [0, -movement, 0],
          rotate: [-12, 12, -12],
        };
      case "right":
        return {
          x: [0, movement, 0],
          rotate: [12, -12, 12],
        };
      case "diagonal":
        return {
          x: [0, movement * 0.7, 0],
          y: [0, -movement * 0.7, 0],
          rotate: [-15, 15, -15],
        };
      case "wave":
        return {
          x: [0, movement * 0.5, 0, -movement * 0.5, 0],
          y: [0, -movement * 0.3, 0, movement * 0.3, 0],
          rotate: [-10, 10, -10, 10, -10],
        };
      default:
        return {
          y: [0, -movement, 0],
        };
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 via-blue-50/30 to-yellow-50/40" />
      
      {floatingElements.map((element) => (
        <motion.div
          key={`${element.id}-${questionText.substring(0, 20)}`}
          className="absolute select-none flex items-center justify-center"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size * 1.4,
            height: element.size * 1.4,
            fontSize: element.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            ...getAnimationVariants(element),
          }}
          transition={{
            opacity: { duration: 0.6, delay: element.delay * 0.15 },
            scale: { duration: 0.6, delay: element.delay * 0.15, type: "spring", bounce: 0.5 },
            x: {
              duration: element.duration,
              repeat: Infinity,
              ease: "easeInOut",
            },
            y: {
              duration: element.duration,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: element.duration * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {element.emoji}
        </motion.div>
      ))}

      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 3 + Math.random() * 4,
              height: 3 + Math.random() * 4,
              background: `linear-gradient(135deg, ${
                ['#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa'][Math.floor(Math.random() * 5)]
              }, transparent)`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>
    </div>
  );
}
