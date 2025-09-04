import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './BackEnd/Config/.env' });

let pool;

const dbUrl = process.env.DATABASE_URL;

if (dbUrl) {
	try {
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
		// fallback to individual env vars
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
	pool = mysql.createPool({
		host: process.env.DB_HOST || '127.0.0.1',
		user: process.env.DB_USER || process.env.USER || 'root',
		password: process.env.DB_PASS || process.env.PASSWORD || undefined,
		database: process.env.DB_NAME || 'toolhub',
		waitForConnections: true,
		connectionLimit: 10,
	});
}

export async function query(sql, params) {
	const [rows] = await pool.query(sql, params);
	return rows;
}

export default pool;

