// Apni Kirana - Admin Management Engine (Products, Orders, Offers)

class AdminManager {
  constructor() {}

  getDashboardStats() {
    const products = window.ProductStore.getProducts();
    const orders = window.Checkout.getOrders();

    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const lowStockProducts = products.filter(p => p.stock <= 5);

    return {
      totalProducts,
      totalOrders,
      totalSales,
      lowStockCount: lowStockProducts.length,
      lowStockProducts
    };
  }

  addProduct(productData) {
    const products = window.ProductStore.getProducts();
    const newId = 'p' + (Date.now() % 10000);

    const newProduct = {
      id: newId,
      name: productData.name,
      hindiName: productData.hindiName || productData.name,
      category: productData.category || 'anaj',
      categoryName: productData.categoryName || 'Anaj (Rice & Wheat)',
      brand: productData.brand || 'Apni Kirana Pure',
      unit: productData.unit || '1 kg',
      price: Number(productData.price),
      discountPrice: Number(productData.discountPrice || productData.price),
      rating: 4.8,
      reviewsCount: 1,
      stock: Number(productData.stock || 20),
      image: productData.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      description: productData.description || 'Fresh Kirana product available at wholesale rates.',
      isBestseller: !!productData.isBestseller,
      isOffer: !!productData.isOffer
    };

    products.unshift(newProduct);
    window.ProductStore.saveProducts(products);
    if (window.showToast) window.showToast(`Added "${newProduct.name}" to inventory! 📦`, "success");
    return newProduct;
  }

  updateProduct(id, updatedData) {
    const products = window.ProductStore.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index > -1) {
      products[index] = { ...products[index], ...updatedData };
      window.ProductStore.saveProducts(products);
      if (window.showToast) window.showToast("Product updated successfully! ✅", "success");
    }
  }

  deleteProduct(id) {
    let products = window.ProductStore.getProducts();
    products = products.filter(p => p.id !== id);
    window.ProductStore.saveProducts(products);
    if (window.showToast) window.showToast("Product deleted from inventory", "info");
  }

  updateOrderStatus(orderId, status) {
    window.Checkout.updateOrderStatus(orderId, status);
  }
}

window.Admin = new AdminManager();
