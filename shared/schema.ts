import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Use Supabase auth.users table instead of custom users table
// This references the built-in Supabase auth system
export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey(), // References auth.users.id
  username: varchar("username", { length: 50 }).unique(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand"),
  netVolume: text("net_volume"),
  vintage: text("vintage"),
  wineType: text("wine_type"),
  sugarContent: text("sugar_content"),
  appellation: text("appellation"),
  alcoholContent: text("alcohol_content"),
  packagingGases: text("packaging_gases"),
  portionSize: text("portion_size"),
  kcal: text("kcal"),
  kj: text("kj"),
  fat: text("fat"),
  carbohydrates: text("carbohydrates"),
  organic: boolean("organic").default(false),
  vegetarian: boolean("vegetarian").default(false),
  vegan: boolean("vegan").default(false),
  operatorType: text("operator_type"),
  operatorName: text("operator_name"),
  operatorAddress: text("operator_address"),
  operatorInfo: text("operator_info"),
  countryOfOrigin: text("country_of_origin"),
  sku: text("sku"),
  ean: text("ean"),
  externalLink: text("external_link"),
  redirectLink: text("redirect_link"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by"),
});

export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"),
  eNumber: text("e_number"),
  allergens: text("allergens").array(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by"),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  brand: z.string().optional().or(z.literal('')),
  netVolume: z.string().optional().or(z.literal('')),
  vintage: z.string().optional().or(z.literal('')),
  wineType: z.string().optional().or(z.literal('')),
  sugarContent: z.string().optional().or(z.literal('')),
  appellation: z.string().optional().or(z.literal('')),
  alcoholContent: z.string().optional().or(z.literal('')),
  packagingGases: z.string().optional().or(z.literal('')),
  portionSize: z.string().optional().or(z.literal('')),
  kcal: z.string().optional().or(z.literal('')),
  kj: z.string().optional().or(z.literal('')),
  fat: z.string().optional().or(z.literal('')),
  carbohydrates: z.string().optional().or(z.literal('')),
  operatorType: z.string().optional().or(z.literal('')),
  operatorName: z.string().optional().or(z.literal('')),
  operatorAddress: z.string().optional().or(z.literal('')),
  operatorInfo: z.string().optional().or(z.literal('')),
  countryOfOrigin: z.string().optional().or(z.literal('')),
  sku: z.string().optional().or(z.literal('')),
  ean: z.string().optional().or(z.literal('')),
  externalLink: z.string().optional().or(z.literal('')),
  redirectLink: z.string().optional().or(z.literal('')),
  imageUrl: z.string().optional().or(z.literal('')),
  organic: z.boolean().default(false),
  vegetarian: z.boolean().default(false),
  vegan: z.boolean().default(false),
  createdBy: z.number().optional().default(0),
});

export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Ingredient = typeof ingredients.$inferSelect;
