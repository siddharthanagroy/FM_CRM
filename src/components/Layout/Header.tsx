import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../../contexts/PortfolioContext';

const Header = () => {
  const { getOfficeHierarchy, loading } = usePortfolio();
  const [officeHierarchy, setOfficeHierarchy] = useState<any[]>([]);

  useEffect(() => {
    if (!loading) {
      const hierarchy = getOfficeHierarchy();
      setOfficeHierarchy(hierarchy || []);
    }
  }, [loading, getOfficeHierarchy]);

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">My App</div>

      <div>
        <label className="mr-2">Select Office:</label>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <select className="bg-gray-700 text-white p-1 rounded">
            {officeHierarchy.length === 0 && (
              <option value="">No offices available</option>
            )}
            {officeHierarchy.map((org: any) => (
              <optgroup key={org.id} label={org.name}>
                {org.portfolios?.map((pf: any) => (
                  <optgroup key={pf.id} label={`— ${pf.name}`}>
                    {pf.campuses?.map((campus: any) => (
                      <optgroup key={campus.id} label={`—— ${campus.name}`}>
                        {campus.buildings?.map((bld: any) => (
                          <option key={bld.id} value={bld.id}>
                            {`——— ${bld.buildingName}`}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </optgroup>
                ))}
              </optgroup>
            ))}
          </select>
        )}
      </div>
    </header>
  );
};

export default Header;
