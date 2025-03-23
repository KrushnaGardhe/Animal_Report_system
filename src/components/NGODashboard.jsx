import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from '../lib/supabase';
import 'leaflet/dist/leaflet.css';
import { CheckCircle, XCircle, MapPin } from 'lucide-react';
import L from "leaflet";

// Fix missing marker icon in production (Vercel)
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


export default function NGODashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchReports();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/ngo/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (!session) {
        navigate('/ngo/login');
        return;
      }

      setSession(session);
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/ngo/login');
    }
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      setError('Error fetching reports: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (id, status) => {
    try {
      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      const { error: updateError } = await supabase
        .from('reports')
        .update({
          status: status,
          ngo_id: session.user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Refresh reports after update
      await fetchReports();
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Error updating report status. Please try again.');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">Please log in to access the dashboard</p>
          <button
            onClick={() => navigate('/ngo/login')}
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image Section */}
                  <div className="w-full md:w-1/3">
                    <img
                      src={report.image_url}
                      alt="Reported Animal"
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  </div>

                  {/* Details Section */}
                  <div className="w-full md:w-2/3 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Report Details</h3>
                        <p className="text-sm text-gray-500">
                          Submitted on: {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(report.status)}`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-700">{report.description}</p>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>Location: {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}</span>
                      </div>
                    </div>

                    {/* Map */}
                    <div className="h-48 rounded-lg overflow-hidden shadow-md">
                      <MapContainer
                        center={[report.latitude, report.longitude]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[report.latitude, report.longitude]} icon={customIcon}>
                          <Popup>
                            <div className="p-2">
                              <p className="font-semibold">Animal Location</p>
                              <p className="text-sm">{report.description}</p>
                            </div>
                          </Popup>
                        </Marker>

                      </MapContainer>
                    </div>

                    {/* Action Buttons */}
                    {report.status === 'pending' && session?.user && (
                      <div className="flex gap-4">
                        <button
                          onClick={() => updateReportStatus(report.id, 'accepted')}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Accept
                        </button>
                        <button
                          onClick={() => updateReportStatus(report.id, 'declined')}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="h-5 w-5 mr-2" />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No reports found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
