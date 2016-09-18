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

    var search2dict= function(searchText, dict){
        var sp = " ";
        var sp2 = ":";
        var searches = [];
        if (searchText.indexOf(sp) != -1){
            searches = searchText.split(sp);
        } else { /* only one search */
            searches = [searchText];
        }
        for(var bb= 0; bb < searches.length; bb++){
            var NmeVal  = searches[bb].split(sp2);
            dict[NmeVal[0]] = NmeVal[1];
        }
    };

    var compare = function(A, B){
        var inta = parseInt(A);
        var intb = parseInt(B);
        var c;
        if(isNaN(inta)|| isNaN(intb)){ // pure stirng
            c = A.localeCompare(B);
        } else {
            c = inta-intb;
        }
        if(c == 0)
            return c;
        return c > 0 ? 1 : -1;
    };

    var eq = function(A, B){
        return compare(A, B) == 0;
    };

    var gt = function(A, B){
        return compare(A, B) == 1;
    };

    var lt = function(A, B){
        return compare(A, B) == -1;
    };

var evalDate = function(dict){
    if (dict["newer_than"] && dict["older_than"]){
        var newer = dict["newer_than"];
        var older = dict["older_than"];
        if(eq(newer, older)){
            dict["newer_than"] = null;
        } else if(gt(newer, older)){
            /* do nonthing*/
        } else if (lt(newer, older)){
            dict["newer_than"] = null;
            dict["older_than"] = null;
        }
    }
};

    var appendText = function(oldText, newText){
        var sp = " ";
        var sp2 = ":";

        if (oldText.trim() == ""){
            return newText;
        }
        if (oldText.indexOf(newText) != -1
            || newText.trim() == ""){
            return oldText;
        }
        var output = oldText;
        var old_searches = {};
        search2dict(oldText, old_searches);
        search2dict(newText, old_searches);
        evalDate(old_searches);
        output = "";
        for(var oo in old_searches){
            if (old_searches[oo] != null){
                if (output.indexOf(sp2) != -1)
                    output += sp;
                output += oo + sp2 + old_searches[oo];
            }
        }
        return output;
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

var addFilters = function(search_links){
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
    var filters = [];
    for (var text in search_links){
        filters.push(makeSearchA(text, search_links[text]));
    }
    filters.reverse();

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
            var cf2_cat = document.getElementById("cf2_cat");
            if (cf2_cat && cf2_cat.tagName == "INPUT")
                cf2_cat.checked = true;
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
    var sels = document.getElementsByName("cf2_sel");
    var cf2_sel = sels.length > 0 ? sels[0] : null;
    if (!cf2_sel)
        return;
    var value= "new_label";
    var innerText ="[New label]";
    var new_opt = makeElement("OPTION", {value, innerText});
    if (cf2_sel.tagName != "SELECT")
        return;
    cf2_sel.insertBefore(new_opt, cf2_sel.options[0].nextSibling);
    cf2_sel.addEventListener("change", function(){
        if(cf2_sel.options[cf2_sel.selectedIndex] != new_opt)
            return;
        if(cf2_sel.selectedIndex != 0)
            document.getElementById("cf2_cat").checked = true;
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
        var getLabel = getCookie("guessedLabel");
        if (getLabel.trim() != ""){
            attrs.value = getLabel;
        }
        attrs.id = "label_edit";
        var label_edit = makeElement("INPUT", attrs);
        cf2_sel.parentNode.insertBefore(
            label_edit, cf2_sel.nextSibling
        );
    });
};

var irfChecked = function(){
    if (window.location.toString().indexOf("v=prf") !=0){
        var irfchk = document.getElementById("irf");
        if(irfchk)
            irfchk.checked = true;
    }
};

var restoreAction = function(cookiename){
    var getAction = getCookie(cookiename);
    var tact = document.getElementsByName("tact")[0];
    if (!tact)
        return;
    tact.selectedIndex = getAction;

    tact.addEventListener("change", function(){
        var tact = document.getElementsByName("tact")[0];
        var setAction = tact.selectedIndex;
        setCookie(cookiename, setAction, 7, '/');
    });
};

    var fullSplit = function(str, ptn){
        if (str.match(ptn) == null)
            return str;
        var words = str.split(ptn);
        console.log(words);
        return words;
    };

    var firstNonEmpty = function(arr){
        for(var i in arr){
            if(arr[i].trim() != "")
                return arr[i];
        }
        return "";
    };

var guessLabel = function(ptn){
    var nvp_bu_nxsb = document.getElementsByName("nvp_bu_nxsb")[0];
    if (!nvp_bu_nxsb)
        return;
    console.log({nvp_bu_nxsb});
    nvp_bu_nxsb.form.addEventListener("submit", function(){
        alert("fired")
        var cf1_from = document.getElementsByName("cf1_from")[0];
        var setLabel = firstNonEmpty(fullSplit(cf1_from.value, ptn));
        console.log({setLabel});
        setCookie("guessedLabel", setLabel, 7, '/');
        return false;
    });
};

var mainAGBHE = function(){
    'use strict';
    var filter_links = {
        /* "text":"search:value" */
        "is:unread":"is:unread",
        "is:read":"is:read",
        "Inbox only":"in:inbox",
        "This week":"newer_than:7d",
        "Last Week":"older_than:7d newer_than:14d",
        "2 week older":"older_than:14d"
    };
    addFilters(filter_links);
    addNewLabel();
    guessLabel(/[@.]/);
    irfChecked();
    restoreAction("currAction");
};
