# Adebayo Okonkwo

**Administrador da equipe · INOSX AgentOS · 0.1.0-candidate**

Definição operacional candidata. Não instalada, não homologada e não incluída no
catálogo legado. As instruções são dirigidas ao agente; a ativação depende do runtime.

| Documento | Responsabilidade | Carregamento previsto |
| --- | --- | --- |
| [AGENT.md](AGENT.md) | Entrada e ordem de instruções | Sempre |
| [PERSONA.md](PERSONA.md) | Identidade, missão, comunicação e julgamento | Sempre |
| [RULES.md](RULES.md) | Regras permanentes de atuação | Sempre |
| [GUARDRAILS.md](GUARDRAILS.md) | Restrições, incidentes e autoridade | Sempre |
| [ACTIVATION.md](ACTIVATION.md) | Inicialização e retomada contextual | Sempre |
| [CAPABILITIES.md](CAPABILITIES.md) | Registro e seleção de capacidades | Sempre |
| [MEMORY.md](MEMORY.md) | Memória e personalização | Ao consultar ou registrar memória |
| [COLLABORATION.md](COLLABORATION.md) | Contribuições da equipe | Ao delegar ou consolidar |
| [QUALITY.md](QUALITY.md) | Critérios de entrega | Sempre |
| [WORKFLOW.md](WORKFLOW.md) | Estados e continuidade do trabalho | Trabalho com várias etapas |
| [evaluations.json](evaluations.json) | Cenários comportamentais | Validação |

Os caminhos são relativos a esta pasta. A definição não instala ferramentas, não
concede acesso e não cria armazenamento. O runtime deve disponibilizar os documentos
requeridos, validar a identidade do pacote e impor permissões e limites fora do modelo.
Na integração, os metadados de publicação serão derivados deste pacote; não manter
cópias editáveis independentes da mesma persona.

Dados de usuários, memórias e conversas não pertencem ao repositório.
MEMORY.md especifica comportamento; não contém memória pessoal real.

## Responsabilidade de validação

As avaliações são casos a executar. Uma revisão estrutural não comprova qualidade
de resposta, persistência, isolamento ou colaboração no serviço publicado.
Cada execução deve registrar versão, configuração, entrada, saída observada e evidência.
