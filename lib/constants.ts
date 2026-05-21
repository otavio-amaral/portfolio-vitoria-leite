import type { PortfolioCategory, ServiceItem, SocialReelItem, TestimonialItem } from "@/types/portfolio";

export const SITE_CONFIG = {
  name: "Vitória",
  fullName: "Vitória Leite",
  tagline: "Social Media · Fotografia · Video Maker · Direção de Fotografia",
  about:
    "Sou fotógrafa e videomaker, com foco em detalhes e imagens documentais. Meu trabalho nasce do desejo de registrar momentos espontâneos, únicos e cheios de intenção — cenas simples, naturais e verdadeiras, que muitas vezes passam despercebidas.",
  quote: "Gosto de captar momentos únicos e diferentes, com verdade, leveza e sensibilidade.",
  email: "contato@vitorialeite.com",
  whatsapp: "+55 (11) 98336-6510",
  instagram: "@viemfoco",
  instagramUrl: "https://instagram.com/viemfoco",
  location: "São Paulo, Brasil",
  heroVideoUrl: "/showreel.mp4",
  heroPosterUrl: "https://drive.google.com/thumbnail?id=1&sz=w1600",
  logoUrl: "/images/logo-viemfoco.png",
  portraitUrl: "/images/vitoria-principal.jpeg",
  mainPortraitUrl: "/images/vitoria-principal.jpeg",
  localPortraits: [
    { src: "/images/vitoria-principal.jpeg", alt: "Vitória Leite segurando uma câmera" },
    { src: "/images/vitoria-camera.jpeg", alt: "Vitória Leite fotografando com câmera Canon" },
    { src: "/images/vitoria-pb.jpeg", alt: "Retrato em preto e branco de Vitória Leite com câmera" }
  ],
  heroAccentWord: "criativa",
  emptyPortfolioMessage: "Nenhuma mídia publicada nesta categoria.",
  messageFieldLabel: "Mensagem",
  stats: [
    { value: 120, label: "posts, campanhas e frames", suffix: "+" },
    { value: 5, label: "anos criando para tela", suffix: "+" },
    { value: 10, label: "empresas atendidas", suffix: "+" },
    { value: 8, label: "projetos destacados" }
  ],
  navItems: [
    { label: "Início", href: "#inicio", icon: "home" },
    { label: "Sobre", href: "#sobre", icon: "spark" },
    { label: "Feed", href: "#portfolio", icon: "grid" },
    { label: "Reel", href: "#showreel", icon: "play" },
    { label: "Serviços", href: "#servicos", icon: "tag" },
    { label: "DM", href: "#contato", icon: "dm" }
  ],
  heroRoles: ["Social Media", "Fotógrafa", "Video Maker", "Diretora de Fotografia"],
  heroCollage: [
    { src: "/images/vitoria-principal.jpeg", alt: "Vitória Leite segurando uma câmera", rotation: -4, speed: -46 },
    { src: "/images/vitoria-camera.jpeg", alt: "Vitória Leite fotografando com câmera Canon", rotation: 3, speed: -22 },
    { src: "/images/vitoria-pb.jpeg", alt: "Retrato em preto e branco de Vitória Leite com câmera", rotation: -1, speed: -64 },
    { src: "https://drive.google.com/thumbnail?id=1&sz=w900", alt: "Vídeo vertical em produção", rotation: 5, speed: -34 },
    { src: "https://drive.google.com/thumbnail?id=1&sz=w900", alt: "Moodboard de direção de fotografia", rotation: -6, speed: -18 },
    { src: "https://drive.google.com/thumbnail?id=1&sz=w900", alt: "Conteúdo para redes sociais", rotation: 2, speed: -52 },
    { src: "https://drive.google.com/thumbnail?id=1&sz=w900", alt: "Bastidor de produção criativa", rotation: -3, speed: -28 }
  ],
  portfolioViewModes: [
    { id: "grid", label: "Grid" },
    { id: "feed", label: "Feed" }
  ],
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com/viemfoco" },
    { label: "Pinterest", href: "https://pinterest.com" },
    { label: "TikTok", href: "https://tiktok.com" }
  ]
} as const;

export const CATEGORIES: PortfolioCategory[] = [
  { id: "todos", label: "Todos" },
  { id: "fotografia", label: "Fotografia" },
  { id: "social_media", label: "Social Media" }
];

