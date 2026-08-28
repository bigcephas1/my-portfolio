export const defaultPortfolioData = {
  avatar: '',
  intro: 'DevSecOps & Cloud Engineer with 3+ years of experience designing, automating, and managing secure, scalable cloud infrastructure on AWS. Experienced in Infrastructure as Code (Terraform), Kubernetes orchestration, CI/CD automation, Linux administration, cloud networking, monitoring, observability, and production operations.',
  summary: 'Proven track record of reducing deployment time, optimizing infrastructure costs, improving platform reliability, and automating software delivery pipelines through modern DevOps practices.',
  about: {
    bio: 'Passionate DevSecOps Engineer with a strong background in cloud infrastructure, automation, and security. I help organizations build and maintain highly available, scalable, and secure cloud-native applications.',
    experience: '3+ years of experience in DevOps, Cloud Engineering, and Infrastructure Automation.',
    philosophy: 'Automation first, security always.',
    interests: ['Cloud Computing', 'Kubernetes', 'DevOps Culture', 'Open Source', 'Tech Writing'],
    profileImage: ''
  },
  experience: [
    {
      id: 1,
      title: 'Senior DevOps Engineer',
      company: 'Amatip (Remote - UK)',
      period: 'January 2022 - Present',
      description: 'Designed and maintained highly available AWS infrastructure supporting multiple production applications. Built CI/CD pipelines using GitHub Actions, Jenkins, and AWS CodePipeline, reducing deployment time by approximately 65%.'
    },
    {
      id: 2,
      title: 'DevOps Instructor',
      company: 'Women Testchers Fellowship (Remote)',
      period: 'September 2025 - February 2026',
      description: 'Delivered comprehensive DevOps training covering Linux, AWS, Docker, Kubernetes, Terraform, Jenkins, GitHub Actions, Helm, ArgoCD, Prometheus, Grafana, and Ansible.'
    }
  ],
  projects: [
    {
      id: 1,
      name: 'Cloud Infrastructure Automation Platform',
      description: 'Provisioned secure AWS infrastructure using Terraform, reusable modules, S3 Remote State, DynamoDB locking, and Ansible.',
      techStack: ['Terraform', 'AWS', 'Ansible', 'DynamoDB'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com'
    },
    {
      id: 2,
      name: 'Kubernetes Deployment Platform',
      description: 'Managed production-ready Kubernetes environments on Amazon EKS using Helm, ArgoCD, Ingress NGINX, and GitOps workflows.',
      techStack: ['Kubernetes', 'EKS', 'Helm', 'ArgoCD', 'GitOps'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com'
    }
  ],
  skills: [
    { id: 1, name: 'AWS (EC2, EKS, ECS, S3, RDS, Lambda)', category: 'Cloud', level: 90 },
    { id: 2, name: 'Kubernetes', category: 'Containers', level: 85 },
    { id: 3, name: 'Terraform', category: 'Infrastructure as Code', level: 90 },
    { id: 4, name: 'Docker', category: 'Containers', level: 88 },
    { id: 5, name: 'CI/CD (GitHub Actions, Jenkins)', category: 'CI/CD', level: 85 },
    { id: 6, name: 'Python', category: 'Programming', level: 80 },
    { id: 7, name: 'Linux Administration', category: 'System Admin', level: 85 },
    { id: 8, name: 'MongoDB', category: 'Databases', level: 75 },
    { id: 9, name: 'Git', category: 'Version Control', level: 90 },
    { id: 10, name: 'Monitoring (Prometheus, Grafana)', category: 'Monitoring', level: 80 }
  ],
  services: [
    { id: 1, name: 'Cloud Infrastructure Engineering', description: 'Design and implement scalable cloud infrastructure on AWS.', icon: 'fa-cloud' },
    { id: 2, name: 'Kubernetes Administration', description: 'Manage and optimize Kubernetes clusters for production workloads.', icon: 'fa-server' },
    { id: 3, name: 'CI/CD Pipeline Automation', description: 'Build automated software delivery pipelines for faster deployment.', icon: 'fa-code-branch' },
    { id: 4, name: 'Infrastructure as Code', description: 'Automate infrastructure provisioning with Terraform and Ansible.', icon: 'fa-code' },
    { id: 5, name: 'Security & Compliance', description: 'Implement security best practices including IAM, WAF, and Secrets Manager.', icon: 'fa-shield-alt' },
    { id: 6, name: 'Monitoring & Observability', description: 'Set up comprehensive monitoring and alerting systems.', icon: 'fa-chart-line' }
  ],
  blog: [
    {
      id: 1,
      title: 'GitOps with ArgoCD on EKS',
      date: '2025-12-01',
      excerpt: 'Deep dive into GitOps workflows and cluster management with ArgoCD on Amazon EKS.',
      tags: ['Kubernetes', 'GitOps', 'ArgoCD'],
      readTime: '5 min read',
      platform: 'Medium'
    },
    {
      id: 2,
      title: 'Reducing AWS costs with Terraform',
      date: '2025-10-15',
      excerpt: 'Practical strategies to optimize cloud spend using Terraform and cost analysis tools.',
      tags: ['AWS', 'Terraform', 'Cost Optimization'],
      readTime: '4 min read',
      platform: 'Dev.to'
    }
  ],
  contactFields: [
    { id: 1, label: 'Email', value: 'ukpabipeteru@gmail.com', icon: 'fa-envelope', type: 'email' },
    { id: 2, label: 'Phone', value: '+234 806 220 1773', icon: 'fa-phone', type: 'phone' },
    { id: 3, label: 'GitHub', value: 'github.com/bigcephas1', icon: 'fa-github', type: 'url' },
    { id: 4, label: 'LinkedIn', value: 'linkedin.com/in/peter-ukpabi-uche', icon: 'fa-linkedin', type: 'url' },
    { id: 5, label: 'Twitter', value: 'twitter.com/peterukpabi', icon: 'fa-twitter', type: 'url' }
  ],
  certifications: [
    {
      id: 1,
      name: 'AWS Certified DevOps Engineer - Professional',
      issuer: 'Amazon Web Services',
      date: '2024',
      credentialId: 'AWS-DEVOPS-12345'
    },
    {
      id: 2,
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      date: '2024',
      credentialId: 'CKA-12345'
    },
    {
      id: 3,
      name: 'HashiCorp Terraform Associate',
      issuer: 'HashiCorp',
      date: '2024',
      credentialId: 'TF-12345'
    }
  ],
  education: {
    degree: 'Bachelor of Science in Computer Science',
    institution: 'University of the People',
    year: '2024',
    description: 'Specialized in Cloud Computing and Distributed Systems'
  },
  hire: {
    salaryExpectation: '$60,000 - $100,000 USD per year',
    noticePeriod: '1 month',
    availability: 'Immediate',
    preferredWork: 'Remote / Hybrid'
  }
};
