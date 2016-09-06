    var getBaseURL = function(link){
        return link.protocol +"//"+ link.host + link.pathname;
    };

    var getQuery = function(link){
        return link.search;
    };

    var getHash = function(link){
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
//TODO: 返回到搜索结果 bug

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
        console.log({param});
        console.log({newValue});
        if (oldQ.indexOf(makeParam(param,"")) != -1){
            var oldValue = getParamValue(oldQ, param);
            if (param == "q"){ /* marge for q param only */
                console.log({oldValue});
                var oldOrig = unescape(oldValue);
                console.log({oldOrig});
                if(oldOrig.indexOf(newValue) == -1)
                    newValue = oldOrig + " " + newValue;
                console.log({newValue});
            }
            return oldQ.replace(getParam(oldQ, param), makeParam(param, newValue));
        } else {  /* not found */
            var newParam = param;
            return appendParam(oldQ, makeParam(newParam, newValue));
        }
    };

    var getSearchURL = function(link, search){
        /* https://support.google.com/mail/answer/7190?hl=en */
        console.log({search});
        var search_base = getBaseURL(link) +
            mergeQuerys(getQuery(link), "s=q");
        return mergeQuerys(search_base, "q=" + search);
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
    }

    var makeSearchA = function(link_text, search_action){
        A = makeA(link_text, "javascript:void(0);")
        A.addEventListener("click",
            function(){
                sbqSearchFunc(search_action)
            }, false);
        return A;
    }

var mainAGBHE = function(){
    'use strict';
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
        unreadA
        , weekA
        , olderA
        ];

    for (i=0; i<filters.length; i+=1){
        var tmp_tr = trTrash.cloneNode(true);
        var tmp_td = tmp_tr.firstChild;
        //if (tmp_td.firstChild.nodetype = "link")
        tmp_td.replaceChild(filters[i], tmp_td.firstChild);
        trTrash.parentNode.insertBefore(tmp_tr, trTrash.nextSibling);
    }
};
