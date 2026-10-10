import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  cost: integer("cost").notNull().default(0),
  isPremium: boolean("is_premium").default(false),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>().notNull(), // Array of 4 options
  correctAnswer: integer("correct_answer").notNull(), // Index of correct option (0-3)
  topic: text("topic").notNull(), // e.g., Math, Science, History
  level: integer("level").notNull(), // 1, 2, or 3
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  points: integer("points").default(0),
  unlockedCharacters: jsonb("unlocked_characters").$type<number[]>().default([1, 2]), // Array of character IDs
});

// === SCHEMAS ===

export const insertCharacterSchema = createInsertSchema(characters);
export const insertQuestionSchema = createInsertSchema(questions);
export const insertUserSchema = createInsertSchema(users).omit({ id: true, points: true, unlockedCharacters: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Character = typeof characters.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type User = typeof users.$inferSelect;

export type CreateUserRequest = z.infer<typeof insertUserSchema>;

export type InsertUser = CreateUserRequest; // Added for compatibility with hooks

// Update points request
export type UpdatePointsRequest = {
  points: number;
};

// Unlock character request
export type UnlockCharacterRequest = {
  characterId: number;
};

// Response types
export type UserResponse = User;
export type CharacterResponse = Character;
export type QuestionResponse = Question;
