import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Complaint {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  category: 'electrical' | 'plumbing' | 'hvac' | 'housekeeping' | 'general';
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'assigned' | 'in-progress' | 'pending-parts' | 'resolved' | 'closed';
  location: string;
  requesterName: string;
  requesterEmail: string;
  assignedTo?: string;
  assignedTeam?: 'electrical' | 'plumbing' | 'hvac' | 'housekeeping' | 'general';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  autoCloseDate?: string;
  reopenCount?: number;
}

export interface ServiceOrder {
  id: string;
  serviceOrderId: string;
  title: string;
  description: string;
  type: 'complaint' | 'compliance' | 'general';
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'assigned' | 'in-progress' | 'pending-approval' | 'resolved' | 'closed';
  assignedTo: string;
  assignedTeam?: string;
  complaintId?: string;
  complianceId?: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface Compliance {
  id: string;
  complianceId: string;
  name: string;
  description: string;
  category: 'fire_safety' | 'electrical' | 'environmental' | 'structural' | 'health_safety' | 'other';
  type: 'one_time' | 'renewable';
  status: 'active' | 'expired' | 'pending_renewal' | 'not_applicable';
  issueDate: string;
  expiryDate?: string;
  renewalFrequency?: number; // in months
  notificationDays: number; // days before expiry to notify
  issuingAuthority: string;
  certificateNumber: string;
  location: string;
  documentUrl?: string;
  lastRenewalDate?: string;
  nextRenewalDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'complaint' | 'work_order' | 'service_order' | 'compliance' | 'system';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  userId?: string;
  userRole?: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
  relatedType?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  type: 'checkbox' | 'text' | 'dropdown' | 'photo' | 'signature';
  required: boolean;
  options?: string[];
}

export interface Checklist {
  id: string;
  checklistId: string;
  name: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on-demand';
  priority: 'high' | 'medium' | 'low';
  estimatedDuration: number; // in minutes
  assignedDepartments: string[];
  status: 'active' | 'draft' | 'archived';
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ChecklistExecution {
  id: string;
  executionId: string;
  checklistId: string;
  checklistName: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  responses: {
    itemId: string;
    value: any;
    notes?: string;
    photoUrl?: string;
    signatureUrl?: string;
  }[];
  generalNotes?: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  completedAt?: string;
  startedAt?: string;
}

export interface Asset {
  id: string;
  assetId: string;
  name: string;
  category: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  installationDate: string;
  warrantyExpiry: string;
  location: string;
  maintenanceFrequency: number; // in days
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface WorkOrder {
  id: string;
  workOrderId: string;
  title: string;
  description: string;
  type: 'complaint' | 'preventive' | 'corrective';
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'assigned' | 'in-progress' | 'pending-parts' | 'completed' | 'closed';
  assignedTo: string;
  assetId?: string;
  complaintId?: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
}

interface DataContextType {
  complaints: Complaint[];
  assets: Asset[];
  workOrders: WorkOrder[];
  serviceOrders: ServiceOrder[];
  compliances: Compliance[];
  notifications: Notification[];
  checklists: Checklist[];
  checklistExecutions: ChecklistExecution[];
  createComplaint: (complaint: Omit<Complaint, 'id' | 'ticketId' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  bulkImportComplaints: (complaints: any[]) => void;
  createAsset: (asset: Omit<Asset, 'id' | 'assetId'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  createWorkOrder: (workOrder: Omit<WorkOrder, 'id' | 'workOrderId' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  createServiceOrder: (serviceOrder: Omit<ServiceOrder, 'id' | 'serviceOrderId' | 'createdAt' | 'updatedAt'>) => void;
  updateServiceOrder: (id: string, updates: Partial<ServiceOrder>) => void;
  createCompliance: (compliance: Omit<Compliance, 'id' | 'complianceId' | 'createdAt' | 'updatedAt'>) => void;
  updateCompliance: (id: string, updates: Partial<Compliance>) => void;
  deleteCompliance: (id: string) => void;
  createChecklist: (checklist: Omit<Checklist, 'id' | 'checklistId' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  updateChecklist: (id: string, updates: Partial<Checklist>) => void;
  deleteChecklist: (id: string) => void;
  createChecklistExecution: (execution: Omit<ChecklistExecution, 'id' | 'executionId' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateChecklistExecution: (id: string, updates: Partial<ChecklistExecution>) => void;
  markNotificationAsRead: (id: string) => void;
  getUnreadNotifications: () => Notification[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Generate unique IDs
const generateTicketId = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const sequence = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `FM-${year}-${month}-${day}-${sequence}`;
};

const generateServiceOrderId = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const sequence = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `SO-${year}-${month}-${sequence}`;
};

const generateComplianceId = (): string => {
  const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `COMP-${sequence}`;
};

const generateChecklistId = (): string => {
  const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `CHK-${sequence}`;
};

const generateExecutionId = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const sequence = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `EXE-${year}-${month}-${sequence}`;
};

const generateAssetId = (): string => {
  const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `AST-${sequence}`;
};

const generateWorkOrderId = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const sequence = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `WO-${year}-${month}-${sequence}`;
};

// Mock data
const mockComplaints: Complaint[] = [
  {
    id: '1',
    ticketId: 'FM-2024-01-15-0001',
    title: 'AC not working in Conference Room A',
    description: 'The air conditioning unit is not cooling properly. Temperature is around 28°C.',
    category: 'hvac',
    priority: 'high',
    status: 'in-progress',
    location: 'Floor 3, Conference Room A',
    requesterName: 'John Smith',
    requesterEmail: 'john.smith@company.com',
    assignedTo: 'John Technician',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    assignedTeam: 'hvac',
  },
  {
    id: '2',
    ticketId: 'FM-2024-01-14-0002',
    title: 'Water leak in Bathroom',
    description: 'Small water leak under the sink in the main bathroom.',
    category: 'plumbing',
    priority: 'medium',
    status: 'resolved',
    location: 'Floor 2, Main Bathroom',
    requesterName: 'Sarah Johnson',
    requesterEmail: 'sarah.johnson@company.com',
    assignedTo: 'Mike Plumber',
    createdAt: '2024-01-14T11:15:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    resolvedAt: '2024-01-14T16:45:00Z',
    autoCloseDate: '2024-01-17T16:45:00Z',
    assignedTeam: 'plumbing',
  },
];

const mockAssets: Asset[] = [
  {
    id: '1',
    assetId: 'AST-001',
    name: 'Central HVAC Unit #1',
    category: 'HVAC',
    model: 'Carrier 30RB-050',
    serialNumber: 'CRR-2023-1001',
    manufacturer: 'Carrier',
    installationDate: '2023-03-15',
    warrantyExpiry: '2026-03-15',
    location: 'Rooftop - Building A',
    maintenanceFrequency: 90,
    lastMaintenanceDate: '2023-12-15',
    nextMaintenanceDate: '2024-03-15',
    status: 'active',
  },
  {
    id: '2',
    assetId: 'AST-002',
    name: 'UPS System #5',
    category: 'Electrical',
    model: 'APC Smart-UPS 3000',
    serialNumber: 'APC-2023-2001',
    manufacturer: 'APC by Schneider Electric',
    installationDate: '2023-01-10',
    warrantyExpiry: '2025-01-10',
    location: 'Server Room, Floor 1',
    maintenanceFrequency: 30,
    lastMaintenanceDate: '2024-01-01',
    nextMaintenanceDate: '2024-01-31',
    status: 'active',
  },
];

const mockWorkOrders: WorkOrder[] = [
  {
    id: '1',
    workOrderId: 'WO-2024-01-001',
    title: 'Repair AC Unit in Conference Room A',
    description: 'Investigate and repair cooling issue in conference room AC unit',
    type: 'complaint',
    priority: 'high',
    status: 'in-progress',
    assignedTo: 'John Technician',
    assetId: '1',
    complaintId: '1',
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    dueDate: '2024-01-16T17:00:00Z',
    estimatedHours: 4,
  },
  {
    id: '2',
    workOrderId: 'WO-2024-01-002',
    title: 'Monthly UPS Maintenance Check',
    description: 'Perform monthly preventive maintenance on UPS System #5',
    type: 'preventive',
    priority: 'medium',
    status: 'assigned',
    assignedTo: 'John Technician',
    assetId: '2',
    createdAt: '2024-01-14T08:00:00Z',
    updatedAt: '2024-01-14T08:00:00Z',
    dueDate: '2024-01-31T17:00:00Z',
    estimatedHours: 2,
  },
];

const mockServiceOrders: ServiceOrder[] = [
  {
    id: '1',
    serviceOrderId: 'SO-2024-01-001',
    title: 'Fire NOC Renewal Application',
    description: 'Submit application for Fire NOC renewal with fire department',
    type: 'compliance',
    priority: 'high',
    status: 'assigned',
    assignedTo: 'FM Manager',
    assignedTeam: 'administration',
    complianceId: '1',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
    dueDate: '2024-02-15T17:00:00Z',
    estimatedHours: 8,
  },
];

const mockCompliances: Compliance[] = [
  {
    id: '1',
    complianceId: 'COMP-001',
    name: 'Fire NOC Certificate',
    description: 'No Objection Certificate from Fire Department for building operations',
    category: 'fire_safety',
    type: 'renewable',
    status: 'pending_renewal',
    issueDate: '2023-03-15',
    expiryDate: '2024-03-15',
    renewalFrequency: 12,
    notificationDays: 30,
    issuingAuthority: 'Delhi Fire Service',
    certificateNumber: 'DFS/NOC/2023/1234',
    location: 'Building A - Main Campus',
    lastRenewalDate: '2023-03-15',
    nextRenewalDate: '2024-03-15',
    createdAt: '2023-03-15T10:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
  },
  {
    id: '2',
    complianceId: 'COMP-002',
    name: 'CEIG Certificate',
    description: 'Chief Electrical Inspector to Government Certificate for electrical installations',
    category: 'electrical',
    type: 'renewable',
    status: 'active',
    issueDate: '2023-06-01',
    expiryDate: '2025-06-01',
    renewalFrequency: 24,
    notificationDays: 60,
    issuingAuthority: 'Chief Electrical Inspector',
    certificateNumber: 'CEIG/2023/5678',
    location: 'Building A - Electrical Room',
    lastRenewalDate: '2023-06-01',
    nextRenewalDate: '2025-06-01',
    createdAt: '2023-06-01T10:00:00Z',
    updatedAt: '2023-06-01T10:00:00Z',
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'compliance',
    title: 'Fire NOC Renewal Due',
    message: 'Fire NOC Certificate expires in 30 days. Please initiate renewal process.',
    priority: 'high',
    userRole: 'fm_manager',
    isRead: false,
    createdAt: '2024-01-15T09:00:00Z',
    relatedId: '1',
    relatedType: 'compliance',
  },
  {
    id: '2',
    type: 'complaint',
    title: 'New High Priority Complaint',
    message: 'AC not working in Conference Room A - High Priority',
    priority: 'high',
    userRole: 'technician',
    isRead: false,
    createdAt: '2024-01-15T09:00:00Z',
    relatedId: '1',
    relatedType: 'complaint',
  },
];

const mockChecklists: Checklist[] = [
  {
    id: '1',
    checklistId: 'CHK-001',
    name: 'Daily Safety Inspection',
    description: 'Daily safety checks for common areas and equipment',
    category: 'Safety',
    frequency: 'daily',
    priority: 'high',
    estimatedDuration: 30,
    assignedDepartments: ['all'],
    status: 'active',
    items: [
      {
        id: '1',
        title: 'Check fire extinguisher accessibility',
        description: 'Ensure fire extinguishers are accessible and not blocked',
        type: 'checkbox',
        required: true,
      },
      {
        id: '2',
        title: 'Inspect emergency exit signs',
        description: 'Verify all emergency exit signs are illuminated and visible',
        type: 'checkbox',
        required: true,
      },
      {
        id: '3',
        title: 'Document any safety concerns',
        description: 'Note any safety issues or concerns observed',
        type: 'text',
        required: false,
      },
    ],
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
    createdBy: 'FM Manager',
  },
  {
    id: '2',
    checklistId: 'CHK-002',
    name: 'HVAC Monthly Maintenance',
    description: 'Monthly preventive maintenance checks for HVAC systems',
    category: 'Maintenance',
    frequency: 'monthly',
    priority: 'medium',
    estimatedDuration: 60,
    assignedDepartments: ['hvac'],
    status: 'active',
    items: [
      {
        id: '1',
        title: 'Check air filter condition',
        description: 'Inspect and rate the condition of air filters',
        type: 'dropdown',
        required: true,
        options: ['Good', 'Fair', 'Poor', 'Needs Replacement'],
      },
      {
        id: '2',
        title: 'Test thermostat functionality',
        description: 'Verify thermostat is responding correctly',
        type: 'checkbox',
        required: true,
      },
      {
        id: '3',
        title: 'Take photo of equipment condition',
        description: 'Document current condition of HVAC unit',
        type: 'photo',
        required: false,
      },
    ],
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
    createdBy: 'FM Manager',
  },
];

const mockChecklistExecutions: ChecklistExecution[] = [
  {
    id: '1',
    executionId: 'EXE-2024-01-001',
    checklistId: '1',
    checklistName: 'Daily Safety Inspection',
    assignedTo: 'John Technician',
    status: 'pending',
    responses: [],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    dueDate: '2024-01-15T17:00:00Z',
  },
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(mockServiceOrders);
  const [compliances, setCompliances] = useState<Compliance[]>(mockCompliances);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [checklists, setChecklists] = useState<Checklist[]>(mockChecklists);
  const [checklistExecutions, setChecklistExecutions] = useState<ChecklistExecution[]>(mockChecklistExecutions);

  const createComplaint = (complaintData: Omit<Complaint, 'id' | 'ticketId' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newComplaint: Complaint = {
      ...complaintData,
      id: Date.now().toString(),
      ticketId: generateTicketId(),
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setComplaints(prev => [newComplaint, ...prev]);

    // Auto-create service order for the complaint
    const serviceOrder: Omit<ServiceOrder, 'id' | 'serviceOrderId' | 'createdAt' | 'updatedAt'> = {
      title: `Resolve: ${complaintData.title}`,
      description: complaintData.description,
      type: 'complaint',
      priority: complaintData.priority,
      status: 'open',
      assignedTo: complaintData.assignedTo || '',
      assignedTeam: complaintData.assignedTeam,
      complaintId: newComplaint.id,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      estimatedHours: 2,
    };
    createServiceOrder(serviceOrder);

    // Create notification
    const notification: Notification = {
      id: Date.now().toString() + '_notif',
      type: 'complaint',
      title: 'New Complaint Created',
      message: `New ${complaintData.priority} priority complaint: ${complaintData.title}`,
      priority: complaintData.priority,
      userRole: complaintData.assignedTeam || 'fm_manager',
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedId: newComplaint.id,
      relatedType: 'complaint',
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;

    // Handle auto-close logic
    if (updates.status === 'resolved' && complaint.status !== 'resolved') {
      const autoCloseDate = new Date();
      autoCloseDate.setDate(autoCloseDate.getDate() + 3); // 3 days from now
      updates.autoCloseDate = autoCloseDate.toISOString();
      updates.resolvedAt = new Date().toISOString();
    }

    setComplaints(prev => prev.map(complaint => 
      complaint.id === id 
        ? { ...complaint, ...updates, updatedAt: new Date().toISOString() }
        : complaint
    ));

    // Create notification for status change
    if (updates.status) {
      const notification: Notification = {
        id: Date.now().toString() + '_status',
        type: 'complaint',
        title: 'Complaint Status Updated',
        message: `Complaint ${complaint.ticketId} status changed to ${updates.status}`,
        priority: 'medium',
        userId: complaint.requesterEmail,
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedId: id,
        relatedType: 'complaint',
      };
      setNotifications(prev => [notification, ...prev]);
    }
  };

  const bulkImportComplaints = (complaintsData: any[]) => {
    const newComplaints = complaintsData.map(data => ({
      ...data,
      id: Date.now().toString() + Math.random().toString(),
      ticketId: generateTicketId(),
      status: 'open' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setComplaints(prev => [...newComplaints, ...prev]);
  };

  const createAsset = (assetData: Omit<Asset, 'id' | 'assetId'>) => {
    const newAsset: Asset = {
      ...assetData,
      id: Date.now().toString(),
      assetId: generateAssetId(),
    };
    setAssets(prev => [newAsset, ...prev]);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id 
        ? { ...asset, ...updates }
        : asset
    ));
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const createWorkOrder = (workOrderData: Omit<WorkOrder, 'id' | 'workOrderId' | 'createdAt' | 'updatedAt'>) => {
    const newWorkOrder: WorkOrder = {
      ...workOrderData,
      id: Date.now().toString(),
      workOrderId: generateWorkOrderId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWorkOrders(prev => [newWorkOrder, ...prev]);
  };

  const updateWorkOrder = (id: string, updates: Partial<WorkOrder>) => {
    setWorkOrders(prev => prev.map(workOrder => 
      workOrder.id === id 
        ? { ...workOrder, ...updates, updatedAt: new Date().toISOString() }
        : workOrder
    ));
  };

  const createServiceOrder = (serviceOrderData: Omit<ServiceOrder, 'id' | 'serviceOrderId' | 'createdAt' | 'updatedAt'>) => {
    const newServiceOrder: ServiceOrder = {
      ...serviceOrderData,
      id: Date.now().toString(),
      serviceOrderId: generateServiceOrderId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setServiceOrders(prev => [newServiceOrder, ...prev]);
  };

  const updateServiceOrder = (id: string, updates: Partial<ServiceOrder>) => {
    setServiceOrders(prev => prev.map(serviceOrder => 
      serviceOrder.id === id 
        ? { ...serviceOrder, ...updates, updatedAt: new Date().toISOString() }
        : serviceOrder
    ));
  };

  const createCompliance = (complianceData: Omit<Compliance, 'id' | 'complianceId' | 'createdAt' | 'updatedAt'>) => {
    const newCompliance: Compliance = {
      ...complianceData,
      id: Date.now().toString(),
      complianceId: generateComplianceId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCompliances(prev => [newCompliance, ...prev]);

    // Create notification if renewal is due soon
    if (complianceData.type === 'renewable' && complianceData.expiryDate) {
      const expiryDate = new Date(complianceData.expiryDate);
      const notificationDate = new Date(expiryDate);
      notificationDate.setDate(notificationDate.getDate() - complianceData.notificationDays);
      
      if (new Date() >= notificationDate) {
        const notification: Notification = {
          id: Date.now().toString() + '_compliance',
          type: 'compliance',
          title: 'Compliance Renewal Due',
          message: `${complianceData.name} expires on ${expiryDate.toLocaleDateString()}`,
          priority: 'high',
          userRole: 'fm_manager',
          isRead: false,
          createdAt: new Date().toISOString(),
          relatedId: newCompliance.id,
          relatedType: 'compliance',
        };
        setNotifications(prev => [notification, ...prev]);
      }
    }
  };

  const updateCompliance = (id: string, updates: Partial<Compliance>) => {
    setCompliances(prev => prev.map(compliance => 
      compliance.id === id 
        ? { ...compliance, ...updates, updatedAt: new Date().toISOString() }
        : compliance
    ));
  };

  const deleteCompliance = (id: string) => {
    setCompliances(prev => prev.filter(compliance => compliance.id !== id));
  };

  const createChecklist = (checklistData: Omit<Checklist, 'id' | 'checklistId' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const newChecklist: Checklist = {
      ...checklistData,
      id: Date.now().toString(),
      checklistId: generateChecklistId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User', // In real app, get from auth context
    };
    setChecklists(prev => [newChecklist, ...prev]);
  };

  const updateChecklist = (id: string, updates: Partial<Checklist>) => {
    setChecklists(prev => prev.map(checklist => 
      checklist.id === id 
        ? { ...checklist, ...updates, updatedAt: new Date().toISOString() }
        : checklist
    ));
  };

  const deleteChecklist = (id: string) => {
    setChecklists(prev => prev.filter(checklist => checklist.id !== id));
  };

  const createChecklistExecution = (executionData: Omit<ChecklistExecution, 'id' | 'executionId' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newExecution: ChecklistExecution = {
      ...executionData,
      id: Date.now().toString(),
      executionId: generateExecutionId(),
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
    };
    setChecklistExecutions(prev => [newExecution, ...prev]);

    // Create notification
    const notification: Notification = {
      id: Date.now().toString() + '_checklist',
      type: 'system',
      title: 'Checklist Completed',
      message: `${executionData.checklistName} has been completed by ${executionData.assignedTo}`,
      priority: 'medium',
      userRole: 'fm_manager',
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedId: newExecution.id,
      relatedType: 'checklist_execution',
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const updateChecklistExecution = (id: string, updates: Partial<ChecklistExecution>) => {
    setChecklistExecutions(prev => prev.map(execution => 
      execution.id === id 
        ? { ...execution, ...updates, updatedAt: new Date().toISOString() }
        : execution
    ));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const getUnreadNotifications = () => {
    return notifications.filter(n => !n.isRead);
  };

  // Auto-close resolved complaints after 3 days
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setComplaints(prev => prev.map(complaint => {
        if (complaint.status === 'resolved' && complaint.autoCloseDate) {
          const autoCloseDate = new Date(complaint.autoCloseDate);
          if (now >= autoCloseDate) {
            // Create notification for auto-close
            const notification: Notification = {
              id: Date.now().toString() + '_autoclose',
              type: 'complaint',
              title: 'Complaint Auto-Closed',
              message: `Complaint ${complaint.ticketId} has been automatically closed after 3 days`,
              priority: 'low',
              userId: complaint.requesterEmail,
              isRead: false,
              createdAt: new Date().toISOString(),
              relatedId: complaint.id,
              relatedType: 'complaint',
            };
            setNotifications(prev => [notification, ...prev]);
            
            return { ...complaint, status: 'closed' as const, updatedAt: now.toISOString() };
          }
        }
        return complaint;
      }));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <DataContext.Provider value={{
      complaints,
      assets,
      workOrders,
      serviceOrders,
      compliances,
      notifications,
      checklists,
      checklistExecutions,
      createComplaint,
      updateComplaint,
      bulkImportComplaints,
      createAsset,
      updateAsset,
      deleteAsset,
      createWorkOrder,
      updateWorkOrder,
      createServiceOrder,
      updateServiceOrder,
      createCompliance,
      updateCompliance,
      deleteCompliance,
      createChecklist,
      updateChecklist,
      deleteChecklist,
      createChecklistExecution,
      updateChecklistExecution,
      markNotificationAsRead,
      getUnreadNotifications,
    }}>
      {children}
    </DataContext.Provider>
  );
};