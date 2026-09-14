# Fundação dos agentes AgentOS — 14/09/2026

## Decisões do proprietário

- GitHub INOSX/AITeam-bundles é a fonte principal. Git INOSX/AgentOS-Bundles é backup privado.
- Adebayo Okonkwo será o **Administrador da equipe**.
- Usar a metodologia de criação do BMad Builder; não instalar nem executar o Builder.
- Usar BMad Help como inspiração para orientação contextual e coordenação.
- Aprovar o desenho profissional antes da integração da nova programação na Web.

## BND-01 — Inventário concluído

Origem GitHub e checkout legado: `2c50a90ac8b280eedd712e2d903403b6f3e5f1a2`.
São 30 bundles versionados e 23 diretórios adicionais não rastreados. `inventory.json`
registra identidade, versão, proveniência Git, tamanho e SHA-256 de cada arquivo.
Os arquivos originais foram preservados. Os diretórios adicionais não foram publicados
no catálogo: precisam de revisão editorial e técnica antes de serem distribuídos.

Disposição:

| Conjunto | Destino |
| --- | --- |
| 30 bundles legados publicados | Preservar histórico e compatibilidade em `bundles/` |
| 23 diretórios não rastreados | Preservar cópia de recuperação; revisar antes de incorporar |
| Quatro pacotes Core atuais, no repo AgentOS | Referência de runtime e comportamento; sem sobrescrever com o legado |
| Novo desenho do Adebayo | Documento de revisão; ainda não é instrução ativa |

O checkout isolado do GitHub passou em `npm test`: 30 bundles válidos e catálogo consistente.
O checkout original contém diretórios fora do catálogo; não confundir essa condição
com um defeito nos 30 bundles publicados.

## Diferenças que precisam ser reconciliadas

O legado `bundles/adebayo/agent.md` descreve acesso ao computador e atuação como
orquestrador/executor AITEAM-X. O manifest fala em escolhas numeradas, enquanto a
persona rejeita menu rígido; workflows/tasks/uses estão vazios. Não transportar
essas afirmações de ferramentas para a Web, onde as capacidades são concedidas pelo runtime.

O pacote Core em `src/AgentOS.Operational/Bundles/Core/Adebayo` do repo AgentOS
descreve Chief of Staff, cinco habilidades, um workflow, capacidades e regras.
O runtime Windows seleciona habilidade e monta essas instruções; a Web examinada
carrega AGENT.md e contexto da equipe, sem seleção equivalente das habilidades.

O consumidor legado usa URLs raw do GitHub. A Web atual usa catálogo assinado do
serviço AgentOS; não lê diretamente este index.json. A conexão entre a autoria no
GitHub e a publicação desse catálogo ainda pertence a ADE-03/BND-04.

## Sequência e estado

| Task | Estado | Critério |
| --- | --- | --- |
| BND-01 | Concluída | Inventário, proveniência, preservação e validação do publicado |
| BND-02 | Concluída | Cinco branches iguais, sem tags na origem; clone de recuperação e git fsck aprovados |
| ADE-01 | Preparada para revisão | Aprovação de `adebayo-design.md` pelo proprietário |
| ADE-02 | Pendente | Repertório detalhado, memória e colaboração a partir do desenho aprovado |
| BND-03 | Pendente | Formato implementável e validado do novo bundle |
| ADE-03 | Pendente | Integração Web e capacidades executáveis |
| ADE-04 | Pendente | Testes comportamentais e homologação humana |
| BND-04 | Pendente | Publicação da programação aprovada e backup conferido |

## Referências estudadas, não dependências de execução

- https://github.com/bmad-code-org/BMAD-METHOD/blob/main/skills/bmad/SKILL.md
- https://github.com/bmad-code-org/BMAD-METHOD/blob/main/skills/bmad/references/help.md
- https://bmad-builder-docs.bmad-method.org/reference/builder-commands/
- https://github.com/bmad-code-org/bmad-builder/blob/main/skills/bmad-agent-builder/references/agent-quality-principles.md

Não foram feitas chamadas de IA de produto, mudanças de permissões ou deploy nesta etapa.
