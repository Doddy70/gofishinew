"use client";

import axios from "axios"
import dynamic from "next/dynamic";
import { useCreateListingModal } from "@/store/useCreateListingModal";
import Modal from "./Modal";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { categories } from "@/constants/Categories";
import CategoryCard from "@/components/listings/CategoryCard";
import LocationSelect from "@/components/listings/LocationSelect";
import Counter from "@/components/listings/Counter";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/listings/ImageUpload";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LuVideo } from "react-icons/lu";

const STEPS = {
  CATEGORY: 0,
  LOCATION: 1,
  COUNTERS: 2,
  DETAILS: 3,
  LEGAL_DOCS: 4,
  IMAGES: 5,
  PRICE: 6,
};

export default function CreateListingModal() {
  const { isOpen, close } = useCreateListingModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [locationValue, setLocationValue] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [passengerCapacity, setPassengerCapacity] = useState(1);
  const [rodHoldersCount, setRodHoldersCount] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<null | File>(null);
  const [preview, setPreview] = useState<null | string>(null);
  const [legalDoc, setLegalDoc] = useState<null | File>(null);
  const [legalPreview, setLegalPreview] = useState<null | string>(null);
  const [price, setPrice] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading,setLoading] = useState(false);

  const router = useRouter();

  const MapComponent = dynamic(
    () => import("../components/general/map/MapComponent"),
    {
      ssr: false,
      loading: () => <p className="text-center py-6">Memuat peta...</p>,
    },
  );

  const stepTitle = () => {
    switch (step) {
      case STEPS.CATEGORY:
        return "Pilih jenis perahu Anda";
      case STEPS.LOCATION:
        return "Dimana perahu Anda bersandar?";
      case STEPS.COUNTERS:
        return "Spesifikasi & Kapasitas Perahu";
      case STEPS.DETAILS:
        return "Ceritakan lebih lanjut tentang perahu Anda";
      case STEPS.LEGAL_DOCS:
        return "Unggah Dokumen Legalitas (Grosse Akta / Pas Kecil)";
      case STEPS.IMAGES:
        return "Unggah foto-foto perahu Anda";
      case STEPS.PRICE:
        return "Berapa harga sewa per harinya?";
      default:
        return "";
    }
  };

  const handleImageChange = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const createListing = async () => {
    if (
      !title ||
      !description ||
      !price ||
      !locationValue ||
      !category ||
      !image
    ) {
      toast("Semua kolom wajib diisi!", {
        style: {
          background: "#FF5A5F",
          color: "white",
        },
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      
      formData.append("title",title);
      formData.append("description",description);
      formData.append("price",price);
      formData.append("locationValue",locationValue);
      formData.append("category",category);
      formData.append("boatType", category);
      formData.append("videoUrl", videoUrl);
      formData.append("passengerCapacity", passengerCapacity.toString());
      formData.append("rodHoldersCount", rodHoldersCount.toString());
      formData.append("image",image);
      if (legalDoc) formData.append("legalDoc", legalDoc);

      await axios.post("/api/listings",formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      });

       toast("Perahu berhasil didaftarkan", {
        style: {
          background: "#FF5A5F",
          color: "white",
        },
      });  

      handleClose();
      router.replace("/properties");

    } catch (error) {
      if(axios.isAxiosError(error)){
         toast(error.response?.data.error || "Terjadi kesalahan", {
        style: {
          background: "#FF5A5F",
          color: "white",
        },
      });        
      }            
    } finally {
      setLoading(false)
    }
  };

  const handleClose = () => {
    setCategory("")
    setPrice("");
    setPassengerCapacity(1);
    setRodHoldersCount(0);
    setLocationValue("");
    setVideoUrl("");
    setTitle("");
    setDescription("");
    setImage(null);
    setPreview(null);
    setLegalDoc(null);
    setLegalPreview(null);
    setStep(STEPS.CATEGORY);
    close();
  }
  return (
    <Modal isOpen={isOpen} onClose={close} title="Daftar Perahu Baru">
      {/* step indicator */}
      <div className="mb-7 flex items-center justify-between text-sm text-gray-500">
        <span>Langkah {step + 1} dari 7</span>
        <span className="font-medium text-gray-700">{stepTitle()}</span>
      </div>

      <div className="min-h-55 flex items-center justify-center rounded-xl text-gray-400 px-6">
        {step === STEPS.CATEGORY && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {categories.map((item) => {
              return (
                <CategoryCard
                  label={item.label}
                  icon={item.icon}
                  key={item.slug}
                  onClick={() => setCategory(item.slug)}
                  selected={category === item.slug}
                />
              );
            })}
          </div>
        )}

        {step === STEPS.LOCATION && (
          <div className="w-full space-y-6 py-6">
            <LocationSelect
              value={locationValue}
              onChange={(value) => setLocationValue(value)}
            />
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white h-fit">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900">Kebijakan Lokasi</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Saat ini GoFishi hanya melayani area Jakarta dan Kepulauan Seribu. Pilih dermaga yang paling dekat dengan lokasi sandar kapal Anda.
                    </p>
                </div>
            </div>
          </div>
        )}

        {step === STEPS.COUNTERS && (
          <div className="space-y-2">
            <Counter
              title="Kapasitas Penumpang"
              subtitle="Berapa tamu yang bisa ikut?"
              value={passengerCapacity}
              onChange={setPassengerCapacity}
            />
            <Counter
              title="Rod Holders"
              subtitle="Jumlah tempat menaruh joran pancing?"
              value={rodHoldersCount}
              onChange={setRodHoldersCount}
            />
          </div>
        )}

        {step === STEPS.DETAILS && (
          <div className="space-y-10 w-full text-gray">
            <Input
              name="title"
              label="Nama Kapal (Title)"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(e.target.value);
              }}
            />
            <Input
              as="textarea"
              name="description"
              label="Deskripsi Kapal (Fasilitas & Keunggulan)"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setDescription(e.target.value);
              }}
            />
            
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <LuVideo className="text-red-600" /> YouTube Video Profile (Opsional)
                </label>
                <Input
                    name="videoUrl"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVideoUrl(e.target.value);
                    }}
                />
                <p className="text-[10px] text-gray-400">Masukkan link video youtube untuk menampilkan profil video perahu Anda.</p>
            </div>
          </div>
        )}

        {step === STEPS.LEGAL_DOCS && (
          <div className="space-y-4 w-full">
            <p className="text-sm text-gray-600 mb-2">Mohon unggah dokumen legalitas (Grosse Akta / Pas Kecil) demi keamanan bersama.</p>
            <ImageUpload onChange={(file) => {
              setLegalDoc(file);
              setLegalPreview(URL.createObjectURL(file));
            }} preview={legalPreview} />
          </div>
        )}

        {step === STEPS.IMAGES && (
          <ImageUpload onChange={handleImageChange} preview={preview} />
        )}

        {step === STEPS.PRICE && (
          <Input
            min={10}
            type="number"
            name="price"
            label="Harga (Rp)"
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPrice(e.target.value);
            }}
          />
        )}
      </div>

      {/* footer */}
      <div className="mt-8 flex gap-3">
        {step > STEPS.CATEGORY && (
          <Button onClick={() => setStep((prev) => prev - 1)} variant="outline">
            Kembali
          </Button>
        )}

        <Button
        loading={loading}
        disabled={loading}
          onClick={() =>
            step < STEPS.PRICE ? setStep((prev) => prev + 1) : createListing()
          }
        >
          {step === STEPS.PRICE ? "Daftarkan Perahu" : "Selanjutnya"}
        </Button>
      </div>
    </Modal>
  );
}
