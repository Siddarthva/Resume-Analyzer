import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout specifically for Render cold start
});

/**
 * Enhanced request wrapper with retry logic for "Anti-Gravity" reliability.
 */
export const robustRequest = async (config, onRetry = null) => {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount <= maxRetries) {
    try {
      const response = await apiClient(config);
      return response.data;
    } catch (error) {
      const isNetworkError = !error.response;
      // 502/503/504 are common during Render cold start or load balancer hiccups
      const isRetryableError = error.response && [502, 503, 504].includes(error.response.status);

      if ((isNetworkError || isRetryableError) && retryCount < maxRetries) {
        retryCount++;
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2s, 4s, 8s
        
        if (onRetry) {
          onRetry(retryCount, delay);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // If not retryable or max retries reached, throw structured error
      const errorMessage = error.response?.data?.detail 
        || error.message 
        || "An unexpected network error occurred.";
      
      throw new Error(errorMessage);
    }
  }
};

export const predictMatch = (resumeText, jdText, onRetry) => {
  return robustRequest({
    method: 'post',
    url: '/predict',
    data: {
      resume_text: resumeText,
      jd_text: jdText
    }
  }, onRetry);
};

export const extractTextFromFile = (file, onRetry) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return robustRequest({
    method: 'post',
    url: '/extract-text',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }, onRetry);
};
