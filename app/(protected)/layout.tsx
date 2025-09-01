import SideNav from "@/components/navigation/SideNav";
import { getCurrentUser } from "@/lib/db-actions";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <SideNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
