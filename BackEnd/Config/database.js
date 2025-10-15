// Import MySQL2 promise-based driver
import mysql from 'mysql2/promise';
// Import dotenv for environment variables
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: './BackEnd/Config/.env' });

// Database connection pool
let pool;

// Get database URL from environment
const dbUrl = process.env.DATABASE_URL;

// Try to create pool from DATABASE_URL if provided
if (dbUrl) {
	try {
		// Parse DATABASE_URL and create connection pool
		const url = new URL(dbUrl);
		pool = mysql.createPool({
			host: url.hostname,
			port: url.port ? Number(url.port) : 3306,
			user: url.username,
			password: url.password || undefined,
			database: url.pathname.replace(/^\//, ''),
			waitForConnections: true,
			connectionLimit: 10,
		}).promise();
	} catch (err) {
		// Fallback to individual environment variables if URL parsing fails
		// Create pool using individual environment variables
		pool = mysql.createPool({
			host: process.env.DB_HOST || '127.0.0.1',
			user: process.env.DB_USER || process.env.USER || 'root',
			password: process.env.DB_PASS || process.env.PASSWORD || undefined,
			database: process.env.DB_NAME || 'toolhub',
			waitForConnections: true,
			connectionLimit: 10,
		});
	}
} else {
	// Create pool using individual environment variables (no DATABASE_URL provided)
	pool = mysql.createPool({
		host: process.env.DB_HOST || '127.0.0.1',
		user: process.env.DB_USER || process.env.USER || 'root',
		password: process.env.DB_PASS || process.env.PASSWORD || undefined,
		database: process.env.DB_NAME || 'toolhub',
		waitForConnections: true,
		connectionLimit: 10,
	});
}

// Execute SQL query using the connection pool
export async function query(sql, params) {
	// Execute query and return only the rows (not metadata)
	const [rows] = await pool.query(sql, params);
	return rows;
}

// Export the connection pool as default export
export default pool;

