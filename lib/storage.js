// /lib/storage.js
import { localISODate, isToday } from './date';

const JOBS_KEY = 'kst_jobs_v1';

const safeGet = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(window.localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const safeSet = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const loadJobs = () => {
  const all = safeGet(JOBS_KEY);
  // purge old days automatically; Manager jobs are day-scoped
  const todays = all.filter((j) => isToday(j.date));
  if (todays.length !== all.length) safeSet(JOBS_KEY, todays);
  return todays;
};

export const addJob = (job) => {
  const todays = loadJobs();
  todays.push(job);
  safeSet(JOBS_KEY, todays);
  return job;
};

export const deleteJob = (id) => {
  const todays = loadJobs().filter((j) => j.id !== id);
  safeSet(JOBS_KEY, todays);
  return todays;
};

export const upsertJobs = (jobs) => {
  // replaces today's set
  safeSet(JOBS_KEY, jobs.filter((j) => isToday(j.date)));
};

export const generateId = () =>
  `job_${Math.random().toString(36).slice(2, 7)}_${Date.now().toString(36)}`;

export const todayDate = () => localISODate();
