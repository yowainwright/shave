/* global QUnit, shave, $ */

var testText = '<p class="test"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin imgone orimgone eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor. Duis varius purus pellentesque luctus vestibulum. In ex dui, maximus vitae nisl a, molestie malesuada purus. Duis semper est in varius mattis. Pellentesque mollis convallis ex eu pretium. Vivamus eleifend nunc a sem euismod, non consequat purus varius. Donec hendrerit eleifend ex ac cursus. Ut ac nibh quis massa rhoncus accumsan. Praesent ultricies arcu quis magna tempus, vitae tristique diam euismod. Proin accumsan quam magna, quis condimentum diam lacinia et. Quisque tempor tellus neque, vitae facilisis dui mollis sit amet. Sed sit amet augue ac mi cursus egestas nec gravida velit. Suspendisse eu nunc tristique lorem eleifend vulputate. Aliquam viverra ex sed augue mollis, eu feugiat purus volutpat. Donec consectetur a lectus ac accumsan. Aenean massa libero, pellentesque a ultrices nec, commodo eget neque. Duis blandit augue et tempus egestas. Aenean facilisis lectus eget venenatis blandit. Nam porta sollicitudin erat, at fermentum eros iaculis ut. </p><p class="test-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p class="test-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor. Duis varius purus pellentesque luctus vestibulum. In ex dui, maximus vitae nisl a, molestie malesuada purus. Duis semper est in varius mattis. Pellentesque mollis convallis ex eu pretium.Vivamus eleifend nunc a sem euismod, non consequat purus varius. Donec hendrerit eleifend ex ac cursus. Ut ac nibh quis massa rhoncus accumsan. Praesent ultricies arcu quis magna tempus, vitae tristique diam euismod. Proin accumsan quam magna, quis condimentum diam lacinia et. Quisque tempor tellus neque, vitae facilisis dui mollis sit amet. Sed sit amet augue ac mi cursus egestas nec gravida velit. Suspendisse eu nunc tristique lorem eleifend vulputate. Aliquam viverra ex sed augue mollis, eu feugiat purus volutpat. Donec consectetur a lectus ac accumsan. Aenean massa libero, pellentesque a ultrices nec, commodo eget neque. Duis blandit augue et tempus egestas. Aenean facilisis lectus eget venenatis blandit. Nam porta sollicitudin erat, at fermentum eros iaculis ut. </p><p class="test-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor. Duis varius purus pellentesque luctus vestibulum. In ex dui, maximus vitae nisl a, molestie malesuada purus. Duis semper est in varius mattis. Pellentesque mollis convallis ex eu pretium.Vivamus eleifend nunc a sem euismod, non consequat purus varius. Donec hendrerit eleifend ex ac cursus. Ut ac nibh quis massa rhoncus accumsan. Praesent ultricies arcu quis magna tempus, vitae tristique diam euismod. Proin accumsan quam magna, quis condimentum diam lacinia et. Quisque tempor tellus neque, vitae facilisis dui mollis sit amet. Sed sit amet augue ac mi cursus egestas nec gravida velit. Suspendisse eu nunc tristique lorem eleifend vulputate. Aliquam viverra ex sed augue mollis, eu feugiat purus volutpat. Donec consectetur a lectus ac accumsan. Aenean massa libero, pellentesque a ultrices nec, commodo eget neque. Duis blandit augue et tempus egestas. Aenean facilisis lectus eget venenatis blandit. Nam porta sollicitudin erat, at fermentum eros iaculis ut. </p><p class="test-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p class="test-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor. Duis varius purus pellentesque luctus vestibulum. In ex dui, maximus vitae nisl a, molestie malesuada purus. Duis semper est in varius mattis. Pellentesque mollis convallis ex eu pretium.Vivamus eleifend nunc a sem euismod, non consequat purus varius. Donec hendrerit eleifend ex ac cursus. Ut ac nibh quis massa rhoncus accumsan. Praesent ultricies arcu quis magna tempus, vitae tristique diam euismod. Proin accumsan quam magna, quis condimentum diam lacinia et. Quisque tempor tellus neque, vitae facilisis dui mollis sit amet. Sed sit amet augue ac mi cursus egestas nec gravida velit. Suspendisse eu nunc tristique lorem eleifend vulputate. Aliquam viverra ex sed augue mollis, eu feugiat purus volutpat. Donec consectetur a lectus ac accumsan. Aenean massa libero, pellentesque a ultrices nec, commodo eget neque. Duis blandit augue et tempus egestas. Aenean facilisis lectus eget venenatis blandit. Nam porta sollicitudin erat, at fermentum eros iaculis ut.</p><p class="test-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p class="test-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> <p class="test-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor. Duis varius purus pellentesque luctus vestibulum. In ex dui, maximus vitae nisl a, molestie malesuada purus. Duis semper est in varius mattis. Pellentesque mollis convallis ex eu pretium.Vivamus eleifend nunc a sem euismod, non consequat purus varius. Donec hendrerit eleifend ex ac cursus. Ut ac nibh quis massa rhoncus accumsan. Praesent ultricies arcu quis magna tempus, vitae tristique diam euismod. Proin accumsan quam magna, quis condimentum diam lacinia et. Quisque tempor tellus neque, vitae facilisis dui mollis sit amet. Sed sit amet augue ac mi cursus egestas nec gravida velit. Suspendisse eu nunc tristique lorem eleifend vulputate. Aliquam viverra ex sed augue mollis, eu feugiat purus volutpat. Donec consectetur a lectus ac accumsan. Aenean massa libero, pellentesque a ultrices nec, commodo eget neque. Duis blandit augue et tempus egestas. Aenean facilisis lectus eget venenatis blandit. Nam porta sollicitudin erat, at fermentum eros iaculis ut. </p> <p class="test-3">會全用民知多起功在有場館爾期臺多而不雄山選在場地市者電養說化運面遊聲時上教要下素的正一曾又如到性喜色體歷定部手里克業選陽響水起金園際吃權終麼意建本分香來象洋道方業動害有不財是了題此然把經會得善所建那各相標一來依正員由不古達解工面想推的</p> <p class="test-3">那各相標一來依正員由不古達解工面想推的。</p> <p class="test-3">會全用民知多起功在有場館爾期臺多而不雄山選在場地市者電養說化運面遊聲時上教要下素的正一曾又如到性喜色體歷定部手里克業選陽響水起金園際吃權終麼意建本分香來象洋道方業動害有不財是了題此然把經會得善所建那各相標一來依正員由不古達解工面想推的</p> <p id="test"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor. Duis varius purus pellentesque luctus vestibulum. In ex dui, maximus vitae nisl a, molestie malesuada purus. Duis semper est in varius mattis. Pellentesque mollis convallis ex eu pretium. Vivamus eleifend nunc a sem euismod, non consequat purus varius. Donec hendrerit eleifend ex ac cursus. Ut ac nibh quis massa rhoncus accumsan. Praesent ultricies arcu quis magna tempus, vitae tristique diam euismod. Proin accumsan quam magna, quis condimentum diam lacinia et. Quisque tempor tellus neque, vitae facilisis dui mollis sit amet. Sed sit amet augue ac mi cursus egestas nec gravida velit. Suspendisse eu nunc tristique lorem eleifend vulputate. Aliquam viverra ex sed augue mollis, eu feugiat purus volutpat. Donec consectetur a lectus ac accumsan. Aenean massa libero, pellentesque a ultrices nec, commodo eget neque. Duis blandit augue et tempus egestas. Aenean facilisis lectus eget venenatis blandit. Nam porta sollicitudin erat, at fermentum eros iaculis ut. </p> <p id="test-2"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor. Duis varius purus pellentesque luctus vestibulum. In ex dui, maximus vitae nisl a, molestie malesuada purus. Duis semper est in varius mattis. Pellentesque mollis convallis ex eu pretium. Vivamus eleifend nunc a sem euismod, non consequat purus varius. Donec hendrerit eleifend ex ac cursus. Ut ac nibh quis massa rhoncus accumsan. Praesent ultricies arcu quis magna tempus, vitae tristique diam euismod. Proin accumsan quam magna, quis condimentum diam lacinia et. Quisque tempor tellus neque, vitae facilisis dui mollis sit amet. Sed sit amet augue ac mi cursus egestas nec gravida velit. Suspendisse eu nunc tristique lorem eleifend vulputate. Aliquam viverra ex sed augue mollis, eu feugiat purus volutpat. Donec consectetur a lectus ac accumsan. Aenean massa libero, pellentesque a ultrices nec, commodo eget neque. Duis blandit augue et tempus egestas. Aenean facilisis lectus eget venenatis blandit. Nam porta sollicitudin erat, at fermentum eros iaculis ut. </p> <p id="test-3"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. <span class="js-shave-char">...</span> <span class="js-new-text">Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor. Duis varius purus pellentesque luctus vestibulum. In ex dui, maximus vitae nisl a, molestie malesuada purus. Duis semper est in varius mattis. Pellentesque mollis convallis ex eu pretium. Vivamus eleifend nunc a sem euismod, non consequat purus varius. Donec hendrerit eleifend ex ac cursus. Ut ac nibh quis massa rhoncus accumsan. Praesent ultricies arcu quis magna tempus, vitae tristique diam euismod. Proin accumsan quam magna, quis condimentum diam lacinia et. Quisque tempor tellus neque, vitae facilisis dui mollis sit amet. Sed sit amet augue ac mi cursus egestas nec gravida velit. Suspendisse eu nunc tristique lorem eleifend vulputate. Aliquam viverra ex sed augue mollis, eu feugiat purus volutpat. Donec consectetur a lectus ac accumsan. Aenean massa libero, pellentesque a ultrices nec, commodo eget neque. Duis blandit augue et tempus egestas. Aenean facilisis lectus eget venenatis blandit. Nam porta sollicitudin erat, at fermentum eros iaculis ut. </span> </p> <p id="test-4"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor. Duis varius purus pellentesque luctus vestibulum. In ex dui, maximus vitae nisl a, molestie malesuada purus. Duis semper est in varius mattis. Pellentesque mollis convallis ex eu pretium. Vivamus eleifend nunc a sem euismod, non consequat purus varius. Donec hendrerit eleifend ex ac cursus. Ut ac nibh quis massa rhoncus accumsan. Praesent ultricies arcu quis magna tempus, vitae tristique diam euismod. Proin accumsan quam magna, quis condimentum diam lacinia et. Quisque tempor tellus neque, vitae facilisis dui mollis sit amet. Sed sit amet augue ac mi cursus egestas nec gravida velit. Suspendisse eu nunc tristique lorem eleifend vulputate. Aliquam viverra ex sed augue mollis, eu feugiat purus volutpat. Donec consectetur a lectus ac accumsan. Aenean massa libero, pellentesque a ultrices nec, commodo eget neque. Duis blandit augue et tempus egestas. Aenean facilisis lectus eget venenatis blandit. Nam porta sollicitudin erat, at fermentum eros iaculis ut. </p> <p id="test-5"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor. Duis varius purus pellentesque luctus vestibulum. In ex dui, maximus vitae nisl a, molestie malesuada purus. Duis semper est in varius mattis. Pellentesque mollis convallis ex eu pretium. Vivamus eleifend nunc a sem euismod, non consequat purus varius. Donec hendrerit eleifend ex ac cursus. Ut ac nibh quis massa rhoncus accumsan. Praesent ultricies arcu quis magna tempus, vitae tristique diam euismod. Proin accumsan quam magna, quis condimentum diam lacinia et. Quisque tempor tellus neque, vitae facilisis dui mollis sit amet. Sed sit amet augue ac mi cursus egestas nec gravida velit. Suspendisse eu nunc tristique lorem eleifend vulputate. Aliquam viverra ex sed augue mollis, eu feugiat purus volutpat. Donec consectetur a lectus ac accumsan. Aenean massa libero, pellentesque a ultrices nec, commodo eget neque. Duis blandit augue et tempus egestas. Aenean facilisis lectus eget venenatis blandiam porta sollicitudin erat, at fermentum eros iaculis ut. </p> <p id="test-6"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor. Duis varius purus pellentesque luctus vestibulum. In ex dui, maximus vitae nisl a, molestie malesuada purus. Duis semper est in varius mattis. Pellentesque mollis convallis ex eu pretium. Vivamus eleifend nunc a sem euismod, non consequat purus varius. Donec hendrerit eleifend ex ac cursus. Ut ac nibh quis massa rhoncus accumsan. Praesent ultricies arcu quis magna tempus, vitae tristique diam euismod. Proin accumsan quam magna, quis condimentum diam lacinia et. Quisque tempor tellus neque, vitae facilisis dui mollis sit amet. Sed sit amet augue ac mi cursus egestas nec gravida velit. Suspendisse eu nunc tristique lorem eleifend vulputate. Aliquam viverra ex sed augue mollis, eu feugiat purus volutpat. Donec consectetur a lectus ac accumsan. Aenean massa libero, pellentesque a ultrices nec, commodo eget neque. Duis blandit augue et tempus egestas. Aenean facilisis lectus eget venenatis blandiam porta sollicitudin erat, at fermentum eros iaculis ut. </p><p id="test-7">會全用民知多起功在有場館爾期臺多而不雄山選在場地市者電養說化運面遊聲時上教要下素的正一曾又如到性喜色體歷定部手里克業選陽響水起金園際吃權終麼意建本分香來象洋道方業動害有不財是了題此然把經會得善所建那各相標一來依正員由不古達解工面想推的</p><p id="test-8">Testzzzzzz with real words. Test with real wordzzzzz. Testzzzzzzz with real wordzzzzzz. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words. Test with real words.</p> <p id="test-9"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor.</p> <p id="test-10"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor.</p><p id="test-11"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor.</p><p id="test-12"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin consequat eros, non posuere justo hendrerit quis. Integer eget risus dapibus, rutrum nisl sit amet, posuere dui. Cras vitae urna ac urna placerat vulputate. Morbi et tortor vel nisi rutrum consequat. Pellentesque non sem cursus, rhoncus nisi sed, semper quam. Phasellus efficitur iaculis auctor. Pellentesque at aliquam leo. Proin diam nulla, mollis vitae nibh sit amet, interdum suscipit risus. Sed fermentum leo enim, a pretium ipsum sollicitudin non. Nunc tempus nunc sed laoreet porttitor.</p>';

