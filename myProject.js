/*jshint scripturl:true*/
    var getBaseURL = function(urlstr){
        var link = makeA("getBaseURL", urlstr);
        return link.protocol +"//"+ link.host + link.pathname;
    };

    var getQuery = function(urlstr){
        var link = makeA("getQuery", urlstr);
        return link.search;
    };

    var getPath = function(urlstr){
        var link = makeA("getPath", urlstr);
        return link.pathname;
    };

    var getHash = function(urlstr){
        var link = makeA("getHash", urlstr);
        return link.hash;
    };

    var makeA = function(text, link){
        var a = document.createElement("A");
        a.innerText = text;
        a.setAttribute("href", link);
        return a;
    };

    var getParam = function(query, name){
        var noQmark = query;
        if (query.indexOf("?") != -1)
            noQmark = query.substring(1);//strip ? mark
        var i=0;
        var params = [];
        if (noQmark.indexOf("&") != -1)
            params = noQmark.split("&");
        else
            return noQmark;
        for (i=0; i<params.length; i+=1){
            var p = params[i];
            if(p.substring(0, p.indexOf("=")) == name){
                return p;
            }
        }
    };

    var getParamValue = function(query, name){
        var param = getParam(query, name);
        return param.substring(param.indexOf("=")+1);
    };

    var makeParam = function(name, value){
        return name + "=" + escape(value)
            .replace("@", "%40");
    };
    var lastChar = function(str){
        return str.slice(-1);
    };
    var appendParam = function(oldQ, newParam){
        var resultQ = oldQ;
        if (lastChar(oldQ) == "&")
            oldQ = oldQ.substring(0, oldQ.length-1);

        if (lastChar(oldQ) == "?") // query is empty
            resultQ = oldQ + "" + newParam;
        else
            resultQ = oldQ + "&" + newParam;
        return resultQ;
    };

    var mergeQuerys = function(oldQ, newQ){
        var param = newQ.substring(0, newQ.indexOf("="));
        var newValue = newQ.substring(newQ.indexOf("=")+1);
        if (oldQ.indexOf(makeParam(param,"")) != -1){
            var oldValue = getParamValue(oldQ, param);
            if (param == "q"){ /* marge for q param only */
                var oldOrig = unescape(oldValue);
                if(oldOrig.indexOf(newValue) == -1)
                    newValue = oldOrig + " " + newValue;
            }
            return oldQ.replace(getParam(oldQ, param), makeParam(param, newValue));
        } else {  /* not found */
            var newParam = param;
            return appendParam(oldQ, makeParam(newParam, newValue));
        }
    };

    var appendText = function(oldText, newText){
        if (oldText.indexOf(newText) == -1){/* not found */
            oldText += " " + newText;
        }
        return oldText;
    };

var sbqSearchFunc = function(search){
    var sbq = document.getElementById("sbq");
    sbq.value = appendText(sbq.value, search);
    sbq.focus();
    var nvp_site_mail = document.getElementsByName("nvp_site_mail")[0];
    nvp_site_mail.click();
};

var makeSearchA = function(link_text, search_action){
    var A = makeA(link_text, "javascript:void(0);");
    A.addEventListener("click",
        function(){
            sbqSearchFunc(search_action);
        }, false);
    return A;
};

    var makeElement = function(elem_name, attrs){
        var elem = document.createElement(elem_name);
        for (var i in attrs){
            elem[i] = attrs[i];
        }

        return elem;
    };

    var newAjax = function(){
        var xhttp;
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
            } else {
            // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xhttp;
    };

var addFilters = function(){
    //add filter at message page
    var links = document.links;
    var i = 0;
    var trTrash = null;
    for (i=0; i<links.length; i+=1){
        var star =links[i];
        if (star.getAttribute("href") == "?&s=t"){
            trTrash = star.parentNode.parentNode;
            break;
        }
    }

    var unreadA = makeSearchA("unread", "is:unread");
    var weekA = makeSearchA("This week", "newer_than:7d");
    var olderA = makeSearchA("1 week older", "older_than:7d");

    var filters = [
        unreadA,
        weekA,
        olderA
        ];

    for (i=0; i<filters.length; i+=1){
        var tmp_tr = trTrash.cloneNode(true);
        var tmp_td = tmp_tr.firstChild;
        tmp_td.replaceChild(filters[i], tmp_td.firstChild);
        trTrash.parentNode.insertBefore(tmp_tr, trTrash.nextSibling);
    }
};

