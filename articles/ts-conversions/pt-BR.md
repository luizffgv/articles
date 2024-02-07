# Conversões em TypeScript com ts-conversions

Embora o TypeScript forneça uma extensa segurança de tipos, às vezes você
precisa repetir o mesmo código de boilerplate várias vezes para satisfazer o
verificador de tipos. O pacote NPM
[@luizffgv/ts-conversions](https://www.npmjs.com/package/@luizffgv/ts-conversions)
foi criado para fornecer funções simples que tornam o trabalho com TypeScript
uma experiência mais rápida e confortável. Aqui, daremos uma olhada nas poucas
funções do pacote.

## A função `uncheckedCast`

Não é incomum que código TypeScript seja repleto de asserções de tipo inseguras;
embora seja desejável reduzir tais ocorrências ao mínimo, pode haver algumas
remanescentes. É por isso que existe o `uncheckedCast`.

O `uncheckedCast` destina-se a substituir a palavra-chave `as`. Aqui está uma
maneira de usar o `uncheckedCast` para afirmar o tipo de um elemento HTML
obtido, com o tipo alvo especificado como argumento de tipo.

```ts
// tipo: HTMLElement | null
const input = document.getElementById("input");

// tipo: HTMLInputElement
const input2 = uncheckedCast<HTMLInputElement>(input);
```

Embora o `uncheckedCast` possa ser usado para afirmar um tipo especificado
manualmente, o tipo também pode ser inferido omitindo o argumento de tipo.

```ts
function exibirValor(element: HTMLInputElement) {
  console.log(element.value);
}

// tipo: HTMLElement | null
const input = document.getElementById("input");

// Aqui, o parâmetro de tipo do `uncheckedCast` é inferido como HTMLInputElement
// devido à assinatura da função `exibirValor`.
exibirValor(uncheckedCast(input));
```

Ocorrências de `uncheckedCast` podem ser facilmente encontradas no código e
também são feias, exatamente como _code smells_ devem ser.

## A função `trySpecify`

`uncheckedCast` não fornece nenhum tipo de verificação de tipo, então deve ser
usado com parcimônia. Uma alternativa segura ao `uncheckedCast` é o
`trySpecify`, que refina tipos ao longo da árvore de herança.

`trySpecify` recebe um valor e um construtor, em seguida, retorna o valor com
seu tipo refinado como o tipo de classe do construtor. Se o valor não for uma
instância desse tipo, a função lança uma exceção.

```ts
// tipo: HTMLElement | null
const input = document.getElementById("input");

// tipo: HTMLInputElement
const refined = trySpecify(input, HTMLInputElement);
```

O tipo de retorno de uma chamada de `trySpecify` é `never` se, do ponto de vista
da verificação de tipo, a chamada garantidamente lançará uma exceção. Isso
ocorre quando você tenta refinar um valor para um tipo que não faz parte de sua
árvore de herança.

```ts
// tipo: HTMLElement | null
const input = document.getElementById("input");

// tipo: never
const refined = trySpecify(input, Number);
```

## A função `throwIfNull`

É bastante comum lançar uma exceção se um valor obrigatório for nulo.
`throwIfNull` simplesmente fornece uma forma de fazer precisamente isso em uma
única linha.

```ts
// tipo: HTMLElement | null
const input = document.getElementById("input");

// tipo: HTMLElement
const input2 = throwIfNull(input);
```

O nome da função é um pouco enganador, pois também lança uma exceção quando o
valor é `undefined`.

```ts
const map = new Map<number, number>();

// tipo: number | undefined
const number = map.get(0);

// tipo: number
const number2 = throwIfNull(number);
```

## Conclusão

Essas funções podem não parecer muita coisa, mas comecei a usá-las na maioria
dos meus projetos. Elas são simples, facilmente adaptáveis e funcionam com
JavaScript. Mesmo que você não queira usar esse pacote, eu sugiro fortemente que
você crie funções com JSDoc ou TypeScript para lidar melhor com transformações
de tipo cotidianas.
