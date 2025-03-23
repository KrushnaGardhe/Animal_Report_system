import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, MapPin } from 'lucide-react';

// ✅ Fix: Only import Leaflet when running in browser
const L = typeof window !== 'undefined' ? require('leaflet') : null;

// ✅ Fix: Use absolute URL for marker icon (works in Vercel)
const customIcon = L
  ? new L.Icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })
  : null;

export default function NGODashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchReports();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate('/ngo/login');
    });

    return () => authListener?.subscription?.unsubscribe?.();
  }, [navigate]);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!session) return navigate('/ngo/login');
      setSession(session);
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/ngo/login');
    }
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
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
      if (!session?.user?.id) throw new Error('Not authenticated');
      const { error: updateError } = await supabase.from('reports').update({
        status,
        ngo_id: session.user.id,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (updateError) throw updateError;
      await fetchReports();
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Error updating report status. Please try again.');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!session) return <div>Please log in to access the dashboard</div>;

  return (
    <div className="max-w-7xl mx-auto">
      {error && <div className="text-red-500">{error}</div>}
      <div className="bg-white shadow rounded-lg">
        {reports.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No reports found</div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="border p-6">
              <img src={report.image_url} alt="Reported Animal" className="w-full h-64 object-cover rounded-lg" />
              <p className="text-gray-700">{report.description}</p>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>
                  Location:{" "}
                  {report.latitude && report.longitude
                    ? `${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`
                    : "Unknown"}
                </span>
              </div>

              {/* ✅ Fix: Only render map if Leaflet and location data exist */}
              {L && report.latitude && report.longitude && (
                <MapContainer center={[report.latitude, report.longitude]} zoom={13} style={{ height: "200px" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[report.latitude, report.longitude]} icon={customIcon}>
                    <Popup>{report.description}</Popup>
                  </Marker>
                </MapContainer>
              )}

              {report.status === "pending" && (
                <div className="flex gap-4 mt-4">
                  <button onClick={() => updateReportStatus(report.id, "accepted")} className="bg-green-600 text-white px-4 py-2 rounded flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" /> Accept
                  </button>
                  <button onClick={() => updateReportStatus(report.id, "declined")} className="bg-red-600 text-white px-4 py-2 rounded flex items-center">
                    <XCircle className="h-5 w-5 mr-2" /> Decline
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
