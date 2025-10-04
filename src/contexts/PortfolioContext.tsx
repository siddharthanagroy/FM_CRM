import React, { createContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Portfolio, Organization, Campus, Building, Floor, SeatZone
} from '../types/database';
import {
  generateCampusId,
  generateBuildingId,
  generateFloorId
} from '../utils/idGenerators';

interface PortfolioContextType {
  organizations: Organization[];
  portfolios: Portfolio[];
  campuses: Campus[];
  buildings: Building[];
  floors: Floor[];
  seatZones: SeatZone[];
  createOrganization: (org: Organization) => void;
  updateOrganization: (org: Organization) => void;
  deleteOrganization: (id: string) => void;
  createPortfolio: (p: Portfolio) => void;
  updatePortfolio: (p: Portfolio) => void;
  deletePortfolio: (id: string) => void;
  createCampus: (c: Campus) => void;
  updateCampus: (c: Campus) => void;
  deleteCampus: (id: string) => void;
  createBuilding: (b: Building) => void;
  updateBuilding: (b: Building) => void;
  deleteBuilding: (id: string) => void;
  createFloor: (f: Floor) => void;
  updateFloor: (f: Floor) => void;
  deleteFloor: (id: string) => void;
  createSeatZone: (s: SeatZone) => void;
  updateSeatZone: (s: SeatZone) => void;
  deleteSeatZone: (id: string) => void;
  bulkImportOrganizations: (data: any[]) => void;
  bulkImportPortfolios: (data: any[]) => void;
  bulkImportCampuses: (data: any[]) => void;
  bulkImportBuildings: (data: any[]) => void;
  bulkImportFloors: (data: any[]) => void;
  searchEntities: (query: string, entityType?: string) => any[];
}

