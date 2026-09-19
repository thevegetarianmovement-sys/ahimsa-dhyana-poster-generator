import { useState } from 'react';
import { UserForm } from './components/Form/UserForm';
import { PhotoUpload } from './components/PhotoUpload/PhotoUpload';
import { PosterPreview } from './components/PosterPreview/PosterPreview';
import { ActionButtons } from './components/GenerateButton/ActionButtons';
import type { UserData } from './types/poster';
import { drawPoster } from './canvas/posterRenderer';

function App() {
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    phoneNumber: '',
    location: '',
    photoUrl: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Add the Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzwdotA8XDcTWs444vsJRgZkcIZ9f1mbrQFGikkiZXTdjz12i5KPERpXz5tWUodOM9B/exec";

  const submitToGoogleSheets = async () => {
    // Only submit if they provided at least some data
    if (!userData.fullName && !userData.phoneNumber && !userData.location) return;

    try {
      // We send as text/plain to bypass strict CORS preflight on Google Apps Script,
      // but the payload is still valid JSON that our script parses.
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8", 
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          location: userData.location
        })
      }).catch(err => console.error("Background sync failed:", err));
    } catch (e) {
      console.error("Failed to queue submission:", e);
    }
  };

  const handleGenerateBlob = async (): Promise<Blob> => {
    return new Promise(async (resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        await drawPoster(canvas, userData, '/assets/poster-frame.png');
        
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to generate image blob"));
        }, 'image/png');
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Fire and forget data submission in the background
      submitToGoogleSheets();

      const blob = await handleGenerateBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `poster-${userData.fullName.replace(/\s+/g, '-').toLowerCase() || 'download'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate poster. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      // Fire and forget data submission in the background
      submitToGoogleSheets();

      const blob = await handleGenerateBlob();
      const file = new File([blob], 'ahimsa-poster.png', { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Ahimsa Dhyana Mahotsavalu',
          text: 'Join me for the National Ahimsa Meditation Mahotsavalu! Live & Let Live.'
        });
      } else {
        alert("Your browser doesn't support direct image sharing to WhatsApp. The poster will be downloaded so you can share it manually.");
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ahimsa-poster.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Error sharing:", err);
      if (err instanceof Error && err.name !== 'AbortError') {
        alert("Failed to share poster. It will be downloaded instead.");
        handleDownload();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#113a15] text-white pb-12 font-sans selection:bg-[#ffca08] selection:text-[#113a15]">
      {/* Immersive HTML/CSS Hero Section */}
      <header className="w-full bg-gradient-to-b from-[#061807] to-[#113a15] shadow-2xl border-b border-[#1f5c25] relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ffca08] opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ffca08] opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#ffca08]/30 bg-[#ffca08]/10 text-[#ffca08] font-semibold text-sm tracking-widest mb-6 uppercase shadow-sm">
              Live & Let Live
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
              జాతీయ అహింసా <br />
              <span className="text-[#ffca08]">ధ్యాన మహాసభలు</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 font-light mb-8 max-w-2xl mx-auto lg:mx-0">
              నేను సైతం అహింసా జగత్ కోసం. <br/>
              Create and share your personalized flyer below.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <span className="px-5 py-2.5 rounded-lg bg-[#174d1c] border border-[#246b2b] text-white font-medium flex items-center gap-2 shadow-md">
                <svg className="w-5 h-5 text-[#ffca08]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                2026 అక్టోబర్ 1 - 5
              </span>
              <span className="px-5 py-2.5 rounded-lg bg-[#174d1c] border border-[#246b2b] text-[#ffca08] font-bold shadow-md">
                ప్రవేశం ఉచితం
              </span>
            </div>
          </div>

          {/* Featured Image (No longer stretched, displayed crisply) */}
          <div className="flex-shrink-0 relative group mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-[#ffca08] rounded-3xl blur-2xl opacity-15 group-hover:opacity-25 transition-opacity duration-500"></div>
            <img 
              src="/assets/banner.png" 
              alt="Ahimsa Dhyana Mahotsavalu" 
              className="relative w-full max-w-[420px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#ffca08]/20 object-contain"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Form & Upload */}
          <div className="flex flex-col gap-6">
            <UserForm userData={userData} setUserData={setUserData} />
            <PhotoUpload userData={userData} setUserData={setUserData} />
            
            {/* Show button on desktop below form */}
            <div className="hidden lg:block">
              <ActionButtons onDownload={handleDownload} onShare={handleShare} isGenerating={isGenerating} />
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="flex flex-col">
            <PosterPreview userData={userData} />
            
            {/* Show button on mobile below preview */}
            <div className="block lg:hidden mt-6">
              <ActionButtons onDownload={handleDownload} onShare={handleShare} isGenerating={isGenerating} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
