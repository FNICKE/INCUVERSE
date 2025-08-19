import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Zap, Lock, Users, CheckCircle, ArrowRight, Star, Globe, Database, Cpu } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "AI-Powered Validation",
      description: "Advanced machine learning algorithms for instant document verification and fraud detection."
    },
    {
      icon: <Lock className="h-8 w-8 text-green-400" />,
      title: "Bank-Grade Security",
      description: "End-to-end encryption and compliance with international security standards."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-400" />,
      title: "Multi-Role Access",
      description: "Separate dashboards for customers and administrators with role-based permissions."
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-400" />,
      title: "Global Compliance",
      description: "GDPR, KYC/AML, and international regulatory compliance built-in."
    }
  ];

  const benefits = [
    "Reduce manual review time by 70%",
    "Speed up customer onboarding by 5x",
    "99.9% accuracy in document verification",
    "24/7 automated processing",
    "Real-time fraud detection",
    "Seamless API integration"
  ];

  const stats = [
    { label: "Documents Processed", value: "2.5M+", icon: <Database className="h-6 w-6" /> },
    { label: "Fraud Cases Detected", value: "15K+", icon: <Shield className="h-6 w-6" /> },
    { label: "Processing Speed", value: "3 sec", icon: <Cpu className="h-6 w-6" /> },
    { label: "Accuracy Rate", value: "99.9%", icon: <Star className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
                <Shield className="h-16 w-16 text-purple-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Next-Gen <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">KYC Automation</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Revolutionize your identity verification process with AI-powered KYC automation. 
              Secure, fast, and compliant identity verification for the digital age.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : '/kyc-portal'}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Go to Dashboard
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Get Started Free
                    <ArrowRight className="inline-block ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/20 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to automate and secure your KYC process
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Transform your KYC process with cutting-edge technology and see immediate results.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 backdrop-blur-lg border border-white/20">
                <div className="text-center">
                  <Shield className="h-24 w-24 text-purple-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Start?</h3>
                  <p className="text-gray-300 mb-6">
                    Join thousands of companies already using our platform
                  </p>
                  {!user && (
                    <Link
                      to="/register"
                      className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-300"
                    >
                      Start Free Trial
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};