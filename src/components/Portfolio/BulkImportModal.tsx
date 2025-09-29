import React, { useState } from 'react';
import { X, Upload, Download, FileText } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import Papa from 'papaparse';

interface BulkImportModalProps {
  onClose: () => void;
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({ onClose }) => {
  const { bulkImportPortfolios, bulkImportCampuses, bulkImportBuildings, bulkImportFloors } = usePortfolio();
  const [selectedEntityType, setSelectedEntityType] = useState<string>('portfolios');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          switch (selectedEntityType) {
            case 'portfolios':
              bulkImportPortfolios(result.data);
              break;
            case 'campuses':
              bulkImportCampuses(result.data);
              break;
            case 'buildings':
              bulkImportBuildings(result.data);
              break;
            case 'floors':
              bulkImportFloors(result.data);
              break;
          }
          alert(`Successfully imported ${result.data.length} ${selectedEntityType}!`);
          onClose();
        } catch (error) {
          console.error('Import error:', error);
          alert('Error importing data. Please check the file format.');
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        console.error('Parse error:', error);
        alert('Error parsing CSV file. Please check the file format.');
        setLoading(false);
      }
    });
  };

  const downloadTemplate = () => {
    let templateData: any[] = [];
    let filename = '';

    switch (selectedEntityType) {
      case 'portfolios':
        templateData = [{
          name: 'Sample Portfolio',
          region: 'APAC',
          country: 'India',
          countryCode: 'IN'
        }];
        filename = 'portfolio_template.csv';
        break;
      case 'campuses':
        templateData = [{
          portfolioId: '1',
          name: 'Sample Campus',
          city: 'Bangalore',
          address: 'Sample Address',
          gpsCoordinates: '12.8456, 77.6632',
          type: 'traditional_office',
          status: 'active',
          totalParkingSlots2W: 100,
          totalParkingSlots4W: 50,
          totalParkingEVSlots: 10,
          amenities: 'cafeteria,gym,medical_room',
          'greenInfrastructure.hasSolar': true,
          'greenInfrastructure.hasRainwaterHarvesting': true,
          'greenInfrastructure.hasSTP': false,
          'greenInfrastructure.greenAreaPercentage': 25,
          bcpDrSpaceAvailable: true
        }];
        filename = 'campus_template.csv';
        break;
      case 'buildings':
        templateData = [{
          campusId: '1',
          buildingName: 'Sample Building',
          buildingCode: 'SB',
          aliasName: 'Main Building',
          totalAreaBUA: 100000,
          totalAreaRA: 90000,
          totalAreaCarpet: 80000,
          numberOfFloors: 10,
          ownershipType: 'leased',
          status: 'active',
          parkingAllocation2W: 50,
          parkingAllocation4W: 30,
          parkingAllocationEV: 5,
          'leaseDetails.startDate': '2023-01-01',
          'leaseDetails.endDate': '2028-12-31',
          'leaseDetails.monthlyRent': 100000,
          'leaseDetails.camCharges': 10000,
          'leaseDetails.securityDeposit': 500000,
          'leaseDetails.currency': 'USD'
        }];
        filename = 'building_template.csv';
        break;
      case 'floors':
        templateData = [{
          buildingId: '1',
          floorNumber: '1',
          floorArea: 10000,
          'seatCounts.fixedDesk': 80,
          'seatCounts.hotDesk': 20,
          'seatCounts.cafeSeat': 15,
          'seatCounts.meetingRoomSeat': 24,
          parkingAllocation2W: 5,
          parkingAllocation4W: 3,
          parkingAllocationEV: 1,
          amenities: 'meeting_rooms,break_area,printer_station'
        }];
        filename = 'floor_template.csv';
        break;
    }

    const csv = Papa.unparse(templateData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const entityTypes = [
    { value: 'portfolios', label: 'Portfolios' },
    { value: 'campuses', label: 'Campuses' },
    { value: 'buildings', label: 'Buildings' },
    { value: 'floors', label: 'Floors' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Bulk Import Data</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Entity Type Selection */}
          <div>
            <label htmlFor="entityType" className="block text-sm font-medium text-gray-700 mb-2">
              Select Entity Type
            </label>
            <select
              id="entityType"
              value={selectedEntityType}
              onChange={(e) => setSelectedEntityType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {entityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Import Instructions</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Download the template CSV file for the correct format</li>
              <li>• Fill in your data following the template structure</li>
              <li>• Upload the completed CSV file</li>
              <li>• Ensure all required fields are populated</li>
              <li>• For nested objects (like lease details), use dot notation in column headers</li>
            </ul>
          </div>

          {/* Template Download */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Download Template</h4>
                <p className="text-sm text-gray-500">Get the CSV template for {selectedEntityType}</p>
              </div>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop your CSV file
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={loading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Field Mapping Guide */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Key Field Requirements</h3>
            <div className="text-sm text-gray-600 space-y-1">
              {selectedEntityType === 'portfolios' && (
                <>
                  <p>• <strong>name:</strong> Portfolio name (required)</p>
                  <p>• <strong>region:</strong> APAC, EMEA, AMERICAS, GLOBAL (required)</p>
                  <p>• <strong>country:</strong> Full country name (required)</p>
                  <p>• <strong>countryCode:</strong> 2-letter code like IN, UK, US (required)</p>
                </>
              )}
              {selectedEntityType === 'campuses' && (
                <>
                  <p>• <strong>portfolioId:</strong> Reference to existing portfolio (required)</p>
                  <p>• <strong>name:</strong> Campus name (required)</p>
                  <p>• <strong>type:</strong> traditional_office, sales_office, warehouse, etc.</p>
                  <p>• <strong>amenities:</strong> Comma-separated list</p>
                </>
              )}
              {selectedEntityType === 'buildings' && (
                <>
                  <p>• <strong>campusId:</strong> Reference to existing campus (required)</p>
                  <p>• <strong>buildingCode:</strong> Short code for ID generation (required)</p>
                  <p>• <strong>ownershipType:</strong> leased or owned</p>
                  <p>• <strong>leaseDetails.*:</strong> Use dot notation for lease fields</p>
                </>
              )}
              {selectedEntityType === 'floors' && (
                <>
                  <p>• <strong>buildingId:</strong> Reference to existing building (required)</p>
                  <p>• <strong>floorNumber:</strong> Floor identifier (required)</p>
                  <p>• <strong>seatCounts.*:</strong> Use dot notation for seat counts</p>
                  <p>• <strong>amenities:</strong> Comma-separated list</p>
                </>
              )}
            </div>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-700">Processing import...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;