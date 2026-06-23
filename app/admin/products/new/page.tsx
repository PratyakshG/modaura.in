"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  details: string;
  price: {
    mrp: number;
    sellingPrice: number;
  };
  images: string[];
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    description: "",
    details: "",
    price: { mrp: 0, sellingPrice: 0 },
    images: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".") as [
        keyof ProductFormData,
        string,
      ];
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] as Record<string, unknown>),
          [child]: isNaN(Number(value)) ? value : Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.name ||
        !formData.category ||
        !formData.description ||
        !formData.details
      ) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (formData.images.length === 0) {
        toast.error("Please add at least one image");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create product");

      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (error) {
      console.log(error);
      toast.error(`Failed to create product.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
      <p className="text-slate-600 mb-8">
        Create a new product in your catalog
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-8 max-w-2xl"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Details *</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">MRP *</label>
              <input
                type="number"
                name="price.mrp"
                value={formData.price.mrp}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Selling Price *
              </label>
              <input
                type="number"
                name="price.sellingPrice"
                value={formData.price.sellingPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Images *</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Image URL..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-100 p-2 rounded"
                >
                  <span className="text-sm truncate">{image}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
