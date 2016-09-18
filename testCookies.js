//testCookies.js
var runTests = function(){
    var rel="stylesheet";
    var href="https://code.jquery.com/qunit/qunit-2.0.1.css";
    var css = makeElement("link", {rel, href});
    document.head.appendChild(css);

    var innerHTML = '<div id="qunit"></div><div id="qunit-fixture"></div>';
    var qunit_div = makeElement("div", {innerHTML});
    document.body.insertBefore(qunit_div, document.body.firstChild);

QUnit.test( "getCookie", function( assert ) {
    var html_at = document.getElementsByName("at")[0].value;
    assert.equal(getCookie("GMAIL_AT"), html_at);
});

QUnit.test( "setCookie", function( assert ) {
    var tact = document.getElementsByName("tact")[0];
    curAction = tact.selectedIndex
    setCookie("curAction", curAction);
    assert.equal(getCookie("curAction"), curAction, "set&get");
});

QUnit.test( "setExpiration", function( assert ) {
    var now = new Date();
    var that = now;
    that.setDate(now.getDate() + 3);
    assert.equal(setExpiration(3), that.toGMTString());
});

};
