import React, { useRef, useState, useEffect } from 'react';
import type { UserData } from '../../types/poster';

interface Props {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

export const PhotoUpload: React.FC<Props> = ({ userData, setUserData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserData(prev => ({ ...prev, photoUrl: url }));
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please allow permissions or try uploading a file instead.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setUserData(prev => ({ ...prev, photoUrl: url }));
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="bg-[#174d1c] p-6 sm:p-8 rounded-2xl shadow-xl border border-[#246b2b]">
      <h2 className="text-2xl font-bold text-[#ffca08] mb-6 flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Upload or Take Photo
      </h2>
      
      {isCameraOpen ? (
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-sm rounded-xl overflow-hidden bg-black aspect-[3/4] mb-5 border-4 border-[#ffca08]/30 shadow-[0_0_15px_rgba(255,202,8,0.2)]">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover -scale-x-100"
            />
          </div>
          <div className="flex gap-4 w-full max-w-sm">
            <button 
              onClick={capturePhoto}
              className="flex-1 bg-[#ffca08] hover:bg-[#e5b607] text-[#113a15] font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Snap Photo
            </button>
            <button 
              onClick={stopCamera}
              className="flex-1 bg-[#246b2b] hover:bg-[#1a4a1f] text-white font-bold py-3 px-6 rounded-xl transition-all border border-[#2d8236]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div 
            className="group border-2 border-dashed border-[#2d8236] hover:border-[#ffca08] bg-[#0d2a10] rounded-xl p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {/* Subtle glow effect behind */}
            <div className="absolute inset-0 bg-[#ffca08] opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            {userData.photoUrl ? (
              <div className="flex flex-col items-center relative z-10">
                <div className="relative">
                  <img 
                    src={userData.photoUrl} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-xl mb-4 shadow-xl border-2 border-[#ffca08]/50"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-[#ffca08] text-[#113a15] p-1.5 rounded-full shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </div>
                </div>
                <span className="text-sm text-[#ffca08] font-semibold mt-2 group-hover:underline">Click to change photo</span>
              </div>
            ) : (
              <div className="text-green-200/60 relative z-10 flex flex-col items-center">
                <div className="p-4 bg-[#174d1c] rounded-full mb-4 group-hover:scale-110 group-hover:bg-[#ffca08]/10 transition-transform duration-300">
                  <svg className="h-10 w-10 group-hover:text-[#ffca08] transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-green-100 group-hover:text-white transition-colors">Click to upload a photo</p>
                <p className="text-sm mt-2">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#2d8236]"></div>
            <span className="flex-shrink-0 mx-4 text-[#ffca08]/80 text-sm font-bold tracking-widest">OR</span>
            <div className="flex-grow border-t border-[#2d8236]"></div>
          </div>

          <button 
            onClick={startCamera}
            className="w-full flex justify-center items-center gap-3 bg-[#113a15] hover:bg-[#0a230c] text-white font-bold py-4 px-4 rounded-xl transition-all border border-[#2d8236] hover:border-[#ffca08]/50 shadow-md hover:shadow-lg"
          >
            <svg className="w-6 h-6 text-[#ffca08]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Take a Selfie
          </button>
        </div>
      )}
    </div>
  );
};
