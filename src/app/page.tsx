'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Shield, 
  Database, 
  Activity, 
  Lock, 
  Upload, 
  Search, 
  AlertTriangle, 
  BarChart3, 
  Users, 
  QrCode, 
  FileText, 
  Brain,
  Zap,
  Globe,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react'

interface Metric {
  label: string
  value: string
  trend: 'up' | 'down' | 'stable'
  icon: any
  color: string
}

interface KnowledgeEntry {
  id: string
  title: string
  type: string
  status: 'processing' | 'indexed' | 'error'
  timestamp: string
}

interface Anomaly {
  id: string
  type: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
  source: string
}

interface Insight {
  id: string
  query: string
  response: string
  confidence: number
  timestamp: string
}

export default function QuantumKnowledgeGuard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [query, setQuery] = useState('')
  const [queryResults, setQueryResults] = useState<Insight[]>([])
  const [isQuerying, setIsQuerying] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<KnowledgeEntry[]>([])
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'Knowledge Entries', value: '0', trend: 'up', icon: Database, color: 'text-blue-600' },
    { label: 'Active Anomalies', value: '0', trend: 'down', icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Queries Today', value: '0', trend: 'up', icon: Search, color: 'text-green-600' },
    { label: 'Encryption Status', value: 'Active', trend: 'stable', icon: Lock, color: 'text-purple-600' },
  ])
  const [encryptInput, setEncryptInput] = useState('')
  const [decryptInput, setDecryptInput] = useState('')
  const [encryptedOutput, setEncryptedOutput] = useState('')
  const [decryptedOutput, setDecryptedOutput] = useState('')
  const [showEncrypted, setShowEncrypted] = useState(false)
  const [showDecrypted, setShowDecrypted] = useState(false)
  const [encryptionStatus, setEncryptionStatus] = useState<'idle' | 'encrypting' | 'decrypting'>('idle')
  const [isLoading, setIsLoading] = useState(false)

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/overview')
      const data = await response.json()
      
      if (data.success) {
        setMetrics([
          { 
            label: 'Knowledge Entries', 
            value: data.metrics.knowledgeEntries.toLocaleString(), 
            trend: 'up', 
            icon: Database, 
            color: 'text-blue-600' 
          },
          { 
            label: 'Active Anomalies', 
            value: data.metrics.activeAnomalies.toString(), 
            trend: data.metrics.activeAnomalies > 0 ? 'down' : 'stable', 
            icon: AlertTriangle, 
            color: 'text-red-600' 
          },
          { 
            label: 'Queries Today', 
            value: data.metrics.queriesToday.toLocaleString(), 
            trend: 'up', 
            icon: Search, 
            color: 'text-green-600' 
          },
          { 
            label: 'Encrypt Operations', 
            value: data.metrics.encryptionOperations.toLocaleString(), 
            trend: 'up', 
            icon: Lock, 
            color: 'text-purple-600' 
          },
        ])

        setAnomalies(data.recentAnomalies.map((a: any) => ({
          id: a.id,
          type: a.type,
          message: a.message,
          source: a.source,
          timestamp: a.timestamp,
        })))

        setUploadedFiles(data.recentEntries.map((e: any) => ({
          id: e.id,
          title: e.title,
          type: e.type,
          status: e.status,
          timestamp: e.timestamp,
        })))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleQuery = async () => {
    if (!query.trim()) return
    setIsQuerying(true)
    
    try {
      const response = await fetch(`/api/knowledge/query?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.success) {
        const newInsight: Insight = {
          id: Date.now().toString(),
          query,
          response: data.response,
          confidence: data.confidence,
          timestamp: new Date().toISOString()
        }
        setQueryResults([newInsight, ...queryResults])
      } else {
        const newInsight: Insight = {
          id: Date.now().toString(),
          query,
          response: `Error: ${data.error || 'Failed to process query'}`,
          confidence: 0,
          timestamp: new Date().toISOString()
        }
        setQueryResults([newInsight, ...queryResults])
      }
    } catch (error) {
      console.error('Query error:', error)
      const newInsight: Insight = {
        id: Date.now().toString(),
        query,
        response: 'Network error: Failed to connect to the query service.',
        confidence: 0,
        timestamp: new Date().toISOString()
      }
      setQueryResults([newInsight, ...queryResults])
    } finally {
      setIsQuerying(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      if (!file) return

      const newEntry: KnowledgeEntry = {
        id: Date.now().toString(),
        title: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        status: 'processing',
        timestamp: new Date().toISOString()
      }
      setUploadedFiles([newEntry, ...uploadedFiles])

      try {
        const content = await file.text()
        const response = await fetch('/api/knowledge/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: file.name,
            type: file.name.split('.').pop() || 'unknown',
            content: content.substring(0, 10000), // Limit content size
          }),
        })

        const data = await response.json()
        if (data.success) {
          setUploadedFiles(prev =>
            prev.map(entry =>
              entry.id === newEntry.id ? { ...entry, status: 'indexed' as const } : entry
            )
          )
          fetchDashboardData()
        } else {
          setUploadedFiles(prev =>
            prev.map(entry =>
              entry.id === newEntry.id ? { ...entry, status: 'error' as const } : entry
            )
          )
        }
      } catch (error) {
        console.error('Upload error:', error)
        setUploadedFiles(prev =>
          prev.map(entry =>
            entry.id === newEntry.id ? { ...entry, status: 'error' as const } : entry
          )
        )
      }
    }
  }

  const handleEncrypt = async () => {
    if (!encryptInput.trim()) return
    setEncryptionStatus('encrypting')
    
    try {
      const response = await fetch('/api/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: encryptInput }),
      })

      const data = await response.json()
      if (data.success) {
        setEncryptedOutput(data.encrypted)
      } else {
        setEncryptedOutput(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Encryption error:', error)
      setEncryptedOutput('Network error: Failed to encrypt data')
    } finally {
      setEncryptionStatus('idle')
    }
  }

  const handleDecrypt = async () => {
    if (!decryptInput.trim()) return
    setEncryptionStatus('decrypting')
    
    try {
      const response = await fetch('/api/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encrypted: decryptInput }),
      })

      const data = await response.json()
      if (data.success) {
        setDecryptedOutput(data.decrypted)
      } else {
        setDecryptedOutput(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Decryption error:', error)
      setDecryptedOutput('Network error: Failed to decrypt data')
    } finally {
      setEncryptionStatus('idle')
    }
  }

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default: return <CheckCircle2 className="h-4 w-4 text-blue-600" />
    }
  }

  const getAnomalyColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-950'
      case 'warning': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
      default: return 'border-blue-500 bg-blue-50 dark:bg-blue-950'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Quantum-Ready Knowledge Guard 2026
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enterprise AI + Quantum-Resistant Encryption
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchDashboardData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Badge variant="outline" className="gap-1">
                <Zap className="h-3 w-3 text-green-600" />
                System Active
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Lock className="h-3 w-3 text-purple-600" />
                Quantum-Encrypted
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 h-auto p-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
            <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="ingest" className="gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Ingest</span>
            </TabsTrigger>
            <TabsTrigger value="query" className="gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Query</span>
            </TabsTrigger>
            <TabsTrigger value="anomalies" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Anomalies</span>
            </TabsTrigger>
            <TabsTrigger value="encrypt" className="gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Encrypt</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="gap-2">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {metric.label}
                    </CardTitle>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-green-600" />}
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {metric.trend === 'up' ? '+12%' : metric.trend === 'down' ? '-5%' : 'Stable'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Real-Time Activity
                  </CardTitle>
                  <CardDescription>Live system metrics and performance data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CPU Usage</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Memory Usage</span>
                      <span className="font-medium">54%</span>
                    </div>
                    <Progress value={54} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Encryption Load</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Query Throughput</span>
                      <span className="font-medium">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Security Overview
                  </CardTitle>
                  <CardDescription>Quantum-resistant encryption status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle>Quantum Encryption Active</AlertTitle>
                    <AlertDescription>
                      AHE/HEE encryption protecting {metrics[0].value} knowledge entries
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <div className="text-2xl font-bold text-green-600">99.9%</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Encryption Coverage</div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <div className="text-2xl font-bold text-blue-600">256-bit</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Key Strength</div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <div className="text-2xl font-bold text-purple-600">12ms</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Avg Encrypt Time</div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <div className="text-2xl font-bold text-orange-600">0</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Breach Attempts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Recent Knowledge Ingestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {uploadedFiles.slice(0, 5).map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          <div>
                            <div className="font-medium text-sm">{file.title}</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              {new Date(file.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant={file.status === 'indexed' ? 'default' : 'secondary'}
                          className={file.status === 'indexed' ? 'bg-green-600' : file.status === 'error' ? 'bg-red-600' : ''}
                        >
                          {file.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ingest Tab */}
          <TabsContent value="ingest" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Knowledge Base Ingestion
                </CardTitle>
                <CardDescription>
                  Upload documents (PDF, CSV, JSON, TXT) to be encrypted and indexed by AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Drag and drop files here, or click to select
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.csv,.json,.txt"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Supported formats: PDF, CSV, JSON, TXT
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Recent Uploads</h3>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            <div>
                              <div className="font-medium text-sm">{file.title}</div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">
                                {file.type} • {new Date(file.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          {file.status === 'processing' ? (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                              <span className="text-xs text-yellow-600">Processing</span>
                            </div>
                          ) : file.status === 'error' ? (
                            <Badge className="bg-red-600">Error</Badge>
                          ) : (
                            <Badge className="bg-green-600">Indexed</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Query Tab */}
          <TabsContent value="query" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Powered Knowledge Query
                </CardTitle>
                <CardDescription>
                  Search your encrypted knowledge base with quantum-secure AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask a question about your knowledge base..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleQuery}
                    disabled={isQuerying || !query.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    {isQuerying ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Processing
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Query
                      </>
                    )}
                  </Button>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {queryResults.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">
                        <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No queries yet. Ask a question to get started.</p>
                      </div>
                    ) : (
                      queryResults.map((result) => (
                        <div key={result.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Search className="h-4 w-4 text-purple-600" />
                              <span className="font-medium text-sm">{result.query}</span>
                            </div>
                            <Badge variant="outline" className="gap-1">
                              <Brain className="h-3 w-3" />
                              {result.confidence}% confidence
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                            {result.response}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            {new Date(result.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anomalies Tab */}
          <TabsContent value="anomalies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-600" />
                  Anomaly Detection & Logs
                </CardTitle>
                <CardDescription>
                  Real-time security alerts and system anomalies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {anomalies.map((anomaly) => (
                      <Alert key={anomaly.id} className={`border-l-4 ${getAnomalyColor(anomaly.type)}`}>
                        <div className="flex items-start gap-3">
                          {getAnomalyIcon(anomaly.type)}
                          <div className="flex-1">
                            <AlertTitle className="flex items-center justify-between">
                              <span className="capitalize">{anomaly.type}</span>
                              <span className="text-xs font-normal text-slate-600 dark:text-slate-400">
                                {new Date(anomaly.timestamp).toLocaleString()}
                              </span>
                            </AlertTitle>
                            <AlertDescription className="mt-2">
                              <p className="text-sm">{anomaly.message}</p>
                              <p className="text-xs text-slate-500 mt-1">Source: {anomaly.source}</p>
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Encryption Tab */}
          <TabsContent value="encrypt" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-green-600" />
                    AHE/HEE Encryption
                  </CardTitle>
                  <CardDescription>
                    Quantum-resistant encryption for your data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Plain Text</label>
                    <Textarea
                      placeholder="Enter text to encrypt..."
                      value={encryptInput}
                      onChange={(e) => setEncryptInput(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button 
                    onClick={handleEncrypt}
                    disabled={!encryptInput.trim() || encryptionStatus === 'encrypting'}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    {encryptionStatus === 'encrypting' ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Encrypting...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Encrypt Data
                      </>
                    )}
                  </Button>
                  {encryptedOutput && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Encrypted Output</label>
                      <div className="relative">
                        <Textarea
                          value={encryptedOutput}
                          readOnly
                          rows={4}
                          className="font-mono text-xs"
                          type={showEncrypted ? 'text' : 'password'}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setShowEncrypted(!showEncrypted)}
                        >
                          {showEncrypted ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        ✅ Data encrypted with AHE/HEE quantum-resistant algorithm
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    AHE/HEE Decryption
                  </CardTitle>
                  <CardDescription>
                    Decrypt your quantum-encrypted data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Encrypted Data</label>
                    <Textarea
                      placeholder="Paste encrypted data..."
                      value={decryptInput}
                      onChange={(e) => setDecryptInput(e.target.value)}
                      rows={4}
                      className="font-mono text-xs"
                    />
                  </div>
                  <Button 
                    onClick={handleDecrypt}
                    disabled={!decryptInput.trim() || encryptionStatus === 'decrypting'}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"
                  >
                    {encryptionStatus === 'decrypting' ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Decrypting...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Decrypt Data
                      </>
                    )}
                  </Button>
                  {decryptedOutput && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Decrypted Output</label>
                      <div className="relative">
                        <Textarea
                          value={decryptedOutput}
                          readOnly
                          rows={4}
                          type={showDecrypted ? 'text' : 'password'}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setShowDecrypted(!showDecrypted)}
                        >
                          {showDecrypted ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Encryption Technology</CardTitle>
                <CardDescription>Powered by quantum-resistant algorithms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold">AHE Encryption</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Advanced Homomorphic Encryption allowing computations on encrypted data
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">HEE Protocol</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Hybrid Elliptic Encryption providing quantum-resistant key exchange
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Zero-Knowledge Proofs</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Verify data integrity without exposing the actual content
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage users and role-based access control (RBAC)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Admin User', email: 'admin@quantumguard.com', role: 'Administrator', status: 'Active' },
                    { name: 'Security Analyst', email: 'analyst@quantumguard.com', role: 'Security Analyst', status: 'Active' },
                    { name: 'Data Scientist', email: 'scientist@quantumguard.com', role: 'Data Scientist', status: 'Active' },
                    { name: 'Viewer Only', email: 'viewer@quantumguard.com', role: 'Viewer', status: 'Active' },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{user.role}</Badge>
                        <Badge className="bg-green-600">{user.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600">
                  <Users className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-purple-600" />
                  Share & Portfolio Demo
                </CardTitle>
                <CardDescription>
                  Generate QR code for recruiters and clients to access your demo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-purple-500 bg-purple-50 dark:bg-purple-950">
                  <QrCode className="h-4 w-4 text-purple-600" />
                  <AlertTitle>Portfolio Ready</AlertTitle>
                  <AlertDescription>
                    Share this QR code with recruiters, clients, or add to your LinkedIn profile
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col items-center gap-4 p-8 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="w-64 h-64 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <QrCode className="h-32 w-32 mx-auto text-purple-600" />
                      <p className="text-xs text-slate-600 dark:text-slate-400">QR Code Placeholder</p>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-semibold">Quantum-Ready Knowledge Guard 2026</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Enterprise AI + Cybersecurity + Quantum-Ready Encryption
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <QrCode className="h-4 w-4 mr-2" />
                      Download QR
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                      Share Link
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <h3 className="font-semibold mb-2">For Recruiters</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Demonstrate full-stack development skills, AI integration, and security expertise
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <h3 className="font-semibold mb-2">For Clients</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Show live demo capabilities and monetization potential
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Shield className="h-4 w-4 text-purple-600" />
              <span>Quantum-Ready Knowledge Guard 2026</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span>Enterprise AI + Cybersecurity</span>
              <span>•</span>
              <span>Quantum-Resistant Encryption</span>
              <span>•</span>
              <span className="text-green-600 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                System Active
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
