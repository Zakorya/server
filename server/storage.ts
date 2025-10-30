import {
  type Product,
  type InsertProduct,
  type Customer,
  type InsertCustomer,
  type Order,
  type InsertOrder,
} from "'../shared/schema";
import { randomUUID } from "crypto";

// Image paths for sample products
const oliveOilImage = '/attached_assets/generated_images/Olive_oil_product_photo_9503efe9.png';
const honeyImage = '/attached_assets/generated_images/Honey_jar_product_photo_c0eea4a7.png';
const labnehImage = '/attached_assets/generated_images/Labneh_dairy_product_photo_a7c0fc00.png';

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private customers: Map<string, Customer>;
  private orders: Map<string, Order>;

  constructor() {
    this.products = new Map();
    this.customers = new Map();
    this.orders = new Map();
    
    // Add sample products
    this.initializeSampleProducts();
  }

  private async initializeSampleProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        title: 'زيت زيتون بكر ممتاز',
        price: 25.50,
        category: 'زيوت',
        image: oliveOilImage,
        description: 'زيت زيتون بكر ممتاز من أفضل المزارع، مثالي للسلطات والطبخ',
      },
      {
        title: 'عسل طبيعي صافي',
        price: 18.00,
        category: 'مربيات وعسل',
        image: honeyImage,
        description: 'عسل طبيعي 100% من المناحل المحلية، غني بالفوائد الصحية',
      },
      {
        title: 'لبنة منزلية طازجة',
        price: 6.75,
        category: 'ألبان',
        image: labnehImage,
        description: 'لبنة طازجة يومياً من الحليب الطازج، طعم أصيل ولذيذ',
      },
    ];

    for (const product of sampleProducts) {
      await this.createProduct(product);
    }
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updated = { ...product, ...updates, id, createdAt: product.createdAt };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(
      (customer) => customer.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = {
      ...insertCustomer,
      id,
      createdAt: new Date(),
    };
    this.customers.set(id, customer);
    return customer;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
      deliveredAt: null,
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updated: Order = {
      ...order,
      status,
      deliveredAt: status === 'تم التوصيل' ? new Date() : order.deliveredAt,
    };
    this.orders.set(id, updated);
    return updated;
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.orders.delete(id);
  }
}

export const storage = new MemStorage();
