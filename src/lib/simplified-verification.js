// Enhanced verification system with detailed change tracking
import crypto from "crypto"

// In-memory database to store resume history (in a real app, this would be a database)
const resumeDatabase = {
  histories: {},
  getHistory: function (userId) {
    return this.histories[userId] || []
  },
  addEntry: function (userId, resumeData) {
    if (!this.histories[userId]) {
      this.histories[userId] = []
    }

    // Create hash of resume data
    const hash = this.generateHash(resumeData)

    // Get previous version to compare changes
    const previousVersion =
      this.histories[userId].length > 0 ? this.histories[userId][this.histories[userId].length - 1].data : null

    // Track specific changes
    const changes = previousVersion ? this.detectChanges(previousVersion, resumeData) : ["Initial resume creation"]

    // Create new entry
    const entry = {
      hash: hash,
      timestamp: new Date().toISOString(),
      data: resumeData,
      changes: changes,
    }

    // Add to history
    this.histories[userId].push(entry)

    // Save to localStorage for persistence
    this.saveToStorage()

    return entry
  },
  generateHash: (data) => {
    // Create a deterministic JSON string (sorted keys)
    const orderedData = {}
    Object.keys(data)
      .sort()
      .forEach((key) => {
        orderedData[key] = data[key]
      })

    // Generate SHA-256 hash
    return crypto.createHash("sha256").update(JSON.stringify(orderedData)).digest("hex")
  },
  detectChanges: (oldData, newData) => {
    const changes = []

    // Compare each field to detect changes
    Object.keys(newData).forEach((key) => {
      if (oldData[key] !== newData[key]) {
        if (key === "name" && oldData[key] !== newData[key]) {
          changes.push(`Updated name from "${oldData[key]}" to "${newData[key]}"`)
        } else if (key === "title" && oldData[key] !== newData[key]) {
          changes.push(`Updated professional title from "${oldData[key]}" to "${newData[key]}"`)
        } else if (key === "bio" && oldData[key] !== newData[key]) {
          if (!oldData[key] && newData[key]) {
            changes.push(`Added professional summary`)
          } else if (oldData[key] && !newData[key]) {
            changes.push(`Removed professional summary`)
          } else {
            changes.push(`Updated professional summary`)
          }
        } else if (key === "skills") {
          // Compare skills to see what was added or removed
          const oldSkills = oldData[key] ? oldData[key].split(",").map((s) => s.trim()) : []
          const newSkills = newData[key] ? newData[key].split(",").map((s) => s.trim()) : []

          const addedSkills = newSkills.filter((skill) => !oldSkills.includes(skill))
          const removedSkills = oldSkills.filter((skill) => !newSkills.includes(skill))

          if (addedSkills.length > 0) {
            changes.push(`Added skills: ${addedSkills.join(", ")}`)
          }

          if (removedSkills.length > 0) {
            changes.push(`Removed skills: ${removedSkills.join(", ")}`)
          }
        } else if (key === "experience") {
          if (!oldData[key] && newData[key]) {
            changes.push(`Added work experience`)
          } else if (oldData[key] && !newData[key]) {
            changes.push(`Removed work experience`)
          } else {
            changes.push(`Updated work experience`)
          }
        } else if (key === "education") {
          if (!oldData[key] && newData[key]) {
            changes.push(`Added education information`)
          } else if (oldData[key] && !newData[key]) {
            changes.push(`Removed education information`)
          } else {
            changes.push(`Updated education information`)
          }
        } else if (key === "projects") {
          if (!oldData[key] && newData[key]) {
            changes.push(`Added projects`)
          } else if (oldData[key] && !newData[key]) {
            changes.push(`Removed projects`)
          } else {
            changes.push(`Updated projects`)
          }
        } else if (key === "contact") {
          if (!oldData[key] && newData[key]) {
            changes.push(`Added contact information`)
          } else if (oldData[key] && !newData[key]) {
            changes.push(`Removed contact information`)
          } else {
            changes.push(`Updated contact information`)
          }
        }
      }
    })

    // If no changes detected, add a generic message
    if (changes.length === 0) {
      changes.push("Minor updates to resume")
    }

    return changes
  },
  saveToStorage: function () {
    if (typeof window !== "undefined") {
      localStorage.setItem("resume-verification-database", JSON.stringify(this.histories))
    }
  },
  loadFromStorage: function () {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("resume-verification-database")
      if (data) {
        this.histories = JSON.parse(data)
      }
    }
  },
  verifyResume: function (userId, hash) {
    const history = this.getHistory(userId)
    return history.find((entry) => entry.hash === hash)
  },
  getHashDetails: (hash) => {
    // Return information about how the hash was generated
    return {
      algorithm: "SHA-256",
      description:
        "This hash is a unique fingerprint of your resume created using the SHA-256 algorithm. It changes whenever any part of your resume is modified, allowing for verification of the exact version.",
    }
  },
}

