//tests.js
QUnit.test("getBaseURL", function( assert ) {
	var url = "http://www.oreilly.com:1234/catalog/search.html?q=JavaScript&m=10#results";
    assert.equal(typeof url, "string");
	assert.equal(getBaseURL(url), "http://www.oreilly.com:1234/catalog/search.html");
});

QUnit.test( "getQuery", function( assert ) {
	var url = "http://www.oreilly.com:1234/catalog/search.html?q=JavaScript&m=10#results";
	assert.equal(getQuery(url), "?q=JavaScript&m=10");
	url = "https://mail.google.com/mail/u/0/h/aj6ck996tvqb/?&#getSearchURL";
	assert.equal(
		getQuery(url), "?&");
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
	assert.equal(getHash(url), "#getHash");
	//#results is hash
});

QUnit.test( "getPath", function( assert ) {
	var url = "http://www.oreilly.com:1234/catalog/search.html?q=JavaScript&m=10#getHash";
	assert.equal(getPath(url), "/catalog/search.html");
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

    var value= "new_label";
    var innerText ="[New label]";
    var new_opt = makeElement("OPTION", {value, innerText});
    assert.equal(new_opt.value, value);
    assert.equal(new_opt.text, innerText);

    var attrs = {};
    attrs.type = "button";
    attrs.value = "Create";
    attrs.id = "create_btn";
    var new_input = makeElement("INPUT", attrs);
    assert.equal(new_input.type, attrs.type);
    assert.equal(new_input.value, attrs.value);
    assert.equal(new_input.id, attrs.id);
});

QUnit.test( "makeFormData", function( assert ) {
    var datas = {};
    datas.at = "AF6bupPjT4zkZylxB4zV45BXrsZw_unNuQ";
    datas.ecn= "test";
    datas.nvp_bu_nl = "创建";
    datas.redir = '?v=prl';
    var boundary = genBoundary();
    var formdata = makeFormData(datas, boundary);

    var at_part = makeOneField("at", datas.at, boundary);
    formdata = formdata.replace(at_part, '');
    assert.equal(formdata.indexOf(at_part), -1, "at_part");

    var nvp_bu_nl = makeOneField("nvp_bu_nl", datas.nvp_bu_nl, boundary);
    assert.notEqual(nvp_bu_nl, at_part, "nvp_bu_nl != at_part");
    formdata = formdata.replace(nvp_bu_nl, '');
    assert.equal(formdata.indexOf(nvp_bu_nl), -1, "nvp_bu_nl");
    assert.equal(formdata.indexOf('nvp_bu_nl'), -1, "nvp_bu_nl_str");

    var ecn = makeOneField("ecn", datas.ecn, boundary);
    assert.notEqual(ecn, at_part);
    formdata = formdata.replace(ecn, '');
    assert.equal(formdata.indexOf(ecn), -1, "ecn");
    assert.equal(formdata.indexOf('ecn'), -1, "ecn_str");

    var redir = makeOneField("redir", datas.redir, boundary);
    assert.notEqual(redir, at_part);
    formdata = formdata.replace(redir, '');
    assert.equal(-1, formdata.indexOf(redir), "redir");
    assert.equal(-1, formdata.indexOf('redir'), "redir_str");
    //all
    formdata = makeFormData(datas, boundary);
    assert.equal(formdata,
        at_part +
        ecn +
        nvp_bu_nl +
        redir +
        makeEnd(boundary), "all");

    datas.more = "field";
    formdata = makeFormData(datas, boundary);
    more = makeOneField("more", datas.more, boundary);
    assert.equal(formdata,
        at_part +
        ecn +
        nvp_bu_nl +
        redir +
        more +
        makeEnd(boundary), "more field");
    var test_boundary ='8cfCYPWC76xq0ZCG';
    formdata = makeFormData(datas, test_boundary);
    var ptn = new RegExp(test_boundary, "g");
    assert.equal(formdata.match(ptn).length, 5+1, "bounary count");
});

QUnit.test( "makeid", function( assert ) {
    assert.notEqual(makeid(16), "");
    assert.equal(makeid(16).length, 16);
    assert.equal(makeid(10).length, 10);
    assert.notEqual(makeid(16), makeid(16), "diff on call");
});

QUnit.test( "makeSearchA", function( assert ) {
    var sa = makeSearchA("makeSearchA", "is:unread");
    assert.equal(sa.href, "javascript:void(0);");
    assert.equal(sa.innerText, "makeSearchA");
});