import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Portfolio {
  id: string;
  portfolioId: string;
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
  portfolios: Portfolio[];
  campuses: Campus[];
  buildings: Building[];
  floors: Floor[];
  seatZones: SeatZone[];
  
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
  getPortfolioHierarchy: () => any[];
  getCampusesByPortfolio: (portfolioId: string) => Campus[];
  getBuildingsByCampus: (campusId: string) => Building[];
  getFloorsByBuilding: (buildingId: string) => Floor[];
  getSeatZonesByFloor: (floorId: string) => SeatZone[];
  
  // Bulk operations
  bulkImportPortfolios: (data: any[]) => void;
  bulkImportCampuses: (data: any[]) => void;
  bulkImportBuildings: (data: any[]) => void;
  bulkImportFloors: (data: any[]) => void;
  
  // Search and filter
  searchEntities: (query: string, entityType?: string) => any[];
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
const mockPortfolios: Portfolio[] = [
  {
    id: '1',
    portfolioId: 'PF-001',
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
    name: 'Europe Portfolio',
    region: 'EMEA',
    country: 'United Kingdom',
    countryCode: 'UK',
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
  const [portfolios, setPortfolios] = useState<Portfolio[]>(mockPortfolios);
  const [campuses, setCampuses] = useState<Campus[]>(mockCampuses);
  const [buildings, setBuildings] = useState<Building[]>(mockBuildings);
  const [floors, setFloors] = useState<Floor[]>(mockFloors);
  const [seatZones, setSeatZones] = useState<SeatZone[]>(mockSeatZones);

  // Portfolio operations
  const createPortfolio = (portfolioData: Omit<Portfolio, 'id' | 'portfolioId' | 'createdAt' | 'updatedAt'>) => {
    const newPortfolio: Portfolio = {
      ...portfolioData,
      id: Date.now().toString(),
      portfolioId: generatePortfolioId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPortfolios(prev => [newPortfolio, ...prev]);
  };

  const updatePortfolio = (id: string, updates: Partial<Portfolio>) => {
    setPortfolios(prev => prev.map(portfolio => 
      portfolio.id === id 
        ? { ...portfolio, ...updates, updatedAt: new Date().toISOString() }
        : portfolio
    ));
  };

  const deletePortfolio = (id: string) => {
    setPortfolios(prev => prev.filter(portfolio => portfolio.id !== id));
    // Also delete related campuses
    const portfolioToDelete = portfolios.find(p => p.id === id);
    if (portfolioToDelete) {
      setCampuses(prev => prev.filter(campus => campus.portfolioId !== id));
    }
  };

  // Campus operations
  const createCampus = (campusData: Omit<Campus, 'id' | 'campusId' | 'createdAt' | 'updatedAt'>) => {
    const portfolio = portfolios.find(p => p.id === campusData.portfolioId);
    if (!portfolio) return;

    const newCampus: Campus = {
      ...campusData,
      id: Date.now().toString(),
      campusId: generateCampusId(portfolio.countryCode),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCampuses(prev => [newCampus, ...prev]);
  };

  const updateCampus = (id: string, updates: Partial<Campus>) => {
    setCampuses(prev => prev.map(campus => 
      campus.id === id 
        ? { ...campus, ...updates, updatedAt: new Date().toISOString() }
        : campus
    ));
  };

  const deleteCampus = (id: string) => {
    setCampuses(prev => prev.filter(campus => campus.id !== id));
    // Also delete related buildings
    setBuildings(prev => prev.filter(building => building.campusId !== id));
  };

  // Building operations
  const createBuilding = (buildingData: Omit<Building, 'id' | 'buildingId' | 'createdAt' | 'updatedAt'>) => {
    const campus = campuses.find(c => c.id === buildingData.campusId);
    if (!campus) return;

    const newBuilding: Building = {
      ...buildingData,
      id: Date.now().toString(),
      buildingId: generateBuildingId(campus.campusId, buildingData.buildingCode),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBuildings(prev => [newBuilding, ...prev]);
  };

  const updateBuilding = (id: string, updates: Partial<Building>) => {
    setBuildings(prev => prev.map(building => 
      building.id === id 
        ? { ...building, ...updates, updatedAt: new Date().toISOString() }
        : building
    ));
  };

  const deleteBuilding = (id: string) => {
    setBuildings(prev => prev.filter(building => building.id !== id));
    // Also delete related floors
    setFloors(prev => prev.filter(floor => floor.buildingId !== id));
  };

  // Floor operations
  const createFloor = (floorData: Omit<Floor, 'id' | 'floorId' | 'createdAt' | 'updatedAt' | 'totalSeats'>) => {
    const building = buildings.find(b => b.id === floorData.buildingId);
    if (!building) return;

    const totalSeats = Object.values(floorData.seatCounts).reduce((sum, count) => sum + count, 0);

    const newFloor: Floor = {
      ...floorData,
      id: Date.now().toString(),
      floorId: generateFloorId(building.buildingId, floorData.floorNumber),
      totalSeats,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFloors(prev => [newFloor, ...prev]);
  };

  const updateFloor = (id: string, updates: Partial<Floor>) => {
    setFloors(prev => prev.map(floor => {
      if (floor.id === id) {
        const updatedFloor = { ...floor, ...updates, updatedAt: new Date().toISOString() };
        if (updates.seatCounts) {
          updatedFloor.totalSeats = Object.values(updatedFloor.seatCounts).reduce((sum, count) => sum + count, 0);
        }
        return updatedFloor;
      }
      return floor;
    }));
  };

  const deleteFloor = (id: string) => {
    setFloors(prev => prev.filter(floor => floor.id !== id));
    // Also delete related seat zones
    setSeatZones(prev => prev.filter(seatZone => seatZone.floorId !== id));
  };

  // Seat/Zone operations
  const createSeatZone = (seatZoneData: Omit<SeatZone, 'id' | 'seatZoneId' | 'createdAt' | 'updatedAt'>) => {
    const floor = floors.find(f => f.id === seatZoneData.floorId);
    if (!floor) return;

    const newSeatZone: SeatZone = {
      ...seatZoneData,
      id: Date.now().toString(),
      seatZoneId: generateSeatZoneId(floor.floorId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSeatZones(prev => [newSeatZone, ...prev]);
  };

  const updateSeatZone = (id: string, updates: Partial<SeatZone>) => {
    setSeatZones(prev => prev.map(seatZone => 
      seatZone.id === id 
        ? { ...seatZone, ...updates, updatedAt: new Date().toISOString() }
        : seatZone
    ));
  };

  const deleteSeatZone = (id: string) => {
    setSeatZones(prev => prev.filter(seatZone => seatZone.id !== id));
  };

  // Utility functions
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

  // Bulk operations
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
      portfolios,
      campuses,
      buildings,
      floors,
      seatZones,
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
      getPortfolioHierarchy,
      getCampusesByPortfolio,
      getBuildingsByCampus,
      getFloorsByBuilding,
      getSeatZonesByFloor,
      bulkImportPortfolios,
      bulkImportCampuses,
      bulkImportBuildings,
      bulkImportFloors,
      searchEntities,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};