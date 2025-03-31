import axios from 'axios';
import { supabase } from './supabase';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
});

// API functions
export const submitFormData = async (formData: any) => {
  try {
    const response = await api.post('/leads', formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting form data:', error);
    throw error;
  }
};

export const uploadDocument = async (file: File, type: string, leadId: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('documentos')
      .upload(`${leadId}/${type}`, file, {
        cacheControl: '3600',
        upsert: true,
      });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const getOffers = async (leadId: string) => {
  try {
    const response = await api.get(`/leads/${leadId}/ofertas`);
    return response.data;
  } catch (error) {
    console.error('Error getting offers:', error);
    throw error;
  }
};

export const selectOffer = async (leadId: string, offerId: string) => {
  try {
    const response = await api.post(`/leads/${leadId}/ofertas/${offerId}/select`);
    return response.data;
  } catch (error) {
    console.error('Error selecting offer:', error);
    throw error;
  }
};

export default api;