export const SERVICES: ServiceItem[] = [
  {
    title: "Gestão de Redes Sociais",
    description: "Calendário, narrativa visual, linguagem de marca e conteúdo que parece nativo do feed.",
    icon: "social"
  },
  {
    title: "Ensaios Fotográficos",
    description: "Retratos e campanhas com estética de câmera real, pele viva, textura e presença.",
    icon: "photo"
  },
  {
    title: "Produção de Vídeo",
    description: "Reels, TikToks, bastidores, cortes sociais e vídeos com ritmo de plataforma.",
    icon: "video"
  },
  {
    title: "Dir. de Fotografia",
    description: "Luz, cor, enquadramento e mood para deixar cada cena com identidade compartilhável.",
    icon: "direction"
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "A Vitória entendeu nosso feed como se fosse um personagem. Tudo ficou mais real, mais bonito e mais nosso.",
    author: "Marina Costa",
    role: "Casa Nua"
  },
  {
    quote: "Ela chegou no set com moodboard, direção e instinto. O resultado parecia espontâneo, mas era super certeiro.",
    author: "Rafael Moreira",
    role: "Diretor Criativo"
  },
  {
    quote: "Nossos conteúdos pararam de parecer peça solta. Viraram uma estética reconhecível.",
    author: "Bianca Torres",
    role: "Marketing Manager"
  }
];

export const SOCIAL_REELS: SocialReelItem[] = [
  {
    id: "DU6d7h9ESx9",
    title: "A Sala Secreta · Reel 01",
    url: "https://www.instagram.com/reel/DU6d7h9ESx9/",
    embedUrl: "https://www.instagram.com/reel/DU6d7h9ESx9/embed"
  },
  {
    id: "DU1UXXOEfcv",
    title: "A Sala Secreta · Reel 02",
    url: "https://www.instagram.com/reel/DU1UXXOEfcv/",
    embedUrl: "https://www.instagram.com/reel/DU1UXXOEfcv/embed"
  },
  {
    id: "DSGMEBXkljb",
    title: "A Sala Secreta · Reel 03",
    url: "https://www.instagram.com/reel/DSGMEBXkljb/",
    embedUrl: "https://www.instagram.com/reel/DSGMEBXkljb/embed"
  },
  {
    id: "DRndYJiEuMm",
    title: "A Sala Secreta · Reel 04",
    url: "https://www.instagram.com/reel/DRndYJiEuMm/",
    embedUrl: "https://www.instagram.com/reel/DRndYJiEuMm/embed"
  },
  {
    id: "DYNmDFmve7E",
    title: "A Sala Secreta · Reel 05",
    url: "https://www.instagram.com/reel/DYNmDFmve7E/",
    embedUrl: "https://www.instagram.com/reel/DYNmDFmve7E/embed"
  },
  {
    id: "DYNZ_Z6MfoS",
    title: "A Sala Secreta · Reel 06",
    url: "https://www.instagram.com/reel/DYNZ_Z6MfoS/",
    embedUrl: "https://www.instagram.com/reel/DYNZ_Z6MfoS/embed"
  },
  {
    id: "DYKys0SphSH",
    title: "A Sala Secreta · Reel 07",
    url: "https://www.instagram.com/reel/DYKys0SphSH/",
    embedUrl: "https://www.instagram.com/reel/DYKys0SphSH/embed"
  },
  {
    id: "DYA3eyrspMi",
    title: "A Sala Secreta · Reel 08",
    url: "https://www.instagram.com/reel/DYA3eyrspMi/",
    embedUrl: "https://www.instagram.com/reel/DYA3eyrspMi/embed"
  },
  {
    id: "DX7lmKTBi0-",
    title: "A Sala Secreta · Reel 09",
    url: "https://www.instagram.com/reel/DX7lmKTBi0-/",
    embedUrl: "https://www.instagram.com/reel/DX7lmKTBi0-/embed"
  },
  {
    id: "DXP0F9Eh0j6",
    title: "A Sala Secreta · Reel 10",
    url: "https://www.instagram.com/reel/DXP0F9Eh0j6/",
    embedUrl: "https://www.instagram.com/reel/DXP0F9Eh0j6/embed"
  },
  {
    id: "DXKwWYXDPaP",
    title: "A Sala Secreta · Reel 11",
    url: "https://www.instagram.com/reel/DXKwWYXDPaP/",
    embedUrl: "https://www.instagram.com/reel/DXKwWYXDPaP/embed"
  }
];

export const CONTACT_FIELDS = [
  { id: "name", label: "Nome", type: "text", autoComplete: "name" },
  { id: "email", label: "E-mail", type: "email", autoComplete: "email" },
  { id: "project", label: "Projeto", type: "text", autoComplete: "off" }
] as const;

export const DRIVE_CATEGORY_ENV_KEYS = {
  fotografia: "DRIVE_FOLDER_FOTOGRAFIA",
  social_media: "DRIVE_FOLDER_SOCIAL_MEDIA",
  video: "DRIVE_FOLDER_VIDEO",
  direcao: "DRIVE_FOLDER_DIRECAO",
  todos: "DRIVE_FOLDER_TODOS"
} as const;
