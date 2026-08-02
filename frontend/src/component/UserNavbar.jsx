import { useState, useEffect, useCallback } from "react";
import styles from "./UserNavbar.module.css"
import { Link, useNavigate } from "react-router-dom";
import { IconNotification } from "./icons/IconNotification"
import { IconUserProfile } from "./icons/IconUserProfile"
import { IconBag } from "./icons/IconBag"
import { IconSearch } from "./icons/IconSearch"
import { IconHourglass } from "./icons/IconHourglass"
import { cns } from "../utils/classNames"
import useUserAuth from "../hooks/useUserAuth";
import { apiGetAllVacancies } from "../services/apiVacancy";

// Debounce function to limit API calls
const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export default function UserNavbar({ className = "" }) {
  const { userId, isAuthenticated, clearAuth } = useUserAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allJobs, setAllJobs] = useState([]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  // Fetch all available jobs
  const fetchAllJobs = useCallback(async () => {
    if (allJobs.length > 0) return; // Don't fetch if we already have jobs
    
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching jobs...");
      const response = await apiGetAllVacancies();
      console.log("API Response:", response);
      
      // Handle different response structures
      let jobs = [];
      if (Array.isArray(response)) {
        jobs = response; // Direct array response
      } else if (response?.data && Array.isArray(response.data)) {
        jobs = response.data; // { data: [...] } response
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        jobs = response.data.data; // { data: { data: [...] } } response
      }
      
      console.log("Extracted jobs:", jobs);
      setAllJobs(jobs);
      // Don't set search results here - only set when user types
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Failed to load jobs. Please try again later.");
      setAllJobs([]);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [allJobs.length]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      
      const filtered = allJobs.filter(job => 
        (job.title?.toLowerCase() || '').includes(query.toLowerCase()) ||
        (job.organization?.orgName?.toLowerCase() || '').includes(query.toLowerCase()) ||
        (job.organization?.name?.toLowerCase() || '').includes(query.toLowerCase()) ||
        (job.department?.toLowerCase() || '').includes(query.toLowerCase()) ||
        (job.jobLevel?.toLowerCase() || '').includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    }, 300),
    [allJobs]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    
    if (query.length > 0) {
      // Only search if there's a query
      debouncedSearch(query);
    } else {
      // Clear results if search is empty
      setSearchResults([]);
    }
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (allJobs.length === 0) {
      fetchAllJobs();
    }
  };

  // Handle search input blur
  const handleSearchBlur = () => {
    // Use setTimeout to allow click events on search results to fire first
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 200);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest(`.${styles.searchContainer}`) === null) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={cns(styles.navbar, className)}>
      <Link to="/" className={styles.logo}>BMAP</Link>
      
      <div className={styles.searchContainer}>
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            placeholder="Search for jobs, companies..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              setIsSearchFocused(true);
              // Only fetch jobs if we don't have them yet
              if (allJobs.length === 0) {
                fetchAllJobs();
              }
            }}
            onBlur={handleSearchBlur}
            aria-label="Search for jobs and companies"
          />
          <IconSearch className={styles.searchIcon} />
          {isLoading && <IconHourglass className={styles.loaderIcon} />}
        </div>
        
        {isSearchFocused && searchQuery.length > 0 && (
          <div className={styles.searchResults}>
            {isLoading && allJobs.length === 0 ? (
              <div className={styles.searchStatus}>
                <IconHourglass className={styles.loaderIcon} />
                <span>Loading jobs...</span>
              </div>
            ) : error ? (
              <div className={styles.searchStatus}>
                <span className={styles.errorText}>{error}</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className={styles.searchStatus}>
                <span>No jobs found. Try different keywords.</span>
              </div>
            ) : (
              <>
                <div className={styles.searchResultsHeader}>
                  <h4>Jobs</h4>
                  <span className={styles.resultCount}>{searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}</span>
                </div>
                <div className={styles.searchResultsList}>
                  {searchResults.slice(0, 5).map((job) => {
                    // Get organization name with fallbacks
                    const orgName = job.organization?.orgName || 
                                  job.organization?.name || 
                                  job.orgId?.orgName || 
                                  job.orgId?.name || 
                                  'Company';
                    
                    // Get location with fallbacks
                    const getLocationString = (location) => {
                      if (!location) return 'Location not specified';
                      
                      // If location is a string, return it directly
                      if (typeof location === 'string') return location;
                      
                      // If location is an object with coordinates, handle it
                      if (location.coordinates && Array.isArray(location.coordinates)) {
                        // If there's a formatted address, use that
                        if (location.formattedAddress) return location.formattedAddress;
                        // Otherwise, return the coordinates
                        return `Location: ${location.coordinates[1]}, ${location.coordinates[0]}`;
                      }
                      
                      // If location is an object with address fields
                      if (location.city || location.state || location.country) {
                        return [
                          location.street,
                          location.city,
                          location.state,
                          location.country
                        ].filter(Boolean).join(', ');
                      }
                      
                      return 'Location not specified';
                    };
                    
                    const location = getLocationString(
                      job.location || 
                      job.organization?.location || 
                      job.orgId?.location
                    );
                    
                    return (
                      <Link 
                        key={job._id} 
                        to={`/view-jobdescription/${job._id}`} 
                        className={styles.searchResultItem}
                        onClick={() => {
                          setSearchQuery("");
                          setIsSearchFocused(false);
                        }}
                      >
                        <div className={styles.jobTitle}>{job.title || 'Untitled Position'}</div>
                        <div className={styles.jobCompany}>
                          {orgName}
                        </div>
                        <div className={styles.jobLocation}>
                          {location}
                        </div>
                      </Link>
                    );
                  })}
                  {searchResults.length > 5 && (
                    <Link 
                      to={`/search?q=${encodeURIComponent(searchQuery)}`} 
                      className={styles.viewAllLink}
                      onClick={() => setIsSearchFocused(false)}
                    >
                      View all {searchResults.length} results
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className={styles.navActions}>
      {/*   <Link to="/jobs" className={styles.navItem}>
          <IconBag />
          <span className={styles.navItemText}>Jobs</span>
        </Link> */}
       {/*  <div className={styles.navItem}>
          <IconNotification />
          <span className={styles.navItemText}>Notification</span>
        </div> */}
        {isAuthenticated ? (
          <>
            <Link to="/userprofile/" className={styles.navItem}>
              <IconUserProfile />
              <span className={styles.navItemText}>Profile</span>
            </Link>
            <button onClick={handleLogout} className={styles.navItem} style={{ background: 'none', border: 'none', padding: 0, font: 'inherit' }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.navItem}>
            <span className={styles.navItemText}>Login / Signup</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
