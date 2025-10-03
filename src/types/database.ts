export interface Country {
  code: string;
  name: string;
  region: string;
}

export interface Organization {
  id: string;
  organizationid: string;
  name: string;
  description: string | null;
  headquarters: string | null;
  website: string | null;
  country_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  portfolioid: string;
  organizationid: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioWithDetails extends Portfolio {
  organization_name?: string;
  country_name?: string;
}

export interface OrganizationWithCountry extends Organization {
  country_name?: string;
}
