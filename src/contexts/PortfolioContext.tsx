// src/contexts/PortfolioContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Portfolio,
  Organization,
  Campus,
  Building,
  Floor,
  SeatZone,
  Country,
  City
} from '../types/database';

interface PortfolioContextType {
  organizations: Organization[];
  portfolios: Portfolio[];
  campuses: Campus[];
  buildings: Building[];
  floors: Floor[];
  seatZones: SeatZone[];
  countries: Country[];
  cities: City[];
  loading: boolean;
  error: string | null;

  fetchAllData: () => Promise<void>;
  getOfficeHierarchy: () => any[];
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
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        orgsRes,
        portfoliosRes,
        campusesRes,
        buildingsRes,
        floorsRes,
        seatZonesRes,
        countriesRes,
        citiesRes
      ] = await Promise.all([
        supabase.from('organizations').select('*'),
        supabase.from('portfolios').select('*'),
        supabase.from('campuses').select('*'),
        supabase.from('buildings').select('*'),
        supabase.from('floors').select('*'),
        supabase.from('seat_zones').select('*'),
        supabase.from('countries').select('*'),
        supabase.from('cities').select('*')
      ]);

      if (orgsRes.error) throw orgsRes.error;
      if (portfoliosRes.error) throw portfoliosRes.error;
      if (campusesRes.error) throw campusesRes.error;
      if (buildingsRes.error) throw buildingsRes.error;
      if (floorsRes.error) throw floorsRes.error;
      if (seatZonesRes.error) throw seatZonesRes.error;
      if (countriesRes.error) throw countriesRes.error;
      if (citiesRes.error) throw citiesRes.error;

      setOrganizations(orgsRes.data || []);
      setPortfolios(portfoliosRes.data || []);
      setCampuses(campusesRes.data || []);
      setBuildings(buildingsRes.data || []);
      setFloors(floorsRes.data || []);
      setSeatZones(seatZonesRes.data || []);
      setCountries(countriesRes.data || []);
      setCities(citiesRes.data || []);

    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getOfficeHierarchy = () => {
    return organizations.map(org => {
      const orgCountry = countries.find(c => c.code === org.country_code)?.name || 'N/A';

      return {
        ...org,
        portfolios: portfolios
          .filter(p => p.organizationid === org.id)
          .map(portfolio => {
            // Find campuses linked to this portfolio
            const linkedCampuses = campuses.filter(c => c.portfolioid === portfolio.id);

            return {
              ...portfolio,
              country: orgCountry,
              cities: linkedCampuses.map(campus => {
                const city = cities.find(ci => ci.id === campus.city_id)?.name || campus.city || 'N/A';
                const buildingsForCampus = buildings.filter(b => b.campusid === campus.id);

                return {
                  city,
                  ...campus,
                  buildings: buildingsForCampus.map(building => ({
                    ...building,
                    floors: floors
                      .filter(f => f.buildingid === building.id)
                      .map(floor => ({
                        ...floor,
                        seatcount: seatZones.filter(sz => sz.floorid === floor.id).length
                      }))
                  }))
                };
              })
            };
          })
      };
    });
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
        countries,
        cities,
        loading,
        error,
        fetchAllData,
        getOfficeHierarchy
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
