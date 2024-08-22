import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import Navbar from './navbar';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom'; // Importar Link para navegação

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowProducts, setLowProducts] = useState([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesResult = await axios.get('http://localhost:4000/api/sales', { params: filters });
        setSalesData(salesResult.data);

        const productsResult = await axios.get('http://localhost:4000/api/products', { params: filters });
        const sortedProducts = productsResult.data.sort((a, b) => b.stockQuantity - a.stockQuantity);
        setTopProducts(sortedProducts.slice(0, 5));
        setLowProducts(sortedProducts.slice(-5));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const salesChartData = {
    labels: salesData.map(sale => `Mesa ${sale.tableNumber}`),
    datasets: [
      {
        label: 'Total de Vendas',
        data: salesData.map(sale => sale.total),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const productChartData = {
    labels: topProducts.map(product => product.name),
    datasets: [
      {
        label: 'Produtos em Estoque',
        data: topProducts.map(product => product.stockQuantity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Vendas', 10, 10);
    autoTable(doc, {
      head: [['Mesa', 'Total']],
      body: salesData.map(sale => [sale.tableNumber, sale.total]),
    });
    doc.save('sales-report.pdf');
  };

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(salesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vendas');
    const wbout = XLSX.write(wb, { bookType: 'csv', type: 'array' });
    saveAs(new Blob([wbout], { type: 'text/csv;charset=utf-8;' }), 'sales-report.csv');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(salesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vendas');
    XLSX.writeFile(wb, 'sales-report.xlsx');
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="mb-6">
          <label className="mr-2">Data Inicial:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <label className="ml-4 mr-2">Data Final:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
        </div>

        <div className="flex space-x-4 mb-6">
          <Link to="/sales">
            <button className="py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
              Lista de Vendas
            </button>
          </Link>
          <Link to="/clients">
            <button className="py-2 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300">
              Lista de Clientes
            </button>
          </Link>
          <Link to="/products">
            <button className="py-2 px-4 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition duration-300">
              Lista de Produtos
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Vendas por Mesa</h2>
            <Bar data={salesChartData} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Top 5 Produtos em Estoque</h2>
            <Doughnut data={productChartData} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Produtos Menos Vendidos</h2>
          <ul>
            {lowProducts.map(product => (
              <li key={product._id} className="border-b py-2">
                {product.name} - {product.stockQuantity} em estoque
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={exportToPDF}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Exportar PDF
          </button>
          <button
            onClick={exportToCSV}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Exportar CSV
          </button>
          <button
            onClick={exportToExcel}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700"
          >
            Exportar Excel
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
