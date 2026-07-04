import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ADSENSE_CLIENT, isValidAdSlot } from '../../lib/adsense';

interface AdUnitProps {
    slotId?: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    className?: string;
    label?: string;
}

declare global {
    interface Window {
        adsbygoogle?: unknown[];
    }
}

const AdUnit: React.FC<AdUnitProps> = ({ slotId, format = 'auto', className = '', label }) => {
    const { i18n } = useTranslation();
    const adRef = useRef<HTMLModElement | null>(null);
    const resolvedLabel = label ?? (i18n.language.startsWith('zh') ? '广告' : 'Advertisement');
    const isConfigured = isValidAdSlot(slotId);
    const shouldShowDevPlaceholder = !import.meta.env.PROD && !isConfigured;

    const adStyle = useMemo(() => {
        if (format === 'rectangle') {
            return { display: 'block', minHeight: '280px', width: '100%' } as const;
        }

        return { display: 'block' } as const;
    }, [format]);

    useEffect(() => {
        if (!isConfigured || !adRef.current) return;

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
            console.error('AdSense push failed:', error);
        }
    }, [isConfigured]);

    if (!isConfigured && !shouldShowDevPlaceholder) {
        return null;
    }

    return (
        <div className={`w-full flex flex-col items-center justify-center my-8 ${className}`}>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 w-full text-center border-b border-gray-200 leading-[0.1em] mx-10">
                <span className="bg-gray-50 px-2">{resolvedLabel}</span>
            </div>

            {shouldShowDevPlaceholder ? (
                <div className="w-full h-32 md:h-24 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs font-mono uppercase">
                    Configure AdSense Slot ({format})
                </div>
            ) : (
                <ins
                    ref={adRef}
                    className="adsbygoogle w-full overflow-hidden"
                    style={adStyle}
                    data-ad-client={ADSENSE_CLIENT}
                    data-ad-slot={slotId}
                    data-ad-format={format === 'rectangle' ? 'auto' : format}
                    data-full-width-responsive={format === 'fluid' ? 'false' : 'true'}
                />
            )}
        </div>
    );
};

export default AdUnit;
