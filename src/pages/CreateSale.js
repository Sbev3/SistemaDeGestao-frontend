import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateSale = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // Adicionado
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await axios.get('http://localhost:4000/api/products');
        console.log('Fetched Products:', result.data);
        setProducts(result.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    if (location.state && location.state.sale) {
      const { sale } = location.state;
      console.log('Sale Data:', sale);

      setTableNumber(sale.tableNumber);
      setSelectedProducts(
        sale.products.map(product => ({
          ...product,
          quantity: product.quantity || 1 // Ensure quantity is defined
        }))
      );
      setTotal(sale.total);
      setIsEditing(true);
    }
  }, [location.state]);

  const handleAddProduct = (product) => {
    if (!selectedProducts.find(p => p._id === product._id)) {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const newQuantity = parseInt(quantity, 10);
    if (isNaN(newQuantity) || newQuantity <= 0) return; // Avoid invalid quantity
    const newProducts = [...selectedProducts];
    newProducts[index].quantity = newQuantity;
    setSelectedProducts(newProducts);
    calculateTotal(newProducts);
  };

  const handleIncreaseQuantity = (index) => {
    const newProducts = [...selectedProducts];
    newProducts[index].quantity = (newProducts[index].quantity || 1) + 1;
    setSelectedProducts(newProducts);
    calculateTotal(newProducts);
  };

  const handleDecreaseQuantity = (index) => {
    const newProducts = [...selectedProducts];
    if ((newProducts[index].quantity || 1) > 1) {
      newProducts[index].quantity -= 1;
      setSelectedProducts(newProducts);
      calculateTotal(newProducts);
    }
  };

  const calculateTotal = (products) => {
    try {
      const totalAmount = products.reduce((sum, product) => {
        const productPrice = parseFloat(product.price) || 0;
        const productQuantity = parseInt(product.quantity, 10) || 0;
        console.log(`Calculating for product ${product.name}: price=${productPrice}, quantity=${productQuantity}`);
        return sum + (productPrice * productQuantity);
      }, 0);
      setTotal(totalAmount);
    } catch (error) {
      console.error('Error calculating total:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedProducts = selectedProducts.map(product => ({
        productId: product._id,
        quantity: product.quantity
    }));

    const saleData = {
        products: formattedProducts,
        total: total,
        paymentMethod: paymentMethod || null,
        date: new Date().toISOString(),
        tableNumber: tableNumber
    };

    try {
        if (isEditing) {
            const saleId = location.state.sale._id;
            await axios.patch(`http://localhost:4000/api/sales/${saleId}`, saleData);
            alert('Sale updated successfully.');
        } else {
            await axios.post('http://localhost:4000/api/sales', saleData);
            alert('Sale created successfully.');
        }
        navigate('/orders');
    } catch (error) {
        console.error('Error saving sale:', error.response?.data || error.message);
        alert('Failed to save sale. Check console for details.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Sale' : 'Create Sale'}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Products</h2>
            <ul>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <li key={product._id} className="flex justify-between items-center mb-2">
                    {product.name} - MZN {product.price ? product.price.toFixed(2) : 'N/A'}
                    <button
                      onClick={() => handleAddProduct(product)}
                      className="ml-2 py-1 px-3 bg-blue-600 text-white rounded"
                    >
                      Add
                    </button>
                  </li>
                ))
              ) : (
                <p>No products available.</p>
              )}
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Selected Products</h2>
            <ul>
              {selectedProducts && selectedProducts.length > 0 ? (
                selectedProducts.map((product, index) => (
                  <li key={index} className="flex justify-between items-center mb-2">
                    {product.name} - MZN {product.price ? product.price.toFixed(2) : 'N/A'}
                    <div className="flex items-center">
                      <button
                        onClick={() => handleDecreaseQuantity(index)}
                        className="py-1 px-2 bg-gray-300 rounded"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={product.quantity || 1}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className="w-12 mx-2 border-gray-300 rounded"
                      />
                      <button
                        onClick={() => handleIncreaseQuantity(index)}
                        className="py-1 px-2 bg-gray-300 rounded"
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No products selected.</p>
              )}
            </ul>
            <div className="mt-4">
              <strong>Total: MZN {total.toFixed(2)}</strong>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <label className="mr-2">Table Number:</label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="p-2 border rounded"
                />
              </div>
              <div className="mt-4">
                <label className="mr-2">Payment Method:</label>
                <input
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="p-2 border rounded"
                />
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded"
                >
                  {isEditing ? 'Update Sale' : 'Create Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateSale;
