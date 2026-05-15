# Iris — Instagram Campaign Architect

> Módulo: `nex` · Versão: `1.0.0` · Autor: INOSX

Iris gerencia o ciclo completo de campanhas no Instagram: briefing → copy → carrossel → publicação via Meta Graph API → analytics → próxima ação.

---

## O que faz

| Capacidade | Detalhe |
|---|---|
| Ideação de campanha | 3 ângulos com hook, desenvolvimento e CTA |
| Criação de carrossel | Slide a slide: título + copy + CTA no último |
| Publicação | Via Meta Graph API — só com confirmação do usuário |
| Analytics | Insights de conta e por post com contexto comparativo |
| Feedback loop | Leitura pós-48h, aprendizado registrado em memória |
| Gestão de hashtags | Pesquisa e validação antes de qualquer publicação |
| Resposta a comentários | Engajamento em campanhas ativas |

---

## Workflows incluídos

### `instagram-campaign`
Ciclo completo de criação e publicação: briefing → pesquisa de hashtags e tendências → 3 ângulos propostos → carrossel escrito slide a slide → geração de imagens → criação de containers → publicação confirmada.

### `instagram-analytics`
Relatório de performance: insights da conta (7d/30d/90d) + insights por post → top 3 e bottom 3 → padrões de horário, formato e hashtag → 3 recomendações acionáveis.

### `instagram-feedback-loop`
Loop de melhoria: métricas 48-72h após publicação → comparação com média dos últimos 10 posts → identificação de padrões → registro em `.memory/iris/lessons.md` → proposta de ajuste para próxima campanha.

---

## Ferramentas

### Harness nativo
`read_file` · `write_file` · `edit_file` · `search_files` · `list_directory` · `run_bash` · `web_fetch` · `image_generate`

### Meta MCP (oficial)
| Tool | Uso |
|---|---|
| `mcp_meta_get_user_accounts` | Autentica e lista contas |
| `mcp_meta_get_media_objects` | Lista posts existentes |
| `mcp_meta_create_media_container` | Prepara mídia para publicação |
| `mcp_meta_publish_media_container` | Publica (requer confirmação) |
| `mcp_meta_get_media_insights` | Métricas por post |
| `mcp_meta_get_account_insights` | Métricas gerais da conta |
| `mcp_meta_get_hashtag_search` | Pesquisa e valida hashtags |
| `mcp_meta_reply_to_comment` | Responde comentários |

---

## Instalação

```bash
# No diretório do projeto AITEAM-X
cp -r bundles/iris aiteam-x-agents/nex/agents/iris
```

Adicionar linha em `aiteam-x-agents/_cfg/agent-manifest.csv`:
```
iris,Iris,nex,1.0.0,Instagram Campaign Architect
```

---

## Pré-requisitos

- Meta Graph API token com permissões: `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights`, `instagram_manage_comments`
- MCP oficial da Meta configurado e autenticado
- Token armazenado em variável de ambiente (nunca em código): `META_ACCESS_TOKEN`

---

## Memória

Iris lê e escreve em:
- `.memory/iris/decisions.md` — tom de voz, hashtags aprovadas, campanhas anteriores
- `.memory/iris/lessons.md` — aprendizados do feedback loop

---

## Nomenclatura

**Iris** — deusa grega do arco-íris, mensageira entre os deuses e os mortais. O arco-íris evoca o visual vibrante do Instagram; a mensageira, o papel de canal de comunicação entre marca e audiência.
