// app/modules/jobs/utils/german-job-scraper.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

// German job board URLs
const GERMAN_JOB_BOARDS = {
  STEPSTONE: 'https://www.stepstone.de',
  INDEED_DE: 'https://de.indeed.com',
  JOBS_DE: 'https://www.jobs.de',
  BERUFENET: 'https://www.berufenet.arbeitsagentur.de'
};

interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  contractType: 'full-time' | 'part-time' | 'freelance' | 'internship' | 'apprenticeship';
  experienceLevel: 'entry' | 'intermediate' | 'senior' | 'executive';
  remote: 'no' | 'hybrid' | 'full';
  url: string;
  source: string;
  postedDate: string;
}

/**
 * Scrape jobs from StepStone Germany
 * @param query Search query
 * @param location Location filter
 * @returns Array of scraped jobs
 */
async function scrapeStepStoneJobs(query: string, location: string): Promise<ScrapedJob[]> {
  try {
    // This is a simplified example - in a real implementation, you would need to:
    // 1. Handle pagination
    // 2. Properly parse job details
    // 3. Handle anti-scraping measures
    // 4. Add proper error handling and retries
    
    const searchUrl = `${GERMAN_JOB_BOARDS.STEPSTONE}/jobs/${encodeURIComponent(query)}/s-${encodeURIComponent(location)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const jobs: ScrapedJob[] = [];
    
    // Example selector - this would need to be adjusted based on the actual HTML structure
    $('.job-element').each((index, element) => {
      const title = $(element).find('.job-title').text().trim();
      const company = $(element).find('.company-name').text().trim();
      const jobLocation = $(element).find('.job-location').text().trim();
      const description = $(element).find('.job-description').text().trim();
      const url = $(element).find('a').attr('href') || '#';
      const postedDate = $(element).find('.posting-date').text().trim() || new Date().toISOString();
      
      if (title && company) {
        jobs.push({
          id: `stepstone-${index}-${Date.now()}`,
          title,
          company,
          location: jobLocation || location,
          description,
          contractType: 'full-time', // Would need to parse from job details
          experienceLevel: 'entry', // Would need to parse from job details
          remote: 'no', // Would need to parse from job details
          url: url.startsWith('http') ? url : `${GERMAN_JOB_BOARDS.STEPSTONE}${url}`,
          source: 'stepstone',
          postedDate
        });
      }
    });
    
    return jobs;
  } catch (error) {
    console.error('Error scraping StepStone jobs:', error);
    return [];
  }
}

/**
 * Scrape jobs from Indeed Germany
 * @param query Search query
 * @param location Location filter
 * @returns Array of scraped jobs
 */
async function scrapeIndeedJobs(query: string, location: string): Promise<ScrapedJob[]> {
  try {
    const searchUrl = `${GERMAN_JOB_BOARDS.INDEED_DE}/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const jobs: ScrapedJob[] = [];
    
    // Example selector - this would need to be adjusted based on the actual HTML structure
    $('.jobsearch-SerpJobCard').each((index, element) => {
      const title = $(element).find('.jobTitle').text().trim();
      const company = $(element).find('.companyName').text().trim();
      const jobLocation = $(element).find('.companyLocation').text().trim();
      const description = $(element).find('.job-snippet').text().trim();
      const url = $(element).find('a').attr('href') || '#';
      const salary = $(element).find('.salary-snippet').text().trim();
      const postedDate = $(element).find('.date').text().trim() || new Date().toISOString();
      
      if (title && company) {
        jobs.push({
          id: `indeed-de-${index}-${Date.now()}`,
          title,
          company,
          location: jobLocation || location,
          description,
          salary: salary || undefined,
          contractType: 'full-time', // Would need to parse from job details
          experienceLevel: 'entry', // Would need to parse from job details
          remote: 'no', // Would need to parse from job details
          url: url.startsWith('http') ? url : `${GERMAN_JOB_BOARDS.INDEED_DE}${url}`,
          source: 'indeed-de',
          postedDate
        });
      }
    });
    
    return jobs;
  } catch (error) {
    console.error('Error scraping Indeed Germany jobs:', error);
    return [];
  }
}

/**
 * Scrape jobs from Jobs.de
 * @param query Search query
 * @param location Location filter
 * @returns Array of scraped jobs
 */
async function scrapeJobsDe(query: string, location: string): Promise<ScrapedJob[]> {
  try {
    const searchUrl = `${GERMAN_JOB_BOARDS.JOBS_DE}/stellenangebote.html?st=${encodeURIComponent(query)}&radius=25&plz=${encodeURIComponent(location)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const jobs: ScrapedJob[] = [];
    
    // Example selector - this would need to be adjusted based on the actual HTML structure
    $('.stellenangebot').each((index, element) => {
      const title = $(element).find('.stellenangebot_titel').text().trim();
      const company = $(element).find('.stellenangebot_firma').text().trim();
      const jobLocation = $(element).find('.stellenangebot_standort').text().trim();
      const description = $(element).find('.stellenangebot_beschreibung').text().trim();
      const url = $(element).find('a').attr('href') || '#';
      const postedDate = $(element).find('.stellenangebot_datum').text().trim() || new Date().toISOString();
      
      if (title && company) {
        jobs.push({
          id: `jobs-de-${index}-${Date.now()}`,
          title,
          company,
          location: jobLocation || location,
          description,
          contractType: 'full-time', // Would need to parse from job details
          experienceLevel: 'entry', // Would need to parse from job details
          remote: 'no', // Would need to parse from job details
          url: url.startsWith('http') ? url : `${GERMAN_JOB_BOARDS.JOBS_DE}${url}`,
          source: 'jobs-de',
          postedDate
        });
      }
    });
    
    return jobs;
  } catch (error) {
    console.error('Error scraping Jobs.de:', error);
    return [];
  }
}

/**
 * Main function to scrape German job boards
 * @param query Search query
 * @param location Location filter
 * @returns Array of scraped jobs from all German job boards
 */
export async function scrapeGermanJobs(query: string, location: string): Promise<ScrapedJob[]> {
  try {
    // Run all scraping functions in parallel
    const [stepStoneJobs, indeedJobs, jobsDeJobs] = await Promise.allSettled([
      scrapeStepStoneJobs(query, location),
      scrapeIndeedJobs(query, location),
      scrapeJobsDe(query, location)
    ]);
    
    // Collect successful results
    const allJobs: ScrapedJob[] = [];
    
    if (stepStoneJobs.status === 'fulfilled') {
      allJobs.push(...stepStoneJobs.value);
    }
    
    if (indeedJobs.status === 'fulfilled') {
      allJobs.push(...indeedJobs.value);
    }
    
    if (jobsDeJobs.status === 'fulfilled') {
      allJobs.push(...jobsDeJobs.value);
    }
    
    return allJobs;
  } catch (error) {
    console.error('Error scraping German jobs:', error);
    return [];
  }
}