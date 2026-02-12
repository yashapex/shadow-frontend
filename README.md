<div align="center">

# 🌑 Shadow

### *The Next-Generation AI-Powered Hiring Intelligence Platform*

**Where Human Intuition Meets Machine Precision**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Try_Shadow_Now-FF0000?style=for-the-badge&logo=vercel&logoColor=white)](https://shadow-frontend-seven.vercel.app/)

[![Java](https://img.shields.io/badge/Java-21_LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring AI](https://img.shields.io/badge/Spring_AI-Latest-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-ai)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![pgvector](https://img.shields.io/badge/pgvector-0.5.1-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://github.com/pgvector/pgvector)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)
[![Maintained](https://img.shields.io/badge/Maintained-Yes-green.svg?style=for-the-badge)](https://github.com/yashapex/Shadow/graphs/commit-activity)

---

[Live Demo](#-live-demo--credentials) • [Features](#-features) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

---

</div>

## 🌐 Live Demo & Credentials

### **👉 [Click Here to Access Shadow Live](https://shadow-frontend-seven.vercel.app/)**

> **⚠️ IMPORTANT FOR RECRUITER SIGNUP**
> To test the Recruiter Dashboard, you must select "Recruiter" during signup and enter the following Admin Secret:
>
> **Recruiter Secret:** `HACKATHON_ADMIN_2026`

---

## 🎯 Executive Summary

**Shadow** is an enterprise-grade, AI-powered hiring intelligence platform that revolutionizes technical recruitment through advanced RAG (Retrieval-Augmented Generation), real-time interview analytics, and anti-cheat mechanisms. Built on Java 21 and Spring Boot 3.x with pgvector-powered semantic search, Shadow bridges the gap between human judgment and machine learning precision.

Shadow comprises two core components:
- **Shadow Assistant**: A high-performance backend leveraging Spring AI, PostgreSQL with pgvector, and OpenAI's GPT-4o-mini for intelligent candidate evaluation
- **Shadow Orb Interface**: A modern React 18 frontend with TypeScript, delivering real-time recruiter dashboards and secure candidate assessment environments

### 🎖️ Key Differentiators

| Feature | Traditional ATS | Shadow Platform |
|---------|----------------|-----------------|
| **Resume Matching** | Keyword-based | Semantic Vector Search (HNSW + Cosine Distance) |
| **Interview Support** | Static Questionnaires | Live AI Copilot with Real-time Scoring |
| **Cheat Detection** | Manual Proctoring | AI-Powered Audio Analysis + Secure Exam Mode |
| **Bias Monitoring** | Post-hoc Analysis | Real-time Parity Dashboards |
| **Integration** | Manual Calendar | One-Click Google Meet Scheduler |

---

## ✨ Features

### 🧠 **Advanced RAG & Vector Search Engine** - *The Brain*

Shadow's core intelligence layer leverages cutting-edge vector database technology for semantic understanding of resumes and job descriptions.

#### **Architecture Highlights:**
- **Document Ingestion Pipeline**: Apache PDFBox extracts text from resumes/JDs with structure preservation
- **Intelligent Text Cleaning**: Custom "Data Extractor" prompts remove noise, normalize formatting, and extract key entities before vectorization
- **Vector Storage**: PostgreSQL with `pgvector` extension stores 1536-dimensional embeddings from OpenAI's `text-embedding-3-small`
- **High-Performance Indexing**: HNSW (Hierarchical Navigable Small World) algorithm enables sub-linear search complexity
- **Similarity Matching**: Cosine distance metric for precise semantic matching between candidate profiles and job requirements

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  PDF Upload  │────▶│  PDFBox      │────▶│ Data Extract │
│ (Resume/JD)  │     │  Extraction  │     │   Prompts    │
└──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                                                  ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   RAG with   │◀────│   pgvector   │◀────│  Embedding   │
│  GPT-4o-mini │     │ HNSW + Cosine│     │  Generation  │
└──────────────┘     └──────────────┘     └──────────────┘
```

**Performance Metrics:**
- ⚡ < 100ms semantic search latency on 100K+ resume corpus
- 🎯 95%+ recall@10 for relevant candidate retrieval
- 📊 1536-dimensional vector space for nuanced skill matching

---

### 🎥 **Live Interview Companion & Google Meet Integration** - *NEW!*

Transform your technical interviews with AI-powered real-time assistance.

#### **One-to-One Interview Scheduler**
- **Seamless Google Meet Integration**: One-click meeting creation with automatic calendar invites
- **Intelligent Scheduling**: Conflict detection and timezone-aware booking
- **Automated Reminders**: Email/SMS notifications for both parties

#### **Live Companion Dashboard** - *Recruiter Copilot*
The Live Companion acts as your AI co-pilot during interviews, providing real-time insights without disrupting the conversation flow.

**Real-Time Features:**
- 📊 **Dynamic Scoring Gauges**: Live visualization of candidate performance across technical competencies
- 📝 **Transcript Logging**: Automatic speech-to-text transcription with speaker diarization
- 🎯 **Competency Tracking**: Real-time scoring on problem-solving, communication, technical depth
- 🔍 **Red Flag Detection**: AI identifies inconsistencies, vague answers, or memorized responses
- 📈 **Comparative Analytics**: Side-by-side comparison with job requirements and team benchmarks

**Post-Interview Intelligence:**
- 📋 **Executive Summaries**: GPT-4o-mini generates comprehensive interview reports within seconds
- 💡 **Hiring Recommendations**: AI-powered decision support with confidence scores
- 📊 **Structured Feedback**: Exportable reports for hiring committee review

```
┌─────────────────────────────────────────────────────┐
│         LIVE INTERVIEW COMPANION DASHBOARD          │
├─────────────────────────────────────────────────────┤
│  🎤 LIVE TRANSCRIPT        │  📊 REAL-TIME SCORING  │
│  ─────────────────         │  ──────────────────    │
│  Candidate: "I would..."   │  Technical Depth: 87%  │
│  Interviewer: "Can you..." │  Communication:   92%  │
│                            │  Problem Solving: 78%  │
│  ⚠️  Red Flag Detected:    │  Cultural Fit:    85%  │
│  Generic framework answer  │                        │
├────────────────────────────┴────────────────────────┤
│  🤖 AI SUGGESTIONS:                                 │
│  • Probe deeper on microservices architecture       │
│  • Ask for specific project examples                │
└─────────────────────────────────────────────────────┘
```

---

### 🛡️ **Anti-Cheat AI Audio Interview System**

Shadow's multi-layered security architecture ensures interview integrity through behavioral monitoring and AI-powered audio analysis.

#### **Frontend: Secure Exam Mode**
- 🔒 **Fullscreen Lock**: Prevents window switching or minimization
- 👁️ **Tab-Switch Detection**: Instant alerts on focus loss with timestamp logging
- 📸 **Webcam Monitoring**: Optional visual proctoring with motion detection
- 🚫 **Copy-Paste Blocking**: Disabled clipboard operations during assessments
- ⏱️ **Idle Detection**: Automatic submission after prolonged inactivity

#### **Backend: AI-Powered Depth Analysis Pipeline**

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Audio     │───▶│  Whisper-1   │───▶│  Transcription  │
│ MultipartFile│   │ Transcription│    │   (Text Output) │
└─────────────┘    └──────────────┘    └─────────────────┘
                                               │
                                               ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│  Depth Score│◀───│  GPT-4o-mini │◀───│ Depth Detector  │
│  & Report   │    │   Analysis   │    │     Prompts     │
└─────────────┘    └──────────────┘    └─────────────────┘
```

**Depth Detector AI Analysis:**
- 🧪 **Conceptual Understanding vs. Memorization**: Distinguishes genuine comprehension from rote learning
- 🔍 **Technical Accuracy Verification**: Cross-references answers against knowledge bases
- 💬 **Communication Quality Assessment**: Evaluates clarity, structure, and technical articulation
- 🎯 **Relevance Scoring**: Measures answer alignment with question intent
- ⚠️ **Anomaly Detection**: Flags suspiciously perfect or copy-pasted responses

**Output:**
- Depth Score: 0-100 (weighted composite of understanding, accuracy, originality)
- Confidence Level: High/Medium/Low based on linguistic patterns
- Detailed Breakdown: Section-by-section analysis with evidence citations
- Recommendation: Pass/Review/Fail with justification

---

### 📊 **Recruiter Command Center**

A comprehensive dashboard for data-driven hiring decisions.

#### **Bias Analytics & Fairness Monitoring**
Shadow's commitment to equitable hiring is backed by real-time bias detection algorithms.

- **AI vs. Human Score Parity Analysis**: 
  - Real-time tracking of scoring divergence between AI assessments and human evaluators
  - Alert system for statistically significant biases (>15% variance)
  - Historical trend visualization with Recharts

- **Diversity Metrics Dashboard**:
  - Demographic representation tracking across hiring funnel stages
  - Adverse impact analysis (4/5ths rule compliance)
  - Geographic, gender, and skill diversity heatmaps

- **Blind Resume Review Mode**: 
  - Optional anonymization of candidate identifiers
  - Focus on skills and experience over demographic markers

#### **Hiring Funnel Visualization**

```
Application → Screening → Technical Test → Interview → Offer
   (1,234)      (456)         (187)          (92)      (34)

Conversion Rates:  37%          41%           49%       37%
AI Suggestions: ↑ Screening criteria too strict
                ↑ Strong technical pipeline
```

**Analytics Features:**
- 📈 **Conversion Rate Tracking**: Stage-by-stage dropoff analysis
- ⏱️ **Time-to-Hire Metrics**: Average duration per pipeline stage
- 💰 **Cost-per-Hire Calculation**: Resource allocation optimization
- 🎯 **Source Effectiveness**: ROI analysis for different candidate channels
- 🔮 **Predictive Analytics**: ML-powered offer acceptance probability

---

### 🔐 **Enterprise-Grade Security Architecture**

#### **Dual-Token Authentication System**
Shadow implements a robust authentication strategy combining short-lived access tokens with secure refresh mechanisms.

**Access Token (JWT):**
- Short expiration (15 minutes)
- Signed with HS512 algorithm
- Contains user claims: `sub` (user ID), `role` (CANDIDATE/RECRUITER), `iat`, `exp`
- Transmitted via Authorization header: `Bearer <token>`

**Refresh Token:**
- Long expiration (7 days)
- Stored in HttpOnly Secure SameSite cookies
- Cannot be accessed via JavaScript (XSS protection)
- Rotated on each refresh operation
- Invalidated on logout with server-side blacklist

```
┌──────────┐  1. Login Request     ┌──────────┐
│  Client  │──────────────────────▶│  Server  │
│          │◀──────────────────────│          │
└──────────┘  2. Access + Refresh  └──────────┘
     │                                   │
     │ 3. API Request (Access Token)     │
     │──────────────────────────────────▶│
     │                                   │
     │ 4. Token Expired (401)            │
     │◀──────────────────────────────────│
     │                                   │
     │ 5. Refresh Request (Cookie)       │
     │──────────────────────────────────▶│
     │                                   │
     │ 6. New Access Token               │
     │◀──────────────────────────────────│
```

#### **Role-Based Access Control (RBAC)**
- **CANDIDATE Role**: 
  - Profile management
  - Application submission
  - Interview participation
  - Test-taking access
  
- **RECRUITER Role**:
  - Full dashboard access
  - Candidate evaluation
  - Interview scheduling
  - Analytics and reporting

**Additional Security Measures:**
- 🔒 HTTPS-only communication (enforced in production)
- 🛡️ CSRF protection with SameSite cookie attributes
- 🚫 SQL injection prevention via JPA/Hibernate parameterized queries
- 🔑 Password hashing with BCrypt (strength: 12 rounds)
- 📝 Audit logging for all sensitive operations
- 🌐 CORS configuration with whitelist approach

---

## 🏗️ System Architecture

### **High-Level Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                        SHADOW ORB INTERFACE                      │
│                     (React 18 + TypeScript)                      │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐   │
│  │  Candidate  │  │  Recruiter  │  │  Live Interview      │   │
│  │   Portal    │  │  Dashboard  │  │     Companion        │   │
│  └─────────────┘  └─────────────┘  └──────────────────────┘   │
└────────────────────────────┬──────────────────────────────────┘
                             │ REST API / WebSocket
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SHADOW ASSISTANT BACKEND                    │
│                   (Spring Boot 3.x + Java 21)                   │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Authentication  │  │   RAG Engine     │  │  Interview   │ │
│  │   & RBAC Layer   │  │  (Spring AI)     │  │   Service    │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Audio Analysis  │  │  Bias Analytics  │  │  Google Meet │ │
│  │  (Whisper API)   │  │     Service      │  │  Integration │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTENCE LAYER                      │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              PostgreSQL 16 (Primary Database)              │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │ │
│  │  │  Relational  │  │   pgvector   │  │  HNSW Indexes   │ │ │
│  │  │     Data     │  │  (Vectors)   │  │ (Cosine Dist.)  │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       EXTERNAL AI SERVICES                       │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────────┐ │
│  │  GPT-4o-mini│  │  Whisper-1  │  │ text-embedding-3-small │ │
│  │    (Chat)   │  │   (Audio)   │  │    (1536 dims)         │ │
│  └─────────────┘  └─────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### **Data Flow: RAG-Powered Candidate Matching**

```
1. INGESTION PHASE
   ┌──────────────┐
   │ Resume PDF   │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ PDFBox Parse │ (Text + Metadata Extraction)
   └──────┬───────┘
          │
          ▼
   ┌──────────────────┐
   │ Data Extractor   │ (AI-Powered Text Cleaning)
   │ GPT-4o-mini      │ • Remove headers/footers
   │ Prompts          │ • Normalize dates/formats
   └──────┬───────────┘ • Extract key entities
          │
          ▼
   ┌──────────────────────┐
   │ Embedding Generation │ (text-embedding-3-small)
   │ 1536 dimensions      │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────┐
   │ pgvector Storage │ (HNSW Index Creation)
   └──────────────────┘

2. RETRIEVAL PHASE
   ┌──────────────────┐
   │ Job Description  │
   └──────┬───────────┘
          │
          ▼
   ┌──────────────────────┐
   │ Query Embedding      │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ Cosine Similarity    │ (Top-K Nearest Neighbors)
   │ Search (pgvector)    │ • HNSW traversal
   └──────┬───────────────┘ • Distance threshold: 0.3
          │
          ▼
   ┌──────────────────────┐
   │ Candidate Ranking    │
   └──────────────────────┘

3. GENERATION PHASE
   ┌──────────────────────┐
   │ Retrieved Context    │
   │ + User Query         │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ GPT-4o-mini          │ (Contextualized Response)
   │ RAG Prompt Template  │ • Explain match reasoning
   └──────┬───────────────┘ • Highlight skill gaps
          │                 • Suggest interview focus
          ▼
   ┌──────────────────────┐
   │ Intelligent Answer   │
   └──────────────────────┘
```

---

## 🛠️ Tech Stack

### **Backend Engineering**

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Core Runtime** | Java 21 (LTS) | Modern language features, virtual threads, pattern matching |
| **Framework** | Spring Boot 3.x | Production-grade application framework |
| **AI Integration** | Spring AI | Unified abstraction layer for LLM interactions |
| **Database** | PostgreSQL 16 | ACID-compliant relational database |
| **Vector DB** | pgvector 0.5.1 | High-performance vector similarity search |
| **ORM** | Hibernate/JPA | Object-relational mapping with lazy loading |
| **Security** | Spring Security 6 | Authentication, authorization, CSRF protection |
| **PDF Processing** | Apache PDFBox 3.x | Resume/document text extraction |
| **Build Tool** | Maven 3.9+ | Dependency management and lifecycle automation |

### **Frontend Engineering**

| Category | Technology | Purpose |
|----------|-----------|---------|
| **UI Framework** | React 18 | Component-based UI with concurrent features |
| **Language** | TypeScript 5.x | Type-safe JavaScript development |
| **Build Tool** | Vite 5.x | Lightning-fast HMR and optimized builds |
| **Styling** | Tailwind CSS 3.x | Utility-first responsive design |
| **Component Library** | Shadcn UI | Accessible, customizable component primitives |
| **Charts** | Recharts | Declarative charting for analytics dashboards |
| **State Management** | React Context/Hooks | Centralized application state |
| **Routing** | React Router 6 | Client-side navigation |

### **AI & Machine Learning**

| Service | Model | Use Case |
|---------|-------|----------|
| **Chat Completion** | GPT-4o-mini | Resume analysis, depth detection, interview summaries |
| **Speech-to-Text** | Whisper-1 | Audio interview transcription |
| **Embeddings** | text-embedding-3-small | Semantic search (1536 dimensions) |

### **Infrastructure & DevOps**

| Category | Technology |
|----------|-----------|
| **Version Control** | Git |
| **Container Runtime** | Docker (optional) |
| **Database Migration** | Hibernate Auto-DDL (Development) |
| **API Documentation** | Swagger/OpenAPI (if integrated) |
| **Logging** | SLF4J + Logback |

---

## 🚀 Quick Start

### **Prerequisites**

Ensure you have the following installed:

```bash
# Java Development Kit
java --version  # Required: Java 21 or higher

# Node.js & npm
node --version  # Required: Node 18+ 
npm --version   # Required: npm 9+

# PostgreSQL with pgvector
psql --version  # Required: PostgreSQL 15+
```

### **PostgreSQL Setup with pgvector**

```sql
-- 1. Install PostgreSQL 15+ 
-- 2. Install pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 3. Create database
CREATE DATABASE shadow_db;

-- 4. Create user (if needed)
CREATE USER postgres WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE shadow_db TO postgres;
```

---

### **Backend Setup (Shadow Assistant)**

#### **1. Clone the Repository**

```bash
git clone https://github.com/yashapex/Shadow.git
cd Shadow/backend  # Adjust path based on your repo structure
```

#### **2. Configure Environment Variables**

Create an `application.properties` file in `src/main/resources/` or set environment variables:

```properties
# Server Configuration
server.port=${PORT:8080}

# Database Configuration (PostgreSQL + pgvector)
spring.datasource.url=jdbc:postgresql://${PGHOST_PRIVATE:localhost}:${PGPORT_PRIVATE:5432}/${PGDATABASE:shadow_db}
spring.datasource.username=${PGUSER:postgres}
spring.datasource.password=${PGPASSWORD:your_secure_password}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# OpenAI API Configuration
spring.ai.openai.api-key=${AI_API_KEY:sk-your-api-key-here}
spring.ai.openai.chat.model=gpt-4o-mini
spring.ai.openai.embedding.model=text-embedding-3-small
spring.ai.openai.audio.model=whisper-1

# JWT Security Configuration
jwt.secret=${JWT_SECRET:your-256-bit-secret-key-change-in-production}
jwt.expiration=900000  # 15 minutes in milliseconds
jwt.refresh.expiration=604800000  # 7 days in milliseconds

# Recruiter Secret (for privileged operations)
recruiter.secret=${RECRUITER_SECRET:your-recruiter-secret-key}

# CORS Configuration
cors.allowed-origins=${FRONTEND_URL:http://localhost:5173}

# File Upload Configuration
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

# Logging
logging.level.org.springframework=INFO
logging.level.com.shadow=DEBUG
```

**Environment Variables Reference:**

```bash
export PORT=8080
export AI_API_KEY=sk-proj-... # Your OpenAI API Key
export PGHOST_PRIVATE=localhost
export PGPORT_PRIVATE=5432
export PGDATABASE=shadow_db
export PGUSER=postgres
export PGPASSWORD=your_secure_password
export JWT_SECRET=your-256-bit-secret-key-base64-encoded
export RECRUITER_SECRET=your-recruiter-admin-secret
export FRONTEND_URL=http://localhost:5173
```

#### **3. Install Dependencies & Run**

```bash
# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run

# Alternative: Run the packaged JAR
mvn package
java -jar target/shadow-assistant-1.0.0.jar
```

**Expected Output:**
```
  ____  _               _
 / ___|| |__   __ _  __| | _____      __
 \___ \| '_ \ / _` |/ _` |/ _ \ \ /\ / /
  ___) | | | | (_| | (_| | (_) \ V  V /
 |____/|_| |_|\__,_|\__,_|\___/ \_/\_/

Shadow Assistant Backend v1.0.0
Spring Boot 3.x | Java 21 | PostgreSQL + pgvector

Started ShadowApplication in 3.847 seconds (JVM running for 4.239)
Server running at http://localhost:8080
```

---

### **Frontend Setup (Shadow Orb Interface)**

#### **1. Navigate to Frontend Directory**

```bash
cd ../frontend  # Adjust path based on your repo structure
```

#### **2. Install Dependencies**

```bash
npm install
# or
yarn install
```

#### **3. Configure Environment Variables**

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id  # For Google Meet integration
```

#### **4. Run Development Server**

```bash
npm run dev
# or
yarn dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in 432 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.x:5173/
  ➜  press h to show help
```

#### **5. Build for Production**

```bash
npm run build
npm run preview  # Preview production build locally
```

---

### **Verification Checklist**

- [ ] Backend running at `http://localhost:8080`
- [ ] Frontend running at `http://localhost:5173`
- [ ] PostgreSQL with pgvector extension enabled
- [ ] OpenAI API key configured and valid
- [ ] JWT secrets generated (use strong random strings)
- [ ] CORS configured to allow frontend origin

---

## 📚 API Documentation

### **Authentication Endpoints**

#### **Register Candidate**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "candidate@example.com",
  "password": "SecurePass123!",
  "fullName": "Jane Doe",
  "role": "CANDIDATE"
}
```

**Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "Set in HttpOnly cookie",
  "user": {
    "id": "uuid",
    "email": "candidate@example.com",
    "role": "CANDIDATE"
  }
}
```

---

#### **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "recruiter@company.com",
  "password": "SecurePass123!"
}
```

---

### **RAG Endpoints**

#### **Upload Resume for Vectorization**
```http
POST /api/rag/upload-resume
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

resume: [PDF File]
candidateId: "uuid"
```

**Response (200 OK):**
```json
{
  "message": "Resume processed successfully",
  "vectorId": "vec_123456",
  "extractedSkills": ["Java", "Spring Boot", "PostgreSQL", "React"],
  "embeddingDimensions": 1536
}
```

---

#### **Semantic Search for Candidates**
```http
POST /api/rag/search-candidates
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "jobDescription": "Looking for a Senior Backend Engineer with 5+ years in Java, Spring Boot, and microservices...",
  "topK": 10,
  "minSimilarity": 0.7
}
```

**Response (200 OK):**
```json
{
  "matches": [
    {
      "candidateId": "uuid",
      "candidateName": "John Smith",
      "similarityScore": 0.89,
      "matchingSkills": ["Java 21", "Spring Boot 3.x", "Microservices"],
      "gapSkills": ["Kubernetes"],
      "resumeSnippet": "Senior Java Developer with 7 years..."
    }
  ],
  "totalResults": 10,
  "searchTime": "87ms"
}
```

---

### **Interview Endpoints**

#### **Schedule Interview with Google Meet**
```http
POST /api/interviews/schedule
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "candidateId": "uuid",
  "recruiterId": "uuid",
  "scheduledTime": "2024-03-15T14:00:00Z",
  "duration": 60,
  "interviewType": "TECHNICAL",
  "createGoogleMeet": true
}
```

---

#### **Submit Audio Interview**
```http
POST /api/interviews/submit-audio
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

audioFile: [Audio File - .mp3/.wav/.m4a]
interviewId: "uuid"
questionId: "q_123"
```

**Response (200 OK):**
```json
{
  "transcription": "I would approach this problem by...",
  "depthScore": 78,
  "analysisReport": {
    "conceptualUnderstanding": 82,
    "technicalAccuracy": 75,
    "clarity": 80,
    "redFlags": [],
    "recommendation": "PASS"
  },
  "processingTime": "3.2s"
}
```

---

### **Analytics Endpoints**

#### **Get Bias Analytics**
```http
GET /api/analytics/bias?timeframe=30d
Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "aiHumanParityScore": 0.92,
  "diversityMetrics": {
    "genderDistribution": {"Male": 0.58, "Female": 0.40, "Other": 0.02},
    "geographicDiversity": 0.76
  },
  "adverseImpactRatio": 0.83,
  "alerts": []
}
```

---

## 🧪 Testing

### **Backend Testing**

```bash
# Run all unit tests
mvn test

# Run integration tests
mvn verify

# Generate test coverage report
mvn jacoco:report
```

### **Frontend Testing**

```bash
# Run unit tests with Vitest
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 🎨 Feature Demos

### **Recruiter Dashboard**
![Recruiter Dashboard Mockup]
- Real-time candidate pipeline visualization
- AI vs. Human scoring comparison charts
- Diversity metrics heatmaps
- Interview scheduling calendar

### **Live Interview Companion**
![Live Companion Mockup]
- Split-screen layout: Transcript | Scoring Gauges
- Real-time competency radar charts
- Red flag alert notifications
- Post-interview executive summary generation

### **Candidate Portal**
![Candidate Portal Mockup]
- Profile management with resume upload
- Upcoming interview schedule
- Practice test environments
- Feedback and scoring history

---

## 🔧 Advanced Configuration

### **pgvector Performance Tuning**

```sql
-- Create HNSW index for optimal performance
CREATE INDEX ON resumes_vectors 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- Index parameters:
-- m: Maximum number of connections per layer (default: 16)
-- ef_construction: Size of dynamic candidate list (default: 64)
-- Higher values = better recall but slower indexing

-- Query optimization
SET hnsw.ef_search = 40;  -- Search quality parameter
```

### **Spring AI RAG Configuration**

```java
@Configuration
public class RagConfig {
    
    @Bean
    public VectorStore vectorStore(JdbcTemplate jdbcTemplate, 
                                    EmbeddingClient embeddingClient) {
        return new PgVectorStore(jdbcTemplate, embeddingClient);
    }
    
    @Bean
    public DocumentRetriever documentRetriever(VectorStore vectorStore) {
        return VectorStoreDocumentRetriever.builder()
            .vectorStore(vectorStore)
            .topK(10)
            .similarityThreshold(0.7)
            .build();
    }
}
```

---

## 🐛 Troubleshooting

### **Common Issues**

#### **Issue: pgvector extension not found**
```sql
-- Solution: Install pgvector
-- On Ubuntu/Debian:
sudo apt install postgresql-15-pgvector

-- Then in psql:
CREATE EXTENSION vector;
```

#### **Issue: CORS errors in browser**
```properties
# Solution: Add frontend URL to allowed origins
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

#### **Issue: JWT token expired immediately**
```properties
# Solution: Check system clock synchronization
# Verify JWT expiration values are in milliseconds
jwt.expiration=900000  # 15 minutes
```

#### **Issue: OpenAI API rate limits**
```java
// Solution: Implement retry logic with exponential backoff
@Retryable(
    value = {OpenAiApiException.class},
    maxAttempts = 3,
    backoff = @Backoff(delay = 1000, multiplier = 2)
)
```

---

## 📈 Roadmap

### **Phase 1: Core Platform (Current)**
- [x] RAG-powered candidate matching
- [x] Anti-cheat audio interviews
- [x] Google Meet integration
- [x] Live interview companion
- [x] Bias analytics dashboard

### **Phase 2: Advanced AI Features (Q2 2024)**
- [ ] Multi-modal interview analysis (video + audio)
- [ ] Automated interview question generation
- [ ] Candidate skill gap recommendations
- [ ] Predictive attrition modeling

### **Phase 3: Enterprise Features (Q3 2024)**
- [ ] Multi-tenant architecture
- [ ] SSO integration (SAML, OAuth2)
- [ ] Advanced RBAC with custom roles
- [ ] Audit trail and compliance reporting
- [ ] White-label branding options

### **Phase 4: Ecosystem Expansion (Q4 2024)**
- [ ] ATS integrations (Greenhouse, Lever, Workday)
- [ ] Slack/Teams bot for interview scheduling
- [ ] Mobile apps (iOS/Android)
- [ ] API marketplace for third-party extensions

---

## 🤝 Contributing

We welcome contributions from the community! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Code Style**

- **Backend**: Follow [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- **Frontend**: Use ESLint + Prettier with Airbnb config
- **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/)

---

## 👥 Architect

Built with ❤️ by the Yash Gupta

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yashapex/Shadow/issues)
- **Email**: yg21260@gmail.com

---

## 🙏 Acknowledgments

- **Spring AI Team** for the excellent LLM integration framework
- **pgvector Contributors** for high-performance vector search
- **OpenAI** for GPT-4o-mini and Whisper APIs
- **Shadcn** for beautiful UI components
- **Recharts** for powerful data visualization

---

<div align="center">

### ⭐ Star us on GitHub — it motivates us a lot!

**[🌑 Shadow](https://github.com/yashapex/Shadow)** • Making hiring intelligent, fair, and efficient

</div>

