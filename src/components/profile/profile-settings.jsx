import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, AtSign, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function ProfileSettings() {
  const [bio, setBio] = useState("");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 antialiased">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-400 mt-2">Customize your profile</p>
        </div>

        <form className="space-y-10 bg-[#111111] p-8 rounded-2xl border border-gray-800 shadow-xl animate-slide-up">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="w-32 h-32 ring-2 ring-gray-700 ring-offset-2 ring-offset-[#111111] transition-all duration-300 group-hover:ring-indigo-500">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256"
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-900">JD</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full transform transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer hover:bg-indigo-700">
                <Camera className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-gray-400">Maximum size: 2MB</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-200">Personal Information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <PersonalInfo id="fullName" label="Full Name" defaultValue="John Doe" />
              <PersonalInfo id="username" label="Username" defaultValue="johndoe" icon={AtSign} />
              <PersonalInfo id="dob" label="Date of Birth" defaultValue="1990-01-01" type="date" icon={Calendar} />
              <PersonalInfo id="location" label="Location" defaultValue="New York, USA" icon={MapPin} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-200">Contact Information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <PersonalInfo id="email" label="Email" defaultValue="john@example.com" type="email" icon={Mail} />
              <PersonalInfo id="phone" label="Phone Number" defaultValue="+1 (555) 000-0000" type="tel" icon={Phone} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-300">About You</Label>
            <div className="relative">
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="min-h-[120px] bg-[#1A1A1A] border-gray-800 focus:border-indigo-500 transition-colors duration-200 resize-none"
                maxLength={500}
              />
              <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                {bio.length}/500 characters
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 text-white rounded-lg px-8 py-2.5">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PersonalInfo({ id, label, defaultValue, type = "text", icon: Icon }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-300">{label}</Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />}
        <Input
          id={id}
          type={type}
          defaultValue={defaultValue}
          className={`bg-[#1A1A1A] border-gray-800 ${Icon ? "pl-10" : ""} focus:border-indigo-500 transition-colors duration-200`}
        />
      </div>
    </div>
  );
}
