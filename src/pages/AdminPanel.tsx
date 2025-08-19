import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Search,
  Eye,
  MessageSquare,
  Bot,
  Code,
  Zap,
  Brain,
  Lightbulb,
  Settings,
  Shield,
  Globe,
  Database
} from 'lucide-react';

interface KYCApplication {
  id: string;
  userName: string;
  email: string;
  status: 'pending' | 'processing' | 'verified' | 'rejected';
  submissionDate: string;
  documents: number;
  aiScore: number;
  fraudRisk: 'low' | 'medium' | 'high';
  processingTime: number; // in minutes
}

interface Analytics {
  totalApplications: number;
  verifiedApplications: number;
  pendingApplications: number;
  rejectedApplications: number;
  averageProcessingTime: number;
  fraudDetectionRate: number;
  aiAccuracy: number;
}

interface AIInsight {
  type: 'trend' | 'anomaly' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
}

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applications' | 'analytics' | 'ai-insights' | 'code-quality' | 'innovation'>('dashboard');
  const [applications, setApplications] = useState<KYCApplication[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<KYCApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockApplications: KYCApplication[] = [
        {
          id: 'app_001',
          userName: 'John Doe',
          email: 'john@example.com',
          status: 'verified',
          submissionDate: '2025-01-15T10:30:00Z',
          documents: 3,
          aiScore: 95,
          fraudRisk: 'low',
          processingTime: 12
        },
        {
          id: 'app_002',
          userName: 'Jane Smith',
          email: 'jane@example.com',
          status: 'pending',
          submissionDate: '2025-01-15T14:20:00Z',
          documents: 2,
          aiScore: 78,
          fraudRisk: 'medium',
          processingTime: 0
        },
        {
          id: 'app_003',
          userName: 'Mike Johnson',
          email: 'mike@example.com',
          status: 'processing',
          submissionDate: '2025-01-15T16:45:00Z',
          documents: 4,
          aiScore: 88,
          fraudRisk: 'low',
          processingTime: 8
        },
        {
          id: 'app_004',
          userName: 'Sarah Wilson',
          email: 'sarah@example.com',
          status: 'rejected',
          submissionDate: '2025-01-14T09:15:00Z',
          documents: 2,
          aiScore: 45,
          fraudRisk: 'high',
          processingTime: 25
        }
      ];

      const mockAnalytics: Analytics = {
        totalApplications: 1247,
        verifiedApplications: 1089,
        pendingApplications: 89,
        rejectedApplications: 69,
        averageProcessingTime: 15.3,
        fraudDetectionRate: 12.5,
        aiAccuracy: 94.2
      };

      const mockInsights: AIInsight[] = [
        {
          type: 'trend',
          title: 'Processing Time Improvement',
          description: 'AI validation has reduced average processing time by 40% this month',
          impact: 'high',
          timestamp: '2025-01-15T12:00:00Z'
        },
        {
          type: 'anomaly',
          title: 'Unusual Document Pattern',
          description: 'Detected 15% increase in document quality issues from specific region',
          impact: 'medium',
          timestamp: '2025-01-15T10:30:00Z'
        },
        {
          type: 'recommendation',
          title: 'Model Optimization',
          description: 'Consider retraining fraud detection model with recent data',
          impact: 'high',
          timestamp: '2025-01-15T08:15:00Z'
        }
      ];

      setApplications(mockApplications);
      setAnalytics(mockAnalytics);
      setAiInsights(mockInsights);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const getStatusIcon = (status: KYCApplication['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-400 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: KYCApplication['status']) => {
    switch (status) {
      case 'verified':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'rejected':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'processing':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getRiskColor = (risk: KYCApplication['fraudRisk']) => {
    switch (risk) {
      case 'high':
        return 'text-red-400 bg-red-900/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/20';
      default:
        return 'text-green-400 bg-green-900/20';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (applicationId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: 'verified' as const } : app
    ));
    addNotification({
      type: 'success',
      title: 'Application Approved',
      message: 'KYC application has been successfully verified'
    });
  };

  const handleReject = (applicationId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: 'rejected' as const } : app
    ));
    addNotification({
      type: 'warning',
      title: 'Application Rejected',
      message: 'KYC application has been rejected'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            AI-Powered Admin Dashboard
          </h1>
          <p className="text-gray-300">
            Advanced KYC management with AI insights, code analysis, and innovation tools
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
            { id: 'applications', label: 'Applications', icon: <FileText className="h-4 w-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
            { id: 'ai-insights', label: 'AI Insights', icon: <Brain className="h-4 w-4" /> },
            { id: 'code-quality', label: 'Code Quality', icon: <Code className="h-4 w-4" /> },
            { id: 'innovation', label: 'Innovation', icon: <Lightbulb className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && analytics && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Applications</p>
                    <p className="text-2xl font-bold text-white">{analytics.totalApplications.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Verified</p>
                    <p className="text-2xl font-bold text-green-400">{analytics.verifiedApplications.toLocaleString()}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-yellow-400">{analytics.pendingApplications}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">AI Accuracy</p>
                    <p className="text-2xl font-bold text-purple-400">{analytics.aiAccuracy}%</p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Avg Processing Time</span>
                    <span className="text-white font-medium">{analytics.averageProcessingTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Fraud Detection Rate</span>
                    <span className="text-white font-medium">{analytics.fraudDetectionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Success Rate</span>
                    <span className="text-white font-medium">
                      {Math.round((analytics.verifiedApplications / analytics.totalApplications) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-400" />
                  Security Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Encryption Status</span>
                    <span className="text-green-400 font-medium">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Compliance Score</span>
                    <span className="text-white font-medium">98/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Data Integrity</span>
                    <span className="text-green-400 font-medium">Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent AI Insights */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-400" />
                Recent AI Insights
              </h3>
              <div className="space-y-3">
                {aiInsights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{insight.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        insight.impact === 'high' ? 'bg-red-900/20 text-red-400' :
                        insight.impact === 'medium' ? 'bg-yellow-900/20 text-yellow-400' :
                        'bg-green-900/20 text-green-400'
                      }`}>
                        {insight.impact} impact
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Applications Management */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                  <Download className="h-4 w-4 inline mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        AI Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Fraud Risk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">{app.userName}</div>
                            <div className="text-sm text-gray-400">{app.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(app.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{app.aiScore}/100</div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${app.aiScore}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(app.fraudRisk)}`}>
                            {app.fraudRisk}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(app.submissionDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedApplication(app)}
                              className="text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {app.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(app.id)}
                                  className="text-green-400 hover:text-green-300 transition-colors"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(app.id)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-blue-400" />
                  Application Status Distribution
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">Verified</span>
                    </div>
                    <span className="text-white font-medium">
                      {Math.round((analytics.verifiedApplications / analytics.totalApplications) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-300">Pending</span>
                    </div>
                    <span className="text-white font-medium">
                      {Math.round((analytics.pendingApplications / analytics.totalApplications) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span className="text-gray-300">Rejected</span>
                    </div>
                    <span className="text-white font-medium">
                      {Math.round((analytics.rejectedApplications / analytics.totalApplications) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
                  AI Performance Metrics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Accuracy</span>
                      <span className="text-white">{analytics.aiAccuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${analytics.aiAccuracy}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Fraud Detection</span>
                      <span className="text-white">{analytics.fraudDetectionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${analytics.fraudDetectionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                Processing Time Trends
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{analytics.averageProcessingTime} min</p>
                  <p className="text-gray-400 text-sm">Average Processing Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">-40%</p>
                  <p className="text-gray-400 text-sm">Improvement This Month</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">2.3 min</p>
                  <p className="text-gray-400 text-sm">Fastest Processing Time</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights */}
        {activeTab === 'ai-insights' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-400" />
                  GenAI Document Analysis
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <h4 className="text-purple-200 font-medium mb-2">Advanced Features:</h4>
                    <ul className="text-purple-300 text-sm space-y-1">
                      <li>• Multi-modal document understanding</li>
                      <li>• Cross-reference validation</li>
                      <li>• Anomaly detection algorithms</li>
                      <li>• Real-time fraud scoring</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => addNotification({
                      type: 'info',
                      title: 'AI Model Update',
                      message: 'Initiating model retraining with latest data...'
                    })}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    <Zap className="h-4 w-4 inline mr-2" />
                    Retrain AI Models
                  </button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-green-400" />
                  AI Requirements Gathering
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <h4 className="text-green-200 font-medium mb-2">Automated Analysis:</h4>
                    <ul className="text-green-300 text-sm space-y-1">
                      <li>• Business requirement extraction</li>
                      <li>• Compliance mapping</li>
                      <li>• Risk assessment automation</li>
                      <li>• Process optimization suggestions</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => addNotification({
                      type: 'success',
                      title: 'Requirements Analysis',
                      message: 'AI has identified 12 optimization opportunities'
                    })}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    <Bot className="h-4 w-4 inline mr-2" />
                    Analyze Requirements
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">AI Insights & Recommendations</h3>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {insight.type === 'trend' && <TrendingUp className="h-4 w-4 text-green-400" />}
                        {insight.type === 'anomaly' && <AlertTriangle className="h-4 w-4 text-yellow-400" />}
                        {insight.type === 'recommendation' && <Lightbulb className="h-4 w-4 text-blue-400" />}
                        <h4 className="text-white font-medium">{insight.title}</h4>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        insight.impact === 'high' ? 'bg-red-900/20 text-red-400' :
                        insight.impact === 'medium' ? 'bg-yellow-900/20 text-yellow-400' :
                        'bg-green-900/20 text-green-400'
                      }`}>
                        {insight.impact} impact
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{insight.description}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(insight.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Code Quality */}
        {activeTab === 'code-quality' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-400" />
                  Code Quality Analysis
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">92</p>
                      <p className="text-blue-200 text-sm">Quality Score</p>
                    </div>
                    <div className="text-center p-3 bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">98%</p>
                      <p className="text-green-200 text-sm">Test Coverage</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addNotification({
                      type: 'info',
                      title: 'Code Analysis Started',
                      message: 'Running comprehensive code quality analysis...'
                    })}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Run Full Analysis
                  </button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-orange-400" />
                  Build Process Analysis
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-orange-300">Build Time:</p>
                      <p className="text-white font-mono">2m 34s</p>
                    </div>
                    <div>
                      <p className="text-orange-300">Bundle Size:</p>
                      <p className="text-white font-mono">1.8 MB</p>
                    </div>
                    <div>
                      <p className="text-orange-300">Dependencies:</p>
                      <p className="text-white font-mono">156</p>
                    </div>
                    <div>
                      <p className="text-orange-300">Vulnerabilities:</p>
                      <p className="text-white font-mono">0</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addNotification({
                      type: 'success',
                      title: 'Build Optimized',
                      message: 'Build time reduced by 15% through optimization'
                    })}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Optimize Build
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Code Quality Metrics</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Maintainability</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Complexity</span>
                      <span className="text-green-400">Low</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Duplication</span>
                      <span className="text-yellow-400">2.1%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Documentation</span>
                      <span className="text-green-400">85%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Security</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Vulnerabilities</span>
                      <span className="text-green-400">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Code Smells</span>
                      <span className="text-yellow-400">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Security Rating</span>
                      <span className="text-green-400">A</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Load Time</span>
                      <span className="text-green-400">1.2s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Memory Usage</span>
                      <span className="text-green-400">45MB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Lighthouse Score</span>
                      <span className="text-green-400">94</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Innovation Hub */}
        {activeTab === 'innovation' && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                Open Innovation Platform
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <Globe className="h-8 w-8 text-yellow-400 mb-3" />
                  <h4 className="text-white font-medium mb-2">Global Collaboration</h4>
                  <p className="text-yellow-200 text-sm">
                    Connect with developers worldwide to enhance KYC solutions
                  </p>
                </div>
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <Database className="h-8 w-8 text-blue-400 mb-3" />
                  <h4 className="text-white font-medium mb-2">Data Marketplace</h4>
                  <p className="text-blue-200 text-sm">
                    Access anonymized datasets for AI model improvement
                  </p>
                </div>
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <Brain className="h-8 w-8 text-green-400 mb-3" />
                  <h4 className="text-white font-medium mb-2">AI Model Sharing</h4>
                  <p className="text-green-200 text-sm">
                    Share and improve AI models through community contributions
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Active Challenges</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <h5 className="text-purple-200 font-medium">Enhanced Fraud Detection</h5>
                    <p className="text-purple-300 text-sm">Improve detection accuracy by 10%</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-purple-400">23 participants</span>
                      <span className="text-xs text-purple-400">$10,000 reward</span>
                    </div>
                  </div>
                  <div className="p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
                    <h5 className="text-indigo-200 font-medium">Multi-language OCR</h5>
                    <p className="text-indigo-300 text-sm">Support for 50+ languages</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-indigo-400">15 participants</span>
                      <span className="text-xs text-indigo-400">$7,500 reward</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Research Partnerships</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h5 className="text-white text-sm font-medium">MIT AI Lab</h5>
                    <p className="text-gray-400 text-xs">Advanced document understanding research</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h5 className="text-white text-sm font-medium">Stanford NLP Group</h5>
                    <p className="text-gray-400 text-xs">Multi-modal AI for identity verification</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h5 className="text-white text-sm font-medium">Oxford Cybersecurity</h5>
                    <p className="text-gray-400 text-xs">Fraud detection and prevention</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Application Details</h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Applicant Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{selectedApplication.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{selectedApplication.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Submitted:</span>
                        <span className="text-white">
                          {new Date(selectedApplication.submissionDate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">Validation Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">AI Score:</span>
                        <span className="text-white">{selectedApplication.aiScore}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fraud Risk:</span>
                        <span className={`${
                          selectedApplication.fraudRisk === 'high' ? 'text-red-400' :
                          selectedApplication.fraudRisk === 'medium' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {selectedApplication.fraudRisk}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Documents:</span>
                        <span className="text-white">{selectedApplication.documents}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Processing Status</h4>
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(selectedApplication.status)}
                      <span className="text-white capitalize">{selectedApplication.status}</span>
                    </div>
                    {selectedApplication.processingTime > 0 && (
                      <p className="text-gray-400 text-sm">
                        Processing time: {selectedApplication.processingTime} minutes
                      </p>
                    )}
                  </div>

                  {selectedApplication.status === 'pending' && (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          handleApprove(selectedApplication.id);
                          setSelectedApplication(null);
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                      >
                        Approve Application
                      </button>
                      <button
                        onClick={() => {
                          handleReject(selectedApplication.id);
                          setSelectedApplication(null);
                        }}
                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                      >
                        Reject Application
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};