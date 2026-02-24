import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Plus, 
  Trash2, 
  Maximize2, 
  FileArchive,
  Palette as PaletteIcon,
  Settings2
} from 'lucide-react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { BadgeConfig, PRESETS, BadgeSize, Preset, GOOGLE_FONTS } from './constants';
import { BadgePreview } from './components/BadgePreview';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SIZE_MAP: Record<Exclude<BadgeSize, 'custom'>, { w: number; h: number }> = {
  square: { w: 400, h: 400 },
  portrait: { w: 300, h: 400 },
  landscape: { w: 400, h: 300 },
};

const TRANSLATIONS = {
  en: {
    tagline: "Craft your mood, wear your vibe.",
    sizeShape: "Size & Shape",
    typography: "Typography",
    presets: "Presets",
    customDetails: "Custom Details",
    width: "Width (px)",
    height: "Height (px)",
    circular: "Circular Badge",
    topText: "Top Text",
    bottomText: "Bottom Text",
    emojiStyle: "Emoji Style",
    colorful: "Colorful",
    monochrome: "Monochrome",
    iconLabel: "Icon / Emoji / FA ID",
    bgColor: "Background Color",
    topHeight: "Top Text Height (%)",
    bottomHeight: "Bottom Text Height (%)",
    topSize: "Top Font Size Scale",
    bottomSize: "Bottom Font Size Scale",
    addToCollection: "Add to Collection",
    livePreview: "Live Preview",
    downloadThis: "Download This",
    collection: "Collection",
    exportAll: "Export All (ZIP)",
    exporting: "Exporting...",
    apply: "Apply",
    customBadge: "E-Badge"
  },
  ru: {
    tagline: "Создай своё настроение, носи свой вайб.",
    sizeShape: "Размер и Форма",
    typography: "Типографика",
    presets: "Пресеты",
    customDetails: "Настройка деталей",
    width: "Ширина (px)",
    height: "Высота (px)",
    circular: "Круглый значок",
    topText: "Верхний текст",
    bottomText: "Нижний текст",
    emojiStyle: "Стиль эмодзи",
    colorful: "Цветные",
    monochrome: "Чёрно-белые",
    iconLabel: "Иконка / Эмодзи / FA ID",
    bgColor: "Цвет фона",
    topHeight: "Высота верхнего текста (%)",
    bottomHeight: "Высота нижнего текста (%)",
    topSize: "Размер верхнего шрифта",
    bottomSize: "Размер нижнего шрифта",
    addToCollection: "Добавить в коллекцию",
    livePreview: "Предпросмотр",
    downloadThis: "Скачать этот",
    collection: "Коллекция",
    exportAll: "Экспорт всех (ZIP)",
    exporting: "Экспорт...",
    apply: "Применить",
    customBadge: "E-Значок"
  }
};

