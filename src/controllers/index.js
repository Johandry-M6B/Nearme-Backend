import express from 'express';
import { pool } from '../server/connection_db.js';


const app= express();
app.use(express.json());



app.get('/stores',async (req,res)=>{
    try {
        const [rows]= await pool.query(`SELECT * FROM stores `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        })
    }
})

app.get('/products', async (req,res)=>{
    try {
        const [rows]= await pool.query(`SELECT * FROM products  ORDER BY id_product`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})
app.get('/products/:id_product',async (req,res)=>{
    try{
        const {id_product}= req.params
        const [rows]= await pool.query( `SELECT *FROM products WHERE id_product=? ORDER BY id_product `,[id_product]);
        res.json(rows[0]);
    }catch(error){
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.post('/products',async (req,res)=>{
    try{
        const {product_name,price,stock,category,id_store,product_description}=req.body; 
        const query= `INSERT INTO products(product_name,price,stock,category,id_store,product_description) VALUES (?,?,?,?,?,?)`;
        const values = [product_name.trim(),price,stock,category.trim(),id_store,product_description.trim()];
        const [result] = await pool.query(query,values);
        res.status(201).json({
            message: "product created",
            id_product: result.insertId,
        })
    }catch(error){
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.put('/products/:id_product', async (req,res)=>{
    try {
        const {id_product}= req.params;
        const{product_name,price,stock,category,id_store,product_description}=req.body;
        const query= `UPDATE products SET product_name=?, price=?, stock=?,category=?,id_store=?,product_description=? WHERE id_product=?`;
        const values=[product_name.trim(),price,stock,category.trim(),id_store,product_description.trim(),id_product];
        const [result]= await pool.query(query,values);  
        
        if (result.affectedRows != 0) {
            return res.json({ mensaje: "product updated" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        })
    }
});

app.delete('/products/:id_product',async (req,res)=>{
    try {
        const {id_product}= req.params;
        const query= `DELETE FROM products WHERE id_product=?`
        
        const values=[
            id_product
        ]
        const [result]= await pool.query(query,values);
        
        if(result.affectedRows!==0){
            return res.json({message: 'product deleted'})
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

app.listen(3000,()=> {
    console.log("Server prepared correctly on port 3000");
})