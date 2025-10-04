import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  Portfolio, Organization, Campus, Building, Floor, SeatZone
} from '../types/database';

interface PortfolioContextType {
  organizations: Organization[];
  portfolios: Portfolio[];
  campuses: Campus[];
  buildings: Building[];
  floors: Floor[];
  seatZones: SeatZone[];
  loading: boolean;
  error: string | null;
  setOrganizations: (orgs: Organization[]) => void;
  setPortfolios: (portfolios: Portfolio[]) => void;
  setCampuses: (campuses: Campus[]) => void;
  setBuildings: (buildings: Building[]) => void;
  setFloors: (floors: Floor[]) => void;
  setSeatZones: (seatZones: SeatZone[]) => void;
  createOrganization: (org: any) => Promise<void>;
  updateOrganization: (org: Organization) => void;
  deleteOrganization: (id: string) => void;
  createPortfolio: (p: any) => Promise<void>;
  updatePortfolio: (p: Portfolio) => void;
  deletePortfolio: (id: string) => void;
  createCampus: (c: any) => Promise<void>;
  updateCampus: (c: Campus) => void;
  deleteCampus: (id: string) => void;
  createBuilding: (b: any) => Promise<void>;
  updateBuilding: (b: Building) => void;
  deleteBuilding: (id: string) => void;
  createFloor: (f: any) => Promise<void>;
  updateFloor: (f: Floor) => void;
  deleteFloor: (id: string) => void;
  createSeatZone: (s: SeatZone) => void;
  updateSeatZone: (s: SeatZone) => void;
  deleteSeatZone: (id: string) => void;
  bulkImportOrganizations: (data: any[]) => Promise<void>;
  bulkImportPortfolios: (data: any[]) => Promise<void>;
  bulkImportCampuses: (data: any[]) => Promise<void>;
  bulkImportBuildings: (data: any[]) => Promise<void>;
  bulkImportFloors: (data: any[]) => Promise<void>;
  searchEntities: (query: string, entityType?: string) => any[];
  getOrganizationHierarchy: () => any[];
  getOrganizationById: (id: string) => Organization | undefined;
  getPortfolioById: (id: string) => Portfolio | undefined;
  getCampusById: (id: string) => Campus | undefined;
  getBuildingById: (id: string) => Building | undefined;
  getFloorById: (id: string) => Floor | undefined;
  fetchAllData: () => Promise<void>;
}

export const PortfolioContext = createContext<PortfolioContextType>({} as PortfolioContextType);

