import { getAllUsers } from "@/server-actions/getAllUsers";
import UserClient from "./UserClient";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kelola Pengguna</h1>
        <p className="text-gray-500">Daftar semua pengguna terdaftar di platform GoFishi.</p>
      </div>
      
      <UserClient users={users as any} />
    </div>
  );
}
