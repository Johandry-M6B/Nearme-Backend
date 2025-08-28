import express from "express";
import cors from "cors";
import { pool } from "./server/connection_db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "NearMe Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Product routes
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM products ORDER BY id_product`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM products WHERE id_product=? ORDER BY id_product`,
      [id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const {
      product_name,
      price,
      category,
      id_store,
      sold_out = false,
    } = req.body;

    // Validate required fields
    if (!product_name || !price || !category || !id_store) {
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: product_name, price, category, id_store",
      });
    }

    const query = `INSERT INTO products(product_name, price, category, id_store, sold_out) VALUES (?, ?, ?, ?, ?)`;
    const values = [
      product_name.toString().trim(),
      price,
      category.toString().trim(),
      id_store,
      sold_out,
    ];
    const [result] = await pool.query(query, values);
    res.status(201).json({
      message: "product created",
      id_product: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, price, category, id_store, sold_out } = req.body;

    // Validate required fields
    if (!product_name || !price || !category || !id_store) {
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: product_name, price, category, id_store",
      });
    }

    const query = `UPDATE products SET product_name=?, price=?, category=?, id_store=?, sold_out=? WHERE id_product=?`;
    const values = [
      product_name.toString().trim(),
      price,
      category.toString().trim(),
      id_store,
      sold_out,
      id,
    ];
    const [result] = await pool.query(query, values);

    if (result.affectedRows != 0) {
      return res.json({ mensaje: "product updated" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM products WHERE id_product=?`;
    const values = [id];
    const [result] = await pool.query(query, values);

    if (result.affectedRows !== 0) {
      return res.json({ message: "product deleted" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

// Store routes
app.get("/api/stores", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM stores`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.get("/api/stores/:nit", async (req, res) => {
  try {
    const { nit } = req.params;
    const [rows] = await pool.query(`SELECT * FROM stores WHERE nit_store=?`, [
      nit,
    ]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.post("/api/stores", async (req, res) => {
  try {
    const {
      nit_store,
      store_name,
      address,
      phone_number,
      email,
      id_store_type,
      opening_hours,
      closing_hours,
      note,
    } = req.body;
    const query = `INSERT INTO stores(nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note) VALUES (?,?,?,?,?,?,?,?,?)`;
    const values = [
      nit_store,
      store_name.trim(),
      address,
      phone_number,
      email,
      id_store_type,
      opening_hours,
      closing_hours,
      note.trim(),
    ];
    const [result] = await pool.query(query, values);
    res.status(201).json({
      message: "store created",
      id_product: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.put("/api/stores/:nit", async (req, res) => {
  try {
    const { nit } = req.params;
    const {
      nit_store: new_nit_store,
      store_name,
      address,
      phone_number,
      email,
      id_store_type,
      opening_hours,
      closing_hours,
      note,
    } = req.body;
    const query = `UPDATE stores SET nit_store=?,store_name=?,address=?,phone_number=?,email=?,id_store_type=?,opening_hours=?,closing_hours=?,note=? WHERE nit_store=?`;
    const values = [
      new_nit_store,
      store_name.trim(),
      address,
      phone_number,
      email,
      id_store_type,
      opening_hours,
      closing_hours,
      note.trim(),
      nit,
    ];
    const [result] = await pool.query(query, values);

    if (result.affectedRows != 0) {
      return res.json({ mensaje: "store updated" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.delete("/api/stores/:nit", async (req, res) => {
  try {
    const { nit } = req.params;
    const query = `DELETE FROM stores WHERE nit_store=?`;
    const values = [nit];
    const [result] = await pool.query(query, values);

    if (result.affectedRows !== 0) {
      return res.json({ message: "store deleted" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

// Store views endpoints
app.post("/api/stores/:nit/views", async (req, res) => {
  try {
    const { nit } = req.params;

    // Insert a new view record
    const insertQuery = `INSERT INTO store_views(id_store) VALUES (?)`;
    await pool.query(insertQuery, [nit]);

    // Get total views for this store
    const countQuery = `SELECT COUNT(*) AS total_views FROM store_views WHERE id_store = ?`;
    const [result] = await pool.query(countQuery, [nit]);

    res.json({
      store_nit: nit,
      total_views: result[0].total_views,
      message: "View recorded successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.get("/api/stores/:nit/views", async (req, res) => {
  try {
    const { nit } = req.params;

    // Get total views for this store
    const countQuery = `SELECT COUNT(*) AS total_views FROM store_views WHERE id_store = ?`;
    const [result] = await pool.query(countQuery, [nit]);

    res.json({
      store_nit: nit,
      total_views: result[0].total_views,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

// Get products by store with view count
app.get("/api/stores/:nit/products", async (req, res) => {
  try {
    const { nit } = req.params;

    // Get products for this store
    const productsQuery = `SELECT * FROM products WHERE id_store = ? ORDER BY id_product`;
    const [products] = await pool.query(productsQuery, [nit]);

    // Get store views
    const viewsQuery = `SELECT COUNT(*) AS total_views FROM store_views WHERE id_store = ?`;
    const [viewsResult] = await pool.query(viewsQuery, [nit]);

    res.json({
      store_nit: nit,
      total_views: viewsResult[0].total_views,
      products: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
    endpoint: req.originalUrl,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    endpoint: req.originalUrl,
    method: req.method,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NearMe Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🛍️ Products API: http://localhost:${PORT}/api/products`);
  console.log(`🏪 Stores API: http://localhost:${PORT}/api/stores`);
});

export default app;
