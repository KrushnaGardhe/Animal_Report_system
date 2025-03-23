import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Camera, RefreshCw, MapPin, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

function LocationMarker({ position, setPosition }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
}

function AutoLocate({ setPosition }) {
  const map = useMap();

  useEffect(() => {
    map.locate();

    map.on('locationfound', (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    });

    map.on('locationerror', () => {
      console.log('Could not find location.');
    });
  }, [map, setPosition]);

  return null;
}

export default function ReportForm() {
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState(null);
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async (facingMode = cameraFacingMode) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      streamRef.current = stream;
      setShowCamera(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please make sure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const flipCamera = () => {
    stopCamera();
    const newFacingMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(newFacingMode);
    startCamera(newFacingMode);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      console.error('Video element or video dimensions are not available.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (blob) {
          setImage(blob);
          setShowCamera(false);
          stopCamera();
        } else {
          console.error('Failed to create image blob.');
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position || !image) return;

    setSubmitting(true);
    try {
      const fileName = `${Date.now()}.jpg`;
      const { data: imageData, error: uploadError } = await supabase.storage
        .from('animal-images')
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('animal-images')
        .getPublicUrl(fileName);

      const { error: reportError } = await supabase
        .from('reports')
        .insert({
          description,
          latitude: position[0],
          longitude: position[1],
          image_url: publicUrl,
          status: 'pending'
        });

      if (reportError) throw reportError;

      setDescription('');
      setPosition(null);
      setImage(null);
      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 my-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Report an Animal in Need</h1>
          <p className="text-gray-600 mt-2">Help us locate and rescue animals in distress</p>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <label className="block text-xl font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            rows={4}
            placeholder="Please describe the animal's condition and situation in detail..."
          />
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <label className="block text-xl font-medium text-gray-700">Location</label>
          <div className="h-[400px] rounded-xl overflow-hidden shadow-lg">
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker position={position} setPosition={setPosition} />
              <AutoLocate setPosition={setPosition} />
            </MapContainer>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {position ? 'Location selected' : 'Click on the map to select location'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigator.geolocation.getCurrentPosition(
                (position) => setPosition([position.coords.latitude, position.coords.longitude])
              )}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Use my location
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <label className="block text-xl font-medium text-gray-700">Photo</label>
          {showCamera ? (
            <div className="relative rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-xl"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={capturePhoto}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700"
                >
                  Take Photo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={flipCamera}
                  className="p-3 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700"
                >
                  <RefreshCw className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-500 transition-colors">
              <div className="space-y-1 text-center">
                {image ? (
                  <div className="space-y-4">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="mx-auto h-48 w-48 object-cover rounded-lg"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setImage(null)}
                      className="text-sm text-red-600 hover:text-red-500"
                    >
                      Remove photo
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={startCamera}
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Take a photo
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={submitting || !position || !image || !description}
            className="w-full max-w-md py-3 px-6 bg-black text-white rounded-xl font-medium shadow-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Report'
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}