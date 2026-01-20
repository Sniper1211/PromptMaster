import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-slate-900">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
                {/* Glitchy 404 */}
                <div className="relative mb-8">
                    <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-black select-none drop-shadow-[8px_8px_0px_rgba(0,0,0,0.2)]">
                        404
                    </h1>
                    <div className="absolute -top-6 -right-6 rotate-12 bg-[#FF4D4D] text-white px-4 py-1 font-bold uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {t('notFound.error')}
                    </div>
                </div>

                {/* Message */}
                <div className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-10 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center justify-center gap-3 mb-4 text-[#FF4D4D]">
                        <AlertTriangle size={32} strokeWidth={3} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase italic mb-4">
                        {t('notFound.title')}
                    </h2>
                    <p className="text-lg md:text-xl font-medium text-slate-600 max-w-md mx-auto leading-relaxed">
                        {t('notFound.message')}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4">
                    <Link 
                        to="/" 
                        className="flex items-center gap-2 px-8 py-4 bg-[#2DD4BF] text-black text-lg font-black uppercase tracking-wider border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                        <Home size={24} strokeWidth={3} />
                        {t('notFound.returnHome')}
                    </Link>
                    
                    <button 
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-8 py-4 bg-white text-black text-lg font-black uppercase tracking-wider border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                        {t('notFound.goBack')}
                    </button>
                </div>
            </div>

            {/* Footer decoration */}
            <div className="absolute bottom-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                {t('notFound.footer')}
            </div>
        </div>
    );
};

export default NotFoundPage;
