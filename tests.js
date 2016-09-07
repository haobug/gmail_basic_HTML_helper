//tests.js
QUnit.test("getBaseURL", function( assert ) {
	var url = "http://www.oreilly.com:1234/catalog/search.html?q=JavaScript&m=10#results";
	var link = document.createElement("A");
	link.href = url;
	assert.equal(getBaseURL(link), "http://www.oreilly.com:1234/catalog/search.html");
});

QUnit.test( "getQuery", function( assert ) {
	var url = "http://www.oreilly.com:1234/catalog/search.html?q=JavaScript&m=10#results";
	var link = document.createElement("A");
	link.href = url;
	assert.equal(getQuery(link), "?q=JavaScript&m=10");
	url = "https://mail.google.com/mail/u/0/h/aj6ck996tvqb/?&#getSearchURL";
	link.href = url;
	assert.equal(
		getQuery(link), "?&");
});

QUnit.test( "makeA", function( assert ) {
	var url = "http://www.oreilly.com:1234/catalog/search.html?q=JavaScript&m=10#results";
	var text = "testMakeA";
	var link = url;
	var A = makeA(text, link);
	assert.equal(A.href, link);
	assert.equal(A.innerText, text);
});

QUnit.test( "getParam", function( assert ) {
	var query = "?q=JavaScript&m=10&qq=whole&more=ok";
	assert.equal(
		getParam(query, "m"), 
		"m=10");
	assert.equal(
	getParam(
		query, "q"), 
		"q=JavaScript");
	assert.equal(
		getParam(query, "qq"),
		"qq=whole");
	assert.equal(
		getParam(query, "more"), 
		"more=ok");
	assert.equal(
		getParam("noQmark=ok", "noQmark"), 
		"noQmark=ok");
});

QUnit.test( "getParamValue", function( assert ) {
	var query = "?q=JavaScript&m=10&qq=whole&more=ok";
	assert.equal(
		getParamValue(query, "m"), 
		"10");
	assert.equal(
		getParamValue(
		query, "q"), 
		"JavaScript");
	assert.equal(
		getParamValue(query, "qq"),
		"whole");
	assert.equal(
		getParamValue(query, "more"), 
		"ok");
	
});

QUnit.test( "makeParam", function( assert ) {
	assert.equal(
		makeParam("name", "value"), 
		"name=value");
	assert.equal(
		makeParam("name", ""), 
		"name=");
	assert.equal(
		makeParam("name", "space value"),
		"name=space%20value");
	assert.equal(
		makeParam("q", "label:chip is:unread"), 
		"q=label%3Achip%20is%3Aunread");
	assert.equal(
		makeParam("q", "rfc822msgid:200503292@example.com"), 
		"q=rfc822msgid%3A200503292%40example.com");
	assert.equal(
		makeParam("q", "has:nouserlabels is:unread"), 
		"q=has%3Anouserlabels%20is%3Aunread");
});


QUnit.test( "mergeQuerys", function( assert ) {
	assert.equal(
		mergeQuerys("q=has%3Anouserlabels", "q=is:unread"),
		"q=has%3Anouserlabels%20is%3Aunread");
	assert.equal(
		mergeQuerys("q=has%3Anouserlabels", "q=is:star"),
		"q=has%3Anouserlabels%20is%3Astar");
	assert.equal(
		mergeQuerys("?q=has%3Anouserlabels", "q=is:star"),
		"?q=has%3Anouserlabels%20is%3Astar");
	
	assert.equal(
		mergeQuerys("?p=has%3Anouserlabels", "p=is:star"),
		"?p=is%3Astar");
		
	assert.equal(
		mergeQuerys("?q=has%3Anouserlabels", "nodup=is:star"),
		"?q=has%3Anouserlabels&nodup=is%3Astar");
});

QUnit.test( "getHash", function( assert ) {
	var url = "http://www.oreilly.com:1234/catalog/search.html?q=JavaScript&m=10#getHash";
	var link = document.createElement("A");
	link.href = url;
	assert.equal(getHash(link), "#getHash");
	//#results is hash
});

QUnit.test( "getSearchURL", function( assert ) {
	var url = "https://mail.google.com/mail/u/0/h/aj6ck996tvqb/?&#getSearchURL";
	var oldlink = document.createElement("A");
	oldlink.href = url;
	assert.equal(
		getQuery(oldlink), "?&");
	assert.equal(
		getSearchURL(oldlink, "is:unread"),
		"https://mail.google.com/mail/u/0/h/aj6ck996tvqb/?s=q&q=is%3Aunread"
	);
});

QUnit.test( "makeElement", function( assert ) {
    var opt = makeElement("OPTION", {
            value: "new_label",
            text: "[New label]"}
        );
    assert.equal("OPTION", opt.tagName);
    
    var url = "http://mail.google.com/";
    var a = makeElement("A", {
            href: url,
            innerText: "[A link]"}
        );
    assert.equal(a.tagName, "A");
    assert.equal(a.innerText, "[A link]");
    assert.equal(a.href, url);

    // var value= "new_label";
    // var texta ="[New label]";
    // var new_opt = makeElement("OPTION", {value, texta});
    // assert.equal(value, new_opt.value);
    // assert.equal(texta, new_opt.text);
});