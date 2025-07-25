const DatabaseConnection = require('../database/connection');

class ProductModel {
  static async findAll() {
    const db = DatabaseConnection.getInstance();
    return db.products || [];
  }

  static async findById(id) {
    const db = DatabaseConnection.getInstance();
    const products = db.products || [];
    return products.find(product => product.id === id) || null;
  }

  static async create(productData) {
    const db = DatabaseConnection.getInstance();
    if (!db.products) {
      db.products = [];
    }
    
    db.products.push(productData);
    await DatabaseConnection.save();
    return productData;
  }

  static async update(id, productData) {
    const db = DatabaseConnection.getInstance();
    const products = db.products || [];
    const index = products.findIndex(product => product.id === id);
    
    if (index === -1) {
      return null;
    }
    
    products[index] = productData;
    await DatabaseConnection.save();
    return productData;
  }

  static async delete(id) {
    const db = DatabaseConnection.getInstance();
    const products = db.products || [];
    const index = products.findIndex(product => product.id === id);
    
    if (index === -1) {
      return false;
    }
    
    products.splice(index, 1);
    await DatabaseConnection.save();
    return true;
  }
}

module.exports = ProductModel;