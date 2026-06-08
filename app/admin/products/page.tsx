"use client";

import { Edit, Plus, Trash, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: {
    mrp: number;
    sellingPrice: number;
  };
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });

      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();

      setProducts(data.products);
      console.log("data", data);
      console.log("products", data.products);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const res = await fetch("/api/admin/products/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success(data.message);
      setCsvFile(null);
      setShowBulkUpload(false);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to upload CSV");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-slate-600 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBulkUpload(!showBulkUpload)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Upload size={18} />
            Bulk Upload
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {showBulkUpload && (
        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Bulk Upload Products</h2>
          <form onSubmit={handleBulkUpload}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
              <p className="text-xs text-slate-500 mt-2">
                CSV headers: name, category, description, details, mrp,
                sellingPrice, images (comma-separated URLs)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setShowBulkUpload(false)}
                className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Loading products...</p>
        </div>
      ) : products?.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow">
          <p className="text-slate-600">No products found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    MRP
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Selling Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="px-6 py-3">{product.name}</td>
                    <td className="px-6 py-3">{product.category}</td>
                    <td className="px-6 py-3">₹{product.price.mrp}</td>
                    <td className="px-6 py-3">₹{product.price.sellingPrice}</td>
                    <td className="px-6 py-3 flex gap-2">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 bg-slate-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              disabled={page === totalPages}
              className="px-3 py-2 bg-slate-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
