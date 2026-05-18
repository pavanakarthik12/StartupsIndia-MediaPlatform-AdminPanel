import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { FilterBar } from "@/components/common/FilterBar";

export function Users() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">Audit and moderate user accounts.</p>
      </div>

      <FilterBar placeholder="Search by name, email, role..." />

      <Card>
        <Table>
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-t border-border">
              <td className="px-4 py-3">Aditi Sharma</td>
              <td className="px-4 py-3">aditi@startup.in</td>
              <td className="px-4 py-3">Founder</td>
              <td className="px-4 py-3">Active</td>
              <td className="px-4 py-3">View</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