// Load database from localStorage on initialization
if (typeof window !== "undefined") {
  resumeDatabase.loadFromStorage()
}

// Generate a unique user ID if not already created
export const getUserId = () => {
  if (typeof window !== "undefined") {
    let userId = localStorage.getItem("resume-verification-user-id")
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substring(2, 15)
      localStorage.setItem("resume-verification-user-id", userId)
    }
    return userId
  }
  return "user_default"
}

// Store resume in the verification system
export const storeResumeForVerification = (resumeData) => {
  try {
    const userId = getUserId()
    const entry = resumeDatabase.addEntry(userId, resumeData)

    return {
      success: true,
      hash: entry.hash,
      timestamp: entry.timestamp,
      changes: entry.changes,
    }
  } catch (error) {
    console.error("Error storing resume:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Get resume history
export const getResumeHistory = (userId = null) => {
  try {
    const id = userId || getUserId()
    return resumeDatabase.getHistory(id).map((entry) => ({
      hash: entry.hash,
      timestamp: entry.timestamp,
      changes: entry.changes,
      // Include a preview of the resume data
      preview: {
        name: entry.data.name,
        title: entry.data.title,
        updatedAt: entry.timestamp,
      },
    }))
  } catch (error) {
    console.error("Error getting resume history:", error)
    return []
  }
}

// Verify resume
export const verifyResume = (userId, hash) => {
  try {
    const entry = resumeDatabase.verifyResume(userId, hash)

    if (entry) {
      return {
        verified: true,
        timestamp: entry.timestamp,
        data: entry.data,
        changes: entry.changes,
      }
    }

    return {
      verified: false,
    }
  } catch (error) {
    console.error("Error verifying resume:", error)
    return { verified: false }
  }
}

// Generate QR code for resume verification
export const generateVerificationQR = (hash, userId = null) => {
  try {
    const id = userId || getUserId()

    // Create verification URL
    const verificationUrl = `${window.location.origin}/verify?hash=${hash}&userId=${id}`

    // Generate QR code using a public API
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verificationUrl)}`
  } catch (error) {
    console.error("Error generating QR code:", error)
    return null
  }
}

// Get hash details
export const getHashDetails = (hash) => {
  return resumeDatabase.getHashDetails(hash)
}

// Compare two resume versions to show differences
export const compareResumeVersions = (oldHash, newHash, userId = null) => {
  try {
    const id = userId || getUserId()
    const history = resumeDatabase.getHistory(id)

    const oldVersion = history.find((entry) => entry.hash === oldHash)
    const newVersion = history.find((entry) => entry.hash === newHash)

    if (!oldVersion || !newVersion) {
      return { error: "One or both versions not found" }
    }

    return {
      changes: resumeDatabase.detectChanges(oldVersion.data, newVersion.data),
      oldTimestamp: oldVersion.timestamp,
      newTimestamp: newVersion.timestamp,
    }
  } catch (error) {
    console.error("Error comparing versions:", error)
    return { error: "Failed to compare versions" }
  }
}

