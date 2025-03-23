import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { supabase } from "../lib/supabase";
import { CheckCircle, XCircle, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

// ✅ Fix: Only load Leaflet in the browser
const L = typeof window !== "undefined" ? require("leaflet") : null;

// ✅ Fix: Use absolute marker icon URL for Vercel
const customIcon = L
  ? new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
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
      console.log("Auth State Changed:", session);
      setSession(session);
      if (!session) navigate("/ngo/login");
    });

    return () => authListener?.subscription?.unsubscribe?.();
  }, [navigate]);

  // ✅ Fix: Check authentication properly
  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!session) return navigate("/ngo/login");
      setSession(session);
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/ngo/login");
    }
  };

  // ✅ Fix: Fetch reports correctly
  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      console.log("Fetched Reports:", data);
      setReports(data || []);
    } catch (error) {
      setError("Error fetching reports: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fix: Update report status & refresh UI
  const updateReportStatus = async (id, status) => {
    try {
      if (!session?.user?.id) throw new Error("Not authenticated");
      const { error: updateError } = await supabase
        .from("reports")
        .update({
          status,
          ngo_id: session.user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (updateError) throw updateError;
      fetchReports(); // Refresh data
    } catch (error) {
      console.error("Error updating report:", error);
      alert("Error updating report status. Please try again.");
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>;
  if (!session) return <div className="text-center text-red-500 text-lg mt-10">Please log in to access the dashboard</div>;

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
                
                {/* Location */}
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                  <span>
                    {report.latitude && report.longitude
                      ? `${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`
                      : "Unknown location"}
                  </span>
                </div>

                {/* Map */}
                {L && report.latitude && report.longitude && (
                  <div className="overflow-hidden rounded-lg border">
                    <MapContainer center={[report.latitude, report.longitude]} zoom={13} style={{ height: "200px" }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[report.latitude, report.longitude]} icon={customIcon}>
                        <Popup>{report.description}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                )}

                {/* Action Buttons */}
                {report.status === "pending" && (
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => updateReportStatus(report.id, "accepted")}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700 transition"
                    >
                      <CheckCircle className="h-5 w-5" /> Accept
                    </button>
                    <button
                      onClick={() => updateReportStatus(report.id, "declined")}
                      className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg w-full hover:bg-red-700 transition"
                    >
                      <XCircle className="h-5 w-5" /> Decline
                    </button>
                  </div>
                )}

                {/* Status Badge */}
                <div className={`mt-4 text-center px-3 py-1 text-sm font-semibold rounded-full ${
                  report.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : report.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
