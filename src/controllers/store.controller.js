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

app.get('/stores/:nit_store',async (req,res)=>{
    try{
        const {nit_store}= req.params
        const [rows]= await pool.query( `SELECT *FROM stores WHERE nit_store=? `,[nit_store]);
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

app.post('/nit_store',async (req,res)=>{
    try{
        const {nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note}=req.body; 
        const query= `INSERT INTO stores(nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note) VALUES (?,?,?,?,?,?,?,?,?,?)`;
        const values = [nit_store,store_name.trim(),address,phone_number,email,id_store_type,opening_hours,closing_hours,note.trim()];
        const [result] = await pool.query(query,values);
        res.status(201).json({
            message: "store created",
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

app.put('/stores/:id_store', async (req,res)=>{
    try {
        const {id_store}= req.params;
        const{nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note}=req.body;
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

app.listen(3001,()=> {
    console.log("Server prepared correctly on port 3001");
})