export const PortfolioContext = createContext<PortfolioContextType>({} as PortfolioContextType);

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

  // Bulk import for Organizations
  const bulkImportOrganizations = (data: any[]) => {
    const newOrgs = data.map(item => ({
      id: uuidv4(),
      organizationid: item.organizationid || `ORG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: item.name,
      description: item.description || null,
      headquarters: item.headquarters || null,
      website: item.website || null,
      country_code: item.country_code || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    setOrganizations(prev => [...prev, ...newOrgs]);
  };

  // Bulk import for Portfolios
  const bulkImportPortfolios = (data: any[]) => {
    const newPortfolios = data.map(item => {
      // Find the organization by either id or organizationid
      const org = organizations.find(o => 
        o.id === item.organizationid || 
        o.organizationid === item.organizationid
      );

      return {
        id: uuidv4(),
        portfolioid: item.portfolioid || `PF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        organizationid: org?.id || item.organizationid,
        name: item.name,
        description: item.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });
    setPortfolios(prev => [...prev, ...newPortfolios]);
  };

  // Bulk import for Campuses
  const bulkImportCampuses = (data: any[]) => {
    const newCampuses = data.map(item => {
      // Find the portfolio by either id or portfolioid
      const portfolio = portfolios.find(p => 
        p.id === item.portfolioid || 
        p.portfolioid === item.portfolioid
      );

      // Get country code from portfolio's organization if available
      const org = organizations.find(o => o.id === portfolio?.organizationid);
      const countryCode = item.country_code || org?.country_code || 'XX';

      return {
        id: uuidv4(),
        campusid: item.campusid || generateCampusId(countryCode),
        portfolioid: portfolio?.id || item.portfolioid,
        name: item.name,
        country: item.country,
        city: item.city,
        address: item.address || null,
        city_id: item.city_id || null,
        status: item.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });
    setCampuses(prev => [...prev, ...newCampuses]);
  };

  // Bulk import for Buildings
  const bulkImportBuildings = (data: any[]) => {
    const newBuildings = data.map(item => {
      // Find the campus by either id or campusid
      const campus = campuses.find(c => 
        c.id === item.campusid || 
        c.campusid === item.campusid
      );

      const buildingCode = item.buildingCode || item.code || 'BLD';

      return {
        id: uuidv4(),
        buildingid: item.buildingid || generateBuildingId(campus?.campusid || 'XX-000', buildingCode),
        campusid: campus?.id || item.campusid,
        name: item.name,
        totalareacarpet: item.totalareacarpet || 0,
        totalfloors: item.totalfloors || 0,
        status: item.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });
    setBuildings(prev => [...prev, ...newBuildings]);
  };

  // Bulk import for Floors
  const bulkImportFloors = (data: any[]) => {
    const newFloors = data.map(item => {
      // Find the building by either id or buildingid
      const building = buildings.find(b => 
        b.id === item.buildingid || 
        b.buildingid === item.buildingid
      );

      // Calculate total seats from seatCounts if provided
      let totalSeats = item.totalseats || 0;
      if (item.seatCounts && typeof item.seatCounts === 'object') {
        totalSeats = Object.values(item.seatCounts).reduce(
          (sum: number, count) => sum + Number(count || 0), 
          0
        );
      }

      return {
        id: uuidv4(),
        floorid: item.floorid || generateFloorId(building?.buildingid || 'XX-000-XX', item.floornumber),
        buildingid: building?.id || item.buildingid,
        floornumber: item.floornumber,
        totalseats: totalSeats,
        carpetarea: item.carpetarea || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });
    setFloors(prev => [...prev, ...newFloors]);
  };

  // Search function
  const searchEntities = (query: string, entityType?: string) => {
    const q = query.toLowerCase();
    const safeString = (val: any) => (val !== undefined && val !== null ? String(val).toLowerCase() : '');
    
    switch (entityType) {
      case 'organization':
        return organizations.filter(o => 
          safeString(o.name).includes(q) || 
          safeString(o.organizationid).includes(q)
        );
      case 'portfolio':
        return portfolios.filter(p => 
          safeString(p.name).includes(q) || 
          safeString(p.portfolioid).includes(q)
        );
      case 'campus':
        return campuses.filter(c => 
          safeString(c.name).includes(q) || 
          safeString(c.campusid).includes(q) ||
          safeString(c.city).includes(q) ||
          safeString(c.country).includes(q)
        );
      case 'building':
        return buildings.filter(b => 
          safeString(b.name).includes(q) || 
          safeString(b.buildingid).includes(q)
        );
      case 'floor':
        return floors.filter(f => 
          safeString(f.floornumber).includes(q) || 
          safeString(f.floorid).includes(q)
        );
      case 'seatZone':
        return seatZones.filter(s => 
          safeString(s.name).includes(q) || 
          safeString(s.seatzoneid).includes(q)
        );
      default:
        return [
          ...organizations.filter(o => safeString(o.name).includes(q)),
          ...portfolios.filter(p => safeString(p.name).includes(q)),
          ...campuses.filter(c => safeString(c.name).includes(q)),
          ...buildings.filter(b => safeString(b.name).includes(q)),
          ...floors.filter(f => safeString(f.floornumber).includes(q)),
          ...seatZones.filter(s => safeString(s.name).includes(q)),
        ];
    }
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
        createOrganization: org => setOrganizations(prev => [...prev, org]),
        updateOrganization: org => setOrganizations(prev => prev.map(o => (o.id === org.id ? org : o))),
        deleteOrganization: id => setOrganizations(prev => prev.filter(o => o.id !== id)),
        createPortfolio: p => setPortfolios(prev => [...prev, p]),
        updatePortfolio: p => setPortfolios(prev => prev.map(pf => (pf.id === p.id ? p : pf))),
        deletePortfolio: id => setPortfolios(prev => prev.filter(p => p.id !== id)),
        createCampus: c => setCampuses(prev => [...prev, c]),
        updateCampus: c => setCampuses(prev => prev.map(cv => (cv.id === c.id ? c : cv))),
        deleteCampus: id => setCampuses(prev => prev.filter(c => c.id !== id)),
        createBuilding: b => setBuildings(prev => [...prev, b]),
        updateBuilding: b => setBuildings(prev => prev.map(bb => (bb.id === b.id ? b : bb))),
        deleteBuilding: id => setBuildings(prev => prev.filter(b => b.id !== id)),
        createFloor: f => setFloors(prev => [...prev, f]),
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
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};