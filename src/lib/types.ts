export type AppRole = "admin" | "technician" | "viewer";

export type Department = "CSS" | "Finance" | "IT" | "Facilities" | "Tipp Con";
export const DEPARTMENTS: Department[] = ["CSS", "Finance", "IT", "Facilities", "Tipp Con"];

export type AssetCondition = "Good" | "Fair" | "Poor" | "Damaged";
export const CONDITIONS: AssetCondition[] = ["Good", "Fair", "Poor", "Damaged"];

export type TicketPriority = "Low" | "Medium" | "High" | "Critical";
export const PRIORITIES: TicketPriority[] = ["Low", "Medium", "High", "Critical"];

export type TicketStatus = "Open" | "In Progress" | "On Hold" | "Resolved" | "Closed";
export const STATUSES: TicketStatus[] = ["Open", "In Progress", "On Hold", "Resolved", "Closed"];

export type TicketCategory = "Hardware" | "Software" | "Network" | "Access" | "Other";
export const CATEGORIES: TicketCategory[] = ["Hardware", "Software", "Network", "Access", "Other"];

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  department: string | null;
}

export interface Asset {
  asset_id: string;
  barcode: string | null;
  serial_number: string | null;
  asset_description: string | null;
  assigned_to: string | null;
  location: string | null;
  department: Department | null;
  asset_condition: AssetCondition | null;
  last_verified_date: string | null;
  verified_by: string | null;
  returned_date: string | null;
  reallocated_to: string | null;
  is_deleted?: boolean | null;
  created_at: string;
}

export interface Verification {
  id: string;
  asset_id: string;
  verified_by: string;
  verified_at: string;
  method: "barcode" | "manual";
  condition_at_verification: AssetCondition | null;
  notes: string | null;
}

export interface Ticket {
  id: string;
  title: string;
  description: string | null;
  submitted_by: string;
  assigned_to: string | null;
  department: Department | null;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  attachment_url?: string | null;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  author_id: string;
  body: string;
  is_internal: boolean;
  created_at: string;
}
