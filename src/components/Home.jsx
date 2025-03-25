import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Phone, Mail, MapPin, PawPrint, Instagram, Facebook, Twitter, ArrowRight, Shield, Users, Clock, ChevronDown, Star, Award, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import hellowVideo from '../fetch/hellow.mp4'
const FadeInSection = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, title, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100"
  >
    <div className="flex items-center space-x-6">
      <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-inner">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div>
        <p className="text-5xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-gray-600 text-lg">{title}</p>
      </div>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <FadeInSection delay={delay}>
    <motion.div
      whileHover={{ y: -8 }}
      className="relative p-8 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  </FadeInSection>
);

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={hellowVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto mt-[-5vh]">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium">Make The Animal Proud</span>
                </div>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Saving Lives,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                One Paw at a Time
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join our mission to rescue and protect animals in need. Together, we can create a world where every animal has a chance at a better life.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/report">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full text-lg font-semibold hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center w-full sm:w-auto"
              >
                  Report a Case
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        
      </motion.section>

      {/* Features Section */}
      <section id="about" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="max-w-4xl mx-auto text-center mb-20">
              <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-full mb-6">
                <Award className="w-6 h-6 text-indigo-600 mr-2" />
                <span className="text-indigo-600 font-medium">Our Mission</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">Making a Real Difference</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We are dedicated to rescuing and protecting animals in distress through our network of trusted NGO partners and volunteers.
              </p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <FeatureCard
              icon={Heart}
              title="Compassionate Care"
              description="Every animal receives dedicated attention and medical care from our experienced team of professionals."
              delay={0.2}
            />
            <FeatureCard
              icon={Zap}
              title="Rapid Response"
              description="Our 24/7 emergency response team ensures quick action when animals are in critical situations."
              delay={0.4}
            />
            <FeatureCard
              icon={Users}
              title="Community Impact"
              description="We work closely with local communities to create lasting positive change for animals in need."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-full mb-6">
                <Star className="w-6 h-6 text-indigo-600 mr-2" />
                <span className="text-indigo-600 font-medium">Success Stories</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">Transforming Lives</h2>
            </div>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <FadeInSection delay={0.2}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Rescued Dog"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">Max's Journey</h3>
                    <p className="text-gray-200">From street survivor to loving home</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed">
                    Max was found injured on the streets. After weeks of care and rehabilitation, he found his forever family.
                  </p>
                </div>
              </motion.div>
            </FadeInSection>

            <FadeInSection delay={0.4}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Rescued Cat"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">Luna's Recovery</h3>
                    <p className="text-gray-200">A tale of resilience and hope</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed">
                    Luna was rescued from a difficult situation. Today, she brings joy to her new family every single day.
                  </p>
                </div>
              </motion.div>
            </FadeInSection>

            <FadeInSection delay={0.6}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Happy Animal"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">Bella's Story</h3>
                    <p className="text-gray-200">From rescue to forever family</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed">
                    Bella's transformation from a scared rescue to a confident, happy pet inspires us every day.
                  </p>
                </div>
              </motion.div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-full mb-6">
                  <Mail className="w-6 h-6 text-indigo-600 mr-2" />
                  <span className="text-indigo-600 font-medium">Contact Us</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">Get in Touch</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-6">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Emergency Hotline</p>
                        <p className="text-gray-600">+1 (555) 123-4567</p>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-6">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Email Us</p>
                        <p className="text-gray-600">contact@animalrescue.org</p>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-6">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Location</p>
                        <p className="text-gray-600">123 Rescue Street, Animal City</p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="pt-8">
                    <h4 className="text-xl font-semibold mb-6">Connect With Us</h4>
                    <div className="flex space-x-4">
                      <motion.a
                        whileHover={{ scale: 1.1, y: -5 }}
                        href="#"
                        className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg"
                      >
                        <Facebook className="w-6 h-6" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1, y: -5 }}
                        href="#"
                        className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg"
                      >
                        <Twitter className="w-6 h-6" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1, y: -5 }}
                        href="#"
                        className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg"
                      >
                        <Instagram className="w-6 h-6" />
                      </motion.a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl font-medium"
                    >
                      Send Message
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}