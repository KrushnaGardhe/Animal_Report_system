import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Phone, Mail, MapPin, PawPrint, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const FadeInSection = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center text-white"
      >
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1548681528-6a5c45b66b42?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Saving Lives, One Paw at a Time</h1>
            <p className="text-xl md:text-2xl mb-8">Join us in making a difference for animals in need</p>
            <Link to={"/report"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:text-white hover:bg-black hover:bg-opacity-90 transition-colors"
              >
                Save Animal
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-8">About Our Mission</h2>
              <p className="text-lg text-gray-600 mb-12">
                We are dedicated to rescuing and protecting animals in distress. Our network of NGOs and volunteers works tirelessly to ensure every animal gets the care they deserve.
              </p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <FadeInSection>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Care & Love</h3>
                <p className="text-gray-600">Providing compassionate care for every animal we rescue</p>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PawPrint className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Rescue Operations</h3>
                <p className="text-gray-600">24/7 emergency response team for animals in need</p>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Local Impact</h3>
                <p className="text-gray-600">Making a difference in communities across the region</p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">See Our Impact</h2>
              <div className="aspect-w-16 aspect-h-9">
               <iframe
                  className="w-full h-[500px] rounded-xl shadow-lg"
                  src="https://www.youtube.com/embed/i_ctItDqOvQ?si=mPODJ-8qHlh9gbjw"
                  title="Animal Rescue Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <h2 className="text-4xl font-bold text-center mb-12">Success Stories</h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeInSection>
              <img
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Rescued Dog"
                className="w-full h-64 object-cover rounded-lg shadow-lg hover:transform hover:scale-105 transition-transform duration-300"
              />
            </FadeInSection>
            <FadeInSection>
              <img
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Rescued Cat"
                className="w-full h-64 object-cover rounded-lg shadow-lg hover:transform hover:scale-105 transition-transform duration-300"
              />
            </FadeInSection>
            <FadeInSection>
              <img
                src="https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Happy Animal"
                className="w-full h-64 object-cover rounded-lg shadow-lg hover:transform hover:scale-105 transition-transform duration-300"
              />
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">Contact Us</h2>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="w-6 h-6 text-indigo-600 mr-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-6 h-6 text-indigo-600 mr-4" />
                      <span>contact@animalrescue.org</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-6 h-6 text-indigo-600 mr-4" />
                      <span>123 Rescue Street, Animal City, AC 12345</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-600 hover:text-indigo-600">
                        <Facebook className="w-6 h-6" />
                      </a>
                      <a href="#" className="text-gray-600 hover:text-indigo-600">
                        <Twitter className="w-6 h-6" />
                      </a>
                      <a href="#" className="text-gray-600 hover:text-indigo-600">
                        <Instagram className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
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
