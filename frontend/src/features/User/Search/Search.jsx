import React, { useEffect, useState } from "react";
import styles from "./Search.module.css";
import UserNavbar from "../../../component/UserNavbar";
import Button from "../../../component/Button";
import JobCard from "../../../component/JobCard";
import { IconSearch } from "../../../component/icons/IconSearch";
import { IconAdd } from "../../../component/icons/IconAdd";
import InputField from "../../../component/InputField";
import { IconLocation } from "../../../component/icons/IconLocation";

const jobsData = [
  {
    title: "Software Engineer",
    company: "Tech Company",
    location: "New York, NY",
    salaryMin: 1800,
    salaryMax: 2200,
    jobType: "Full-time",
    jobMode: "On-site/In-Office",
    level: "Mid-level",
    experienceDuration: "2 years",
    skills: ["JavaScript", "React", "Node.js"],
    deadline: "2025-06-30",
    views: 150,
  },
  {
    title: "Data Scientist",
    company: "Data Corp",
    location: "San Francisco, CA",
    salaryMin: 2800,
    salaryMax: 3200,
    jobType: "Part-time",
    jobMode: "Remote",
    level: "Senior",
    experienceDuration: "3 years",
    skills: ["Python", "Machine Learning", "Statistics"],
    deadline: "2025-07-15",
    views: 90,
  },
  {
    title: "Web Developer",
    company: "Web Solutions",
    location: "Remote",
    salaryMin: 2400,
    salaryMax: 2600,
    jobType: "Contract",
    jobMode: "Remote",
    level: "Intern",
    experienceDuration: "6 months",
    skills: ["HTML", "CSS", "JavaScript"],
    deadline: "2025-05-31",
    views: 75,
  },
];

const Search = () => {
  const [filters, setFilters] = useState({
    jobType: [],
    jobLocation: [],
    jobLevel: [],
    salaryType: [], // This is not used currently in filtering but kept for UI completeness
    minSalary: "",
    maxSalary: "",
    searchQuery: "",
  });

  const [filteredJobs, setFilteredJobs] = useState(jobsData);

  const handleCheckboxChange = (field, value) => {
    setFilters((prev) => {
      const current = new Set(prev[field]);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return { ...prev, [field]: Array.from(current) };
    });
  };

  const handleSalaryChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const clearAllFilters = () => {
    setFilters({
      jobType: [],
      jobLocation: [],
      jobLevel: [],
      salaryType: [],
      minSalary: "",
      maxSalary: "",
      searchQuery: "",
    });
  };

  useEffect(() => {
    const applyFilters = () => {
      let result = [...jobsData];

      const match = (val, arr) => arr.length === 0 || arr.includes(val);

      result = result.filter((job) => {
        const matchesSearch = [job.title, job.company, job.location].some((field) =>
          field.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );

        const min = filters.minSalary ? parseInt(filters.minSalary) : 0;
        const max = filters.maxSalary ? parseInt(filters.maxSalary) : Infinity;

        // Check if job's salary range overlaps filter range
        const salaryInRange = job.salaryMax >= min && job.salaryMin <= max;

        return (
          matchesSearch &&
          match(job.jobType, filters.jobType) &&
          match(job.jobMode, filters.jobLocation) &&
          match(job.level, filters.jobLevel) &&
          salaryInRange
        );
      });

      setFilteredJobs(result);
    };

    applyFilters();
  }, [filters]);

  return (
    <div className={styles.container}>
      <UserNavbar />
      <p className={styles.backBtn}>
        <IconAdd />Back
      </p>
      <div className={styles.searchPageWrapper}>
        <div className={styles.containerTitle}>
          <h1>Explore Jobs</h1>
          <p>Discover your next career move</p>
        </div>

        <div className={styles.searchPageBox}>
          <div className={styles.filterContainer}>
            <h3>Filter Jobs</h3>
            <div className={styles.filterGroup}>
              <p>
                Job Type <span className={styles.subLabel}>(by time)</span>
              </p>
              <div className={styles.filterOptions}>
                {["Full-time", "Part-time", "Contract", "Internship", "Freelance"].map((type) => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange("jobType", type)}
                      checked={filters.jobType.includes(type)}
                    />{" "}
                    {type}
                  </label>
                ))}
              </div>

              <p className={styles.subLabel}>(by location)</p>
              <div className={styles.filterOptions}>
                {["On-site/In-Office", "Remote", "Hybrid"].map((mode) => (
                  <label key={mode}>
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange("jobLocation", mode)}
                      checked={filters.jobLocation.includes(mode)}
                    />{" "}
                    {mode}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.jobLevel}>
              <p>Job Level</p>
              <div className={styles.filterOptions}>
                {["Intern", "Mid-level", "Senior"].map((lvl) => (
                  <label key={lvl}>
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange("jobLevel", lvl)}
                      checked={filters.jobLevel.includes(lvl)}
                    />{" "}
                    {lvl}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.paySection}>
              <p>Pay</p>
              <div className={styles.payInputs}>
                <InputField
                  layout="sm"
                  placeholder="Min"
                  value={filters.minSalary}
                  onChange={(e) => handleSalaryChange("minSalary", e.target.value)}
                />
                <InputField
                  layout="sm"
                  placeholder="Max"
                  value={filters.maxSalary}
                  onChange={(e) => handleSalaryChange("maxSalary", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.salarySection}>
              <p>Salary Type</p>
              <div className={styles.filterOptions}>
                {["Hourly", "Daily", "Weekly", "Monthly", "Yearly"].map((type) => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange("salaryType", type)}
                      checked={filters.salaryType.includes(type)}
                    />{" "}
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterButtons}>
              <Button layout="sm" fill="outline" color="neutralLight" onClick={clearAllFilters}>
                Clear All
              </Button>
              <Button layout="sm" fill="fill" color="neutral">
                Apply
              </Button>
            </div>
          </div>

          <div className={styles.searchResultContainer}>
            <div className={styles.searchBar}>
              <div className={styles.searchInput}>
                <IconSearch className={styles.icon}/>
                <InputField
                  layout=""
                  placeholder="Search for jobs, companies, or keywords"
                  value={filters.searchQuery}
                  onChange={handleSearchChange}
                />
              </div>

              <div className={styles.locationInput}>
                <IconLocation className={styles.icon}/>
                <input type="text" placeholder="Location" />
              </div>

              <Button layout="sm" fill="fill" color="neutral">
                Search
              </Button>
            </div>

            <div className={styles.jobCardContainer}>
              <div className={styles.jobCardWrapper}>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, idx) => (
                    <JobCard
                      key={idx}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      salaryMin={job.salaryMin}
                      salaryMax={job.salaryMax}
                      jobType={job.jobType}
                      jobMode={job.jobMode}
                      level={job.level}
                      experienceDuration={job.experienceDuration}
                      skills={job.skills}
                      deadline={job.deadline}
                      views={job.views}
                    />
                  ))
                ) : (
                  <p>No jobs found matching your filters.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;