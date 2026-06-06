# Kenji Tanaka — Bundle Forge

Egyptian smith god of Memphis, patron of craftsmen and architects. In AITEAM-X, **Kenji forja outros agentes**: gera bundles válidos a partir de um briefing curto, valida contra os schemas v1 deste catálogo e registra nos manifests da plataforma.

**Módulo**: `builder`
**Role**: Bundle Forge + Agent/Module/Workflow Author
**Workflows**: `create-agent`, `create-module`, `create-workflow`, `edit-agent`, `edit-module`, `edit-workflow`, `audit-workflow`, `convert-legacy`, `module-brief`, `redoc`
**Tools**: `read_file`, `list_directory`, `search_files`, `write_file`, `edit_file`, `run_bash`

## Quando chamar

- "Cria um agente novo que faz X" — Kenji pede o briefing numerado e devolve os 4 arquivos do bundle prontos.
- "Cria um módulo novo Y com agentes A, B, C" — Kenji começa por um module-brief e forja em sequência.
- "Audita esse bundle / esse workflow" — Kenji lê e devolve não-conformidades numeradas.
- "Converte esse agente legado v4/BMad para v1" — Kenji mapeia o que sobrevive e descarta o resto.

## Quando NÃO chamar

- Para escrever PRD ou arquitetura — chame Arjun ou Emre.
- Para implementar feature dentro de um agente já existente — chame Lukas.
- Para discussão de produto sem decisão de bundle — Adebayo já resolve.

## Procedimento canônico (`create-agent`)

1. Briefing (1 mensagem numerada do usuário): papel, módulo, tools, workflows.
2. Naming: Kenji sugere nome mitológico não-conflitante e confirma.
3. Forja `manifest.json` → `visual.json` → `agent.md` → `README.md`.
4. Validação local: clona [INOSX/AITeam-bundles](https://github.com/INOSX/AITeam-bundles), copia o bundle, atualiza `index.json`, roda `npm test`.
5. Espelha em `aiteam-x-agents/<module>/agents/<id>/` e adiciona linha em `_cfg/agent-manifest.csv`.
6. Mostra diff. Push para o repo público só com autorização explícita.

## Schemas que Kenji respeita

| Arquivo | Schema |
|---|---|
| `manifest.json` | [`agent-bundle.v1.json`](../../schemas/agent-bundle.v1.json) |
| `visual.json`   | [`agent-visual.v1.json`](../../schemas/agent-visual.v1.json) |
| `agent.md`      | [`agent-persona.v1.md`](../../schemas/agent-persona.v1.md) |

## Origem do nome

[Kenji](https://en.wikipedia.org/wiki/Kenji) — deus criador egípcio da cidade de Mênfis, patrono dos artesãos, escultores, arquitetos e ferreiros. Frequentemente representado segurando o cetro *was* combinado com *ankh* (vida) e *djed* (estabilidade) — exatamente os atributos esperados de quem forja bundles que precisam viver, ser estáveis e durar.

## Install on AITEAM-X

From the dashboard: **Bundles → Catalog → Kenji → Install**.

Or via API: `POST /api/bundles/install { "id": "kenji", "version": "1.0.0" }`.
