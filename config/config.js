module.exports = {
  development: {
    dialect: "sqlite",
    storage: process.env.SQLITE_STORAGE_PATH || "./database.sqlite",
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
  },
  production: {
    dialect: "sqlite",
    storage: process.env.SQLITE_STORAGE_PATH || "/tmp/database.sqlite",
  }
};
