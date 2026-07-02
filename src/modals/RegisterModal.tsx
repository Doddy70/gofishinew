"use client";

import { useAuthModal } from "@/store/useAuthModalStore";
import Modal from "./Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { registerSchema, type RegisterValues } from "@/lib/validations/auth";

type RegisterErrors = Partial<Record<keyof RegisterValues, string>>

export default function RegisterModal() {
  const { isRegisterOpen, closeRegister, openLogin } = useAuthModal();
  const [values,setValues] = useState<RegisterValues>({
    name:"",
    email:"",
    password:""
  });

  const [errors,setErrors] = useState<RegisterErrors>({});
  const [loading,setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name,value} = e.target;

    setValues((prev) => ({
      ...prev,
      [name]:value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]:undefined
    }))
  }

  const validate = () => {
    const result = registerSchema.safeParse(values);
    
    if (!result.success) {
      const newErrors: RegisterErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof RegisterValues;
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  const onSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    if(!validate()) return;

    setLoading(true);

    try {
      const {error} = await authClient.signUp.email({
        email:values.email,
        name:values.name,
        password:values.password
      }, {
        onError: (ctx) => {
          console.error('REGISTRATION ERROR:', ctx.error);
          toast.error(ctx.error.message || "Gagal membuat akun");
        }
      });
      
      if(error){
        toast(error.message as string,{
           style:{
            background:"#FF5A5F",
            color:"white"
          }
        });
        return;
      }

      toast("Pendaftaran berhasil",{
           style:{
            background:"#FF5A5F",
            color:"white"
          }
        });
        setValues({name:"",email:"",password:""});
        closeRegister();
        window.location.href = "/dashboard";
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",{
          style:{
            background:"#FF5A5F",
            color:"white"
          }
        }
      )      
    } finally {
      setLoading(false);
    }
  }

  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      toast("Google signin failed", {
        style: {
          background: "#FF5A5F",
          color: "white",
        },
      });
    }
  };

  return (
    <Modal title="Masuk atau daftar" isOpen={isRegisterOpen} onClose={closeRegister}>
      <div className="flex flex-col gap-6 p-2 md:p-4">
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Selamat datang di GoFishi
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">Buat akun untuk mulai menjelajahi spot pancing terbaik.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
             <div className="p-3 border-b border-gray-300 bg-gray-50/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</p>
                <input 
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Nama sesuai identitas"
                  className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-300"
                />
                {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.name}</p>}
             </div>
             <div className="p-3 border-b border-gray-300">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                <input 
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="name@email.com"
                  className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-300"
                />
                {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.email}</p>}
             </div>
             <div className="p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kata Sandi</p>
                <input 
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-300"
                />
                {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.password}</p>}
             </div>
          </div>

          <p className="text-[10px] text-gray-500 leading-relaxed px-1">
            Kami akan mengirimkan email konfirmasi untuk memverifikasi akun Anda sesuai dengan standar keamanan global.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-black rounded-xl hover:bg-orange-600 transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {loading ? "Mendaftar..." : "Setuju dan Lanjutkan"}
          </button>

          {/* divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">atau</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="space-y-3">
             <button 
                type="button"
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-4 py-3 border-2 border-gray-900 rounded-xl hover:bg-gray-50 transition text-sm font-black text-gray-900"
             >
                <FcGoogle size={22} /> Daftar dengan Google
             </button>
             <button 
                type="button"
                className="w-full flex items-center justify-center gap-4 py-3 border-2 border-gray-900 rounded-xl hover:bg-gray-50 transition text-sm font-black text-gray-900"
             >
                <FaFacebook className="text-blue-600" size={22} /> Daftar dengan Facebook
             </button>
          </div>

          {/* footer */}
          <p className="text-gray-500 text-center text-xs mt-6 leading-relaxed">
            Sudah punya akun?{" "}
            <span
              onClick={openLogin}
              className="text-gray-900 cursor-pointer font-black underline hover:text-primary transition"
            >
              Masuk
            </span>
          </p>
        </form>
      </div>
    </Modal>
  );
}
