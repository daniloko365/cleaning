import type { Metadata } from "next";
import Link from "next/link";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = { title: "Operations", robots: { index: false, follow: false }, alternates: { canonical: "/admin" } };

export default function AdminPage() {
  return <main className="admin-page"><div className="admin-back"><Link href="/">← Public site</Link></div><AdminDashboard /></main>;
}
