import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", price: "" });
  const [editId, setEditId] = useState(null);

  const API = "http://localhost:5000/api/products";

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.name || !form.quantity || !form.price) return;
    await axios.post(API, {
      name: form.name,
      quantity: Number(form.quantity),
      price: Number(form.price),
    });
    setForm({ name: "", quantity: "", price: "" });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({ name: product.name, quantity: product.quantity, price: product.price });
  };

  const handleUpdate = async () => {
    await axios.put(`${API}/${editId}`, {
      name: form.name,
      quantity: Number(form.quantity),
      price: Number(form.price),
    });
    setEditId(null);
    setForm({ name: "", quantity: "", price: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchProducts();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Inventory Manager</h2>

      {/* Form */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded w-full"
          name="quantity"
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded w-full"
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
        />
        {editId ? (
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add
          </button>
        )}
      </div>

      {/* Product List */}
      <table className="min-w-full bg-gray-100 rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Quantity</th>
            <th className="text-left p-3">Price</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.quantity}</td>
              <td className="p-3">Rs.{p.price}</td>
              <td className="p-3 flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
