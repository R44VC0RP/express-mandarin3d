import React, { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import Header from '../components/Header';
import BackgroundEffects from '../components/BackgroundEffects';
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
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <BackgroundEffects />
      <Header />

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white border-opacity-20">
            <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>
            <p className="text-center mb-8 text-lg">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-center justify-center p-6 bg-[#2A2A2A] rounded-xl">
                <FaEnvelope className="text-[#11B3BD] text-2xl mr-3" />
                <div>
                  <h3 className="font-semibold">Email Us</h3>
                  <a href="mailto:orders@mandarin3d.com" className="text-[#11B3BD] hover:text-[#0D939B]">
                    orders@mandarin3d.com
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center p-6 bg-[#2A2A2A] rounded-xl">
                <FaPhone className="text-[#11B3BD] text-2xl mr-3" />
                <div>
                  <h3 className="font-semibold">Call Us</h3>
                  <a href="tel:9043869755" className="text-[#11B3BD] hover:text-[#0D939B]">
                    (904) 386-9755
                  </a>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#2A2A2A] border-[#3A3A3A] focus:border-[#11B3BD] text-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#2A2A2A] border-[#3A3A3A] focus:border-[#11B3BD] text-white"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#2A2A2A] border-[#3A3A3A] focus:border-[#11B3BD] text-white min-h-[150px]"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#0D939B] text-white rounded-full hover:bg-[#11B3BD] transition duration-300 ease-in-out flex items-center justify-center"
              >
                <FaPaperPlane className="mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
