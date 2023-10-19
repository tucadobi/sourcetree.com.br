/**
 * Copyright (C) <ano>  Chifrudo <chifrudo@localhost.com.br>
 *
 * Este programa é um software livre: você pode redistribuí-lo e/ou
 * modificá-lo sob os termos da GNU General Public License conforme
 * publicada por a Free Software Foundation, seja a versão 3 da
 * Licença, ou (a seu critério) qualquer versão posterior.
 *
 * Este programa é distribuído na esperança de que seja útil,
 * mas SEM QUALQUER GARANTIA; mesmo sem a garantia implícita de
 * COMERCIABILIDADE ou ADEQUAÇÃO PARA UM FIM ESPECÍFICO. Veja a
 * Licença Pública Geral GNU para mais detalhes.
 *
 * Você deve ter recebido uma cópia da GNU General Public License
 * juntamente com este programa. Caso contrário, consulte
 * <https://www.gnu.org/licenses/>.
 */


/**
 * Impedir a execução do jQuery se incluído mais de uma vez.
 */
if (typeof window.jQuery == "undefined")
{
    /**
     * Variável global indefinida.
     */
    window.undefined = window.undefined;

    /**
     *
     */
    var jQuery = function(a, c)
    {
        /**
         * Se o contexto for global, retorne um novo objeto.
         */
        if (window == this)
        {
            return new jQuery(a, c);
        }

        /**
         * Certifique-se de que uma seleção foi fornecida.
         */
        a = a || document;

        /**
         * HANDLE: $(function).
         * Atalho para documento pronto. Safari reporta
         * typeof em DOM NodeLists como uma função.
         */
        if (jQuery.isFunction(a) && !a.nodeType && a[0] == undefined)
        {
            return new jQuery(document)[
                jQuery.fn.ready ? "ready" : "load"
            ](a);
        }

        /**
         * Lidar com strings HTML.
         */
        if (typeof a  == "string")
        {
            var m = /^[^<]*(<.+>)[^>]*$/.exec(a);

            a = m ?
                /**
                 * HANDLE: $(html) -> $(array).
                 */
                jQuery.clean([m[1]]) :

                /**
                 * HANDLE: $(expr).
                 */
                jQuery.find(a, c);
        }

        return this.setArray(
            /**
             * HANDLE: $(array).
             */
            a.constructor == Array && a ||

            /**
             * HANDLE: $(arraylike).
             * Observe quando um objeto semelhante a um array
             * é passado como seletor.
             */
            (a.jquery || a.length && a != window && !a.nodeType && a[0] != undefined && a[0].nodeType) && jQuery.makeArray(a) ||

            /**
             * HANDLE: $(*).
             */
            [a]
        );
    };

    /**
     * Mapeie sobre $ em caso de substituição.
     */
    if (typeof $ != "undefined")
    {
        jQuery._$ = $;
    }

    /**
     * Mapeie o namespace jQuery para o '$'.
     */
    var $ = jQuery;

    /**
     *
     */
    jQuery.fn = jQuery.prototype = {
        /**
         *
         */
        jquery: "1.1",

        /**
         *
         */
        size: function()
        {
            return this.length;
        },

        /**
         *
         */
        length: 0,

        /**
         *
         */
        get: function(num)
        {
            return num == undefined ?
                /**
                 * Retorne um vetor 'clean' (limpo ?).
                 */
                jQuery.makeArray(this) :

                /**
                 * Retorne apenas o objeto.
                 */
                this[num];
        },

        /**
         *
         */
        pushStack: function(a)
        {
            var ret = jQuery(this);
                ret.prevObject = this;

            return ret.setArray(a);
        },

        /**
         *
         */
        setArray: function(a)
        {
            this.length = 0;

            /**
             *
             */
            [].push.apply(this, a);

            return this;
        },

        /**
         *
         */
        each: function(fn, args)
        {
            return jQuery.each(this, fn, args);
        },

        /**
         *
         */
        index: function(obj)
        {
            var pos = -1;

            this.each(function(i)
            {
                if (this == obj)
                {
                    pos = i;
                }
            });

            return pos;
        },

        /**
         *
         */
        attr: function(key, value, type)
        {
            var obj = key;

            /**
             * Procure o caso em que estamos acessando um valor de estilo.
             */
            if (key.constructor == String)
            {
                if (value == undefined)
                {
                    return jQuery[type || "attr"](this[0], key);
                } else
                {
                    obj = {};
                    obj[key] = value;
                }
            }

            /**
             * Verifique se estamos definindo valores de estilo.
             */
            return this.each(function()
            {
                /**
                 * Defina todos os estilos.
                 */
                for (var prop in obj)
                {
                    jQuery.attr(type ? this.style : this, prop, jQuery.prop(this, obj[prop], type));
                }
            });
        },

        /**
         *
         */
        css: function(key, value)
        {
            return this.attr(key, value, "curCSS");
        },

        /**
         *
         */
        text: function(e)
        {
            if (typeof e == "string")
            {
                return this.empty().append(document.createTextNode(e));
            }

            var t = "";
            jQuery.each(e || this, function()
            {
                jQuery.each(this.childNodes, function()
                {
                    if (this.nodeType != 8)
                    {
                        t += this.nodeType != 1 ? this.nodeValue : jQuery.fn.text([this]);
                    }
                });
            });

            return t;
        },

        /**
         *
         */
        wrap: function()
        {
            /**
             * Os elementos para envolver o alvo.
             */
            var a = jQuery.clean(arguments);

            /**
             * Envolva cada um dos elementos correspondentes
             * individualmente.
             */
            return this.each(function()
            {
                /**
                 * Clone a estrutura que estamos usando para encapsular.
                 */
                var b = a[0].cloneNode(true);

                /**
                 * Insira-o antes do elemento a ser encapsulado.
                 */
                this.parentNode.insertBefore(b, this);

                /**
                 * Encontre o ponto mais profundo na estrutura
                 * envolvente.
                 */
                while (b.firstChild)
                {
                    b = b.firstChild;
                }

                /**
                 * Mova o elemento correspondente para dentro da
                 * estrutura wrap.
                 */
                b.appendChild(this);
            });
        },

        /**
         *
         */
        append: function()
        {
            return this.domManip(arguments, true, 1, function(a)
            {
                this.appendChild(a);
            });
        },

        /**
         *
         */
        prepend: function()
        {
            return this.domManip(arguments, true, -1, function(a)
            {
                this.insertBefore(a, this.firstChild);
            });
        },

        /**
         *
         */
        before: function()
        {
            return this.domManip(arguments, false, 1, function(a)
            {
                this.parentNode.insertBefore(a, this);
            });
        },

        /**
         *
         */
        after: function()
        {
            return this.domManip(arguments, false, -1, function(a)
            {
                this.parentNode.insertBefore(a, this.nextSibling);
            });
        },

        /**
         *
         */
        end: function()
        {
            return this.prevObject || jQuery([]);
        },

        /**
         *
         */
        find: function(t)
        {
            return this.pushStack(
                jQuery.map(this, function(a)
                {
                    return jQuery.find(t, a);
                })
            );
        },

        /**
         *
         */
        clone: function(deep)
        {
            return this.pushStack(
                jQuery.map(this, function(a)
                {
                    return a.cloneNode(deep != undefined ? deep : true);
                })
            );
        },

        /**
         *
         */
        filter: function(t)
        {
            return this.pushStack(
                jQuery.isFunction(t) &&
                jQuery.grep(this, function(el, index)
                {
                    return t.apply(el, [index])
                }) ||

                jQuery.multiFilter(t, this)
            );
        },

        /**
         *
         */
        not: function(t)
        {
            return this.pushStack(
                t.constructor == String &&
                jQuery.multiFilter(t, this, true) ||
                jQuery.grep(this, function(a)
                {
                    if (t.constructor == Array || t.jquery)
                    {
                        return jQuery.inArray(t, a) < 0;
                    } else
                    {
                        return a != t;
                    }
                })
            );
        },

        /**
         *
         */
        add: function(t)
        {
            return this.pushStack(
                jQuery.merge(
                    this.get(),
                    typeof t == "string" ? jQuery(t).get() : t
                )
            );
        },

        /**
         *
         */
        is: function(expr)
        {
            return expr ? jQuery.filter(expr, this).r.length > 0 : false;
        },

        /**
         *
         */
        val: function(val)
        {
            return val == undefined ? (this.length ? this[0].value : null) : this.attr("value", val);
        },

        /**
         *
         */
        html: function(val)
        {
            return val == undefined ? (this.length ? this[0].innerHTML : null) : this.empty().append(val);
        },

        /**
         *
         */
        domManip: function(args, table, dir, fn)
        {
            var clone = this.length > 1; 
            var a = jQuery.clean(args);

            if (dir < 0)
            {
                a.reverse();
            }

            return this.each(function()
            {
                var obj = this;

                if (table && this.nodeName.toUpperCase() == "TABLE" && a[0].nodeName.toUpperCase() == "TR")
                {
                    obj = this.getElementsByTagName("tbody")[0] || this.appendChild(document.createElement("tbody"));
                }

                jQuery.each(a, function()
                {
                    fn.apply(obj, [clone ? this.cloneNode(true) : this ]);
                });
            });
        }
    };

    /**
     *
     */
    jQuery.extend = jQuery.fn.extend = function()
    {
        /**
         * Copiar referência para o objeto de destino.
         */
        var target = arguments[0],
            a = 1;

        /**
         * Estenda o próprio jQuery se apenas um argumento for passado.
         */
        if (arguments.length == 1)
        {
            target = this;
            a = 0;
        }

        var prop;
        while (prop = arguments[a++])
        {
            /**
             * Estenda o objeto base.
             */
            for (var i in prop)
            {
                target[i] = prop[i];
            }
        }

        /**
         * Retorne o objeto modificado.
         */
        return target;
    };

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        noConflict: function()
        {
            if (jQuery._$)
            {
                $ = jQuery._$;
            }
        },

        /**
         *
         */
        isFunction: function(fn)
        {
            return fn && typeof fn == "function";
        },

        /**
         * Args é apenas para uso interno.
         */
        each: function(obj, fn, args)
        {
            if (obj.length == undefined)
            {
                for (var i in obj)
                {
                    fn.apply(obj[i], args || [i, obj[i]]);
                }
            } else
            {
                for (var i = 0, ol = obj.length; i < ol; i++)
                {
                    if (fn.apply(obj[i], args || [i, obj[i]]) === false)
                    {
                        break;
                    }
                }
            }

            return obj;
        },

        /**
         *
         */
        prop: function(elem, value, type)
        {
            /**
             * Lidar com funções executáveis.
             */
            if (jQuery.isFunction(value))
            {
                return value.call(elem);
            }

            /**
             * Manipular a passagem de um número para uma
             * propriedade CSS.
             */
            if (value.constructor == Number && type == "curCSS")
            {
                return value + "px";
            }

            return value;
        },

        /**
         *
         */
        className: {
            /**
             * Somente interno, use addClass("class").
             */
            add: function(elem, c)
            {
                jQuery.each(c.split(/\s+/), function(i, cur)
                {
                    if (!jQuery.className.has(elem.className, cur))
                    {
                        elem.className += (elem.className ? " " : "") + cur;
                    }
                });
            },

            /**
             * Somente interno, use removeClass("class").
             */
            remove: function(elem, c)
            {
                elem.className = c ? jQuery.grep(elem.className.split(/\s+/), function(cur)
                {
                    return !jQuery.className.has(c, cur);
                }).join(" ") : "";
            },

            /**
             * Somente interno, use is(".class").
             */
            has: function(t, c)
            {
                t = t.className || t;

                return t && new RegExp("(^|\\s)" + c + "(\\s|$)").test(t);
            }
        },

        /**
         *
         */
        swap: function(e, o, f)
        {
            for (var i in o)
            {
                e.style["old" + i] = e.style[i];
                e.style[i] = o[i];
            }

            f.apply(e, []);
            for (var i in o)
            {
                e.style[i] = e.style["old" + i];
            }
        },

        /**
         *
         */
        css: function(e, p)
        {
            if (p == "height" || p == "width")
            {
                var old = {},
                    oHeight,
                    oWidth,
                    d = [
                        "Top",
                        "Bottom",
                        "Right",
                        "Left"
                    ];

                jQuery.each(d, function()
                {
                    old["padding" + this] = 0;
                    old["border" + this + "Width"] = 0;
                });

                jQuery.swap(e, old, function()
                {
                    if (jQuery.css(e,"display") != "none")
                    {
                        oHeight = e.offsetHeight;
                        oWidth = e.offsetWidth;
                    } else
                    {
                        e = jQuery(e.cloneNode(true))
                            .find(":radio")
                            .removeAttr("checked")
                            .end()
                            .css({
                                visibility: "hidden",
                                position: "absolute",
                                display: "block",
                                right: "0",
                                left: "0"
                            }).appendTo(e.parentNode)[0];

                        var parPos = jQuery.css(e.parentNode,"position");
                        if (parPos == "" || parPos == "static")
                        {
                            e.parentNode.style.position = "relative";
                        }

                        oHeight = e.clientHeight;
                        oWidth = e.clientWidth;

                        if (parPos == "" || parPos == "static")
                        {
                            e.parentNode.style.position = "static";
                        }

                        e.parentNode.removeChild(e);
                    }
                });

                return p == "height" ? oHeight : oWidth;
            }

            return jQuery.curCSS(e, p);
        },

        /**
         *
         */
        curCSS: function(elem, prop, force)
        {
            var ret;

            if (prop == "opacity" && jQuery.browser.msie)
            {
                return jQuery.attr(elem.style, "opacity");
            }

            if (prop == "float" || prop == "cssFloat")
            {
                prop = jQuery.browser.msie ? "styleFloat" : "cssFloat";
            }

            if (!force && elem.style[prop])
            {
                ret = elem.style[prop];
            } else if (document.defaultView && document.defaultView.getComputedStyle)
            {
                if (prop == "cssFloat" || prop == "styleFloat")
                {
                    prop = "float";
                }

                prop = prop.replace(/([A-Z])/g,"-$1").toLowerCase();
                var cur = document.defaultView.getComputedStyle(elem, null);

                if (cur)
                {
                    ret = cur.getPropertyValue(prop);
                } else if ( prop == "display" )
                {
                    ret = "none";
                } else
                {
                    jQuery.swap(elem, { display: "block" }, function()
                    {
                        var c = document.defaultView.getComputedStyle(this, "");
                            ret = c && c.getPropertyValue(prop) || "";
                    });
                }
            } else if (elem.currentStyle)
            {
                var newProp = prop.replace(/\-(\w)/g, function(m, c)
                {
                    return c.toUpperCase();
                });

                ret = elem.currentStyle[prop] || elem.currentStyle[newProp];
            }

            return ret;
        },

        /**
         *
         */
        clean: function(a)
        {
            var r = [];

            jQuery.each(a, function(i, arg)
            {
                if (!arg)
                {
                    return;
                }

                if (arg.constructor == Number)
                {
                    arg = arg.toString();
                }

                /**
                 * Converta string HTML em nós DOM.
                 */
                if (typeof arg == "string")
                {
                    /**
                     * Corte os espaços em branco, caso contrário,
                     * indexOf não funcionará conforme o esperado.
                     */
                    var s = jQuery.trim(arg), div = document.createElement("div"), tb = [];

                    var wrap =
                        /**
                         * option ou optgroup.
                         */
                        !s.indexOf("<opt") &&
                        [1, "<select>", "</select>"] ||

                        (!s.indexOf("<thead") || !s.indexOf("<tbody") || !s.indexOf("<tfoot")) &&
                        [1, "<table>", "</table>"] ||

                        !s.indexOf("<tr") &&
                        [2, "<table><tbody>", "</tbody></table>"] ||

                        /**
                         * <thead> correspondido acima.
                         */
                        (!s.indexOf("<td") || !s.indexOf("<th")) &&
                        [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
                        [0, "", ""];

                    /**
                     * Vá para html e volte, depois retire os invólucros extras.
                     */
                    div.innerHTML = wrap[1] + s + wrap[2];

                    /**
                     * Mova-se para a profundidade certa.
                     */
                    while (wrap[0]--)
                    {
                        div = div.firstChild;
                    }

                    /**
                     * Remova o <tbody> inserido automaticamente
                     * do IE dos fragmentos da tabela.
                     */
                    if (jQuery.browser.msie)
                    {
                        /**
                         * String era uma <table>, *pode* ter <tbody>.
                         */
                        if (!s.indexOf("<table") && s.indexOf("<tbody") < 0)
                        {
                            tb = div.firstChild && div.firstChild.childNodes;
                        } else if (wrap[1] == "<table>" && s.indexOf("<tbody") < 0)
                        {
                            /**
                             * A string estava nua <thead> ou <tfoot>.
                             */

                            tb = div.childNodes;
                        }

                        for (var n = tb.length-1; n >= 0 ; --n)
                        {
                            if (tb[n].nodeName.toUpperCase() == "TBODY" && !tb[n].childNodes.length)
                            {
                                tb[n].parentNode.removeChild(tb[n]);
                            }
                        }
                    }

                    arg = div.childNodes;
                }

                if (arg.length === 0)
                {
                    return;
                }

                if (arg[0] == undefined)
                {
                    r.push(arg);
                } else
                {
                    r = jQuery.merge(r, arg);
                }
            });

            return r;
        },

        /**
         *
         */
        attr: function(elem, name, value)
        {
            var fix = {
                "for": "htmlFor",
                "class": "className",
                "float": jQuery.browser.msie ? "styleFloat" : "cssFloat",
                cssFloat: jQuery.browser.msie ? "styleFloat" : "cssFloat",
                innerHTML: "innerHTML",
                className: "className",
                value: "value",
                disabled: "disabled",
                checked: "checked",
                readonly: "readOnly",
                selected: "selected"
            };

            /**
             * Na verdade, o IE usa filtros para opacidade ... elem
             * é na verdade elem.style.
             */
            if (name == "opacity" && jQuery.browser.msie && value != undefined)
            {
                /**
                 * O IE tem problemas com opacidade se não tiver
                 * layout. Force-o definindo o nível de zoom.
                 */
                elem.zoom = 1; 

                /**
                 * Defina o filtro alfa para definir a opacidade.
                 */
                return elem.filter = elem.filter.replace(/alpha\([^\)]*\)/gi, "") + (value == 1 ? "" : "alpha(opacity=" + value * 100 + ")");
            } else if (name == "opacity" && jQuery.browser.msie)
            {
                return elem.filter ? parseFloat(elem.filter.match(/alpha\(opacity=(.*)\)/)[1]) / 100 : 1;
            }

            /**
             * Mozilla não funciona bem com opacidade 1.
             */
            if (name == "opacity" && jQuery.browser.mozilla && value == 1)
            {
                value = 0.9999;
            }

            /**
             * Certos atributos só funcionam quando acessados
             * pelo antigo modo DOM 0.
             */
            if (fix[name])
            {
                if (value != undefined)
                {
                    elem[fix[name]] = value;
                }

                return elem[fix[name]];
            } else if (value == undefined && jQuery.browser.msie && elem.nodeName && elem.nodeName.toUpperCase() == "FORM" && (name == "action" || name == "method"))
            {
                return elem.getAttributeNode(name).nodeValue;
            } else if (elem.tagName)
            {
                /**
                 * IE elem.getAttribute passa até para estilo.
                 */
                if (value != undefined)
                {
                    elem.setAttribute(name, value);
                }

                return elem.getAttribute(name);
            } else
            {
                name = name.replace(/-([a-z])/ig, function(z, b)
                {
                    return b.toUpperCase();
                });

                if (value != undefined)
                {
                    elem[name] = value;
                }

                return elem[name];
            }
        },

        /**
         *
         */
        trim: function(t)
        {
            return t.replace(/^\s+|\s+$/g, "");
        },

        /**
         *
         */
        makeArray: function(a)
        {
            var r = [];

            if (a.constructor != Array)
            {
                for (var i = 0, al = a.length; i < al; i++)
                {
                    r.push(a[i]);
                }
            } else
            {
                r = a.slice(0);
            }

            return r;
        },

        /**
         *
         */
        inArray: function(b, a)
        {
            for (var i = 0, al = a.length; i < al; i++)
            {
                if (a[i] == b)
                {
                    return i;
                }
            }

            return -1;
        },

        /**
         *
         */
        merge: function(first, second)
        {
            var r = [].slice.call(first, 0);

            /**
             * Agora verifique se há duplicatas entre os dois
             * vetores e adicione apenas os itens exclusivos.
             */
            for (var i = 0, sl = second.length; i < sl; i++)
            {
                /**
                 * Verifique se há duplicatas.
                 */
                if (jQuery.inArray(second[i], r) == -1)
                {
                    /**
                     * O item é único, adicione-o.
                     */
                    first.push(second[i]);
                }
            }

            return first;
        },

        /**
         *
         */
        grep: function(elems, fn, inv)
        {
            /**
             * Se uma string for passada para a função, crie uma
             * função para ela (um atalho útil).
             */
            if (typeof fn == "string")
            {
                fn = new Function("a","i","return " + fn);
            }

            var result = [];

            /**
             * Percorra o array, salvando apenas os itens que
             * passam na função validadora.
             */
            for (var i = 0, el = elems.length; i < el; i++)
            {
                if (!inv && fn(elems[i], i) || inv && !fn(elems[i], i))
                {
                    result.push(elems[i]);
                }
            }

            return result;
        },

        map: function(elems, fn)
        {
            /**
             * Se uma string for passada para a função, crie
             * uma função para ela (um atalho útil).
             */
            if (typeof fn == "string")
            {
                fn = new Function("a", "return " + fn);
            }

            var result = [], r = [];

            /**
             * Percorra o vetor, traduzindo cada um dos itens
             * para seu novo valor (ou valores).
             */
            for (var i = 0, el = elems.length; i < el; i++)
            {
                var val = fn(elems[i], i);
                if (val !== null && val != undefined)
                {
                    if (val.constructor != Array)
                    {
                        val = [val];
                    }

                    result = result.concat(val);
                }
            }

            var r = result.length ? [ result[0] ] : [];

            check: for (var i = 1, rl = result.length; i < rl; i++)
            {
                for (var j = 0; j < i; j++)
                {
                    if (result[i] == r[j])
                    {
                        continue check;
                    }
                }

                r.push(result[i]);
            }

            return r;
        }
    });

    /**
     * Se o modelo de caixa compatível com W3C está sendo usado.
     *
     * @property
     * @name $.boxModel
     * @type Boolean
     * @cat JavaScript
     */
    new function()
    {
        var b = navigator.userAgent.toLowerCase();

        /**
         * Descubra qual navegador está sendo usado.
         */
        jQuery.browser = {
            safari: /webkit/.test(b),
            opera: /opera/.test(b),
            msie: /msie/.test(b) && !/opera/.test(b),
            mozilla: /mozilla/.test(b) && !/(compatible|webkit)/.test(b)
        };

        /**
         * Verifique se o modelo de caixa W3C está sendo usado.
         */
        jQuery.boxModel = !jQuery.browser.msie || document.compatMode == "CSS1Compat";
    };

    /**
     *
     */
    jQuery.each({
        parent: "a.parentNode",
        parents: "jQuery.parents(a)",
        next: "jQuery.nth(a,2,'nextSibling')",
        prev: "jQuery.nth(a,2,'previousSibling')",
        siblings: "jQuery.sibling(a.parentNode.firstChild,a)",
        children: "jQuery.sibling(a.firstChild)"
    }, function(i, n)
    {
        jQuery.fn[i] = function(a)
        {
            var ret = jQuery.map(this,n);

            if (a && typeof a == "string")
            {
                ret = jQuery.multiFilter(a, ret);
            }

            return this.pushStack(ret);
        };
    });

    /**
     *
     */
    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after"
    }, function(i, n)
    {
        jQuery.fn[i] = function()
        {
            var a = arguments;

            return this.each(function()
            {
                for (var j = 0, al = a.length; j < al; j++)
                {
                    jQuery(a[j])[n](this);
                }
            });
        };
    });

    /**
     *
     */
    jQuery.each({
        /**
         *
         */
        removeAttr: function(key)
        {
            jQuery.attr(this, key, "");
            this.removeAttribute(key);
        },

        /**
         *
         */
        addClass: function(c)
        {
            jQuery.className.add(this, c);
        },

        /**
         *
         */
        removeClass: function(c)
        {
            jQuery.className.remove(this, c);
        },

        /**
         *
         */
        toggleClass: function(c)
        {
            jQuery.className[
                jQuery.className.has(this, c) ? "remove" : "add"
            ](this, c);
        },

        /**
         *
         */
        remove: function(a)
        {
            if (!a || jQuery.filter(a, [this]).r.length)
            {
                this.parentNode.removeChild(this);
            }
        },

        /**
         *
         */
        empty: function()
        {
            while (this.firstChild)
            {
                this.removeChild(this.firstChild);
            }
        }
    }, function(i, n)
    {
        jQuery.fn[i] = function()
        {
            return this.each(n, arguments);
        };
    });

    /**
     *
     */
    jQuery.each(["eq", "lt", "gt", "contains"], function(i, n)
    {
        jQuery.fn[n] = function(num, fn)
        {
            return this.filter(":" + n + "(" + num + ")", fn);
        };
    });

    /**
     *
     */
    jQuery.each(["height", "width"], function(i, n)
    {
        jQuery.fn[n] = function(h)
        {
            return h == undefined ? (this.length ? jQuery.css(this[0], n) : null) : this.css(n, h.constructor == String ? h : h + "px");
        };
    });

    /**
     *
     */
    jQuery.extend({
        expr: {
            "": "m[2]=='*'||a.nodeName.toUpperCase()==m[2].toUpperCase()",
            "#": "a.getAttribute('id')==m[2]",
            ":": {
                /**
                 * Verificações de posição.
                 */
                lt: "i<m[3]-0",
                gt: "i>m[3]-0",
                nth: "m[3]-0==i",
                eq: "m[3]-0==i",
                first: "i==0",
                last: "i==r.length-1",
                even: "i%2==0",
                odd: "i%2",

                /**
                 * Verificações de crianças.
                 */
                "nth-child": "jQuery.nth(a.parentNode.firstChild,m[3],'nextSibling',a)==a",
                "first-child": "jQuery.nth(a.parentNode.firstChild,1,'nextSibling')==a",
                "last-child": "jQuery.nth(a.parentNode.lastChild,1,'previousSibling')==a",
                "only-child": "jQuery.sibling(a.parentNode.firstChild).length==1",

                /**
                 * Verificações dos pais.
                 */
                parent: "a.firstChild",
                empty: "!a.firstChild",

                /**
                 * Verificação de texto.
                 */
                contains: "jQuery.fn.text.apply([a]).indexOf(m[3])>=0",

                /**
                 * Visibilidade.
                 */
                visible: 'a.type!="hidden"&&jQuery.css(a,"display")!="none"&&jQuery.css(a,"visibility")!="hidden"',
                hidden: 'a.type=="hidden"||jQuery.css(a,"display")=="none"||jQuery.css(a,"visibility")=="hidden"',

                /**
                 * Atributos do formulário.
                 */
                enabled: "!a.disabled",
                disabled: "a.disabled",
                checked: "a.checked",
                selected: "a.selected||jQuery.attr(a,'selected')",

                /**
                 * Elementos de formulário.
                 */
                text: "a.type=='text'",
                radio: "a.type=='radio'",
                checkbox: "a.type=='checkbox'",
                file: "a.type=='file'",
                password: "a.type=='password'",
                submit: "a.type=='submit'",
                image: "a.type=='image'",
                reset: "a.type=='reset'",
                button: 'a.type=="button"||a.nodeName=="BUTTON"',
                input: "/input|select|textarea|button/i.test(a.nodeName)"
            },

            ".": "jQuery.className.has(a,m[2])",
            "@": {
                "=": "z==m[4]",
                "!=": "z!=m[4]",
                "^=": "z&&!z.indexOf(m[4])",
                "$=": "z&&z.substr(z.length - m[4].length,m[4].length)==m[4]",
                "*=": "z&&z.indexOf(m[4])>=0",
                "": "z",
                _resort: function(m)
                {
                    return ["", m[1], m[3], m[2], m[5]];
                },

                _prefix: "z=a[m[3]]||jQuery.attr(a,m[3]);"
            },

            "[": "jQuery.find(m[2],a).length"
        },

        /**
         * As expressões regulares que alimentam o mecanismo
         * de análise.
         */
        parse: [
            /**
             * Corresponder: [@value='test'], [@foo].
             */
            /^\[ *(@)([a-z0-9_-]*) *([!*$^=]*) *('?"?)(.*?)\4 *\]/i,

            /**
             * Corresponder: [div], [div p].
             */
            /^(\[)\s*(.*?(\[.*?\])?[^[]*?)\s*\]/,

            /**
             * Corresponder: :contains('foo').
             */
            /^(:)([a-z0-9_-]*)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/i,

            /**
             * Corresponder: :even, :last-chlid.
             */
            /^([:.#]*)([a-z0-9_*-]*)/i
        ],

        token: [
            /^(\/?\.\.)/, "a.parentNode",
            /^(>|\/)/, "jQuery.sibling(a.firstChild)",
            /^(\+)/, "jQuery.nth(a,2,'nextSibling')",
            /^(~)/, function(a)
            {
                var s = jQuery.sibling(a.parentNode.firstChild);

                return s.slice(0, jQuery.inArray(a,s));
            }
        ],

        /**
         *
         */
        multiFilter: function(expr, elems, not)
        {
            var old, cur = [];

            while (expr && expr != old)
            {
                old = expr;
                var f = jQuery.filter(expr, elems, not);
                    expr = f.t.replace(/^\s*, \s*/, "");
                    cur = not ? elems = f.r : jQuery.merge(cur, f.r);
            }

            return cur;
        },

        /**
         *
         */
        find: function(t, context)
        {
            /**
             * Lide rapidamente com expressões sem string.
             */
            if (typeof t != "string")
            {
                return [t];
            }

            /**
             * Certifique-se de que o contexto seja um elemento DOM.
             */
            if (context && !context.nodeType)
            {
                context = null;
            }

            /**
             * Defina o contexto correto (se nenhum for fornecido).
             */
            context = context || document;

            /**
             * Manipule a expressão XPath // comum.
             */
            if (!t.indexOf("//"))
            {
                context = context.documentElement;
                t = t.substr(2,t.length);

                /**
                 * E a expressão / raiz.
                 */
            } else if (!t.indexOf("/"))
            {
                context = context.documentElement;
                t = t.substr(1,t.length);

                if (t.indexOf("/") >= 1)
                {
                    t = t.substr(t.indexOf("/"), t.length);
                }
            }

            /**
             * Inicialize a busca.
             */
            var ret = [context],
                done = [],
                last = null;

            /**
             * Continue enquanto existir uma expressão seletora e
             * enquanto não estivermos mais repetindo sobre nós
             * mesmos.
             */
            while (t && last != t)
            {
                var r = [];
                last = t;

                t = jQuery.trim(t).replace( /^\/\//i, "" );

                var foundToken = false;

                /**
                 * Uma tentativa de acelerar seletores filhos que apontam
                 * para uma tag de elemento específica.
                 */
                var re = /^[\/>]\s*([a-z0-9*-]+)/i;
                var m = re.exec(t);

                if (m)
                {
                    /**
                     * Execute nossa própria iteração e filtro.
                     */
                    jQuery.each(ret, function()
                    {
                        for (var c = this.firstChild; c; c = c.nextSibling)
                        {
                            if (c.nodeType == 1 && (c.nodeName == m[1].toUpperCase() || m[1] == "*"))
                            {
                                r.push(c);
                            }
                        }
                    });

                    ret = r;
                    t = jQuery.trim(t.replace(re, ""));
                    foundToken = true;
                } else
                {
                    /**
                     * Procure tokens de expressão predefinidos.
                     */
                    for (var i = 0; i < jQuery.token.length; i += 2)
                    {
                        /**
                         * Tente corresponder cada token individual na
                         * ordem especificada.
                         */
                        var re = jQuery.token[i];
                        var m = re.exec(t);

                        /**
                         * Se a correspondência do token foi encontrada.
                         */
                        if (m)
                        {
                            /**
                             * Mapeie-o em relação ao manipulador do token.
                             */
                            r = ret = jQuery.map(ret, jQuery.isFunction(jQuery.token[i + 1]) ? jQuery.token[i + 1] : function(a)
                            {
                                return eval(jQuery.token[i + 1]);
                            });

                            /**
                             * E remova o token.
                             */
                            t = jQuery.trim(t.replace(re, ""));
                            foundToken = true;
                            break;
                        }
                    }
                }

                /**
                 * Veja se ainda existe uma expressão e se ainda não
                 * combinamos um token.
                 */
                if (t && !foundToken)
                {
                    /**
                     * Lidar com múltiplas expressões.
                     */
                    if (!t.indexOf(","))
                    {
                        /**
                         * Limpe o conjunto de resultados.
                         */
                        if ( ret[0] == context ) ret.shift();

                        /**
                         * Mesclar os conjuntos de resultados.
                         */
                        jQuery.merge(done, ret);

                        /**
                         * Redefina o contexto.
                         */
                        r = ret = [context];

                        /**
                         * Retoque a sequência do seletor.
                         */
                        t = " " + t.substr(1,t.length);
                    } else
                    {
                        /**
                         * Otimize para o caso nodeName#idName.
                         */
                        var re2 = /^([a-z0-9_-]+)(#)([a-z0-9\\*_-]*)/i;
                        var m = re2.exec(t);

                        /**
                         * Reorganize os resultados para que fiquem
                         * consistentes.
                         */
                        if (m)
                        {
                            m = [0, m[2], m[3], m[1]];
                        } else
                        {
                            /**
                             * Caso contrário, faça uma verificação de filtro
                             * tradicional para seletores de ID, classe e
                             * elemento.
                             */
                            re2 = /^([#.]?)([a-z0-9\\*_-]*)/i;
                            m = re2.exec(t);
                        }

                        /**
                         * Tente fazer uma busca global por ID, sempre
                         * que possível.
                         */
                        if (m[1] == "#" && ret[ret.length - 1].getElementById)
                        {
                            /**
                             * Otimização para caso de documento HTML.
                             */
                            var oid = ret[ret.length - 1].getElementById(m[2]);

                            /**
                             * Faça uma verificação rápida do nome do nó (quando
                             * aplicável) para que as pesquisas div#foo sejam
                             * realmente rápidas.
                             */
                            ret = r = oid && (!m[3] || oid.nodeName == m[3].toUpperCase()) ? [oid] : [];
                        } else
                        {
                            /**
                             * Pré-compile uma expressão regular para lidar
                             * com pesquisas de classe.
                             */
                            if (m[1] == ".")
                            {
                                var rec = new RegExp("(^|\\s)" + m[2] + "(\\s|$)");
                            }

                            /**
                             * Precisamos encontrar todos os elementos descendentes,
                             * é mais eficiente usar getAll() quando já estamos
                             * mais abaixo na árvore - tentamos reconhecer isso
                             * aqui.
                             */
                            jQuery.each(ret, function()
                            {
                                /**
                                 * Pegue o nome da tag que está sendo pesquisada.
                                 */
                                var tag = m[1] != "" || m[0] == "" ? "*" : m[2];

                                /**
                                 * Lide com o IE7 sendo realmente incompatível
                                 * sobre <object>s.
                                 */
                                if (this.nodeName.toUpperCase() == "OBJECT" && tag == "*")
                                {
                                    tag = "param";
                                }

                                jQuery.merge(r, m[1] != "" && ret.length != 1 ? jQuery.getAll(this, [], m[1], m[2], rec) : this.getElementsByTagName(tag));
                            });

                            /**
                             * É mais rápido filtrar por classe e pronto.
                             */
                            if (m[1] == "." && ret.length == 1)
                            {
                                r = jQuery.grep(r, function(e)
                                {
                                    return rec.test(e.className);
                                });
                            }

                            /**
                             * O mesmo acontece com a filtragem de ID.
                             */
                            if (m[1] == "#" && ret.length == 1)
                            {
                                /**
                                 * Lembre-se e apague o conjunto de resultados.
                                 */
                                var tmp = r;

                                /**
                                 *
                                 */
                                r = [];

                                /**
                                 * Em seguida, tente encontrar o elemento com o ID.
                                 */
                                jQuery.each(tmp, function()
                                {
                                    if (this.getAttribute("id") == m[2])
                                    {
                                        r = [this];

                                        return false;
                                    }
                                });
                            }

                            ret = r;
                        }

                        t = t.replace(re2, "");
                    }
                }

                /**
                 * Se uma string seletora ainda existir.
                 */
                if (t)
                {
                    /**
                     * Tente filtrá-lo.
                     */
                    var val = jQuery.filter(t, r);

                    ret = r = val.r;
                    t = jQuery.trim(val.t);
                }
            }

            /**
             * Remova o contexto raiz.
             */
            if (ret && ret[0] == context)
            {
                ret.shift();
            }

            /**
             * E combine os resultados.
             */
            jQuery.merge(done, ret);

            return done;
        },

        /**
         *
         */
        filter: function(t, r, not)
        {
            /**
             * Procure expressões de filtro comuns.
             */
            while (t && /^[a-z[({<*:.#]/i.test(t))
            {
                var p = jQuery.parse, m;

                jQuery.each(p, function(i, re)
                {
                    /**
                     * Procure e substitua sequências semelhantes a strings
                     * e, finalmente, crie um regexp a partir delas.
                     */
                    m = re.exec(t);

                    if (m)
                    {
                        /**
                         * Remova o que acabamos de combinar.
                         */
                        t = t.substring(m[0].length);

                        /**
                         * Reorganize a primeira correspondência.
                         */
                        if (jQuery.expr[m[1]]._resort)
                        {
                            m = jQuery.expr[m[1]]._resort(m);
                        }

                        return false;
                    }
                });

                /**
                 * :not() é um caso especial que pode ser otimizado
                 * mantendo-o fora da lista de expressões.
                 */
                if (m[1] == ":" && m[2] == "not")
                {
                    r = jQuery.filter(m[3], r, true).r;
                } else if (m[1] == ".")
                {
                    /**
                     * Trate as classes como um caso especial (isso
                     * ajudará a melhorar a velocidade, pois o regexp
                     * será compilado apenas uma vez).
                     */

                    var re = new RegExp("(^|\\s)" + m[2] + "(\\s|$)");
                        r = jQuery.grep(r, function(e)
                        {
                            return re.test(e.className || "");
                        }, not);

                    /**
                     * Caso contrário, encontre a expressão a ser executada.
                     */
                } else
                {
                    var f = jQuery.expr[m[1]];

                    if (typeof f != "string")
                    {
                        f = jQuery.expr[m[1]][m[2]];
                    }

                    /**
                     * Crie uma macro personalizada para incluí-la.
                     */
                    eval("f = function(a,i){" + (jQuery.expr[m[1]]._prefix || "") + "return " + f + "}");

                    /**
                     * Execute-o no filtro atual.
                     */
                    r = jQuery.grep(r, f, not);
                }
            }

            /**
             * Retorna um vetor de elementos filtrados (r)
             * e a string de expressão modificada (t).
             */
            return {
                r: r,
                t: t
            };
        },

        /**
         *
         */
        getAll: function(o, r, token, name, re)
        {
            for (var s = o.firstChild; s; s = s.nextSibling)
            {
                if (s.nodeType == 1)
                {
                    var add = true;

                    if (token == ".")
                    {
                        add = s.className && re.test(s.className);
                    } else if (token == "#")
                    {
                        add = s.getAttribute("id") == name;
                    }

                    if (add)
                    {
                        r.push(s);
                    }

                    if (token == "#" && r.length)
                    {
                        break;
                    }

                    if (s.firstChild)
                    {
                        jQuery.getAll(s, r, token, name, re);
                    }
                }
            }

            return r;
        },

        /**
         *
         */
        parents: function(elem)
        {
            var matched = [];
            var cur = elem.parentNode;

            while (cur && cur != document)
            {
                matched.push(cur);
                cur = cur.parentNode;
            }

            return matched;
        },

        /**
         *
         */
        nth: function(cur, result, dir, elem)
        {
            result = result || 1;

            var num = 0;
            for (; cur; cur = cur[dir])
            {
                if (cur.nodeType == 1)
                {
                    num++;
                }

                if (num == result || result == "even" && num % 2 == 0 && num > 1 && cur == elem || result == "odd" && num % 2 == 1 && cur == elem)
                {
                    return cur;
                }
            }
        },

        /**
         *
         */
        sibling: function(n, elem)
        {
            var r = [];

            for (; n; n = n.nextSibling)
            {
                if (n.nodeType == 1 && (!elem || n != elem))
                {
                    r.push(n);
                }
            }

            return r;
        }
    });

    /**
     * Diversas funções auxiliares usadas para gerenciar eventos.
     * Muitas das ideias por trás deste código originaram-se da
     * biblioteca addEvent.
     */
    jQuery.event = {
        /**
         * Vincule um evento a um elemento.
         */
        add: function(element, type, handler, data)
        {
            /**
             * Por alguma razão, o IE tem problemas para passar o
             * objeto da janela, fazendo com que ele seja clonado
             * no processo.
             */
            if (jQuery.browser.msie && element.setInterval != undefined)
            {
                element = window;
            }

            /**
             * Se os dados forem passados, vincule ao manipulador.
             */
            if (data)
            {
                handler.data = data;
            }

            /**
             * Certifique-se de que a função que está sendo
             * executada tenha um ID exclusivo.
             */
            if (!handler.guid)
            {
                handler.guid = this.guid++;
            }

            /**
             * Inicie a estrutura de eventos do elemento.
             */
            if (!element.events)
            {
                element.events = {};
            }

            /**
             * Obtenha a lista atual de funções vinculadas a este evento.
             */
            var handlers = element.events[type];

            /**
             * Se ainda não foi inicializado.
             */
            if (!handlers)
            {
                /**
                 * Inicie a fila do manipulador de eventos.
                 */
                handlers = element.events[type] = {};

                /**
                 * Lembre-se de um manipulador existente, se já estiver lá.
                 */
                if (element["on" + type])
                {
                    handlers[0] = element["on" + type];
                }
            }

            /**
             * Adicione a função à lista de manipuladores
             * do elemento.
             */
            handlers[handler.guid] = handler;

            /**
             * E vincule o manipulador de eventos global ao elemento.
             */
            element["on" + type] = this.handle;

            /**
             * Lembre-se da função em uma lista global (para acionamento).
             */
            if (!this.global[type])
            {
                this.global[type] = [];
            }

            this.global[type].push( element );
        },

        /**
         *
         */
        guid: 1,

        /**
         *
         */
        global: {},

        /**
         * Desanexe um evento ou conjunto de eventos de um elemento.
         */
        remove: function(element, type, handler)
        {
            if (element.events)
            {
                if (type && type.type)
                {
                    delete element.events[type.type][type.handler.guid];
                } else if (type && element.events[type])
                {
                    if (handler)
                    {
                        delete element.events[type][handler.guid];
                    } else
                    {
                        for (var i in element.events[type])
                        {
                            delete element.events[type][i];
                        }
                    }
                } else
                {
                    for (var j in element.events)
                    {
                        this.remove(element, j);
                    }
                }
            }
        },

        /**
         *
         */
        trigger: function(type, data, element)
        {
            /**
             * Clone os dados recebidos, se houver.
             */
            data = jQuery.makeArray(data || []);

            /**
             * Lidar com um gatilho global.
             */
            if (!element)
            {
                var g = this.global[type];

                if (g)
                {
                    jQuery.each(g, function()
                    {
                        jQuery.event.trigger(type, data, this);
                    });
                }

                /**
                 * Lidar com o acionamento de um único elemento.
                 */
            } else if (element["on" + type])
            {
                /**
                 * Passe adiante um evento falso.
                 */
                data.unshift(this.fix({type: type, target: element}));

                /**
                 * Acione o evento.
                 */
                var val = element["on" + type].apply(element, data);
                if (val !== false && jQuery.isFunction(element[type]))
                {
                    element[ type ]();
                }
            }
        },

        /**
         *
         */
        handle: function(event)
        {
            if (typeof jQuery == "undefined")
            {
                return false;
            }

            /**
             * O objeto vazio é para eventos acionados sem dados.
             */
            event = jQuery.event.fix(event || window.event || {}); 

            /**
             * Retornou indefinido ou falso.
             */
            var returnValue;

            var c = this.events[event.type];
            var args = [].slice.call(arguments, 1);
                args.unshift(event);

            for (var j in c)
            {
                /**
                 * Passe uma referência à própria função do manipulador.
                 * Para que possamos removê-lo posteriormente.
                 */
                args[0].handler = c[j];
                args[0].data = c[j].data;

                if (c[j].apply( this, args ) === false)
                {
                    event.preventDefault();
                    event.stopPropagation();
                    returnValue = false;
                }
            }

            /**
             * Limpe as propriedades adicionadas no IE para
             * evitar vazamento de memória.
             */
            if (jQuery.browser.msie)
            {
                event.target = event.preventDefault = event.stopPropagation = event.handler = event.data = null;
            }

            return returnValue;
        },

        /**
         *
         */
        fix: function(event)
        {
            /**
             * Corrija a propriedade de destino, se necessário.
             */
            if (!event.target && event.srcElement)
            {
                event.target = event.srcElement;
            }

            /**
             * Calcule pageX/Y se estiver faltando e clientX/Y disponível.
             */
            if (event.pageX == undefined && event.clientX != undefined)
            {
                var e = document.documentElement, b = document.body;

                event.pageX = event.clientX + (e.scrollLeft || b.scrollLeft);
                event.pageY = event.clientY + (e.scrollTop || b.scrollTop);
            }

            /**
             * Verifique se o destino é um textnode (safari).
             */
            if (jQuery.browser.safari && event.target.nodeType == 3)
            {
                /**
                 * Armazene uma cópia do objeto de evento original
                 * e clone porque o destino é somente leitura.
                 */
                var originalEvent = event;
                    event = jQuery.extend({}, originalEvent);

                /**
                 * Obtenha o parentnode do textnode.
                 */
                event.target = originalEvent.target.parentNode;

                /**
                 * Adicione preventDefault e stopPropagation, pois
                 * eles não funcionarão no clone.
                 */
                event.preventDefault = function()
                {
                    return originalEvent.preventDefault();
                };

                event.stopPropagation = function()
                {
                    return originalEvent.stopPropagation();
                };
            }

            /**
             * Consertar o preventDefault e stopPropagation.
             */
            if (!event.preventDefault)
            {
                event.preventDefault = function()
                {
                    this.returnValue = false;
                };
            }

            if (!event.stopPropagation)
            {
                event.stopPropagation = function()
                {
                    this.cancelBubble = true;
                };
            }

            return event;
        }
    };

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        bind: function(type, data, fn)
        {
            return this.each(function()
            {
                jQuery.event.add(this, type, fn || data, data);
            });
        },

        /**
         *
         */
        one: function(type, data, fn)
        {
            return this.each(function()
            {
                jQuery.event.add(this, type, function(event)
                {
                    jQuery(this).unbind(event);

                    return (fn || data).apply(this, arguments);
                }, data);
            });
        },

        /**
         *
         */
        unbind: function(type, fn)
        {
            return this.each(function()
            {
                jQuery.event.remove(this, type, fn);
            });
        },

        /**
         *
         */
        trigger: function(type, data)
        {
            return this.each(function()
            {
                jQuery.event.trigger(type, data, this);
            });
        },

        /**
         *
         */
        toggle: function()
        {
            /**
             * Salve a referência aos argumentos para acesso
             * no encerramento.
             */
            var a = arguments;

            /**
             *
             */
            return this.click(function(e)
            {
                /**
                 * Descubra qual função executar.
                 */
                this.lastToggle = this.lastToggle == 0 ? 1 : 0;

                /**
                 * Certifique-se de que os cliques parem.
                 */
                e.preventDefault();

                /**
                 * E execute a função.
                 */
                return a[this.lastToggle].apply(this, [e]) || false;
            });
        },

        /**
         *
         */
        hover: function(f, g)
        {
            /**
             * Uma função privada para lidar com o mouse 'hovering'.
             */
            function handleHover(e)
            {
                /**
                 * Verifique se mouse(over|out) ainda está dentro
                 * do mesmo elemento pai.
                 */
                var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;

                /**
                 * Atravesse a árvore.
                 */
                while (p && p != this)
                {
                    try
                    {
                        p = p.parentNode
                    } catch(e)
                    {
                        p = this;
                    };
                }

                /**
                 * Se realmente passarmos o mouse sobre um subelemento,
                 * ignore-o.
                 */
                if (p == this)
                {
                    return false;
                }

                /**
                 * Execute a função correta.
                 */
                return (e.type == "mouseover" ? f : g).apply(this, [e]);
            }

            /**
             * Vincule a função aos dois ouvintes de eventos.
             */
            return this.mouseover(handleHover).mouseout(handleHover);
        },

        /**
         *
         */
        ready: function(f)
        {
            /**
             * Se o DOM já estiver pronto.
             */
            if (jQuery.isReady)
            {
                /**
                 * Execute a função imediatamente.
                 */
                f.apply(document, [jQuery]);
            } else
            {
                /**
                 * Caso contrário, lembre-se da função para mais
                 * tarde. Adicione a função à lista de espera.
                 */
                jQuery.readyList.push(function()
                {
                    return f.apply(this, [jQuery])
                });
            }

            return this;
        }
    });

    /**
     *
     */
    jQuery.extend({
        /**
         * Todo o código que faz o DOM Ready funcionar bem.
         */
        isReady: false,

        /**
         *
         */
        readyList: [],

        /**
         * Tratar quando o DOM estiver pronto.
         */
        ready: function()
        {
            /**
             * Certifique-se de que o DOM ainda não esteja carregado.
             */
            if (!jQuery.isReady)
            {
                /**
                 * Lembre-se que o DOM está pronto.
                 */
                jQuery.isReady = true;

                /**
                 * Se houver funções vinculadas, para executar.
                 */
                if (jQuery.readyList)
                {
                    /**
                     * Execute todos eles.
                     */
                    jQuery.each(
                        jQuery.readyList, function()
                        {
                            this.apply(document);
                        }
                    );

                    /**
                     * Redefina a lista de funções.
                     */
                    jQuery.readyList = null;
                }

                /**
                 * Remova o ouvinte de eventos para evitar vazamento
                 * de memória.
                 */
                if (jQuery.browser.mozilla || jQuery.browser.opera)
                {
                    document.removeEventListener("DOMContentLoaded", jQuery.ready, false);
                }
            }
        }
    });

    /**
     *
     */
    new function()
    {
        jQuery.each(
            (
                "blur," +
                "focus," +
                "load," +
                "resize," +
                "scroll," +
                "unload," +
                "click," +
                "dblclick," +
                "mousedown," +
                "mouseup," +
                "mousemove," +
                "mouseover," +
                "mouseout," +
                "change," +
                "select," +
                "submit," +
                "keydown," +
                "keypress," +
                "keyup," +
                "error"
            ).split(","), function(i, o)
            {
                /**
                 * Lidar com vinculação de eventos.
                 */
                jQuery.fn[o] = function(f)
                {
                    return f ? this.bind(o, f) : this.trigger(o);
                };
            }
        );

        /**
         * Se Mozilla for usado.
         */
        if (jQuery.browser.mozilla || jQuery.browser.opera)
        {
            /**
             * Use o prático retorno de chamada de evento.
             */
            document.addEventListener("DOMContentLoaded", jQuery.ready, false);

            /**
             * Se o IE for usado, use o excelente hack.
             * http://www.outofhanwell.com/blog/index.php?title=the_window_onload_problem_revisited.
             */
        } else if (jQuery.browser.msie)
        {
            /**
             * Só funciona se você document.write() isso.
             */
            document.write("<scr" + "ipt id=__ie_init defer=true " + "src=//:><\/script>");

            /**
             * Use o hack do script defer.
             */
            var script = document.getElementById("__ie_init");

            /**
             * Script não existe se o jQuery for carregado dinamicamente.
             */
            if (script)
            {
                script.onreadystatechange = function()
                {
                    if (this.readyState != "complete")
                    {
                        return;
                    }

                    this.parentNode.removeChild(this);
                    jQuery.ready();
                };
            }

            /**
             * Limpe da memória.
             */
            script = null;

            /**
             * Se o safari for usado.
             */
        } else if (jQuery.browser.safari)
        {
            /**
             * Verifique continuamente se document.readyState é válido.
             */
            jQuery.safariTimer = setInterval(function()
            {
                /**
                 * Carregado e concluído são estados válidos.
                 */
                if (document.readyState == "loaded" || document.readyState == "complete")
                {
                    /**
                     * Se algum deles for encontrado, remova o cronômetro.
                     */
                    clearInterval(jQuery.safariTimer);

                    /**
                     *
                     */
                    jQuery.safariTimer = null;

                    /**
                     * E execute quaisquer funções de espera.
                     */
                    jQuery.ready();
                }
            }, 10);
        }

        /**
         * Um substituto para window.onload, que sempre funcionará.
         */
        jQuery.event.add(window, "load", jQuery.ready);
    };

    /**
     * Limpe após o IE para evitar vazamentos de memória.
     */
    if (jQuery.browser.msie)
    {
        jQuery(window).one("unload", function()
        {
            var global = jQuery.event.global;

            for (var type in global)
            {
                var els = global[type], i = els.length;

                if (i && type != 'unload')
                {
                    do
                    {
                        jQuery.event.remove(els[i - 1], type);
                    } while (--i);
                }
            }
        });
    }

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        show: function(speed, callback)
        {
            var hidden = this.filter(":hidden");

            return speed ?
                hidden.animate({
                    height: "show",
                    width: "show",
                    opacity: "show"
                }, speed, callback) :

                hidden.each(function()
                {
                    this.style.display = this.oldblock ? this.oldblock : "";

                    if (jQuery.css(this, "display") == "none")
                    {
                        this.style.display = "block";
                    }
                }
            );
        },

        /**
         *
         */
        hide: function(speed, callback)
        {
            var visible = this.filter(":visible");

            return speed ?
                visible.animate({
                    height: "hide",
                    width: "hide",
                    opacity: "hide"
                }, speed, callback) :

                visible.each(function()
                {
                    this.oldblock = this.oldblock || jQuery.css(this, "display");

                    if (this.oldblock == "none")
                    {
                        this.oldblock = "block";
                    }

                    this.style.display = "none";
                }
            );
        },

        /**
         * Salve a antiga função de alternância.
         */
        _toggle: jQuery.fn.toggle,

        /**
         *
         */
        toggle: function(fn, fn2)
        {
            var args = arguments;

            return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
                this._toggle(fn, fn2) :
                this.each(function()
                {
                    jQuery(this)[
                        jQuery(this).is(":hidden") ? "show" : "hide"
                    ].apply(jQuery(this), args);
                }
            );
        },

        /**
         *
         */
        slideDown: function(speed, callback)
        {
            return this.animate({
                height: "show"
            }, speed, callback);
        },

        /**
         *
         */
        slideUp: function(speed, callback)
        {
            return this.animate({
                height: "hide"
            }, speed, callback);
        },

        /**
         *
         */
        slideToggle: function(speed, callback)
        {
            return this.each(function()
            {
                var state = jQuery(this).is(":hidden") ? "show" : "hide";

                jQuery(this).animate({
                    height: state
                }, speed, callback);
            });
        },

        /**
         *
         */
        fadeIn: function(speed, callback)
        {
            return this.animate({
                opacity: "show"
            }, speed, callback);
        },

        /**
         *
         */
        fadeOut: function(speed, callback)
        {
            return this.animate({
                opacity: "hide"
            }, speed, callback);
        },

        /**
         *
         */
        fadeTo: function(speed, to, callback)
        {
            return this.animate({
                opacity: to
            }, speed, callback);
        },

        /**
         *
         */
        animate: function(prop, speed, easing, callback)
        {
            return this.queue(function()
            {
                this.curAnim = jQuery.extend({}, prop);

                var opt = jQuery.speed(speed, easing, callback);
                for (var p in prop)
                {
                    var e = new jQuery.fx(this, opt, p);

                    if (prop[p].constructor == Number)
                    {
                        e.custom(e.cur(), prop[p]);
                    } else
                    {
                        e[prop[p]](prop);
                    }
                }
            });
        },

        /**
         *
         */
        queue: function(type, fn)
        {
            if (!fn)
            {
                fn = type;
                type = "fx";
            }

            return this.each(function()
            {
                if (!this.queue)
                {
                    this.queue = {};
                }

                if (!this.queue[type])
                {
                    this.queue[type] = [];
                }

                this.queue[type].push(fn);
                if (this.queue[type].length == 1)
                {
                    fn.apply(this);
                }
            });
        }
    });

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        speed: function(speed, easing, fn)
        {
            var opt = speed && speed.constructor == Object ? speed : {
                complete: fn || !fn && easing || jQuery.isFunction( speed ) && speed,
                duration: speed,
                easing: fn && easing || easing && easing.constructor != Function && easing
            };

            /**
             *
             */
            opt.duration = (opt.duration && opt.duration.constructor == Number ? opt.duration : { slow: 600, fast: 200 }[opt.duration]) || 400;

            /**
             * Na fila.
             */
            opt.old = opt.complete;
            opt.complete = function()
            {
                jQuery.dequeue(this, "fx");
                if (jQuery.isFunction(opt.old))
                {
                    opt.old.apply(this);
                }
            };

            return opt;
        },

        /**
         *
         */
        easing: {},

        /**
         *
         */
        queue: {},

        /**
         *
         */
        dequeue: function(elem, type)
        {
            type = type || "fx";

            if (elem.queue && elem.queue[type])
            {
                /**
                 * Remover a si mesmo.
                 */
                elem.queue[type].shift();

                /**
                 * Obtenha a próxima função.
                 */
                var f = elem.queue[type][0];

                if (f)
                {
                    f.apply(elem);
                }
            }
        },

        /**
         * Originalmente, escrevi fx() como um clone de
         * moo.fx e, no processo de torná-lo pequeno, o
         * código tornou-se ilegível para pessoas sãs.
         * Voce foi avisado.
         */
        fx: function(elem, options, prop)
        {
            var z = this;

            /**
             * Os estilos.
             */
            var y = elem.style;

            /**
             * Armazene a propriedade de exibição.
             */
            var oldDisplay = jQuery.css(elem, "display");

            /**
             * Defina a propriedade de exibição como bloco para animação.
             */
            y.display = "block";

            /**
             * Certifique-se de que nada escape.
             */
            y.overflow = "hidden";

            /**
             * Função simples para definir um valor de estilo.
             */
            z.a = function()
            {
                if (options.step)
                {
                    options.step.apply(elem, [z.now]);
                }

                if (prop == "opacity")
                {
                    /**
                     * Deixe attr lidar com a opacidade.
                     */
                    jQuery.attr(y, "opacity", z.now);
                } else if (parseInt(z.now))
                {
                    /**
                     * Questão: falhas no IE ?
                     */
                    y[prop] = parseInt(z.now) + "px";
                }
            };

            /**
             * Descubra o número máximo para correr.
             */
            z.max = function()
            {
                return parseFloat(jQuery.css(elem, prop));
            };

            /**
             * Obtenha o tamanho atual.
             */
            z.cur = function()
            {
                var r = parseFloat(jQuery.curCSS(elem, prop));

                return r && r > -10000 ? r : z.max();
            };

            /**
             * Inicie uma animação de um número para outro.
             */
            z.custom = function(from, to)
            {
                z.startTime = (new Date()).getTime();
                z.now = from;
                z.a();

                z.timer = setInterval(function()
                {
                    z.step(from, to);
                }, 13);
            };

            /**
             * Função 'show' simples.
             */
            z.show = function()
            {
                if (!elem.orig)
                {
                    elem.orig = {};
                }

                /**
                 * Lembre-se de onde começamos, para que possamos
                 * voltar mais tarde.
                 */
                elem.orig[prop] = this.cur();
                options.show = true;

                /**
                 * Comece a animação.
                 */
                z.custom(0, elem.orig[prop]);

                /**
                 * Questão: falhas no IE ?
                 */
                if (prop != "opacity")
                {
                    y[prop] = "1px";
                }
            };

            /**
             * Função 'hide' simples.
             */
            z.hide = function()
            {
                if (!elem.orig)
                {
                    elem.orig = {};
                }

                /**
                 * Lembre-se de onde começamos, para que possamos
                 * voltar mais tarde.
                 */
                elem.orig[prop] = this.cur();
                options.hide = true;

                /**
                 * Comece a animação.
                 */
                z.custom(elem.orig[prop], 0);
            };

            /**
             * Função 'toggle' simples.
             */
            z.toggle = function()
            {
                if (!elem.orig)
                {
                    elem.orig = {};
                }

                /**
                 * Lembre-se de onde começamos, para que possamos
                 * voltar mais tarde.
                 */
                elem.orig[prop] = this.cur();

                if (oldDisplay == "none")
                {
                    options.show = true;

                    /**
                     * Questão: falhas no IE ?
                     */
                    if (prop != "opacity")
                    {
                        y[prop] = "1px";
                    }

                    /**
                     * Comece a animação.
                     */
                    z.custom(0, elem.orig[prop]);
                } else
                {
                    options.hide = true;

                    /**
                     * Comece a animação.
                     */
                    z.custom(elem.orig[prop], 0);
                }
            };

            /**
             * Cada etapa de uma animação.
             */
            z.step = function(firstNum, lastNum)
            {
                var t = (new Date()).getTime();

                if (t > options.duration + z.startTime)
                {
                    /**
                     * Pare o cronômetro.
                     */
                    clearInterval(z.timer);

                    z.timer = null;
                    z.now = lastNum;
                    z.a();

                    if (elem.curAnim)
                    {
                        elem.curAnim[prop] = true;
                    }

                    var done = true;
                    for (var i in elem.curAnim)
                    {
                        if (elem.curAnim[i] !== true)
                        {
                            done = false;
                        }
                    }

                    if (done)
                    {
                        /**
                         * Redefina o overflow.
                         */
                        y.overflow = "";

                        /**
                         * Reinicialize a tela.
                         */
                        y.display = oldDisplay;

                        if (jQuery.css(elem, "display") == "none")
                        {
                            y.display = "block";
                        }

                        /**
                         * Oculte o elemento se a operação "ocultar" tiver
                         * sido realizada.
                         */
                        if (options.hide)
                        {
                            y.display = "none";
                        }

                        /**
                         * Redefina as propriedades, se o item estiver
                         * oculto ou exibido.
                         */
                        if (options.hide || options.show)
                        {
                            for (var p in elem.curAnim)
                            {
                                if (p == "opacity")
                                {
                                    jQuery.attr(y, p, elem.orig[p]);
                                } else
                                {
                                    y[p] = "";
                                }
                            }
                        }
                    }

                    /**
                     * Se um retorno de chamada foi fornecido, execute-o.
                     */
                    if (done && jQuery.isFunction(options.complete))
                    {
                        /**
                         * Execute a função completa.
                         */
                        options.complete.apply(elem);
                    }
                } else
                {
                    var n = t - this.startTime;

                    /**
                     * Descubra onde estamos na animação e defina o número.
                     */
                    var p = n / options.duration;

                    /**
                     * Se a função de atenuação existir, use-a.
                     */
                    z.now = options.easing && jQuery.easing[options.easing] ? jQuery.easing[options.easing](p, n, firstNum, (lastNum - firstNum), options.duration) :
                        /**
                         * Caso contrário, use a atenuação linear padrão.
                         */
                        ((-Math.cos(p * Math.PI) / 2) + 0.5) * (lastNum - firstNum) + firstNum;

                    /**
                     * Execute a próxima etapa da animação.
                     */
                    z.a();
                }
            };
        }
    });

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        loadIfModified: function(url, params, callback)
        {
            this.load(url, params, callback, 1);
        },

        /**
         *
         */
        load: function(url, params, callback, ifModified)
        {
            if (jQuery.isFunction(url))
            {
                return this.bind("load", url);
            }

            callback = callback || function()
            {
            };

            /**
             * O padrão é uma solicitação GET.
             */
            var type = "GET";

            /**
             * Se o segundo parâmetro foi fornecido.
             */
            if (params)
            {
                /**
                 * Se for uma função.
                 */
                if (jQuery.isFunction(params.constructor))
                {
                    /**
                     * Presumimos que seja o callback.
                     */
                    callback = params;
                    params = null;

                    /**
                     * Caso contrário, crie uma sequência de parâmetros.
                     */
                } else
                {
                    params = jQuery.param(params);
                    type = "POST";
                }
            }

            var self = this;

            /**
             * Solicite o documento remoto.
             */
            jQuery.ajax({
                url: url,
                type: type,
                data: params,
                ifModified: ifModified,
                complete: function(res, status)
                {
                    if (status == "success" || !ifModified && status == "notmodified")
                    {
                        /**
                         * Injete o HTML em todos os elementos correspondentes.
                         */
                        self.attr("innerHTML", res.responseText)
                            /**
                             * Execute todos os scripts dentro do HTML
                             * recém-injetado.
                             */
                            .evalScripts()

                            /**
                             * Execute o callback.
                             */
                            .each(callback, [res.responseText, status, res]);
                    } else
                    {
                        callback.apply(self, [res.responseText, status, res]);
                    }
                }
            });

            return this;
        },

        /**
         *
         */
        serialize: function()
        {
            return jQuery.param(this);
        },

        /**
         *
         */
        evalScripts: function()
        {
            return this.find("script").each(function()
            {
                if (this.src)
                {
                    jQuery.getScript(this.src);
                } else
                {
                    jQuery.globalEval(this.text || this.textContent || this.innerHTML || "");
                }
            }).end();
        }
    });

    /**
     * Se o IE for usado, crie um wrapper para o objeto
     * XMLHttpRequest.
     */
    if (jQuery.browser.msie && typeof XMLHttpRequest == "undefined")
    {
        XMLHttpRequest = function()
        {
            return new ActiveXObject("Microsoft.XMLHTTP");
        };
    }

    /**
     * Anexe um monte de funções para lidar com eventos
     * AJAX comuns.
     */

    /**
     *
     */
    jQuery.each( "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function(i, o)
    {
        jQuery.fn[o] = function(f)
        {
            return this.bind(o, f);
        };
    });

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        get: function(url, data, callback, type, ifModified)
        {
            /**
             * shift argumentos se o argumento de dados foi omitido.
             */
            if (jQuery.isFunction(data))
            {
                callback = data;
                data = null;
            }

            return jQuery.ajax({
                url: url,
                data: data,
                success: callback,
                dataType: type,
                ifModified: ifModified
            });
        },

        /**
         *
         */
        getIfModified: function(url, data, callback, type)
        {
            return jQuery.get(url, data, callback, type, 1);
        },

        /**
         *
         */
        getScript: function(url, callback)
        {
            return jQuery.get(url, null, callback, "script");
        },

        /**
         *
         */
        getJSON: function(url, data, callback)
        {
            return jQuery.get(url, data, callback, "json");
        },

        /**
         *
         */
        post: function(url, data, callback, type)
        {
            return jQuery.ajax({
                type: "POST",
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        },

        /**
         * //
         * // timeout (ms).
         * //
         * timeout: 0,
         */

        /**
         *
         */
        ajaxTimeout: function(timeout)
        {
            jQuery.ajaxSettings.timeout = timeout;
        },

        /**
         *
         */
        ajaxSetup: function(settings)
        {
            jQuery.extend(jQuery.ajaxSettings, settings);
        },

        /**
         *
         */
        ajaxSettings: {
            global: true,
            type: "GET",
            timeout: 0,
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            data: null
        },

        /**
         * Cache de título modificado pela última vez para
         * a próxima solicitação.
         */
        lastModified: {},

        /**
         *
         */
        ajax: function(s)
        {
            /**
             * TODO introduz configurações globais, permitindo
             * ao cliente modificá-las para todas as solicitações,
             * não apenas para o tempo limite.
             */
            s = jQuery.extend({}, jQuery.ajaxSettings, s);

            /**
             * Se houver dados disponíveis.
             */
            if (s.data)
            {
                /**
                 * Converter dados se ainda não for uma string.
                 */
                if (s.processData && typeof s.data != "string")
                {
                    s.data = jQuery.param(s.data);
                }

                /**
                 * Anexe dados ao URL para obter solicitações.
                 */
                if(s.type.toLowerCase() == "get")
                {
                    /**
                     * "?" + data or "&" + data (caso já existam parâmetros).
                     */
                    s.url += ((s.url.indexOf("?") > -1) ? "&" : "?") + s.data;
                }
            }

            /**
             * Fique atento a um novo conjunto de solicitações.
             */
            if (s.global && ! jQuery.active++)
            {
                jQuery.event.trigger( "ajaxStart" );
            }

            var requestDone = false;

            /**
             * Crie o objeto de solicitação.
             */
            var xml = new XMLHttpRequest();

            /**
             * Abrir o soquete.
             */
            xml.open(s.type, s.url, s.async);

            /**
             * Defina o título correto, se os dados estiverem
             * sendo enviados.
             */
            if (s.data)
            {
                xml.setRequestHeader("Content-Type", s.contentType);
            }

            /**
             * Defina o título If-Modified-Since, se for modo ifModified.
             */
            if (s.ifModified)
            {
                xml.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT");
            }

            /**
             * Defina o título para que o script chamado saiba que
             * é um XMLHttpRequest.
             */
            xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");

            /**
             * Certifique-se de que o navegador envie o tamanho
             * correto do conteúdo.
             */
            if (xml.overrideMimeType)
            {
                xml.setRequestHeader("Connection", "close");
            }

            /**
             * Permitir títulos/tipos MIME personalizados.
             */
            if (s.beforeSend)
            {
                s.beforeSend(xml);
            }

            if (s.global)
            {
                jQuery.event.trigger("ajaxSend", [xml, s]);
            }

            /**
             * Aguarde uma resposta para voltar.
             */
            var onreadystatechange = function(isTimeout)
            {
                /**
                 * A transferência foi concluída e os dados estão
                 * disponíveis ou a solicitação expirou.
                 */
                if (xml && (xml.readyState == 4 || isTimeout == "timeout"))
                {
                    requestDone = true;
                    var status;

                    try
                    {
                        status = jQuery.httpSuccess(xml) && isTimeout != "timeout" ? s.ifModified && jQuery.httpNotModified(xml, s.url) ? "notmodified" : "success" : "error";

                        /**
                         * Certifique-se de que a solicitação foi bem-sucedida
                         * ou não foi modificada.
                         */
                        if (status != "error")
                        {
                            /**
                             * Título Last-Modified em cache, se estiver no
                             * modo ifModified.
                             */
                            var modRes;

                            /**
                             * Exceção de obter lançada por FF se o título
                             * não estiver disponível.
                             */
                            try
                            {
                                modRes = xml.getResponseHeader("Last-Modified");
                            } catch(e)
                            {
                            }

                            if (s.ifModified && modRes)
                            {
                                jQuery.lastModified[s.url] = modRes;
                            }

                            /**
                             * Processar os dados (executa o xml por meio de
                             * httpData independentemente do retorno de chamada).
                             */
                            var data = jQuery.httpData(xml, s.dataType);

                            /**
                             * Se um retorno de chamada local foi especificado,
                             * acione-o e transmita os dados.
                             */
                            if (s.success)
                            {
                                s.success(data, status);
                            }

                            /**
                             * Envie o retorno de chamada global.
                             */
                            if (s.global)
                            {
                                jQuery.event.trigger("ajaxSuccess", [xml, s]);
                            }
                        } else
                        {
                            jQuery.handleError(s, xml, status);
                        }
                    } catch(e)
                    {
                        status = "error";
                        jQuery.handleError(s, xml, status, e);
                    }

                    /**
                     * A solicitação foi concluída.
                     */
                    if (s.global)
                    {
                        jQuery.event.trigger("ajaxComplete", [xml, s]);
                    }

                    /**
                     * Lidar com o contador AJAX global.
                     */
                    if (s.global && ! --jQuery.active)
                    {
                        jQuery.event.trigger("ajaxStop");
                    }

                    /**
                     * Resultado do processo.
                     */
                    if (s.complete)
                    {
                        s.complete(xml, status);
                    }

                    /**
                     * Pare de vazamentos de memória.
                     */
                    xml.onreadystatechange = function(){};
                    xml = null;
                }
            };

            /**
             *
             */
            xml.onreadystatechange = onreadystatechange;

            /**
             * Verificador de tempo limite.
             */
            if (s.timeout > 0)
            {
                setTimeout(function()
                {
                    /**
                     * Verifique se a solicitação ainda está acontecendo.
                     */
                    if (xml)
                    {
                        /**
                         * Cancele a solicitação.
                         */
                        xml.abort();

                        if (!requestDone)
                        {
                            onreadystatechange("timeout");
                        }
                    }
                }, s.timeout);
            }

            /**
             * Salve referência sem vazamento.
             */
            var xml2 = xml;

            /**
             * Envie os dados.
             */
            try
            {
                xml2.send(s.data);
            } catch(e)
            {
                jQuery.handleError(s, xml, null, e);
            }

            /**
             * O Firefox 1.5 não envia statechange para solicitações
             * de sincronização.
             */
            if (!s.async)
            {
                onreadystatechange();
            }

            /**
             * Retorne XMLHttpRequest para permitir o aborto
             * da solicitação, etc.
             */
            return xml2;
        },

        /**
         *
         */
        handleError: function(s, xml, status, e)
        {
            /**
             * Se um callback local foi especificado, envie-o.
             */
            if (s.error)
            {
                s.error(xml, status, e);
            }

            /**
             * Envie o callback global.
             */
            if (s.global)
            {
                jQuery.event.trigger("ajaxError", [xml, s, e]);
            }
        },

        /**
         * Contador para armazenar o número de consultas ativas.
         */
        active: 0,

        /**
         * Determina se um XMLHttpRequest foi bem-sucedido ou não.
         */
        httpSuccess: function(r)
        {
            try
            {
                return !r.status && location.protocol == "file:" || (r.status >= 200 && r.status < 300) || r.status == 304 || jQuery.browser.safari && r.status == undefined;
            } catch(e)
            {
            }

            return false;
        },

        /**
         * Determina se um XMLHttpRequest retorna NotModified.
         */
        httpNotModified: function(xml, url)
        {
            try
            {
                var xmlRes = xml.getResponseHeader("Last-Modified");

                /**
                 * O Firefox sempre retorna 200. verifique a data da
                 * última modificação.
                 */
                return xml.status == 304 || xmlRes == jQuery.lastModified[url] || jQuery.browser.safari && xml.status == undefined;
            } catch(e)
            {
            }

            return false;
        },

        /**
         * Obtenha os dados de um XMLHttpRequest.
         * Retorna XML analisado se o título do tipo de
         * conteúdo for "xml" e o tipo for "xml" ou omitido,
         * caso contrário, retorne texto simples. (String) data -
         * O tipo de dados que você espera retornar (por exemplo,
         * "xml", "html", "script").
         */
        httpData: function(r, type)
        {
            var ct = r.getResponseHeader("content-type");
            var data = !type && ct && ct.indexOf("xml") >= 0;
                data = type == "xml" || data ? r.responseXML : r.responseText;

            /**
             * Se o tipo for "script", avalie-o no contexto global.
             */
            if (type == "script")
            {
                jQuery.globalEval(data);
            }

            /**
             * Obtenha o objeto JavaScript, se JSON for usado.
             */
            if (type == "json")
            {
                eval("data = " + data);
            }

            /**
             * Avaliar scripts em HTML.
             */
            if (type == "html")
            {
                jQuery("<div>").html(data).evalScripts();
            }

            return data;
        },

        /**
         * Serialize um vetor de elementos de formulário ou um
         * conjunto de chaves/valores em uma string de consulta.
         */
        param: function(a)
        {
            var s = [];

            /**
             * Se um array foi passado, suponha que seja um
             * array de elementos de formulário.
             */
            if (a.constructor == Array || a.jquery)
            {
                /**
                 * Serialize os elementos do formulário.
                 */
                jQuery.each(a, function()
                {
                    s.push(encodeURIComponent(this.name) + "=" + encodeURIComponent(this.value));
                });

                /**
                 * Caso contrário, suponha que seja um objeto de
                 * pares chave/valor.
                 */
            } else
            {
                /**
                 * Serialize as chaves/valores.
                 */
                for ( var j in a )
                {
                    /**
                     * Se o valor for um vetor, os nomes das chaves
                     * precisarão ser repetidos.
                     */
                    if ( a[j].constructor == Array )
                    {
                        jQuery.each( a[j], function()
                        {
                            s.push( encodeURIComponent(j) + "=" + encodeURIComponent(this));
                        });
                    } else
                    {
                        s.push( encodeURIComponent(j) + "=" + encodeURIComponent(a[j]));
                    }
                }
            }

            /**
             * Retorne a serialização resultante.
             */
            return s.join("&");
        },

        /**
         * Avalia um script em contexto global não confiável
         * para safari.
         */
        globalEval: function(data)
        {
            if (window.execScript)
            {
                window.execScript(data);
            } else if (jQuery.browser.safari)
            {
                /**
                 * Safari não fornece uma avaliação global síncrona.
                 */
                window.setTimeout(data, 0);
            } else
            {
                eval.call(window, data);
            }
        }
    });
}
