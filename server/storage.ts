import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and } from 'drizzle-orm';
import { profiles, products, ingredients, type Profile, type InsertProfile, type Product, type InsertProduct, type Ingredient, type InsertIngredient } from "@shared/schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

export interface IStorage {
  // Profile methods
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByUsername(username: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | undefined>;
  
  // Product methods
  getProducts(userId: string): Promise<Product[]>;
  getProduct(id: number, userId: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct, userId: string): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>, userId: string): Promise<Product | undefined>;
  deleteProduct(id: number, userId: string): Promise<boolean>;
  
  // Ingredient methods
  getIngredients(userId: string): Promise<Ingredient[]>;
  getIngredient(id: number, userId: string): Promise<Ingredient | undefined>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;
  updateIngredient(id: number, ingredient: Partial<InsertIngredient>, userId: string): Promise<Ingredient | undefined>;
  deleteIngredient(id: number, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Profile methods
  async getProfile(id: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0];
  }

  async getProfileByUsername(username: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.username, username)).limit(1);
    return result[0];
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(insertProfile).returning();
    return result[0];
  }

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | undefined> {
    const result = await db.update(profiles).set(updates).where(eq(profiles.id, id)).returning();
    return result[0];
  }

  // Product methods
  async getProducts(userId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.createdBy, userId)).orderBy(products.name);
  }

  async getProduct(id: number, userId: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(and(eq(products.id, id), eq(products.createdBy, userId))).limit(1);
    return result[0];
  }

  async createProduct(product: InsertProduct, userId: string): Promise<Product> {
    const productWithUser = { ...product, createdBy: userId };
    const result = await db.insert(products).values(productWithUser).returning();
    return result[0];
  }

  async updateProduct(id: number, product: Partial<InsertProduct>, userId: string): Promise<Product | undefined> {
    const result = await db.update(products).set(product).where(and(eq(products.id, id), eq(products.createdBy, userId))).returning();
    return result[0];
  }

  async deleteProduct(id: number, userId: string): Promise<boolean> {
    const result = await db.delete(products).where(and(eq(products.id, id), eq(products.createdBy, userId))).returning();
    return result.length > 0;
  }

  // Ingredient methods
  async getIngredients(userId: string): Promise<Ingredient[]> {
    return await db.select().from(ingredients).where(eq(ingredients.createdBy, userId)).orderBy(ingredients.name);
  }

  async getIngredient(id: number, userId: string): Promise<Ingredient | undefined> {
    const result = await db.select().from(ingredients).where(and(eq(ingredients.id, id), eq(ingredients.createdBy, userId))).limit(1);
    return result[0];
  }

  async createIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const result = await db.insert(ingredients).values(ingredient).returning();
    return result[0];
  }

  async updateIngredient(id: number, ingredient: Partial<InsertIngredient>, userId: string): Promise<Ingredient | undefined> {
    const result = await db.update(ingredients).set(ingredient).where(and(eq(ingredients.id, id), eq(ingredients.createdBy, userId))).returning();
    return result[0];
  }

  async deleteIngredient(id: number, userId: string): Promise<boolean> {
    const result = await db.delete(ingredients).where(and(eq(ingredients.id, id), eq(ingredients.createdBy, userId))).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();