// Local storage keys
const REPORTS_KEY = 'animal_rescue_reports';
const NGO_USERS_KEY = 'animal_rescue_ngo_users';

// Helper to generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// Reports management
export const saveReport = (report) => {
  const reports = getReports();
  const newReport = {
    ...report,
    id: generateId(),
    created_at: new Date().toISOString(),
    status: 'pending'
  };
  reports.push(newReport);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  return newReport;
};

export const getReports = () => {
  const reports = localStorage.getItem(REPORTS_KEY);
  return reports ? JSON.parse(reports) : [];
};

export const updateReportStatus = (id, status) => {
  const reports = getReports();
  const updatedReports = reports.map(report => 
    report.id === id ? { ...report, status } : report
  );
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updatedReports));
  return updatedReports;
};

// NGO user management
export const saveNGOUser = (userData) => {
  const users = getNGOUsers();
  const newUser = {
    ...userData,
    id: generateId(),
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  localStorage.setItem(NGO_USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const getNGOUsers = () => {
  const users = localStorage.getItem(NGO_USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const loginNGO = (email, password) => {
  const users = getNGOUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  return null;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const logoutNGO = () => {
  localStorage.removeItem('currentUser');
};