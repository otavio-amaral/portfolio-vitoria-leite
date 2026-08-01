# Portfólio profissional — Vitória Leite

Portfólio editorial para fotografia, vídeo e social media, construído com Next.js 16, React 19, TypeScript, Tailwind CSS e Framer Motion. As imagens e os projetos são lidos da API do Google Drive pelo servidor.

## Requisitos

- Node.js 20.9 ou superior (Node 24 é usado na CI)
- Uma chave da Google Drive API v3
- Pastas públicas no Google Drive

## Setup local

```bash
npm install
Copy-Item .env.local.example .env.local
npm run dev
```

Preencha `.env.local` com a chave da API e os IDs das pastas. O arquivo real de ambiente não deve ser versionado.

## Organização do Drive

Cada variável `DRIVE_FOLDER_*` aponta para a raiz de uma categoria. A raiz pode conter os arquivos diretamente ou pastas-filhas, usadas como projetos/ensaios. A aplicação pagina os resultados, ordena pastas por nome e mídias pelas mais recentes.

Para uma apresentação melhor:

- dê nomes legíveis aos arquivos, pois eles são usados como texto alternativo quando não há descrição;
- use a descrição da pasta como resumo do projeto;
- para escolher uma capa, adicione `coverId: ID_DO_ARQUIVO` à descrição da pasta;
- para um card de vídeo, use exclusivamente uma URL embed HTTPS do YouTube ou Vimeo na descrição do arquivo.

Exemplos aceitos:

```txt
https://www.youtube.com/embed/ID_DO_VIDEO
https://player.vimeo.com/video/ID_DO_VIDEO
```

Pastas e arquivos arbitrários não são expostos: as rotas conferem se o ID solicitado pertence às raízes configuradas. As APIs também aplicam timeout, cache e rate limit local por IP.

## Conteúdo editável

Textos, contato, serviços, depoimentos, categorias e links sociais ficam em `lib/constants.ts`. Reels do Instagram também são cadastrados nesse arquivo e apenas três embeds são carregados na página inicial.

## Qualidade

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run test       # Vitest + Testing Library
npm run build      # build de produção
npm run check      # executa toda a sequência acima
npm audit          # vulnerabilidades conhecidas
```

O workflow em `.github/workflows/ci.yml` executa auditoria e validação completa em pushes e pull requests.

## SEO e produção

O projeto inclui metadados sociais, canonical, JSON-LD, sitemap, robots, manifest, Analytics/Speed Insights e cabeçalhos de segurança. Antes de publicar, confirme o domínio em `SITE_CONFIG.url`, restrinja a chave no Google Cloud à Google Drive API e configure as mesmas variáveis de ambiente na hospedagem.
