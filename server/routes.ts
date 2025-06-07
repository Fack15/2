import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertProductSchema,
  insertIngredientSchema,
  loginSchema,
  registerSchema,
} from "@shared/schema";
import { AuthService } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage_multer = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_multer,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Configure multer for Excel file uploads
const uploadExcel = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Not an Excel file! Please upload only Excel or CSV files.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));

  // Configuration endpoint
  app.get("/api/config", (req, res) => {
    res.json({
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    });
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = registerSchema.safeParse(req.body);
      // if (!result.success) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Invalid input data",
      //     errors: result.error.errors,
      //   });
      // }

      const { username, email, password } = req.body;
      const authResult = await AuthService.register(username, email, password);

      if (authResult.success) {
        res.status(201).json(authResult);
      } else {
        res.status(400).json(authResult);
      }
    } catch (error) {
      console.error("Registration route error:", error);
      res.status(500).json({ success: false, message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      // if (!result.success) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Invalid input data",
      //     errors: result.error.errors,
      //   });
      // }

      const { email, password } = req.body
      const authResult = await AuthService.login(email, password);

      if (authResult.success) {
        res.json(authResult);
      } else {
        res.status(401).json(authResult);
      }
    } catch (error) {
      console.error("Login route error:", error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  app.get("/api/auth/confirm-email", async (req, res) => {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res
          .status(400)
          .json({ success: false, message: "Token is required" });
      }

      const authResult = await AuthService.confirmEmail(token);

      if (authResult.success) {
        // Redirect to login page with success message
        res.redirect("/?emailConfirmed=true");
      } else {
        res.redirect(
          "/?emailConfirmed=false&error=" +
            encodeURIComponent(
              authResult.message || "Email confirmation failed",
            ),
        );
      }
    } catch (error) {
      console.error("Email confirmation route error:", error);
      res.redirect("/?emailConfirmed=false&error=confirmation_failed");
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data", details: error });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data", details: error });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Image upload routes
  app.post("/api/products/:id/image", upload.single('image'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      
      // Update product with new image URL
      const updatedProduct = await storage.updateProduct(id, { imageUrl });
      
      if (!updatedProduct) {
        return res.status(500).json({ error: "Failed to update product" });
      }

      res.json({ imageUrl, message: "Image uploaded successfully" });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.delete("/api/products/:id/image", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (product.imageUrl) {
        // Delete the image file from disk
        const imagePath = path.join(process.cwd(), product.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Remove image URL from product
      const updatedProduct = await storage.updateProduct(id, { imageUrl: null });
      
      if (!updatedProduct) {
        return res.status(500).json({ error: "Failed to update product" });
      }

      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Image delete error:", error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  });

  // Ingredients routes
  app.get("/api/ingredients", async (req, res) => {
    try {
      const ingredients = await storage.getIngredients();
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ingredients" });
    }
  });

  app.get("/api/ingredients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ingredient = await storage.getIngredient(id);
      if (!ingredient) {
        return res.status(404).json({ error: "Ingredient not found" });
      }
      res.json(ingredient);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ingredient" });
    }
  });

  app.post("/api/ingredients", async (req, res) => {
    try {
      const validatedData = insertIngredientSchema.parse(req.body);
      const ingredient = await storage.createIngredient(validatedData);
      res.status(201).json(ingredient);
    } catch (error) {
      res
        .status(400)
        .json({ error: "Invalid ingredient data", details: error });
    }
  });

  app.put("/api/ingredients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertIngredientSchema.partial().parse(req.body);
      const ingredient = await storage.updateIngredient(id, validatedData);
      if (!ingredient) {
        return res.status(404).json({ error: "Ingredient not found" });
      }
      res.json(ingredient);
    } catch (error) {
      res
        .status(400)
        .json({ error: "Invalid ingredient data", details: error });
    }
  });

  app.delete("/api/ingredients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteIngredient(id);
      if (!success) {
        return res.status(404).json({ error: "Ingredient not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete ingredient" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
