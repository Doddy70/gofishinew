"use client";

import Image from "next/image";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

const BLOG_POSTS = [
    {
        id: "1",
        title: "5 Spot Mancing Terbaik di Kepulauan Seribu",
        excerpt: "Temukan lokasi-lokasi rahasia yang sering menjadi sarang ikan predator besar di gugusan Kepulauan Seribu.",
        image: "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?q=80&w=800&auto=format&fit=crop",
        date: "12 Jun 2026",
        category: "Tips & Trik"
    },
    {
        id: "2",
        title: "Mengenal Teknik Jigging untuk Pemula",
        excerpt: "Panduan lengkap memulai teknik jigging, dari pemilihan umpan hingga cara mengayunkan joran dengan benar.",
        image: "https://images.unsplash.com/photo-1544551763-47a0159f9234?q=80&w=800&auto=format&fit=crop",
        date: "08 Jun 2026",
        category: "Edukasi"
    },
    {
        id: "3",
        title: "Waktu Terbaik Memancing di Musim Hujan",
        excerpt: "Jangan biarkan hujan menghentikan hobi Anda. Berikut panduan aman dan efektif memancing saat cuaca kurang bersahabat.",
        image: "https://images.unsplash.com/photo-1508182314998-3bd49473002f?q=80&w=800&auto=format&fit=crop",
        date: "01 Jun 2026",
        category: "Panduan Cuaca"
    }
];

export default function BlogSection() {
    return (
        <div className="py-12 mt-12 border-t border-default">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">
                        Blog & Artikel Terbaru
                    </h2>
                    <p className="text-muted font-light mt-2">
                        Tingkatkan wawasan memancing Anda dengan artikel pilihan dari para ahli.
                    </p>
                </div>
                <Link href="/blogs" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline">
                    Lihat Semua <LuArrowRight size={18} />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BLOG_POSTS.map((post) => (
                    <Link href={`/blogs/${post.id}`} key={post.id} className="group cursor-pointer flex flex-col gap-3">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted/20">
                            <Image 
                                src={post.image} 
                                alt={post.title} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-soft">
                                <span className="text-[12px] font-bold text-ink">{post.category}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted font-medium">{post.date}</span>
                            <h3 className="font-bold text-[16px] text-ink line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-[14px] text-muted line-clamp-2 mt-1">
                                {post.excerpt}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
            
            <Link href="/blogs" className="md:hidden mt-6 flex items-center justify-center gap-2 text-primary font-medium hover:underline w-full p-3 border border-default rounded-xl">
                Lihat Semua Artikel <LuArrowRight size={18} />
            </Link>
        </div>
    );
}
