# Seletor & em CSS vs. Sass

Na data em que estou escrevendo isso, aninhamento de CSS já é
[suportado](https://caniuse.com/css-nesting) para a maioria dos usuários; isso
inclui o operador de aninhamento `&`, que está disponível há algum tempo em
preprocessadores de CSS como Sass. Embora o aninhamento se comporte
aproximadamente da mesma forma em ambos CSS e Sass, eu recentemente me deparei
com uma diferença que me pegou de surpresa.

## O seletor &

O seletor `&` é utilizado em _nested style rules_; em Sass especificamente ele é
substituído pelos seletores pais dessa _nested style rule_. Como exemplo, aqui
está um código Sass e sua saída CSS.

```sass
/* Sass */
#b {
  #c {
    #a & {
      color: red;
    }
  }
}
```

```css
/* Saída CSS */
#a #b #c {
  color: red;
}
```

Como você pode ver, o `&` foi substituído pelos seletores pai `#b` e então `#c`,
e em seguida a regra foi extraída para o escopo global. Em CSS, o `&` produzirá
um resultado diferente.

```css
/* CSS */
#b {
  #c {
    #a & {
      color: red;
    }
  }
}
```

```css
/* CSS equivalente */
#a :is(#b #c) {
  color: red;
}
```

A diferença entre `#a #b #c` e `#a :is(#b #c)` é a seguinte.

| Seletor         | Correspondência                                                   |
| --------------- | ----------------------------------------------------------------- |
| `#a #b #c`      | Todo `#c` descendente de um `#b` que seja descendente de um `#a`. |
| `#a :is(#b #c)` | Todo `#c` descendente de ambos um `#a` e um `#b`.                 |

O comportamento do segundo seletor pode ser dividido em dois passos. Suponha que
tenhamos um elemento que chamaremos de `X`; para determinar se ele corresponde a
`#a :is(#b #c)`, o processo é o seguinte.

- Passo 1: Verificar se `X` corresponde ao seletor `#b #c`. Se sim, prosseguir
  ao passo seguinte.
- Passo 2: Confirmar se `X` corresponde ao seletor `#a X`.

Para ilustrar esse processo, considere o seguinte HTML e os correspondentes
passos.

```html
<div id="b">
  <div id="a">
    <!-- 👇 Elemento X -->
    <div id="c"></div>
  </div>
</div>
```

- Passo 1: `X` corresponde a `#b #c`?

  Sim. `X` possui ID `c` e é um descendente de `#b`.

- Passo 2: `X` corresponde a `#a X`?

  Sim. `X` é `X` e é um descendente de `#a`.

- É uma correspondência!

## Um exemplo no mundo real

Suponha que você queira fazer o HTML para um post de blog. Em nosso caso, o post
será representado por um elemento `.post`, e irá conter um `.sumário`.

```html
<div class="post">
  <div class="sumário">
    <p class="texto">Pombos não são o que você pensa.</p>
  </div>
  <p class="texto">Pombos são drones feitos pelo governo.</p>
</div>
```

Agora vamos destacar o texto do sumário com CSS.

```css
.post {
  .texto {
    .sumário & {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
}
```

Os seletores CSS acima se traduzem como `.sumário :is(.post .texto)`, e o
sumário é estilizado corretamente. Quando você usa o mesmo código em Sass, o
seletor resultante é `.sumário .post .texto`, que não corresponde ao nosso
`.text` pois nosso `.post` não é um descendente de `.sumário`.

## Conclusão

Embora sutil, a disparidade entre CSS e Sass a respeito do seletor `&` pode
causar muita confusão e dores de cabeça. Há uma
[issue no repositório do Sass](https://github.com/sass/sass/issues/3030) a
respeito disso e talvez algum dia o `&` seja tratado de maneira igual, mas por
enquanto, você precisa estar atento a se está utilizando CSS puro ou não.
