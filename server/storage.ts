import {
  type User,
  type Character,
  type Question,
  type CreateUserRequest,
} from "@shared/schema";
import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const CHARACTERS_FILE = path.join(DATA_DIR, "characters.json");
const QUESTIONS_FILE = path.join(DATA_DIR, "questions.json");

export interface IStorage {
  // Users
  getUser(username: string): Promise<User | undefined>;
  createUser(user: CreateUserRequest): Promise<User>;
  updateUserPoints(username: string, points: number): Promise<User>;
  unlockCharacter(username: string, characterId: number): Promise<User>;

  // Characters
  getCharacters(): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: Omit<Character, "id">): Promise<Character>;

  // Questions
  getQuestions(): Promise<Question[]>;
  createQuestion(question: Omit<Question, "id">): Promise<Question>;
}

export class JSONStorage implements IStorage {
  private users: User[] = [];
  private characters: Character[] = [];
  private questions: Question[] = [];

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR);
    }
    this.loadData();
  }

  private loadData() {
    if (fs.existsSync(USERS_FILE)) {
      this.users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    }
    if (fs.existsSync(CHARACTERS_FILE)) {
      this.characters = JSON.parse(fs.readFileSync(CHARACTERS_FILE, "utf-8"));
    }
    if (fs.existsSync(QUESTIONS_FILE)) {
      this.questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, "utf-8"));
    }
  }

  private saveData(file: string, data: any) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }

  // --- Users ---
  async getUser(username: string): Promise<User | undefined> {
    return this.users.find((u) => u.username === username);
  }

  async createUser(insertUser: CreateUserRequest): Promise<User> {
    const newUser: User = {
      id: this.users.length + 1,
      username: insertUser.username,
      points: 0,
      unlockedCharacters: [28, 29, 30, 31, 32],
    };
    this.users.push(newUser);
    this.saveData(USERS_FILE, this.users);
    return newUser;
  }

  async updateUserPoints(username: string, points: number): Promise<User> {
    const userIndex = this.users.findIndex((u) => u.username === username);
    if (userIndex === -1) throw new Error("User not found");
    this.users[userIndex].points = points;
    this.saveData(USERS_FILE, this.users);
    return this.users[userIndex];
  }

  async unlockCharacter(username: string, characterId: number): Promise<User> {
    const userIndex = this.users.findIndex((u) => u.username === username);
    if (userIndex === -1) throw new Error("User not found");
    
    const unlocked = this.users[userIndex].unlockedCharacters || [];
    if (!unlocked.includes(characterId)) {
      unlocked.push(characterId);
      this.users[userIndex].unlockedCharacters = unlocked;
      this.saveData(USERS_FILE, this.users);
    }
    return this.users[userIndex];
  }

  // --- Characters ---
  async getCharacters(): Promise<Character[]> {
    return [...this.characters].sort((a, b) => (a.cost || 0) - (b.cost || 0));
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.find((c) => c.id === id);
  }

  async createCharacter(character: Omit<Character, "id">): Promise<Character> {
    const newCharacter: Character = {
      id: this.characters.length + 1,
      ...character,
    };
    this.characters.push(newCharacter);
    this.saveData(CHARACTERS_FILE, this.characters);
    return newCharacter;
  }

  // --- Questions ---
  async getQuestions(): Promise<Question[]> {
    return this.questions;
  }

  async createQuestion(question: Omit<Question, "id">): Promise<Question> {
    const newQuestion: Question = {
      id: this.questions.length + 1,
      ...question,
    };
    this.questions.push(newQuestion);
    this.saveData(QUESTIONS_FILE, this.questions);
    return newQuestion;
  }
}

export const storage = new JSONStorage();
