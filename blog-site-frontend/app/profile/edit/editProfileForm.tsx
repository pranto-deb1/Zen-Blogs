"use client";
import React, { useState } from "react";
import { editFormAction } from "./editAction";

interface IData {
  name?: string;
  email?: string;
  bio?: string;
  profilePhoto?: string;
}

function EditProfileForm({ data }: { data: IData }) {
  const [formData, setFormData] = useState({
    name: data.name,
    email: data.email,
    bio: data.bio,
    profilePhoto: data.profilePhoto,
  });

  const [loading, setLoading] = useState(false);

  // ইনপুট ফিল্ড চেঞ্জ হ্যান্ডলার
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      // এখানে আপনার API Call (e.g., fetch বা axios) করবেন
      console.log("Updated Profile Data:", formData);
      alert("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("প্রোফাইল আপডেট করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto m-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-3">
        Edit Profile
      </h2>

      <form action={editFormAction} className="space-y-5">
        {/* Profile Photo Preview & Input */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <img
            src={formData.profilePhoto}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 shadow"
          />
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Profile Photo URL
            </label>
            <input
              type="text"
              name="profilePhoto"
              value={formData.profilePhoto}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/photo.jpg"
              required
            />
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email Input (Disabled / Read-only if email change is restricted) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Bio Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Write a short bio about yourself..."
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="px-4 py-2 border rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfileForm;