export default function App() {
  const [language, setLanguage] = useState<'en' | 'ru'>('ru');
  const [currentConfig, setCurrentConfig] = useState<BadgeConfig>({
    id: 'current',
    presetId: 'friendly',
    topText: '',
    bottomText: 'Открыт к общению',
    iconName: '😉',
    fontFamily: GOOGLE_FONTS[0].family,
    bgColor: '#22c55e',
    textColor: '#ffffff',
    size: 'square',
    width: 400,
    height: 400,
    isRound: false,
    language: 'ru',
    topTextPos: 25,
    bottomTextPos: 25,
    topFontSizeScale: 1.0,
    bottomFontSizeScale: 1.0,
    emojiStyle: 'color',
  });

  const [savedBadges, setSavedBadges] = useState<BadgeConfig[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [faInput, setFaInput] = useState('');

  const t = TRANSLATIONS[language];

  const handlePresetSelect = (preset: Preset) => {
    const texts = language === 'en' ? preset.en : preset.ru;
    setCurrentConfig(prev => ({
      ...prev,
      presetId: preset.id,
      topText: texts.top,
      bottomText: texts.bottom,
      iconName: preset.icon,
      bgColor: preset.bgColor,
      textColor: '#ffffff',
    }));
  };

  const handleSizeChange = (size: BadgeSize) => {
    if (size === 'custom') {
      setCurrentConfig(prev => ({ ...prev, size }));
    } else {
      const dims = SIZE_MAP[size];
      setCurrentConfig(prev => ({
        ...prev,
        size,
        width: dims.w,
        height: dims.h,
        isRound: false
      }));
    }
  };

  const applyFaIcon = () => {
    if (faInput.trim()) {
      setCurrentConfig(prev => ({ ...prev, iconName: faInput.trim() }));
    }
  };

  const saveBadge = () => {
    setSavedBadges(prev => [...prev, { ...currentConfig, id: crypto.randomUUID() }]);
  };

  const removeBadge = (id: string) => {
    setSavedBadges(prev => prev.filter(b => b.id !== id));
  };

  const downloadSingle = async (id: string, name: string) => {
    const element = document.getElementById(`badge-${id}`);
    if (!element) return;
    
    try {
      const dataUrl = await toPng(element, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `badge-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  const downloadAll = async () => {
    setIsExporting(true);
    const zip = new JSZip();
    
    try {
      for (const badge of savedBadges) {
        const element = document.getElementById(`badge-${badge.id}`);
        if (element) {
          const dataUrl = await toPng(element, { pixelRatio: 2 });
          const base64Data = dataUrl.split(',')[1];
          zip.file(`badge-${badge.bottomText.replace(/\s+/g, '-').toLowerCase()}.png`, base64Data, { base64: true });
        }
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'mood-badges.zip';
      link.click();
    } catch (err) {
      console.error('ZIP export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f4] text-[#1a1a1a] font-sans p-4 md:p-8 selection:bg-black selection:text-white">
      <header className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-7xl font-black tracking-tighter mb-3">MOODPAW</h1>
          <p className="text-xl font-medium opacity-50 uppercase tracking-widest">{t.tagline}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-black/5 shadow-sm">
          <button 
            onClick={() => setLanguage('en')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-black transition-all",
              language === 'en' ? "bg-black text-white shadow-lg" : "hover:bg-black/5"
            )}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('ru')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-black transition-all",
              language === 'ru' ? "bg-black text-white shadow-lg" : "hover:bg-black/5"
            )}
          >
            RU
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Controls */}
        <section className="lg:col-span-7 space-y-16">
          {/* Size & Shape */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
              <Maximize2 size={14} /> {t.sizeShape}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(['square', 'portrait', 'landscape', 'custom'] as BadgeSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSizeChange(s)}
                  className={cn(
                    "px-4 py-4 rounded-2xl border-2 transition-all text-xs font-black uppercase tracking-widest",
                    currentConfig.size === s 
                      ? "border-black bg-black text-white shadow-xl translate-y-[-2px]" 
                      : "border-black/5 bg-white hover:border-black/20"
                  )}
                >
                  {s === 'custom' ? t.customBadge : s}
                </button>
              ))}
            </div>

            {currentConfig.size === 'custom' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-white rounded-[32px] border border-black/5 shadow-sm space-y-6"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black tracking-widest opacity-40">{t.width}</label>
                    <input 
                      type="number" 
                      value={currentConfig.width}
                      onChange={(e) => setCurrentConfig(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-[#f8f8f4] p-4 rounded-2xl font-mono text-sm outline-none focus:ring-2 ring-black/10 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black tracking-widest opacity-40">{t.height}</label>
                    <input 
                      type="number" 
                      value={currentConfig.height}
                      onChange={(e) => setCurrentConfig(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-[#f8f8f4] p-4 rounded-2xl font-mono text-sm outline-none focus:ring-2 ring-black/10 transition-all"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#f8f8f4] rounded-2xl">
                  <span className="text-xs font-black uppercase tracking-widest opacity-60">{t.circular}</span>
                  <button 
                    onClick={() => setCurrentConfig(prev => ({ ...prev, isRound: !prev.isRound }))}
                    className={cn(
                      "w-14 h-8 rounded-full transition-all relative p-1",
                      currentConfig.isRound ? "bg-black" : "bg-black/10"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 bg-white rounded-full transition-all shadow-sm",
                      currentConfig.isRound ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Typography */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
               {t.typography}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GOOGLE_FONTS.map((font) => (
                <button
                  key={font.name}
                  onClick={() => setCurrentConfig(prev => ({ ...prev, fontFamily: font.family }))}
                  style={{ fontFamily: font.family }}
                  className={cn(
                    "px-4 py-3 rounded-xl border transition-all text-sm truncate",
                    currentConfig.fontFamily === font.family 
                      ? "border-black bg-black text-white shadow-md" 
                      : "border-black/5 bg-white hover:border-black/20"
                  )}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-8">
            <h2 className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
              <PaletteIcon size={14} /> {t.presets}
            </h2>
            
            {['Contact', 'Energy', 'RP', 'Social'].map(cat => (
              <div key={cat} className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-30">{cat}</h3>
                <div className="flex flex-wrap gap-2.5">
                  {PRESETS.filter(p => p.category === cat).map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className={cn(
                        "group relative flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all",
                        currentConfig.presetId === preset.id 
                          ? "border-black bg-black text-white shadow-lg scale-[1.02]" 
                          : "border-black/5 bg-white hover:border-black/20"
                      )}
                    >
                      <span className="text-lg font-emoji">{preset.icon}</span>
                      <span className="text-xs font-bold tracking-tight">
                        {language === 'en' 
                          ? `${preset.en.top} ${preset.en.bottom}`.trim() 
                          : `${preset.ru.top} ${preset.ru.bottom}`.trim()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Editor */}
          <div className="space-y-8">
            <h2 className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
              <Settings2 size={14} /> {t.customDetails}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-40">{t.topText}</label>
                <input 
                  type="text" 
                  value={currentConfig.topText}
                  onChange={(e) => setCurrentConfig(prev => ({ ...prev, topText: e.target.value, presetId: undefined }))}
                  className="w-full bg-white p-5 rounded-[24px] border border-black/5 outline-none focus:border-black/20 transition-all shadow-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-40">{t.bottomText}</label>
                <input 
                  type="text" 
                  value={currentConfig.bottomText}
                  onChange={(e) => setCurrentConfig(prev => ({ ...prev, bottomText: e.target.value, presetId: undefined }))}
                  className="w-full bg-white p-5 rounded-[24px] border border-black/5 outline-none focus:border-black/20 transition-all shadow-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-40">{t.emojiStyle}</label>
                <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-black/5 shadow-sm">
                  <button 
                    onClick={() => setCurrentConfig(prev => ({ ...prev, emojiStyle: 'color' }))}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                      currentConfig.emojiStyle === 'color' ? "bg-black text-white shadow-lg" : "hover:bg-black/5"
                    )}
                  >
                    {t.colorful}
                  </button>
                  <button 
                    onClick={() => setCurrentConfig(prev => ({ ...prev, emojiStyle: 'mono' }))}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                      currentConfig.emojiStyle === 'mono' ? "bg-black text-white shadow-lg" : "hover:bg-black/5"
                    )}
                  >
                    {t.monochrome}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-40">{t.iconLabel}</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="😉 or fa-paw"
                    value={faInput}
                    onChange={(e) => setFaInput(e.target.value)}
                    className="flex-1 bg-white p-5 rounded-[24px] border border-black/5 outline-none focus:border-black/20 transition-all shadow-sm font-mono text-xs"
                  />
                  <button 
                    onClick={applyFaIcon}
                    className="bg-black text-white px-6 rounded-[24px] font-black text-[10px] uppercase tracking-widest"
                  >
                    {t.apply}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-40">{t.bgColor}</label>
                <div className="flex gap-3">
                  <input 
                    type="color" 
                    value={currentConfig.bgColor}
                    onChange={(e) => setCurrentConfig(prev => ({ ...prev, bgColor: e.target.value }))}
                    className="w-16 h-16 rounded-[24px] border-none cursor-pointer bg-white p-1 shadow-sm"
                  />
                  <input 
                    type="text" 
                    value={currentConfig.bgColor}
                    onChange={(e) => setCurrentConfig(prev => ({ ...prev, bgColor: e.target.value }))}
                    className="flex-1 bg-white px-6 rounded-[24px] border border-black/5 font-mono text-sm outline-none focus:border-black/20 shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-40">{t.topHeight}</label>
                <input 
                  type="range" 
                  min="5" 
                  max="45" 
                  value={currentConfig.topTextPos}
                  onChange={(e) => setCurrentConfig(prev => ({ ...prev, topTextPos: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div className="text-[10px] font-mono opacity-40 text-right">{currentConfig.topTextPos}%</div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-40">{t.bottomHeight}</label>
                <input 
                  type="range" 
                  min="5" 
                  max="45" 
                  value={currentConfig.bottomTextPos}
                  onChange={(e) => setCurrentConfig(prev => ({ ...prev, bottomTextPos: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div className="text-[10px] font-mono opacity-40 text-right">{currentConfig.bottomTextPos}%</div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-40">{t.topSize}</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2.0" 
                  step="0.1"
                  value={currentConfig.topFontSizeScale}
                  onChange={(e) => setCurrentConfig(prev => ({ ...prev, topFontSizeScale: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div className="text-[10px] font-mono opacity-40 text-right">{currentConfig.topFontSizeScale.toFixed(1)}x</div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-40">{t.bottomSize}</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2.0" 
                  step="0.1"
                  value={currentConfig.bottomFontSizeScale}
                  onChange={(e) => setCurrentConfig(prev => ({ ...prev, bottomFontSizeScale: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div className="text-[10px] font-mono opacity-40 text-right">{currentConfig.bottomFontSizeScale.toFixed(1)}x</div>
              </div>
            </div>
            <button 
              onClick={saveBadge}
              className="w-full bg-black text-white p-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl"
            >
              <Plus size={20} /> {t.addToCollection}
            </button>
          </div>
        </section>

        {/* Right Column: Preview & Collection */}
        <section className="lg:col-span-5 space-y-16">
          <div className="sticky top-8 space-y-16">
            {/* Live Preview */}
            <div className="space-y-6">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-black opacity-40">{t.livePreview}</h2>
              <div className="bg-white p-12 rounded-[64px] border border-black/5 shadow-2xl flex items-center justify-center min-h-[500px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#f8f8f4] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div id="badge-current" className="relative z-10">
                  <BadgePreview config={currentConfig} />
                </div>
              </div>
              <button 
                onClick={() => downloadSingle('current', currentConfig.bottomText)}
                className="w-full bg-white border border-black/10 p-5 rounded-[32px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all shadow-sm"
              >
                <Download size={18} /> {t.downloadThis}
              </button>
            </div>

            {/* Collection */}
            {savedBadges.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-black opacity-40">{t.collection} ({savedBadges.length})</h2>
                  <button 
                    onClick={downloadAll}
                    disabled={isExporting}
                    className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:underline disabled:opacity-50"
                  >
                    {isExporting ? <span className="animate-pulse">{t.exporting}</span> : <><FileArchive size={16} /> {t.exportAll}</>}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {savedBadges.map((badge) => (
                      <motion.div 
                        key={badge.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="group relative bg-white p-5 rounded-[40px] border border-black/5 shadow-sm hover:shadow-xl transition-all"
                      >
                        <div className="scale-[0.4] origin-top-left absolute -top-10 -left-10 pointer-events-none opacity-0">
                           <div id={`badge-${badge.id}`}>
                             <BadgePreview config={badge} />
                           </div>
                        </div>
                        
                        <div className="aspect-square flex items-center justify-center overflow-hidden rounded-[24px] bg-[#f8f8f4]">
                          <div className="scale-[0.25]">
                            <BadgePreview config={badge} />
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between px-2">
                          <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[80px] opacity-30">
                            {badge.bottomText}
                          </span>
                          <button 
                            onClick={() => removeBadge(badge.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-32 pt-16 border-t border-black/5 text-center opacity-20 text-[10px] font-black uppercase tracking-[0.5em]">
        <p>Made by Caspian &copy; {new Date().getFullYear()}</p>
        <p><a href="https://github.com/real-squid-kid/moodpaw">Clone me on GitHub</a></p>
      </footer>
    </div>
  );
}
