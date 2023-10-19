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
 * Impedir a execução do jQuery se incluído mais de
 * uma vez.
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
        if (window == this || !this.init)
        {
            return new jQuery(a, c);
        }

        return this.init(a, c);
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
        init: function(a, c)
        {
            /**
             * Certifique-se de que uma seleção foi fornecida.
             */
            a = a || document;

            /**
             * HANDLE: $(function).
             * Atalho para documento pronto.
             */
            if (jQuery.isFunction(a))
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
                /**
                 * HANDLE: $(html) -> $(array).
                 */
                var m = /^[^<]*(<(.|\s)+>)[^>]*$/.exec(a);

                if (m)
                {
                    a = jQuery.clean([m[1]]);
                } else
                {
                    /**
                     * HANDLE: $(expr).
                     */
                    return new jQuery(c).find(a);
                }
            }

            return this.setArray(
                /**
                 * HANDLE: $(array).
                 */
                a.constructor == Array && a ||

                /**
                 * HANDLE: $(arraylike).
                 * Observe quando um objeto semelhante a um array é
                 * passado como seletor.
                 */
                (a.jquery || a.length && a != window && !a.nodeType && a[0] != undefined && a[0].nodeType) && jQuery.makeArray(a) ||

                /**
                 * HANDLE: $(*).
                 */
                [a]
            );
        },

        /**
         *
         */
        jquery: "1.1.3",

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
            var ret = jQuery(a);
                ret.prevObject = this;

            return ret;
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
             * Procure o caso em que estamos acessando um valor
             * de estilo.
             */
            if (key.constructor == String)
            {
                if (value == undefined)
                {
                    return this.length && jQuery[type || "attr"](this[0], key) || undefined;
                } else
                {
                    obj = {};
                    obj[key] = value;
                }
            }

            /**
             * Verifique se estamos definindo valores de estilo.
             */
            return this.each(function(index)
            {
                /**
                 * Defina todos os estilos.
                 */
                for (var prop in obj)
                {
                    jQuery.attr(type ? this.style : this, prop, jQuery.prop(this, obj[prop], type, index, prop));
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
                return this.empty().append(
                    document.createTextNode(e)
                );
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
            var a, args = arguments;

            /**
             * Envolva cada um dos elementos correspondentes
             * individualmente.
             */
            return this.each(function()
            {
                if (!a)
                {
                    a = jQuery.clean(args, this.ownerDocument);
                }

                /**
                 * Clone a estrutura que estamos usando para encapsular.
                 */
                var b = a[0].cloneNode(true);

                /**
                 * Insira-o antes do elemento a ser encapsulado.
                 */
                this.parentNode.insertBefore(b, this);

                /**
                 * Encontre o ponto mais profundo na estrutura envolvente.
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
            var data = jQuery.map(this, function(a)
            {
                return jQuery.find(t, a);
            });

            return this.pushStack(/[^+>] [^+>]/.test( t ) || t.indexOf("..") > -1 ? jQuery.unique(data) : data);
        },

        /**
         *
         */
        clone: function(deep)
        {
            /**
             * Precisa remover eventos no elemento e seus descendentes.
             */
            var $this = this.add(this.find("*"));

            $this.each(function()
            {
                this._$events = {};
                for (var type in this.$events)
                {
                    this._$events[type] = jQuery.extend({}, this.$events[type]);
                }
            }).unbind();

            /**
             * Faça o clone.
             */
            var r = this.pushStack(
                jQuery.map(this, function(a)
                {
                    return a.cloneNode(deep != undefined ? deep : true);
                })
            );

            /**
             * Adicione os eventos de volta ao original e
             * seus descendentes.
             */
            $this.each(function()
            {
                var events = this._$events;
                for (var type in events)
                {
                    for (var handler in events[type])
                    {
                        jQuery.event.add(this, type, events[type][handler], events[type][handler].data);
                    }
                }

                this._$events = null;
            });

            /**
             * Devolva o conjunto clonado.
             */
            return r;
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
                }) || jQuery.multiFilter(t, this)
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
                    return (t.constructor == Array || t.jquery) ? jQuery.inArray(a, t) < 0 : a != t;
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
                    t.constructor == String ? jQuery(t).get() : t.length != undefined && (!t.nodeName || t.nodeName == "FORM") ? t : [t]
                )
            );
        },

        /**
         *
         */
        is: function(expr)
        {
            return expr ? jQuery.multiFilter(expr, this).length > 0 : false;
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
            var clone = this.length > 1, a; 

            return this.each(function()
            {
                if (!a)
                {
                    a = jQuery.clean(args, this.ownerDocument);

                    if (dir < 0)
                    {
                        a.reverse();
                    }
                }

                var obj = this;

                if (table && jQuery.nodeName(this, "table") && jQuery.nodeName(a[0], "tr"))
                {
                    obj = this.getElementsByTagName("tbody")[0] || this.appendChild(document.createElement("tbody"));
                }

                jQuery.each(a, function()
                {
                    fn.apply(obj, [clone ? this.cloneNode(true) : this]);
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
        var target = arguments[0], a = 1;

        /**
         * Estenda o próprio jQuery se apenas um argumento for passado.
         */
        if (arguments.length == 1)
        {
            target = this;
            a = 0;
        }

        var prop;
        while ((prop = arguments[a++]) != null)
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

            return jQuery;
        },

        /**
         * Isso pode parecer um código complexo, mas acredite em mim
         * quando digo que esta é a única maneira de fazer isso em
         * vários navegadores.
         */
        isFunction: function(fn)
        {
            return !!fn && typeof fn != "string" && !fn.nodeName && fn.constructor != Array && /function/i.test(fn + "");
        },

        /**
         * Verifique se um elemento está em um documento XML.
         */
        isXMLDoc: function(elem)
        {
            return elem.tagName && elem.ownerDocument && !elem.ownerDocument.body;
        },

        /**
         *
         */
        nodeName: function(elem, name)
        {
            return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
        },

        /**
         * args é apenas para uso interno.
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
        prop: function(elem, value, type, index, prop)
        {
            /**
             * Lidar com funções executáveis.
             */
            if (jQuery.isFunction(value))
            {
                value = value.call(elem, [index]);
            }

            /**
             * Exclua as seguintes propriedades CSS para adicionar px.
             */
            var exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i;

            /**
             * Manipular a passagem de um número para uma
             * propriedade CSS.
             */
            return value && value.constructor == Number && type == "curCSS" && !exclude.test(prop) ? value + "px" : value;
        },

        /**
         *
         */
        className: {
            /**
             * Apenas interno, use addClass("class").
             */
            add: function(elem, c)
            {
                jQuery.each(c.split(/\s+/), function(i, cur)
                {
                    if (!jQuery.className.has( elem.className, cur ))
                    {
                        elem.className += (elem.className ? " " : "") + cur;
                    }
                });
            },

            /**
             * Apenas interno, use removeClass("class").
             */
            remove: function(elem, c)
            {
                elem.className = c != undefined ?
                    jQuery.grep(elem.className.split(/\s+/), function(cur)
                    {
                        return !jQuery.className.has(c, cur);
                    }).join(" ") : "";
            },

            /**
             * Apenas interno, use is(".class").
             */
            has: function(t, c)
            {
                return jQuery.inArray(c, (t.className || t).toString().split(/\s+/)) > -1;
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
                    if (jQuery(e).is(':visible'))
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

                        var parPos = jQuery.css(e.parentNode, "position") || "static";
                        if (parPos == "static")
                        {
                            e.parentNode.style.position = "relative";
                        }

                        oHeight = e.clientHeight;
                        oWidth = e.clientWidth;

                        if (parPos == "static")
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
                ret = jQuery.attr(elem.style, "opacity");

                return ret == "" ? "1" : ret;
            }

            if (prop.match(/float/i))
            {
                prop = jQuery.styleFloat;
            }

            if (!force && elem.style[prop])
            {
                ret = elem.style[prop];
            } else if (document.defaultView && document.defaultView.getComputedStyle)
            {
                if (prop.match(/float/i))
                {
                    prop = "float";
                }

                prop = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
                var cur = document.defaultView.getComputedStyle(elem, null);

                if (cur)
                {
                    ret = cur.getPropertyValue(prop);
                } else if (prop == "display")
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
        clean: function(a, doc)
        {
            var r = [];
            doc = doc || document;

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
                    var s = jQuery.trim(arg).toLowerCase(), div = doc.createElement("div"), tb = [];

                    var wrap =
                        /**
                         * option ou optgroup.
                         */
                        !s.indexOf("<opt") &&
                        [1, "<select>", "</select>"] ||

                        !s.indexOf("<leg") &&
                        [1, "<fieldset>", "</fieldset>"] ||

                        (!s.indexOf("<thead") || !s.indexOf("<tbody") || !s.indexOf("<tfoot") || !s.indexOf("<colg")) &&
                        [1, "<table>", "</table>"] ||

                        !s.indexOf("<tr") &&
                        [2, "<table><tbody>", "</tbody></table>"] ||

                        /**
                         * <thead> correspondido acima.
                         */
                        (!s.indexOf("<td") || !s.indexOf("<th")) &&
                        [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||

                        !s.indexOf("<col") &&
                        [2, "<table><colgroup>", "</colgroup></table>"] ||

                        [0, "", ""];

                    /**
                     * Vá para html e volte, depois retire os wrappers extras.
                     */
                    div.innerHTML = wrap[1] + arg + wrap[2];

                    /**
                     * Mova-se para a profundidade certa.
                     */
                    while (wrap[0]--)
                    {
                        div = div.firstChild;
                    }

                    /**
                     * Remova o <tbody> inserido automaticamente do IE
                     * dos fragmentos da tabela.
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
                             * String era um <thead> ou <tfoot> simples.
                             */

                            tb = div.childNodes;
                        }

                        for (var n = tb.length-1; n >= 0 ; --n)
                        {
                            if (jQuery.nodeName(tb[n], "tbody") && !tb[n].childNodes.length)
                            {
                                tb[n].parentNode.removeChild(tb[n]);
                            }
                        }
                    }

                    arg = jQuery.makeArray( div.childNodes );
                }

                if (0 === arg.length && (!jQuery.nodeName(arg, "form") && !jQuery.nodeName(arg, "select")))
                {
                    return;
                }

                if (arg[0] == undefined || jQuery.nodeName(arg, "form") || arg.options)
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
            var fix = jQuery.isXMLDoc(elem) ? {} : jQuery.props;

            /**
             * Certos atributos só funcionam quando acessados pelo
             * antigo modo DOM 0.
             */
            if (fix[name])
            {
                if (value != undefined)
                {
                    elem[fix[name]] = value;
                }

                return elem[fix[name]];
            } else if (value == undefined && jQuery.browser.msie && jQuery.nodeName(elem, "form") && (name == "action" || name == "method"))
            {
                return elem.getAttributeNode(name).nodeValue;
            } else if (elem.tagName)
            {
                /**
                 * IE elem.getAttribute passa até para estilo.
                 */

                /**
                 * Na verdade, o IE usa filtros para opacidade ... elem
                 * é na verdade elem.style.
                 */
                if (name == "opacity" && jQuery.browser.msie)
                {
                    if (value != undefined)
                    {
                        /**
                         * O IE tem problemas com opacidade se não tiver
                         * layout. Force-o definindo o nível de zoom.
                         */
                        elem.zoom = 1; 

                        /**
                         * Defina o filtro alfa para definir a opacidade.
                         */
                        elem.filter = (elem.filter || "").replace(/alpha\([^)]*\)/,"") + (parseFloat(value).toString() == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
                    }

                    return elem.filter ? (parseFloat(elem.filter.match(/opacity=([^)]*)/)[1]) / 100).toString() : "";
                }

                if (value != undefined)
                {
                    elem.setAttribute(name, value);
                }

                if (jQuery.browser.msie && /href|src/.test(name) && !jQuery.isXMLDoc(elem))
                {
                    return elem.getAttribute(name, 2);
                }

                return elem.getAttribute(name);

                /**
                 * elem é na verdade elem.style ... defina o estilo.
                 */
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

            /**
             * É necessário usar typeof para combater travamentos
             * de childNodes do Safari.
             */
            if (typeof a != "array")
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
            /**
             * Temos que fazer um loop dessa maneira porque o IE
             * e o Opera substituem o comprimento expando de
             * getElementsByTagName.
             */
            for (var i = 0; second[i]; i++)
            {
                first.push(second[i]);
            }

            return first;
        },

        /**
         *
         */
        unique: function(first)
        {
            var r = [], num = jQuery.mergeNum++;

            for ( var i = 0, fl = first.length; i < fl; i++ )
            {
                if (num != first[i].mergeNum)
                {
                    first[i].mergeNum = num;
                    r.push(first[i]);
                }
            }

            return r;
        },

        /**
         *
         */
        mergeNum: 0,

        /**
         *
         */
        grep: function(elems, fn, inv)
        {
            /**
             * Se uma string for passada para a função, crie
             * uma função para ela (um atalho útil).
             */
            if (typeof fn == "string")
            {
                fn = new Function("a", "i", "return " + fn);
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

        /**
         *
         */
        map: function(elems, fn)
        {
            /**
             * Se uma string for passada para a função, crie uma
             * função para ela (um atalho útil).
             */
            if (typeof fn == "string")
            {
                fn = new Function("a", "return " + fn);
            }

            var result = [];

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

            return result;
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
            version: b.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)[1],
            safari: /webkit/.test(b),
            opera: /opera/.test(b),
            msie: /msie/.test(b) && !/opera/.test(b),
            mozilla: /mozilla/.test(b) && !/(compatible|webkit)/.test(b)
        };

        /**
         * Verifique se o modelo de caixa W3C está sendo usado.
         */
        jQuery.boxModel = !jQuery.browser.msie || document.compatMode == "CSS1Compat";
        jQuery.styleFloat = jQuery.browser.msie ? "styleFloat" : "cssFloat",
        jQuery.props = {
            "for": "htmlFor",
            "class": "className",
            "float": jQuery.styleFloat,
            cssFloat: jQuery.styleFloat,
            styleFloat: jQuery.styleFloat,
            innerHTML: "innerHTML",
            className: "className",
            value: "value",
            disabled: "disabled",
            checked: "checked",
            readonly: "readOnly",
            selected: "selected",
            maxlength: "maxLength"
        };
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
            var ret = jQuery.map(this, n);

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
            "": "m[2]=='*'||jQuery.nodeName(a,m[2])",
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
                "first-child": "a.parentNode.getElementsByTagName('*')[0]==a",
                "last-child": "jQuery.nth(a.parentNode.lastChild,1,'previousSibling')==a",
                "only-child": "!jQuery.nth(a.parentNode.lastChild,2,'previousSibling')",

                /**
                 * Verificações dos pais.
                 */
                parent: "a.firstChild",
                empty: "!a.firstChild",

                /**
                 * Verificação de texto.
                 */
                contains: "(a.textContent||a.innerText||'').indexOf(m[3])>=0",

                /**
                 * Visibilidade.
                 */
                visible: '"hidden"!=a.type&&jQuery.css(a,"display")!="none"&&jQuery.css(a,"visibility")!="hidden"',
                hidden: '"hidden"==a.type||jQuery.css(a,"display")=="none"||jQuery.css(a,"visibility")=="hidden"',

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
                text: "'text'==a.type",
                radio: "'radio'==a.type",
                checkbox: "'checkbox'==a.type",
                file: "'file'==a.type",
                password: "'password'==a.type",
                submit: "'submit'==a.type",
                image: "'image'==a.type",
                reset: "'reset'==a.type",
                button: '"button"==a.type||jQuery.nodeName(a,"button")',
                input: "/input|select|textarea|button/i.test(a.nodeName)"
            },

            /**
             *
             */
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
            /^\[ *(@)([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,

            /**
             * Corresponder: [div], [div p].
             */
            /^(\[)\s*(.*?(\[.*?\])?[^[]*?)\s*\]/,

            /**
             * Corresponder: :contains('foo').
             */
            /^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,

            /**
             * Corresponder: :even, :last-chlid, #id, .class.
             */
            new RegExp("^([:.#]*)(" + (jQuery.chars = "(?:[\\w\u0128-\uFFFF*_-]|\\\\.)" ) + "+)")
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

                expr = f.t.replace(/^\s*,\s*/, "" );
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
            } else if (!t.indexOf("/") && !context.ownerDocument)
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
            var ret = [context], done = [], last;

            /**
             * Continue enquanto existir uma expressão seletora e
             * enquanto não estivermos mais repetindo sobre nós
             * mesmos.
             */
            while (t && last != t)
            {
                var r = [];
                last = t;

                t = jQuery.trim(t).replace(/^\/\//, "");

                var foundToken = false;

                /**
                 * Uma tentativa de acelerar seletores filhos que
                 * apontam para uma tag de elemento específica.
                 */
                var re = new RegExp("^[/>]\\s*(" + jQuery.chars + "+)");
                var m = re.exec(t);

                if (m)
                {
                    var nodeName = m[1].toUpperCase();

                    /**
                     * Execute nossa própria iteração e filtro.
                     */
                    for (var i = 0; ret[i]; i++)
                    {
                        for (var c = ret[i].firstChild; c; c = c.nextSibling)
                        {
                            if (c.nodeType == 1 && (nodeName == "*" || c.nodeName == nodeName.toUpperCase()))
                            {
                                r.push(c);
                            }
                        }
                    }

                    ret = r;
                    t = t.replace(re, "");

                    if (t.indexOf(" ") == 0)
                    {
                        continue;
                    }

                    foundToken = true;
                } else
                {
                    re = /^((\/?\.\.)|([>\/+~]))\s*([a-z]*)/i;

                    if ((m = re.exec(t)) != null)
                    {
                        r = [];

                        var nodeName = m[4], mergeNum = jQuery.mergeNum++;
                        m = m[1];

                        for ( var j = 0, rl = ret.length; j < rl; j++ )
                        {
                            if (m.indexOf("..") < 0)
                            {
                                var n = m == "~" || m == "+" ? ret[j].nextSibling : ret[j].firstChild;
                                for (; n; n = n.nextSibling)
                                {
                                    if (n.nodeType == 1)
                                    {
                                        if (m == "~" && n.mergeNum == mergeNum)
                                        {
                                            break;
                                        }

                                        if (!nodeName || n.nodeName == nodeName.toUpperCase())
                                        {
                                            if (m == "~")
                                            {
                                                n.mergeNum = mergeNum;
                                            }

                                            r.push(n);
                                        }

                                        if (m == "+")
                                        {
                                            break;
                                        }
                                    }
                                }
                            } else
                            {
                                r.push(ret[j].parentNode);
                            }
                        }

                        ret = r;

                        /**
                         * E remova o token.
                         */
                        t = jQuery.trim(t.replace(re, ""));
                        foundToken = true;
                    }
                }

                /**
                 * Veja se ainda existe uma expressão e se ainda
                 * não combinamos um token.
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
                        if (context == ret[0])
                        {
                            ret.shift();
                        }

                        /**
                         * Mesclar os conjuntos de resultados.
                         */
                        done = jQuery.merge(done, ret);

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
                        var re2 = new RegExp("^(" + jQuery.chars + "+)(#)(" + jQuery.chars + "+)");
                        var m = re2.exec(t);

                        /**
                         * Reorganize os resultados para que sejam consistentes.
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
                            re2 = new RegExp("^([#.]?)(" + jQuery.chars + "*)");
                            m = re2.exec(t);
                        }

                        m[2] = m[2].replace(/\\/g, "");

                        var elem = ret[ret.length-1];

                        /**
                         * Tente fazer uma busca global por ID, sempre que
                         * possível.
                         */
                        if (m[1] == "#" && elem && elem.getElementById)
                        {
                            /**
                             * Otimização para caso de documento HTML.
                             */
                            var oid = elem.getElementById(m[2]);

                            /**
                             * Faça uma verificação rápida para a existência
                             * do atributo ID real para evitar a seleção pelo
                             * atributo name no IE e verifique também para
                             * garantir que id é uma string para evitar a
                             * seleção de um elemento com o nome 'id' dentro
                             * de um formulário.
                             */
                            if ((jQuery.browser.msie || jQuery.browser.opera) && oid && typeof oid.id == "string" && oid.id != m[2])
                            {
                                oid = jQuery('[@id="'+m[2]+'"]', elem)[0];
                            }

                            /**
                             * Faça uma verificação rápida do nome do nó
                             * (quando aplicável) para que as pesquisas
                             * div#foo sejam realmente rápidas.
                             */
                            ret = r = oid && (!m[3] || jQuery.nodeName(oid, m[3])) ? [oid] : [];
                        } else
                        {
                            /**
                             * Precisamos encontrar todos os elementos
                             * descendentes.
                             */
                            for (var i = 0; ret[i]; i++)
                            {
                                /**
                                 * Pegue o nome da tag que está sendo pesquisada.
                                 */
                                var tag = m[1] != "" || m[0] == "" ? "*" : m[2];

                                /**
                                 * Lide com o IE7 sendo realmente complexo
                                 * sobre <object>s.
                                 */
                                if (tag == "*" && ret[i].nodeName.toLowerCase() == "object")
                                {
                                    tag = "param";
                                }

                                r = jQuery.merge(r, ret[i].getElementsByTagName(tag));
                            }

                            /**
                             * É mais rápido filtrar por classe e pronto.
                             */
                            if (m[1] == ".")
                            {
                                r = jQuery.classFilter(r, m[2]);
                            }

                            /**
                             * O mesmo acontece com a filtragem de ID.
                             */
                            if (m[1] == "#")
                            {
                                var tmp = [];

                                /**
                                 * Tente encontrar o elemento com o ID.
                                 */
                                for (var i = 0; r[i]; i++)
                                {
                                    if (r[i].getAttribute("id") == m[2])
                                    {
                                        tmp = [r[i]];
                                        break;
                                    }
                                }

                                r = tmp;
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
             * Ocorreu um erro com o seletor; apenas retorne um
             * conjunto vazio.
             */
            if (t)
            {
                ret = [];
            }

            /**
             * Remova o contexto raiz.
             */
            if (ret && context == ret[0])
            {
                ret.shift();
            }

            /**
             * E combine os resultados.
             */
            done = jQuery.merge(done, ret);

            /**
             *
             */
            return done;
        },

        /**
         *
         */
        classFilter: function(r, m, not)
        {
            m = " " + m + " ";

            var tmp = [];
            for (var i = 0; r[i]; i++)
            {
                var pass = (" " + r[i].className + " ").indexOf(m) >= 0;
                if (!not && pass || not && !pass)
                {
                    tmp.push(r[i]);
                }
            }

            return tmp;
        },

        /**
         *
         */
        filter: function(t, r, not)
        {
            var last;

            /**
             * Procure expressões de filtro comuns.
             */
            while (t  && t != last)
            {
                last = t;

                var p = jQuery.parse, m;
                for (var i = 0; p[i]; i++)
                {
                    m = p[i].exec(t);

                    if (m)
                    {
                        /**
                         * Remova o que acabamos de combinar.
                         */
                        t = t.substring(m[0].length);

                        m[2] = m[2].replace(/\\/g, "");
                        break;
                    }
                }

                if (!m)
                {
                    break;
                }

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
                     * Podemos obter um grande aumento de velocidade
                     * filtrando por classe aqui.
                     */

                    r = jQuery.classFilter(r, m[2], not);
                } else if (m[1] == "@")
                {
                    var tmp = [], type = m[3];
                    for (var i = 0, rl = r.length; i < rl; i++)
                    {
                        var a = r[i], z = a[jQuery.props[m[2]] || m[2]];
                        if (z == null || /href|src/.test(m[2]))
                        {
                            z = jQuery.attr(a,m[2]);
                        }

                        if ((type == "" && !!z || type == "=" && z == m[5] || type == "!=" && z != m[5] || type == "^=" && z && !z.indexOf(m[5]) || type == "$=" && z.substr(z.length - m[5].length) == m[5] || (type == "*=" || type == "~=") && z.indexOf(m[5]) >= 0) ^ not)
                        {
                            tmp.push(a);
                        }
                    }

                    r = tmp;

                    /**
                     * Podemos obter um aumento de velocidade lidando
                     * com o nth-child aqui.
                     */
                } else if (m[1] == ":" && m[2] == "nth-child")
                {
                    var num = jQuery.mergeNum++,
                        tmp = [],
                        test = /(\d*)n\+?(\d*)/.exec(m[3] == "even" && "2n" || m[3] == "odd" && "2n+1" || !/\D/.test(m[3]) && "n+" + m[3] || m[3]),
                        first = (test[1] || 1) - 0, last = test[2] - 0;

                    for (var i = 0, rl = r.length; i < rl; i++)
                    {
                        var node = r[i], parentNode = node.parentNode;

                        if (num != parentNode.mergeNum)
                        {
                            var c = 1;
                            for (var n = parentNode.firstChild; n; n = n.nextSibling)
                            {
                                if (n.nodeType == 1)
                                {
                                    n.nodeIndex = c++;
                                }
                            }

                            parentNode.mergeNum = num;
                        }

                        var add = false;

                        if (first == 1)
                        {
                            if (last == 0 || node.nodeIndex == last)
                            {
                                add = true;
                            }
                        } else if ((node.nodeIndex + last) % first == 0)
                        {
                            add = true;
                        }

                        if (add ^ not)
                        {
                            tmp.push(node);
                        }
                    }

                    r = tmp;

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
                    eval("f = function(a,i){return " + f + "}");

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
                if (cur.nodeType == 1 && ++num == result)
                {
                    break;
                }
            }

            return cur;
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
     * Diversas funções auxiliares usadas para gerenciar
     * eventos. Muitas das ideias por trás deste código
     * originaram-se da biblioteca addEvent.
     */
    jQuery.event = {
        /**
         * Vincule um evento a um elemento.
         */
        add: function(element, type, handler, data)
        {
            /**
             * Por alguma razão, o IE tem problemas para passar
             * o objeto da janela, fazendo com que ele seja
             * clonado no processo.
             */
            if (jQuery.browser.msie && element.setInterval != undefined)
            {
                element = window;
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
             * Se os dados forem passados, vincule ao manipulador.
             */
            if (data != undefined)
            {
                /**
                 * Crie um ponteiro de função temporário para o
                 * manipulador original.
                 */
                var fn = handler; 

                /**
                 * Crie uma função de manipulador exclusiva, envolvida
                 * no manipulador original.
                 */
                handler = function()
                {
                    /**
                     * Passe argumentos e contexto para o manipulador
                     * original.
                     */
                    return fn.apply(this, arguments);
                };

                /**
                 * Armazene dados em um manipulador exclusivo.
                 */
                handler.data = data;

                /**
                 * Defina o guia do manipulador exclusivo como o
                 * mesmo do manipulador original, para que possa
                 * ser removido.
                 */
                handler.guid = fn.guid;
            }

            /**
             * Inicie a estrutura de eventos do elemento.
             */
            if (!element.$events)
            {
                element.$events = {};
            }

            if (!element.$handle)
            {
                element.$handle = function()
                {
                    /**
                     * retornou undefined ou false.
                     */
                    var val;

                    /**
                     * Lida com o segundo evento de um gatilho e quando
                     * um evento é chamado após o descarregamento de
                     * uma página.
                     */
                    if (typeof jQuery == "undefined" || jQuery.event.triggered)
                    {
                        return val;
                    }

                    val = jQuery.event.handle.apply(element, arguments);

                    return val;
                };
            }

            /**
             * Obtenha a lista atual de funções vinculadas a este evento.
             */
            var handlers = element.$events[type];

            /**
             * Inicie a fila do manipulador de eventos.
             */
            if (!handlers)
            {
                handlers = element.$events[type] = {};

                /**
                 * E vincule o manipulador de eventos global ao elemento.
                 */
                if (element.addEventListener)
                {
                    element.addEventListener(type, element.$handle, false);
                } else
                {
                    element.attachEvent("on" + type, element.$handle);
                }
            }

            /**
             * Adicione a função à lista de manipuladores do elemento.
             */
            handlers[handler.guid] = handler;

            /**
             * Lembre-se da função em uma lista global (para acionamento).
             */
            if (!this.global[type])
            {
                this.global[type] = [];
            }

            /**
             * Adicione o elemento à lista global apenas uma vez.
             */
            if (jQuery.inArray(element, this.global[type]) == -1)
            {
                this.global[type].push(element);
            }
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
            var events = element.$events, ret, index;

            if (events)
            {
                /**
                 * Type é na verdade um objeto de evento aqui.
                 */
                if (type && type.type)
                {
                    handler = type.handler;
                    type = type.type;
                }

                if (!type)
                {
                    for (type in events)
                    {
                        this.remove(element, type);
                    }
                } else if (events[type])
                {
                    /**
                     * Remova o manipulador fornecido para o tipo especificado.
                     */
                    if (handler)
                    {
                        delete events[type][handler.guid];
                    } else
                    {
                        /**
                         * Remova todos os manipuladores do tipo fornecido.
                         */

                        for (handler in element.$events[type])
                        {
                            delete events[type][handler];
                        }
                    }

                    /**
                     * Remova o manipulador de eventos genérico se
                     * não existirem mais manipuladores.
                     */
                    for (ret in events[type])
                    {
                        break;
                    }

                    if (!ret)
                    {
                        if (element.removeEventListener)
                        {
                            element.removeEventListener(type, element.$handle, false);
                        } else
                        {
                            element.detachEvent("on" + type, element.$handle);
                        }

                        ret = null;
                        delete events[type];

                        /**
                         * Remova o elemento do cache de tipo de evento global.
                         */
                        while (this.global[type] && ((index = jQuery.inArray(element, this.global[type])) >= 0))
                        {
                            delete this.global[type][index];
                        }
                    }
                }

                /**
                 * Remova o expando se não for mais usado.
                 */
                for (ret in events)
                {
                    break;
                }

                if (!ret)
                {
                    element.$handle = element.$events = null;
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
                jQuery.each(this.global[type] || [], function()
                {
                    jQuery.event.trigger(type, data, this);
                });
            } else
            {
                /**
                 * Lidar com o acionamento de um único elemento.
                 */

                var val,
                    ret,
                    fn = jQuery.isFunction(element[type] || null);

                /**
                 * Passe adiante um evento falso.
                 */
                data.unshift(
                    this.fix({
                        type: type,
                        target: element
                    })
                );

                /**
                 * Acione o evento.
                 */
                if (jQuery.isFunction(element.$handle) && (val = element.$handle.apply(element, data)) !== false)
                {
                    this.triggered = true;
                }

                if (fn && val !== false && !jQuery.nodeName(element, 'a'))
                {
                    element[type]();
                }

                this.triggered = false;
            }
        },

        /**
         *
         */
        handle: function(event)
        {
            /**
             * Retornou undefined ou false.
             */
            var val;

            /**
             * O objeto vazio é para eventos acionados sem dados.
             */
            event = jQuery.event.fix(event || window.event || {});

            var c = this.$events && this.$events[event.type], args = [].slice.call(arguments, 1);
            args.unshift(event);

            for (var j in c)
            {
                /**
                 * Passe uma referência à própria função do manipulador.
                 * Para que possamos removê-lo posteriormente.
                 */
                args[0].handler = c[j];
                args[0].data = c[j].data;

                if (c[j].apply(this, args) === false)
                {
                    event.preventDefault();
                    event.stopPropagation();
                    val = false;
                }
            }

            /**
             * Limpe as propriedades adicionadas no IE para evitar
             * vazamento de memória.
             */
            if (jQuery.browser.msie)
            {
                event.target = event.preventDefault = event.stopPropagation = event.handler = event.data = null;
            }

            return val;
        },

        /**
         *
         */
        fix: function(event)
        {
            /**
             * Armazene uma cópia do objeto de evento original e clone
             * para definir propriedades somente leitura.
             */
            var originalEvent = event;

            /**
             *
             */
            event = jQuery.extend({}, originalEvent);

            /**
             * Adicione preventDefault e stopPropagation, pois eles
             * não funcionarão no clone.
             */
            event.preventDefault = function()
            {
                /**
                 * Se preventDefault existir, execute-o no evento original.
                 */
                if (originalEvent.preventDefault)
                {
                    return originalEvent.preventDefault();
                }

                /**
                 * Caso contrário, defina a propriedade returnValue do
                 * evento original como false (IE).
                 */
                originalEvent.returnValue = false;
            };

            event.stopPropagation = function()
            {
                /**
                 * Se stopPropagation existir, execute-o no evento original.
                 */
                if (originalEvent.stopPropagation)
                {
                    return originalEvent.stopPropagation();
                }

                /**
                 * Caso contrário, defina a propriedade cancelBubble
                 * do evento original como true (IE).
                 */
                originalEvent.cancelBubble = true;
            };

            /**
             * Corrija a propriedade de destino, se necessário.
             */
            if (!event.target && event.srcElement)
            {
                event.target = event.srcElement;
            }

            /**
             * Verifique se o destino é um textnode (safári).
             */
            if (jQuery.browser.safari && event.target.nodeType == 3)
            {
                event.target = originalEvent.target.parentNode;
            }

            /**
             * Adicione relatedTarget, se necessário.
             */
            if (!event.relatedTarget && event.fromElement)
            {
                event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;
            }

            /**
             * Calcule pageX/Y se estiver faltando e clientX/Y disponível.
             */
            if (event.pageX == null && event.clientX != null)
            {
                var e = document.documentElement, b = document.body;

                event.pageX = event.clientX + (e && e.scrollLeft || b.scrollLeft);
                event.pageY = event.clientY + (e && e.scrollTop || b.scrollTop);
            }

            /**
             * Adicione which para eventos importantes.
             */
            if (!event.which && (event.charCode || event.keyCode))
            {
                event.which = event.charCode || event.keyCode;
            }

            /**
             * Adicione metaKey a navegadores que não sejam Mac (use
             * ctrl para PCs e Meta para Macs).
             */
            if (!event.metaKey && event.ctrlKey)
            {
                event.metaKey = event.ctrlKey;
            }

            /**
             * Adicione qual para clicar: 1 == left; 2 == middle; 3 == right.
             * Nota: o botão não está normalizado, portanto não o utilize.
             */
            if (!event.which && event.button)
            {
                event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
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
            return type == "unload" ? this.one(type, data, fn) : this.each(function()
            {
                jQuery.event.add(this, type, fn || data, fn && data);
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
                }, fn && data);
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

            return this.click(function(e)
            {
                /**
                 * Descubra qual função executar.
                 */
                this.lastToggle = 0 == this.lastToggle ? 1 : 0;

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
                var p = e.relatedTarget;

                /**
                 * Atravesse a árvore.
                 */
                while (p && p != this)
                {
                    try
                    {
                        p = p.parentNode;
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
                 * Caso contrário, lembre-se da função para mais tarde.
                 */

                /**
                 * Adicione a função à lista de espera.
                 */
                jQuery.readyList.push(function()
                {
                    return f.apply(this, [jQuery]);
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
                 * Remova o ouvinte de eventos para evitar vazamento de memória.
                 */
                if (jQuery.browser.mozilla || jQuery.browser.opera)
                {
                    document.removeEventListener("DOMContentLoaded", jQuery.ready, false);
                }

                /**
                 * Remova o elemento de script usado pelo hack do IE.
                 */
                if (!window.frames.length)
                {
                    /**
                     * Não remova se houver quadros (#1187).
                     */
                    jQuery(window).load(function()
                    {
                        jQuery("#__ie_init").remove();
                    });
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
             * Use o prático callback de evento.
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
             * Use o hack do script adiar.
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

                    jQuery.ready();
                };
            }

            /**
             * Limpe da memória.
             */
            script = null;

            /**
             * Se Safari for usado.
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
                        els[i - 1] && jQuery.event.remove(els[i - 1], type);
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
                if (jQuery.isFunction(params))
                {
                    /**
                     * Presumimos que seja o retorno de chamada.
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
     * Anexe um monte de funções para lidar com eventos
     * AJAX comuns.
     */

    /**
     *
     */
    jQuery.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function(i, o)
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
                type: "GET",
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
            if (jQuery.isFunction(data))
            {
                callback = data;
                data = {};
            }

            return jQuery.ajax({
                type: "POST",
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        },

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
         * Cache de títulos modificado pela última vez
         * para a próxima solicitação.
         */
        lastModified: {},

        /**
         *
         */
        ajax: function(s)
        {
            /**
             * TODO introduz configurações globais, permitindo ao
             * cliente modificá-las para todas as solicitações, não
             * apenas para o tempo limite.
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
                if (s.type.toLowerCase() == "get")
                {
                    /**
                     * "?" + data ou "&" + data (caso já existam parâmetros).
                     */
                    s.url += ((s.url.indexOf("?") > -1) ? "&" : "?") + s.data;

                    /**
                     * O IE gosta de enviar dados obtidos e postados,
                     * evite isso.
                     */
                    s.data = null;
                }
            }

            /**
             * Fique atento a um novo conjunto de solicitações.
             */
            if (s.global && ! jQuery.active++)
            {
                jQuery.event.trigger("ajaxStart");
            }

            var requestDone = false;

            /**
             * Crie o objeto de solicitação; A Microsoft não
             * conseguiu implementar corretamente o XMLHttpRequest
             * no IE7, por isso usamos o ActiveXObject quando ele
             * está disponível.
             */
            var xml = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();

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
             * Defina o título para que o script chamado saiba
             * que é um XMLHttpRequest.
             */
            xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");

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

                    /**
                     * Limpar intervalo de pesquisa.
                     */
                    if (ival)
                    {
                        clearInterval(ival);
                        ival = null;
                    }

                    /**
                     *
                     */
                    var status;

                    /**
                     *
                     */
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
                             * Título Last-Modified em cache, se estiver
                             * no modo ifModified.
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
                             * httpData independentemente do callback).
                             */
                            var data = jQuery.httpData(xml, s.dataType);

                            /**
                             * Se um callback local foi especificado,
                             * acione-o e transmita os dados.
                             */
                            if (s.success)
                            {
                                s.success(data, status);
                            }

                            /**
                             * Envia o callback global.
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
                    if (s.async)
                    {
                        xml = null;
                    }
                }
            };

            /**
             * Não anexe o manipulador à solicitação, apenas pesquise-o.
             */
            var ival = setInterval(onreadystatechange, 13); 

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
             * Envie os dados.
             */
            try
            {
                xml.send(s.data);
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
             * Devolve XMLHttpRequest para permitir o aborto
             * da solicitação, etc.
             */
            return xml;
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
             * Envia o callback global.
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
         * Obtenha os dados de um XMLHttpRequest. Retorna
         * XML analisado se o título do tipo de conteúdo
         * for "xml" e o tipo for "xml" ou omitido, caso
         * contrário, retorne texto simples. (String) data -
         * O tipo de dados que você espera retornar (por
         * exemplo, "xml", "html", "script").
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
                data = eval("(" + data + ")");
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
         * Serialize um vetor de elementos de formulário ou
         * um conjunto de chaves/valores em uma string de
         * consulta.
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
            } else
            {
                /**
                 * Caso contrário, suponha que seja um objeto de
                 * pares chave/valor.
                 */

                /**
                 * Serialize as chaves/valores.
                 */
                for (var j in a)
                {
                    /**
                     * Se o valor for um vetor, os nomes das chaves
                     * precisarão ser repetidos.
                     */
                    if (a[j] && a[j].constructor == Array)
                    {
                        jQuery.each(a[j], function()
                        {
                            s.push(encodeURIComponent(j) + "=" + encodeURIComponent(this));
                        });
                    } else
                    {
                        s.push(encodeURIComponent(j) + "=" + encodeURIComponent(a[j]));
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

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        show: function(speed, callback)
        {
            return speed ?
                this.animate({
                    height: "show",
                    width: "show",
                    opacity: "show"
                }, speed, callback) :

                this.filter(":hidden").each(function()
                {
                    this.style.display = this.oldblock ? this.oldblock : "";

                    if (jQuery.css(this, "display") == "none")
                    {
                        this.style.display = "block";
                    }
                }).end();
        },

        /**
         *
         */
        hide: function(speed, callback)
        {
            return speed ?
                this.animate({
                    height: "hide",
                    width: "hide",
                    opacity: "hide"
                }, speed, callback) :

                this.filter(":visible").each(function()
                {
                    this.oldblock = this.oldblock || jQuery.css(this,"display");

                    if (this.oldblock == "none")
                    {
                        this.oldblock = "block";
                    }

                    this.style.display = "none";
                }).end();
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
            return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
                this._toggle(fn, fn2) :
                fn ?
                    this.animate({
                        height: "toggle",
                        width: "toggle",
                        opacity: "toggle"
                    }, fn, fn2) :

                    this.each(function()
                    {
                        jQuery(this)[
                            jQuery(this).is(":hidden") ? "show" : "hide"
                        ]();
                    });
        },

        /**
         *
         */
        slideDown: function(speed, callback)
        {
            return this.animate({ height: "show" }, speed, callback);
        },

        /**
         *
         */
        slideUp: function(speed, callback)
        {
            return this.animate({ height: "hide" }, speed, callback);
        },

        /**
         *
         */
        slideToggle: function(speed, callback)
        {
            return this.animate({ height: "toggle" }, speed, callback);
        },

        /**
         *
         */
        fadeIn: function(speed, callback)
        {
            return this.animate({ opacity: "show" }, speed, callback);
        },

        /**
         *
         */
        fadeOut: function(speed, callback)
        {
            return this.animate({ opacity: "hide" }, speed, callback);
        },

        /**
         *
         */
        fadeTo: function(speed, to, callback)
        {
            return this.animate({ opacity: to }, speed, callback);
        },

        /**
         *
         */
        animate: function(prop, speed, easing, callback)
        {
            return this.queue(function()
            {
                var hidden = jQuery(this).is(":hidden"),
                    opt = jQuery.speed(speed, easing, callback),
                    self = this;

                for (var p in prop)
                {
                    if (prop[p] == "hide" && hidden || prop[p] == "show" && !hidden)
                    {
                        return jQuery.isFunction(opt.complete) && opt.complete.apply(this);
                    }
                }

                this.curAnim = jQuery.extend({}, prop);
                jQuery.each( prop, function(name, val)
                {
                    var e = new jQuery.fx( self, opt, name );

                    if (val.constructor == Number)
                    {
                        e.custom(e.cur(), val);
                    } else
                    {
                        e[val == "toggle" ? hidden ? "show" : "hide" : val](prop);
                    }
                });
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
                complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
                duration: speed,
                easing: fn && easing || easing && easing.constructor != Function && easing || (jQuery.easing.swing ? "swing" : "linear")
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
        easing: {
            /**
             *
             */
            linear: function(p, n, firstNum, diff)
            {
                return firstNum + diff * p;
            },

            /**
             *
             */
            swing: function(p, n, firstNum, diff)
            {
                return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum;
            }
        },

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
                 * Remova a si mesmo.
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
         *
         */
        timers: [],

        /**
         * Originalmente, escrevi fx() como um clone de moo.fx e,
         * no processo de torná-lo pequeno, o código tornou-se
         * ilegível para pessoas sãs. Voce foi avisado.
         */
        fx: function(elem, options, prop)
        {
            var z = this;

            /**
             * Os estilos.
             */
            var y = elem.style;

            if (prop == "height" || prop == "width")
            {
                /**
                 * Armazene a propriedade de exibição.
                 */
                var oldDisplay = jQuery.css(elem, "display");

                /**
                 * Certifique-se de que nada escape.
                 */
                var oldOverflow = y.overflow;

                /**
                 *
                 */
                y.overflow = "hidden";
            }

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
                } else
                {
                    y[prop] = parseInt(z.now) + "px";

                    /**
                     * Defina a propriedade de exibição como bloco
                     * para animação
                     */
                    y.display = "block";
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

                jQuery.timers.push(function()
                {
                    return z.step(from, to);
                });

                if (jQuery.timers.length == 1)
                {
                    var timer = setInterval(function()
                    {
                        var timers = jQuery.timers;
                        for (var i = 0; i < timers.length; i++)
                        {
                            if (!timers[i]())
                            {
                                timers.splice(i--, 1);
                            }
                        }

                        if (!timers.length)
                        {
                            clearInterval(timer);
                        }
                    }, 13);
                }
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
                elem.orig[prop] = jQuery.attr(elem.style, prop);

                /**
                 *
                 */
                options.show = true;

                /**
                 * Comece a animação.
                 */
                z.custom(0, this.cur());

                /**
                 * Certifique-se de começar com uma largura/altura
                 * pequena para evitar qualquer flash de conteúdo.
                 */
                if (prop != "opacity")
                {
                    y[prop] = "1px";
                }

                /**
                 * Comece mostrando o elemento.
                 */
                jQuery(elem).show();
            };

            /**
             * Função 'hide'simples.
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
                elem.orig[prop] = jQuery.attr(elem.style, prop);

                /**
                 *
                 */
                options.hide = true;

                /**
                 * Comece a animação.
                 */
                z.custom(this.cur(), 0);
            };

            /**
             * Cada etapa de uma animação.
             */
            z.step = function(firstNum, lastNum)
            {
                var t = (new Date()).getTime();

                if (t > options.duration + z.startTime)
                {
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
                        if (oldDisplay != null)
                        {
                            /**
                             * Redefina o overflow.
                             */
                            y.overflow = oldOverflow;

                            /**
                             * Reinicialize a exibição.
                             */
                            y.display = oldDisplay;

                            /**
                             *
                             */
                            if (jQuery.css(elem, "display") == "none")
                            {
                                y.display = "block";
                            }
                        }

                        /**
                         * Oculte o elemento se a operação "hide" (ocultar ?)
                         * tiver sido realizada.
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
                                jQuery.attr(y, p, elem.orig[p]);
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

                    return false;
                } else
                {
                    var n = t - this.startTime;

                    /**
                     * Descubra onde estamos na animação e defina o número.
                     */
                    var p = n / options.duration;

                    /**
                     * Execute a função de atenuação, o padrão é swing.
                     */
                    z.now = jQuery.easing[options.easing](p, n, firstNum, (lastNum - firstNum), options.duration);

                    /**
                     * Execute a próxima etapa da animação.
                     */
                    z.a();
                }

                return true;
            };
        }
    });
}
