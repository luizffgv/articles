# Use arrays em vez de uniões de tipos

Em TypeScript é comum utilizar uniões de tipos de tipos literais. Como um
exemplo, eu modelarei a lista de evidências do jogo Phasmophobia. Em
Phasmophobia nós caçamos fantasmas e coletamos evidências para determinar o tipo
de um fantasma.

```ts
type Evidência =
  | "Projetor D.O.T.S"
  | "EMF Nível 5"
  | "Temperatura Baixa"
  | "Orbe Fantasma"
  | "Escrita Fantasma"
  | "Spirit Box"
  | "Ultravioleta";
```

Nesse caso TypeScript é útil pois podemos verificar os nomes das evidências.
Suponha que você queira fazer uma função que checa se uma evidência específica
foi encontrada.

```ts
function checarEvidência(evidência) {
  /* ... */
}
```

Sem anotações de tipo é fácil digitar mal o nome de uma evidência, e nada irá te
avisar do erro. Nós podemos aproveitar o TypeScript ao exigir que o parâmetro
`evidência` corresponda à união de tipos `Evidência`.

```ts
function checarEvidência(evidência: Evidência) {
  /* ... */
}
```

Agora, fornecer um argumento errado causará um erro:

```ts
// Erro: Argumento de tipo "Tmpratura Biaxa" não é atribuível a parâmetro de
//       tipo "Evidência".
checarEvidência("Tmpratura Biaxa");
```

Embora a segurança de tipo seja útil, há mais o que possamos fazer. Você não
pode iterar sobre os valores de uma união de tipos, portanto se você quisesse
checar cada evidência você precisaria reescrevê-las.

```ts
for (const evidência of [
  "Projetor D.O.T.S",
  "EMF Nível 5",
  "Temperatura Baixa",
  "Orbe Fantasma",
  "Escrita Fantasma",
  "Spirit Box",
  "Ultravioleta",
] as const)
  checarEvidência(evidência);
```

O código acima possui segurança de tipo; no entanto, não é tão manutenível. Se
uma evidência fosse adicionada ou modificada, você teria que modificar tanto a
união de tipos quanto o laço `for`. Você pode pensar que _enums_ rapidamente vêm
ao resgate, mas iterar sobre um _enum_ produz simples `string`s, e do ponto de
vista do verificador de tipos, uma `string` não é atribuível ao parâmetro
`evidência`.

```ts
enum Evidência {
  Projetor_DOTS,
  EMF_Nível_5,
  Temperatura_Baixa,
  Orbe_Fantasma,
  Escrita_Fantasma,
  Spirit_Box,
  Ultravioleta,
}

function checarEvidência(evidência: Evidência) {
  /* ... */
}

// Erro: Argumento de tipo 'string' não é atribuível a parâmetro de tipo
//       'Evidência'.
for (const evidência in Evidência) checarEvidência(evidência);
```

Para evitar todos esses problemas, em vez de usar uma união de tipos ou um
_enum_, podemos utilizar _arrays_:

```ts
const Evidência = [
  "Projetor D.O.T.S",
  "EMF Nível 5",
  "Temperatura Baixa",
  "Orbe Fantasma",
  "Escrita Fantasma",
  "Spirit Box",
  "Ultravioleta",
] as const;

type Evidência = (typeof Evidência)[number];

function checarEvidência(evidência: Evidência) {
  /* ... */
}

for (const evidência of Evidência) checarEvidência(evidência);
```

No código acima nós determinamos a união de tipos `Evidência` a partir dos
valores do _array_ de mesmo nome. Compartilhar um identificador entre um _array_
e um tipo não é um problema, já que o TypeScript irá determinar à qual entidade
`Evidência` se refere baseado no contexto em que é utilizado. Nós também
utilizamos a asserção _const_ para prevenir que os tipos de nosso literais sejam
"expandidos" para `string`.

Eu encorajo todos a substituírem uniões de tipos literais _hardcoded_ por uniões
inferidas a partir de _arrays_. Você pode não ter um motivo imediato para iterar
sobre todos os valores de um tipo, mas alguém utilizando seu código pode.
