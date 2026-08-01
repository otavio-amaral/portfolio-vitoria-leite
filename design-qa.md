# Design QA — repaginação editorial

## Fonte e implementação

- Referência selecionada: `C:\Users\Usuário\.codex\generated_images\019fbddd-435b-7e30-99c2-4fe4356d05ad\exec-dfe2527f-27ec-404d-a64c-1abd8723f686.png`
- Implementação desktop final: `C:\Users\Usuário\.codex\visualizations\2026\08\01\019fbddd-435b-7e30-99c2-4fe4356d05ad\design-option-2\15-desktop-pass-2.png`
- Comparação lado a lado final: `C:\Users\Usuário\.codex\visualizations\2026\08\01\019fbddd-435b-7e30-99c2-4fe4356d05ad\design-option-2\comparison-pass-2.png`
- Implementação mobile final: `C:\Users\Usuário\.codex\visualizations\2026\08\01\019fbddd-435b-7e30-99c2-4fe4356d05ad\design-option-2\16-mobile-final.png`
- Portfólio mobile final: `C:\Users\Usuário\.codex\visualizations\2026\08\01\019fbddd-435b-7e30-99c2-4fe4356d05ad\design-option-2\17-mobile-portfolio-final.png`

## Condições de captura

- Desktop: 1440 × 1024 CSS px, DPR 1, página inicial no topo, dados do portfólio carregados.
- Mobile: 390 × 844 CSS px, DPR 1, página inicial e âncora `#portfolio`.
- Browser: navegador integrado do Codex, usando a prévia de produção local do Next.js.
- Estado: tema claro editorial, menu fechado nas capturas finais, primeira seleção de álbuns visível.

## Evidências de tela completa e focadas

- Hero + início do portfólio: `15-desktop-pass-2.png`.
- Sobre: `11-desktop-about.png`.
- Vídeos: `12-desktop-reel.png`.
- Serviços: `13-desktop-services.png`.
- Contato e rodapé: `14-desktop-contact.png`.
- Menu mobile aberto: `07-mobile-menu.png`.
- Álbum aberto: `09-mobile-album-open.png`.

## Avaliação visual final

- Tipografia: hierarquia Didone/Manrope consistente com a referência; título principal, manifesto e títulos de seção permanecem legíveis nos dois breakpoints.
- Espaçamento: hero e primeira linha da galeria agora ocupam a mesma faixa vertical da referência em 1440 × 1024.
- Cores: marfim, ameixa, rosa queimado e azul editorial; nenhum amarelo faz parte dos tokens, componentes ou estados de foco.
- Imagens: retrato editorial realista e capas reais do Google Drive; crops preservam o assunto sem distorção.
- Ícones: Phosphor Icons, com tamanho e peso coerentes; nenhum desenho manual ou emoji usado como ícone de interface.
- Densidade: navegação e hero respirados; galeria assimétrica começa ainda na primeira dobra; seções longas mantêm ritmo editorial.
- Responsividade: sem corte horizontal em 390 px; título, texto, CTA, filtros e capas mantêm a hierarquia.

## Interações verificadas

- Menu mobile abre com uma única ação, move o foco para `Início`, prende `Shift+Tab` no último item, fecha com `Escape` e devolve o foco ao botão.
- Links de navegação apontam para seções existentes e atualizam o estado ativo.
- Filtro de portfólio mantém alvos de toque de pelo menos 44 px.
- Álbum abre, carrega as mídias e exibe `Voltar aos trabalhos`; o retorno restaura a lista.
- Modal acessível inclui o `iframe` entre os elementos focalizáveis e conserva fechamento por teclado.
- CTAs de WhatsApp, Instagram e e-mail possuem nomes acessíveis e destinos válidos.

## Histórico de iteração

1. Passo 1: a comparação mostrou hero alto demais e galeria fora da primeira dobra.
2. Correção: compactação dos intervalos do hero, texto em duas linhas, cabeçalho do portfólio condensado e filtros integrados no desktop.
3. Revisão React: removido `opacity: 0` do SSR, adicionado gerenciamento de foco/Escape no menu, `iframe` incluído no focus trap e imports de ícones otimizados.
4. Passo 2: comparação 1440 × 1024 aprovada; capturas mobile e interações por teclado aprovadas.

## Achados finais

- P0: nenhum.
- P1: nenhum.
- P2: nenhum.
- P3 aceito: embeds do Instagram mantêm o chrome visual fornecido pelo serviço externo; o link editorial redundante garante uma rota acessível e previsível.
- Console final: 0 erros e 0 avisos.

passed
