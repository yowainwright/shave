## Truncated.js

Truncated.js is a javascript plugin that shortens a text string based on a specified max-height & adds an ellipsis at the end.

### Setup

```terminal
npm install truncated.js --save-dev
```
```terminal
bower install truncated.js --save-dev
```

### Run

1. Include **truncated.js** into your `vendor` file or in a `<script>` tag.
2. Add truncated `css/scss`  to your `css`.
3. `truncate` the element you'd like to give truncation to. 

```javascript
truncated('selector', maxHeight);🔥
```

### Basic Examples

**Basic**
```javascript
truncated('selector', maxHeight);
```

**Or Multiples**
```javascript
truncated('selector', maxHeight);
```

**But not this one**
```javascript
truncated('selector:not([not this selector])', maxHeight);
```

### How?

**Truncated.js** trims a text string to a last full word of what can fit within a specified max height.

### Why?

**Truncated.js** is made for a need for simpicity when it comes to text truncation. Several plugins that I've reviewed oversolve the issue for what people want when they want text truncation - _for text to look nice in a specified space_. Here's a basic [example](http://codepen.io/yowainwright/pen/xEwNKJ).

This plugin is small - `~1kb` unminified & is meant to do 1 thing - _truncate text based on a specified max height_. 

### Options

If you'd like to not use the classname 'js-truncated', just use your own. 

```javascript
reframe('selector', 'classname');
```
### jQuery

There is [jQuery](https://jquery.com/) version of **Truncated.js** which is even smaller (~76b) than plain **Truncated.js** unminified - so use it if you're already using jQuery.

```javascript
$('selector').reframe(maxheight);
```
&, if you'd like to use a custom classname instead of 'js-truncated'

```javascript
$('selector').reframe(maxheight, 'classname');
```
### Issues

Truncation will produce results that are only questionably better. ***Truncated.js** does not measure line height + text height, store the original text value or count characters by desicion. If you'd like to do that, you could do that in a parent function before calling **Truncation.js**. 