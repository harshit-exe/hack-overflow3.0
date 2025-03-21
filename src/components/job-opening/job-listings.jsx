"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiURL } from "@/constants";
import { toast } from "react-toastify";

// Company logos
const companyLogos = {
  Google:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png",
  Dropbox:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Dropbox_logo.svg/1200px-Dropbox_logo.svg.png",
  Airbnb:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_logo.svg/2560px-Airbnb_logo.svg.png",
  Microsoft:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png",
  Amazon:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
  Netflix:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png",
};

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Most Recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);

  // Simulate fetching jobs from an API
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          query: "IT jobs",
          limit: "10",
          page: "1",
          num_pages: "1",
          country: "in",
          language: "en",
        });

        const fullUrl = `${apiURL}/api/jobs/getMergedTrendingJobs?${params.toString()}`;
        console.log("Fetching from:", fullUrl);

        const res = await fetch(fullUrl, {
          method: "GET",
        });

        if (!res.ok) {
          toast.error("Unable to fetch");
        }

        const data = await res.json();
        setJobs(data.data);
        setFilteredJobs(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setIsLoading(false);
      }
    };

    fetchJobs();

    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem("bookmarkedJobs");
    if (savedBookmarks) {
      setBookmarkedJobs(JSON.parse(savedBookmarks));
    }
  }, []);

  // Filter jobs based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = jobs.filter(
        (job) =>
          job.job_title.toLowerCase().includes(lowercaseSearch) ||
          job.employer_name.toLowerCase().includes(lowercaseSearch) ||
          job.job_country.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  // Sort jobs based on selected option
  // useEffect(() => {
  //   const sortedJobs = [...filteredJobs];

  //   switch (sortOption) {
  //     case "Most Recent":
  //       sortedJobs.sort((a, b) => {
  //         const aTime = a.postedDays || a.postedWeeks * 7;
  //         const bTime = b.postedDays || b.postedWeeks * 7;
  //         return aTime - bTime;
  //       });
  //       break;
  //     case "Highest Salary":
  //       sortedJobs.sort((a, b) => b.salaryMax - a.salaryMax);
  //       break;
  //     case "Lowest Salary":
  //       sortedJobs.sort((a, b) => a.salaryMin - b.salaryMin);
  //       break;
  //     default:
  //       break;
  //   }

  //   setFilteredJobs(sortedJobs);
  // }, [sortOption]);

  // Handle bookmark toggle
  const toggleBookmark = (jobId) => {
    let updatedBookmarks;

    if (bookmarkedJobs.includes(jobId)) {
      updatedBookmarks = bookmarkedJobs.filter((id) => id !== jobId);
    } else {
      updatedBookmarks = [...bookmarkedJobs, jobId];
    }

    setBookmarkedJobs(updatedBookmarks);
    localStorage.setItem("bookmarkedJobs", JSON.stringify(updatedBookmarks));
  };

  // Format salary display
  // const formatSalary = (min, max) => {
  //   return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  // };

  // Format posted time
  const formatPostedTime = (days, weeks) => {
    if (days) {
      return `Posted ${days} day${days !== 1 ? "s" : ""} ago`;
    }
    if (weeks) {
      return `Posted ${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    }
    return "Recently posted";
  };

  // Calculate pagination
  const jobsPerPage = 6;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="job-listings-container">
      <div className="header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Featured Job Opportunities
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Discover your next career move from our curated job listings
        </motion.p>
      </div>

      <motion.div
        className="search-container"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </motion.div>

      <div className="jobs-header">
        {/* <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Showing {filteredJobs.length} jobs
        </motion.p> */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="sort-container"
        >
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="Most Recent">Sort by: Most Recent</option>
            <option value="Highest Salary">Sort by: Highest Salary</option>
            <option value="Lowest Salary">Sort by: Lowest Salary</option>
          </select>
        </motion.div> */}
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading jobs...</p>
        </div>
      ) : (
        <>
          <div className="jobs-grid">
            {currentJobs.map((job, index) => (
              <motion.div
                key={job.job_id}
                className="job-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div className="job-card-header">
                  <div className="company-logo">
                    <img
                      src={
                        companyLogos[job.employer_name] || "/placeholder.svg"
                      }
                      alt={`${job.employer_name} logo`}
                    />
                  </div>
                  <div className="job-title-container">
                    <h3>{job.job_title}</h3>
                    <p className="company-name">{job.employer_name}</p>
                  </div>
                  <button
                    className={`bookmark-button ${
                      bookmarkedJobs.includes(job.job_id) ? "bookmarked" : ""
                    }`}
                    onClick={() => toggleBookmark(job.job_id)}
                    aria-label={
                      bookmarkedJobs.includes(job.job_id)
                        ? "Remove bookmark"
                        : "Add bookmark"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={
                        bookmarkedJobs.includes(job.job_id)
                          ? "currentColor"
                          : "none"
                      }
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                </div>

                <div className="job-details">
                  <div className="detail-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{job.job_country}</span>
                  </div>

                  <div className="detail-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="2"
                        y="7"
                        width="20"
                        height="14"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <span>{job.job_publisher}</span>
                  </div>
                </div>

                {/* <div className="salary-range">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </div> */}

                <div className="job-footer">
                  <div className="posted-time">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>
                      {formatPostedTime(job.postedDays, job.postedWeeks)}
                    </span>
                  </div>

                  <div className="posted-by">by {job.postedBy}</div>
                </div>

                <button className="apply-button">Check Out</button>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-arrow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show limited page numbers with ellipsis
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`pagination-number ${
                        currentPage === pageNumber ? "active" : ""
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  (pageNumber === currentPage - 2 && currentPage > 3) ||
                  (pageNumber === currentPage + 2 &&
                    currentPage < totalPages - 2)
                ) {
                  return (
                    <span key={pageNumber} className="pagination-ellipsis">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-arrow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
