import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { 
  Clock, 
  ArrowRight, 
  Smartphone, 
  Shield, 
  BarChart3,
  CheckCircle2,
  Zap,
  Bell,
  Activity,
  TrendingDown,
  UserCheck,
  Heart,
  Stethoscope,
  Users,
  Pill
} from 'lucide-react'

export default function HomePage() {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)
  const statsRef = useRef(null)
  
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' })
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: '-100px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const features = [
    {
      icon: Smartphone,
      title: 'Web & USSD Access',
      description:
        'Patients can join queues from smartphones or basic feature phones, without needing to stand in line.',
      gradient: 'from-indigo-500 to-indigo-600',
      hoverBg: 'from-indigo-50',
      badge: 'Omni-channel access',
      audience: 'Patients & clinics',
    },
    {
      icon: Clock,
      title: 'Real-Time Tracking',
      description:
        'Live positions and ETAs keep patients informed and help staff anticipate busy periods before they happen.',
      gradient: 'from-blue-500 to-blue-600',
      hoverBg: 'from-blue-50',
      badge: 'Live visibility',
      audience: 'Patients & staff',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description:
        'Automated SMS and in-app alerts reduce no-shows and free staff from manual phone calls and shouting names.',
      gradient: 'from-purple-500 to-purple-600',
      hoverBg: 'from-purple-50',
      badge: 'Engagement',
      audience: 'Patients',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description:
        'Queue lengths, wait times, and service throughput are visualized for data-driven staffing and planning.',
      gradient: 'from-green-500 to-green-600',
      hoverBg: 'from-green-50',
      badge: 'Operational insight',
      audience: 'Clinic admins',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description:
        'Role-based access control, encryption, and audit trails keep sensitive patient data protected by default.',
      gradient: 'from-red-500 to-red-600',
      hoverBg: 'from-red-50',
      badge: 'Compliance ready',
      audience: 'IT & management',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description:
        'A lightweight stack and optimized APIs ensure low latency even at peak hours in busy outpatient clinics.',
      gradient: 'from-yellow-500 to-yellow-600',
      hoverBg: 'from-yellow-50',
      badge: 'Performance',
      audience: 'All users',
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Join Queue',
      description: 'Patients can join a queue remotely via web interface or USSD code, selecting their preferred clinic and service.',
      icon: UserCheck,
    },
    {
      number: '02',
      title: 'Track Position',
      description: 'Monitor your real-time position in the queue with live updates and estimated time until your turn.',
      icon: Activity,
    },
    {
      number: '03',
      title: 'Get Notified',
      description: 'Receive automated notifications via SMS or in-app alerts when your turn is approaching.',
      icon: Bell,
    },
    {
      number: '04',
      title: 'Get Served',
      description: 'Arrive at the clinic when notified and receive prompt, efficient service from healthcare providers.',
      icon: Heart,
    },
  ]

  const stats = [
    { value: '70%', label: 'Reduction in Manual Coordination', icon: TrendingDown },
    { value: '90%', label: 'ETA Accuracy', icon: CheckCircle2 },
    { value: '95%', label: 'System Uptime', icon: Activity },
    { value: '80%', label: 'User Satisfaction', icon: Heart },
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex justify-between items-center h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MediQueue
              </span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <Link
                to="/auth/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
              animate={{
                x: [0, 50, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
          >
            {/* Hero copy */}
            <motion.div
              variants={itemVariants}
              className="w-full lg:w-1/2 text-center lg:text-left"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700 mb-4 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                Live queue transparency for modern clinics
              </div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight"
              >
                Transform how
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  patients wait
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-4 max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl text-gray-600 leading-relaxed"
              >
                Replace chaotic waiting rooms with a calm, digital queue. Patients join remotely, track their place,
                and arrive exactly when they are needed.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
              >
                <Link
                  to="/auth/register"
                  className="group inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/auth/login"
                  className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign In
                </Link>
              </motion.div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span>Up to 40% lower perceived wait time</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Smartphone className="w-3 h-3 text-indigo-600" />
                  </div>
                  <span>Web + USSD + SMS access</span>
                </div>
              </div>
            </motion.div>

            {/* Hero visual / 3D queue panel */}
            <motion.div
              variants={itemVariants}
              className="w-full lg:w-1/2 relative"
            >
              {/* Glow accents */}
              <div className="absolute -top-10 -left-6 w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-200/70 via-sky-200/70 to-purple-200/70 blur-3xl" />
              <div className="absolute -bottom-12 -right-10 w-40 h-40 rounded-3xl bg-gradient-to-br from-purple-300/60 to-pink-200/60 blur-3xl" />

              {/* Main queue card */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="relative bg-white/80 backdrop-blur-xl border border-indigo-100 rounded-3xl shadow-2xl p-6 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
                      Live Queue
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      CityCare Clinic
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                      Online
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                      <Users className="w-3 h-3 mr-1" />
                      18 in queue
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'Q-204', name: 'Grace M.', eta: '03 min', status: 'Now' },
                    { id: 'Q-205', name: 'Patient 205', eta: '11 min', status: 'Next' },
                    { id: 'Q-206', name: 'Patient 206', eta: '18 min', status: 'Waiting' },
                  ].map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between rounded-2xl border px-3 py-3 text-xs sm:text-sm ${
                        index === 0
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg'
                          : 'bg-white/80 border-indigo-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex flex-col items-center justify-center w-9 h-9 rounded-xl text-[11px] font-semibold ${
                            index === 0
                              ? 'bg-white/20 text-white'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          <span>{item.id}</span>
                        </div>
                        <div>
                          <p
                            className={`font-semibold ${
                              index === 0 ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {item.name}
                          </p>
                          <p
                            className={`text-[11px] ${
                              index === 0 ? 'text-indigo-100' : 'text-gray-500'
                            }`}
                          >
                            General consultation
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            index === 0 ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {item.eta}
                        </p>
                        <p
                          className={`text-[11px] ${
                            index === 0 ? 'text-indigo-100' : 'text-gray-500'
                          }`}
                        >
                          {item.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-[11px] sm:text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center">
                      <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Avg. wait</p>
                      <p className="text-gray-500">14 min today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Heart className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">No-shows</p>
                      <p className="text-gray-500">Down 32%</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating medical tile */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-8 left-3 sm:left-6 bg-white/90 backdrop-blur-xl border border-indigo-100 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 rotate-[-3deg]"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-gray-900">Doctor view</p>
                  <p className="text-gray-500">Next patients and ETAs at a glance</p>
                </div>
              </motion.div>

              {/* Floating USSD / SMS tile */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute -top-6 right-2 sm:right-8 bg-white/95 backdrop-blur-xl border border-indigo-100 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 rotate-3"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                  <Pill className="w-5 h-5" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-gray-900">USSD + SMS ready</p>
                  <p className="text-gray-500">Works on any phone, no data required</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200/30 to-transparent"
              style={{
                top: `${20 + i * 20}%`,
                opacity: 0.3,
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 20 + i * 2,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 bg-white relative overflow-hidden">
        {/* Background Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200/40 to-transparent"
              style={{
                top: `${15 + i * 25}%`,
                opacity: 0.4,
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage healthcare queues efficiently and improve patient experience
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                  }}
                  className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500 mb-1">
                        {feature.badge}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 font-medium">
                        {feature.audience}
                      </span>
                      <span className="inline-flex items-center gap-1 text-indigo-500 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        Built for healthcare
                      </span>
                    </div>
                  </div>
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.hoverBg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-24 bg-gradient-to-br from-gray-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, intuitive process to transform your healthcare experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-6xl font-bold text-gray-300">
                        {step.number}
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-indigo-400" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Proven Results
            </h2>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              Measurable improvements in healthcare queue management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-indigo-100 text-xs font-medium">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join clinics and patients who are already experiencing the benefits of modern queue management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/register"
                className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold">MediQueue</span>
              </div>
              <p className="text-gray-400">
                Transforming healthcare queue management with modern technology and user-centered design.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/auth/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/auth/register" className="hover:text-white transition-colors">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Web & USSD Access</li>
                <li>Real-Time Tracking</li>
                <li>Smart Notifications</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; 2025 MediQueue. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
