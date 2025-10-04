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
  bulkImportOrganizations: (data: Organization[]) => void;
  bulkImportPortfolios: (data: Portfolio[]) => void;
  bulkImportCampuses: (data: any[]) => void;
  bulkImportBuildings: (data: any[]) => void;
  bulkImportFloors: (data: any[]) => void;
  searchEntities: (query: string, entityType?: string) => any[];
  // ...add hierarchy/get functions here if needed
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

  // Generic bulk import function
  const bulkImportEntities = (data: any[], type: 'campus' | 'building' | 'floor') => {
    const newItems = data.map(item => {
      let extra: any = {};
      if (type === 'campus') {
        const portfolio = portfolios.find(p => p.id === item.portfolioId);
        extra = { campusId: generateCampusId(portfolio?.countryCode || 'XX') };
      } else if (type === 'building') {
        const campus = campuses.find(c => c.id === item.campusId);
        extra = { buildingId: generateBuildingId(campus?.campusId || 'XX-000', item.buildingCode) };
      } else if (type === 'floor') {
        const building = buildings.find(b => b.id === item.buildingId);
        extra = {
          floorId: generateFloorId(building?.buildingId || 'XX-000-XX', item.floorNumber),
          totalSeats: Object.values(item.seatCounts || {}).reduce((sum, count) => sum + Number(count), 0)
        };
      }

      return {
        ...item,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...extra
      };
    });

    if (type === 'campus') setCampuses(prev => [...prev, ...newItems]);
    if (type === 'building') setBuildings(prev => [...prev, ...newItems]);
    if (type === 'floor') setFloors(prev => [...prev, ...newItems]);
  };

  const bulkImportCampuses = (data: any[]) => bulkImportEntities(data, 'campus');
  const bulkImportBuildings = (data: any[]) => bulkImportEntities(data, 'building');
  const bulkImportFloors = (data: any[]) => bulkImportEntities(data, 'floor');

  const searchEntities = (query: string, entityType?: string) => {
    const q = query.toLowerCase();
    const safeString = (val: any) => (val !== undefined && val !== null ? String(val).toLowerCase() : '');
    switch (entityType) {
      case 'organization':
        return organizations.filter(o => safeString(o.name).includes(q));
      case 'portfolio':
        return portfolios.filter(p => safeString(p.name).includes(q));
      case 'campus':
        return campuses.filter(c => safeString(c.name).includes(q));
      case 'building':
        return buildings.filter(b => safeString(b.buildingName).includes(q));
      case 'floor':
        return floors.filter(f => safeString(f.floorNumber).includes(q));
      case 'seatZone':
        return seatZones.filter(s => safeString(s.type).includes(q));
      default:
        return [
          ...organizations.filter(o => safeString(o.name).includes(q)),
          ...portfolios.filter(p => safeString(p.name).includes(q)),
          ...campuses.filter(c => safeString(c.name).includes(q)),
          ...buildings.filter(b => safeString(b.buildingName).includes(q)),
          ...floors.filter(f => safeString(f.floorNumber).includes(q)),
          ...seatZones.filter(s => safeString(s.type).includes(q)),
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
        bulkImportOrganizations: (data: Organization[]) => setOrganizations(prev => [...prev, ...data]),
        bulkImportPortfolios: (data: Portfolio[]) => setPortfolios(prev => [...prev, ...data]),
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
