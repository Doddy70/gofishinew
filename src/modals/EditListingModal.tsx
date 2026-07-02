"use client";

import axios from "axios";
import { useEditListingModal } from "@/store/useEditListingModalStore";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { categories } from "@/constants/Categories";
import CategoryCard from "@/components/listings/CategoryCard";
import CountrySelect from "@/components/listings/CountrySelect";
import useCountries, { Country } from "@/custom-hooks/useCountries";
import dynamic from "next/dynamic";
import Counter from "@/components/listings/Counter";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/listings/ImageUpload";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const STEPS = {
  CATEGORY: 0,
  LOCATION: 1,
  COUNTERS: 2,
  DETAILS: 3,
  IMAGES: 4,
  PRICE: 5,
};

export default function EditListingModal() {
  const { isOpen, close, listing } = useEditListingModal();
  const { getByValue } = useCountries();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [location, setLocation] = useState<null | Country>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [passengerCapacity, setPassengerCapacity] = useState(1);
  const [rodHoldersCount, setRodHoldersCount] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<null | File>(null);
  const [preview, setPreview] = useState<null | string>(null);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (listing && isOpen) {
      setCategory(listing.category);
      setLocation(getByValue(listing.locationValue));
      setPassengerCapacity(listing.passengerCapacity);
      setRodHoldersCount(listing.rodHoldersCount);
      setTitle(listing.title);
      setDescription(listing.description);
      setPrice(listing.price.toString());
      setPreview(listing.imageSrc);
      setStep(STEPS.CATEGORY);
    }
  }, [listing, isOpen, getByValue]);

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
      case STEPS.IMAGES:
        return "Perbarui foto perahu Anda";
      case STEPS.PRICE:
        return "Perbarui harga sewa per harinya";
      default:
        return "";
    }
  };

  const updateListing = async () => {
    if (!title || !description || !price || !location?.value || !category) {
      toast.error("Semua kolom wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("locationValue", location.value);
      formData.append("category", category);
      formData.append("boatType", category);
      formData.append("passengerCapacity", passengerCapacity.toString());
      formData.append("rodHoldersCount", rodHoldersCount.toString());
      if (image) formData.append("image", image);

      await axios.patch(`/api/listings/${listing?.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Perahu berhasil diperbarui");
      close();
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui perahu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title="Edit Data Perahu">
      <div className="mb-7 flex items-center justify-between text-sm text-gray-500">
        <span>Langkah {step + 1} dari 6</span>
        <span className="font-medium text-gray-700">{stepTitle()}</span>
      </div>

      <div className="min-h-55 flex items-center justify-center rounded-xl text-gray-400 px-6">
        {step === STEPS.CATEGORY && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {categories.map((item) => (
              <CategoryCard
                label={item.label}
                icon={item.icon}
                key={item.slug}
                onClick={() => setCategory(item.slug)}
                selected={category === item.slug}
              />
            ))}
          </div>
        )}

        {step === STEPS.LOCATION && (
          <div className="w-full space-y-2 py-6">
            <CountrySelect value={location} onChange={setLocation} />
            <div className="h-80 overflow-hidden border">
              <MapComponent center={location?.latlng || [51.505, -0.09]} />
            </div>
          </div>
        )}

        {step === STEPS.COUNTERS && (
          <div className="space-y-2">
            <Counter
              title="Kapasitas Penumpang"
              value={passengerCapacity}
              onChange={setPassengerCapacity}
            />
            <Counter
              title="Rod Holders"
              value={rodHoldersCount}
              onChange={setRodHoldersCount}
            />
          </div>
        )}

        {step === STEPS.DETAILS && (
          <div className="space-y-8 w-full">
            <Input label="Nama Kapal" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input as="textarea" label="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        )}

        {step === STEPS.IMAGES && (
          <ImageUpload onChange={(file) => {
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }} preview={preview} />
        )}

        {step === STEPS.PRICE && (
          <Input type="number" label="Harga (Rp)" value={price} onChange={(e) => setPrice(e.target.value)} />
        )}
      </div>

      <div className="mt-8 flex gap-3">
        {step > 0 && <Button onClick={() => setStep(step - 1)} variant="outline">Kembali</Button>}
        <Button loading={loading} onClick={() => step < STEPS.PRICE ? setStep(step + 1) : updateListing()}>
          {step === STEPS.PRICE ? "Simpan Perubahan" : "Selanjutnya"}
        </Button>
      </div>
    </Modal>
  );
}
