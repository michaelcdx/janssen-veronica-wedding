import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronDown, User, Phone, MessageSquare } from 'lucide-react';
import heroBg from './assets/hero-bg-2.png';
import ConfirmedRSVP from './ConfirmedRSVP';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { scrollY } = useScroll();
  
  // Parallax and scroll effects
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const contentY = useTransform(scrollY, [0, 500], [0, -100]);

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!rsvpData.name.trim()) {
      setNameError(true);
      hasError = true;
    }
    if (!rsvpData.phone.trim()) {
      setPhoneError(true);
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbxSxdpml_yhwgaKS_kTMlzL7IeKOhbPSMSzfvKXblQ88SCGSeAOcZXKV7RIEaZDdqLJ6w/exec',
        {
          method: 'POST',
          body: JSON.stringify({
            name: rsvpData.name,
            phone: rsvpData.phone,
            message: rsvpData.message
          })
        }
      );

      const result = await response.json();
      if (result.status === 'success') {
        setIsSubmitted(true);
      } else {
        alert('Terjadi kesalahan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-zinc-300 overflow-x-hidden selection:bg-gold-500/30">
      {/* Noise Texture Overlay */}
      <div className="noise" />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 1.5, ease: "circOut" }}
        className="fixed top-0 left-0 w-full z-50 py-8 px-8 md:px-20 flex justify-between items-center mix-blend-difference"
      >
        <div className="hidden md:flex gap-12">
          <a href="#couple" className="nav-link !text-white text-[10px]">Mempelai</a>
          <a href="#details" className="nav-link !text-white text-[10px]">Acara</a>
        </div>
        
        <div className="text-2xl font-serif tracking-[0.3em] text-white">
          J <span className="text-gold-500">&</span> V
        </div>

        <div className="flex gap-12">
          <a href="#rsvp" className="nav-link !text-white text-[10px] hidden md:block">RSVP</a>
          <div className="w-6 h-6 flex flex-col justify-center gap-1.5 cursor-pointer group">
            <div className="w-full h-[1px] bg-white group-hover:bg-gold-500 transition-colors" />
            <div className="w-2/3 h-[1px] bg-white self-end group-hover:bg-gold-500 transition-colors" />
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Framer Motion Parallax */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <motion.img 
            initial={{ scale: 1.2, filter: 'brightness(0) blur(20px)' }}
            animate={isLoaded ? { scale: 1, filter: 'brightness(0.5) blur(0px)' } : {}}
            transition={{ duration: 3, ease: [0.4, 0, 0.2, 1] }}
            src={heroBg} 
            alt="Wedding Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]" />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          style={{ y: contentY }}
          className="relative z-10 text-center space-y-8 px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          >
            <span className="gold-shimmer tracking-[0.6em] uppercase text-[10px] mb-6 block">Save the Date</span>
            <h1 className="text-5xl md:text-[100px] font-serif leading-tight text-white tracking-tighter">
              Janssen <br className="md:hidden" />
              <span className="italic font-normal serif text-gold-500/80 md:mx-4 md:text-[80px]">&</span>
              Veronica
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 2, ease: "easeOut" }}
            className="flex flex-col items-center gap-4"
          >
            <div className="h-[1px] w-20 bg-gold-500/30" />
            <p className="text-lg md:text-xl font-serif italic text-zinc-400 tracking-widest">
              26 September 2026 • Batam, Indonesia
            </p>
            <div className="h-[1px] w-20 bg-gold-500/30" />
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 3 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown size={20} className="text-gold-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* Quote Section - Full Screen */}
      <section className="h-screen bg-[#0a0a0a] flex items-center justify-center text-center px-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          className="max-w-4xl mx-auto space-y-10 relative z-10"
        >
          <motion.p 
            initial={{ opacity: 0.2, filter: 'blur(8px)', scale: 0.95 }}
            whileInView={{ 
              opacity: 1, 
              filter: 'blur(0px)', 
              scale: 1,
              color: ['#71717a', '#ffffff', '#71717a']
            }}
            transition={{ 
              opacity: { duration: 2 },
              filter: { duration: 2 },
              scale: { duration: 2 },
              color: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-2xl md:text-5xl font-serif italic leading-relaxed tracking-wide"
          >
            "Love bears all things, believes all things, <br className="hidden md:block" /> hopes all things, endures all things."
          </motion.p>
          <motion.p 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-gold-500/50 text-xs md:text-sm uppercase tracking-[0.8em]"
          >
            1 Corinthians 13:7
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            className="pt-20"
          >
            <ChevronDown size={24} className="text-gold-500/30 mx-auto" />
          </motion.div>
        </motion.div>
      </section>

      {/* Invitation Text Section */}
      <section className="pt-32 pb-12 bg-[#0a0a0a] text-center px-6 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: false }}
          className="max-w-4xl mx-auto space-y-12"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-gold-500/20" />
            <p className="text-gold-500 tracking-[0.4em] uppercase text-[10px] md:text-xs">Undangan</p>
            <div className="h-[1px] w-12 bg-gold-500/20" />
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl md:text-4xl font-serif text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              Dengan hormat mengundang Bapak/Ibu untuk menghadiri pernikahan:
            </h3>
          </div>
        </motion.div>
      </section>

      {/* Couple Section */}
      <section id="couple" className="pb-32 pt-12 px-4 md:px-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-4 md:gap-20 items-start">
            {/* Groom */}
            <motion.div
              initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5 }}
              viewport={{ once: false, amount: 0.2 }}
              className="text-center space-y-3 md:space-y-6"
            >
              <div className="aspect-[4/5] bg-zinc-900/50 overflow-hidden mb-4 md:mb-10 relative group">
                <img src={heroBg} alt="Mempelai Pria" className="w-full h-full object-cover md:grayscale md:opacity-40 md:hover:grayscale-0 md:hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100" />
                <div className="absolute inset-0 border border-white/5 pointer-events-none" />
              </div>
              <motion.h2 
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="text-xl md:text-5xl font-serif text-white tracking-tight"
              >
                Janssen, B.Sc., M.Sc.
              </motion.h2>
              <p className="text-gold-500 tracking-widest uppercase text-[8px] md:text-xs">Mempelai Pria</p>
              <p className="text-zinc-400 font-light italic text-[10px] md:text-base">
                Putra sulung dari <br /> Bapak Agus & Ibu Suhartini
              </p>
            </motion.div>

            {/* Bride */}
            <motion.div
              initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5 }}
              viewport={{ once: false, amount: 0.2 }}
              className="text-center space-y-3 md:space-y-6"
            >
              <div className="aspect-[4/5] bg-zinc-900/50 overflow-hidden mb-4 md:mb-10 relative group">
                <img src={heroBg} alt="Mempelai Wanita" className="w-full h-full object-cover md:grayscale md:opacity-40 md:hover:grayscale-0 md:hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100" />
                <div className="absolute inset-0 border border-white/5 pointer-events-none" />
              </div>
              <motion.h2 
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="text-xl md:text-5xl font-serif text-white tracking-tight"
              >
                Veronica S.Ak.
              </motion.h2>
              <p className="text-gold-500 tracking-widest uppercase text-[8px] md:text-xs">Mempelai Wanita</p>
              <p className="text-zinc-400 font-light italic text-[10px] md:text-base">
                Putri sulung dari <br /> Bapak Ellen/Aleng & Ibu Wina Junelia/Acin
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section id="details" className="py-40 bg-zinc-950/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <span className="text-gold-500 tracking-[0.4em] uppercase text-[10px]">Agenda Acara</span>
            <h2 className="text-5xl md:text-6xl font-serif">Jadwal Pernikahan</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-[1px] bg-white/10">
            <div className="bg-[#0a0a0a] p-4 md:p-12 space-y-6 md:space-y-8 flex flex-col items-center text-center">
              <Clock className="text-gold-500" strokeWidth={1} size={24} />
              <div className="space-y-2 md:space-y-4">
                <h3 className="text-sm md:text-3xl font-serif min-h-[40px] md:min-h-0">Kediaman Mempelai Wanita</h3>
                <div className="h-[1px] w-8 md:w-12 bg-gold-500/30 mx-auto" />
                <p className="text-white text-[10px] md:text-lg">Jumat, 25 Sep 2026</p>
                <p className="text-zinc-500 text-[8px] md:text-sm uppercase tracking-widest">17:00 WIB</p>
              </div>
              <div className="space-y-4 w-full">
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <MapPin className="text-gold-500 w-4 h-4 md:w-5 md:h-5" />
                  <p className="text-zinc-400 text-[9px] md:text-sm leading-relaxed min-h-[48px] md:min-h-0">
                    Taman Kota Mas C1 no. 3A, Batam
                  </p>
                </div>
                {/* Map Preview */}
                <div className="w-full aspect-square md:aspect-video bg-zinc-900 overflow-hidden rounded-sm border border-white/5">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.056094384814!2d104.00109107501302!3d1.121594998867626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d98bd26ec97985%3A0xe671d18809983944!2sTaman%20Kota%20Mas%20C1%20No.3A!5e0!3m2!1sen!2sid!4v1715051000000!5m2!1sen!2sid" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }} 
                    allowFullScreen 
                    loading="lazy" 
                  />
                </div>
                <a 
                  href="https://maps.app.goo.gl/oz22XRWHqg9HamRH9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-2 md:px-6 md:py-3 border border-gold-500/20 text-gold-500 text-[8px] md:text-[10px] uppercase tracking-widest hover:bg-gold-500 hover:text-black transition-all duration-500"
                >
                  Buka di Maps
                </a>
              </div>
            </div>
            
            <div className="bg-[#0a0a0a] p-4 md:p-12 space-y-6 md:space-y-8 flex flex-col items-center text-center">
              <Calendar className="text-gold-500" strokeWidth={1} size={24} />
              <div className="space-y-2 md:space-y-4">
                <h3 className="text-sm md:text-3xl font-serif min-h-[40px] md:min-h-0">Pemberkatan</h3>
                <div className="h-[1px] w-8 md:w-12 bg-gold-500/30 mx-auto" />
                <p className="text-white text-[10px] md:text-lg">Sabtu, 26 Sep 2026</p>
                <p className="text-zinc-500 text-[8px] md:text-sm uppercase tracking-widest">09:30 WIB</p>
              </div>
              <div className="space-y-4 w-full">
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <MapPin className="text-gold-500 w-4 h-4 md:w-5 md:h-5" />
                  <p className="text-zinc-400 text-[9px] md:text-sm leading-relaxed min-h-[48px] md:min-h-0">
                    St. Thadeus Panbil, Batam
                  </p>
                </div>
                {/* Map Preview */}
                <div className="w-full aspect-square md:aspect-video bg-zinc-900 overflow-hidden rounded-sm border border-white/5">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.12356789!2d104.0278539!3d1.0821279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d98f34cd8c0e87%3A0x48f499a1670ec385!2sSt.+Judas+Thadeus+Catholic+Chapel!5e0!3m2!1sen!2sid!4v1715052000000!5m2!1sen!2sid" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }} 
                    allowFullScreen 
                    loading="lazy" 
                  />
                </div>
                <a 
                  href="https://maps.app.goo.gl/x6TeQ7vtEpLv61nG9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-2 md:px-6 md:py-3 border border-gold-500/20 text-gold-500 text-[8px] md:text-[10px] uppercase tracking-widest hover:bg-gold-500 hover:text-black transition-all duration-500"
                >
                  Buka di Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-40 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center space-y-20"
        >
          <div className="space-y-6">
            <h2 className="text-6xl md:text-8xl font-serif">RSVP</h2>
            <p className="text-zinc-500 tracking-widest uppercase text-[10px]">Mohon konfirmasi kehadiran anda</p>
          </div>

          <form onSubmit={handleRSVPSubmit} className="space-y-12 text-left">
            <div className="space-y-12">
              <div className="group space-y-2">
                <div className="flex items-center gap-4 border-b border-white/10 focus-within:border-gold-500 transition-all">
                  <User className="text-zinc-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Nama"
                    value={rsvpData.name}
                    onChange={(e) => {
                      setRsvpData({ ...rsvpData, name: e.target.value });
                      if (nameError) setNameError(false);
                    }}
                    className={`w-full bg-transparent py-4 outline-none transition-all placeholder:text-zinc-500 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest ${nameError ? 'border-red-500' : ''}`} 
                  />
                </div>
                {nameError && (
                  <p className="text-red-500 text-[10px] uppercase tracking-widest mt-2 animate-pulse">
                    Mohon isi nama Anda
                  </p>
                )}
              </div>

              <div className="group space-y-2">
                <div className="flex items-center gap-4 border-b border-white/10 focus-within:border-gold-500 transition-all">
                  <Phone className="text-zinc-500" size={16} />
                  <input 
                    type="tel" 
                    placeholder="Nomor Telepon"
                    value={rsvpData.phone}
                    onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })}
                    className="w-full bg-transparent py-4 outline-none transition-all placeholder:text-zinc-500 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest" 
                  />
                </div>
                {phoneError && (
                  <p className="text-red-500 text-[10px] uppercase tracking-widest mt-2 animate-pulse">
                    Mohon isi nomor telepon Anda
                  </p>
                )}
              </div>

              <div className="group space-y-2">
                <div className="flex items-start gap-4 border-b border-white/10 focus-within:border-gold-500 transition-all">
                  <MessageSquare className="text-zinc-500 mt-4" size={16} />
                  <textarea 
                    placeholder="Pesan (Opsional)"
                    rows={1}
                    value={rsvpData.message}
                    onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
                    className="w-full bg-transparent py-4 outline-none transition-all placeholder:text-zinc-500 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest resize-none" 
                  />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full py-6 group overflow-hidden border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 text-white group-hover:text-black font-bold tracking-[0.4em] uppercase text-xs transition-colors duration-500">
                {isSubmitting ? 'Mengirim...' : 'Konfirmasi Kehadiran'}
              </span>
            </button>
          </form>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-zinc-600 text-[10px] uppercase tracking-[0.8em]">J & V • Batam 2026</p>
      </footer>

      {/* Success Modal */}
      <AnimatePresence>
        {isSubmitted && (
          <ConfirmedRSVP 
            name={rsvpData.name} 
            onClose={() => {
              setIsSubmitted(false);
              setRsvpData({ name: '', phone: '', message: '' });
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
