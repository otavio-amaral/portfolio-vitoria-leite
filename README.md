# Portfólio Profissional Vitória

Portfólio cinematográfico/editorial em Next.js 14 para Vitória, criativa que atua como Social Media, Fotógrafa, Video Maker e Diretora de Fotografia.

## Stack

- Next.js 14 com App Router
- TypeScript estrito
- Tailwind CSS
- Framer Motion
- Google Drive API v3 para imagens e vídeos

## Setup local

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
cp .env.local.example .env.local
```

3. Preencha `.env.local`:

```bash
GOOGLE_DRIVE_API_KEY=sua_api_key
DRIVE_FOLDER_FOTOGRAFIA=id_da_pasta_fotografia
DRIVE_FOLDER_SOCIAL_MEDIA=id_da_pasta_social_media
DRIVE_FOLDER_VIDEO=id_da_pasta_video
DRIVE_FOLDER_DIRECAO=id_da_pasta_direcao
DRIVE_FOLDER_TODOS=id_da_pasta_com_tudo
```

4. Rode o projeto:

```bash
npm run dev
```

## Como configurar o Google Drive

1. Crie uma pasta no Google Drive para cada categoria: Fotografia, Social Media, Vídeo, Direção e Todos.
2. Faça upload dos arquivos de imagem e vídeo nas respectivas pastas.
3. Compartilhe cada pasta como "Qualquer pessoa com o link pode visualizar".
4. Abra cada pasta no navegador e copie o ID da URL. Em uma URL como `https://drive.google.com/drive/folders/ABC123`, o ID é `ABC123`.
5. No Google Cloud Console, crie ou selecione um projeto.
6. Ative a Google Drive API.
7. Crie uma API key em "APIs e serviços" > "Credenciais".
8. Restrinja a chave para a Google Drive API e, em produção, limite os referrers/domínios permitidos.
9. Coloque a chave e os IDs das pastas no `.env.local`.

## Como as mídias são lidas

O route handler `app/api/drive/[category]/route.ts` recebe uma categoria, resolve a pasta correspondente por variável de ambiente e consulta:

```txt
https://www.googleapis.com/drive/v3/files
```

Campos usados:

```txt
files(id,name,description,mimeType,thumbnailLink,imageMediaMetadata)
```

O servidor converte cada arquivo em `MediaItem`, usando thumbnail do Drive, URL full-size via `lh3.googleusercontent.com/d/{fileId}` e cache com revalidação de 3600 segundos.

## Conteúdo editável

Textos, dados de contato, estatísticas, serviços, depoimentos, categorias e links sociais ficam centralizados em `lib/constants.ts`.

## Vídeos

Arquivos de vídeo no Drive aparecem como cards de vídeo no portfólio. Para abrir YouTube ou Vimeo no modal, coloque a URL embed no campo de descrição do arquivo no Drive, por exemplo:

```txt
https://www.youtube.com/embed/ID_DO_VIDEO
```

ou:

```txt
https://player.vimeo.com/video/ID_DO_VIDEO
```

## Verificação

Com as dependências instaladas:

```bash
npm run build
```

O build valida TypeScript, App Router e configuração de imagens remotas.
