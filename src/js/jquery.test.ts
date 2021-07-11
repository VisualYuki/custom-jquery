import {JQ, $} from './jquery';

document.body.outerHTML = `
<body>
	<button class='default-btn default-btn_transparent default-btn_red default-btn_1'>button text</button>
	<button class='default-btn default-btn_transparent default-btn_red default-btn_2'>button text 2</button>
	<button></button>
	<input type='text' value='value'>
	<input class='input-class'>
	<div class='outer'>
		<div class='inner'>
		</div>
	</div>
</body>
`;

describe('class instance', () => {
	test('a length property with many items', () => {
		expect($('button').length).toBe(3);
	});

	test('a length property with zero items', () => {
		expect($('pre').length).toBe(0);
	});

	test('a items getter with one item', () => {
		expect($('.default-btn_1').items[0]).toBe(document.body.querySelector('.default-btn_1'));
	});

	test('creating a jquery instance with one item', () => {
		expect($('.default-btn_1')).toBeInstanceOf(JQ);
	});

	test('creating a jquery instance with zero item', () => {
		expect($('.no-selector')).toBeInstanceOf(JQ);
	});
});

describe('addClass(), removeClass(), toggleClass(), hasClass()', () => {
	test('the addClass, removeClass, toggleClass, hasClass methods with one item', () => {
		$('.default-btn').addClass('default-btn_green');
		expect(document.querySelector('.default-btn').classList.contains('default-btn_green')).toBe(true);
		expect($('.default-btn').hasClass('default-btn_green')).toBe(true);

		$('.default-btn').removeClass('default-btn_green');
		expect(document.querySelector('.default-btn').classList.contains('default-btn_green')).toBe(false);
		expect($('.default-btn').hasClass('default-btn_green')).toBe(false);

		$('.default-btn').toggleClass('default-btn_green');
		expect(document.querySelector('.default-btn').classList.contains('default-btn_green')).toBe(true);

		$('.default-btn').toggleClass('default-btn_green');
	});

	test('the addClass, removeClass, toggleClass methods with many item', () => {
		$('.default-btn').addClass('default-btn_green');
		expect(document.querySelectorAll('.default-btn')[1].classList.contains('default-btn_green')).toBe(true);

		$('.default-btn').removeClass('default-btn_green');
		expect(document.querySelectorAll('.default-btn')[1].classList.contains('default-btn_green')).toBe(false);

		$('.default-btn').toggleClass('default-btn_green');
		expect(document.querySelectorAll('.default-btn')[1].classList.contains('default-btn_green')).toBe(true);

		$('.default-btn').toggleClass('default-btn_green');
	});

	test('the hasClass method with many item', () => {
		expect($('.default-btn').hasClass('default-btn_1')).toBe(false);
	});

	test('chain of responsibility addClass, removeClass, toggleClass', () => {
		expect($('.default-btn_1').addClass('test-class')).toBeInstanceOf(JQ);
	});
});

describe('each()', () => {
	test('each with many items', () => {
		$('.default-btn').each((el, index) => {
			$(el).addClass('test-class');
		});

		expect($('.default-btn').hasClass('test-class')).toBe(true);
	});

	test('chain of responsibility', () => {
		expect(
			$('.default-btn').each((el, index) => {
				$(el).removeClass('test-class');
			})
		).toBeInstanceOf(JQ);
	});
});

describe('attr(), data(), removeAttr(), removeData()', () => {
	test('attr, data with set option', () => {
		$('.default-btn_1').attr('id', '12');
		expect(document.body.querySelector('.default-btn_1').getAttribute('id')).toBe('12');

		$('.default-btn_1').data('id', '30');

		expect(document.body.querySelector('.default-btn_1').getAttribute('data-id')).toBe('30');
	});

	test('attr, data with get option', () => {
		expect($('.default-btn_1').attr('id')).toBe('12');
		expect($('.default-btn_1').data('id')).toBe('30');
	});

	test('removeAttr, removeData', () => {
		$('.default-btn_1').removeAttr('id');
		expect(document.body.querySelector('.default-btn_1').getAttribute('id')).toBeNull();

		$('.default-btn_1').removeData('id');
		expect(document.body.querySelector('.default-btn_1').getAttribute('data-id')).toBeNull();
	});
});