$("#tests").append(testText);

QUnit.test(
	"run shave on a paragraph with a class",
	function (assert) {
		shave(".test", 50);
		assert.equal($(".js-shave").length, 1, "there should be 1 .js-shave");
	},
);

QUnit.test(
	"run shave and check with link",
	function (assert) {
		shave("#test-11", 50, { link: { href: "http://example.com" } });
		assert.equal(
			$("#test-11").find(".js-shave-char").prop("tagName"),
			"A",
			"character text should be a link",
		);
		assert.equal(
			$("#test-11").find(".js-shave-char").prop("href"),
			"http://example.com/",
			"character href should be example.com",
		);
	},
);

QUnit.test(
	"run check for html injection",
	function (assert) {
		const alertScript = document.createElement("script");
		alertScript.innerHTML = 'alert("test");';
		shave(
			"#test-12",
			50,
			{
				link: {
					href: "http://example.com",
					textContent: '"' + alertScript + '"',
				},
			},
		);
		const scriptAsString = $("#test-12").find(".js-shave-char")[0].innerHTML;
		assert.equal(
			typeof scriptAsString,
			"string",
			"the script is stringified so it has avoided injection",
		);
	},
);

QUnit.test(
	"run shave a paragraph with an id & unique class",
	function (assert) {
		shave("#test", 70, { classname: "js-test" });
		assert.equal($(".js-test").length, 1, "there should be 1 .js-test");
	},
);

