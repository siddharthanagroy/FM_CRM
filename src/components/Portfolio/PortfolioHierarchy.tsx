// PortfolioContext.tsx (simplified)
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "../../lib/supabase";

export const PortfolioContext = createContext<any>({});

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const [hierarchy, setHierarchy] = useState<any[]>([]);

  const getOrganizationHierarchy = async () => {
    // Fetch organizations with portfolios
    const { data: orgs } = await supabase
      .from('organizations')
      .select(`
        id, name, organizationid, headquarters, 
        portfolios (
          id, name, portfolioid, description, 
          campuses (
            id, name, campusid, city, country, 
            buildings (
              id, buildingName: name, buildingId: buildingid, numberOfFloors: totalfloors, totalAreaCarpet: totalareacarpet, status,
              floors (
                id, floorNumber: floornumber, totalSeats: totalseats, floorId: floorid, floorArea: carpetarea
              )
            )
          )
        )
      `);

    // Supabase returns null if relation is empty, replace with empty array
    const nested = (orgs || []).map(org => ({
      ...org,
      portfolios: (org.portfolios || []).map(port => ({
        ...port,
        campuses: (port.campuses || []).map(campus => ({
          ...campus,
          buildings: (campus.buildings || []).map(building => ({
            ...building,
            floors: building.floors || [],
          })),
        })),
      })),
    }));

    setHierarchy(nested);
    return nested;
  };

  // Delete functions (simplified placeholders)
  const deleteOrganization = (id: string) => { console.log('delete org', id); };
  const deletePortfolio = (id: string) => { console.log('delete portfolio', id); };
  const deleteCampus = (id: string) => { console.log('delete campus', id); };
  const deleteBuilding = (id: string) => { console.log('delete building', id); };
  const deleteFloor = (id: string) => { console.log('delete floor', id); };

  useEffect(() => {
    getOrganizationHierarchy();
  }, []);

  return (
    <PortfolioContext.Provider value={{
      getOrganizationHierarchy,
      deleteOrganization,
      deletePortfolio,
      deleteCampus,
      deleteBuilding,
      deleteFloor,
      hierarchy
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
