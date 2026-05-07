import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ConfirmedRSVPProps {
  name: string;
  onClose: () => void;
}

const ConfirmedRSVP = ({ name, onClose }: ConfirmedRSVPProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-md w-full bg-[#0d0d0d] border border-gold-500/20 p-12 text-center space-y-8 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        
        <div className="flex justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 rounded-full border border-gold-500 flex items-center justify-center"
          >
            <Check className="text-gold-500" size={32} />
          </motion.div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-serif text-white">Terima Kasih</h2>
          <div className="h-[1px] w-12 bg-gold-500/30 mx-auto" />
          <p className="text-zinc-400 font-light leading-relaxed">
            Halo <span className="text-gold-500 font-medium">{name}</span>, <br />
            Konfirmasi kehadiran Anda telah kami terima. Kami sangat menantikan kehadiran Anda di hari bahagia kami.
          </p>
        </div>

        <button 
          onClick={onClose}
          className="relative w-full py-4 group overflow-hidden border border-white/10"
        >
          <div className="absolute inset-0 bg-gold-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <span className="relative z-10 text-white group-hover:text-black font-bold tracking-[0.4em] uppercase text-[10px] transition-colors duration-500">
            Tutup
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmedRSVP;
