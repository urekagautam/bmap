// Field of Expertise and Department
export const FIELD_OF_EXPERTISE_OPTIONS = [
  { value: "acc_finance", label: "Accounting/ Finance" },
  { value: "architecture", label: "Architecture/ Interior Designing" },
  {
    value: "banking_insurance",
    label: "Banking/ Insurance/ Financial Services",
  },
  { value: "creative_design", label: "Creative/ Designing / Graphics" },
  {
    value: "construction_engg",
    label: "Construction/ Engineering / Architecture",
  },
  { value: "fashion_textile", label: "Fashion/ Textile Designing" },
  { value: "hospitality", label: "Hospitality" },
  { value: "it_telecom", label: "IT & Telecommunication" },
];

// Education Levels
export const EDUCATION_LEVEL_OPTIONS = [
  { value: "phd", label: "Doctorate (Ph. D)" },
  { value: "masters", label: "Graduate (Masters)" },
  { value: "professional_cert", label: "Professional Certificate" },
  { value: "bachelor", label: "Under Graduate (Bachelor)" },
  { value: "diploma", label: "Under Graduate (Bachelor)Diploma Certificate" },
  { value: "high_school", label: "Higher Secondary (+2/ A Levels/ IB)" },
  { value: "school", label: "School (SLC/ SEE)" },
  { value: "others", label: "Others" },
];

// Skills
export const SKILL_OPTIONS = [
  { value: "working_under_pressure", label: "Working Under Pressure" },
  { value: "nepali_typing", label: "Nepali Typing" },
  { value: "counseling", label: "Counseling" },
  { value: "team_management", label: "Team Management" },
  { value: "marketing", label: "Marketing" },
  { value: "branding2", label: "Branding2" },
  { value: "branding3", label: "Branding3" },
  { value: "branding4", label: "Branding4" },
  { value: "branding5", label: "Branding5" },
  { value: "branding6", label: "Branding6" },
  { value: "branding7", label: "Branding7" },
  { value: "branding8", label: "Branding8" },
  { value: "branding8", label: "Branding8" },
  { value: "branding339", label: "Braefewending8" },
  { value: "branding48", label: "Brandrering8" },
  { value: "branding85", label: "Branding8" },
  { value: "branding82", label: "Branddfing8" },
  { value: "branding87", label: "Brandrggdefeing8" },
  { value: "branding81", label: "Brandinggrg8" },
  { value: "branding80", label: "Branding80" },
];

// Department uses Field of Expertise options
export const DEPARTMENT_OPTIONS = FIELD_OF_EXPERTISE_OPTIONS;

// Experience Criteria
export const EXPERIENCE_CRITERIA_OPTIONS = [
  { value: "less", label: "Less Than" },
  { value: "more", label: "More Than" },
  { value: "more_equal", label: "More than or equal to" },
  { value: "less_equal", label: "Less than or equal to" },
  { value: "equal", label: "Equal to" },
];

// Experience Criteria
export const EXPERIENCE_OPTIONS = [
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3", label: "3 years" },
  { value: "4", label: "4 years" },
  { value: "5", label: "5 years" },
];

//Job Type By Time
export const JOB_BY_TIME = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

//Job Type By Location
export const JOB_BY_LOCATION = [
  { value: "on_site", label: "On-site/In-Office" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "none", label: "None" },
];

//Job Level
export const JOB_BY_LEVEL = [
  { value: "intern", label: "Intern" },
  { value: "mid_level", label: "Mid-level" },
  { value: "senior", label: "Senior" },
];

//Job Level
export const SALARY_TYPE = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

