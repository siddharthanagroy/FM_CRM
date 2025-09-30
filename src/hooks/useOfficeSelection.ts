import { useState, useEffect } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';

export interface OfficeSelection {
  organizationId?: string;
  portfolioId?: string;
  campusId?: string;
  buildingId?: string;
  floorId?: string;
  displayName?: string;
}

export const useOfficeSelection = () => {
  const { findOfficeByPath } = usePortfolio();
  const [selectedOffice, setSelectedOffice] = useState<OfficeSelection | null>(null);

  // Load saved office selection on mount
  useEffect(() => {
    const savedOffice = localStorage.getItem('selectedOffice');
    if (savedOffice) {
      try {
        const parsed = JSON.parse(savedOffice);
        setSelectedOffice(parsed);
      } catch (error) {
        console.error('Error loading saved office selection:', error);
      }
    }
  }, []);

  // Update office selection
  const updateOfficeSelection = (selection: OfficeSelection) => {
    setSelectedOffice(selection);
    localStorage.setItem('selectedOffice', JSON.stringify(selection));
  };

  // Clear office selection
  const clearOfficeSelection = () => {
    setSelectedOffice(null);
    localStorage.removeItem('selectedOffice');
  };

  // Validate office selection
  const validateOfficeSelection = () => {
    if (!selectedOffice || !selectedOffice.organizationId || !selectedOffice.portfolioId || 
        !selectedOffice.campusId || !selectedOffice.buildingId) {
      return { isValid: false, office: null };
    }

    const office = findOfficeByPath(
      selectedOffice.organizationId,
      selectedOffice.portfolioId,
      selectedOffice.campusId,
      selectedOffice.buildingId,
      selectedOffice.floorId
    );

    return { isValid: office.isValid, office };
  };

  // Get current office context for filtering
  const getOfficeContext = () => {
    const validation = validateOfficeSelection();
    if (!validation.isValid || !validation.office) {
      return null;
    }

    return {
      organization: validation.office.organization,
      portfolio: validation.office.portfolio,
      campus: validation.office.campus,
      building: validation.office.building,
      floor: validation.office.floor,
    };
  };

  return {
    selectedOffice,
    updateOfficeSelection,
    clearOfficeSelection,
    validateOfficeSelection,
    getOfficeContext,
  };
};