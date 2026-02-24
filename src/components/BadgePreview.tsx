import React, { useRef } from 'react';
import { Smile } from 'lucide-react';
import { BadgeConfig, PRESETS } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgePreviewProps {
  config: BadgeConfig;
  id?: string;
}

export const BadgePreview: React.FC<BadgePreviewProps> = ({ config, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isFontAwesome = config.iconName.startsWith('fa');
  const isEmoji = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{303D}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{2604}\u{260E}\u{2611}\u{2614}\u{2615}\u{2618}\u{261D}\u{2620}\u{2622}\u{2623}\u{2626}\u{262A}\u{262E}\u{262F}\u{2638}-\u{263A}\u{2640}\u{2642}\u{2648}-\u{2653}\u{2660}\u{2663}\u{2665}\u{2666}\u{2668}\u{267B}\u{267F}\u{2692}-\u{2694}\u{2696}\u{2697}\u{2699}\u{269B}\u{269C}\u{26A0}\u{26A1}\u{26AA}\u{26AB}\u{26B0}\u{26B1}\u{26BD}\u{26BE}\u{26C4}\u{26C5}\u{26C8}\u{26CE}\u{26CF}\u{26D1}\u{26D3}\u{26D4}\u{26E9}\u{26EA}\u{26F2}-\u{26F5}\u{26F7}-\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{2728}\u{2733}\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/u.test(config.iconName);

  // Calculate font sizes based on dimensions and text length
  const minDim = Math.min(config.width, config.height);
  
  const getDynamicFontSize = (text: string, baseScale: number, isCircular: boolean, userScale: number) => {
    const length = text.length || 1;
    let scale = baseScale;
    
    if (isCircular) {
      // Circular text needs more aggressive scaling
      if (length > 10) scale *= Math.max(0.4, 1 - (length - 10) * 0.04);
    } else {
      if (length > 15) scale *= Math.max(0.5, 1 - (length - 15) * 0.03);
    }
    
    return minDim * scale * userScale;
  };

  const titleSize = getDynamicFontSize(config.topText, 0.12, config.isRound, config.topFontSizeScale);
  const subtitleSize = getDynamicFontSize(config.bottomText, 0.08, config.isRound, config.bottomFontSizeScale);
  
  // Icon size adjustment for multiple emojis
  // Use Intl.Segmenter if available, otherwise fallback to a simpler method
  const getEmojiCount = (str: string) => {
    if ('Segmenter' in Intl) {
      const segmenter = new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' });
      return [...segmenter.segment(str)].length;
    }
    return [...str].length; // Fallback
  };

  const emojiCount = isEmoji ? getEmojiCount(config.iconName) : 1;
  let iconBaseScale = 0.35;
  if (isEmoji) {
    if (emojiCount > 1) {
      iconBaseScale = 0.35 / (Math.min(emojiCount, 3) * 0.7);
    } else {
      iconBaseScale = 0.45; // Make single emojis bigger
    }
  }
  const iconSize = minDim * iconBaseScale;

  const isCircular = config.isRound;

  // Calculate positions
  // For circular, we adjust the radius of the path
  const topRadius = 40 + (config.topTextPos - 50) * 0.2;
  const bottomRadius = 40 + (config.bottomTextPos - 50) * 0.2;
  
  const renderIcon = () => {
    if (isFontAwesome) {
      // Ensure fa-solid is present if it's a FA icon
      const faClass = config.iconName.includes('fa-') ? config.iconName : `fa-solid ${config.iconName}`;
      return <i className={cn(faClass, "flex items-center justify-center")} style={{ fontSize: iconSize }} />;
    }
    
    if (isEmoji) {
      return (
        <span 
          className={cn(
            config.emojiStyle === 'mono' ? "font-emoji-mono" : "font-emoji-color",
            "flex items-center justify-center leading-none"
          )}
          style={{ fontSize: iconSize }}
        >
          {config.iconName}
        </span>
      );
    }

    // Default to plain text/custom content
    return (
      <span 
        className="flex items-center justify-center font-bold" 
        style={{ fontSize: iconSize }}
      >
        {config.iconName}
      </span>
    );
  };

  return (
    <div 
      id={id}
      ref={containerRef}
      className={cn(
        "relative overflow-hidden flex flex-col items-center justify-center shadow-lg transition-all duration-300",
        isCircular ? "rounded-full" : "rounded-lg"
      )}
      style={{
        width: config.width,
        height: config.height,
        backgroundColor: config.bgColor,
        color: config.textColor,
        fontFamily: config.fontFamily,
      }}
    >
      {isCircular ? (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Top Curved Text */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <path 
                id="topCurve" 
                d={`M ${50 - (30 + config.topTextPos * 0.4)},50 A ${30 + config.topTextPos * 0.4},${30 + config.topTextPos * 0.4} 0 0,1 ${50 + (30 + config.topTextPos * 0.4)},50`} 
              />
              <path 
                id="bottomCurve" 
                d={`M ${50 - (30 + config.bottomTextPos * 0.4)},50 A ${30 + config.bottomTextPos * 0.4},${30 + config.bottomTextPos * 0.4} 0 0,0 ${50 + (30 + config.bottomTextPos * 0.4)},50`} 
              />
            </defs>
            <text className="font-bold uppercase tracking-[0.1em]" fill="currentColor">
              <textPath href="#topCurve" startOffset="50%" textAnchor="middle" style={{ fontSize: `${(titleSize / minDim) * 100 * 0.8}px` }}>
                {config.topText.toUpperCase()}
              </textPath>
            </text>
            
            <text className="font-bold uppercase tracking-[0.1em]" fill="currentColor">
              <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle" style={{ fontSize: `${(subtitleSize / minDim) * 100 * 0.8}px` }}>
                {config.bottomText.toUpperCase()}
              </textPath>
            </text>
          </svg>
          
          <div className="z-10 flex items-center justify-center">
            {renderIcon()}
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center w-full h-full p-6 text-center">
          {/* Top Text Container */}
          <div className="absolute top-0 left-0 w-full flex flex-col items-center justify-end" style={{ height: '40%' }}>
            {config.topText && (
              <div 
                className="font-bold uppercase tracking-wider"
                style={{ 
                  fontSize: titleSize,
                  marginBottom: `${config.topTextPos}%`
                }}
              >
                {config.topText.toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center">
            {renderIcon()}
          </div>
          
          {/* Bottom Text Container */}
          <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-start" style={{ height: '40%' }}>
            {config.bottomText && (
              <div 
                className="font-semibold uppercase"
                style={{ 
                  fontSize: subtitleSize,
                  marginTop: `${config.bottomTextPos}%`
                }}
              >
                {config.bottomText.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
