"use client";
import { useEffect, useState } from "react";
import { getAddress } from "../../get-address";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MdDelete, MdFilterList } from "react-icons/md";
import { useSession } from "@/contexts/session-context";

type Address = {
  id: string;
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  createdAt: Date;
};

const formatDate = (date: Date) =>
  formatDistanceToNow(new Date(date), {
    includeSeconds: true,
    locale: ptBR,
  });

const AddressForm = ({ onAddAddress, loading }: any) => {
  const [inputValue, setInputValue] = useState("");

  async function handleGetAddress() {
    if (inputValue.length !== 8) {
      alert("CEP inválido");
      return;
    }
    try {
      const result = await getAddress(inputValue);
      const newAddress = {
        id: self.crypto.randomUUID(),
        createdAt: new Date(),
        ...result,
      };
      onAddAddress(newAddress);
      setInputValue("");
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar endereço");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite o CEP"
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-blue-400 shadow-sm"
        />
        <button
          onClick={handleGetAddress}
          disabled={loading || inputValue === ""}
          className={`px-5 py-3 text-white rounded-lg transition-all duration-300 ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Carregando..." : "Buscar"}
        </button>
      </div>
    </div>
  );
};

const AddressTable = ({ addresses, onDelete, onClear, filter, setFilter }: any) => (
  <div className="mt-8">
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filtrar por CEP, Cidade ou Estado"
        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-blue-400 shadow-sm"
      />
      <button
        onClick={onClear}
        className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
      >
        Limpar Todos
      </button>
    </div>
    <table className="w-full border-collapse border border-gray-300 text-left">
      <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <tr>
          {["Logradouro", "Bairro", "Cidade", "Estado", "CEP", "Consultado em", "Ações"].map((header) => (
            <th key={header} className="border border-gray-300 px-4 py-2">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {addresses.length > 0 ? (
          addresses.map((address: Address) => (
            <tr key={address.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
              <td className="px-4 py-2">{address.logradouro}</td>
              <td className="px-4 py-2">{address.bairro}</td>
              <td className="px-4 py-2">{address.localidade}</td>
              <td className="px-4 py-2">{address.uf}</td>
              <td className="px-4 py-2">{address.cep}</td>
              <td className="px-4 py-2">{formatDate(address.createdAt)}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onDelete(address.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <MdDelete size={24} />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="text-center py-4 text-gray-500">
              Nenhum endereço encontrado
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const Header = ({ session, onSignIn }: any) => (
  <div className="flex flex-col items-center mb-6">
    <h1 className="text-3xl font-semibold text-gray-800">
      {session?.name || "Bem-vindo"}
    </h1>
    {!session && (
      <button
        onClick={onSignIn}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Entrar
      </button>
    )}
  </div>
);

export default function Home() {
  const { session, setSession } = useSession();
  const [enderecos, setEnderecos] = useState<Address[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setSession({ id: "1", name: "Augusto", role: "ADMIN" });
  };

  const handleAddAddress = (newAddress: Address) => {
    setEnderecos((prev) => [newAddress, ...prev]);
    localStorage.setItem("@addresses", JSON.stringify([newAddress, ...enderecos]));
  };

  const handleDeleteAddress = (id: string) => {
    const updated = enderecos.filter((addr) => addr.id !== id);
    setEnderecos(updated);
    localStorage.setItem("@addresses", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setEnderecos([]);
    localStorage.removeItem("@addresses");
  };

  useEffect(() => {
    const stored = localStorage.getItem("@addresses");
    if (stored) setEnderecos(JSON.parse(stored));
  }, []);

  const filteredAddresses = enderecos.filter(
    (address) =>
      address.cep.includes(filter) ||
      address.localidade.toLowerCase().includes(filter.toLowerCase()) ||
      address.uf.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto mt-16 p-6">
      <Header session={session} onSignIn={handleSignIn} />
      <AddressForm onAddAddress={handleAddAddress} loading={loading} />
      <AddressTable
        addresses={filteredAddresses}
        onDelete={handleDeleteAddress}
        onClear={handleClearAll}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
}
