const mysql = require("mysql2/promise");
const { mysql: mysqlConfig, isMysqlConfigured } = require("./config");

let pool = null;

function mysqlUserId(userId) {
  if (userId == null || userId === "") return null;
  const numeric = Number(userId);
  return Number.isInteger(numeric) ? numeric : null;
}

function getPool() {
  if (!isMysqlConfigured()) return null;
  if (!pool) {
    pool = mysql.createPool({
      host: mysqlConfig.host,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      port: mysqlConfig.port,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

async function insertOrder({ product_id, quantity, total_price, user_id }) {
  const currentPool = getPool();
  if (!currentPool) return null;

  const [result] = await currentPool.execute(
    `INSERT INTO orders (product_id, quantity, total_price, user_id)
     VALUES (?, ?, ?, ?)`,
    [String(product_id), Number(quantity), Number(total_price), mysqlUserId(user_id)]
  );
  return result.insertId;
}

async function pingMysql() {
  const currentPool = getPool();
  if (!currentPool) return false;
  try {
    await currentPool.query("SELECT 1");
    return true;
  } catch (err) {
    console.error("MySQL ping failed:", err.message);
    return false;
  }
}

module.exports = {
  getPool,
  insertOrder,
  pingMysql,
  isMysqlConfigured,
};

if (require.main === module) {
  console.error("db.js is a connection helper, not a server. Start the API with: npm start");
  process.exit(1);
}
