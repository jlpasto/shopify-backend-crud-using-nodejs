const fs = require('fs').promises;
const path = require('path');

class DatabaseConnection {
  constructor() {
    this.data = {};
    this.dbPath = path.join(__dirname, 'data.json');
  }

  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance.data;
  }

  static async connectDatabase() {
    const instance = new DatabaseConnection();
    DatabaseConnection.instance = instance;
    
    try {
      const data = await fs.readFile(instance.dbPath, 'utf8');
      instance.data = JSON.parse(data);
      console.log('📊 Database connected successfully');
    } catch (error) {
      // If file doesn't exist, create it with initial structure
      instance.data = {
        products: [],
      };
      await instance.save();
      console.log('📊 Database initialized with default structure');
    }
  }

  static async save() {
    if (DatabaseConnection.instance) {
      await DatabaseConnection.instance.save();
    }
  }

  async save() {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
      throw error;
    }
  }
}

module.exports = {
  connectDatabase: DatabaseConnection.connectDatabase,
  getInstance: DatabaseConnection.getInstance,
  save: DatabaseConnection.save,
};