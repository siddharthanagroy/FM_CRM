// src/contexts/PortfolioContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Portfolio,
  Organization,
  Campus,
  Building,
  Floor,
  SeatZone
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
  getOfficeHierarchy: () => any[];

  getOrganizationById: (id: string) => Organization | undefined;
  getPortfolioById: (id: string) => Portfolio | undefined;
  getCampusById: (id: string) => Campus | undefined;
  getBuildingById: (id: string) => Building | undefined;
  getFloorById: (id: string) => Floor | undefined;

  fetchAllData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType>({} as PortfolioContextType);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
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

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [orgsRes, portfoliosRes, campusesRes, buildingsRes, floorsRes, seatZonesRes] =
        await Promise.all([
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

  // --- CRUD Functions (same as before) ---
  const createOrganization = async (orgData: any) => {
    const { data, error } = await supabase.from('organizations').insert([orgData]).select();
    if (error) throw error;
    if (data) setOrganizations(prev => [...prev, ...data]);
  };
  const updateOrganization = (org: Organization) => setOrganizations(prev => prev.map(o => (o.id === org.id ? org : o)));
  const deleteOrganization = (id: string) => setOrganizations(prev => prev.filter(o => o.id !== id));

  const createPortfolio = async (p: any) => {
    const { data, error } = await supabase.from('portfolios').insert([p]).select();
    if (error) throw error;
    if (data) setPortfolios(prev => [...prev, ...data]);
  };
  const updatePortfolio = (p: Portfolio) => setPortfolios(prev => prev.map(pf => (pf.id === p.id ? p : pf)));
  const deletePortfolio = (id: string) => setPortfolios(prev => prev.filter(p => p.id !== id));

  const createCampus = async (c: any) => {
    const { data, error } = await supabase.from('campuses').insert([c]).select();
    if (error) throw error;
    if (data) setCampuses(prev => [...prev, ...data]);
  };
  const updateCampus = (c: Campus) => setCampuses(prev => prev.map(cv => (cv.id === c.id ? c : cv)));
  const deleteCampus = (id: string) => setCampuses(prev => prev.filter(c => c.id !== id));

  const createBuilding = async (b: any) => {
    const { data, error } = await supabase.from('buildings').insert([b]).select();
    if (error) throw error;
    if (data) setBuildings(prev => [...prev, ...data]);
  };
  const updateBuilding = (b: Building) => setBuildings(prev => prev.map(bb => (bb.id === b.id ? b : bb)));
  const deleteBuilding = (id: string) => setBuildings(prev => prev.filter(b => b.id !== id));

  const createFloor = async (f: any) => {
    const { data, error } = await supabase.from('floors').insert([f]).select();
    if (error) throw error;
    if (data) setFloors(prev => [...prev, ...data]);
  };
  const updateFloor = (f: Floor) => setFloors(prev => prev.map(ff => (ff.id === f.id ? f : ff)));
  const deleteFloor = (id: string) => setFloors(prev => prev.filter(f => f.id !== id));

  const createSeatZone = (s: SeatZone) => setSeatZones(prev => [...prev, s]);
  const updateSeatZone = (s: SeatZone) => setSeatZones(prev => prev.map(ss => (ss.id === s.id ? s : ss)));
  const deleteSeatZone = (id: string) => setSeatZones(prev => prev.filter(s => s.id !== id));

  // --- Bulk imports and search ---
  const bulkImportOrganizations = async (data: any[]) => { const { data: inserted, error } = await supabase.from('organizations').insert(data).select(); if (error) throw error; if (inserted) setOrganizations(prev => [...prev, ...inserted]); };
  const bulkImportPortfolios = async (data: any[]) => { const { data: inserted, error } = await supabase.from('portfolios').insert(data).select(); if (error) throw error; if (inserted) setPortfolios(prev => [...prev, ...inserted]); };
  const bulkImportCampuses = async (data: any[]) => { const { data: inserted, error } = await supabase.from('campuses').insert(data).select(); if (error) throw error; if (inserted) setCampuses(prev => [...prev, ...inserted]); };
  const bulkImportBuildings = async (data: any[]) => { const { data: inserted, error } = await supabase.from('buildings').insert(data).select(); if (error) throw error; if (inserted) setBuildings(prev => [...prev, ...inserted]); };
  const bulkImportFloors = async (data: any[]) => { const { data: inserted, error } = await supabase.from('floors').insert(data).select(); if (error) throw error; if (inserted) setFloors(prev => [...prev, ...inserted]); };

  const searchEntities = (query: string, entityType?: string) => {
    const q = query.toLowerCase();
    const safe = (val: any) => (val != null ? String(val).toLowerCase() : '');
    const results: any[] = [];
    if (!entityType || entityType === 'all' || entityType === 'organization')
      organizations.filter(o => safe(o.name).includes(q)).forEach(o => results.push({ ...o, entityType: 'organization' }));
    if (!entityType || entityType === 'all' || entityType === 'portfolio')
      portfolios.filter(p => safe(p.name).includes(q)).forEach(p => results.push({ ...p, entityType: 'portfolio' }));
    if (!entityType || entityType === 'all' || entityType === 'campus')
      campuses.filter(c => safe(c.name).includes(q)).forEach(c => results.push({ ...c, entityType: 'campus' }));
    if (!entityType || entityType === 'all' || entityType === 'building')
      buildings.filter(b => safe(b.name).includes(q)).forEach(b => results.push({ ...b, entityType: 'building' }));
    if (!entityType || entityType === 'all' || entityType === 'floor')
      floors.filter(f => safe(String(f.floornumber)).includes(q)).forEach(f => results.push({ ...f, entityType: 'floor' }));
    return results;
  };

  // --- Hierarchy with Country + City ---
  const getOrganizationHierarchy = () => {
    return organizations.map(org => ({
      ...org,
      portfolios: portfolios
        .filter(p => p.organizationid === org.id)
        .map(portfolio => ({
          ...portfolio,
          campuses: campuses
            .filter(c => c.portfolioid === portfolio.id)
            .map(campus => ({
              ...campus,
              country: campus.country,
              city: campus.city,
              buildings: buildings
                .filter(b => b.campusid === campus.id)
                .map(building => ({
                  ...building,
                  floors: floors.filter(f => f.buildingid === building.id)
                }))
            }))
        }))
    }));
  };

  const getOfficeHierarchy = () => getOrganizationHierarchy(); // Alias for Header.tsx

  // --- Get by ID ---
  const getOrganizationById = (id: string) => organizations.find(o => o.id === id);
  const getPortfolioById = (id: string) => portfolios.find(p => p.id === id);
  const getCampusById = (id: string) => campuses.find(c => c.id === id);
  const getBuildingById = (id: string) => buildings.find(b => b.id === id);
  const getFloorById = (id: string) => floors.find(f => f.id === id);

  return (
    <PortfolioContext.Provider
      value={{
        organizations, portfolios, campuses, buildings, floors, seatZones,
        loading, error,
        setOrganizations, setPortfolios, setCampuses, setBuildings, setFloors, setSeatZones,
        createOrganization, updateOrganization, deleteOrganization,
        createPortfolio, updatePortfolio, deletePortfolio,
        createCampus, updateCampus, deleteCampus,
        createBuilding, updateBuilding, deleteBuilding,
        createFloor, updateFloor, deleteFloor,
        createSeatZone, updateSeatZone, deleteSeatZone,
        bulkImportOrganizations, bulkImportPortfolios, bulkImportCampuses, bulkImportBuildings, bulkImportFloors,
        searchEntities,
        getOrganizationHierarchy,
        getOfficeHierarchy,
        getOrganizationById, getPortfolioById, getCampusById, getBuildingById, getFloorById,
        fetchAllData
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
