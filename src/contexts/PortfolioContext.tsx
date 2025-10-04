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
      const totalSeats = Object.values(item.seatCounts || {}).reduce((sum, count) => sum + count, 0);
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

  const searchEntities = (query: string, entityType?: string) => {
    const q = query.toLowerCase();
    switch (entityType) {
      case 'organization':
        return organizations.filter(o => o.name.toLowerCase().includes(q));
      case 'portfolio':
        return portfolios.filter(p => p.name.toLowerCase().includes(q));
      case 'campus':
        return campuses.filter(c => c.name.toLowerCase().includes(q));
      case 'building':
        return buildings.filter(b => b.buildingName.toLowerCase().includes(q));
      case 'floor':
        return floors.filter(f => f.floorNumber.toLowerCase().includes(q));
      case 'seatZone':
        return seatZones.filter(s => s.type.toLowerCase().includes(q));
      default:
        return [
          ...organizations.filter(o => o.name.toLowerCase().includes(q)),
          ...portfolios.filter(p => p.name.toLowerCase().includes(q)),
          ...campuses.filter(c => c.name.toLowerCase().includes(q)),
          ...buildings.filter(b => b.buildingName.toLowerCase().includes(q)),
          ...floors.filter(f => f.floorNumber.toLowerCase().includes(q)),
          ...seatZones.filter(s => s.type.toLowerCase().includes(q)),
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
        getOfficeHierarchy,
        findOfficeByPath,
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
