import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCustomerSchema, insertOrderSchema, ADMIN_CREDENTIALS } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب المنتجات" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "بيانات غير صحيحة" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.updateProduct(id, req.body);
      if (!product) {
        return res.status(404).json({ message: "المنتج غير موجود" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "خطأ في تحديث المنتج" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "المنتج غير موجود" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "خطأ في حذف المنتج" });
    }
  });

  // Customer Authentication
  app.post("/api/auth/customer/register", async (req, res) => {
    try {
      const data = insertCustomerSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getCustomerByEmail(data.email);
      if (existing) {
        return res.status(400).json({ message: "البريد الإلكتروني مسجل بالفعل" });
      }

      const customer = await storage.createCustomer(data);
      
      // Don't send password back
      const { password, ...customerData } = customer;
      res.json(customerData);
    } catch (error) {
      res.status(400).json({ message: "بيانات غير صحيحة" });
    }
  });

  app.post("/api/auth/customer/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const customer = await storage.getCustomerByEmail(email);
      if (!customer) {
        return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      }

      if (customer.password !== password) {
        return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      }

      // Don't send password back
      const { password: _, ...customerData } = customer;
      res.json(customerData);
    } catch (error) {
      res.status(500).json({ message: "خطأ في تسجيل الدخول" });
    }
  });

  // Orders API
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب الطلبات" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const data = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(data);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "بيانات غير صحيحة" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "الحالة مطلوبة" });
      }

      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "الطلب غير موجود" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "خطأ في تحديث الطلب" });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteOrder(id);
      if (!deleted) {
        return res.status(404).json({ message: "الطلب غير موجود" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "خطأ في حذف الطلب" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
