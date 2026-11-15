# Comentador para desafios do Instagram

Script que comenta automaticamente numa publicação do Instagram, com pausas
entre comentários. Foi feito para desafios do tipo "quem comentar mais ganha"
em que **o organizador permite automação**.

Baseia-se na ideia do [Fytex/Instagram-Giveaways-Winner](https://github.com/Fytex/Instagram-Giveaways-Winner)
(licença MIT), que está desatualizado desde 2021, mas foi reescrito de raiz com Playwright.

## O que faz e o que não faz

- **Não faz login por ti** nem pede a tua palavra-passe. Fazes login à mão no
  navegador que abre; a sessão fica guardada na pasta `perfil-navegador/`.
- Comenta só na publicação que indicares, com uma pausa aleatória entre
  `--intervalo-min` e `--intervalo-max` segundos (mínimo de 30 s).
- Para sozinho quando:
  - chega a `--max` comentários;
  - o Instagram mostra um aviso de bloqueio ou restrição;
  - dois comentários seguidos falham.
- Guarda cada tentativa em `registo.csv`.

## Instalação

Precisas de Python 3.9 ou mais recente.

```bash
pip install -r requirements.txt
```

```bash
python -m playwright install chromium
```

## Utilização

1. Edita `comentarios.txt` (um comentário por linha, quanto mais variados melhor).
2. Corre:

```bash
python comentador.py --post https://www.instagram.com/p/CODIGO_DA_PUBLICACAO/
```

3. No navegador que abre, faz login e confirma que estás na publicação.
4. Volta ao terminal e carrega em Enter. Para parar a qualquer momento: `Ctrl+C`.

Para testar sem publicar nada (escreve na caixa e apaga):

```bash
python comentador.py --post https://www.instagram.com/p/CODIGO/ --simular --max 3 --intervalo-min 30 --intervalo-max 30
```

### Opções

| Opção | Por omissão | Descrição |
|---|---|---|
| `--post` | (obrigatório) | URL da publicação |
| `--comentarios` | `comentarios.txt` | ficheiro com os comentários |
| `--intervalo-min` | `90` | pausa mínima em segundos (não aceita menos de 30) |
| `--intervalo-max` | `180` | pausa máxima em segundos |
| `--max` | `50` | máximo de comentários por sessão |
| `--perfil` | `perfil-navegador` | pasta da sessão do navegador |
| `--registo` | `registo.csv` | histórico em CSV |
| `--simular` | — | não publica, só testa |
| `--chrome` | — | caminho para um Chrome já instalado |

## Avisos importantes

- O Instagram limita a quantidade de comentários por conta. Se aparecer
  "Tente novamente mais tarde", o script para. **Não o voltes a correr logo a
  seguir**: espera pelo menos 24 h, senão o bloqueio pode ficar mais longo.
- Intervalos curtos e sessões longas aumentam o risco de bloqueio. Começa com
  os valores por omissão e um `--max` baixo.
- A pasta `perfil-navegador/` tem a tua sessão do Instagram. **Não a partilhes**
  (já está no `.gitignore`).
- Automação de comentários vai contra os Termos de Utilização do Instagram;
  usas por tua conta e risco, e só em desafios cujo organizador o permita.
- O Instagram muda o site com frequência. Se aparecer "Não encontrei a caixa
  de comentário", o seletor `SELETOR_CAIXA` em `comentador.py` pode precisar
  de ser atualizado.
