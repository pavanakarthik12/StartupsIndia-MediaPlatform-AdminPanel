import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { FilterBar } from "@/components/common/FilterBar";
import { Pagination } from "@/components/common/Pagination";

export function Articles() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Articles</h1>
        <p className="text-sm text-muted-foreground">Create, review, and publish startup stories.</p>
      </div>

      <FilterBar placeholder="Search articles, sources, categories..." />

      <Card>
        <Table>
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Headline</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Likes</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-t border-border">
              <td className="px-4 py-3">Skyroot Aerospace raises Series B</td>
              <td className="px-4 py-3">Funding</td>
              <td className="px-4 py-3">Published</td>
              <td className="px-4 py-3">312</td>
              <td className="px-4 py-3">Edit</td>
            </tr>
          </tbody>
        </Table>
      </Card>

      <Pagination page={1} total={12} onPageChange={() => {}} />
    </div>
  );
}
