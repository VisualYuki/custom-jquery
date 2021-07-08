// @ts-ignore
import { $ } from "./jquery.ts";

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

describe("class instance", () => {
	test("$elItems length", () => {
		expect($("button").length).toBe(3);
	});

	test("$elItems length", () => {
		expect($(".default-btn").length).toBe(2);
	});

	test("$elItems length", () => {
		expect($("pre").length).toBe(0);
	});

	test("getter items", () => {
		expect($("button").items.length).toBe(3);
	});
});

describe("addClass, removeClass, toggleClass, hasClass", () => {
	test("addClass()", () => {
		$(".default-btn").addClass("default-btn_green");

		expect(document.querySelector(".default-btn").classList.contains("default-btn_green")).toBe(true);
		document.querySelector(".default-btn").classList.remove("default-btn_green");
	});

	test("removeClass()", () => {
		$(".default-btn").removeClass("default-btn_transparent");

		expect(document.querySelector(".default-btn").classList.contains("default-btn_transparent")).toBe(false);
		document.querySelector(".default-btn").classList.add("default-btn_transparent");
	});

	test("toggleClass()", () => {
		$(".default-btn").toggleClass("default-btn_red");
		expect(document.querySelector(".default-btn").classList.contains("default-btn_red")).toBe(false);

		$(".default-btn").toggleClass("default-btn_red");
		expect(document.querySelector(".default-btn").classList.contains("default-btn_red")).toBe(true);
	});

	test("hasClass()", () => {
		expect($(".default-btn_1").hasClass("default-btn_red")).toBe(true);
		expect($(".default-btn_1").hasClass("default-btn_green")).toBe(false);
		expect($(".default-btn_red").hasClass("default-btn_red")).toBe(true);
		expect($(".default-btn_1, .default-btn_2").hasClass("default-btn_1")).toBe(false);
	});
});

describe("val()", () => {
	test("get val", () => {
		expect($("no-input").val()).toBeUndefined();
	});
	test("get val", () => {
		expect($("input").val()).toBe(document.querySelector("input").getAttribute("value"));
	});

	test("set val", () => {
		$("input").val("new-value");
		expect(document.querySelector("input").getAttribute("value")).toBe("new-value");
		$("input").val("value");
	});
});

describe("html(), text()", () => {
	test("text() ", () => {
		expect($("button").text()).toBe("button text");
		expect($("no-tag").text()).toBeUndefined();
		$("button").text("new button text");
		expect(document.body.querySelector("button").textContent).toBe("new button text");
		$("button").text("button text");
	});

	test("html() ", () => {
		expect($(".outer").html()).toBe(document.body.querySelector(".outer").innerHTML);
		expect($(".outer").find(".ho-child").items[0]).toBeUndefined();
		$(".outer").html("<div></div>");
		expect(document.body.querySelector(".outer").innerHTML).toBe("<div></div>");
		$(".outer").html("<div class='inner'></div>");
	});

	//test("set val", () => {
	//	$("input").val("new-value");
	//	expect(document.querySelector("input").getAttribute("value")).toBe("new-value");
	//	$("input").val("value");
	//});
});

describe("closet, find", () => {
	test("closest() ", () => {
		expect($(".inner").closest(".no-parent")).toBeUndefined();
		expect($(".inner").closest(".outer").items[0]).toBe(document.body.querySelector(".outer"));
	});

	test("find() ", () => {
		expect($(".outer").find(".inner").items[0]).toBe(document.body.querySelector(".inner"));
		expect($(".outer").find(".ho-child").items[0]).toBeUndefined();
	});

	//test("set val", () => {
	//	$("input").val("new-value");
	//	expect(document.querySelector("input").getAttribute("value")).toBe("new-value");
	//	$("input").val("value");
	//});
});

//describe("12121", () => {
//	test("should return sum of nums ", () => {
//		expect($("p").text()).toBe("1");
//	});
//});