QUnit.test(
	"run shave a paragraph with an id & no class & a special hellip",
	function (assert) {
		shave("#test-2", 70, { character: "🐔", classname: "js-chicken" });
		assert.equal($(".js-chicken").length, 1, "there should be 1 .js-chicken");
	},
);

QUnit.test(
	"run shave a paragraph with an id & no class & a special hellip",
	function (assert) {
		shave("#test-3", 90, { character: "👌", classname: "js-new-text" });
		assert.equal($(".js-new-text").length, 1, "there should be 1 .js-new-text");
	},
);

QUnit.test(
	"run shave iteration",
	function (assert) {
		shave(".test-2", 50, { character: "🙌", classname: "js-iteration-works" });
		assert.equal(
			$(".js-iteration-works").length,
			4,
			"there should be 4 .js-iteration-works",
		);
	},
);

QUnit.test(
	"run shave with non-spaced languages",
	function (assert) {
		shave(
			".test-3",
			50,
			{ character: "...", classname: "js-non-spaced-lang", spaces: false },
		);
		assert.equal(
			$(".js-non-spaced-lang").length,
			2,
			"there should be 2 .js-non-spaced-lang",
		);
	},
);

QUnit.test(
	"run shave with jquery",
	function (assert) {
		$("#test-4").shave(50, { classname: "js-jquery-shave" });
		assert.equal(
			$(".js-jquery-shave").length,
			1,
			"jQuery or Zepto should have been run.",
		);
	},
);

