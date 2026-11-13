const categories = [
  {
    name: 'Software Development',
    slug: 'software-development',
    description: 'Best practices, software architecture, modern programming languages, design patterns, and engineering culture.',
    color: '#2563EB',
    icon: 'code'
  },
  {
    name: 'Artificial Intelligence & Machine Learning',
    slug: 'artificial-intelligence-machine-learning',
    description: 'LLMs, generative AI, deep learning models, neural networks, computer vision, and autonomous agent systems.',
    color: '#7C3AED',
    icon: 'cpu'
  },
  {
    name: 'Web & Mobile App Development',
    slug: 'web-mobile-app-development',
    description: 'Full-stack ecosystems, React, Next.js, Flutter, React Native, progressive web apps, and modern frontend tools.',
    color: '#059669',
    icon: 'smartphone'
  },
  {
    name: 'Technology & Innovation',
    slug: 'technology-innovation',
    description: 'Emerging tech frontiers, quantum computing, IoT breakthroughs, next-gen hardware, and visionary engineering.',
    color: '#D97706',
    icon: 'zap'
  },
  {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Zero Trust architecture, penetration testing, threat detection, cryptography, cloud security, and compliance.',
    color: '#DC2626',
    icon: 'shield-check'
  },
  {
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    description: 'Microservices, Kubernetes, AWS, Google Cloud, Azure, serverless architectures, and DevOps automation.',
    color: '#0284C7',
    icon: 'cloud'
  },
  {
    name: 'Industry Insights',
    slug: 'industry-insights',
    description: 'Tech business trends, digital transformation, executive perspectives, engineering leadership, and market shifts.',
    color: '#4F46E5',
    icon: 'trending-up'
  }
];

