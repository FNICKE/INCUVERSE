import React, { useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Download,
  Mic,
  MicOff,
  Bot,
  Zap,
  Shield,
  Brain,
  MessageSquare,
  Code,
  Users,
  Lightbulb
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'passport' | 'id_card' | 'address_proof' | 'bank_statement';
  status: 'pending' | 'processing' | 'verified' | 'rejected';
  uploadDate: string;
  aiValidation?: {
    confidence: number;
    extractedData: Record<string, any>;
    fraudScore: number;
    issues: string[];
  };
}

interface AIAssistant {
  isActive: boolean;
  isListening: boolean;
  suggestions: string[];
  codeAnalysis?: {
    quality: number;
    issues: string[];
    suggestions: string[];
  };
}

export const KYCPortal: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [aiAssistant, setAiAssistant] = useState<AIAssistant>({
    isActive: false,
    isListening: false,
    suggestions: []
  });
  const [activeTab, setActiveTab] = useState<'upload' | 'status' | 'ai-tools' | 'voice-agent' | 'innovation'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Simulate AI document validation
  const simulateAIValidation = (file: File): Promise<Document['aiValidation']> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const confidence = Math.random() * 0.3 + 0.7; // 70-100%
        const fraudScore = Math.random() * 0.3; // 0-30%
        
        resolve({
          confidence,
          fraudScore,
          extractedData: {
            name: user?.name || 'John Doe',
            documentNumber: `ID${Math.random().toString().substr(2, 8)}`,
            expiryDate: '2028-12-31',
            issueDate: '2023-01-15'
          },
          issues: fraudScore > 0.2 ? ['Document quality could be improved', 'Minor inconsistency detected'] : []
        });
      }, 2000);
    });
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];

    // Create document entry
    const newDocument: Document = {
      id: `doc_${Date.now()}`,
      name: file.name,
      type: 'id_card', // Default type
      status: 'processing',
      uploadDate: new Date().toISOString()
    };

    setDocuments(prev => [...prev, newDocument]);

    try {
      // Simulate AI validation
      const aiValidation = await simulateAIValidation(file);
      
      // Update document with AI results
      setDocuments(prev => prev.map(doc => 
        doc.id === newDocument.id 
          ? { 
              ...doc, 
              status: aiValidation.fraudScore > 0.3 ? 'rejected' : 'verified',
              aiValidation 
            }
          : doc
      ));

      addNotification({
        type: aiValidation.fraudScore > 0.3 ? 'warning' : 'success',
        title: 'AI Validation Complete',
        message: `Document processed with ${Math.round(aiValidation.confidence * 100)}% confidence`
      });

    } catch (error) {
      setDocuments(prev => prev.map(doc => 
        doc.id === newDocument.id ? { ...doc, status: 'rejected' } : doc
      ));
      
      addNotification({
        type: 'error',
        title: 'Validation Failed',
        message: 'AI validation encountered an error'
      });
    } finally {
      setIsUploading(false);
    }
  }, [addNotification, user]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  // Voice agent functionality
  const toggleVoiceAgent = () => {
    setAiAssistant(prev => ({
      ...prev,
      isListening: !prev.isListening
    }));

    if (!aiAssistant.isListening) {
      addNotification({
        type: 'info',
        title: 'Voice Agent Activated',
        message: 'ASHA Worker assistant is now listening...'
      });
    }
  };

  // AI Co-pilot suggestions
  const generateAISuggestions = () => {
    const suggestions = [
      'Consider uploading a clearer image for better validation',
      'Add address proof document to complete verification',
      'Your document expires soon - consider renewal',
      'All required documents are uploaded successfully'
    ];
    
    setAiAssistant(prev => ({
      ...prev,
      suggestions: suggestions.slice(0, 2)
    }));
  };

  // Code quality analysis simulation
  const runCodeAnalysis = () => {
    setAiAssistant(prev => ({
      ...prev,
      codeAnalysis: {
        quality: 85,
        issues: [
          'Consider adding error boundaries',
          'Optimize image compression',
          'Add accessibility attributes'
        ],
        suggestions: [
          'Implement lazy loading for images',
          'Add unit tests for validation logic',
          'Use TypeScript strict mode'
        ]
      }
    }));

    addNotification({
      type: 'info',
      title: 'Code Analysis Complete',
      message: 'Quality score: 85/100 - See suggestions for improvements'
    });
  };

  const getStatusIcon = (status: Document['status']) => {
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

  const getStatusColor = (status: Document['status']) => {
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            AI-Powered KYC Portal
          </h1>
          <p className="text-gray-300">
            Advanced document validation with GenAI, voice assistance, and intelligent automation
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'upload', label: 'Document Upload', icon: <Upload className="h-4 w-4" /> },
            { id: 'status', label: 'Validation Status', icon: <Shield className="h-4 w-4" /> },
            { id: 'ai-tools', label: 'AI Tools', icon: <Brain className="h-4 w-4" /> },
            { id: 'voice-agent', label: 'Voice Agent', icon: <Mic className="h-4 w-4" /> },
            { id: 'innovation', label: 'Innovation Hub', icon: <Lightbulb className="h-4 w-4" /> }
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

        {/* Content based on active tab */}
        {activeTab === 'upload' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Area */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Upload className="h-6 w-6 mr-2 text-purple-400" />
                Document Upload
              </h2>
              
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-purple-400 bg-purple-500/10'
                    : 'border-gray-500 hover:border-purple-400 hover:bg-white/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-2">
                      Drag & drop your documents here
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      or click to browse files
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      <FileText className="h-4 w-4 inline mr-2" />
                      Browse Files
                    </button>
                    <button
                      onClick={() => {
                        // Camera functionality would be implemented here
                        addNotification({
                          type: 'info',
                          title: 'Camera Feature',
                          message: 'Camera capture will be available soon'
                        });
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200"
                    >
                      <Camera className="h-4 w-4 inline mr-2" />
                      Camera
                    </button>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileUpload(e.target.files)}
              />

              {isUploading && (
                <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                    <span className="text-blue-200">Processing with AI validation...</span>
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant Panel */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Bot className="h-6 w-6 mr-2 text-green-400" />
                AI Co-Pilot Assistant
              </h2>

              <div className="space-y-4">
                <button
                  onClick={generateAISuggestions}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                >
                  <Zap className="h-4 w-4 inline mr-2" />
                  Generate AI Suggestions
                </button>

                {aiAssistant.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-white font-medium">AI Recommendations:</h3>
                    {aiAssistant.suggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <p className="text-green-200 text-sm">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-white/20 pt-4">
                  <h3 className="text-white font-medium mb-3">Quick Actions:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={runCodeAnalysis}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200"
                    >
                      <Code className="h-4 w-4 inline mr-1" />
                      Code Analysis
                    </button>
                    <button
                      onClick={() => addNotification({
                        type: 'info',
                        title: 'Requirements Gathering',
                        message: 'AI is analyzing your requirements...'
                      })}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200"
                    >
                      <MessageSquare className="h-4 w-4 inline mr-1" />
                      Requirements
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-blue-400" />
              Document Validation Status
            </h2>

            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No documents uploaded yet</p>
                <p className="text-gray-500 text-sm">Upload your first document to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(doc.status)}
                        <div>
                          <h3 className="text-white font-medium">{doc.name}</h3>
                          <p className="text-gray-400 text-sm">
                            Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {doc.aiValidation && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-3 bg-white/5 rounded-lg">
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">AI Confidence</p>
                          <p className="text-white font-bold text-lg">
                            {Math.round(doc.aiValidation.confidence * 100)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Fraud Score</p>
                          <p className={`font-bold text-lg ${
                            doc.aiValidation.fraudScore > 0.3 ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {Math.round(doc.aiValidation.fraudScore * 100)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Issues Found</p>
                          <p className="text-white font-bold text-lg">
                            {doc.aiValidation.issues.length}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai-tools' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Brain className="h-6 w-6 mr-2 text-purple-400" />
                GenAI Document Validation
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                  <h3 className="text-purple-200 font-medium mb-2">Advanced AI Features:</h3>
                  <ul className="text-purple-300 text-sm space-y-1">
                    <li>• OCR with 99.9% accuracy</li>
                    <li>• Fraud detection algorithms</li>
                    <li>• Cross-document validation</li>
                    <li>• Real-time processing</li>
                  </ul>
                </div>

                {aiAssistant.codeAnalysis && (
                  <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <h3 className="text-blue-200 font-medium mb-2">
                      Code Quality: {aiAssistant.codeAnalysis.quality}/100
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-blue-300 text-sm font-medium">Issues:</p>
                        {aiAssistant.codeAnalysis.issues.map((issue, index) => (
                          <p key={index} className="text-blue-200 text-xs">• {issue}</p>
                        ))}
                      </div>
                      <div>
                        <p className="text-blue-300 text-sm font-medium">Suggestions:</p>
                        {aiAssistant.codeAnalysis.suggestions.map((suggestion, index) => (
                          <p key={index} className="text-blue-200 text-xs">• {suggestion}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Code className="h-6 w-6 mr-2 text-green-400" />
                Build Process Analysis
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => {
                    addNotification({
                      type: 'info',
                      title: 'Build Analysis Started',
                      message: 'Analyzing build process and dependencies...'
                    });
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                >
                  Analyze Build Process
                </button>

                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <h3 className="text-green-200 font-medium mb-2">Build Metrics:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-green-300">Bundle Size:</p>
                      <p className="text-white font-mono">2.3 MB</p>
                    </div>
                    <div>
                      <p className="text-green-300">Build Time:</p>
                      <p className="text-white font-mono">45.2s</p>
                    </div>
                    <div>
                      <p className="text-green-300">Dependencies:</p>
                      <p className="text-white font-mono">127</p>
                    </div>
                    <div>
                      <p className="text-green-300">Performance:</p>
                      <p className="text-white font-mono">92/100</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'voice-agent' && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Mic className="h-6 w-6 mr-2 text-orange-400" />
              Voice Agent for ASHA Workers
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="text-center">
                  <button
                    onClick={toggleVoiceAgent}
                    className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                      aiAssistant.isListening
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg'
                    }`}
                  >
                    {aiAssistant.isListening ? (
                      <MicOff className="h-12 w-12 text-white" />
                    ) : (
                      <Mic className="h-12 w-12 text-white" />
                    )}
                  </button>
                  <p className="text-white mt-4 font-medium">
                    {aiAssistant.isListening ? 'Listening...' : 'Click to start voice assistance'}
                  </p>
                </div>

                <div className="p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                  <h3 className="text-orange-200 font-medium mb-2">Voice Commands:</h3>
                  <ul className="text-orange-300 text-sm space-y-1">
                    <li>• "Upload document"</li>
                    <li>• "Check status"</li>
                    <li>• "Help with verification"</li>
                    <li>• "Read document details"</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-medium">ASHA Worker Features:</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-white text-sm font-medium">Multi-language Support</h4>
                    <p className="text-gray-400 text-xs">Hindi, English, Regional languages</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-white text-sm font-medium">Offline Capability</h4>
                    <p className="text-gray-400 text-xs">Works in low-connectivity areas</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-white text-sm font-medium">Smart Guidance</h4>
                    <p className="text-gray-400 text-xs">Step-by-step document assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'innovation' && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Lightbulb className="h-6 w-6 mr-2 text-yellow-400" />
                Open Innovation Hub
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <Users className="h-8 w-8 text-yellow-400 mb-3" />
                  <h3 className="text-white font-medium mb-2">Community Contributions</h3>
                  <p className="text-yellow-200 text-sm">
                    Collaborate with developers worldwide to improve KYC processes
                  </p>
                </div>

                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <Code className="h-8 w-8 text-blue-400 mb-3" />
                  <h3 className="text-white font-medium mb-2">API Marketplace</h3>
                  <p className="text-blue-200 text-sm">
                    Access third-party validation services and AI models
                  </p>
                </div>

                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <Brain className="h-8 w-8 text-green-400 mb-3" />
                  <h3 className="text-white font-medium mb-2">AI Model Training</h3>
                  <p className="text-green-200 text-sm">
                    Contribute to and benefit from community-trained models
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Innovation Challenges</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <h4 className="text-purple-200 font-medium">Document Fraud Detection</h4>
                    <p className="text-purple-300 text-sm">Improve AI accuracy by 5%</p>
                    <span className="text-xs text-purple-400">Reward: $5,000</span>
                  </div>
                  <div className="p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
                    <h4 className="text-indigo-200 font-medium">Voice Recognition</h4>
                    <p className="text-indigo-300 text-sm">Multi-dialect support</p>
                    <span className="text-xs text-indigo-400">Reward: $3,000</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Research Partnerships</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-white text-sm font-medium">Academic Collaborations</h4>
                    <p className="text-gray-400 text-xs">Partner with universities for research</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-white text-sm font-medium">Industry Partnerships</h4>
                    <p className="text-gray-400 text-xs">Work with fintech and healthcare sectors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Preview Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Document Details</h3>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Document Name</p>
                    <p className="text-white">{selectedDocument.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedDocument.status)}`}>
                      {selectedDocument.status}
                    </span>
                  </div>
                </div>

                {selectedDocument.aiValidation && (
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h4 className="text-white font-medium mb-3">AI Validation Results</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-gray-400 text-sm">Extracted Data:</p>
                        <pre className="text-white text-xs bg-black/20 p-2 rounded mt-1">
                          {JSON.stringify(selectedDocument.aiValidation.extractedData, null, 2)}
                        </pre>
                      </div>
                      {selectedDocument.aiValidation.issues.length > 0 && (
                        <div>
                          <p className="text-gray-400 text-sm">Issues:</p>
                          <ul className="text-red-300 text-sm">
                            {selectedDocument.aiValidation.issues.map((issue, index) => (
                              <li key={index}>• {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};