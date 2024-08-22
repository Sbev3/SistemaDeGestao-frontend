import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';

function Sales() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [products, setProducts] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { saleId } = useParams();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesResult = await axios.get('http://localhost:4000/api/sales');
        const completedSales = salesResult.data.filter(sale => sale.finished);
        setSales(completedSales);
        setFilteredSales(completedSales);

        // Obter todos os IDs de produtos
        const productIds = new Set(completedSales.flatMap(sale => sale.products.map(p => p.productId)));

        // Buscar detalhes dos produtos
        const productResults = await Promise.all(
          Array.from(productIds).map(productId =>
            axios.get(`http://localhost:4000/api/products/${productId}`)
          )
        );

        const productDetails = productResults.reduce((acc, result) => {
          acc[result.data._id] = result.data;
          return acc;
        }, {});

        setProducts(productDetails);

        console.log('Sales fetched:', completedSales);
        console.log('Products fetched:', productDetails);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    fetchSales();
  }, []);

  const handleFilter = () => {
    if (startDate && endDate) {
      const filtered = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
      });
      setFilteredSales(filtered);
    } else {
      setFilteredSales(sales);
    }
  };

  const sale = sales.find(s => s._id === saleId);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-center">Detalhes da Venda</h1>

        {/* Filtros de Data */}
        <div className="mb-6 flex justify-center space-x-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Filtrar
          </button>
        </div>

        {filteredSales.length > 0 ? (
          filteredSales.map(sale => (
            <div key={sale._id} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">ID da Venda: {sale._id}</h2>
                <p className="text-gray-600">Data: {new Date(sale.date).toLocaleDateString()}</p>
                <p className="text-gray-600">
                  Total: ${sale.total && !isNaN(sale.total) ? sale.total.toFixed(2) : 'N/A'}
                </p>
                <p className="text-gray-600">
                  Método de Pagamento: {sale.paymentMethod || 'Não especificado'}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Produtos</h3>
                <ul className="space-y-4">
                  {sale.products.length > 0 ? (
                    sale.products.map((product, index) => {
                      const productDetails = products[product.productId] || {};
                      return (
                        <li key={index} className="flex justify-between items-center p-4 border border-gray-300 rounded-md">
                          <div className="flex items-center space-x-4">
                            {productDetails.image ? (
                              <img src={productDetails.image} alt={productDetails.name || 'Produto'} className="w-16 h-16 object-cover rounded-md" />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-gray-600">Sem Imagem</span>
                              </div>
                            )}
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {productDetails.name || 'Produto não disponível'}
                              </h4>
                              <p className="text-gray-600">
                                Preço: ${productDetails.price && !isNaN(productDetails.price) ? productDetails.price.toFixed(2) : 'N/A'}
                              </p>
                              <p className="text-gray-600">Quantidade: {product.quantity}</p>
                            </div>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-600">Nenhum produto disponível.</div>
                  )}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">Nenhuma venda encontrada.</div>
        )}
      </div>
    </>
  );
}

export default Sales;
