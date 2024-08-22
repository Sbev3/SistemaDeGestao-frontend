import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';

function Products() {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await axios.get('http://localhost:4000/api/products');
        setProducts(result.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setIsEditing(product._id);
    setEditData({
      ...product,
      price: product.price ? product.price.toFixed(2) : '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleSave = async (id) => {
    try {
      // Converte o preço para número antes de enviar
      const updatedData = {
        ...editData,
        price: parseFloat(editData.price),
      };
      await axios.put(`http://localhost:4000/api/products/${id}`, updatedData);
      setProducts(products.map((product) => (product._id === id ? updatedData : product)));
      setIsEditing(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const formatPrice = (price) => {
    return price && !isNaN(price) ? Number(price).toFixed(2) : '0.00';
  };

  return (
    <><Navbar /><div className="p-6 bg-gray-100 min-h-screen">
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Products</h1>
              <Link to="/create-product">
                  <button className="py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                      Create New Product
                  </button>
              </Link>
          </div>

          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                  <tr>
                      <th className="py-2 px-4 border-b">Image</th>
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">Description</th>
                      <th className="py-2 px-4 border-b">Price</th>
                      <th className="py-2 px-4 border-b">Stock</th>
                      <th className="py-2 px-4 border-b">Category</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-100">
                          <td className="py-2 px-4 border-b">
                              {product.image && (
                                  <img
                                      src={`http://localhost:4000/uploads/${product.image}`}
                                      alt={product.name}
                                      className="w-16 h-16 object-cover rounded" />
                              )}
                          </td>
                          <td className="py-2 px-4 border-b">
                              {isEditing === product._id ? (
                                  <input
                                      type="text"
                                      name="name"
                                      value={editData.name || ''}
                                      onChange={handleInputChange}
                                      className="border-gray-300 rounded px-2 py-1" />
                              ) : (
                                  product.name
                              )}
                          </td>
                          <td className="py-2 px-4 border-b">
                              {isEditing === product._id ? (
                                  <input
                                      type="text"
                                      name="description"
                                      value={editData.description || ''}
                                      onChange={handleInputChange}
                                      className="border-gray-300 rounded px-2 py-1" />
                              ) : (
                                  product.description
                              )}
                          </td>
                          <td className="py-2 px-4 border-b">
                              {isEditing === product._id ? (
                                  <input
                                      type="number"
                                      name="price"
                                      value={editData.price || ''}
                                      onChange={handleInputChange}
                                      className="border-gray-300 rounded px-2 py-1" />
                              ) : (
                                  `$${formatPrice(product.price)}`
                              )}
                          </td>
                          <td className="py-2 px-4 border-b">
                              {isEditing === product._id ? (
                                  <input
                                      type="number"
                                      name="stockQuantity"
                                      value={editData.stockQuantity || ''}
                                      onChange={handleInputChange}
                                      className="border-gray-300 rounded px-2 py-1" />
                              ) : (
                                  product.stockQuantity
                              )}
                          </td>
                          <td className="py-2 px-4 border-b">
                              {isEditing === product._id ? (
                                  <input
                                      type="text"
                                      name="category"
                                      value={editData.category || ''}
                                      onChange={handleInputChange}
                                      className="border-gray-300 rounded px-2 py-1" />
                              ) : (
                                  product.category
                              )}
                          </td>
                          <td className="py-2 px-4 border-b flex space-x-2">
                              {isEditing === product._id ? (
                                  <>
                                      <button
                                          onClick={() => handleSave(product._id)}
                                          className="py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                                      >
                                          Save
                                      </button>
                                      <button
                                          onClick={handleCancel}
                                          className="py-1 px-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300"
                                      >
                                          Cancel
                                      </button>
                                  </>
                              ) : (
                                  <>
                                      <button
                                          onClick={() => handleEditClick(product)}
                                          className="py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                                      >
                                          Edit
                                      </button>
                                      <button
                                          onClick={() => handleDelete(product._id)}
                                          className="py-1 px-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                                      >
                                          Delete
                                      </button>
                                  </>
                              )}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div></>
  );
}

export default Products;
