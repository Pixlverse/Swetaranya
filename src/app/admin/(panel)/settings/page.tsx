import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models";
import { PageHeader, Panel } from "@/components/admin/ui";
import { UserCreateForm, UserRow } from "@/components/admin/UserManagement";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await requireAdmin(["admin"]);
  await connectDB();
  const users = await AdminUser.find().sort({ active: -1, role: 1, name: 1 }).select("name email role active createdAt").lean();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Admin users and roles. Physicians can open medical reports; staff and admins cannot. Only admins can manage users. Role and status changes apply at the user's next sign-in."
      />
      <div className="grid gap-6 2xl:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <Panel title={`Users (${users.length})`}>
          <ul className="divide-y divide-nordic/10">
            {users.map((u) => (
              <UserRow
                key={u._id.toString()}
                user={{ id: u._id.toString(), name: u.name, email: u.email, role: u.role ?? "staff", active: u.active ?? true }}
                isSelf={u._id.toString() === session.user.id}
              />
            ))}
          </ul>
        </Panel>
        <Panel title="Add a user">
          <UserCreateForm />
        </Panel>
      </div>
    </>
  );
}
