# Quantum-Ready Knowledge Guard 2026

A comprehensive enterprise AI + cybersecurity platform with quantum-resistant encryption capabilities. This is a full-stack Next.js application that demonstrates AI-powered knowledge management, real-time anomaly detection, and secure data handling.

## 🚀 Features

### Core Capabilities
- **AI-Powered Knowledge Base**: Ingest and query enterprise knowledge with LLM integration
- **Quantum-Ready Encryption**: AHE/HEE encryption algorithms for data protection
- **Real-Time Anomaly Detection**: Security alerts and system monitoring
- **Interactive Dashboard**: Live metrics, visualizations, and status tracking
- **User Management**: Role-based access control (RBAC)
- **Portfolio-Ready**: QR code generation for demo sharing

### Technical Highlights
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **AI Integration**: z-ai-web-dev-sdk for LLM capabilities
- **Type-Safe**: Full TypeScript implementation
- **Responsive**: Mobile-first design with dark mode support

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── knowledge/         # Knowledge management APIs
│   │   │   ├── ingest/        # File upload and indexing
│   │   │   ├── query/         # AI-powered search
│   │   │   └── anomalies/     # Anomaly detection
│   │   ├── encrypt/           # Encryption endpoint
│   │   ├── decrypt/           # Decryption endpoint
│   │   ├── dashboard/         # Dashboard metrics
│   │   │   ├── overview/      # Summary metrics
│   │   │   └── 3d-visual/     # Visualization data
│   │   ├── audit/             # Audit logs
│   │   └── user/              # User management
│   ├── page.tsx               # Main dashboard
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── db.ts                  # Prisma client
│   ├── utils.ts               # Utility functions
│   └── seed.ts                # Database seeding
└── hooks/                     # React hooks
```

## 🗄️ Database Schema

### Models
- **User**: User accounts with roles (admin, analyst, scientist, viewer)
- **KnowledgeEntry**: Encrypted knowledge base entries
- **AnomalyLog**: Security alerts and anomalies
- **EncryptionLog**: Encryption/decryption operation logs
- **QueryLog**: AI query history
- **AuditLog**: System audit trail

## 🔌 API Endpoints

### Knowledge Management
- `POST /api/knowledge/ingest` - Upload and index knowledge
- `GET /api/knowledge/ingest` - List all knowledge entries
- `GET /api/knowledge/query?q=` - AI-powered query
- `GET /api/knowledge/anomalies` - Get detected anomalies
- `POST /api/knowledge/anomalies` - Create anomaly alert

### Encryption/Security
- `POST /api/encrypt` - Encrypt data with AHE/HEE
- `POST /api/decrypt` - Decrypt data

### Dashboard
- `GET /api/dashboard/overview` - Dashboard metrics
- `GET /api/dashboard/3d-visual` - Visualization data

### Management
- `GET /api/audit/logs` - Audit log entries
- `GET /api/user` - List users
- `POST /api/user` - Create user
- `PATCH /api/user/[id]` - Update user

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- Bun or npm
- SQLite

### Installation

1. Install dependencies:
```bash
bun install
# or
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Initialize database:
```bash
bun run db:push
```

4. Seed sample data:
```bash
bun run src/lib/seed.ts
```

5. Start development server:
```bash
bun run dev
```

The application will be available at `http://localhost:3000`

## 🎯 Usage Guide

### 1. Dashboard
- View real-time metrics and system status
- Monitor knowledge entries, anomalies, and queries
- Track encryption operations

### 2. Knowledge Ingestion
- Upload documents (PDF, CSV, JSON, TXT)
- Files are automatically encrypted and indexed
- View processing status and results

### 3. AI Query
- Ask questions about your knowledge base
- Get AI-powered insights with confidence scores
- View query history and responses

### 4. Anomaly Detection
- Monitor security alerts in real-time
- View critical, warning, and info level anomalies
- Track source and timestamp of each alert

### 5. Encryption/Decryption
- Test AHE/HEE encryption algorithms
- Encrypt and decrypt data with quantum-resistant methods
- View encryption statistics

### 6. User Management
- View user accounts and roles
- Manage access permissions
- Track user activity

### 7. Share Demo
- Generate QR code for portfolio
- Share with recruiters and clients
- Demonstrate capabilities

## 🔐 Security Features

### Quantum-Ready Encryption
- **AHE (Advanced Homomorphic Encryption)**: Compute on encrypted data
- **HEE (Hybrid Elliptic Encryption)**: Quantum-resistant key exchange
- **Zero-Knowledge Proofs**: Verify without exposing content

### Data Protection
- All knowledge entries encrypted at rest
- Encrypted data transmission
- Comprehensive audit logging
- Role-based access control

## 📊 Monitoring & Analytics

### Real-Time Metrics
- CPU and memory usage
- Encryption load
- Query throughput
- Active anomalies

### Visualization
- Knowledge base distribution
- Anomaly trends
- Query patterns
- Encryption operations

## 🎨 UI/UX Features

### Design
- Modern, clean interface
- Responsive design (mobile-first)
- Dark mode support
- Smooth animations
- Accessible components

### Components
- shadcn/ui component library
- Lucide icons
- Real-time updates
- Loading states
- Error handling

## 🔧 Development

### Available Scripts
```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run start      # Start production server
bun run lint       # Run ESLint
bun run db:push    # Push schema to database
bun run db:generate # Generate Prisma client
```

### Code Quality
- ESLint for code linting
- TypeScript for type safety
- Prisma for database management
- Modular architecture

## 📈 Monetization Potential

### Pricing Models
- **Sandbox Deployment**: $1,000–$5,000 per client
- **Subscription**: $500–$2,000/month per client
- **Enterprise Custom**: Custom pricing

### Target Customers
- SMEs needing secure knowledge management
- Fintech startups with compliance requirements
- Tech divisions in mid-large enterprises
- Organizations with sensitive data

## 🎓 Portfolio Use

### For Recruiters
- Demonstrates full-stack development skills
- Shows AI integration capabilities
- Proves security expertise
- Live, interactive demo

### For Clients
- Ready-to-deploy solution
- Scalable architecture
- Enterprise-grade features
- Professional implementation

## 🚀 Deployment

### Production Checklist
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Set up SSL/TLS certificates
- [ ] Configure backup strategy
- [ ] Set up monitoring
- [ ] Configure CI/CD pipeline
- [ ] Performance optimization
- [ ] Security hardening

### Cloud Providers
- AWS (recommended)
- Azure
- DigitalOcean
- Google Cloud

## 📝 License

This project is a demonstration of full-stack development capabilities. Contact for licensing and deployment options.

## 🤝 Contributing

This is a portfolio project. For collaboration opportunities, please reach out directly.

## 📧 Contact

For demo access, collaboration, or licensing inquiries, please use the contact information provided in the portfolio.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
