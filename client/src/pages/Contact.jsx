import React, { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, formData);
      if (response.status === 200) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40">
        <Header />
      </div>

      {/* Main content */}
      <main className="flex-grow relative z-10">
        <section className="relative mx-auto max-w-screen-2xl px-4 py-12 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[gradient_3s_linear_infinite]" />
          </div>

          <div className="relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-500/0 border border-cyan-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2 animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-cyan-500 uppercase">
                  Get in Touch
                </span>
              </div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                Contact Us
              </h1>
              <p className="text-sm text-white/60 max-w-2xl mx-auto">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Contact Form Section */}
              <div className="relative">
                <div className="space-y-6">
                  {/* Contact Info Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center p-4 rounded-xl bg-[#1a1b1e]/80 border border-neutral-800/50 backdrop-blur-sm hover:border-cyan-500/20 transition-colors duration-300">
                      <FaEnvelope className="text-cyan-400 text-xl mr-3" />
                      <div>
                        <h3 className="font-medium text-white/80 text-sm">Email Us</h3>
                        <a href="mailto:orders@mandarin3d.com" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
                          orders@mandarin3d.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center p-4 rounded-xl bg-[#1a1b1e]/80 border border-neutral-800/50 backdrop-blur-sm hover:border-cyan-500/20 transition-colors duration-300">
                      <FaPhone className="text-cyan-400 text-xl mr-3" />
                      <div>
                        <h3 className="font-medium text-white/80 text-sm">Call Us</h3>
                        <a href="tel:9043869755" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
                          (904) 386-9755
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1b1e]/80 p-6 rounded-xl border border-neutral-800/50 backdrop-blur-sm">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#2A2A2A] border-neutral-800 focus:border-cyan-500/50 text-white h-9"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#2A2A2A] border-neutral-800 focus:border-cyan-500/50 text-white h-9"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#2A2A2A] border-neutral-800 focus:border-cyan-500/50 text-white min-h-[120px] resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-2.5 bg-[#0D939B] hover:bg-[#0B7F86] text-white rounded-full transition-all duration-300 flex items-center justify-center group text-sm"
                    >
                      <FaPaperPlane className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                      Send Message
                    </button>
                  </form>
                </div>
              </div>

              {/* Image Section */}
              <div className="relative hidden md:block h-[500px]">
                <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none" /> {/* Grain effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent opacity-60" /> {/* Gradient overlay */}
                <img
                  src="/contact.png"
                  alt="3D Printing Process"
                  className="w-full h-full object-cover rounded-xl object-right"
                  style={{ aspectRatio: '9/16' }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
