import React, { useRef, useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaArrowRight, FaUser, FaBriefcase, FaTools } from 'react-icons/fa';
import BackgroundEffects from '../components/BackgroundEffects';

// Import images for services (replace with your actual image imports)


function Products() {
  const [activeSection, setActiveSection] = useState('personal');
  const [isSticky, setIsSticky] = useState(false);
  const personalRef = useRef(null);
  const businessRef = useRef(null);
  const workRef = useRef(null);
  const navRef = useRef(null);

  const services = [
    {
      title: "Custom 3D Printed Cookie Cutters",
      description: "Create unique, personalized cookie cutters for special occasions or your business. Perfect for birthdays, holidays, or branded treats.",
      image: "https://via.placeholder.com/600x400",
      action: "Design Your Cutter",
      link: "/custom-cookie-cutters",
      id: 'personal'
    },
    {
      title: "Custom Work Nameplates",
      description: "Elevate your office space with personalized 3D printed nameplates. Choose from various designs and materials to match your style.",
      image: "https://utfs.io/f/RSbfEU0J8Dcdghlwk2z7mrUJN4RjMIfLonltvPdb2hcgHWaX",
      action: "Order Nameplate",
      link: "/custom-nameplates",
      id: 'work'
    },
    {
      title: "3D Modeling and Design",
      description: "Expert 3D modeling and design services to bring your ideas to life. From concept to final product, we're here to help.",
      image: "https://via.placeholder.com/600x400",
      action: "Start Your Project",
      link: "/design-services",
      id: 'business'
    },
    {
      title: "Custom Business Review QR Codes",
      description: "Boost your online presence with unique 3D printed QR codes that link directly to your business reviews. A modern touch for your storefront or reception area.",
      image: "https://via.placeholder.com/600x400",
      action: "Create QR Code",
      link: "/business-qr-codes",
      id: 'business'
    },
    {
      title: "Custom Product Nameplates",
      description: "Add a professional touch to your products with custom 3D printed nameplates. Ideal for showcasing your brand on displays or equipment.",
      image: "https://utfs.io/f/RSbfEU0J8Dcdghlwk2z7mrUJN4RjMIfLonltvPdb2hcgHWaX",
      action: "Design Nameplate",
      link: "/custom-nameplates",
      id: 'business'
    },
    {
      title: "Architectural Models",
      description: "Create detailed architectural models and mockups to visualize your projects with precision and clarity.",
      image: "https://via.placeholder.com/600x400",
      action: "Learn More",
      link: "/architectural-services",
      id: 'work'
    },
    {
      title: "Apartment Interior Design Mockups",
      description: "Bring your interior design concepts to life with detailed 3D printed mockups. Perfect for presentations and client approvals.",
      image: "https://via.placeholder.com/600x400",
      action: "Start Mockup",
      link: "/interior-mockups",
      id: 'work'
    },
    {
      title: "Custom Keychains",
      description: "Design and print unique keychains for personal use, gifts, or promotional items. Choose from various materials and finishes.",
      image: "https://via.placeholder.com/600x400",
      action: "Create Keychain",
      link: "/custom-keychains",
      id: 'personal'
    }
  ];

  const navItems = [
    { id: 'personal', label: 'Personal', icon: FaUser, ref: personalRef },
    { id: 'business', label: 'Business', icon: FaBriefcase, ref: businessRef },
    { id: 'work', label: 'Work', icon: FaTools, ref: workRef },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    navItems.forEach((item) => {
      if (item.ref.current) {
        observer.observe(item.ref.current);
      }
    });

    const handleScroll = () => {
      if (navRef.current) {
        const { top } = navRef.current.getBoundingClientRect();
        setIsSticky(top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (id) => {
    const ref = navItems.find(item => item.id === id).ref;
    const yOffset = -180; // 42px offset
    const element = ref.current;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({top: y, behavior: 'smooth'});
  };

  const renderServiceGroup = (category, ref) => (
    <div ref={ref} id={category.toLowerCase()} className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-white">{category} Services</h2>
      <div className="space-y-8">
        {services.filter(service => service.id === category.toLowerCase()).map((service, index) => (
          <div key={index} className="bg-[#2A2A2A] border-[#5E5E5E] border-2 rounded-[15px] overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h3>
                <p className="text-base text-gray-300 mb-6">{service.description}</p>
              </div>
              <div>
                <a 
                  href={service.link} 
                  className="inline-flex items-center primary-button text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-[#11B3BD]"
                >
                  {service.action}
                  <FaArrowRight className="ml-2" />
                </a>
                {service.footnotes && (
                  <div className="mt-4">
                    {service.footnotes.map((footnote, index) => (
                      <p key={index} className="text-xs text-gray-300">*{footnote}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white relative">
      <BackgroundEffects />

      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products and Services</h1>
          <p className="text-xl text-gray-300">Discover the perfect solution for your 3D printing needs</p>
        </section>
        
        {/* Jump to Section */}
        <nav 
          ref={navRef}
          className={`sticky top-[100px] z-40 bg-[#2A2A2A] bg-opacity-60 backdrop-blur-lg shadow-lg py-4 mb-8 rounded-lg mx-4 md:mx-auto max-w-4xl transition-all duration-300 ease-in-out ${
            isSticky ? 'md:translate-x-[calc(50vw-50%)]' : ''
          }`}
        >
          <div className="container mx-auto px-4">
            <ul className="flex justify-center items-center space-x-2 md:space-x-8">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-[#466F80] text-white'
                        : 'text-[#8A8A8A] hover:bg-[#4A4A4A] hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-2" />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Services Sections */}
        <section className="space-y-16 max-w-screen-lg mx-auto">
          {renderServiceGroup('Personal', personalRef)}
          {renderServiceGroup('Business', businessRef)}
          {renderServiceGroup('Work', workRef)}
        </section>
      </main>

      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}

export default Products;