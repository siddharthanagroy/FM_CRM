import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// Entity Interfaces
export interface Organization {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Portfolio {
  id: string;
  portfolioId: string;
  organizationId: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Country {
  id: string;
  countryCode: string;
  countryName: string;
  portfolioId: string;
}

export interface City {
  id: string;
  cityName: string;
  countryId: string;
  portfolioId: string;
}

export interface Campus {
  id: string;
  campusId: string;
  cityId: string;
  name: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Building {
  id: string;
  buildingId: string;
  campusId: string;
  name: string;
  totalFloors?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Floor {
  id: string;
  floorId: string;
  buildingId: string;
  floorNumber: string;
  totalSeats?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface PortfolioContextType {
  organizations: Organization[];
  portfolios: Portfolio[];
  countries: Country[];
  cities: City[];
  campuses: Campus[];
  buildings: Building[];
  floors: Floor[];

  // CRUD functions
  createOrganization: (org: Omit<Organization, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>) => void;
  createPortfolio: (p: Omit<Portfolio, 'id' | 'portfolioId' | 'createdAt' | 'updatedAt'>) => void;
  createCountry: (c: Omit<Country, 'id'>) => void;
  createCity: (c: Omit<City, 'id'>) => void;
  createCampus: (c: Omit<Campus, 'id' | 'campusId' | 'createdAt' | 'updatedAt'>) => void;
  createBuilding: (b: Omit<Building, 'id' | 'buildingId' | 'createdAt' | 'updatedAt'>) => void;
  createFloor: (f: Omit<Floor, 'id' | 'floorId' | 'createdAt' | 'updatedAt' | 'totalSeats'>) => void;

  // Hierarchy & Search
  getFullHierarchy: () => any[];
  findByPath: (organizationId: string, portfolioId?: string, countryCode?: string, cityName?: string, campusId?: string, buildingId?: string, floorId?: string) => any;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};

// Simple ID generators
const generateId = (prefix: string) => `${prefix}-${Math.floor(Math.random() * 10000)}`;

// Provider
export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);

  // Fetch all entities
  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => {
    try {
      const orgs = await supabase.from('organizations').select('*');
      const pfs = await supabase.from('portfolios').select('*');
      const cts = await supabase.from('countries').select('*');
      const cts2 = await supabase.from('cities').select('*');
      const camps = await supabase.from('campuses').select('*');
      const builds = await supabase.from('buildings').select('*');
      const fls = await supabase.from('floors').select('*');

      if (orgs.data) setOrganizations(orgs.data.map(o => ({ id: o.id, organizationId: o.organizationid, name: o.name })));
      if (pfs.data) setPortfolios(pfs.data.map(p => ({ id: p.id, portfolioId: p.portfolioid, organizationId: p.organizationid, name: p.name })));
      if (cts.data) setCountries(cts.data.map(c => ({ id: c.id, countryCode: c.country_code, countryName: c.country_name, portfolioId: c.portfolioid })));
      if (cts2.data) setCities(cts2.data.map(c => ({ id: c.id, cityName: c.city_name, countryId: c.countryid, portfolioId: c.portfolioid })));
      if (camps.data) setCampuses(camps.data.map(c => ({ id: c.id, campusId: c.campusid, cityId: c.cityid, name: c.name })));
      if (builds.data) setBuildings(builds.data.map(b => ({ id: b.id, buildingId: b.buildingid, campusId: b.campusid, name: b.name })));
      if (fls.data) setFloors(fls.data.map(f => ({ id: f.id, floorId: f.floorid, buildingId: f.buildingid, floorNumber: f.floor_number })));
    } catch (err) { console.error(err); }
  };

  // CRUD implementations
  const createOrganization = (org: Omit<Organization, 'id' | 'organizationId'>) => {
    const newOrg: Organization = { ...org, id: generateId('ORG'), organizationId: generateId('ORG') };
    setOrganizations(prev => [...prev, newOrg]);
  };

  const createPortfolio = (p: Omit<Portfolio, 'id' | 'portfolioId'>) => {
    const newP: Portfolio = { ...p, id: generateId('PF'), portfolioId: generateId('PF') };
    setPortfolios(prev => [...prev, newP]);
  };

  const createCountry = (c: Omit<Country, 'id'>) => {
    setCountries(prev => [...prev, { ...c, id: generateId('CT') }]);
  };

  const createCity = (c: Omit<City, 'id'>) => {
    setCities(prev => [...prev, { ...c, id: generateId('CITY') }]);
  };

  const createCampus = (c: Omit<Campus, 'id' | 'campusId'>) => {
    setCampuses(prev => [...prev, { ...c, id: generateId('CMP'), campusId: generateId('CMP') }]);
  };

  const createBuilding = (b: Omit<Building, 'id' | 'buildingId'>) => {
    setBuildings(prev => [...prev, { ...b, id: generateId('BLD'), buildingId: generateId('BLD') }]);
  };

  const createFloor = (f: Omit<Floor, 'id' | 'floorId'>) => {
    setFloors(prev => [...prev, { ...f, id: generateId('FLR'), floorId: generateId('FLR') }]);
  };

  // Hierarchy helper
  const getFullHierarchy = () => {
    return organizations.map(org => ({
      ...org,
      portfolios: portfolios.filter(p => p.organizationId === org.organizationId).map(p => ({
        ...p,
        countries: countries.filter(c => c.portfolioId === p.portfolioId).map(c => ({
          ...c,
          cities: cities.filter(city => city.countryId === c.id).map(city => ({
            ...city,
            campuses: campuses.filter(camp => camp.cityId === city.id).map(camp => ({
              ...camp,
              buildings: buildings.filter(b => b.campusId === camp.campusId).map(b => ({
                ...b,
                floors: floors.filter(f => f.buildingId === b.buildingId)
              }))
            }))
          }))
        }))
      }))
    }));
  };

  const findByPath = (organizationId: string, portfolioId?: string, countryCode?: string, cityName?: string, campusId?: string, buildingId?: string, floorId?: string) => {
    let hierarchy = getFullHierarchy().find(o => o.organizationId === organizationId);
    if (!hierarchy) return null;

    if (portfolioId) hierarchy = hierarchy.portfolios.find((p: any) => p.portfolioId === portfolioId);
    if (!hierarchy) return null;

    if (countryCode) hierarchy = hierarchy.countries.find((c: any) => c.countryCode === countryCode);
    if (!hierarchy) return null;

    if (cityName) hierarchy = hierarchy.cities.find((c: any) => c.cityName === cityName);
    if (!hierarchy) return null;

    if (campusId) hierarchy = hierarchy.campuses.find((c: any) => c.campusId === campusId);
    if (!hierarchy) return null;

    if (buildingId) hierarchy = hierarchy.buildings.find((b: any) => b.buildingId === buildingId);
    if (!hierarchy) return null;

    if (floorId) hierarchy = hierarchy.floors.find((f: any) => f.floorId === floorId);
    return hierarchy;
  };

  return (
    <PortfolioContext.Provider value={{
      organizations, portfolios, countries, cities, campuses, buildings, floors,
      createOrganization, createPortfolio, createCountry, createCity, createCampus, createBuilding, createFloor,
      getFullHierarchy, findByPath
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
