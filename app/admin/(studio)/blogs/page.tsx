import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BlogsTable } from "@/components/admin/blogs/BlogsTable";
import { listStudioBlogs } from "@/lib/experience/services/blogListService";

export default async function AdminBlogsPage() {
  const blogs = await listStudioBlogs();

  return (
    <div>
      <AdminPageHeader
        title="Blogs"
        description="Sync WordPress post metadata, then open Blog Studio to configure presentation. Article content is never edited here."
      />
      <BlogsTable initialBlogs={blogs} />
    </div>
  );
}
