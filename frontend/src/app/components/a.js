import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Heart, Activity, Navigation, Stethoscope, Shield, Clock, Phone, MapPin, ArrowRight, Building2
} from 'lucide-react';

export default function HeroSections() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Patient Emergency",
      description: "Patient triggers emergency alert through app or call",
      image: "/h1.jpg",
    },
    {
      icon: <Navigation className="w-5 h-5" />,
      title: "Driver Accepts",
      description: "Ambulance driver accepts and gets GPS directions",
      image: "/h2.jpg",
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      title: "Hospital Prepared",
      description: "Nearest hospital receives patient data and prepares",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
  ];

  const features = [
    {
      image: "/f1.jpg",
      title: "Real-time Coordination",
      description: "Seamless bridge between patients, drivers, and hospitals",
    },
    {
      image: "/f2.jpg",
      title: "Smart Route Optimization",
      description: "AI-powered routing to nearest available medical facility",
    },
    {
      image: "/f3.jpg",
      title: "Medical Data Sync",
      description: "Instant patient information sharing with receiving hospital",
    },
    {
      image: "/f4.jpg",
      title: "HIPAA Compliant",
      description: "Enterprise-grade security for all medical communications",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Glowing Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-950/20 via-black to-orange-950/10"></div>
        
        {/* Animated Mesh Grid */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,165,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,165,0,0.03)_1px,transparent_1px)] bg-[size:100px_100px] animate-mesh-drift"></div>
        </div>

        {/* Large Orange Orbs with Enhanced Animation */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-orb-float bg-[radial-gradient(circle,rgba(255,165,0,0.8),rgba(255,140,0,0.6),rgba(0,0,0,0.2))]"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-orb-float-delayed bg-[radial-gradient(circle,rgba(255,140,0,0.9),rgba(255,165,0,0.6),rgba(0,0,0,0.1))]"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-orb-pulse bg-[radial-gradient(circle,rgba(255,165,0,0.7),rgba(255,140,0,0.4),rgba(0,0,0,0.3))]"></div>
        
        {/* Dynamic Orange Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            suppressHydrationWarning
            className={`absolute w-3 h-3 rounded-full mix-blend-screen filter blur-sm opacity-70 animate-particle-${i % 4}`}
            style={{
              left: `${20 + (i * 7)}%`,
              top: `${30 + (i * 5)}%`,
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? 'rgba(255,165,0,0.9)' : 'rgba(255,140,0,0.8)'
              }, transparent)`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}

        {/* Floating Orange Embers */}
        {[...Array(8)].map((_, i) => (
          <div 
           suppressHydrationWarning
            key={`ember-${i}`}
            className="absolute w-1 h-1 rounded-full bg-orange-400 opacity-60 animate-ember-rise"
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%',
              animationDelay: `${i * 1.2}s`,
              animationDuration: '8s'
            }}
          />
        ))}
      </div>

      {/* Enhanced 3D How It Works Section */}
      <section className="relative py-20 px-6 transform skew-y-1">
        <div className="max-w-7xl mx-auto transform -skew-y-1">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 backdrop-blur-xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-full px-6 py-3 mb-8 shadow-2xl shadow-orange-500/20">
              <Heart className="w-5 h-5 text-orange-400 animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                Life-Saving Technology
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              How It <span className="bg-gradient-to-r from-orange-400 to-orange-900 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-md text-white/70 max-w-3xl mx-auto leading-relaxed">
              A seamless bridge connecting patients, ambulances, and hospitals in critical moments
            </p>
          </div>
          
          {/* Enhanced 3D Hexagonal Timeline Layout */}
          <div className="relative perspective-2000">
            {/* 3D Central Connection Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[85%] w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-pulse-glow z-20 transform-3d hover:scale-110 hover:rotateY-180 transition-all duration-700">
              <Activity className="w-5 h-5 text-white animate-bounce" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/30 to-orange-500/30 animate-spin-slow"></div>
            </div>
            
            {/* 3D Connecting Lines with Enhanced Animation */}
            <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 800 400">
              <defs>
                <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,165,0,0.8)" />
                  <stop offset="50%" stopColor="rgba(255,140,0,0.8)" />
                  <stop offset="100%" stopColor="rgba(255,165,0,0.8)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {steps.map((_, index) => (
                <path
                  key={index}
                    d={`M400 ${200 - 20} L${250 + index * 150} ${(100 + index * 100) - 20}`}
                  stroke="url(#connectionGrad)"
                  strokeWidth="1"
                  fill="none"
                  filter="url(#glow)"
                  className={`transition-all duration-1000 ${
                    activeStep >= index ? 'opacity-100 animate-pulse animate-flow' : 'opacity-30'
                  }`}
                  strokeDasharray="15,5"
                />
              ))}
            </svg>
            
            {/* Enhanced 3D Steps positioned in triangular formation */}
            <div className="relative h-96 flex items-center justify-center transform-3d">
              {steps.map((step, index) => {
                const positions = [
                  { x: '-translate-x-80 -translate-y-20', delay: '0s', rotate: 'hover:rotateY-12' },
                  { x: 'translate-x-80 -translate-y-20', delay: '1s', rotate: 'hover:rotateY-12' },
                  { x: 'translate-y-34', delay: '2s', rotate: 'hover:rotateX-12' }
                ];
                
                return (
                  <div
                    key={index}
                    className={`absolute transform ${positions[index].x} z-30 transition-all duration-1000 ${positions[index].rotate}`}
                    style={{ 
                      animationDelay: positions[index].delay,
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Enhanced 3D Step Icon */}
                    <div
                      className={`w-15 h-15 rounded-2xl flex items-center justify-center mb-6 transition-all duration-700 transform-3d relative ${
                        activeStep === index 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 ring-4 ring-orange-400/30 shadow-2xl shadow-orange-500/50 scale-110 rotateX-12 rotateY-12' 
                          : 'bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:rotateX-6 hover:rotateY-6'
                      }`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className={`transition-all duration-300 transform-3d ${
                        activeStep === index ? 'text-white rotateZ-12' : 'text-white/60'
                      }`}>
                        {step.icon}
                      </div>
                      {activeStep === index && (
                        <>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-orange-400/20 to-orange-500/20 blur-lg animate-pulse"></div>
                        </>
                      )}
                    </div>
                    
                    {/* Enhanced 3D Step Card with Advanced Effects */}
                    <div
                      className={`w-72 rounded-3xl overflow-hidden transition-all duration-700 perspective-1000 transform-3d relative ${
                        activeStep === index 
                          ? 'ring-2 ring-orange-500/50 shadow-2xl shadow-orange-500/30 scale-105 rotateY-8 rotateX-4' 
                          : 'hover:scale-105 hover:rotateY-4 hover:rotateX-2'
                      }`}
                      style={{ 
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className="relative h-48 overflow-hidden transform-3d">
                        <Image
                          src={step.image}
                          alt={step.title}
                          fill
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        
                        {/* Enhanced 3D Floating Info Panel */}
                        <div className="absolute bottom-4 left-4 right-4 backdrop-blur-xl bg-gradient-to-r from-black/40 to-black/20 rounded-2xl p-2 border border-orange-500/20 shadow-xl transform-3d hover:translateZ-4 transition-all duration-500">
                          <h3 className="text-md font-bold text-white mb-2">{step.title}</h3>
                          <p className="text-xs text-white/80 leading-relaxed">{step.description}</p>
                          {activeStep === index && (
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-500/20 to-orange-400/20 blur-sm -z-10"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Black & Orange Theme */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-orange-400 to-orange-700 bg-clip-text text-transparent animate-gradient">Patient Bridge</span>
            </h2>
            <p className="text-md text-white/70 max-w-3xl mx-auto">
              Advanced technology meets compassionate care for unmatched emergency response
            </p>
          </div>
          
          {/* Bento Grid Layout with Black & Orange Theme */}
          <div className="grid grid-cols-12 grid-rows-8 gap-4 h-[800px]">
            {/* Large Hero Feature */}
            <div className="col-span-12 md:col-span-8 row-span-4 group relative backdrop-blur-xl bg-gradient-to-br from-black/60 to-black/40 rounded-3xl overflow-hidden border border-orange-500/20 hover:border-orange-500/40 transition-all duration-700">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Emergency Response Team"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent"></div>
              </div>
              <div className="relative p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center space-x-2 backdrop-blur-xl bg-orange-500/20 rounded-full px-4 py-2 mb-4">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-medium text-orange-300">4 mins Avg Response</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Real-time Coordination</h3>
                  <p className="text-white/70 text-md leading-relaxed">Seamless bridge between patients, drivers, and hospitals with AI-powered emergency response system.</p>
                </div>
                <div className="flex items-center space-x-4 text-white/60">
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
                  <span className="text-sm">Live System Active</span>
                </div>
              </div>
            </div>

            {/* Stats Panel */}
            <div className="col-span-12 md:col-span-4 row-span-4 backdrop-blur-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-3xl p-6 border border-orange-500/30 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-orange-400/30 to-transparent blur-2xl"></div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Live Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Active Ambulances</span>
                    <span className="text-1xl font-bold text-orange-400">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Lives Saved Today</span>
                    <span className="text-1xl font-bold text-orange-300">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Response Time</span>
                    <span className="text-2xl font-bold text-orange-200">3.2m</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 backdrop-blur-xl bg-black/20 rounded-2xl border border-orange-500/20">
                <div className="flex items-center space-x-2 text-orange-400">
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
                  <span className="text-sm font-medium">System Operational</span>
                </div>
              </div>
            </div>

            {/* Feature Cards Grid */}
            {features.slice(0, 4).map((feature, index) => {
              const spans = [
                'col-span-6 row-span-2',
                'col-span-6 row-span-2', 
                'col-span-4 row-span-2',
                'col-span-8 row-span-2'
              ];
              
              return (
                <div
                  key={index}
                  className={`${spans[index]} group backdrop-blur-xl bg-black/40 rounded-3xl overflow-hidden border border-orange-500/20 hover:border-orange-500/40 transition-all duration-700 hover:scale-[1.02] relative`}
                >
                  <div className="absolute inset-0">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
                  </div>
                  <div className="relative p-6 h-full flex flex-col justify-end">
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 backdrop-blur-xl bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                    <ArrowRight className="w-5 h-5 text-orange-400 group-hover:text-orange-300 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with Black & Orange Theme */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative backdrop-blur-xl bg-gradient-to-r from-black/60 via-black/40 to-black/60 rounded-[3rem] p-12 border border-orange-500/20 overflow-hidden">
            {/* Orange Geometric Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(30deg,rgba(255,165,0,0.1)_12%,transparent_12.5%,transparent_87%,rgba(255,165,0,0.1)_87.5%,rgba(255,165,0,0.1)),linear-gradient(150deg,rgba(255,165,0,0.1)_12%,transparent_12.5%,transparent_87%,rgba(255,165,0,0.1)_87.5%,rgba(255,165,0,0.1)),linear-gradient(30deg,rgba(255,165,0,0.1)_12%,transparent_12.5%,transparent_87%,rgba(255,165,0,0.1)_87.5%,rgba(255,165,0,0.1)),linear-gradient(150deg,rgba(255,165,0,0.1)_12%,transparent_12.5%,transparent_87%,rgba(255,165,0,0.1)_87.5%,rgba(255,165,0,0.1))] bg-[size:80px_140px] bg-[position:0_0,0_0,40px_70px,40px_70px]"></div>
            </div>
            
            <div className="relative text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Ready to <span className="bg-gradient-to-r from-orange-400 to-orange-900 bg-clip-text text-transparent">Save Lives?</span>
              </h2>
              <p className="text-md text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join our network of hospitals and ambulance services, or download our app for instant emergency access
              </p>
              
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
                <button className="group relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-2 rounded-2xl text-sm font-semibold transition-all duration-500 hover:scale-110 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 backdrop-blur-xl border border-orange-400/20 bg-size-200 hover:bg-pos-100">
                  <span className="flex items-center space-x-3">
                    <span>Join Our Network</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                </button>
                
                <button className="group backdrop-blur-xl bg-black/40 border border-orange-500/30 text-white hover:bg-black/60 hover:border-orange-500/50 px-8 py-2 rounded-2xl text-sm font-semibold transition-all duration-500 hover:scale-110">
                  <span className="flex items-center space-x-3">
                    <span>Download App</span>
                    <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                </button>
              </div>
              
              {/* Enhanced Stats Cards with Black & Orange */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Phone, title: "24/7 Emergency", subtitle: "1-800-BRIDGE-1", color: "from-orange-500 to-orange-900" },
                  { icon: MapPin, title: "Nationwide Coverage", subtitle: "50+ cities", color: "from-orange-400 to-orange-800" },
                  { icon: Heart, title: "Certified Care", subtitle: "Licensed & Insured", color: "from-orange-600 to-orange-900" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group backdrop-blur-xl bg-black/40 rounded-3xl p-8 border border-orange-500/20 hover:bg-black/60 hover:border-orange-500/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br from-orange-400/20 to-transparent blur-xl transition-all duration-500 group-hover:scale-150"></div>
                    
                    <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-md font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CSS Animations with 3D Effects */}
      <style jsx>{`
        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -30px) rotate(90deg); }
          50% { transform: translate(0, -60px) rotate(180deg); }
          75% { transform: translate(-30px, -30px) rotate(270deg); }
        }
        @keyframes orb-float-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-40px, 40px) rotate(-90deg); }
          50% { transform: translate(0, 80px) rotate(-180deg); }
          75% { transform: translate(40px, 40px) rotate(-270deg); }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.3; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.6; }
        }
        @keyframes mesh-drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(100px, 100px); }
        }
        @keyframes particle-0 {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.7; }
          50% { transform: translateY(-100px) translateX(50px) scale(1.5); opacity: 1; }
        }
        @keyframes particle-1 {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(-80px) translateX(-30px) scale(1.2); opacity: 1; }
        }
        @keyframes particle-2 {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.8; }
          50% { transform: translateY(-120px) translateX(20px) scale(1.3); opacity: 1; }
        }
        @keyframes particle-3 {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.5; }
          50% { transform: translateY(-90px) translateX(-50px) scale(1.4); opacity: 1; }
        }
        @keyframes ember-rise {
          0% { transform: translateY(0px) scale(1); opacity: 1; }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(255,165,0,0.5); }
          50% { box-shadow: 0 0 60px rgba(255,165,0,0.8), 0 0 100px rgba(255,165,0,0.3); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 20; }
        }
        
        .animate-orb-float { animation: orb-float 20s ease-in-out infinite; }
        .animate-orb-float-delayed { animation: orb-float-delayed 25s ease-in-out infinite 5s; }
        .animate-orb-pulse { animation: orb-pulse 15s ease-in-out infinite; }
        .animate-mesh-drift { animation: mesh-drift 20s linear infinite; }
        .animate-particle-0 { animation: particle-0 6s ease-in-out infinite; }
        .animate-particle-1 { animation: particle-1 7s ease-in-out infinite; }
        .animate-particle-2 { animation: particle-2 8s ease-in-out infinite; }
        .animate-particle-3 { animation: particle-3 9s ease-in-out infinite; }
        .animate-ember-rise { animation: ember-rise 8s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        .animate-gradient { animation: gradient 3s ease infinite; background-size: 200% 200%; }
        .animate-spin-slow { animation: spin-slow 4s linear infinite; }
        .animate-flow { animation: flow 1s linear infinite; }
        
        .bg-size-200 { background-size: 200% 100%; }
        .bg-pos-100 { background-position: 100% 0; }
        .perspective-1000 { perspective: 1000px; }
        .perspective-2000 { perspective: 2000px; }
        .transform-3d { transform-style: preserve-3d; }
        .rotateY-180 { transform: rotateY(180deg); }
        .rotateY-12 { transform: rotateY(12deg); }
        .rotateY-8 { transform: rotateY(8deg); }
        .rotateY-6 { transform: rotateY(6deg); }
        .rotateY-4 { transform: rotateY(4deg); }
        .rotateX-12 { transform: rotateX(12deg); }
        .rotateX-6 { transform: rotateX(6deg); }
        .rotateX-4 { transform: rotateX(4deg); }
        .rotateX-2 { transform: rotateX(2deg); }
        .rotateZ-12 { transform: rotateZ(12deg); }
        .translateZ-4 { transform: translateZ(4px); }
        
        /* 3D Hover Effects */
        .hover\\:rotateY-180:hover { transform: rotateY(180deg); }
        .hover\\:rotateY-12:hover { transform: rotateY(12deg); }
        .hover\\:rotateY-6:hover { transform: rotateY(6deg); }
        .hover\\:rotateY-4:hover { transform: rotateY(4deg); }
        .hover\\:rotateY-2:hover { transform: rotateY(2deg); }
        .hover\\:rotateX-12:hover { transform: rotateX(12deg); }
        .hover\\:rotateX-6:hover { transform: rotateX(6deg); }
        .hover\\:rotateX-4:hover { transform: rotateX(4deg); }
        .hover\\:rotateX-2:hover { transform: rotateX(2deg); }
        .hover\\:translateZ-4:hover { transform: translateZ(4px); }
        
        /* Enhanced 3D Transform combinations */
        .transform-3d-hover:hover {
          transform: rotateX(10deg) rotateY(10deg) translateZ(20px);
        }
        
        /* Custom 3D Card Effects */
        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }
        
        .card-3d:hover {
          transform: rotateX(15deg) rotateY(15deg) scale(1.05);
        }
        
        .card-3d::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255,165,0,0.1), rgba(255,140,0,0.05));
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.6s;
          transform: translateZ(-1px);
        }
        
        .card-3d:hover::before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

