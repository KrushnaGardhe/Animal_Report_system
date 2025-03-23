import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '../lib/supabase';
import 'leaflet/dist/leaflet.css';
import { CheckCircle, XCircle, MapPin } from 'lucide-react';

const customIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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
      if (!session) navigate('/ngo/login');
    });

    return () => subscription.unsubscribe();
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
        updated_at: new Date().toISOString()
      }).eq('id', id);
      if (updateError) throw updateError;
      await fetchReports();
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Error updating report status. Please try again.');
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
           status === 'accepted' ? 'bg-green-100 text-green-800' :
           status === 'declined' ? 'bg-red-100 text-red-800' :
           'bg-gray-100 text-gray-800';
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
                <span>Location: {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}</span>
              </div>
              <MapContainer center={[report.latitude, report.longitude]} zoom={13} style={{ height: '200px' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[report.latitude, report.longitude]} icon={customIcon}>
                  <Popup>{report.description}</Popup>
                </Marker>
              </MapContainer>
              {report.status === 'pending' && (
                <div className="flex gap-4 mt-4">
                  <button onClick={() => updateReportStatus(report.id, 'accepted')} className="bg-green-600 text-white px-4 py-2 rounded">Accept</button>
                  <button onClick={() => updateReportStatus(report.id, 'declined')} className="bg-red-600 text-white px-4 py-2 rounded">Decline</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
