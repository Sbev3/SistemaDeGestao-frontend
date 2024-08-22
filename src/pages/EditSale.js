import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, IconButton, Grid } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '../components/navbar';

const EditSale = () => {
    const { saleId } = useParams();
    const navigate = useNavigate();
    const [sale, setSale] = useState(null);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadSale = async () => {
            try {
                if (!saleId) {
                    throw new Error('ID da venda não fornecido.');
                }

                const saleResponse = await fetch(`http://localhost:4000/api/sales/${saleId}`);
                if (!saleResponse.ok) {
                    throw new Error('Erro ao carregar dados da venda.');
                }

                const saleData = await saleResponse.json();
                setSale(saleData);
                setSelectedProducts(saleData.products || []);

                const productsResponse = await fetch('http://localhost:4000/api/products');
                if (!productsResponse.ok) {
                    throw new Error('Erro ao carregar dados dos produtos.');
                }

                const productsData = await productsResponse.json();
                setAvailableProducts(productsData);
            } catch (error) {
                console.error('Erro:', error.message);
                setError(error.message);
            }
        };

        loadSale();
    }, [saleId]);

    const handleAddProduct = (product) => {
        const existingProduct = selectedProducts.find(p => p.productId === product._id);
        if (existingProduct) {
            setSelectedProducts(selectedProducts.map(p => 
                p.productId === product._id ? { ...p, quantity: p.quantity + 1 } : p
            ));
        } else {
            setSelectedProducts([...selectedProducts, { productId: product._id, quantity: 1, price: product.price }]);
        }
    };

    const handleRemoveProduct = (productId) => {
        const updatedProducts = selectedProducts.filter(p => p.productId !== productId);
        setSelectedProducts(updatedProducts);
    };

    const handleQuantityChange = (productId, amount) => {
        setSelectedProducts(selectedProducts.map(p => 
            p.productId === productId ? { ...p, quantity: Math.max(p.quantity + amount, 1) } : p
        ));
    };

    const handleUpdateSale = async () => {
        try {
            const updatedSale = { ...sale, products: selectedProducts, total: calculateTotal() };
            const response = await fetch(`http://localhost:4000/api/sales/${saleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSale),
            });
    
            if (!response.ok) {
                throw new Error('Erro ao atualizar a venda: ' + response.statusText);
            }
    
            alert('Venda atualizada com sucesso!');
            console.log('Venda atualizada:', updatedSale);
            navigate('/orders');
        } catch (error) {
            console.error('Erro:', error.message);
            setError(error.message);
        }
    };

    const calculateTotal = () => {
        return selectedProducts.reduce((total, product) => {
            const productDetails = availableProducts.find(p => p._id === product.productId);
            const price = productDetails ? productDetails.price : 0;
            return total + (price * product.quantity);
        }, 0);
    };

    if (error) {
        return <div>Erro: {error}</div>;
    }

    if (!sale) {
        return <div>Carregando...</div>;
    }

    return (
        <><Navbar /><div>
            <Typography variant="h4" gutterBottom>
                Edição da Venda - Mesa {sale.tableNumber}
            </Typography>
            <Typography variant="h6">
                Total Atual: MZN {calculateTotal().toFixed(2)}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="h5">Produtos Disponíveis</Typography>
                    {availableProducts.map(product => (
                        <Card key={product._id} variant="outlined" style={{ marginBottom: '10px' }}>
                            <CardContent>
                                <Typography variant="h6">{product.name}</Typography>
                                <Typography>Preço: MZN {product.price.toFixed(2)}</Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddShoppingCartIcon />}
                                    onClick={() => handleAddProduct(product)}
                                >
                                    ADICIONAR
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5">Produtos Selecionados</Typography>
                    {selectedProducts.map(product => {
                        const productDetails = availableProducts.find(p => p._id === product.productId);
                        return (
                            <Card key={product.productId} variant="outlined" style={{ marginBottom: '10px' }}>
                                <CardContent>
                                    <Typography variant="h6">{productDetails ? productDetails.name : 'Produto Sem Nome'}</Typography>
                                    <Typography>Quantidade: {product.quantity}</Typography>
                                    <Typography>Preço Unitário: MZN {productDetails ? productDetails.price.toFixed(2) : '0.00'}</Typography>
                                    <Typography>Subtotal: MZN {productDetails ? (productDetails.price * product.quantity).toFixed(2) : '0.00'}</Typography>
                                    <IconButton onClick={() => handleQuantityChange(product.productId, -1)}>
                                        <RemoveIcon />
                                    </IconButton>
                                    {product.quantity}
                                    <IconButton onClick={() => handleQuantityChange(product.productId, 1)}>
                                        <AddIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleRemoveProduct(product.productId)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Grid>
            </Grid>
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateSale}
                style={{ marginTop: '20px' }}
            >
                ATUALIZAR VENDA
            </Button>
        </div></>
    );
};

export default EditSale;
