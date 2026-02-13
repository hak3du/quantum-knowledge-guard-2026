import { db } from './db'

export async function seedData() {
  try {
    // Create sample users
    const users = [
      { email: 'admin@quantumguard.com', name: 'Admin User', role: 'admin', status: 'active' },
      { email: 'analyst@quantumguard.com', name: 'Security Analyst', role: 'analyst', status: 'active' },
      { email: 'scientist@quantumguard.com', name: 'Data Scientist', role: 'scientist', status: 'active' },
      { email: 'viewer@quantumguard.com', name: 'Viewer Only', role: 'viewer', status: 'active' },
    ]

    for (const user of users) {
      await db.user.upsert({
        where: { email: user.email },
        update: {},
        create: user,
      })
    }

    // Create sample knowledge entries
    const entries = [
      { title: 'Enterprise_Policies_2026.pdf', type: 'PDF', status: 'indexed', content: 'Enterprise security policies and guidelines...' },
      { title: 'Technical_Documentation.json', type: 'JSON', status: 'indexed', content: '{"version": "1.0", "docs": [...]}' },
      { title: 'Financial_Reports_Q1.csv', type: 'CSV', status: 'indexed', content: 'Q1,Revenue,Expenses\nJan,1000000,750000' },
      { title: 'Security_Guidelines.txt', type: 'TXT', status: 'indexed', content: 'Security guidelines and best practices...' },
      { title: 'API_Documentation.pdf', type: 'PDF', status: 'indexed', content: 'API documentation and endpoints...' },
    ]

    for (const entry of entries) {
      await db.knowledgeEntry.upsert({
        where: { id: entry.title },
        update: {},
        create: entry,
      })
    }

    // Create sample anomalies
    const anomalies = [
      { type: 'critical', message: 'Unauthorized access attempt detected from IP 192.168.1.100', source: 'Auth Gateway', severity: 9 },
      { type: 'warning', message: 'Unusual query pattern detected - 500+ requests in 1 minute', source: 'Query Engine', severity: 5 },
      { type: 'info', message: 'Scheduled encryption key rotation completed', source: 'Encryption Layer', severity: 1 },
      { type: 'warning', message: 'Knowledge base synchronization delayed', source: 'Sync Service', severity: 4 },
      { type: 'critical', message: 'Multiple failed login attempts detected', source: 'Auth Service', severity: 8 },
    ]

    for (const anomaly of anomalies) {
      await db.anomalyLog.create({
        data: anomaly,
      })
    }

    // Create sample query logs
    const queries = [
      { query: 'What are the enterprise security policies?', response: 'Based on the knowledge base, enterprise security policies include...', confidence: 94.7, resultCount: 5, processingTime: 234 },
      { query: 'Show me Q1 financial data', response: 'Q1 financial data shows revenue of $1M...', confidence: 92.3, resultCount: 3, processingTime: 189 },
      { query: 'How do I encrypt data using AHE?', response: 'To encrypt data using AHE/HEE algorithm...', confidence: 96.1, resultCount: 7, processingTime: 312 },
    ]

    for (const q of queries) {
      await db.queryLog.create({
        data: q,
      })
    }

    // Create sample encryption logs
    const encryptions = [
      { operation: 'encrypt', algorithm: 'AHE-HEE', dataSize: 1024, processingTime: 12, success: true },
      { operation: 'decrypt', algorithm: 'AHE-HEE', dataSize: 1024, processingTime: 8, success: true },
      { operation: 'encrypt', algorithm: 'AHE-HEE', dataSize: 2048, processingTime: 18, success: true },
      { operation: 'encrypt', algorithm: 'AHE-HEE', dataSize: 512, processingTime: 6, success: true },
    ]

    for (const enc of encryptions) {
      await db.encryptionLog.create({
        data: enc,
      })
    }

    console.log('✅ Sample data seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding data:', error)
  }
}

// Run if called directly
if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
