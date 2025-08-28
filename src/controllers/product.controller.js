import express from "express";
import { pool } from "../server/connection_db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM products  ORDER BY id_product`
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
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT *FROM products WHERE id_product=? ORDER BY id_product `,
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

router.post("/", async (req, res) => {
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

    const query = `INSERT INTO products(product_name,price,category,id_store,sold_out) VALUES (?,?,?,?,?)`;
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

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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

export default router;