var makeOneField = function(name, value, boundary)
{
    var crlf = "\r\n";
    var one_part = '--' + boundary + crlf +
        'Content-Disposition: form-data'+'; '+ 'name="'+name+'"' + crlf +
        crlf +
        value + crlf +
        '';
    return one_part;
};

var makeEnd = function(boundary){
    return '--'+boundary+'--';
};

    var makeid = function(size){
    //http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < size; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };

var genBoundary = function(){
    return "----WebKitFormBoundary" +makeid(16);
};

var makeFormData = function(fields, boundary){
//https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Sending_forms_through_JavaScript
    var crlf = "\r\n";
    var data = "";
    if(!boundary)
        boundary = genBoundary();
    for (var k in fields){
        data += makeOneField(k, fields[k], boundary);
    }
    data += makeEnd(boundary);
    return data;
};
    var hideElement = function(elem){
        elem.style.display = 'none';
    };

var createLabel = function(){
    var xhttp = newAjax();
    var boundary= genBoundary();
    var baseurl = getPath(window.location);
    xhttp.open("POST", baseurl, true);
    xhttp.setRequestHeader("Content-type",
        "multipart/form-data; boundary="+boundary);
    xhttp.setRequestHeader("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
    xhttp.setRequestHeader("upgrade-insecure-requests", 1);
    xhttp.setRequestHeader("location", baseurl+"?v=prl");
    xhttp.setRequestHeader("cache-control", "max-age=0");
    xhttp.onreadystatechange = function() {
        var tmp_edit = document.getElementById("label_edit");
        var tmp_btn = document.getElementById("create_btn");
        if (this.readyState == 4 && this.status == 200) {
            hideElement(tmp_edit);
            tmp_btn.value = "Created";
            var cf2_sel = document.getElementsByName("cf2_sel")[0];
            var innerText = tmp_edit.value;
            var value = tmp_edit.value;
            var opt_new = makeElement("OPTION", {innerText, value});
            opt_new.selected = true;
            cf2_sel.appendChild(opt_new);
            hideElement(tmp_btn);
        } else {
            tmp_btn.value = "Failed";
        }
    };
    var datas = {};
    datas.at = document.getElementsByName("at")[0].value;
    var tmp_edit = document.getElementById("label_edit");
    datas.ecn= tmp_edit.value.trim();
    datas.nvp_bu_nl = "创建";
    datas.redir = '?v=prl';
    form_str = makeFormData(datas, boundary);
    xhttp.send(form_str);
    var tmp_btn = document.getElementById("create_btn");
    tmp_btn.value = "Creating";
};

var addNewLabel = function(){
    // add new label option on creating filter wizard
    var cf2_sel = document.getElementsByName("cf2_sel")[0];
    if (!cf2_sel)
        return;
    var value= "new_label";
    var innerText ="[New label]";
    var new_opt = makeElement("OPTION", {value, innerText});
    cf2_sel.insertBefore(new_opt, cf2_sel.options[0].nextSibling);
    cf2_sel.addEventListener("change", function(){
        if(cf2_sel.options[cf2_sel.selectedIndex] != new_opt)
            return;
        var attrs = {};
        attrs.type = "button";
        attrs.value = "Create";
        attrs.id = "create_btn";
        var create_btn = makeElement("INPUT", attrs);
        create_btn.addEventListener("click", createLabel);
        cf2_sel.parentNode.insertBefore(
            create_btn, cf2_sel.nextSibling
        );

        attrs = {};
        attrs.type = "text";
        attrs.value = "";
        attrs.id = "label_edit";
        var label_edit = makeElement("INPUT", attrs);
        cf2_sel.parentNode.insertBefore(
            label_edit, cf2_sel.nextSibling
        );
    });
};

var mainAGBHE = function(){
    'use strict';
    addFilters();
    addNewLabel();
};