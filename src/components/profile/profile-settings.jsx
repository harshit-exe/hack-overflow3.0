"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, AtSign, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { updateProfile } from "./actions"

export default function ProfileSettings() {
  const [bio, setBio] = useState("")

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Profile Settings</h1>
          <p className="text-gray-400">Manage your personal information</p>
        </div>

        <form action={updateProfile} className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32 border-2 border-gray-700">
              <AvatarImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile%20settings-cvDfqNgFDClW0DzJLXcxHnpuJHJWNG.png"
                alt="Profile"
              />
              <AvatarFallback>
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-gray-400">Click to upload (max 5MB)</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" defaultValue="John Doe" className="bg-gray-900 border-gray-700" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  defaultValue="johndoe"
                  className="bg-gray-900 border-gray-700 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="bg-gray-900 border-gray-700 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue="+1 (555) 000-0000"
                  className="bg-gray-900 border-gray-700 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="location"
                  name="location"
                  defaultValue="San Francisco, CA"
                  className="bg-gray-900 border-gray-700 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  defaultValue="1990-01-01"
                  className="bg-gray-900 border-gray-700 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <div className="relative">
              <Textarea
                id="bio"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio..."
                className="min-h-[100px] bg-gray-900 border-gray-700"
                maxLength={200}
              />
              <div className="absolute bottom-2 right-2 text-sm text-gray-400">{bio.length}/200</div>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  )
}

