import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { supabase } from "../lib/supabase";
import { CheckCircle, XCircle, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // ✅ FIXED require issue

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

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/ngo/login");
    });

    return () => authListener?.subscription?.unsubscribe?.();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return navigate("/ngo/login");
    setSession(session);
  };

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setReports(data);
    setLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {error && <div className="text-red-500 text-center">{error}</div>}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">NGO Dashboard</h1>

      {reports.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-lg">No reports found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white shadow-lg rounded-xl overflow-hidden border">
              <img src={report.image_url} alt="Reported Animal" className="w-full h-52 object-cover" />
              <div className="p-5">
                <p className="text-gray-700 text-sm mb-2">{report.description}</p>
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                  <span>
                    {report.latitude && report.longitude
                      ? `${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`
                      : "Unknown location"}
                  </span>
                </div>

                {/* Map */}
                {report.latitude && report.longitude && (
                  <div className="overflow-hidden rounded-lg border">
                    <MapContainer center={[report.latitude, report.longitude]} zoom={13} style={{ height: "200px" }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[report.latitude, report.longitude]} icon={customIcon}>
                        <Popup>{report.description}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
