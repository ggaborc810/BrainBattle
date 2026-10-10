import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"
import { useCharacters } from "@/hooks/use-game-api"
import { User } from "lucide-react"

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  id?: string | number;
  size?: "sm" | "md" | "lg" | "xl";
  locked?: boolean;
}

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, id, size = "md", locked, ...props }, ref) => {
    const { data: characters } = useCharacters();
    
    // Convert to number correctly
    const characterId = id !== undefined ? Number(id) : NaN;
    const character = characters?.find(c => c.id === characterId);
    
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-12 w-12",
      lg: "h-20 w-20",
      xl: "h-32 w-32"
    };

    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-white items-center justify-center",
          sizeClasses[size],
          locked && "opacity-50 grayscale",
          className
        )}
        {...props}
      >
        {character?.imageUrl ? (
          <img 
            src={character.imageUrl} 
            alt={character.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className={cn("w-1/2 h-1/2", locked ? "text-slate-400" : "text-primary")} />
        )}
      </AvatarPrimitive.Root>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
