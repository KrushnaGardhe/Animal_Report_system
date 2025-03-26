import React from 'react';
import { motion } from 'framer-motion';
import { Heart, AlertTriangle, Thermometer, Ban as Bandage, Pill, Stethoscope, Phone, Clock, Shield } from 'lucide-react';

const EmergencyCard = ({ title, description, icon: Icon }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
  >
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-red-100 rounded-xl">
        <Icon className="w-6 h-6 text-red-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  </motion.div>
);

const FirstAidStep = ({ number, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex space-x-4"
  >
    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
      <span className="text-indigo-600 font-semibold">{number}</span>
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
    </div>
  </motion.div>
);

export default function FirstAid() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Animal First Aid Guide</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Quick reference guide for common animal emergencies. Always contact a veterinarian for professional help.
          </p>
        </motion.div>
      </div>

      {/* Emergency Numbers */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EmergencyCard
            icon={Phone}
            title="Emergency Hotline"
            description="24/7 Animal Emergency: +1 (555) 123-4567"
          />
          <EmergencyCard
            icon={Clock}
            title="Response Time"
            description="Average response time: 15-30 minutes"
          />
          <EmergencyCard
            icon={Shield}
            title="Animal Control"
            description="Local Animal Control: +1 (555) 987-6543"
          />
        </div>
      </section>

      {/* Common Emergencies */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Common Emergencies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmergencyCard
            icon={Heart}
            title="Cardiac Emergency"
            description="If an animal is unconscious or having difficulty breathing, check for heartbeat and breathing. Start CPR if necessary."
          />
          <EmergencyCard
            icon={AlertTriangle}
            title="Trauma/Injury"
            description="Keep the animal still and warm. Apply direct pressure to bleeding wounds with clean cloth."
          />
          <EmergencyCard
            icon={Thermometer}
            title="Heat Stroke"
            description="Move to cool area, offer water. Apply cool (not cold) water to body. Avoid ice."
          />
          <EmergencyCard
            icon={Bandage}
            title="Wounds"
            description="Clean with saline solution. Apply antibiotic ointment if available. Bandage loosely."
          />
        </div>
      </section>

      {/* Basic First Aid Steps */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Basic First Aid Steps</h2>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="space-y-6">
            <FirstAidStep
              number="1"
              title="Ensure Your Safety"
              description="Approach with caution. Injured animals may bite or scratch out of fear."
            />
            <FirstAidStep
              number="2"
              title="Assess the Situation"
              description="Check for breathing, bleeding, and consciousness. Note any obvious injuries."
            />
            <FirstAidStep
              number="3"
              title="Contact Emergency Services"
              description="Call the emergency hotline or nearest veterinary clinic for guidance."
            />
            <FirstAidStep
              number="4"
              title="Keep the Animal Calm"
              description="Speak softly and move slowly. Minimize handling to prevent further injury."
            />
            <FirstAidStep
              number="5"
              title="Transport Safely"
              description="Use a sturdy box or carrier. Keep the animal warm and comfortable."
            />
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Stethoscope className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Important Note</h3>
              <p className="text-gray-700">
                This guide is for emergency reference only. It is not a substitute for professional veterinary care. 
                Always seek professional help as soon as possible. If in doubt, contact emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}