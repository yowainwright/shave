<p align="center">
  <img alt="Shave" src="https://yowainwright.imgix.net/gh/shave-thin.svg" />
</p>
<hr>
<p align="center">
  <a href="https://www.npmjs.com/package/shave">
    <img src="https://badge.fury.io/js/shave.svg" alt="npm" />
  </a>
  <a href="https://unpkg.com/shave@latest/dist/shave.min.js">
    <img alt="unpkg" src="https://img.shields.io/badge/unpkg-link-blue.svg">
  </a>
   <a href="https://snyk.io/test/github/yowainwright/shave">
    <img alt="snyk" src="https://snyk.io/test/github/yowainwright/shave/badge.svg" />
  </a>
  <a href="https://cdnjs.com/libraries/shave">
    <img src="https://img.shields.io/cdnjs/v/shave.svg" alt="CDNJS" />
  </a>
  <a href="https://twitter.com/home?status=Shave%20is%20a%200%20dep%20js%20lib%20that%20truncates%20multiline%20text%20to%20fit%20within%20a%20html%20element%20%E2%9C%81https%3A%2F%2Fgithub.com%2Fdollarshaveclub%2Fshave%20%40DSCEngineering%20%23JavaScript%20%F0%9F%92%AA">
    <img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social&maxAge=2592000" alt="Twitter share" />
  </a>
</p>

---

<h1 align="center">Shave ✁</h1>

**Shave** is a zero dependency javascript plugin that truncates multi-line text to fit within an html element based on a set pixel number **max-height**. It then stores the _diff_ of the original text string in a hidden `<span>` element following the visible text. This means the original text remains intact!

---

**Shave, compared to other truncation plugins:**

- maintains the original text after truncation.
- does not require other libraries
- only requires a selector and a max height
- is very lightweight; `~1.5kb` unminified
- allows for custom ellipsis strings and class names but doesn't over complicate
- **new!** provides ellipsis link functionality
- is fast and capable of truncating text within lots of elements [quickly](http://codepen.io/pwfisher/full/ozVAyr/)
- is additive. It will play nice with other javascript libraries and more truncation features can easily be built with it.
- supports non-spaced languages ([Non-ascii](https://en.wikipedia.org/wiki/ASCII)).

## Installing from a package manager

```sh
npm i shave -D
```

```
yarn add shave -D
```

```
pnpm i shave -D
```

## Usage

Add **dist/shave.js** to your html

- Or, **dist/jquery.shave.js** for jQuery/Zepto as of Shave >= v2.

Or as a module

```javascript
import shave from 'shave';
```

## Arguments

Argument structure is as follows:

```javascript
shave("selector", maxheight, { options });
```

Argument type breakdown:

| argument | type  | required | description | example |
| :--------: | :----------: | :------: | :------: | :------: |
| `"selector"` | `string`  | yes | used to select items to shave | `".js-is-shaved"` |
| `maxheight` | `number`  | yes | used to specify the maximum height | `50` |
| `"options"` | `object`  | no | use to modify how items are shaved | `{ character: "..." }` |

Options `object` breakdown:

| options | `type` | `default` | `description` |
| :--------: | :------: | :------: | :------: |
| **character:** | `string` | `"…"` | character to use for ellipsis |
| **charclassname:** | `string` | `'js-shave-char'` | class name to use for ellipsis element |
| **classname:** |  `string` | `'js-shave'` | class to add to the element |
| **spaces:** | `boolean` | `false` | if true, spaces will be preserved** |
| **link:** | `object` | `undefined` | an object accepting any link accociated |


## Syntax

Basic setup

```javascript
shave("selector", maxheight);
// shave('.shave-selector', 0) for example
```

**Shave also provided options _only_ to overwrite what it uses.**

If you'd like have custom class names and not use `.js-shave`:

```javascript
shave("selector", maxheight, { classname: "classname" });
```

Or if you'd like to have custom characters (instead of the standard ellipsis):

```javascript
shave("selector", maxheight, { character: "✁" });
```

Or both:

```javascript
shave("selector", maxheight, { classname: "classname", character: "✁" });
```

Without spaces:

```javascript
shave("selector", maxheight, { spaces: false });
```

With an `<a>` (link) tag:

```javascript
/**
 * @notes
 * - provide your desired link attributes here!
 * @note link attributes trump the character option and className of the ellipsis element
 */
shave("selector", maxheight, { link: LinkObject });
```

---

You can also use **shave** as a [jQuery](http://jquery.com/) or [Zepto](http://zeptojs.com/) plugin. As of Shave >= v2, use **dist/jquery.shave.js** for jQuery/Zepto.

```javascript
$("selector").shave(maxheight);
```

And here's a _jQuery/Zepto_ example with custom options:

```javascript
$("selector").shave(maxheight, { classname: "your-css-class", character: "✁" });
```

If you're using a non-spaced language, you can support shave by setting an option `spaces` to `false`.

```javascript
$("selector").shave(maxheight, {
  classname: "your-css-class",
  character: "✁",
  spaces: false
});
```

With an `<a>` (link) tag:

```javascript
/**
 * @notes
 * - provide your desired link attributes here!
 * @note link attributes trump the character option and className of the ellipsis element
 */
$("selector").shave(maxheight, { link: LinkObject });
```

## Prefer Link Functionality

The **shave** plugin provides a **link** option—an `<a>` element which replaces the default `<span>` element.
As **any** functionality that is needed without an `href` attribute can be made using the default `<span>` element, the `<a>` is only rendered if the `href` attribute is provided.

Any attributes that can be used for an `<a>` element can be added to the link object when invoking **shave**.
Additionally `textContent` can be added to replace the default `character` option.

Here's a more in-depth example than the basic example(s) above:

```javascript
shave("selector", 50, { link: { href: 'https://www.google.com', textContent: 'Read More here' } });
```

> **note:** if an `href` is not specified, the link will not be created!

## Examples

[Codepen example](http://codepen.io/yowainwright/pen/5f471214df90f43c7996c5914c88e858/) with plain javascript.

[Codepen example](http://codepen.io/yowainwright/pen/c35ad7a281bc58ce6f89d2adb94c5d14/) with jQuery.

[Codepen example](http://codepen.io/yowainwright/pen/wzVgMp) with a non-spaced language.

## Notes

`text-overflow: ellipsis` is the way to go when truncating text to a single line. Shave does something very similar to `text-overflow: ellipsis` but for _multiple lines_ when [line-clamp](https://caniuse.com/#feat=css-line-clamp) is not supported. Shave bypasses being a `line-clamp` polyfill by only accepting a max-height number. This keeps shave a fast and light weight utility.

Shave implements a [binary search](http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/) to truncate text in the most optimal way possible.

Shave is meant to truncate text within a selected html element. This means it will overwrite html within an html element with just the text within the selected element.

Here are some super basic examples of shave with [window resize](http://codepen.io/yowainwright/pen/yVBxGY) and [click](http://codepen.io/yowainwright/pen/PbYdvL/) events. 🙌

Shave works in all modern browsers and was tested in some not so modern browsers (like Internet Explorer 8) - it works there too. 🍻

---

[Created](https://github.com/yowainwright/truncated.js) and maintained by [Jeff Wainwright](https://github.com/yowainwright) with [Dollar Shave Club Engineering](https://github.com/dollarshaveclub).
