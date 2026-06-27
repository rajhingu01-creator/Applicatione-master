import AsyncStorage from "@react-native-async-storage/async-storage";

const POSTED_JOBS_STORAGE_KEY = "employerPostedJobs";
const DEFAULT_EMPLOYER_SCOPE = "guest";

const getStringHash = (value) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash.toString(36);
};

const getPostedJobsStorageKey = async () => {
  const token = await AsyncStorage.getItem("userToken");
  const scope = token ? getStringHash(token) : DEFAULT_EMPLOYER_SCOPE;

  return `${POSTED_JOBS_STORAGE_KEY}:${scope}`;
};

const defaultRequirements = [
  "3+ years of experience in React Native",
  "Strong JavaScript / TypeScript skills",
  "Experience with REST APIs",
];

const defaultSkills = [
  "React Native",
  "Redux",
  "JavaScript",
  "TypeScript",
  "REST API",
  "Git",
  "API Integration",
  "UI/UX",
];

const createAppliedCandidates = (
  jobId,
  jobTitle = "React Native Developer",
) => [
  {
    id: `${jobId}-meet-vaniya`,
    name: "Meet Vaniya",
    role: jobTitle,
    experience: "3 Years",
    location: "Ahmedabad, Gujarat",
    match: "95% Match",
    status: "New",
    initials: "MV",
    colors: ["#E1B28E", "#A8653E"],
    skills: ["React Native", "Redux", "API Integration"],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: `${jobId}-rahul-patel`,
    name: "Rahul Patel",
    role: jobTitle,
    experience: "4 Years",
    location: "Surat, Gujarat",
    match: "92% Match",
    status: "Reviewed",
    initials: "RP",
    colors: ["#D5BFA8", "#7C6650"],
    skills: ["JavaScript", "REST API", "Git"],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: `${jobId}-priya-desai`,
    name: "Priya Desai",
    role: jobTitle,
    experience: "5 Years",
    location: "Gandhinagar, Gujarat",
    match: "90% Match",
    status: "New",
    initials: "PD",
    colors: ["#C6B8FF", "#6347FF"],
    skills: ["React Native", "Expo", "Firebase"],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: `${jobId}-amit-shah`,
    name: "Amit Shah",
    role: jobTitle,
    experience: "3.5 Years",
    location: "Vadodara, Gujarat",
    match: "88% Match",
    status: "Shortlisted",
    initials: "AS",
    colors: ["#BDAF9E", "#4B4642"],
    skills: ["TypeScript", "UI/UX", "React Native"],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: `${jobId}-neha-joshi`,
    name: "Neha Joshi",
    role: jobTitle,
    experience: "2.5 Years",
    location: "Rajkot, Gujarat",
    match: "86% Match",
    status: "Reviewed",
    initials: "NJ",
    colors: ["#FFC2D8", "#F13391"],
    skills: ["JavaScript", "Redux", "UI/UX"],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: `${jobId}-karan-mehta`,
    name: "Karan Mehta",
    role: jobTitle,
    experience: "6 Years",
    location: "Mumbai, Maharashtra",
    match: "84% Match",
    status: "Interview",
    initials: "KM",
    colors: ["#9FE7DF", "#20B9B0"],
    skills: ["TypeScript", "REST API", "Team Lead"],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: `${jobId}-jignesh-parmar`,
    name: "Jignesh Parmar",
    role: jobTitle,
    experience: "3 Years",
    location: "Ahmedabad, Gujarat",
    match: "82% Match",
    status: "New",
    initials: "JP",
    colors: ["#FFD49D", "#F2643C"],
    skills: ["React Native", "Git", "API Integration"],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 44).toISOString(),
  },
  {
    id: `${jobId}-riya-shah`,
    name: "Riya Shah",
    role: jobTitle,
    experience: "4.5 Years",
    location: "Pune, Maharashtra",
    match: "80% Match",
    status: "Hold",
    initials: "RS",
    colors: ["#B4D1FF", "#3378F6"],
    skills: ["Expo", "JavaScript", "Testing"],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
  },
];

const mergeDemoCandidates = (jobId, title, currentCandidates) => {
  const demoCandidates = createAppliedCandidates(jobId, title);

  if (!Array.isArray(currentCandidates) || !currentCandidates.length) {
    return demoCandidates;
  }

  const onlyExistingDemoCandidates = currentCandidates.every((candidate) =>
    candidate.id?.startsWith(`${jobId}-`),
  );

  if (!onlyExistingDemoCandidates) {
    return currentCandidates;
  }

  const currentCandidateIds = new Set(
    currentCandidates.map((candidate) => candidate.id),
  );

  return [
    ...currentCandidates,
    ...demoCandidates.filter(
      (candidate) => !currentCandidateIds.has(candidate.id),
    ),
  ];
};

export const normalizePostedJob = (job = {}) => {
  const jobId =
    job.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const title = job.title || "React Native Developer";
  const appliedCandidates = mergeDemoCandidates(
    jobId,
    title,
    job.appliedCandidates,
  );

  return {
    ...job,
    id: jobId,
    title,
    experience: job.experience || "3+ Yrs Exp",
    experienceSummary: job.experienceSummary || "3 Years Experience",
    location: job.location || "Ahmedabad, Gujarat",
    salary: job.salary || "₹ 4 - 6 LPA",
    type: job.type || "Full Time",
    status: job.status || "Active",
    description:
      job.description ||
      "We are looking for a skilled React Native Developer to build modern and performant mobile applications for Android and iOS platforms.",
    requirements: Array.isArray(job.requirements)
      ? job.requirements
      : defaultRequirements,
    skills: Array.isArray(job.skills) ? job.skills : defaultSkills,
    appliedCandidates,
    applicants: appliedCandidates.length,
    recommended: job.recommended ?? 95,
    createdAt: job.createdAt || new Date().toISOString(),
  };
};

export const createPostedJob = ({ description } = {}) => {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return normalizePostedJob({
    id,
    title: "React Native Developer",
    experience: "3+ Yrs Exp",
    experienceSummary: "3 Years Experience",
    location: "Ahmedabad, Gujarat",
    salary: "₹ 4 - 6 LPA",
    type: "Full Time",
    status: "Active",
    description:
      description?.trim() ||
      "We are looking for a skilled React Native Developer to build modern and performant mobile applications for Android and iOS platforms.",
    requirements: defaultRequirements,
    skills: defaultSkills,
    recommended: 95,
    createdAt: new Date().toISOString(),
  });
};

export const getPostedJobs = async () => {
  const storageKey = await getPostedJobsStorageKey();
  const rawJobs = await AsyncStorage.getItem(storageKey);

  if (!rawJobs) {
    return [];
  }

  try {
    const jobs = JSON.parse(rawJobs);
    return Array.isArray(jobs) ? jobs.map(normalizePostedJob) : [];
  } catch {
    return [];
  }
};

export const savePostedJob = async (job) => {
  const storageKey = await getPostedJobsStorageKey();
  const jobs = await getPostedJobs();
  const nextJobs = [normalizePostedJob(job), ...jobs];

  await AsyncStorage.setItem(storageKey, JSON.stringify(nextJobs));

  return nextJobs;
};
