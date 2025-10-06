// src/contexts/PortfolioContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Portfolio, Organization, Campus, Building, Floor, SeatZone } from '../types/database';

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
  fetchAllData: () => Promise<void>;
  findOfficeByPath: (
    organizationId: string,
    portfolioId: string,
    campusId: string,
    buildingId: string,
    floorId?: string
  ) => any;
}

export const PortfolioContext = createContext<PortfolioContextType>({} as PortfolioContextType);

// ✅ Named export for hook
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
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

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [orgRes, portfolioRes, campusRes, buildingRes, floorRes, seatZoneRes] = await Promise.all([
        supabase.from('organizations').select('*'),
        supabase.from('portfolios').select('*'),
        supabase.from('campuses').select('*'),
        supabase.from('buildings').select('*'),
        supabase.from('floors').select('*'),
        supabase.from('seat_zones').select('*'),
      ]);

      if (orgRes.error) throw orgRes.error;
      if (portfolioRes.error) throw portfolioRes.error;
      if (campusRes.error) throw campusRes.error;
      if (buildingRes.error) throw buildingRes.error;
      if (floorRes.error) throw floorRes.error;
      if (seatZoneRes.error) throw seatZoneRes.error;

      setOrganizations(orgRes.data || []);
      setPortfolios(portfolioRes.data || []);
      setCampuses(campusRes.data || []);
      setBuildings(buildingRes.data || []);
      setFloors(floorRes.data || []);
      setSeatZones(seatZoneRes.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Minimal findOfficeByPath for useOfficeSelection
  const findOfficeByPath = (
    organizationId: string,
    portfolioId: string,
    campusId: string,
    buildingId: string,
    floorId?: string
  ) => {
    const organization = organizations.find(o => o.id === organizationId);
    const portfolio = portfolios.find(p => p.id === portfolioId);
    const campus = campuses.find(c => c.id === campusId);
    const building = buildings.find(b => b.id === buildingId);
    const floor = floorId ? floors.find(f => f.id === floorId) : null;

    const isValid = !!organization && !!portfolio && !!campus && !!building;

    return { isValid, organization, portfolio, campus, building, floor };
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
        fetchAllData,
        findOfficeByPath,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
