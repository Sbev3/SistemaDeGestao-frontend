import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMoneyBillWave, FaCreditCard, FaMobileAlt } from 'react-icons/fa';

export default function Orders() {
    const [sales, setSales] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [showReceipt, setShowReceipt] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Para obter o estado da navegação

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/sales');
                const notFinishedSales = response.data.filter(sale => !sale.finished);
                setSales(notFinishedSales);
            } catch (error) {
                console.error('Erro ao buscar vendas:', error);
            }
        };

        fetchSales();
    }, [location.state?.updated]); // Recarrega quando o estado de atualização estiver presente

    const handleSelectSale = (sale) => {
        setSelectedSale(sale);
    };

    const handleFinalizeSale = () => {
        if (!paymentMethod) {
            alert('Escolha um método de pagamento antes de finalizar a venda.');
            return;
        }
        setShowReceipt(true);
    };

    const confirmFinalizeSale = async () => {
        try {
            await axios.patch(`http://localhost:4000/api/sales/finalize/${selectedSale._id}`, { paymentMethod });

            const response = await axios.get('http://localhost:4000/api/sales');
            const notFinishedSales = response.data.filter(sale => !sale.finished);
            setSales(notFinishedSales);

            window.print();

            setSelectedSale(null);
            setShowReceipt(false);

            alert('Venda finalizada com sucesso!');
        } catch (error) {
            console.error('Erro ao finalizar venda:', error);
        }
    };

    const paymentOptions = [
        { value: 'cash', label: 'Dinheiro', icon: <FaMoneyBillWave className="text-4xl text-green-500" /> },
        { value: 'pos', label: 'POS', icon: <FaCreditCard className="text-4xl text-blue-500" /> },
        { value: 'mpesa', label: 'M-pesa', icon: <FaMobileAlt className="text-4xl text-green-500" /> },
        { value: 'emola', label: 'E-mola', icon: <FaMobileAlt className="text-4xl text-yellow-500" /> }
    ];

    const handleUpdateSale = () => {
        if (selectedSale) {
            navigate(`/edit-sale/${selectedSale._id}`, { state: { sale: selectedSale, updated: true } }); // Passa o estado para indicar atualização
        }
    };

    return (
        <>
            <Navbar />
            <div className="p-4">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Vendas Não Finalizadas</h2>
                    <button
                        onClick={() => navigate('/create-sale')}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Criar Nova Venda
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sales.length === 0 ? (
                        <p>Não há vendas não finalizadas.</p>
                    ) : (
                        sales.map((sale) => (
                            <div
                                key={sale._id}
                                className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelectSale(sale)}
                            >
                                <div className="text-2xl font-bold">{sale.tableNumber || 'Mesa 1'}</div>
                                <div className="text-xl font-semibold mt-2">MZN {sale.total ? sale.total.toFixed(2) : '0.00'}</div>
                            </div>
                        ))
                    )}
                </div>

                {selectedSale && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h3 className="text-xl font-semibold mb-4">Finalizar Venda</h3>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Método de Pagamento</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {paymentOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setPaymentMethod(option.value)}
                                            className={`p-4 border rounded-lg flex flex-col items-center justify-center ${paymentMethod === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} hover:bg-gray-100`}
                                        >
                                            {option.icon}
                                            <span className="mt-2 text-sm font-semibold">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={handleUpdateSale}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    Atualizar Conta
                                </button>
                                <button
                                    onClick={handleFinalizeSale}
                                    disabled={!paymentMethod}
                                    className={`px-4 py-2 rounded ${paymentMethod ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
                                >
                                    Finalizar Venda
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showReceipt && selectedSale && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                            <h3 className="text-xl font-semibold mb-4 text-center">Recibo</h3>
                            <div className="mb-4">
                                <div className="flex justify-between">
                                    <p><strong>Data:</strong> {new Date().toLocaleDateString()}</p>
                                    <p><strong>Hora:</strong> {new Date().toLocaleTimeString()}</p>
                                </div>
                                <p><strong>Mesa:</strong> {selectedSale.tableNumber || 'Mesa 1'}</p>
                                <p><strong>Total:</strong> MZN {selectedSale.total ? selectedSale.total.toFixed(2) : '0.00'}</p>
                                <p><strong>Método de Pagamento:</strong> {paymentOptions.find(option => option.value === paymentMethod)?.label}</p>
                                <h4 className="mt-4 mb-2 text-lg font-semibold">Produtos:</h4>
                                <ul className="list-disc list-inside">
                                    {selectedSale.items && selectedSale.items.length > 0 ? (
                                        selectedSale.items.map((item, index) => (
                                            <li key={index}>
                                                <span>{item.quantity}x {item.productName}</span>
                                                <span className="ml-2">- MZN {item.price ? item.price.toFixed(2) : '0.00'} cada</span>
                                                <span className="ml-2">= MZN {(item.price && item.quantity ? (item.price * item.quantity).toFixed(2) : '0.00')}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li>Nenhum produto encontrado.</li>
                                    )}
                                </ul>
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-sm">Obrigado pela sua compra!</p>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={() => setShowReceipt(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmFinalizeSale}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Confirmar e Imprimir
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
