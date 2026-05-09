import AdminClient from "./AdminClient";

export const metadata = {
  title: "Gestion de obras | Alejandra Stier",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminClient />;
}
