import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- Users ---
  app.get(api.users.get.path, async (req, res) => {
    const user = await storage.getUser(req.params.username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  app.post(api.users.create.path, async (req, res) => {
    try {
      const input = api.users.create.input.parse(req.body);
      const existing = await storage.getUser(input.username);
      if (existing) {
        return res.status(200).json(existing);
      }
      const user = await storage.createUser(input);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.users.updatePoints.path, async (req, res) => {
    try {
      const { points } = req.body; 
      const user = await storage.getUser(req.params.username);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const newPoints = (user.points || 0) + points;
      const updatedUser = await storage.updateUserPoints(req.params.username, newPoints);
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.users.unlockCharacter.path, async (req, res) => {
    try {
      const { characterId } = api.users.unlockCharacter.input.parse(req.body);
      const user = await storage.getUser(req.params.username);
      if (!user) return res.status(404).json({ message: "User not found" });

      const character = await storage.getCharacter(characterId);
      if (!character) return res.status(404).json({ message: "Character not found" });

      if (user.unlockedCharacters?.includes(characterId)) {
        return res.status(400).json({ message: "Already unlocked" });
      }

      if ((user.points || 0) < character.cost) {
        return res.status(400).json({ message: "Not enough points" });
      }

      // Deduct points and unlock
      const newPoints = (user.points || 0) - character.cost;
      await storage.updateUserPoints(user.username, newPoints);
      const updatedUser = await storage.unlockCharacter(user.username, characterId);
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // --- Characters ---
  app.get(api.characters.list.path, async (req, res) => {
    const characters = await storage.getCharacters();
    res.json(characters);
  });

  // --- Questions ---
  app.get(api.questions.list.path, async (req, res) => {
    const questions = await storage.getQuestions();
    // Shuffle all questions to provide randomization
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    res.json(shuffled);
  });

  // --- Seed Data ---
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const characters = await storage.getCharacters();
  if (characters.length === 0) {
    console.log("Seeding characters...");
    await storage.createCharacter({ name: "Rookie Red", imageUrl: "user", cost: 0, isPremium: false });
    await storage.createCharacter({ name: "Blue Buddy", imageUrl: "smile", cost: 0, isPremium: false });
    await storage.createCharacter({ name: "Green Genius", imageUrl: "zap", cost: 10, isPremium: false });
    await storage.createCharacter({ name: "Purple Pro", imageUrl: "star", cost: 20, isPremium: false });
    await storage.createCharacter({ name: "Golden Guru", imageUrl: "crown", cost: 50, isPremium: true });
    await storage.createCharacter({ name: "Ninja Master", imageUrl: "sword", cost: 100, isPremium: true });
  }

  const questions = await storage.getQuestions();
  if (questions.length === 0) {
    console.log("Seeding questions...");
    // Level 1
    await storage.createQuestion({
      question: "What color is the sky on a clear day?",
      options: ["Red", "Blue", "Green", "Yellow"],
      correctAnswer: 1,
      topic: "General",
      level: 1
    });
    await storage.createQuestion({
      question: "Which animal says 'Moo'?",
      options: ["Cat", "Dog", "Cow", "Sheep"],
      correctAnswer: 2,
      topic: "Animals",
      level: 1
    });
    await storage.createQuestion({
      question: "2 + 2 = ?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1,
      topic: "Math",
      level: 1
    });
    await storage.createQuestion({
      question: "What is the opposite of 'Hot'?",
      options: ["Cold", "Warm", "Spicy", "Cool"],
      correctAnswer: 0,
      topic: "General",
      level: 1
    });
    await storage.createQuestion({
      question: "How many legs does a spider have?",
      options: ["6", "8", "4", "10"],
      correctAnswer: 1,
      topic: "Animals",
      level: 1
    });

    // Level 2
    await storage.createQuestion({
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Venus", "Jupiter"],
      correctAnswer: 1,
      topic: "Science",
      level: 2
    });
    await storage.createQuestion({
      question: "5 x 6 = ?",
      options: ["30", "25", "35", "20"],
      correctAnswer: 0,
      topic: "Math",
      level: 2
    });
    await storage.createQuestion({
      question: "What comes after Monday?",
      options: ["Sunday", "Tuesday", "Wednesday", "Thursday"],
      correctAnswer: 1,
      topic: "General",
      level: 2
    });
    await storage.createQuestion({
      question: "Which is a fruit?",
      options: ["Carrot", "Broccoli", "Apple", "Potato"],
      correctAnswer: 2,
      topic: "Food",
      level: 2
    });
     await storage.createQuestion({
      question: "H2O is the chemical formula for?",
      options: ["Air", "Water", "Fire", "Earth"],
      correctAnswer: 1,
      topic: "Science",
      level: 2
    });

    // Level 3
    await storage.createQuestion({
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
      topic: "Geography",
      level: 3
    });
    await storage.createQuestion({
      question: "12 / 4 = ?",
      options: ["2", "3", "4", "6"],
      correctAnswer: 1,
      topic: "Math",
      level: 3
    });
    await storage.createQuestion({
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
      correctAnswer: 2,
      topic: "Art",
      level: 3
    });
    await storage.createQuestion({
      question: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2,
      topic: "Geography",
      level: 3
    });
     await storage.createQuestion({
      question: "What is the hardest natural substance?",
      options: ["Gold", "Iron", "Diamond", "Silver"],
      correctAnswer: 2,
      topic: "Science",
      level: 3
    });
  }
}
