import AdminLayout from "@/components/admin/AdminLayout";
export const metadata = {
  title: "Green Mart. - Admin",
  description: "Green Mart. - Admin",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}
