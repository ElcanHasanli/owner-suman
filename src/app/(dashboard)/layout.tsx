import { AuthGuard } from "@/components/AuthGuard";
import { AppShell } from "@/components/AppShell/AppShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