const posts = [
  {
    title: 'Building Resilient Microservices with Event-Driven Architecture in 2026',
    slug: 'building-resilient-microservices-event-driven-architecture',
    excerpt: 'Explore how distributed event streams, message buses, and dead-letter queues create fault-tolerant cloud backends capable of processing billions of events daily.',
    category: 'Cloud Computing',
    tags: ['Microservices', 'Kafka', 'Cloud Architecture', 'DevOps', 'Node.js'],
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    views: 1420,
    readingTime: 7,
    status: 'published',
    createdAt: new Date('2026-11-01T10:00:00Z'),
    author: {
      name: 'Dr. Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      bio: 'Principal Cloud Systems Architect and former distributed systems researcher.',
      role: 'Chief Architect'
    },
    seo: {
      metaTitle: 'Building Resilient Microservices with Event-Driven Architecture (2026)',
      metaDescription: 'A comprehensive engineering guide on event streaming, saga orchestrations, and circuit breakers in enterprise cloud systems.',
      metaKeywords: ['microservices', 'event driven', 'kafka', 'cloud computing', 'distributed systems']
    },
    content: `
### Introduction

In modern high-throughput environments, synchronous REST or gRPC request-reply chains can introduce severe cascading failures. When one downstream microservice experiences latency spikes or crashes, upstream callers exhaust thread pools and collapse like dominoes.

Event-driven architecture (EDA) decouples producers from consumers using immutable event logs, ensuring resilient, asynchronous processing across global scale.

### Core Architectural Pillars

1. **Decoupled Producers and Consumers**: Publishers emit state change events without knowing who processes them.
2. **Durability and Replayability**: Modern event brokers such as Apache Kafka and AWS Kinesis persist records on disk with configurable retention windows.
3. **The Outbox Pattern**: Solving dual-write problems between your relational database and event brokers.

Here is an example transactional outbox processor implemented in Node.js:

\`\`\`javascript
// Transactional Outbox Pattern in Node.js
async function createOrderWithOutbox(dbSession, orderData) {
  // Step 1: Save the business entity inside transaction
  const newOrder = await dbSession.orders.insert({
    ...orderData,
    status: 'PENDING',
    createdAt: new Date()
  });

  // Step 2: Write outbox event in the SAME transaction
  await dbSession.outboxEvents.insert({
    aggregateType: 'ORDER',
    aggregateId: newOrder.id,
    eventType: 'ORDER_CREATED',
    payload: JSON.stringify(newOrder),
    status: 'PENDING_DISPATCH',
    createdAt: new Date()
  });

  return newOrder;
}
\`\`\`

### Managing Failures with Dead Letter Queues (DLQ)

When consumers encounter corrupt payloads or unrecoverable exceptions, retrying infinitely blocks partition consumption. Implementing an exponential backoff with a Dead Letter Queue ensures unprocessable events are quarantined for forensic audit without stalling the entire pipeline.

> "True system resilience isn't about avoiding failure; it is about building software where partial failures are graceful and self-healing."

### Summary & Takeaways

- Decouple tight service-to-service dependencies with asynchronous message streams.
- Use the Transactional Outbox pattern to prevent data inconsistencies between DB state and events.
- Implement telemetry and distributed tracing (OpenTelemetry) across event headers to trace end-to-end event lifecycles.
`
  },
  {
    title: 'Autonomous AI Agents: From Reactive Prompts to Multi-Agent Workflows',
    slug: 'autonomous-ai-agents-reactive-prompts-multi-agent-workflows',
    excerpt: 'How agent swarms, memory stores, and tool calling are transforming generative AI from simple chatbots into autonomous software engineers and problem solvers.',
    category: 'Artificial Intelligence & Machine Learning',
    tags: ['AI Agents', 'LLMs', 'Machine Learning', 'Python', 'LangChain'],
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    views: 2890,
    readingTime: 6,
    status: 'published',
    createdAt: new Date('2026-11-04T14:30:00Z'),
    author: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'AI Research Lead specializing in reinforcement learning and collaborative autonomous agents.',
      role: 'Staff AI Researcher'
    },
    seo: {
      metaTitle: 'Autonomous AI Agents: Multi-Agent Workflows & Orchestration Guide',
      metaDescription: 'Discover how multi-agent architectures, episodic memory, and dynamic tool selection empower intelligent AI swarms.',
      metaKeywords: ['autonomous agents', 'artificial intelligence', 'multi-agent systems', 'llm reasoning']
    },
    content: `
### The Shift from Single Prompts to Autonomous Loops

The generative AI paradigm has rapidly advanced past zero-shot and few-shot prompting. Real-world business workflows require planning, environmental feedback loops, persistent memory, and the capability to execute real actions via API tools.

### Anatomy of an Autonomous Agent System

An autonomous agent is composed of four fundamental subsystems:
- **Perception & Planning**: Decomposing high-level user goals into structured sub-tasks with Tree-of-Thought (ToT) or ReAct reasoning.
- **Episodic & Semantic Memory**: Vector embeddings for long-term recall and contextual scratchpads for immediate execution state.
- **Tool Registry**: Dynamic schema definitions enabling agents to execute bash scripts, SQL queries, or web requests.
- **Reflection & Self-Correction**: Validating outputs against requirements and iterating on code failure errors.

\`\`\`python
# Example Agent ReAct Reasoning Loop
class ReActAgent:
    def __init__(self, model, tools):
        self.model = model
        self.tools = {tool.name: tool for tool in tools}

    def execute_turn(self, goal, history):
        prompt = self.build_reasoning_prompt(goal, history)
        thought, action, action_input = self.model.generate_thought_action(prompt)
        
        if action == "FINAL_ANSWER":
            return action_input
            
        tool = self.tools.get(action)
        observation = tool.run(action_input)
        return self.execute_turn(goal, history + [(thought, action, observation)])
\`\`\`

### Swarm Orchestration

In enterprise software engineering, specialized agents outperform generalist models. A coordinator agent decomposes the sprint, delegates frontend tasks to a React specialist, backend APIs to a Node/Python specialist, and unit testing to an automated QA agent.

### Conclusion

The future of productivity lies in multi-agent orchestration. By designing agents with strict validation gates, human-in-the-loop controls, and isolated sandboxes, teams can scale complex workflows safely.
`
  },
  {
    title: 'Zero Trust Architecture: Implementing Modern Identity-First Security',
    slug: 'zero-trust-architecture-modern-identity-first-security',
    excerpt: 'Perimeter firewalls are obsolete. Discover how Zero Trust principles, continuous verification, and cryptographic mutual TLS protect modern cloud estates.',
    category: 'Cybersecurity',
    tags: ['Zero Trust', 'Cybersecurity', 'mTLS', 'OAuth2', 'Cloud Security'],
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    views: 1840,
    readingTime: 8,
    status: 'published',
    createdAt: new Date('2026-11-06T09:15:00Z'),
    author: {
      name: 'Samantha Reed',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      bio: 'Cybersecurity director and former cryptographic protocol auditor.',
      role: 'Security Fellow'
    },
    seo: {
      metaTitle: 'Zero Trust Architecture Guide: Identity, mTLS, and Threat Defense',
      metaDescription: 'Learn how to implement Zero Trust security models, micro-segmentation, and ephemeral credentials for enterprise infra.',
      metaKeywords: ['zero trust', 'cybersecurity', 'identity provider', 'mtls', 'least privilege']
    },
    content: `
### Beyond the Castle-and-Moat Philosophy

Traditional cybersecurity relied on the perimeter: trust everything inside the corporate VPN and distrust everything outside. However, credential theft, insider threats, and decentralized cloud workloads have rendered the perimeter model dangerously obsolete.

Zero Trust operates under three unwavering principles:
1. **Verify Explicitly**: Always authenticate and authorize based on all available data points (identity, device posture, location, anomaly scores).
2. **Use Least Privileged Access**: Limit user and service access with Just-In-Time (JIT) and Just-Enough-Access (JEA).
3. **Assume Breach**: Minimize blast radius by micro-segmenting networks and encrypting all traffic in transit and at rest.

### Cryptographic Mutual TLS (mTLS)

Service-to-service communication within Kubernetes clusters should mandate mutual cryptographic authentication using short-lived SPIFFE/SPIRE x509 certificates.

\`\`\`yaml
# Istio PeerAuthentication Policy enforcing STRICT mTLS
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT
\`\`\`

### Practical Steps to Zero Trust Adoption

- Replace static long-lived API tokens with ephemeral OIDC tokens.
- Mandate hardware-backed FIDO2 / WebAuthn passkeys across all staff.
- Apply contextual continuous access evaluation to revoke tokens immediately upon suspicious device state changes.
`
  },
  {
    title: 'The Full-Stack React Revolution: Server Components, Streaming, and Next-Gen DX',
    slug: 'full-stack-react-revolution-server-components-streaming',
    excerpt: 'A deep dive into React Server Components (RSC), asynchronous hydration, suspense streaming, and compiler optimizations reshaping modern web engineering.',
    category: 'Web & Mobile App Development',
    tags: ['React', 'JavaScript', 'Web Development', 'Performance', 'Frontend'],
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    views: 3105,
    readingTime: 5,
    status: 'published',
    createdAt: new Date('2026-11-08T11:45:00Z'),
    author: {
      name: 'Julian Chen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      bio: 'Full-stack UI architect and open-source contributor to React build systems.',
      role: 'Staff Frontend Engineer'
    },
    seo: {
      metaTitle: 'The Full-Stack React Revolution: RSC and Streaming Hydration',
      metaDescription: 'Detailed exploration of React Server Components, Suspense streaming, bundle size elimination, and modern web DX.',
      metaKeywords: ['react', 'server components', 'rsc', 'web development', 'streaming hydration']
    },
    content: `
### The Evolution of Frontend Rendering

Over the past decade, web architectures swung from traditional server-rendered templates (PHP, Rails) to heavy Single Page Applications (SPAs) that shipped massive JavaScript bundles to the browser.

Today, React Server Components (RSC) unify both worlds: executing server-only logic on the edge while preserving interactive client-side components with zero extra bundle weight.

### Key Benefits of React Server Components

- **Zero Bundle Size Impact**: Dependencies used exclusively on the server (e.g. date formatting libraries, markdown parsers, syntax highlighters) stay on the server.
- **Direct Database Access**: Query PostgreSQL, MongoDB, or Prisma directly inside component bodies without creating boilerplate API routes.
- **Progressive Streaming**: Stream HTML chunks via \`<Suspense>\` boundaries so readers see content instantaneously while slow data sources load in background.

\`\`\`jsx
// Server Component directly fetching from DB
import { Suspense } from 'react';
import { db } from '@/lib/db';
import SkeletonPost from '@/components/SkeletonPost';

async function PostFeed() {
  const posts = await db.post.findMany({ take: 10 });
  return (
    <div className="grid gap-6">
      {posts.map(post => (
        <article key={post.id} className="p-4 border rounded-xl">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

export default function BlogSection() {
  return (
    <Suspense fallback={<SkeletonPost count={5} />}>
      <PostFeed />
    </Suspense>
  );
}
\`\`\`

### Architectural Best Practices

Keep client boundaries as close to the leaves of your component tree as possible. Reserve \`"use client"\` for interactive elements like buttons, dropdowns, and text inputs, while leaving data displays as pure server components.
`
  },
  {
    title: 'Clean Architecture and Domain-Driven Design in Modern TypeScript',
    slug: 'clean-architecture-domain-driven-design-modern-typescript',
    excerpt: 'Master bounded contexts, entities, value objects, and dependency inversion to write testable enterprise codebases that thrive over decades.',
    category: 'Software Development',
    tags: ['TypeScript', 'Software Architecture', 'Clean Code', 'DDD', 'Design Patterns'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    views: 1980,
    readingTime: 9,
    status: 'published',
    createdAt: new Date('2026-11-09T08:00:00Z'),
    author: {
      name: 'Julian Chen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      bio: 'Full-stack UI architect and open-source contributor to React build systems.',
      role: 'Staff Frontend Engineer'
    },
    seo: {
      metaTitle: 'Clean Architecture and Domain-Driven Design with TypeScript',
      metaDescription: 'A practical, enterprise-grade tutorial on implementing DDD, value objects, entities, and Hexagonal Architecture in TypeScript.',
      metaKeywords: ['clean architecture', 'typescript', 'domain driven design', 'software engineering']
    },
    content: `
### The Software Entropy Problem

As enterprise applications grow, business logic frequently leaks into UI components, database ORMs, and HTTP controller handlers. When requirements shift or infrastructure changes, developers face high friction and fragile code.

Clean Architecture solves this by strictly enforcing the **Dependency Rule**: source code dependencies must point inward toward high-level business policies.

### The Four Architectural Rings

1. **Enterprise Entities**: Core business rules and value objects independent of databases or UI.
2. **Use Cases (Interactors)**: Application-specific workflows orchestrating entity interactions.
3. **Interface Adapters**: Controllers, presenters, and repository gateways converting data between use cases and external tools.
4. **Frameworks & Drivers**: Express, Fastify, MongoDB, Redis, and React.

\`\`\`typescript
// Value Object: Email Address with Invariant Validation
export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  public static create(rawEmail: string): Email {
    const trimmed = rawEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      throw new Error('Invalid email address format: ' + rawEmail);
    }
    return new Email(trimmed);
  }

  public getValue(): string {
    return this.value;
  }
}
\`\`\`

### Inversion of Control in Action

By defining repository interfaces in the domain layer and implementing them in the infrastructure layer, you can swap MongoDB for PostgreSQL without touching a single line of business logic.
`
  },
  {
    title: 'Quantum Computing and Cryptography: Preparing for Post-Quantum Encryption',
    slug: 'quantum-computing-cryptography-post-quantum-encryption',
    excerpt: 'Shor’s algorithm threatens RSA and ECC encryption. Learn about lattice-based cryptography, NIST PQC standards, and migrating legacy infrastructure.',
    category: 'Technology & Innovation',
    tags: ['Quantum Computing', 'Cryptography', 'PQC', 'Innovation', 'Future Tech'],
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    views: 940,
    readingTime: 6,
    status: 'published',
    createdAt: new Date('2026-11-10T16:20:00Z'),
    author: {
      name: 'Dr. Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      bio: 'Principal Cloud Systems Architect and former distributed systems researcher.',
      role: 'Chief Architect'
    },
    seo: {
      metaTitle: 'Post-Quantum Cryptography: Preparing for the Quantum Computing Era',
      metaDescription: 'Discover the cryptographic shift to lattice-based algorithms and NIST PQC standards to protect enterprise secrets.',
      metaKeywords: ['quantum computing', 'post-quantum cryptography', 'nist pqc', 'encryption', 'cybersecurity']
    },
    content: `
### The "Harvest Now, Decrypt Later" Threat

Adversaries worldwide are actively intercepting and storing encrypted enterprise and government communications today. Their premise is straightforward: when cryptographically relevant quantum computers (CRQC) emerge, Shor's algorithm will crack RSA-2048 and Elliptic Curve Diffie-Hellman in hours.

### The NIST Post-Quantum Standards

The National Institute of Standards and Technology (NIST) has finalized primary quantum-resistant cryptographic algorithms:
- **ML-KEM (Kyber)**: General encryption key establishment mechanism built on the hardness of learning-with-errors (LWE) over module lattices.
- **ML-DSA (Dilithium)**: Primary standard for digital signatures.
- **SLH-DSA (SPHINCS+)**: Stateless hash-based backup signature scheme.

### Migration Roadmap for Engineers

1. **Cryptographic Inventory**: Catalog every instance of TLS certificates, SSH keys, data-at-rest encryption, and code signing keys.
2. **Hybrid Key Exchange**: Implement dual hybrid TLS 1.3 handshakes combining X25519 with Kyber-768.
3. **Crypto-Agility**: Refactor libraries to allow runtime swapping of cipher suites without breaking protocol handshakes.
`
  },
  {
    title: 'The 2026 Tech Leadership Playbook: Balancing AI Velocity with Engineering Rigor',
    slug: '2026-tech-leadership-playbook-ai-velocity-engineering-rigor',
    excerpt: 'How leading CTOs and VP of Engineerings are redefining developer productivity, reducing technical debt, and navigating generative AI team dynamics.',
    category: 'Industry Insights',
    tags: ['Leadership', 'Tech Strategy', 'Engineering Management', 'Productivity', 'Culture'],
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    views: 1610,
    readingTime: 5,
    status: 'published',
    createdAt: new Date('2026-11-12T13:00:00Z'),
    author: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'AI Research Lead specializing in reinforcement learning and collaborative autonomous agents.',
      role: 'Staff AI Researcher'
    },
    seo: {
      metaTitle: 'Tech Leadership Playbook 2026: AI Velocity and Engineering Rigor',
      metaDescription: 'Strategic leadership insights for engineering leaders managing AI tool adoption, architecture reviews, and team culture.',
      metaKeywords: ['tech leadership', 'engineering management', 'cto insights', 'ai productivity']
    },
    content: `
### The New Dilemma: Code Quantity vs. Code Comprehension

With AI code generation tools generating hundreds of lines of code per engineer per day, engineering organizations risk accumulating unprecedented levels of "stealth technical debt."

When code is written faster than humans can understand it, maintenance, debugging, and security review costs explode.

### Four Principles for Modern Tech Leaders

1. **Shift Focus from Output to Outcomes**: Measure customer impact, MTTR (Mean Time to Recovery), and cycle time rather than raw PR volume.
2. **Elevate Code Review Standards**: Automated AI reviewers should handle syntax and unit coverage, allowing human reviewers to scrutinize architectural boundaries and domain alignment.
3. **Invest Heavily in Golden Paths**: Standardized CLI templates, automated CI/CD guardrails, and observable runtimes keep teams aligned without micro-management.
4. **Foster Psychologically Safe Experimentation**: Encourage teams to pilot new technologies in scoped proof-of-concepts with strict rollback criteria.
`
  }
];

module.exports = { categories, posts };
