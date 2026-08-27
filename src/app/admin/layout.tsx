import { AdminAIAssistant } from "@/components/admin-ai-assistant";
import { AdminGuard } from "@/components/admin-guard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#0A0A0A]">
                {children}
                <AdminAIAssistant />
            </div>
        </AdminGuard>
    );
}
