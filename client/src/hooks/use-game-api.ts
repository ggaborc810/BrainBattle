import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertUser } from "@shared/schema";
import { z } from "zod";

// --- Users ---

export function useUser(username: string) {
  return useQuery({
    queryKey: [api.users.get.path, username],
    queryFn: async () => {
      if (!username) return null;
      const url = buildUrl(api.users.get.path, { username });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.users.get.responses[200].parse(await res.json());
    },
    enabled: !!username,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await fetch(api.users.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = await res.json();
          throw new Error(err.message || "Validation failed");
        }
        throw new Error("Failed to create user");
      }
      // Can be 200 or 201
      return api.users.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.users.get.path, data.username], data);
    },
  });
}

export function useUpdatePoints() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ username, points }: { username: string; points: number }) => {
      const url = buildUrl(api.users.updatePoints.path, { username });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update points");
      return api.users.updatePoints.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.users.get.path, data.username] });
    },
  });
}

export function useUnlockCharacter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ username, characterId }: { username: string; characterId: number }) => {
      const url = buildUrl(api.users.unlockCharacter.path, { username });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId }),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = await res.json();
          throw new Error(err.message);
        }
        throw new Error("Failed to unlock character");
      }
      return api.users.unlockCharacter.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.users.get.path, data.username] });
    },
  });
}

// --- Characters ---

export function useCharacters() {
  return useQuery({
    queryKey: [api.characters.list.path],
    queryFn: async () => {
      const res = await fetch(api.characters.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch characters");
      return api.characters.list.responses[200].parse(await res.json());
    },
  });
}

// --- Questions ---

export function useQuestions() {
  return useQuery({
    queryKey: [api.questions.list.path],
    queryFn: async () => {
      const res = await fetch(api.questions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch questions");
      return api.questions.list.responses[200].parse(await res.json());
    },
  });
}