// Custom hook to use the context
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const PortfolioProvider = ({ children }: Props) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [seatZones, setSeatZones] = useState<SeatZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [orgsRes, portfoliosRes, campusesRes, buildingsRes, floorsRes, seatZonesRes] = await Promise.all([
        supabase.from('organizations').select('*'),
        supabase.from('portfolios').select('*'),
        supabase.from('campuses').select('*'),
        supabase.from('buildings').select('*'),
        supabase.from('floors').select('*'),
        supabase.from('seat_zones').select('*')
      ]);

      if (orgsRes.error) throw orgsRes.error;
      if (portfoliosRes.error) throw portfoliosRes.error;
      if (campusesRes.error) throw campusesRes.error;
      if (buildingsRes.error) throw buildingsRes.error;
      if (floorsRes.error) throw floorsRes.error;
      if (seatZonesRes.error) throw seatZonesRes.error;

      setOrganizations(orgsRes.data || []);
      setPortfolios(portfoliosRes.data || []);
      setCampuses(campusesRes.data || []);
      setBuildings(buildingsRes.data || []);
      setFloors(floorsRes.data || []);
      setSeatZones(seatZonesRes.data || []);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Create functions with Supabase integration
  const createOrganization = async (orgData: any) => {
    // Transform camelCase to snake_case for database
    const dbData = {
      name: orgData.name,
      description: orgData.description,
      headquarters: orgData.headquarters,
      website: orgData.website,
      country_code: orgData.countryCode || null
    };
    
    const { data, error } = await supabase
      .from('organizations')
      .insert([dbData])
      .select();
    
    if (error) throw error;
    if (data) setOrganizations(prev => [...prev, ...data]);
  };

  const createPortfolio = async (portfolioData: any) => {
    // Transform camelCase to snake_case for database
    const dbData = {
      organizationid: portfolioData.organizationId,
      name: portfolioData.name,
      description: portfolioData.description || null
    };
    
    const { data, error } = await supabase
      .from('portfolios')
      .insert([dbData])
      .select();
    
    if (error) throw error;
    if (data) setPortfolios(prev => [...prev, ...data]);
  };

  const createCampus = async (campusData: any) => {
    // Transform camelCase to snake_case for database
    const dbData = {
      portfolioid: campusData.portfolioId,
      name: campusData.name,
      country: campusData.country,
      city: campusData.city,
      address: campusData.address,
      status: campusData.status || 'active'
    };
    
    const { data, error } = await supabase
      .from('campuses')
      .insert([dbData])
      .select();
    
    if (error) throw error;
    if (data) setCampuses(prev => [...prev, ...data]);
  };

  const createBuilding = async (buildingData: any) => {
    // Transform camelCase to snake_case for database
    const dbData = {
      campusid: buildingData.campusId,
      name: buildingData.buildingName,
      totalareacarpet: buildingData.totalAreaCarpet || 0,
      totalfloors: buildingData.numberOfFloors || 0,
      status: buildingData.status || 'active'
    };
    
    const { data, error } = await supabase
      .from('buildings')
      .insert([dbData])
      .select();
    
    if (error) throw error;
    if (data) setBuildings(prev => [...prev, ...data]);
  };

  const createFloor = async (floorData: any) => {
    // Calculate total seats from seatCounts
    const totalSeats = floorData.seatCounts ? 
      Object.values(floorData.seatCounts).reduce((sum: number, val) => sum + (Number(val) || 0), 0) : 0;
    
    // Transform camelCase to snake_case for database
    const dbData = {
      buildingid: floorData.buildingId,
      floornumber: floorData.floorNumber,
      totalseats: totalSeats,
      carpetarea: floorData.floorArea || null
    };
    
    const { data, error } = await supabase
      .from('floors')
      .insert([dbData])
      .select();
    
    if (error) throw error;
    if (data) setFloors(prev => [...prev, ...data]);
  };

  // Bulk import functions
  const bulkImportOrganizations = async (data: any[]) => {
    const { data: inserted, error } = await supabase
      .from('organizations')
      .insert(data)
      .select();
    
    if (error) throw error;
    if (inserted) setOrganizations(prev => [...prev, ...inserted]);
  };

  const bulkImportPortfolios = async (data: any[]) => {
    const { data: inserted, error } = await supabase
      .from('portfolios')
      .insert(data)
      .select();
    
    if (error) throw error;
    if (inserted) setPortfolios(prev => [...prev, ...inserted]);
  };

  const bulkImportCampuses = async (data: any[]) => {
    const { data: inserted, error } = await supabase
      .from('campuses')
      .insert(data)
      .select();
    
    if (error) throw error;
    if (inserted) setCampuses(prev => [...prev, ...inserted]);
  };

  const bulkImportBuildings = async (data: any[]) => {
    const { data: inserted, error } = await supabase
      .from('buildings')
      .insert(data)
      .select();
    
    if (error) throw error;
    if (inserted) setBuildings(prev => [...prev, ...inserted]);
  };

  const bulkImportFloors = async (data: any[]) => {
    const { data: inserted, error } = await supabase
      .from('floors')
      .insert(data)
      .select();
    
    if (error) throw error;
    if (inserted) setFloors(prev => [...prev, ...inserted]);
  };

  // Helper functions
  const getOrganizationById = (id: string) => organizations.find(o => o.id === id);
  const getPortfolioById = (id: string) => portfolios.find(p => p.id === id);
  const getCampusById = (id: string) => campuses.find(c => c.id === id);
  const getBuildingById = (id: string) => buildings.find(b => b.id === id);
  const getFloorById = (id: string) => floors.find(f => f.id === id);

  // Build hierarchy
  const getOrganizationHierarchy = () => {
    return organizations.map(org => {
      const orgPortfolios = portfolios.filter(p => p.organizationid === org.id);
      
      return {
        ...org,
        portfolios: orgPortfolios.map(portfolio => {
          const portfolioCampuses = campuses.filter(c => c.portfolioid === portfolio.id);
          
          return {
            ...portfolio,
            campuses: portfolioCampuses.map(campus => {
              const campusBuildings = buildings.filter(b => b.campusid === campus.id);
              
              return {
                ...campus,
                buildings: campusBuildings.map(building => {
                  const buildingFloors = floors.filter(f => f.buildingid === building.id);
                  
                  return {
                    ...building,
                    // Map database fields to component expected fields
                    buildingName: building.name,
                    buildingId: building.buildingid,
                    totalAreaCarpet: building.totalareacarpet,
                    numberOfFloors: building.totalfloors,
                    ownershipType: 'leased', // Default since not in schema
                    floors: buildingFloors.map(floor => ({
                      ...floor,
                      floorId: floor.floorid,
                      floorNumber: floor.floornumber,
                      totalSeats: floor.totalseats,
                      floorArea: floor.carpetarea || 0,
                      seatCounts: {
                        fixedDesk: 0,
                        hotDesk: 0,
                        cafeSeat: 0,
                        meetingRoomSeat: floor.totalseats
                      }
                    }))
                  };
                })
              };
            })
          };
        })
      };
    });
  };

  // Search function
  const searchEntities = (query: string, entityType?: string) => {
    const q = query.toLowerCase();
    const safeString = (val: any) => (val !== undefined && val !== null ? String(val).toLowerCase() : '');
    
    const results: any[] = [];
    
    if (!entityType || entityType === 'all' || entityType === 'organization') {
      organizations.filter(o => 
        safeString(o.name).includes(q) || 
        safeString(o.organizationid).includes(q)
      ).forEach(o => results.push({ ...o, entityType: 'organization' }));
    }
    
    if (!entityType || entityType === 'all' || entityType === 'portfolio') {
      portfolios.filter(p => 
        safeString(p.name).includes(q) || 
        safeString(p.portfolioid).includes(q)
      ).forEach(p => results.push({ ...p, entityType: 'portfolio' }));
    }
    
    if (!entityType || entityType === 'all' || entityType === 'campus') {
      campuses.filter(c => 
        safeString(c.name).includes(q) || 
        safeString(c.campusid).includes(q) ||
        safeString(c.city).includes(q) ||
        safeString(c.country).includes(q)
      ).forEach(c => results.push({ ...c, entityType: 'campus' }));
    }
    
    if (!entityType || entityType === 'all' || entityType === 'building') {
      buildings.filter(b => 
        safeString(b.name).includes(q) || 
        safeString(b.buildingid).includes(q)
      ).forEach(b => results.push({ ...b, buildingName: b.name, entityType: 'building' }));
    }
    
    if (!entityType || entityType === 'all' || entityType === 'floor') {
      floors.filter(f => 
        safeString(f.floornumber).includes(q) || 
        safeString(f.floorid).includes(q)
      ).forEach(f => results.push({ ...f, entityType: 'floor' }));
    }
    
    return results;
  };

  return (
    <PortfolioContext.Provider
      value={{
        organizations,
        portfolios,
        campuses,
        buildings,
        floors,
        seatZones,
        loading,
        error,
        setOrganizations,
        setPortfolios,
        setCampuses,
        setBuildings,
        setFloors,
        setSeatZones,
        createOrganization,
        updateOrganization: org => setOrganizations(prev => prev.map(o => (o.id === org.id ? org : o))),
        deleteOrganization: id => setOrganizations(prev => prev.filter(o => o.id !== id)),
        createPortfolio,
        updatePortfolio: p => setPortfolios(prev => prev.map(pf => (pf.id === p.id ? p : pf))),
        deletePortfolio: id => setPortfolios(prev => prev.filter(p => p.id !== id)),
        createCampus,
        updateCampus: c => setCampuses(prev => prev.map(cv => (cv.id === c.id ? c : cv))),
        deleteCampus: id => setCampuses(prev => prev.filter(c => c.id !== id)),
        createBuilding,
        updateBuilding: b => setBuildings(prev => prev.map(bb => (bb.id === b.id ? b : bb))),
        deleteBuilding: id => setBuildings(prev => prev.filter(b => b.id !== id)),
        createFloor,
        updateFloor: f => setFloors(prev => prev.map(ff => (ff.id === f.id ? f : ff))),
        deleteFloor: id => setFloors(prev => prev.filter(f => f.id !== id)),
        createSeatZone: s => setSeatZones(prev => [...prev, s]),
        updateSeatZone: s => setSeatZones(prev => prev.map(ss => (ss.id === s.id ? s : ss))),
        deleteSeatZone: id => setSeatZones(prev => prev.filter(s => s.id !== id)),
        bulkImportOrganizations,
        bulkImportPortfolios,
        bulkImportCampuses,
        bulkImportBuildings,
        bulkImportFloors,
        searchEntities,
        getOrganizationHierarchy,
        getOrganizationById,
        getPortfolioById,
        getCampusById,
        getBuildingById,
        getFloorById,
        fetchAllData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};