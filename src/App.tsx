/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Sparkles, Loader2, Check, ArrowRight, ExternalLink } from "lucide-react";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = "Anda adalah Copywriter RayWeb. Tugas: Ubah input nama kue dan deskripsi singkat menjadi caption Instagram yang memancing hook, sertakan 3 hashtag relevan. Tone: Mengajak dan hangat. Gunakan suhu (temperature) 0.2 untuk menjaga konsistensi format.";

const TEST_CASES = [
  "Web POS System, Ringan, Murah",
  "Web School System, Teratur, Aman",
  "Monitoring System, Aman, Transparant"
];

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateContent = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setOutput(""); // Reset output before starting

    // Create a promise that rejects after 15 seconds
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), 15000)
    );

    try {
      // Race the AI request against the 15-second timeout
      const result = await Promise.race([
        ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: input,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.2,
          }
        }),
        timeoutPromise
      ]) as any;
      
      setOutput(result.text || "Terjadi kesalahan saat membuat konten.");
    } catch (error: any) {
      console.error("Generate Error:", error);
      if (error.message === "TIMEOUT") {
        setOutput("❌ Gagal: Waktu habis (lebih dari 15 detik). Silakan coba lagi.");
      } else {
        setOutput("Maaf, terjadi gangguan pada AI. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-brand-black font-sans selection:bg-brand-red selection:text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-100 px-8 py-5 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-black flex items-center justify-center shadow-lg shadow-black/10">
            <Sparkles className="text-brand-red w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-extrabold tracking-tight">RayWeb</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-8 mr-8 text-sm font-semibold text-gray-500">
            <a href="#" className="hover:text-brand-red transition-colors">Features</a>
            <a href="#" className="hover:text-brand-red transition-colors">Enterprise</a>
            <a href="#" className="hover:text-brand-red transition-colors">API</a>
          </div>
          <button className="px-5 py-2.5 bg-brand-red text-white rounded-full text-sm font-bold shadow-lg shadow-brand-red/20 hover:scale-105 active:scale-95 transition-all">
            Get Pro
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-8 py-16 md:py-28">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          
          {/* Left Column: Hero & Input */}
          <div className="space-y-12">
            <header className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                Next-Gen Copywriting
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-display font-extrabold tracking-tight leading-[0.9]"
              >
                AI <span className="text-brand-red underline decoration-8 decoration-brand-red/10 underline-offset-8">Workflow</span> for IG.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-500 max-w-md leading-relaxed"
              >
                Ubah spesifikasi teknis menjadi caption Instagram yang berkelas dan persuasif.
              </motion.p>
            </header>

            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="group relative">
                <textarea
                  className="w-full h-56 bg-gray-50/50 border-2 border-gray-100 rounded-3xl p-8 focus:bg-white focus:border-brand-red transition-all outline-none text-xl font-medium resize-none shadow-sm group-hover:border-gray-200"
                  placeholder="Detail website..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="absolute top-6 right-8 opacity-20 group-focus-within:opacity-100 transition-opacity">
                  <Sparkles className="w-6 h-6 text-brand-red" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={generateContent}
                  disabled={loading || !input.trim()}
                  className="flex-1 py-5 bg-brand-black text-white rounded-full font-bold flex items-center justify-center gap-3 hover:bg-brand-red active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-black/10"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  {loading ? 'Crafting Content...' : 'Generate Copy Now'}
                </button>
                
                <div className="flex gap-2 p-1.5 bg-gray-100 rounded-full">
                  {TEST_CASES.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(t)}
                      className="px-4 py-3 text-[10px] uppercase font-black tracking-widest text-gray-400 hover:text-brand-black hover:bg-white rounded-full transition-all"
                      title={t}
                    >
                      Case {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column: Output Showcase */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-32"
          >
            <div className="relative group">
              {/* Card Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-red/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className={`relative bg-white border-2 border-brand-black rounded-[40px] p-10 min-h-[500px] flex flex-col shadow-2xl transition-all ${output ? 'border-brand-red shadow-brand-red/5' : 'bg-gray-50/50'}`}>
                
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-brand-red" />
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-brand-black opacity-30">
                      Output.
                    </span>
                  </div>
                  {output && (
                    <button
                      onClick={copyToClipboard}
                      className="group/btn relative px-6 py-2 bg-brand-black text-white rounded-full text-xs font-bold hover:bg-brand-red transition-colors flex items-center gap-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {output ? (
                      <motion.div
                        key="output"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-brand-black text-lg leading-relaxed font-semibold whitespace-pre-wrap selection:bg-brand-black selection:text-white"
                      >
                        {output}
                      </motion.div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-10 py-12">
                        <div className="w-20 h-20 border-4 border-dashed border-brand-black rounded-full flex items-center justify-center mb-6 animate-[spin_10s_linear_infinite]">
                          <Sparkles className="w-8 h-8" />
                        </div>
                        <p className="text-xl font-bold font-display max-w-[200px]">Waiting for your input...</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-300">
                  <span>IG Ready Format</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-brand-red" />
                    <div className="w-1 h-1 rounded-full bg-brand-black" />
                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 mt-20 bg-brand-black text-white pt-20 pb-10 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <Sparkles className="text-brand-red w-5 h-5" />
                </div>
                <span className="text-2xl font-display font-extrabold">RayWeb</span>
              </div>
              <p className="text-gray-400 max-w-sm font-medium">
                Solusi cerdas untuk automasi alur kerja pemasaran digital Anda. Didukung oleh AI mutakhir untuk hasil yang fenomenal.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-red">Product</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Generator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Schedule</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-red">Company</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-loose">
              © 2024 RAYWEB SYSTEMS INC. <br className="md:hidden" /> ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white">Twitter</a>
              <a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white">Instagram</a>
              <a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
