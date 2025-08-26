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

app.post('/stores',async (req,res)=>{
    try{
        const {nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note}=req.body; 
        const query= `INSERT INTO stores(nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note) VALUES (?,?,?,?,?,?,?,?,?)`;
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

app.put('/stores/:nit_store', async (req,res)=>{
    try {
        const {nit_store}= req.params;
        const{nit_store: new_nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note}=req.body;
        const query= `UPDATE stores SET nit_store=?,store_name=?,address=?,phone_number=?,email=?,id_store_type=?,opening_hours=?,closing_hours=?,note=? WHERE nit_store=?`;
        const values=[new_nit_store,store_name.trim(),address,phone_number,email,id_store_type,opening_hours,closing_hours,note.trim(),nit_store];
        const [result]= await pool.query(query,values);  
        
        if (result.affectedRows != 0) {
            return res.json({ mensaje: "store updated" })
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

app.delete('/stores/:nit_store',async (req,res)=>{
    try {
        const {nit_store}= req.params;
        const query= `DELETE FROM stores WHERE nit_store=?`
        
        const values=[
            nit_store
        ]
        const [result]= await pool.query(query,values);
        
        if(result.affectedRows!==0){
            return res.json({message: 'store deleted'})
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