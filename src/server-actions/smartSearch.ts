"use server";

import { redirect } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getListings } from "@/services/listing";
import { FISHING_DOMAIN_KNOWLEDGE } from "@/services/knowledge";

/**
 * Chain: Smart Search to Recommendation Pipeline
 * 1. AI Extract -> 2. DB Verify -> 3. AI Recommend -> 4. Redirect
 */
export async function smartSearch(formData: FormData) {
  const query = formData.get("query") as string;
  if (!query) return;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    redirect(`/perahu?locationValue=${encodeURIComponent(query)}&error=no_api_key`);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // STEP 1: AI Parameter Extraction (Specialized)
    const extractionPrompt = `
      Anda adalah Pakar Strategi Mancing GoFishi. Tugas Anda adalah mengekstrak niat memancing dari query: "${query}".
      Pahami istilah seperti 'strike', 'jigging', 'popping', 'spot ikan', 'kapten handal'.
      Format output: JSON mentah (locationValue, category, fishingTech, targetFish, guests).
    `;
    const extractResult = await model.generateContent(extractionPrompt);
    const searchParams = JSON.parse(extractResult.response.text().replace(/```json|```/g, "").trim());

    // STEP 2: Database Verification
    const availableListings = await getListings({
      locationValue: searchParams.locationValue,
      category: searchParams.category,
    });

    // STEP 3: Specialized Recommendation Generation
    let explanation = "";
    if (availableListings.length > 0) {
      const recommendationPrompt = `
        Anda adalah Pakar Strategi Mancing GoFishi. Berikan saran ahli untuk query "${query}".
        Armada tersedia: ${JSON.stringify(availableListings.slice(0, 3))}.
        
        Gunakan gaya bahasa komunitas mancing Indonesia (ramah, pakar). 
        Sebutkan keunggulan teknis perahu (seperti kapasitas atau kesesuaian teknik).
        WAJIB tambahkan satu kalimat tentang keselamatan (Life Jacket/Cuaca).
        Max 3 kalimat.
      `;
      const recResult = await model.generateContent(recommendationPrompt);
      explanation = recResult.response.text();
    } else {
      explanation = "Wah, sepertinya spot ini sedang 'sepi' armada. Ingin saya carikan spot alternatif yang sedang 'hot' strike-nya?";
    }

    // STEP 4: Final Data Flow & Redirect
    const params = new URLSearchParams();
    if (searchParams.locationValue) params.set("locationValue", searchParams.locationValue);
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.fishingTech) params.set("fishingTech", searchParams.fishingTech);
    if (searchParams.targetFish) params.set("targetFish", searchParams.targetFish);
    if (searchParams.guests) params.set("guests", searchParams.guests.toString());
    
    params.set("ai_mode", "true");
    params.set("explanation", explanation);

    redirect(`/perahu?${params.toString()}`);

  } catch (error) {
    console.error("Chain Failure:", error);
    redirect(`/perahu?locationValue=${encodeURIComponent(query)}&ai_fallback=true`);
  }
}
