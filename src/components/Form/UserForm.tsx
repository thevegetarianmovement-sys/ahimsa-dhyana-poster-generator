import React from 'react';
import type { UserData } from '../../types/poster';

interface Props {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

export const UserForm: React.FC<Props> = ({ userData, setUserData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#174d1c] p-6 sm:p-8 rounded-2xl shadow-xl border border-[#246b2b]">
      <h2 className="text-2xl font-bold text-[#ffca08] mb-6 flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Your Information
      </h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-green-100 mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0d2a10] border border-[#246b2b] text-white rounded-xl focus:ring-2 focus:ring-[#ffca08] focus:border-[#ffca08] outline-none transition-all placeholder-green-700/50"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-green-100 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0d2a10] border border-[#246b2b] text-white rounded-xl focus:ring-2 focus:ring-[#ffca08] focus:border-[#ffca08] outline-none transition-all placeholder-green-700/50"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-green-100 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={userData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0d2a10] border border-[#246b2b] text-white rounded-xl focus:ring-2 focus:ring-[#ffca08] focus:border-[#ffca08] outline-none transition-all placeholder-green-700/50"
            placeholder="Enter your city/location"
          />
        </div>
      </div>
    </div>
  );
};
