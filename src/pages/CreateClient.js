import { useState } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios'; // Importar Axios
import { useNavigate } from 'react-router-dom'; // Para navegação

export default function CreateClient() {
  const [client, setClient] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar os dados ao backend usando Axios
      const response = await axios.post('http://localhost:4000/api/clients', client);

      if (response.status === 200) {
        setStatusMessage('Cliente criado com sucesso!');
        setClient({ name: '', phone: '', address: '' }); // Limpar formulário
        navigate('/clients'); // Redirecionar para a lista de clientes ou outra página
      } else {
        setStatusMessage('Erro ao criar cliente.');
      }
    } catch (error) {
      setStatusMessage('Erro ao criar cliente.');
      console.error('Erro:', error);
    }
  };

  const handleCancel = () => {
    navigate('/clients'); // Redirecionar para a lista de clientes ou outra página
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Criar Cliente</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Preencha as informações do cliente abaixo.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Nome do Cliente
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nome do Cliente"
                    autoComplete="name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={client.name}
                    onChange={handleChange} />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                  Telefone
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="Telefone"
                    autoComplete="phone"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={client.phone}
                    onChange={handleChange} />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                  Endereço
                </label>
                <div className="mt-2">
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Endereço do cliente"
                    value={client.address}
                    onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button 
              type="button" 
              onClick={handleCancel} 
              className="text-sm font-semibold leading-6 text-gray-900">
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Salvar Cliente
            </button>
          </div>

          {statusMessage && (
            <div className="mt-4 text-sm font-medium text-gray-900">
              {statusMessage}
            </div>
          )}
        </div>
      </form>
    </>
  );
}
