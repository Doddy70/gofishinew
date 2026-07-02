"use client";
import Modal from "./Modal";
import { useAuthModal } from "@/store/useAuthModalStore";
import Button from "@/components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Input from "@/components/ui/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

import { loginSchema, type LoginValues } from "@/lib/validations/auth";

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

export default function LoginModal() {
  const { isLoginOpen, closeLogin, openRegister } = useAuthModal();

  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validate = () => {
    const result = loginSchema.safeParse(values);
    
    if (!result.success) {
      const newErrors: LoginErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof LoginValues;
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      }, {
        onSuccess: (ctx) => {
          if (ctx.data.twoFactorRedirect) {
            router.push("/two-factor");
            closeLogin();
          } else {
            toast("Berhasil masuk", {
              style: {
                background: "#FF5A5F",
                color: "white",
              },
            });
            setValues({ email: "", password: "" });
            closeLogin();
            window.location.href = "/dashboard";
          }
        }
      });
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
        {
          style: {
            background: "#FF5A5F",
            color: "white",
          },
        },
      );
    } finally {
      setLoading(false);
    }
  };

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
    <Modal onClose={closeLogin} isOpen={isLoginOpen} title="Masuk atau daftar">
      <div data-testid="login-modal" className="flex flex-col gap-6 p-2 md:p-4">
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Selamat datang di GoFishi
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">Temukan armada terbaik untuk petualangan pancing Anda.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
             <div className="p-3 border-b border-gray-300 bg-gray-50/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Negara/Wilayah</p>
                <p className="text-sm font-medium text-gray-900">Indonesia (+62)</p>
             </div>
             <div className="p-3">
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
          </div>

          <div className="p-3 border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kata Sandi</p>
             <input 
               name="password"
               type="password"
               value={values.password}
               onChange={handleChange}
               placeholder="******"
               className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-300"
             />
             {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-black rounded-xl hover:bg-orange-600 transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {loading ? "Menghubungkan..." : "Lanjutkan"}
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
                <FcGoogle size={22} /> Lanjutkan dengan Google
             </button>
             <button 
                type="button"
                className="w-full flex items-center justify-center gap-4 py-3 border-2 border-gray-900 rounded-xl hover:bg-gray-50 transition text-sm font-black text-gray-900"
             >
                <FaFacebook className="text-blue-600" size={22} /> Lanjutkan dengan Facebook
             </button>
          </div>

          {/* footer */}
          <p className="text-gray-500 text-center text-xs mt-6 leading-relaxed">
            Belum punya akun?{" "}
            <span
              onClick={openRegister}
              className="text-gray-900 cursor-pointer font-black underline hover:text-primary transition"
            >
              Daftar sekarang
            </span>
          </p>
        </form>
      </div>
    </Modal>
  );
}
