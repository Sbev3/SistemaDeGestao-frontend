import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';


export default function CreateProduct() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '',
    image: null,
    supplier: {
      name: '',
      phone: ''
    }
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setProduct({ ...product, image: files[0] });
    } else if (name.includes('supplier')) {
      setProduct({
        ...product,
        supplier: { ...product.supplier, [name.split('.')[1]]: value }
      });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:4000/api/products', product, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('Produto criado com sucesso:', response.data);
        // Aqui você pode redirecionar o usuário ou limpar o formulário, se desejar
    } catch (error) {
        if (error.response) {
            // O servidor respondeu com um status diferente de 2xx
            console.error('Erro ao criar o produto:', error.response.data);
            // Aqui você pode mostrar uma mensagem de erro ao usuário
        } else if (error.request) {
            // A requisição foi feita, mas nenhuma resposta foi recebida
            console.error('Nenhuma resposta recebida:', error.request);
        } else {
            // Algo deu errado ao configurar a requisição
            console.error('Erro ao configurar a requisição:', error.message);
        }
    }
};

  return (
    <><Navbar /><form onSubmit={handleSubmit}>
          <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">Criar Produto</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                      Preencha as informações do produto abaixo.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                              Nome do Produto
                          </label>
                          <div className="mt-2">
                              <input
                                  id="name"
                                  name="name"
                                  type="text"
                                  placeholder="Nome do Produto"
                                  autoComplete="name"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  value={product.name}
                                  onChange={handleChange} />
                          </div>
                      </div>

                      <div className="col-span-full">
                          <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                              Descrição
                          </label>
                          <div className="mt-2">
                              <textarea
                                  id="description"
                                  name="description"
                                  rows={3}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder="Descrição do produto"
                                  value={product.description}
                                  onChange={handleChange} />
                          </div>
                      </div>

                      <div className="sm:col-span-3">
                          <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                              Preço
                          </label>
                          <div className="mt-2">
                              <input
                                  id="price"
                                  name="price"
                                  type="text"
                                  placeholder="Preço"
                                  autoComplete="price"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  value={product.price}
                                  onChange={handleChange} />
                          </div>
                      </div>

                      <div className="sm:col-span-3">
                          <label htmlFor="stockQuantity" className="block text-sm font-medium leading-6 text-gray-900">
                              Quantidade em Estoque
                          </label>
                          <div className="mt-2">
                              <input
                                  id="stockQuantity"
                                  name="stockQuantity"
                                  type="text"
                                  placeholder="Quantidade em Estoque"
                                  autoComplete="stockQuantity"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  value={product.stockQuantity}
                                  onChange={handleChange} />
                          </div>
                      </div>

                      <div className="sm:col-span-3">
                          <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                              Categoria
                          </label>
                          <div className="mt-2">
                              <input
                                  id="category"
                                  name="category"
                                  type="text"
                                  placeholder="Categoria"
                                  autoComplete="category"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  value={product.category}
                                  onChange={handleChange} />
                          </div>
                      </div>

                      <div className="col-span-full">
                          <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                              Imagem do Produto
                          </label>
                          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                              <div className="text-center">
                                  <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                      <label
                                          htmlFor="file-upload"
                                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                      >
                                          <span>Upload um arquivo</span>
                                          <input
                                              id="file-upload"
                                              name="image"
                                              type="file"
                                              className="sr-only"
                                              onChange={handleChange} />
                                      </label>
                                      <p className="pl-1">ou arraste e solte</p>
                                  </div>
                                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF até 10MB</p>
                              </div>
                          </div>
                      </div>

                      <div className="sm:col-span-3">
                          <label htmlFor="supplier.name" className="block text-sm font-medium leading-6 text-gray-900">
                              Nome do Fornecedor
                          </label>
                          <div className="mt-2">
                              <input
                                  id="supplier.name"
                                  name="supplier.name"
                                  type="text"
                                  placeholder="Nome do Fornecedor"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  value={product.supplier.name}
                                  onChange={handleChange} />
                          </div>
                      </div>

                      <div className="sm:col-span-3">
                          <label htmlFor="supplier.phone" className="block text-sm font-medium leading-6 text-gray-900">
                              Telefone do Fornecedor
                          </label>
                          <div className="mt-2">
                              <input
                                  id="supplier.phone"
                                  name="supplier.phone"
                                  type="text"
                                  placeholder="Telefone do Fornecedor"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  value={product.supplier.phone}
                                  onChange={handleChange} />
                          </div>
                      </div>
                  </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                      Cancelar
                  </button>
                  <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                      Salvar Produto
                  </button>
              </div>
          </div>
      </form></>
  );
}
