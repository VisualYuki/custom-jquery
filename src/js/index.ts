import "@less/site-main.less";

import { $ } from "./jquery";

declare global {
	interface Window {
		$: Function;
	}
}

window.$ = $;

//$(".text").slideToggle(5000);
//console.log($(".text").css({ borderTop: "1px solid red" }));
//console.log($(".outer1212").find(".inner"));

//console.log($(".inner").closest("body").attr("id", 12));
//console.log($("div").items);
//console.log($("input").siblings("p"));
// @ts-ignore

//console.log(i);

//$(".xfgfg").
//$(".test");
//console.log($("p").text());
//$("input").val("new-value");
$(".outer").append("afterbegin", (document.createElement("a").textContent = "sdf"));
