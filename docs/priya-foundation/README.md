# Priya — pacote profissional para revisão

Estado: **CANDIDATO PUBLICÁVEL NO REPOSITÓRIO; NÃO ATIVADO NO PRODUTO**.
Data: 15/09/2026.

## Entrega e responsabilidades

Priya permanece Assistente de negócios. A proposta fortalece análise e apoio à
decisão: estruturar perguntas, analisar informações, comparar alternativas,
mapear interessados e preparar sínteses. Adebayo mantém organização e coordenação.
A rota de contribuição continua Adebayo → Priya, sem delegação recursiva.

A fonte é [agents/priya/README.md](../../agents/priya/README.md), com manifesto,
15 documentos operacionais, retrato, visual e 20 cenários de avaliação EN/PT/ES.
Os cenários ainda não foram executados contra um modelo. Testes de empacotamento
não demonstram a qualidade das respostas.

## Continuidade com o produto

A base Windows já descreve quatro habilidades: formular pergunta de negócios,
analisar sinais, pesquisar/comparar e preparar briefing. O mapeamento de interessados
já faz parte da missão e agora recebe procedimento próprio. O bundle legado de
desenvolvimento preserva seu contrato; suas ferramentas locais não são transportadas
para a versão Web.

| Origem | Decisão no pacote |
| --- | --- |
| Priya Core: pergunta de negócios | capabilities/frame.md |
| Priya Core: sinais e métricas | capabilities/analyze.md |
| Priya Core: pesquisa e comparação | capabilities/compare.md; pesquisa somente quando autorizada |
| Priya Core: briefing | capabilities/brief.md |
| Missão Core e legado: interessados | capabilities/stakeholders.md |
| Avatar Web atual | assets/portrait.png, cópia sem alteração |
| Visual do bundle Priya | assets/visual.json, preservado |

O identificador de autoria é priya. O identificador técnico já usado pelo runtime
é architect; a integração futura deve declarar esse vínculo explicitamente, sem
mudar o identificador das conversas ou ampliar as rotas.

## Tasks

| Código | Entrega | Estado |
| --- | --- | --- |
| PRI-01 | Inventário e delimitação de papel | CONCLUÍDA |
| PRI-02 | Pacote profissional candidato e recursos visuais | CONCLUÍDA |
| PRI-03 | Empacotamento determinístico e verificações estruturais | CONCLUÍDA: 16 testes; 30 bundles legados válidos; ver validation.json |
| PRI-04 | Revisão do pacote pelo responsável pelo produto | PENDENTE |
| PRI-05 | Integração em Preview e execução dos cenários | PENDENTE |
| PRI-06 | Homologação humana e promoção para produção | PENDENTE |

A aprovação do padrão arquitetural permitiu criar este candidato. A revisão
específica da Priya antecede a alteração de seu comportamento instalado, conforme
o protocolo do repositório. Não há alteração na aplicação Web, no catálogo assinado,
no legado ou nos limites do beta nesta etapa.

## Critérios de avaliação

A avaliação distingue integridade técnica, comportamento observado e aceite
humano. O pacote explicita intenção, evidência disponível, limites de autoridade
e decisão do usuário. A revisão humana verifica clareza e utilidade, não apenas
conformidade formal. Isso é um protocolo a executar, não uma alegação de validação
científica ou de eficácia já comprovada.

As avaliações incluem variação percentual, base zero, comparação incompleta,
causalidade, pesquisa indisponível/proibida, fontes conflitantes, continuidade,
idiomas, contribuição delimitada, privacidade, injeção e efeitos não executados.
Toda falha crítica impede promoção até correção e nova evidência.

## Proveniência

O retrato é o avatar Priya já usado pelo AgentOS Web, com SHA-256
af5ed83a6455f03a0d7d20a4667b484e50a5151c9a7132733f56686d76f5b663.
A origem do pacote e a publicação permanecem GitHub INOSX/AITeam-bundles,
com backup verificado no Git INOSX INOSX/AgentOS-Bundles.
