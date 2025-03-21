"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const SearchBar = ({ onSearch, suggestions }) => {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div className="search-container relative mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          placeholder="Search for career topics..."
          className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] pl-10 pr-4"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#57FF31] hover:text-[#4AE028]"
        >
          +
        </button>
      </form>
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full bg-gray-800 mt-1 rounded-lg shadow-lg"
          >
            {suggestions
              .filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 5)
              .map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </motion.li>
              ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar

