import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 min-h-screen bg-slate-50">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
