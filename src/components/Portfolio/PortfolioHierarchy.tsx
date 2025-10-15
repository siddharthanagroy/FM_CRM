import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const PortfolioContext = createContext<any>({});
export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const [hierarchy, setHierarchy] = useState<any[]>([]);

  const getOrganizationHierarchy = async () => {
    const { data: orgs, error } = await supabase
      .from('organizations')
      .select(`
        id, name, organizationid,
        portfolios (
          id, name, portfolioid,
          campuses (
            id, name, campusid, country, city,
            buildings (
              id, name, buildingid,
              floors (
                id, floornumber, floorid,
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
        // Group campuses by country → city
        countries: Object.values(
          (port.campuses || []).reduce((acc: any, campus: any) => {
            if (!acc[campus.country]) acc[campus.country] = { name: campus.country, cities: {} };
            if (!acc[campus.country].cities[campus.city]) acc[campus.country].cities[campus.city] = { name: campus.city, campuses: [] };
            acc[campus.country].cities[campus.city].campuses.push(campus);
            return acc;
          }, {})
        )
      })),
    }));

    setHierarchy(nested);
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

// ---------------------- Hierarchy Tree Component ----------------------
export const PortfolioHierarchy = () => {
  const { hierarchy } = usePortfolio();
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [selected, setSelected] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  if (!hierarchy || hierarchy.length === 0) return <div>Loading hierarchy...</div>;

  const renderSeatZones = (zones: any[]) => zones.map(zone => (
    <div
      key={zone.id}
      className={`pl-8 mt-0.5 text-gray-400 cursor-pointer ${selected === zone.id ? 'bg-blue-100 rounded px-1' : ''}`}
      onClick={() => setSelected(zone.id)}
    >
      {zone.name} ({zone.occupancystatus})
    </div>
  ));

  const renderFloors = (floors: any[]) => floors.map(floor => (
    <div key={floor.id} className="pl-6 mt-0.5">
      <div
        className={`cursor-pointer font-medium text-gray-600 flex items-center ${selected === floor.id ? 'bg-blue-100 rounded px-1' : ''}`}
        onClick={() => setSelected(floor.id)}
      >
        <span className="mr-2" onClick={() => toggle(floor.id)}>
          {expanded[floor.id] ? '−' : '+'}
        </span>
        Floor {floor.floornumber}
      </div>
      {expanded[floor.id] && renderSeatZones(floor.seat_zones || [])}
    </div>
  ));

  const renderBuildings = (buildings: any[]) => buildings.map(building => (
    <div key={building.id} className="pl-4 mt-1">
      <div
        className={`cursor-pointer font-semibold text-gray-700 flex items-center ${selected === building.id ? 'bg-blue-100 rounded px-1' : ''}`}
        onClick={() => setSelected(building.id)}
      >
        <span className="mr-2" onClick={() => toggle(building.id)}>
          {expanded[building.id] ? '−' : '+'}
        </span>
        {building.name}
      </div>
      {expanded[building.id] && renderFloors(building.floors || [])}
    </div>
  ));

  const renderCampuses = (campuses: any[]) => campuses.map(campus => (
    <div key={campus.id} className="pl-4 mt-1">
      <div
        className={`cursor-pointer font-semibold text-blue-600 flex items-center ${selected === campus.id ? 'bg-blue-100 rounded px-1' : ''}`}
        onClick={() => setSelected(campus.id)}
      >
        <span className="mr-2" onClick={() => toggle(campus.id)}>
          {expanded[campus.id] ? '−' : '+'}
        </span>
        {campus.name}
      </div>
      {expanded[campus.id] && renderBuildings(campus.buildings || [])}
    </div>
  ));

  const renderCities = (cities: any[]) => cities.map(city => (
    <div key={city.name} className="pl-2 mt-1">
      <div
        className={`cursor-pointer font-semibold text-purple-600 flex items-center ${selected === city.name ? 'bg-blue-100 rounded px-1' : ''}`}
        onClick={() => setSelected(city.name)}
      >
        <span className="mr-2" onClick={() => toggle(city.name)}>
          {expanded[city.name] ? '−' : '+'}
        </span>
        {city.name}
      </div>
      {expanded[city.name] && renderCampuses(city.campuses || [])}
    </div>
  ));

  const renderCountries = (countries: any[]) => countries.map(country => (
    <div key={country.name} className="pl-2 mt-1">
      <div
        className={`cursor-pointer font-bold text-indigo-600 flex items-center ${selected === country.name ? 'bg-blue-100 rounded px-1' : ''}`}
        onClick={() => setSelected(country.name)}
      >
        <span className="mr-2" onClick={() => toggle(country.name)}>
          {expanded[country.name] ? '−' : '+'}
        </span>
        {country.name}
      </div>
      {expanded[country.name] && renderCities(Object.values(country.cities))}
    </div>
  ));

  const renderPortfolios = (portfolios: any[]) => portfolios.map(port => (
    <div key={port.id} className="pl-2 mt-1">
      <div
        className={`cursor-pointer font-semibold text-indigo-600 flex items-center ${selected === port.id ? 'bg-blue-100 rounded px-1' : ''}`}
        onClick={() => setSelected(port.id)}
      >
        <span className="mr-2" onClick={() => toggle(port.id)}>
          {expanded[port.id] ? '−' : '+'}
        </span>
        {port.name} (Region)
      </div>
      {expanded[port.id] && renderCountries(port.countries || [])}
    </div>
  ));

  return (
    <div className="space-y-2 p-4 bg-white rounded-lg shadow">
      {hierarchy.map(org => (
        <div key={org.id} className="border-b pb-2">
          <div
            className={`font-bold text-lg text-indigo-700 cursor-pointer flex items-center ${selected === org.id ? 'bg-blue-100 rounded px-1' : ''}`}
            onClick={() => setSelected(org.id)}
          >
            <span className="mr-2" onClick={() => toggle(org.id)}>
              {expanded[org.id] ? '−' : '+'}
            </span>
            {org.name}
          </div>
          {expanded[org.id] && renderPortfolios(org.portfolios || [])}
        </div>
      ))}
    </div>
  );
};

export default PortfolioHierarchy;
