"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, Truck } from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalShipments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalShipments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, usersRes, shipmentsRes] = await Promise.all([
          fetch("/api/admin/products?limit=1"),
          fetch("/api/admin/orders?limit=1"),
          fetch("/api/admin/users?limit=1"),
          fetch("/api/admin/shipments?limit=1"),
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const usersData = await usersRes.json();
        const shipmentsData = await shipmentsRes.json();

        setStats({
          totalProducts: productsData.pagination?.total || 0,
          totalOrders: ordersData.pagination?.total || 0,
          totalUsers: usersData.pagination?.total || 0,
          totalShipments: shipmentsData.pagination?.total || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }) => (
    <div className={`${color} rounded-lg p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="opacity-20">{Icon}</div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-slate-600 mb-8">Welcome to your admin panel</p>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Loading statistics...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<Package size={40} />}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCart size={40} />}
            color="bg-green-500"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users size={40} />}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Shipments"
            value={stats.totalShipments}
            icon={<Truck size={40} />}
            color="bg-orange-500"
          />
        </div>
      )}

      <div className="mt-12 bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-bold mb-4">Quick Start</h2>
        <ul className="space-y-2 text-slate-600">
          <li>
            ✓ Navigate to <strong>Products</strong> to manage your product catalog
          </li>
          <li>
            ✓ Check <strong>Orders</strong> to view and update customer orders
          </li>
          <li>
            ✓ Manage <strong>Users</strong> and assign admin roles
          </li>
          <li>
            ✓ Track <strong>Shipments</strong> and delivery status
          </li>
        </ul>
      </div>
    </div>
  );
}