QUnit.test(
	"run shave and check jquery chaining",
	function (assert) {
		$("#test-5").shave(36).css("height", "36px");
		assert.equal(
			$("#test-5").css("height"),
			"36px",
			"jQuery or Zepto should have been run.",
		);
	},
);

QUnit.test(
	"run shave and check similar max height",
	function (assert) {
		shave("#test-6", 36);
		$("#test-5").css("height", "36px");
		assert.equal(
			$("#test-5").css("height"),
			"36px",
			"shave should have still run",
		);
	},
);

QUnit.test(
	"run shave and check similar max height with jQuery",
	function (assert) {
		shave(
			"#test-7",
			50,
			{ character: "...", classname: "js-non-spaced-lang", spaces: false },
		);
		$("#test-7").css("height", "50px").css("max-height", "50px");
		assert.equal(
			$("#test-7").css("height"),
			"50px",
			"shave should have still run",
		);
	},
);

QUnit.test(
	"run shave on a paragraph with a class",
	function (assert) {
		shave("#test-8", 50);
		assert.equal($("#test-8").length, 1, "there should be 1 #test-8");
	},
);

[
	{ spacesOpt: { spaces: true }, elementId: "test-9" },
	{ spacesOpt: { spaces: false }, elementId: "test-10" },
].forEach(function (test) {
	QUnit.test(
		"run shave on the same paragraph multiple times, { spaces: " +
			test.spacesOpt.spaces +
			" }",
		function (assert) {
			var p = document.getElementById(test.elementId);
			shave(p, 50, test.spacesOpt);
			var firstShaveText = p.innerText;
			for (var i = 0; i < 10; i++) {
				shave(p, 50, test.spacesOpt);
			}
			var lastShaveText = p.innerText;
			assert.equal(
				firstShaveText,
				lastShaveText,
				"the innerText should remain the same",
			);
		},
	);
});
