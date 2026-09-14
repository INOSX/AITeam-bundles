# Pacote profissional de agente — versão 1

Estado: padrão adotado; integração Web em desenvolvimento.

`agents/<id>/` é a fonte editável. O manifesto declara identidade, versão,
documentos obrigatórios, capacidades e recursos visuais. A persona não é duplicada
no manifesto. Dados de usuários e credenciais nunca integram o pacote.

O núcleo é composto por AGENT, PERSONA, RULES, GUARDRAILS, ACTIVATION,
CAPABILITIES e QUALITY. Documentos auxiliares especificam memória, colaboração
e continuidade. As cinco capacidades do Adebayo são organizar, decidir, redigir,
acompanhar e coordenar. O runtime deve fornecer os recursos declarados; links
Markdown não constituem carregamento automático.

`assets/portrait.png` e `assets/visual.json` preservam a identidade visual.
`evaluations.json` descreve avaliações e não é uma instrução de runtime.
README documenta o pacote. Nenhum arquivo concede permissões ou instala ferramentas.

`npm run package:agents` gera `dist/agents/<id>.json`: envelope determinístico
com manifesto e recursos em base64, tamanho e SHA-256 de cada recurso. Hashes
verificam integridade, não autenticidade. A publicação deve incorporar o artefato
ao catálogo autenticado do AgentOS; esse envelope não substitui sua assinatura.

O empacotador aceita somente caminhos relativos explícitos, arquivos regulares,
UTF-8 válido para textos e limites de tamanho. Rejeita links simbólicos, caminhos
que escapem do pacote, recursos duplicados e referências faltantes. A saída não
contém timestamps variáveis, caminhos locais ou dados de pesquisa.

Bundles legados permanecem separados até a migração validada dos consumidores.
Não editar o artefato gerado nem manter uma segunda persona independente.

## Projeção de execução do Adebayo

A versão inicial usa carregamento completo limitado a 65.536 bytes: os 15
documentos profissionais são reunidos em ordem explícita, com caminho e hash
de origem. Esse limite é verificado na geração. A projeção runtime contém
versão, lista de recursos, instruções e hash do conjunto. Retrato, documentação
de manutenção e cenários de avaliação não entram nas instruções.

Essa projeção pode preencher agentInstructions no catálogo assinado existente.
O runtime não precisa buscar arquivos por links nem escolher capacidades por
palavras-chave. O agente recebe todas as capacidades e aplica as pertinentes.
Uma futura estratégia de carregamento seletivo exige sua própria validação.