// Districts of Nepal
export const DISTRICT_OPTIONS = [
  { value: "achham", label: "Achham" },
  { value: "arghakhanchi", label: "Arghakhanchi" },
  { value: "baglung", label: "Baglung" },
  { value: "baitadi", label: "Baitadi" },
  { value: "bajhang", label: "Bajhang" },
  { value: "bajura", label: "Bajura" },
  { value: "banke", label: "Banke" },
  { value: "bara", label: "Bara" },
  { value: "bardiya", label: "Bardiya" },
  { value: "bhaktapur", label: "Bhaktapur" },
  { value: "bhojpur", label: "Bhojpur" },
  { value: "chitwan", label: "Chitwan" },
  { value: "dadeldhura", label: "Dadeldhura" },
  { value: "dailekh", label: "Dailekh" },
  { value: "dang", label: "Dang" },
  { value: "darchula", label: "Darchula" },
  { value: "dhading", label: "Dhading" },
  { value: "dhankuta", label: "Dhankuta" },
  { value: "dhanusha", label: "Dhanusha" },
  { value: "dholkha", label: "Dholkha" },
  { value: "dolpa", label: "Dolpa" },
  { value: "doti", label: "Doti" },
  { value: "eastern_rukum", label: "Eastern Rukum" },
  { value: "gorkha", label: "Gorkha" },
  { value: "gulmi", label: "Gulmi" },
  { value: "humla", label: "Humla" },
  { value: "ilam", label: "Ilam" },
  { value: "jajarkot", label: "Jajarkot" },
  { value: "jhapa", label: "Jhapa" },
  { value: "jumla", label: "Jumla" },
  { value: "kailali", label: "Kailali" },
  { value: "kalikot", label: "Kalikot" },
  { value: "kanchanpur", label: "Kanchanpur" },
  { value: "kapilvastu", label: "Kapilvastu" },
  { value: "kaski", label: "Kaski" },
  { value: "kathmandu", label: "Kathmandu" },
  { value: "kavrepalanchok", label: "Kavrepalanchok" },
  { value: "khotang", label: "Khotang" },
  { value: "lalitpur", label: "Lalitpur" },
  { value: "lamjung", label: "Lamjung" },
  { value: "mahottari", label: "Mahottari" },
  { value: "makwanpur", label: "Makwanpur" },
  { value: "manang", label: "Manang" },
  { value: "morang", label: "Morang" },
  { value: "mugu", label: "Mugu" },
  { value: "mustang", label: "Mustang" },
  { value: "myagdi", label: "Myagdi" },
  { value: "nawalparasi_east", label: "Nawalparasi (East)" },
  { value: "nawalparasi_west", label: "Nawalparasi (West)" },
  { value: "nuwakot", label: "Nuwakot" },
  { value: "okhaldhunga", label: "Okhaldhunga" },
  { value: "palpa", label: "Palpa" },
  { value: "panchthar", label: "Panchthar" },
  { value: "parbat", label: "Parbat" },
  { value: "parsa", label: "Parsa" },
  { value: "pyuthan", label: "Pyuthan" },
  { value: "ramechhap", label: "Ramechhap" },
  { value: "rasuwa", label: "Rasuwa" },
  { value: "rautahat", label: "Rautahat" },
  { value: "rolpa", label: "Rolpa" },
  { value: "rukum_east", label: "Rukum (East)" },
  { value: "rukum_west", label: "Rukum (West)" },
  { value: "rupandehi", label: "Rupandehi" },
  { value: "salyan", label: "Salyan" },
  { value: "sankhuwasabha", label: "Sankhuwasabha" },
  { value: "saptari", label: "Saptari" },
  { value: "sarlahi", label: "Sarlahi" },
  { value: "sindhuli", label: "Sindhuli" },
  { value: "sindhupalchok", label: "Sindhupalchok" },
  { value: "siraha", label: "Siraha" },
  { value: "solukhumbu", label: "Solukhumbu" },
  { value: "sunsari", label: "Sunsari" },
  { value: "surkhet", label: "Surkhet" },
  { value: "syangja", label: "Syangja" },
  { value: "tanahun", label: "Tanahun" },
  { value: "taplejung", label: "Taplejung" },
  { value: "terhathum", label: "Terhathum" },
  { value: "udayapur", label: "Udayapur" }
];
