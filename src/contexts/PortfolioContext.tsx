import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface Organization {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  headquarters?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  id: string;
  portfolioId: string;
  organizationId: string;
  name: string;
  region: string;
  country: string;
  countryCode: string; // For ID generation (IN, UK, US, etc.)
  createdAt: string;
  updatedAt: string;
}

export interface Campus {
  id: string;
  campusId: string; // CC-### format
  portfolioId: string;
  name: string;
  city: string;
  address: string;
  gpsCoordinates?: string;
  type: 'traditional_office' | 'sales_office' | 'warehouse' | 'data_center' | 'rd_lab' | 'manufacturing' | 'retail' | 'coworking' | 'training_center';
  status: 'active' | 'inactive' | 'retired';
  totalParkingSlots2W?: number;
  totalParkingSlots4W?: number;
  totalParkingEVSlots?: number;
  amenities: string[];
  greenInfrastructure: {
    hasSolar: boolean;
    hasRainwaterHarvesting: boolean;
    hasSTP: boolean;
    greenAreaPercentage?: number;
  };
  bcpDrSpaceAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Building {
  id: string;
  buildingId: string; // CC-###-XX format
  campusId: string;
  buildingName: string;
  buildingCode: string; // Short label like PIN, PV
  aliasName?: string;
  totalAreaBUA?: number; // Built-up Area
  totalAreaRA?: number; // Rentable Area
  totalAreaCarpet?: number; // Carpet Area
  numberOfFloors: number;
  ownershipType: 'leased' | 'owned';
  leaseDetails?: {
    startDate: string;
    endDate: string;
    monthlyRent: number;
    camCharges: number;
    securityDeposit: number;
    currency: string;
  };
  status: 'active' | 'inactive' | 'retired';
  parkingAllocation2W?: number;
  parkingAllocation4W?: number;
  parkingAllocationEV?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Floor {
  id: string;
  floorId: string; // CC-###-XX-## format
  buildingId: string;
  floorNumber: string; // Can be G, M, 1, 2, etc.
  floorArea: number; // sq.ft
  seatCounts: {
    fixedDesk: number;
    hotDesk: number;
    cafeSeat: number;
    meetingRoomSeat: number;
  };
  totalSeats: number;
  parkingAllocation2W?: number;
  parkingAllocation4W?: number;
  parkingAllocationEV?: number;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SeatZone {
  id: string;
  seatZoneId: string; // CC-###-XX-##-### format
  floorId: string;
  type: 'permanent_desk' | 'hot_desk' | 'cafe' | 'meeting_room' | 'collaboration_space';
  occupancyStatus: 'assigned' | 'free' | 'maintenance';
  assignedTo?: string;
  assignedEmail?: string;
  createdAt: string;
  updatedAt: string;
}

interface PortfolioContextType {
  organizations: Organization[];
  portfolios: Portfolio[];
  campuses: Campus[];
  buildings: Building[];
  floors: Floor[];
  seatZones: SeatZone[];
  
  // Organization operations
  createOrganization: (organization: Omit<Organization, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>) => void;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;
  deleteOrganization: (id: string) => void;
  
  // Portfolio operations
  createPortfolio: (portfolio: Omit<Portfolio, 'id' | 'portfolioId' | 'createdAt' | 'updatedAt'>) => void;
  updatePortfolio: (id: string, updates: Partial<Portfolio>) => void;
  deletePortfolio: (id: string) => void;
  
  // Campus operations
  createCampus: (campus: Omit<Campus, 'id' | 'campusId' | 'createdAt' | 'updatedAt'>) => void;
  updateCampus: (id: string, updates: Partial<Campus>) => void;
  deleteCampus: (id: string) => void;
  
  // Building operations
  createBuilding: (building: Omit<Building, 'id' | 'buildingId' | 'createdAt' | 'updatedAt'>) => void;
  updateBuilding: (id: string, updates: Partial<Building>) => void;
  deleteBuilding: (id: string) => void;
  
  // Floor operations
  createFloor: (floor: Omit<Floor, 'id' | 'floorId' | 'createdAt' | 'updatedAt' | 'totalSeats'>) => void;
  updateFloor: (id: string, updates: Partial<Floor>) => void;
  deleteFloor: (id: string) => void;
  
  // Seat/Zone operations
  createSeatZone: (seatZone: Omit<SeatZone, 'id' | 'seatZoneId' | 'createdAt' | 'updatedAt'>) => void;
  updateSeatZone: (id: string, updates: Partial<SeatZone>) => void;
  deleteSeatZone: (id: string) => void;
  
  // Utility functions
  getOrganizationHierarchy: () => any[];
  getPortfolioHierarchy: () => any[];
  getPortfoliosByOrganization: (organizationId: string) => Portfolio[];
  getCampusesByPortfolio: (portfolioId: string) => Campus[];
  getBuildingsByCampus: (campusId: string) => Building[];
  getFloorsByBuilding: (buildingId: string) => Floor[];
  getSeatZonesByFloor: (floorId: string) => SeatZone[];
  
  // Bulk operations
  bulkImportOrganizations: (data: any[]) => void;
  bulkImportPortfolios: (data: any[]) => void;
  bulkImportCampuses: (data: any[]) => void;
  bulkImportBuildings: (data: any[]) => void;
  bulkImportFloors: (data: any[]) => void;
  
  // Search and filter
  searchEntities: (query: string, entityType?: string) => any[];
  
  // Office selection utilities
  getOfficeHierarchy: (organizationId?: string) => any[];
  findOfficeByPath: (organizationId: string, portfolioId: string, campusId: string, buildingId: string, floorId?: string) => any;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

// ID Generation Functions
const generateOrganizationId = (): string => {
  const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `ORG-${sequence}`;
};

const generatePortfolioId = (): string => {
  const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `PF-${sequence}`;
};

const generateCampusId = (countryCode: string): string => {
  const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `${countryCode}-${sequence}`;
};

const generateBuildingId = (campusId: string, buildingCode: string): string => {
  return `${campusId}-${buildingCode.toUpperCase()}`;
};

const generateFloorId = (buildingId: string, floorNumber: string): string => {
  const floorNum = String(floorNumber).padStart(2, '0');
  return `${buildingId}-${floorNum}`;
};

const generateSeatZoneId = (floorId: string): string => {
  const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `${floorId}-${sequence}`;
};

// Mock Data
const mockOrganizations: Organization[] = [
  {
    id: '1',
    organizationId: 'ORG-001',
    name: 'Subhra Solutions',
    description: 'Global technology and consulting company',
    headquarters: 'Bangalore, India',
    website: 'https://subhrasolutions.com',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    organizationId: 'ORG-002',
    name: 'TechCorp International',
    description: 'Multinational technology corporation',
    headquarters: 'London, UK',
    website: 'https://techcorp.com',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockPortfolios: Portfolio[] = [
  {
    id: '1',
    portfolioId: 'PF-001',
    organizationId: '1',
    name: 'Asia Pacific Portfolio',
    region: 'APAC',
    country: 'India',
    countryCode: 'IN',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    portfolioId: 'PF-002',
    organizationId: '1',
    name: 'Europe Portfolio',
    region: 'EMEA',
    country: 'United Kingdom',
    countryCode: 'UK',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    portfolioId: 'PF-003',
    organizationId: '2',
    name: 'Americas Portfolio',
    region: 'AMERICAS',
    country: 'United States',
    countryCode: 'US',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockCampuses: Campus[] = [
  {
    id: '1',
    campusId: 'IN-001',
    portfolioId: '1',
    name: 'Bangalore Tech Campus',
    city: 'Bangalore',
    address: 'Electronic City, Bangalore, Karnataka 560100',
    gpsCoordinates: '12.8456, 77.6632',
    type: 'traditional_office',
    status: 'active',
    totalParkingSlots2W: 200,
    totalParkingSlots4W: 150,
    totalParkingEVSlots: 20,
    amenities: ['cafeteria', 'gym', 'medical_room', 'recreation_area'],
    greenInfrastructure: {
      hasSolar: true,
      hasRainwaterHarvesting: true,
      hasSTP: true,
      greenAreaPercentage: 25,
    },
    bcpDrSpaceAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    campusId: 'UK-001',
    portfolioId: '2',
    name: 'London Financial District',
    city: 'London',
    address: 'Canary Wharf, London E14 5AB',
    gpsCoordinates: '51.5074, -0.1278',
    type: 'traditional_office',
    status: 'active',
    totalParkingSlots2W: 50,
    totalParkingSlots4W: 100,
    totalParkingEVSlots: 30,
    amenities: ['cafeteria', 'conference_center', 'business_lounge'],
    greenInfrastructure: {
      hasSolar: false,
      hasRainwaterHarvesting: false,
      hasSTP: false,
      greenAreaPercentage: 15,
    },
    bcpDrSpaceAvailable: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockBuildings: Building[] = [
  {
    id: '1',
    buildingId: 'IN-001-PIN',
    campusId: '1',
    buildingName: 'Pinnacle Tower',
    buildingCode: 'PIN',
    aliasName: 'Main Building',
    totalAreaBUA: 150000,
    totalAreaRA: 135000,
    totalAreaCarpet: 120000,
    numberOfFloors: 12,
    ownershipType: 'leased',
    leaseDetails: {
      startDate: '2023-01-01',
      endDate: '2028-12-31',
      monthlyRent: 500000,
      camCharges: 50000,
      securityDeposit: 2500000,
      currency: 'INR',
    },
    status: 'active',
    parkingAllocation2W: 120,
    parkingAllocation4W: 80,
    parkingAllocationEV: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    buildingId: 'IN-001-PV',
    campusId: '1',
    buildingName: 'Pine Valley',
    buildingCode: 'PV',
    totalAreaBUA: 80000,
    totalAreaRA: 72000,
    totalAreaCarpet: 65000,
    numberOfFloors: 8,
    ownershipType: 'owned',
    status: 'active',
    parkingAllocation2W: 80,
    parkingAllocation4W: 70,
    parkingAllocationEV: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockFloors: Floor[] = [
  {
    id: '1',
    floorId: 'IN-001-PIN-01',
    buildingId: '1',
    floorNumber: '1',
    floorArea: 12000,
    seatCounts: {
      fixedDesk: 80,
      hotDesk: 20,
      cafeSeat: 30,
      meetingRoomSeat: 24,
    },
    totalSeats: 154,
    parkingAllocation2W: 10,
    parkingAllocation4W: 8,
    amenities: ['meeting_rooms', 'break_area', 'printer_station'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    floorId: 'IN-001-PIN-02',
    buildingId: '1',
    floorNumber: '2',
    floorArea: 12000,
    seatCounts: {
      fixedDesk: 90,
      hotDesk: 15,
      cafeSeat: 20,
      meetingRoomSeat: 16,
    },
    totalSeats: 141,
    parkingAllocation2W: 10,
    parkingAllocation4W: 8,
    amenities: ['meeting_rooms', 'collaboration_zone'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockSeatZones: SeatZone[] = [
  {
    id: '1',
    seatZoneId: 'IN-001-PIN-01-001',
    floorId: '1',
    type: 'permanent_desk',
    occupancyStatus: 'assigned',
    assignedTo: 'John Doe',
    assignedEmail: 'john.doe@company.com',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    seatZoneId: 'IN-001-PIN-01-002',
    floorId: '1',
    type: 'hot_desk',
    occupancyStatus: 'free',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [seatZones, setSeatZones] = useState<SeatZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchOrganizations(),
        fetchPortfolios(),
        fetchCampuses(),
        fetchBuildings(),
        fetchFloors(),
        fetchSeatZones(),
      ]);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching organizations:', error);
      return;
    }

    if (data) {
      const mapped = data.map(org => ({
        id: org.id,
        organizationId: org.organizationid,
        name: org.name,
        description: org.description,
        headquarters: org.headquarters,
        website: org.website,
        createdAt: org.created_at,
        updatedAt: org.updated_at,
      }));
      setOrganizations(mapped);
    }
  };

  const fetchPortfolios = async () => {
    const { data, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        organizations!inner (
          id,
          organizationid,
          name,
          countries (
            name,
            code,
            region
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching portfolios:', error);
      return;
    }

    if (data) {
      const mapped = data.map((p: any) => ({
        id: p.id,
        portfolioId: p.portfolioid,
        organizationId: p.organizationid,
        name: p.name,
        region: p.organizations?.countries?.region || 'Unknown',
        country: p.organizations?.countries?.name || 'Unknown',
        countryCode: p.organizations?.countries?.code || 'XX',
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));
      setPortfolios(mapped);
    }
  };

  const fetchCampuses = async () => {
    const { data, error } = await supabase
      .from('campuses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campuses:', error);
      return;
    }

    if (data) {
      const mapped = data.map(c => ({
        id: c.id,
        campusId: c.campusid,
        portfolioId: c.portfolioid,
        name: c.name,
        city: c.city,
        address: c.address,
        gpsCoordinates: c.gps_coordinates,
        type: c.type || 'traditional_office',
        status: c.status || 'active',
        totalParkingSlots2W: c.total_parking_slots_2w,
        totalParkingSlots4W: c.total_parking_slots_4w,
        totalParkingEVSlots: c.total_parking_ev_slots,
        amenities: c.amenities || [],
        greenInfrastructure: c.green_infrastructure || {
          hasSolar: false,
          hasRainwaterHarvesting: false,
          hasSTP: false,
        },
        bcpDrSpaceAvailable: c.bcp_dr_space_available || false,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      }));
      setCampuses(mapped);
    }
  };

  const fetchBuildings = async () => {
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching buildings:', error);
      return;
    }

    if (data) {
      const mapped = data.map(b => ({
        id: b.id,
        buildingId: b.buildingid,
        campusId: b.campusid,
        buildingName: b.building_name,
        buildingCode: b.building_code,
        aliasName: b.alias_name,
        totalAreaBUA: b.total_area_bua,
        totalAreaRA: b.total_area_ra,
        totalAreaCarpet: b.total_area_carpet,
        numberOfFloors: b.number_of_floors,
        ownershipType: b.ownership_type || 'leased',
        leaseDetails: b.lease_details,
        status: b.status || 'active',
        parkingAllocation2W: b.parking_allocation_2w,
        parkingAllocation4W: b.parking_allocation_4w,
        parkingAllocationEV: b.parking_allocation_ev,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      }));
      setBuildings(mapped);
    }
  };

  const fetchFloors = async () => {
    const { data, error } = await supabase
      .from('floors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching floors:', error);
      return;
    }

    if (data) {
      const mapped = data.map(f => ({
        id: f.id,
        floorId: f.floorid,
        buildingId: f.buildingid,
        floorNumber: f.floor_number,
        floorArea: f.floor_area,
        seatCounts: f.seat_counts || {
          fixedDesk: 0,
          hotDesk: 0,
          cafeSeat: 0,
          meetingRoomSeat: 0,
        },
        totalSeats: f.total_seats || 0,
        parkingAllocation2W: f.parking_allocation_2w,
        parkingAllocation4W: f.parking_allocation_4w,
        parkingAllocationEV: f.parking_allocation_ev,
        amenities: f.amenities || [],
        createdAt: f.created_at,
        updatedAt: f.updated_at,
      }));
      setFloors(mapped);
    }
  };

  const fetchSeatZones = async () => {
    const { data, error } = await supabase
      .from('seat_zones')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching seat zones:', error);
      return;
    }

    if (data) {
      const mapped = data.map(s => ({
        id: s.id,
        seatZoneId: s.seat_zone_id,
        floorId: s.floorid,
        type: s.type || 'permanent_desk',
        occupancyStatus: s.occupancy_status || 'free',
        assignedTo: s.assigned_to,
        assignedEmail: s.assigned_email,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      }));
      setSeatZones(mapped);
    }
  };

  // Organization operations
  const createOrganization = async (organizationData: Omit<Organization, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>) => {
    const newOrgId = generateOrganizationId();

    const { error } = await supabase
      .from('organizations')
      .insert({
        organizationid: newOrgId,
        name: organizationData.name,
        description: organizationData.description,
        headquarters: organizationData.headquarters,
        website: organizationData.website,
      });

    if (error) {
      console.error('Error creating organization:', error);
      return;
    }

    await fetchOrganizations();
  };

  const updateOrganization = async (id: string, updates: Partial<Organization>) => {
    const { error } = await supabase
      .from('organizations')
      .update({
        name: updates.name,
        description: updates.description,
        headquarters: updates.headquarters,
        website: updates.website,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating organization:', error);
      return;
    }

    await fetchOrganizations();
  };

  const deleteOrganization = async (id: string) => {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting organization:', error);
      return;
    }

    await fetchOrganizations();
    await fetchPortfolios();
  };

  // Portfolio operations
  const createPortfolio = async (portfolioData: Omit<Portfolio, 'id' | 'portfolioId' | 'createdAt' | 'updatedAt'>) => {
    const newPortfolioId = generatePortfolioId();

    const { error } = await supabase
      .from('portfolios')
      .insert({
        portfolioid: newPortfolioId,
        organizationid: portfolioData.organizationId,
        name: portfolioData.name,
      });

    if (error) {
      console.error('Error creating portfolio:', error);
      return;
    }

    await fetchPortfolios();
  };

  const updatePortfolio = async (id: string, updates: Partial<Portfolio>) => {
    const { error } = await supabase
      .from('portfolios')
      .update({
        name: updates.name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating portfolio:', error);
      return;
    }

    await fetchPortfolios();
  };

  const deletePortfolio = async (id: string) => {
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting portfolio:', error);
      return;
    }

    await fetchPortfolios();
    await fetchCampuses();
  };

  // Campus operations
  const createCampus = async (campusData: Omit<Campus, 'id' | 'campusId' | 'createdAt' | 'updatedAt'>) => {
    const portfolio = portfolios.find(p => p.id === campusData.portfolioId);
    if (!portfolio) return;

    const newCampusId = generateCampusId(portfolio.countryCode);

    const { error } = await supabase
      .from('campuses')
      .insert({
        campusid: newCampusId,
        portfolioid: campusData.portfolioId,
        name: campusData.name,
        city: campusData.city,
        address: campusData.address,
        gps_coordinates: campusData.gpsCoordinates,
        type: campusData.type,
        status: campusData.status,
        total_parking_slots_2w: campusData.totalParkingSlots2W,
        total_parking_slots_4w: campusData.totalParkingSlots4W,
        total_parking_ev_slots: campusData.totalParkingEVSlots,
        amenities: campusData.amenities,
        green_infrastructure: campusData.greenInfrastructure,
        bcp_dr_space_available: campusData.bcpDrSpaceAvailable,
      });

    if (error) {
      console.error('Error creating campus:', error);
      return;
    }

    await fetchCampuses();
  };

  const updateCampus = async (id: string, updates: Partial<Campus>) => {
    const { error } = await supabase
      .from('campuses')
      .update({
        name: updates.name,
        city: updates.city,
        address: updates.address,
        type: updates.type,
        status: updates.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating campus:', error);
      return;
    }

    await fetchCampuses();
  };

  const deleteCampus = async (id: string) => {
    const { error } = await supabase
      .from('campuses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting campus:', error);
      return;
    }

    await fetchCampuses();
    await fetchBuildings();
  };

  // Building operations
  const createBuilding = async (buildingData: Omit<Building, 'id' | 'buildingId' | 'createdAt' | 'updatedAt'>) => {
    const campus = campuses.find(c => c.id === buildingData.campusId);
    if (!campus) return;

    const newBuildingId = generateBuildingId(campus.campusId, buildingData.buildingCode);

    const { error } = await supabase
      .from('buildings')
      .insert({
        buildingid: newBuildingId,
        campusid: buildingData.campusId,
        building_name: buildingData.buildingName,
        building_code: buildingData.buildingCode,
        alias_name: buildingData.aliasName,
        total_area_bua: buildingData.totalAreaBUA,
        total_area_ra: buildingData.totalAreaRA,
        total_area_carpet: buildingData.totalAreaCarpet,
        number_of_floors: buildingData.numberOfFloors,
        ownership_type: buildingData.ownershipType,
        lease_details: buildingData.leaseDetails,
        status: buildingData.status,
        parking_allocation_2w: buildingData.parkingAllocation2W,
        parking_allocation_4w: buildingData.parkingAllocation4W,
        parking_allocation_ev: buildingData.parkingAllocationEV,
      });

    if (error) {
      console.error('Error creating building:', error);
      return;
    }

    await fetchBuildings();
  };

  const updateBuilding = async (id: string, updates: Partial<Building>) => {
    const { error } = await supabase
      .from('buildings')
      .update({
        building_name: updates.buildingName,
        status: updates.status,
        ownership_type: updates.ownershipType,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating building:', error);
      return;
    }

    await fetchBuildings();
  };

  const deleteBuilding = async (id: string) => {
    const { error } = await supabase
      .from('buildings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting building:', error);
      return;
    }

    await fetchBuildings();
    await fetchFloors();
  };

  // Floor operations
  const createFloor = async (floorData: Omit<Floor, 'id' | 'floorId' | 'createdAt' | 'updatedAt' | 'totalSeats'>) => {
    const building = buildings.find(b => b.id === floorData.buildingId);
    if (!building) return;

    const totalSeats = Object.values(floorData.seatCounts).reduce((sum, count) => sum + count, 0);
    const newFloorId = generateFloorId(building.buildingId, floorData.floorNumber);

    const { error } = await supabase
      .from('floors')
      .insert({
        floorid: newFloorId,
        buildingid: floorData.buildingId,
        floor_number: floorData.floorNumber,
        floor_area: floorData.floorArea,
        seat_counts: floorData.seatCounts,
        total_seats: totalSeats,
        parking_allocation_2w: floorData.parkingAllocation2W,
        parking_allocation_4w: floorData.parkingAllocation4W,
        parking_allocation_ev: floorData.parkingAllocationEV,
        amenities: floorData.amenities,
      });

    if (error) {
      console.error('Error creating floor:', error);
      return;
    }

    await fetchFloors();
  };

  const updateFloor = async (id: string, updates: Partial<Floor>) => {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.floorNumber) updateData.floor_number = updates.floorNumber;
    if (updates.floorArea) updateData.floor_area = updates.floorArea;
    if (updates.seatCounts) {
      updateData.seat_counts = updates.seatCounts;
      updateData.total_seats = Object.values(updates.seatCounts).reduce((sum, count) => sum + count, 0);
    }

    const { error } = await supabase
      .from('floors')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating floor:', error);
      return;
    }

    await fetchFloors();
  };

  const deleteFloor = async (id: string) => {
    const { error } = await supabase
      .from('floors')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting floor:', error);
      return;
    }

    await fetchFloors();
    await fetchSeatZones();
  };

  // Seat/Zone operations
  const createSeatZone = async (seatZoneData: Omit<SeatZone, 'id' | 'seatZoneId' | 'createdAt' | 'updatedAt'>) => {
    const floor = floors.find(f => f.id === seatZoneData.floorId);
    if (!floor) return;

    const newSeatZoneId = generateSeatZoneId(floor.floorId);

    const { error } = await supabase
      .from('seat_zones')
      .insert({
        seat_zone_id: newSeatZoneId,
        floorid: seatZoneData.floorId,
        type: seatZoneData.type,
        occupancy_status: seatZoneData.occupancyStatus,
        assigned_to: seatZoneData.assignedTo,
        assigned_email: seatZoneData.assignedEmail,
      });

    if (error) {
      console.error('Error creating seat zone:', error);
      return;
    }

    await fetchSeatZones();
  };

  const updateSeatZone = async (id: string, updates: Partial<SeatZone>) => {
    const { error } = await supabase
      .from('seat_zones')
      .update({
        type: updates.type,
        occupancy_status: updates.occupancyStatus,
        assigned_to: updates.assignedTo,
        assigned_email: updates.assignedEmail,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating seat zone:', error);
      return;
    }

    await fetchSeatZones();
  };

  const deleteSeatZone = async (id: string) => {
    const { error } = await supabase
      .from('seat_zones')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting seat zone:', error);
      return;
    }

    await fetchSeatZones();
  };

  // Utility functions
  const getOrganizationHierarchy = () => {
    return organizations.map(organization => ({
      ...organization,
      portfolios: portfolios.filter(portfolio => portfolio.organizationId === organization.id).map(portfolio => ({
        ...portfolio,
        campuses: campuses.filter(campus => campus.portfolioId === portfolio.id).map(campus => ({
          ...campus,
          buildings: buildings.filter(building => building.campusId === campus.id).map(building => ({
            ...building,
            floors: floors.filter(floor => floor.buildingId === building.id).map(floor => ({
              ...floor,
              seatZones: seatZones.filter(seatZone => seatZone.floorId === floor.id),
            })),
          })),
        })),
      })),
    }));
  };

  const getPortfolioHierarchy = () => {
    return portfolios.map(portfolio => ({
      ...portfolio,
      campuses: campuses.filter(campus => campus.portfolioId === portfolio.id).map(campus => ({
        ...campus,
        buildings: buildings.filter(building => building.campusId === campus.id).map(building => ({
          ...building,
          floors: floors.filter(floor => floor.buildingId === building.id).map(floor => ({
            ...floor,
            seatZones: seatZones.filter(seatZone => seatZone.floorId === floor.id),
          })),
        })),
      })),
    }));
  };

  const getPortfoliosByOrganization = (organizationId: string) => {
    return portfolios.filter(portfolio => portfolio.organizationId === organizationId);
  };

  const getCampusesByPortfolio = (portfolioId: string) => {
    return campuses.filter(campus => campus.portfolioId === portfolioId);
  };

  const getBuildingsByCampus = (campusId: string) => {
    return buildings.filter(building => building.campusId === campusId);
  };

  const getFloorsByBuilding = (buildingId: string) => {
    return floors.filter(floor => floor.buildingId === buildingId);
  };

  const getSeatZonesByFloor = (floorId: string) => {
    return seatZones.filter(seatZone => seatZone.floorId === floorId);
  };

  const getOfficeHierarchy = (organizationId?: string) => {
    const filteredOrganizations = organizationId 
      ? organizations.filter(org => org.id === organizationId)
      : organizations;

    return filteredOrganizations.map(organization => ({
      ...organization,
      portfolios: portfolios.filter(portfolio => portfolio.organizationId === organization.id).map(portfolio => ({
        ...portfolio,
        campuses: campuses.filter(campus => campus.portfolioId === portfolio.id).map(campus => ({
          ...campus,
          buildings: buildings.filter(building => building.campusId === campus.id).map(building => ({
            ...building,
            floors: floors.filter(floor => floor.buildingId === building.id),
          })),
        })),
      })),
    }));
  };

  const findOfficeByPath = (organizationId: string, portfolioId: string, campusId: string, buildingId: string, floorId?: string) => {
    const organization = organizations.find(org => org.id === organizationId);
    const portfolio = portfolios.find(p => p.id === portfolioId && p.organizationId === organizationId);
    const campus = campuses.find(c => c.id === campusId && c.portfolioId === portfolioId);
    const building = buildings.find(b => b.id === buildingId && b.campusId === campusId);
    const floor = floorId ? floors.find(f => f.id === floorId && f.buildingId === buildingId) : null;

    return {
      organization,
      portfolio,
      campus,
      building,
      floor,
      isValid: !!(organization && portfolio && campus && building),
    };
  };

  // Bulk operations
  const bulkImportOrganizations = (data: any[]) => {
    const newOrganizations = data.map(item => ({
      ...item,
      id: Date.now().toString() + Math.random().toString(),
      organizationId: generateOrganizationId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setOrganizations(prev => [...newOrganizations, ...prev]);
  };

  const bulkImportPortfolios = (data: any[]) => {
    const newPortfolios = data.map(item => ({
      ...item,
      id: Date.now().toString() + Math.random().toString(),
      portfolioId: generatePortfolioId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setPortfolios(prev => [...newPortfolios, ...prev]);
  };

  const bulkImportCampuses = (data: any[]) => {
    const newCampuses = data.map(item => {
      const portfolio = portfolios.find(p => p.id === item.portfolioId);
      return {
        ...item,
        id: Date.now().toString() + Math.random().toString(),
        campusId: generateCampusId(portfolio?.countryCode || 'XX'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
    setCampuses(prev => [...newCampuses, ...prev]);
  };

  const bulkImportBuildings = (data: any[]) => {
    const newBuildings = data.map(item => {
      const campus = campuses.find(c => c.id === item.campusId);
      return {
        ...item,
        id: Date.now().toString() + Math.random().toString(),
        buildingId: generateBuildingId(campus?.campusId || 'XX-000', item.buildingCode),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
    setBuildings(prev => [...newBuildings, ...prev]);
  };

  const bulkImportFloors = (data: any[]) => {
    const newFloors = data.map(item => {
      const building = buildings.find(b => b.id === item.buildingId);
      const totalSeats = Object.values(item.seatCounts || {}).reduce((sum: number, count: any) => sum + (count || 0), 0);
      return {
        ...item,
        id: Date.now().toString() + Math.random().toString(),
        floorId: generateFloorId(building?.buildingId || 'XX-000-XX', item.floorNumber),
        totalSeats,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
    setFloors(prev => [...newFloors, ...prev]);
  };

  // Search and filter
  const searchEntities = (query: string, entityType?: string) => {
    const results: any[] = [];
    const searchTerm = query.toLowerCase();

    if (!entityType || entityType === 'organization') {
      const matchingOrganizations = organizations.filter(o => 
        o.name.toLowerCase().includes(searchTerm) ||
        o.organizationId.toLowerCase().includes(searchTerm) ||
        (o.headquarters && o.headquarters.toLowerCase().includes(searchTerm))
      );
      results.push(...matchingOrganizations.map(o => ({ ...o, entityType: 'organization' })));
    }

    if (!entityType || entityType === 'portfolio') {
      const matchingPortfolios = portfolios.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.portfolioId.toLowerCase().includes(searchTerm) ||
        p.region.toLowerCase().includes(searchTerm) ||
        p.country.toLowerCase().includes(searchTerm)
      );
      results.push(...matchingPortfolios.map(p => ({ ...p, entityType: 'portfolio' })));
    }

    if (!entityType || entityType === 'campus') {
      const matchingCampuses = campuses.filter(c => 
        c.name.toLowerCase().includes(searchTerm) ||
        c.campusId.toLowerCase().includes(searchTerm) ||
        c.city.toLowerCase().includes(searchTerm) ||
        c.address.toLowerCase().includes(searchTerm)
      );
      results.push(...matchingCampuses.map(c => ({ ...c, entityType: 'campus' })));
    }

    if (!entityType || entityType === 'building') {
      const matchingBuildings = buildings.filter(b => 
        b.buildingName.toLowerCase().includes(searchTerm) ||
        b.buildingId.toLowerCase().includes(searchTerm) ||
        b.buildingCode.toLowerCase().includes(searchTerm) ||
        (b.aliasName && b.aliasName.toLowerCase().includes(searchTerm))
      );
      results.push(...matchingBuildings.map(b => ({ ...b, entityType: 'building' })));
    }

    if (!entityType || entityType === 'floor') {
      const matchingFloors = floors.filter(f => 
        f.floorId.toLowerCase().includes(searchTerm) ||
        f.floorNumber.toLowerCase().includes(searchTerm)
      );
      results.push(...matchingFloors.map(f => ({ ...f, entityType: 'floor' })));
    }

    if (!entityType || entityType === 'seatzone') {
      const matchingSeatZones = seatZones.filter(s => 
        s.seatZoneId.toLowerCase().includes(searchTerm) ||
        (s.assignedTo && s.assignedTo.toLowerCase().includes(searchTerm)) ||
        (s.assignedEmail && s.assignedEmail.toLowerCase().includes(searchTerm))
      );
      results.push(...matchingSeatZones.map(s => ({ ...s, entityType: 'seatzone' })));
    }

    return results;
  };

  return (
    <PortfolioContext.Provider value={{
      organizations,
      portfolios,
      campuses,
      buildings,
      floors,
      seatZones,
      createOrganization,
      updateOrganization,
      deleteOrganization,
      createPortfolio,
      updatePortfolio,
      deletePortfolio,
      createCampus,
      updateCampus,
      deleteCampus,
      createBuilding,
      updateBuilding,
      deleteBuilding,
      createFloor,
      updateFloor,
      deleteFloor,
      createSeatZone,
      updateSeatZone,
      deleteSeatZone,
      getOrganizationHierarchy,
      getPortfolioHierarchy,
      getPortfoliosByOrganization,
      getCampusesByPortfolio,
      getBuildingsByCampus,
      getFloorsByBuilding,
      getSeatZonesByFloor,
      bulkImportOrganizations,
      bulkImportPortfolios,
      bulkImportCampuses,
      bulkImportBuildings,
      bulkImportFloors,
      searchEntities,
      getOfficeHierarchy,
      findOfficeByPath,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};