describe('html(), text(), append()', () => {
	test('text() ', () => {
		expect($('button').text()).toBe('button text');
		expect($('no-tag').text()).toBeUndefined();
		$('button').text('new button text');
		expect(document.body.querySelector('button').textContent).toBe('new button text');
		$('button').text('button text');
	});

	test('html() ', () => {
		expect($('.outer').html()).toBe(document.body.querySelector('.outer').innerHTML);
		expect($('.outer').find('.ho-child').items[0]).toBeUndefined();
		$('.outer').html('<div></div>');
		expect(document.body.querySelector('.outer').innerHTML).toBe('<div></div>');
		$('.outer').html("<div class='inner'></div>");
	});

	test('append() ', () => {
		$('.outer').append('afterbegin', '<div></div>');
		expect($('.outer').find('div').length).toBe(2);

		$('.outer').append('beforeend', '<div></div>');
		expect($('.outer').find('div').length).toBe(3);

		$('.outer').append('beforeend', document.createElement('div'));
		expect($('.outer').find('div').length).toBe(4);

		$('.outer').append('beforeend', [document.createElement('div'), document.createElement('div')]);
		expect($('.outer').find('div').length).toBe(6);

		$('.outer').html("<div class='inner'></div>");
	});
});

describe('show(), hide()', () => {
	test('hide() ', () => {
		$('.default-btn_1').hide();
		expect(document.body.querySelector<HTMLElement>('.default-btn_1').style.display).toBe('none');
	});

	test('show() ', () => {
		$('.default-btn_1').show();
		expect(document.body.querySelector<HTMLElement>('.default-btn_1').style.display).toBe('block');
	});

	test('hide(1000) ', () => {
		$('.default-btn_1').hide(1000);
		//setTimeout(() => {
		//	expect(document.body.querySelector<HTMLElement>('.default-btn_1').style.height).toBe(1212);
		//}, 500);

		//setTimeout(() => {
		//	expect(document.body.querySelector<HTMLElement>('.default-btn_1').style.display).toBe('none');
		//}, 2000);
	});

	test('show(1000) ', () => {
		$('.default-btn_1').show(1000);

		//setTimeout(() => {
		//	expect(document.body.querySelector<HTMLElement>('.default-btn_1').style.display).toBe('block');
		//}, 2000);
	});
});

describe('val()', () => {
	test('get val with zero item', () => {
		expect($('no-input').val()).toBeUndefined();
	});
	test('get val with many item', () => {
		expect($('input').val()).toBe(document.querySelector('input').getAttribute('value'));
	});
	test('set val with many items', () => {
		$('input').val('new-value');
		expect(document.querySelector('input').getAttribute('value')).toBe('new-value');
		expect(document.querySelectorAll('input')[0].getAttribute('value')).toBe('new-value');
		$('input').val('value');
	});
});

describe('css()', () => {
	test('set css with many items', () => {
		$('input').css({
			borderTop: '1px solid red',
		});

		expect(document.body.querySelectorAll('input')[0].style.borderTop).toBe('1px solid red');
		expect(document.body.querySelectorAll('input')[1].style.borderTop).toBe('1px solid red');
	});

	//test('get css with many items', () => {
	//	expect($('input').css(['borderTop'])).toBe({borderTop: '1px solid red'});
	//});
});

describe('closet(), find(), siblings()', () => {
	test('closest() ', () => {
		expect($('.inner').closest('.no-parent')).toBeUndefined();
		expect($('.inner').closest('.outer').items[0]).toBe(document.body.querySelector('.outer'));
	});

	test('find() ', () => {
		expect($('.outer').find('.inner').items[0]).toBe(document.body.querySelector('.inner'));
		expect($('.outer').find('.ho-child').items[0]).toBeUndefined();
	});

	test('siblings() ', () => {
		expect($('.outer').siblings('.default-btn').length).toBe(2);
		expect($('.outer').siblings('.ho-siblings').length).toBe(0);
	});
});

describe('click()', () => {
	test('click with one item', () => {
		document.querySelector('.default-btn_1').addEventListener('click', function (e) {
			$(this).data('id', '40');
		});

		$('.default-btn_1').click();

		expect($('.default-btn_1').data('id')).toBe('40');
	});
});

describe('ajax', () => {});

//describe("12121", () => {
//	test("should return sum of nums ", () => {
//		expect($("p").text()).toBe("1");
//	});
//});
