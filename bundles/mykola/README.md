# Mykola Kovalenko — Menu-driven Orchestrator

Orquestrador determinístico do módulo `core`. Complemento do Adebayo.

## Quando chamar Adebayo vs Mykola

| Cenário | Agente |
|---|---|
| "Resolve isso pra mim" / quero parceiro proativo | **Adebayo** |
| "Me mostra as opções" / quero auditar antes de executar | **Mykola** |
| Workflow que precisa rodar passo-a-passo com checkpoints | **Mykola** |
| Conversa exploratória / brainstorm | **Adebayo** (ou Mykola com `*workflow brainstorming`) |
| Transformação em outro agente especialista via menu | **Mykola** (`*agents [nome]`) |

## Comportamento

1. Mostra menu numerado dos workflows e tasks disponíveis.
2. Espera input do usuário (número ou trigger textual).
3. Executa item escolhido após confirmar.
4. `*agents [nome]` transforma em outro agente; `*exit` reverte.
5. `*swarm` entra em modo discussão multi-agente.

## Origem

Substitui o arquivo legado `core/agents/web-orchestrator.agent.xml` (formato bundle XML monolítico) com a mesma intenção, mas no formato bundle v1 — 4 arquivos validados pelo schema oficial, gerenciado pelo wizard de bundles e pelo installer.
