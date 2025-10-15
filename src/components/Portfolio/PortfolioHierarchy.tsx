// src/components/Portfolio/PortfolioHierarchy.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

// ---------------------- Context ----------------------
export const PortfolioContext = createContext<any>({});

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const [hierarchy, setHierarchy] = useState<any[]>([]);

  const getOrganizationHierarchy = async () => {
    const { data: orgs, error } = await supabase
      .from('organizations')
      .select(`
        id, name, organizationid, headquarters,
        portfolios (
          id, name, portfolioid, description,
          campuses (
            id, name, campusid, city, country,
            buildings (
              id, name, buildingid, totalfloors, totalareacarpet, status,
              floors (
                id, floornumber, totalseats, floorid, carpetarea,
                seat_zones (
                  id, name, seatzoneid, occupancystatus
                )
              )
            )
          )
        )
      `);

    if (error) {
      console.error('Error fetching hierarchy:', error);
      return;
    }

    const nested = (orgs || []).map(org => ({
      ...org,
      portfolios: (org.portfolios || []).map(port => ({
        ...port,
        campuses: (port.campuses || []).map(campus => ({
          ...campus,
          buildings: (campus.buildings || []).map(building => ({
            ...building,
            floors: (building.floors || []).map(floor => ({
              ...floor,
              seat_zones: floor.seat_zones || [],
            })),
          })),
        })),
      })),
    }));

    setHierarchy(nested);
    return nested;
  };

  useEffect(() => {
    getOrganizationHierarchy();
  }, []);

  return (
    <PortfolioContext.Provider value={{ hierarchy, getOrganizationHierarchy }}>
      {children}
    </PortfolioContext.Provider>
  );
};

// ---------------------- Hierarchy UI Component ----------------------
export const PortfolioHierarchy = () => {
  const { hierarchy } = usePortfolio();

  if (!hierarchy || hierarchy.length === 0) return <div>Loading hierarchy...</div>;

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      {hierarchy.map(org => (
        <div key={org.id} className="border-b pb-2">
          <div className="font-bold text-lg text-indigo-600">{org.name}</div>

          {org.portfolios?.map(port => (
            <div key={port.id} className="pl-4 mt-1">
              <div className="font-semibold text-blue-600">{port.name} (Region)</div>

              {port.campuses?.map(campus => (
                <div key={campus.id} className="pl-4 mt-1">
                  <div className="text-gray-700">{campus.name} - {campus.city}, {campus.country}</div>

                  {campus.buildings?.map(building => (
                    <div key={building.id} className="pl-4 mt-1">
                      <div className="text-gray-600">{building.name} ({building.status})</div>

                      {building.floors?.map(floor => (
                        <div key={floor.id} className="pl-4 mt-0.5 text-gray-500">
                          Floor {floor.floornumber} - Seats: {floor.totalseats}, Area: {floor.carpetarea || 0}

                          {floor.seat_zones?.length > 0 && (
                            <div className="pl-4 mt-0.5 text-gray-400">
                              {floor.seat_zones.map(zone => (
                                <div key={zone.id}>
                                  {zone.name} ({zone.occupancystatus})
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ---------------------- Default Export ----------------------
export default PortfolioHierarchy;
