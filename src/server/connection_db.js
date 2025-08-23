import mysql from 'mysql2/promise';

export const pool= mysql.createPool({
    host:"127.0.0.1",
    database: "NearMe",
    port: "3306",
    user: "root",
    password: "Qwe.123*",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit:0

})
async function databaseConnection() {
    try {
        const connection = await pool.getConnection();
        console.log(`connected to the database successfully`);
        connection.release();
    } catch (error) {
        console.error(`connection error`)
    }
    
}
databaseConnection();

