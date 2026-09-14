# BND-02 — Backup Git INOSX

Verificação inicial de 14/09/2026: cinco branches copiadas com hashes idênticos;
origem sem tags. Clone independente do backup passou em `git fsck --full`.
As refs internas de pull requests do GitHub não são branches de desenvolvimento
nem são espelhadas; issues, comentários de PR e configurações do serviço não
fazem parte deste backup Git.

Fonte principal: https://github.com/INOSX/AITeam-bundles

Backup privado: http://inosx.git.local:3000/INOSX/AgentOS-Bundles

Após cada publicação aprovada no GitHub, executar `scripts/sync-inosx-backup.ps1`
em um checkout com origin e gitea configurados para esses endereços.
O script busca o GitHub, envia todas as branches/tags atomicamente, verifica os hashes
e retorna erro se houver divergência, falha de rede ou alteração simultânea da origem.
Não força push nem apaga referências. A falha precisa ser informada no encerramento
da publicação; sucesso no GitHub não implica backup concluído.

Não há agendamento automático configurado nesta etapa. A execução integra o
procedimento de publicação. Runners públicos do GitHub não alcançam o domínio local;
uma automação futura precisa executar na rede INOSX.

Branches/tags do GitHub são cópias, não linhas independentes de desenvolvimento.
Refs exclusivas de recuperação privada podem existir no backup e não devem ser enviadas
ao GitHub ou consumidas pelo produto.

## Recuperação

Clonar o endereço INOSX para um diretório novo, executar `git fsck --full` e
comparar `git ls-remote --refs` das branches/tags com a fonte. Para recuperar trabalho,
usar uma branch nova; não substituir o GitHub por force-push automaticamente.

## Material local adicional

Os 23 diretórios não rastreados permanecem intactos no checkout original.
Uma cópia ZIP privada de recuperação foi criada e comparada por SHA-256 de cada
arquivo com `inventory.json`. O conteúdo não passou a fazer parte do catálogo público.
O ZIP é preservação adicional, não evidência de que esses agentes estejam prontos.
Foram conferidos 114 arquivos extraídos logicamente do ZIP por SHA-256, sem
modificar os originais. SHA-256 do ZIP:
`7d14cf01362ef3019b85056f9ccf9e7ec8deb48c627ebf900fb4187c0fcd95b6`.
