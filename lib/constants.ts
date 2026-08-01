import type { PortfolioCategory, ServiceItem, SocialReelItem, TestimonialItem } from "@/types/portfolio";

export const SITE_CONFIG = {
  name: "Vitória",
  fullName: "Vitória Leite",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-vitoria-delta.vercel.app",
  tagline: "Fotografia · Filme · Conteúdo",
  about:
    "Vitória transforma histórias, pessoas e marcas em imagens com intenção. Seu trabalho cruza fotografia, filme e estratégia de conteúdo para criar uma presença visual sensível, contemporânea e reconhecível.",
  quote: "Gosto de dirigir cada detalhe sem tirar da imagem aquilo que ela tem de mais vivo.",
  email: "contato@vitorialeite.com",
  whatsapp: "+55 (11) 98336-6510",
  instagram: "@viemfoco",
  instagramUrl: "https://instagram.com/viemfoco",
  location: "São Paulo, Brasil",
  logoUrl: "/images/logo-viemfoco.webp",
  portraitUrl: "/images/vitoria-principal.jpeg",
  localPortraits: [
    { src: "/images/vitoria-principal.jpeg", alt: "Vitória Leite segurando uma câmera" },
    { src: "/images/vitoria-camera.jpeg", alt: "Vitória Leite fotografando com câmera Canon" },
    { src: "/images/vitoria-pb.jpeg", alt: "Retrato em preto e branco de Vitória Leite com câmera" }
  ],
  heroAccentWord: "um olhar atento",
  emptyPortfolioMessage: "Nenhuma mídia publicada nesta categoria.",
  stats: [
    { value: 120, label: "posts, campanhas e frames", suffix: "+" },
    { value: 5, label: "anos criando para tela", suffix: "+" },
    { value: 10, label: "empresas atendidas", suffix: "+" },
    { value: 8, label: "projetos destacados" }
  ],
  navItems: [
    { label: "Início", href: "#inicio", icon: "home" },
    { label: "Sobre", href: "#sobre", icon: "spark" },
    { label: "Trabalhos", href: "#portfolio", icon: "grid" },
    { label: "Vídeos", href: "#showreel", icon: "play" },
    { label: "Serviços", href: "#servicos", icon: "tag" },
    { label: "Contato", href: "#contato", icon: "dm" }
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
    { label: "Instagram", href: "https://instagram.com/viemfoco" }
  ]
} as const;

export const CATEGORIES: PortfolioCategory[] = [
  { id: "todos", label: "Todos" },
  { id: "fotografia", label: "Fotografia" }
];

export const SERVICES: ServiceItem[] = [
  {
    title: "Social Media & Conteúdo",
    description: "Estratégia, narrativa visual e conteúdo pensado para tornar a presença da marca mais clara e consistente.",
    icon: "social"
  },
  {
    title: "Ensaios & Retratos",
    description: "Retratos pessoais, celebrações e campanhas conduzidos com leveza, direção e atenção ao que é autêntico.",
    icon: "photo"
  },
  {
    title: "Filmes & Reels",
    description: "Vídeos curtos, bastidores e narrativas em movimento com ritmo, enquadramento e identidade.",
    icon: "video"
  },
  {
    title: "Direção de Imagem",
    description: "Luz, cor, enquadramento e direção criativa para construir uma linguagem visual que permanece.",
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

export const DRIVE_CATEGORY_ENV_KEYS = {
  fotografia: "DRIVE_FOLDER_FOTOGRAFIA",
  social_media: "DRIVE_FOLDER_SOCIAL_MEDIA",
  video: "DRIVE_FOLDER_VIDEO",
  direcao: "DRIVE_FOLDER_DIRECAO",
  todos: "DRIVE_FOLDER_TODOS"
} as const;
