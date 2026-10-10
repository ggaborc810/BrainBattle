import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import CharacterSelect from "@/pages/CharacterSelect";
import Game from "@/pages/Game";
import Store from "@/pages/Store";
import Winner from "@/pages/Winner";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/select" component={CharacterSelect} />
      <Route path="/game" component={Game} />
      <Route path="/store" component={Store} />
      <Route path="/winner" component={Winner} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
