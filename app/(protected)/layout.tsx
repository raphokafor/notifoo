import SideNav from "@/components/navigation/SideNav";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      <SideNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
