// Database types matching the schema

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

export interface Campus {
  id: string;
  campusid: string;
  portfolioid: string;
  name: string;
  country: string;
  city: string;
  address: string | null;
  city_id: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Building {
  id: string;
  buildingid: string;
  campusid: string;
  name: string;
  totalareacarpet: number;
  totalfloors: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Floor {
  id: string;
  floorid: string;
  buildingid: string;
  floornumber: number;
  totalseats: number;
  carpetarea: number | null;
  created_at: string;
  updated_at: string;
}

export interface SeatZone {
  id: string;
  seatzoneid: string;
  floorid: string;
  name: string;
  occupancystatus: string;
  created_at: string;
  updated_at: string;
}

export interface Country {
  name: string;
  region: string | null;
  code: string;
}

export interface City {
  id: number;
  name: string;
  state: string | null;
  country_code: string;
  created_at: string;
  updated_at: string;
}