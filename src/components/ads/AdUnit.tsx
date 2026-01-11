import React from 'react';

interface AdUnitProps {
    slotId?: string; // Google AdSense Data Slot ID
    format?: 'auto' | 'fluid' | 'rectangle';
    className?: string;
    label?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ slotId = "1234567890", format = "auto", className = "", label = "Advertisement" }) => {
    // In a real scenario, we would check environment variables like:
    // const isProduction = process.env.NODE_ENV === 'production';
    // For this demo, we'll keep the placeholder visible so the user can see where ads go.

    return (
        <div className={`w-full flex flex-col items-center justify-center my-8 ${className}`}>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 w-full text-center border-b border-gray-200 leading-[0.1em] mx-10">
                <span className="bg-gray-50 px-2">{label}</span>
            </div>

            {/* 
                This is where the actual AdSense Script would run.
                <ins className="adsbygoogle"
                     style={{ display: 'block' }}
                     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                     data-ad-slot={slotId}
                     data-ad-format={format}
                     data-full-width-responsive="true"></ins>
             */}

            <div className="w-full h-32 md:h-24 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs font-mono uppercase">
                AdSense Space ({format})
            </div>
        </div>
    );
};

export default AdUnit;
