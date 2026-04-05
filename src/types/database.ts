// Database Types
export interface Client {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  company?: string;
  website?: string;
  phone?: string;
  first_message?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  client_id: string;
  admin_id?: string;
  content: string;
  sender_type: "client" | "admin";
  created_at: string;
  read_at?: string;
  file_url?: string;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "archived";
  service_type: "basic" | "standard" | "premium";
  budget?: number;
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface FileUpload {
  id: string;
  client_id: string;
  project_id?: string;
  file_path: string;
  file_name: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  features: string[];
  delivery_days: number;
  badge?: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  link?: string;
  github_link?: string;
  created_at: string;
  featured: boolean;
}

export interface SiteContent {
  id: string;
  key: string;
  value: string;
  type: "text" | "html" | "json";
  updated_at: string;
}

export interface Analytics {
  id: string;
  date: string;
  visitors: number;
  page_views: number;
  country?: string;
  device_type?: "mobile" | "desktop" | "tablet";
  browser?: string;
  referrer?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "message" | "file_upload" | "project_update" | "order";
  title: string;
  content: string;
  read: boolean;
  created_at: string;
  link?: string;
}
