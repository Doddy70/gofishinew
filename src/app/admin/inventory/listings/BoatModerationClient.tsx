"use client";

import { useState } from "react";
import { approveListing, updateListing } from "@/server-actions/adminActions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  LuShip, 
  LuMapPin, 
  LuAnchor, 
  LuCalendarDays, 
  LuShieldCheck, 
  LuBan, 
  LuUser, 
  LuPencil, 
  LuVideo 
} from "react-icons/lu";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface BoatModerationClientProps {
  boats: any[];
}

export default function BoatModerationClient({ boats }: BoatModerationClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [editingBoat, setEditingBoat] = useState<any | null>(null);

  const onApprove = async (id: string) => {
    setLoading(id);
    try {
      const result = await approveListing(id);
      if (result.error) throw new Error(result.error);
      toast.success("Perahu berhasil disetujui");
    } catch (error: any) {
      toast.error(error.message || "Gagal menyetujui perahu");
    } finally {
      setLoading(null);
    }
  };

  const onUpdate = async () => {
    if (!editingBoat) return;
    setLoading(editingBoat.id);
    try {
      const result = await updateListing(editingBoat.id, editingBoat);
      if (result.error) throw new Error(result.error);
      toast.success("Data perahu diperbarui");
      setEditingBoat(null);
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui data");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <LuShip className="text-blue-500" /> Moderasi Inventaris Perahu
          </h1>
          <p className="text-gray-500 font-medium">Review dan validasi armada sewa perahu (Charter Boats) yang didaftarkan oleh Kapten.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {boats.map((boat: any) => (
          <div key={boat.id} className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden group">
            <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                {boat.status === "APPROVED" ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase tracking-widest">
                    <LuShieldCheck size={14} /> Approved
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-black uppercase tracking-widest">
                    <LuBan size={14} /> Menunggu Review
                  </span>
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {boat.status !== "APPROVED" && (
                  <Button 
                    onClick={() => onApprove(boat.id)}
                    loading={loading === boat.id}
                    className="flex-1 sm:flex-none px-6 py-2 bg-green-500 hover:bg-green-600"
                  >
                    Setujui Armada
                  </Button>
                )}
                <Button 
                    onClick={() => setEditingBoat(boat)}
                    className="flex-1 sm:flex-none px-6 py-2 bg-gray-900"
                >
                    <LuPencil className="mr-2" size={16} /> Edit Data
                </Button>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-none mb-1">{boat.title}</h2>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                    <LuUser className="text-gray-400" /> Kapten: <span className="font-bold text-gray-700">{boat.user?.name}</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <LuAnchor size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Kapten & Penumpang</p>
                      <p className="text-sm font-bold text-gray-900">{boat.captainName || "Belum ditentukan"}</p>
                      <p className="text-xs text-gray-500">Kapasitas Maksimal: {boat.passengerCapacity} Orang</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <LuMapPin size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Lokasi Keberangkatan</p>
                      <p className="text-sm font-bold text-gray-900">{boat.locationValue}</p>
                    </div>
                  </div>

                  {boat.videoUrl && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <LuVideo size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Video Profile</p>
                            <a href={boat.videoUrl} target="_blank" className="text-xs text-red-600 font-bold hover:underline">Tonton di YouTube</a>
                        </div>
                    </div>
                  )}

                  {(boat.engine1 || boat.engine2) && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <LuAnchor size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Spesifikasi Mesin</p>
                            <p className="text-xs text-gray-700 font-bold">{boat.engine1} {boat.engine2 ? `& ${boat.engine2}` : ""}</p>
                        </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Deskripsi Perahu</p>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">{boat.description}</p>
                  </div>

                  {boat.facilities && boat.facilities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {boat.facilities.map((f: string) => (
                            <span key={f} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                {f}
                            </span>
                        ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingBoat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <LuPencil /> Edit Data Perahu
            </h3>

            <div className="space-y-6">
              <Input
                label="Nama Perahu"
                value={editingBoat.title}
                onChange={(e: any) => setEditingBoat({ ...editingBoat, title: e.target.value })}
              />
              
              <Input
                as="textarea"
                label="Deskripsi"
                value={editingBoat.description}
                onChange={(e: any) => setEditingBoat({ ...editingBoat, description: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                    type="number"
                    label="Harga (Rp)"
                    value={editingBoat.price}
                    onChange={(e: any) => setEditingBoat({ ...editingBoat, price: e.target.value })}
                />
                <Input
                    type="number"
                    label="Kapasitas Penumpang"
                    value={editingBoat.passengerCapacity}
                    onChange={(e: any) => setEditingBoat({ ...editingBoat, passengerCapacity: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Mesin Utama (Engine 1)"
                    value={editingBoat.engine1 || ""}
                    onChange={(e: any) => setEditingBoat({ ...editingBoat, engine1: e.target.value })}
                />
                <Input
                    label="Mesin Kedua (Engine 2)"
                    value={editingBoat.engine2 || ""}
                    onChange={(e: any) => setEditingBoat({ ...editingBoat, engine2: e.target.value })}
                />
              </div>

              <Input
                label="YouTube Video URL"
                value={editingBoat.videoUrl || ""}
                onChange={(e: any) => setEditingBoat({ ...editingBoat, videoUrl: e.target.value })}
              />

              <div className="flex gap-3 pt-6">
                <Button 
                    onClick={() => setEditingBoat(null)}
                    className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                    Batal
                </Button>
                <Button 
                    onClick={onUpdate}
                    loading={loading === editingBoat.id}
                    className="flex-1 bg-blue-600"
                >
                    Simpan Perubahan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
