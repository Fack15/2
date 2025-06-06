import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand"),
  netVolume: text("net_volume"),
  vintage: text("vintage"),
  type: text("type"),
  sugarContent: text("sugar_content"),
  appellation: text("appellation"),
  alcoholContent: text("alcohol_content"),
  country: text("country"),
  sku: text("sku").unique(),
  ean: text("ean"),
  ingredients: text("ingredients"),
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
  externalShortLink: text("external_short_link"),
  redirectLink: text("redirect_link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Ingredient = typeof ingredients.$inferSelect;
