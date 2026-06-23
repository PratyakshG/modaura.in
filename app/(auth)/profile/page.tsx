"use client";

import { logout } from "@/lib/actions";
import { Address } from "@/types/index";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    pincode: "",
    street: "",
    city: "",
    state: "",
    locality: "",
    landmark: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? "/api/user/addresses" : "/api/user/addresses";
      const method = editingId ? "PUT" : "POST";
      const payload = editingId
        ? { ...formData, addressId: editingId }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchAddresses();
        setFormData({
          name: "",
          phone_number: "",
          pincode: "",
          street: "",
          city: "",
          state: "",
          locality: "",
          landmark: "",
        });
        setShowAddForm(false);
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch("/api/user/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId }),
      });

      if (res.ok) {
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      name: address.name,
      phone_number: address.phone_number,
      pincode: address.pincode,
      street: address.street,
      city: address.city,
      state: address.state,
      locality: address.locality || "",
      landmark: address.landmark || "",
    });
    setEditingId(address._id.toString());
    setShowAddForm(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: "",
      phone_number: "",
      pincode: "",
      street: "",
      city: "",
      state: "",
      locality: "",
      landmark: "",
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-start gap-10 py-10 px-4">
      <h1 className="text-3xl lg:text-4xl font-semibold">
        Personal Information
      </h1>

      {/* Personal Info Section */}
      <form className="bg-neutral-200 w-full lg:w-1/3 flex flex-col gap-5 rounded-2xl p-5 lg:p-10 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="py-3 flex flex-col rounded-lg">
            <span>Hello,</span>
            <span className="font-medium text-2xl">{session?.user.name}</span>
          </div>
          <Image
            src={
              session?.user.image ? session?.user.image : "/public/globe.svg"
            }
            alt="user-image"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        <div className="flex flex-col">
          <span className="pl-2">Email</span>
          <span className="px-5 py-3 bg-white rounded-lg">
            {session?.user.email}
          </span>
        </div>
      </form>

      {/* Addresses Section */}
      <div className="bg-neutral-200 w-full lg:w-1/3 rounded-2xl p-5 lg:p-10 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Saved Addresses</h2>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              + Add Address
            </button>
          )}
        </div>

        {/* Add/Edit Address Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddAddress}
            className="bg-white rounded-lg p-4 mb-6 border border-gray-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="pl-2 font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="pl-2 font-medium mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="pl-2 font-medium mb-1">Pincode *</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="pl-2 font-medium mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="pl-2 font-medium mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="pl-2 font-medium mb-1">State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="pl-2 font-medium mb-1">Locality</label>
                <input
                  type="text"
                  value={formData.locality}
                  onChange={(e) =>
                    setFormData({ ...formData, locality: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="pl-2 font-medium mb-1">Landmark</label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) =>
                    setFormData({ ...formData, landmark: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4 *:rounded-md">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition font-medium"
              >
                {editingId ? "Update Address" : "Add Address"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-400 text-white hover:bg-gray-500 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Addresses List */}
        {loading ? (
          <p className="text-center py-4">Loading addresses...</p>
        ) : addresses.length === 0 ? (
          <p className="text-center py-4 text-gray-600">
            No addresses saved yet.
          </p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address: Address) => (
              <div
                key={address._id.toString()}
                className="bg-white p-4 rounded-lg border border-gray-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{address.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {address.street}
                      {address.locality && `, ${address.locality}`}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    {address.landmark && (
                      <p className="text-gray-600 text-sm">
                        Landmark: {address.landmark}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mt-2">
                      Phone: {address.phone_number}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteAddress(address._id.toString())
                      }
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sign Out Button */}
      <div className="w-full flex items-center justify-center gap-2 *:rounded-md">
        <button
          onClick={async () => {
            await logout().then(() => router.push("/"));
          }}
          className="text-shadow font-medium border max-sm:w-full py-2 px-5 bg-red-400 text-white hover:bg-red-500 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
