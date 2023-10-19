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
(function()
{
    /**
     * Mapeie sobre jQuery em caso de substituição.
     */
    if (typeof jQuery != "undefined")
    {
        var _jQuery = jQuery;
    }

    /**
     *
     */
    var jQuery = window.jQuery = function(a, c)
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
        var _$ = $;
    }

    /**
     * Mapeie o namespace jQuery para o '$'.
     */
    window.$ = jQuery;

    /**
     *
     */
    var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/;

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
             * Lidar com strings HTML.
             */
            if (typeof a  == "string")
            {
                var m = quickExpr.exec(a);
                if (m && (m[1] || !c))
                {
                    /**
                     * HANDLE: $(html) -> $(array).
                     */
                    if (m[1])
                    {
                        a = jQuery.clean([m[1]], c);
                    } else
                    {
                        /**
                         * HANDLE: $("#id").
                         */

                        var tmp = document.getElementById(m[3]);
                        if (tmp)
                        {
                            /**
                             * Lide com o caso em que o IE e o Opera retornam
                             * itens por nome em vez de ID.
                             */
                            if (tmp.id != m[3])
                            {
                                return jQuery().find(a);
                            } else
                            {
                                this[0] = tmp;
                                this.length = 1;

                                return this;
                            }
                        } else
                        {
                            a = [];
                        }
                    }

                    /**
                     * HANDLE: $(expr).
                     */
                } else
                {
                    return new jQuery( c ).find( a );
                }

                /**
                 * HANDLE: $(function).
                 * Atalho para documento pronto.
                 */
            } else if (jQuery.isFunction(a))
            {
                return new jQuery(document)[
                    jQuery.fn.ready ? "ready" : "load"
                ](a);
            }

            return this.setArray(
                /**
                 * HANDLE: $(array).
                 */
                a.constructor == Array && a ||

                /**
                 * HANDLE: $(arraylike).
                 *
                 * Observe quando um objeto semelhante a um array é
                 * passado como seletor.
                 */
                (a.jquery || a.length && a != window && !a.nodeType && a[0] != undefined && a[0].nodeType) && jQuery.makeArray( a ) ||

                /**
                 * HANDLE: $(*).
                 */
                [a]
            );
        },

        /**
         *
         */
        jquery: "1.2",

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
                 * Retorne um vetor 'clean' (limpo).
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
            Array.prototype.push.apply(this, a);

            /**
             *
             */
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
                    jQuery.attr(
                        type ? this.style : this,
                        prop,
                        jQuery.prop(this, obj[prop], type, index, prop)
                    );
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
            if (typeof e != "object" && e != null)
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
        wrapAll: function(html)
        {
            if ( this[0] )
            {
                /**
                 * Os elementos para envolver o alvo.
                 */
                jQuery(html, this[0].ownerDocument)
                    .clone()
                    .insertBefore(this[0])
                    .map(function()
                    {
                        var elem = this;
                        while (elem.firstChild)
                        {
                            elem = elem.firstChild;
                        }

                        return elem;
                    }).append(this);
            }

            return this;
        },

        /**
         *
         */
        wrapInner: function(html)
        {
            return this.each(function()
            {
                jQuery(this).contents().wrapAll(html);
            });
        },

        /**
         *
         */
        wrap: function(html)
        {
            return this.each(function()
            {
                jQuery(this).wrapAll(html);
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

            return this.pushStack(/[^+>] [^+>]/.test(t) || t.indexOf("..") > -1 ? jQuery.unique(data) : data);
        },

        /**
         *
         */
        clone: function(events)
        {
            /**
             * Faça o clone.
             */
            var ret = this.map(function()
            {
                return this.outerHTML ? jQuery(this.outerHTML)[0] : this.cloneNode(true);
            });

            if (events === true)
            {
                var clone = ret.find("*").andSelf();

                this.find("*").andSelf().each(function(i)
                {
                    var events = jQuery.data(this, "events");
                    for (var type in events)
                    {
                        for (var handler in events[type])
                        {
                            jQuery.event.add(
                                clone[i],
                                type,
                                events[type][handler],
                                events[type][handler].data
                            );
                        }
                    }
                });
            }

            /**
             * Devolva o conjunto clonado.
             */
            return ret;
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
                    return t.apply(el, [index]);
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
        hasClass: function(expr)
        {
            return this.is("." + expr);
        },

        /**
         *
         */
        val: function(val)
        {
            if (val == undefined)
            {
                if (this.length)
                {
                    var elem = this[0];

                    /**
                     * Precisamos lidar com caixas de seleção especiais.
                     */
                    if (jQuery.nodeName(elem, "select"))
                    {
                        var index = elem.selectedIndex,
                            a = [],
                            options = elem.options,
                            one = elem.type == "select-one";

                        /**
                         * Nada foi selecionado.
                         */
                        if (index < 0)
                        {
                            return null;
                        }

                        /**
                         * Percorra todas as opções selecionadas.
                         */
                        for (var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++)
                        {
                            var option = options[i];

                            if (option.selected)
                            {
                                /**
                                 * Obtenha o valor específico para a opção.
                                 */
                                var val = jQuery.browser.msie && !option.attributes["value"].specified ? option.text : option.value;

                                /**
                                 * Não precisamos de um array para uma seleção.
                                 */
                                if (one)
                                {
                                    return val;
                                }

                                /**
                                 * Multi-seleções retornam um array.
                                 */
                                a.push(val);
                            }
                        }

                        return a;

                        /**
                         * Todo o resto, apenas pegamos o valor.
                         */
                    } else
                    {
                        return this[0].value.replace(/\r/g, "");
                    }
                }
            } else
            {
                return this.each(function()
                {
                    if (val.constructor == Array && /radio|checkbox/.test(this.type))
                    {
                        this.checked = (jQuery.inArray(this.value, val) >= 0 || jQuery.inArray(this.name, val) >= 0);
                    } else if (jQuery.nodeName(this, "select"))
                    {
                        var tmp = val.constructor == Array ? val : [val];

                        jQuery("option", this).each(function()
                        {
                            this.selected = (jQuery.inArray(this.value, tmp) >= 0 || jQuery.inArray(this.text, tmp) >= 0);
                        });

                        if (!tmp.length)
                        {
                            this.selectedIndex = -1;
                        }
                    } else
                    {
                        this.value = val;
                    }
                });
            }
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
        replaceWith: function(val)
        {
            return this.after(val).remove();
        },

        /**
         *
         */
        slice: function()
        {
            return this.pushStack(
                Array.prototype.slice.apply(this, arguments)
            );
        },

        /**
         *
         */
        map: function(fn)
        {
            return this.pushStack(
                jQuery.map(this, function(elem, i)
                {
                    return fn.call(elem, i, elem);
                })
            );
        },

        /**
         *
         */
        andSelf: function()
        {
            return this.add(this.prevObject);
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
                    if (jQuery.nodeName(this, "script"))
                    {
                        if (this.src)
                        {
                            jQuery.ajax({
                                url: this.src,
                                async: false,
                                dataType: "script"
                            });
                        } else
                        {
                            jQuery.globalEval(this.text || this.textContent || this.innerHTML || "");
                        }
                    } else
                    {
                        fn.apply(obj, [clone ? this.cloneNode(true) : this]);
                    }
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
        var target = arguments[0] || {},
            a = 1,
            al = arguments.length,
            deep = false;

        /**
         * Lide com uma situação de cópia profunda.
         */
        if (target.constructor == Boolean)
        {
            deep = target;
            target = arguments[1] || {};
        }

        /**
         * Estenda o próprio jQuery se apenas um argumento for passado.
         */
        if (al == 1)
        {
            target = this;
            a = 0;
        }

        var prop;
        for (; a < al; a++)
        {
            /**
             * Lide apenas com valores non-null/undefined.
             */
            if ((prop = arguments[a]) != null)
            {
                /**
                 * Estenda o objeto base.
                 */
                for (var i in prop)
                {
                    /**
                     * Evite loop sem fim.
                     */
                    if (target == prop[i])
                    {
                        continue;
                    }

                    /**
                     * Recurse se estivermos mesclando valores de objetos.
                     */
                    if (deep && typeof prop[i] == 'object' && target[i])
                    {
                        jQuery.extend(target[i], prop[i]);
                    } else if (prop[i] != undefined)
                    {
                        /**
                         * Não traga valores indefinidos.
                         */
                        target[i] = prop[i];
                    }
                }
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
    var expando = "jQuery" + (new Date()).getTime(), uuid = 0, win = {};

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        noConflict: function(deep)
        {
            window.$ = _$;

            if (deep)
            {
                window.jQuery = _jQuery;
            }

            return jQuery;
        },

        /**
         * Isso pode parecer um código complexo, mas acredite em
         * mim quando digo que esta é a única maneira de fazer
         * isso em vários navegadores.
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
            return elem.documentElement && !elem.body || elem.tagName && elem.ownerDocument && !elem.ownerDocument.body;
        },

        /**
         * Avalia um script em um contexto global. Avalia
         * assíncrono. no Safári 2.
         */
        globalEval: function(data)
        {
            data = jQuery.trim(data);

            if (data)
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
        },

        /**
         *
         */
        nodeName: function(elem, name)
        {
            return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
        },

        /**
         *
         */
        cache: {},

        /**
         *
         */
        data: function(elem, name, data)
        {
            elem = elem == window ? win : elem;

            var id = elem[expando];

            /**
             * Calcule um ID exclusivo para o elemento.
             */
            if (!id)
            {
                id = elem[expando] = ++uuid;
            }

            /**
             * Gere o cache de dados apenas se estivermos tentando
             * acessá-lo ou manipulá-lo.
             */
            if (name && !jQuery.cache[id])
            {
                jQuery.cache[id] = {};
            }

            /**
             * Evite substituir o cache nomeado por valores
             * indefinidos.
             */
            if (data != undefined)
            {
                jQuery.cache[id][name] = data;
            }

            /**
             * Retorne os dados do cache nomeado ou o ID do elemento.
             */
            return name ? jQuery.cache[id][name] : id;
        },

        /**
         *
         */
        removeData: function(elem, name)
        {
            elem = elem == window ? win : elem;

            var id = elem[expando];

            /**
             * Se quisermos remover uma seção específica dos
             * dados do elemento.
             */
            if (name)
            {
                if (jQuery.cache[id])
                {
                    /**
                     * Remova a seção de dados do cache.
                     */
                    delete jQuery.cache[id][name];

                    /**
                     * Se removemos todos os dados, remova o cache do
                     * elemento.
                     */
                    name = "";

                    for (name in jQuery.cache[id])
                    {
                        break;
                    }

                    if (!name)
                    {
                        jQuery.removeData(elem);
                    }
                }

                /**
                 * Caso contrário, queremos remover todos os dados do elemento.
                 */
            } else
            {
                /**
                 * Limpe o elemento expando.
                 */
                try
                {
                    delete elem[expando];
                } catch(e)
                {
                    /**
                     * O IE tem problemas para remover diretamente o
                     * expando, mas não há problema em usar removeAttribute.
                     */
                    if (elem.removeAttribute)
                    {
                        elem.removeAttribute(expando);
                    }
                }

                /**
                 * Remova completamente o cache de dados.
                 */
                delete jQuery.cache[id];
            }
        },

        /**
         * args é apenas para uso interno.
         */
        each: function(obj, fn, args)
        {
            if (args)
            {
                if (obj.length == undefined)
                {
                    for (var i in obj)
                    {
                        fn.apply(obj[i], args);
                    }
                } else
                {
                    for (var i = 0, ol = obj.length; i < ol; i++)
                    {
                        if (fn.apply(obj[i], args) === false)
                        {
                            break;
                        }
                    }
                }

                /**
                 * Um case especial e rápido para o uso mais comum
                 * de cada um.
                 */
            } else
            {
                if (obj.length == undefined)
                {
                    for (var i in obj)
                    {
                        fn.call(obj[i], i, obj[i]);
                    }
                } else
                {
                    for (var i = 0, ol = obj.length, val = obj[0]; i < ol && fn.call(val, i, val) !== false; val = obj[++i])
                    {
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
             * Manipular a passagem de um número para uma propriedade CSS.
             */
            return value && value.constructor == Number && type == "curCSS" && !exclude.test(prop) ? value + "px" : value;
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
                jQuery.each((c || "").split(/\s+/), function(i, cur)
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
                elem.className = c != undefined ?
                    jQuery.grep( elem.className.split(/\s+/), function(cur)
                    {
                        return !jQuery.className.has( c, cur ); 
                    }).join(" ") : "";
            },

            /**
             * Somente interno, use is(".class").
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

            f.apply( e, [] );
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
            var ret,
                stack = [],
                swap = [];

            /**
             * Um método auxiliar para determinar se os valores de
             * um elemento estão com falhas.
             */
            function color(a)
            {
                if (!jQuery.browser.safari)
                {
                    return false;
                }

                /**
                 *
                 */
                var ret = document.defaultView.getComputedStyle(a, null);

                /**
                 *
                 */
                return !ret || ret.getPropertyValue("color") == "";
            }

            if (prop == "opacity" && jQuery.browser.msie)
            {
                ret = jQuery.attr(elem.style, "opacity");

                return ret == "" ? "1" : ret;
            }

            if (prop.match(/float/i))
            {
                prop = styleFloat;
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

                prop = prop.replace(/([A-Z])/g,"-$1").toLowerCase();

                var cur = document.defaultView.getComputedStyle(elem, null);
                if (cur && !color(elem))
                {
                    ret = cur.getPropertyValue(prop);
                } else
                {
                    /**
                     * Se o elemento não estiver relatando seus valores
                     * corretamente no Safari, alguns elementos `display: none`
                     * estão envolvidos.
                     */

                    /**
                     * Localize todos os elementos `display: none` pai.
                     */
                    for (var a = elem; a && color(a); a = a.parentNode)
                    {
                        stack.unshift(a);
                    }

                    /**
                     * Percorra e torne-os visíveis, mas ao contrário (seria
                     * melhor se soubéssemos o tipo exato de exibição que eles
                     * possuem).
                     */
                    for (a = 0; a < stack.length; a++)
                    {
                        if (color(stack[a]))
                        {
                            swap[a] = stack[a].style.display;
                            stack[a].style.display = "block";
                        }
                    }

                    /**
                     * Como invertemos o estilo de exibição, temos que
                     * lidar com esse estilo especial, caso contrário,
                     * obteremos o valor.
                     */
                    ret = prop == "display" && swap[stack.length - 1] != null ? "none" : document.defaultView.getComputedStyle(elem, null).getPropertyValue(prop) || "";

                    /**
                     * Finalmente, reverta os estilos de exibição.
                     */
                    for (a = 0; a < swap.length; a++)
                    {
                        if (swap[a] != null)
                        {
                            stack[a].style.display = swap[a];
                        }
                    }
                }

                if (prop == "opacity" && ret == "")
                {
                    ret = "1";
                }
            } else if (elem.currentStyle)
            {
                var newProp = prop.replace(/\-(\w)/g, function(m, c)
                {
                    return c.toUpperCase();
                });

                ret = elem.currentStyle[prop] || elem.currentStyle[newProp];

                /**
                 * Do incrível hack.
                 * http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291.
                 */

                /**
                 * Se não estivermos lidando com um número de pixels
                 * normal, mas com um número que tem um final estranho,
                 * precisamos convertê-lo em pixels.
                 */
                if (!/^\d+(px)?$/i.test(ret) && /^\d/.test(ret))
                {
                    var style = elem.style.left;
                    var runtimeStyle = elem.runtimeStyle.left;

                    elem.runtimeStyle.left = elem.currentStyle.left;
                    elem.style.left = ret || 0;

                    ret = elem.style.pixelLeft + "px";
                    elem.style.left = style;
                    elem.runtimeStyle.left = runtimeStyle;
                }
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
                     * Corrija tags de estilo "XHTML" em todos
                     * os navegadores.
                     */
                    arg = arg.replace(/(<(\w+)[^>]*?)\/>/g, function(m, all, tag)
                    {
                        return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area)$/i)? m : all+"></"+tag+">";
                    });

                    /**
                     * Remover os espaços em branco, caso contrário, indexOf
                     * não funcionará conforme o esperado.
                     */
                    var s = jQuery.trim(arg).toLowerCase(),
                        div = doc.createElement("div"),
                        tb = [];

                    var wrap =
                        /**
                         * option ou optgroup.
                         */
                        !s.indexOf("<opt") &&
                        [1, "<select>", "</select>"] ||

                        !s.indexOf("<leg") &&
                        [1, "<fieldset>", "</fieldset>"] ||

                        s.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
                        [1, "<table>", "</table>"] ||

                        !s.indexOf("<tr") &&
                        [2, "<table><tbody>", "</tbody></table>"] ||

                        /**
                         * <thead> correspondido acima.
                         */
                        (!s.indexOf("<td") || !s.indexOf("<th")) &&
                        [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||

                        !s.indexOf("<col") &&
                        [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"] ||

                        /**
                         * O IE não pode serializar as tags <link> e <script>
                         * normalmente.
                         */
                        jQuery.browser.msie &&
                        [1, "div<div>", "</div>"] ||

                        [0,"",""];

                    /**
                     * Vá para html e volte, depois retire os wrappers extras.
                     */
                    div.innerHTML = wrap[1] + arg + wrap[2];

                    /**
                     * Mova-se para a profundidade certa.
                     */
                    while (wrap[0]--)
                    {
                        div = div.lastChild;
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
                             * String era um <thead> ou <tfoot> vazio.
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

                        /**
                         * O IE elimina completamente os espaços em branco
                         * iniciais quando innerHTML é usado.
                         */
                        if (/^\s/.test(arg))
                        {
                            div.insertBefore( doc.createTextNode( arg.match(/^\s*/)[0] ), div.firstChild );
                        }
                    }

                    arg = jQuery.makeArray(div.childNodes);
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
             * O Safari informa incorretamente a propriedade selecionada
             * padrão de uma opção oculta. Acessar a propriedade selectedIndex
             * do pai corrige o erro.
             */
            if (name == "selected" && jQuery.browser.safari)
            {
                elem.parentNode.selectedIndex;
            }

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
            } else if (jQuery.browser.msie && name == "style")
            {
                return jQuery.attr(elem.style, "cssText", value);
            } else if (value == undefined && jQuery.browser.msie && jQuery.nodeName(elem, "form") && (name == "action" || name == "method"))
            {
                return elem.getAttributeNode(name).nodeValue;
            } else if (elem.tagName)
            {
                /**
                 * IE elem.getAttribute passa até para estilo.
                 */
                if (value != undefined)
                {
                    if (name == "type" && jQuery.nodeName(elem, "input") && elem.parentNode)
                    {
                        throw "type property can't be changed";
                    }

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
                /**
                 * Na verdade, o IE usa filtros para opacidade.
                 */
                if (name == "opacity" && jQuery.browser.msie)
                {
                    if (value != undefined)
                    {
                        /**
                         * O IE tem falhas com opacidade se não tiver
                         * layout. Force-o definindo o nível de zoom.
                         */
                        elem.zoom = 1; 

                        /**
                         * Defina o filtro alfa para definir a opacidade.
                         */
                        elem.filter = (elem.filter || "").replace(/alpha\([^)]*\)/,"") + (parseFloat(value).toString() == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
                    }

                    /**
                     *
                     */
                    return elem.filter ? (parseFloat( elem.filter.match(/opacity=([^)]*)/)[1] ) / 100).toString() : "";
                }

                /**
                 *
                 */
                name = name.replace(/-([a-z])/ig, function(z, b)
                {
                    return b.toUpperCase();
                });

                /**
                 *
                 */
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
            return (t || "").replace(/^\s+|\s+$/g, "");
        },

        /**
         *
         */
        makeArray: function(a)
        {
            var r = [];

            /**
             * É necessário usar typeof para combater travamentos de
             * childNodes do Safari.
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

            /**
             * Além disso, precisamos ter certeza de que os elementos
             * corretos estão sendo retornados (o IE retorna nós de
             * comentários em uma consulta '*').
             */
            if (jQuery.browser.msie)
            {
                for (var i = 0; second[i]; i++)
                {
                    if (second[i].nodeType != 8)
                    {
                        first.push(second[i]);
                    }
                }
            } else
            {
                for (var i = 0; second[i]; i++)
                {
                    first.push(second[i]);
                }
            }

            return first;
        },

        /**
         *
         */
        unique: function(first)
        {
            var r = [],
                done = {};

            try
            {
                for (var i = 0, fl = first.length; i < fl; i++)
                {
                    var id = jQuery.data(first[i]);

                    if (!done[id])
                    {
                        done[id] = true;
                        r.push(first[i]);
                    }
                }
            } catch(e)
            {
                r = first;
            }

            return r;
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
                fn = eval("false||function(a,i){return " + fn + "}");
            }

            var result = [];

            /**
             * Percorra o array, salvando apenas os itens que passam
             * na função validadora.
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
                fn = eval("false||function(a){return " + fn + "}");
            }

            var result = [];

            /**
             * Percorra o vetor, traduzindo cada um dos itens para
             * seu novo valor (ou valores).
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
     *
     */
    var userAgent = navigator.userAgent.toLowerCase();

    /**
     * Descubra qual navegador está sendo usado.
     */
    jQuery.browser = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
    };

    /**
     *
     */
    var styleFloat = jQuery.browser.msie ? "styleFloat" : "cssFloat";

    /**
     *
     */
    jQuery.extend({
        /**
         * Verifique se o modelo de caixa W3C está sendo usado.
         */
        boxModel: !jQuery.browser.msie || document.compatMode == "CSS1Compat",

        /**
         *
         */
        styleFloat: jQuery.browser.msie ? "styleFloat" : "cssFloat",

        /**
         *
         */
        props: {
            "for": "htmlFor",
            "class": "className",
            "float": styleFloat,

            cssFloat: styleFloat,
            styleFloat: styleFloat,
            innerHTML: "innerHTML",
            className: "className",
            value: "value",
            disabled: "disabled",
            checked: "checked",
            readonly: "readOnly",
            selected: "selected",
            maxlength: "maxLength"
        }
    });

    /**
     *
     */
    jQuery.each({
        parent: "a.parentNode",
        parents: "jQuery.dir(a,'parentNode')",
        next: "jQuery.nth(a,2,'nextSibling')",
        prev: "jQuery.nth(a,2,'previousSibling')",
        nextAll: "jQuery.dir(a,'nextSibling')",
        prevAll: "jQuery.dir(a,'previousSibling')",
        siblings: "jQuery.sibling(a.parentNode.firstChild,a)",
        children: "jQuery.sibling(a.firstChild)",
        contents: "jQuery.nodeName(a,'iframe')?a.contentDocument||a.contentWindow.document:jQuery.makeArray(a.childNodes)"
    }, function(i, n)
    {
        jQuery.fn[i] = function(a)
        {
            var ret = jQuery.map(this, n);

            if (a && typeof a == "string")
            {
                ret = jQuery.multiFilter(a, ret);
            }

            return this.pushStack(
                jQuery.unique(ret)
            );
        };
    });

    /**
     *
     */
    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
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
                jQuery.removeData(this);
                this.parentNode.removeChild(this);
            }
        },

        /**
         *
         */
        empty: function()
        {
            /**
             * Limpe o cache.
             */
            jQuery("*", this).each(function()
            {
                jQuery.removeData(this);
            });

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
    jQuery.each(["Height", "Width"], function(i, name)
    {
        var n = name.toLowerCase();

        jQuery.fn[n] = function(h)
        {
            return this[0] == window ?
                jQuery.browser.safari && self["inner" + name] ||
                jQuery.boxModel && Math.max(document.documentElement["client" + name], document.body["client" + name]) || document.body["client" + name] :
                this[0] == document ? Math.max(document.body["scroll" + name], document.body["offset" + name]) : h == undefined ? (this.length ? jQuery.css(this[0], n) : null) : this.css(n, h.constructor == String ? h : h + "px");
        };
    });

    /**
     *
     */
    var chars = jQuery.browser.safari && parseInt(jQuery.browser.version) < 417 ? "(?:[\\w*_-]|\\\\.)" : "(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",
        quickChild = new RegExp("^>\\s*(" + chars + "+)"),
        quickID = new RegExp("^(" + chars + "+)(#)(" + chars + "+)"),
        quickClass = new RegExp("^([#.]?)(" + chars + "*)");

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
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
                 * Atributos de formulário.
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
                input: "/input|select|textarea|button/i.test(a.nodeName)",

                /**
                 * :has().
                 */
                has: "jQuery.find(m[3],a).length",

                /**
                 * :header.
                 */
                header: "/h\\d/i.test(a.nodeName)",

                /**
                 * :animated.
                 */
                animated: "jQuery.grep(jQuery.timers,function(fn){return a==fn.elem;}).length"
            }
        },

        /**
         * As expressões regulares que alimentam o mecanismo
         * de análise.
         */
        parse: [
            /**
             * Corresponder: [@value='test'], [@foo].
             */
            /^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,

            /**
             * Corresponder: :contains('foo').
             */
            /^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,

            /**
             * Corresponder: :even, :last-chlid, #id, .class.
             */
            new RegExp("^([:.#]*)(" + chars + "+)")
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

                expr = f.t.replace(/^\s*,\s*/, "");
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
             * Inicialize a pesquisa.
             */
            var ret = [context],
                done = [],
                last;

            /**
             * Continue enquanto existir uma expressão seletora e
             * enquanto não estivermos mais repetindo sobre nós
             * mesmos.
             */
            while (t && last != t)
            {
                var r = [];

                last = t;
                t = jQuery.trim(t);

                var foundToken = false;

                /**
                 * Uma tentativa de acelerar seletores filhos que apontam
                 * para uma tag de elemento específica.
                 */
                var re = quickChild;
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
                            if (c.nodeType == 1 && (nodeName == "*" || c.nodeName.toUpperCase() == nodeName.toUpperCase()))
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
                    re = /^([>+~])\s*(\w*)/i;

                    if ((m = re.exec(t)) != null)
                    {
                        r = [];

                        var nodeName = m[2],
                            merge = {};

                        m = m[1];
                        for (var j = 0, rl = ret.length; j < rl; j++)
                        {
                            var n = m == "~" || m == "+" ? ret[j].nextSibling : ret[j].firstChild;
                            for (; n; n = n.nextSibling)
                            {
                                if (n.nodeType == 1)
                                {
                                    var id = jQuery.data(n);

                                    if (m == "~" && merge[id])
                                    {
                                        break;
                                    }

                                    if (!nodeName || n.nodeName.toUpperCase() == nodeName.toUpperCase())
                                    {
                                        if (m == "~")
                                        {
                                            merge[id] = true;
                                        }

                                        r.push(n);
                                    }

                                    if (m == "+")
                                    {
                                        break;
                                    }
                                }
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
                        t = " " + t.substr(1, t.length);
                    } else
                    {
                        /**
                         * Otimize para o caso nodeName#idName.
                         */
                        var re2 = quickID;
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
                            re2 = quickClass;
                            m = re2.exec(t);
                        }

                        m[2] = m[2].replace(/\\/g, "");

                        var elem = ret[
                            ret.length - 1
                        ];

                        /**
                         * Tente fazer uma busca global por ID, sempre
                         * que possível.
                         */
                        if (m[1] == "#" && elem && elem.getElementById && !jQuery.isXMLDoc(elem))
                        {
                            /**
                             * Otimização para caso de documento HTML.
                             */
                            var oid = elem.getElementById(m[2]);

                            /**
                             * Faça uma verificação rápida para a existência do
                             * atributo ID real para evitar a seleção pelo
                             * atributo name no IE e verifique também para
                             * garantir que id seja uma string para evitar a
                             * seleção de um elemento com o nome 'id' dentro de
                             * um formulário.
                             */
                            if ((jQuery.browser.msie || jQuery.browser.opera) && oid && typeof oid.id == "string" && oid.id != m[2])
                            {
                                oid = jQuery('[@id="' + m[2] + '"]', elem)[0];
                            }

                            /**
                             * Faça uma verificação rápida do nome do
                             * nó (quando aplicável) para que as pesquisas
                             * div#foo sejam realmente rápidas.
                             */
                            ret = r = oid && (!m[3] || jQuery.nodeName(oid, m[3])) ? [oid] : [];
                        } else
                        {
                            /**
                             * Precisamos encontrar todos os elementos descendentes.
                             */
                            for (var i = 0; ret[i]; i++)
                            {
                                /**
                                 * Pegue o nome da tag que está sendo pesquisada.
                                 */
                                var tag = m[1] == "#" && m[3] ? m[3] : m[1] != "" || m[0] == "" ? "*" : m[2];

                                /**
                                 * Lide com o IE7 sem compatibilidade sobre <object>s.
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
             * Ocorreu um erro com o seletor; apenas retorne
             * um conjunto vazio.
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
            while (t && t != last)
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
                 * :not() é um caso especial que pode ser otimizado mantendo-o
                 * fora da lista de expressões.
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
                } else if (m[1] == "[")
                {
                    var tmp = [], type = m[3];

                    for (var i = 0, rl = r.length; i < rl; i++)
                    {
                        var a = r[i],
                            z = a[jQuery.props[m[2]] || m[2]];

                        if (z == null || /href|src|selected/.test(m[2]))
                        {
                            z = jQuery.attr(a,m[2]) || '';
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
                    var merge = {}, tmp = [],
                        test = /(\d*)n\+?(\d*)/.exec(m[3] == "even" && "2n" || m[3] == "odd" && "2n+1" || !/\D/.test(m[3]) && "n+" + m[3] || m[3]),
                        first = (test[1] || 1) - 0, last = test[2] - 0;

                    for (var i = 0, rl = r.length; i < rl; i++)
                    {
                        var node = r[i], parentNode = node.parentNode, id = jQuery.data(parentNode);

                        if (!merge[id])
                        {
                            var c = 1;
                            for (var n = parentNode.firstChild; n; n = n.nextSibling)
                            {
                                if (n.nodeType == 1)
                                {
                                    n.nodeIndex = c++;
                                }
                            }

                            merge[id] = true;
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
                    f = eval("false||function(a,i){return " + f + "}");

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
        dir: function(elem, dir)
        {
            var matched = [];
            var cur = elem[dir];

            while (cur && cur != document)
            {
                if (cur.nodeType == 1)
                {
                    matched.push(cur);
                }

                cur = cur[dir];
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
             * Por alguma razão, o IE tem problemas para passar o objeto
             * da janela, fazendo com que ele seja clonado no processo.
             */
            if (jQuery.browser.msie && element.setInterval != undefined)
            {
                element = window;
            }

            /**
             * Certifique-se de que a função que está sendo executada
             * tenha um ID exclusivo.
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
                     * Passe argumentos e contexto para o manipulador original.
                     */
                    return fn.apply(this, arguments); 
                };

                /**
                 * Armazene dados em um manipulador exclusivo.
                 */
                handler.data = data;

                /**
                 * Defina o guia do manipulador exclusivo como o mesmo do
                 * manipulador original, para que possa ser removido.
                 */
                handler.guid = fn.guid;
            }

            /**
             * Manipuladores de eventos com namespace.
             */
            var parts = type.split(".");

            /**
             *
             */
            type = parts[0];
            handler.type = parts[1];

            /**
             * Inicie a estrutura de eventos do elemento.
             */
            var events = jQuery.data(element, "events") || jQuery.data(element, "events", {});

            /**
             *
             */
            var handle = jQuery.data(element, "handle", function()
            {
                /**
                 * Retornou undefined ou false.
                 */
                var val;

                /**
                 * Lida com o segundo evento de um gatilho e quando um
                 * evento é chamado após o descarregamento de uma página.
                 */
                if (typeof jQuery == "undefined" || jQuery.event.triggered)
                {
                    return val;
                }

                val = jQuery.event.handle.apply(element, arguments);

                return val;
            });

            /**
             * Obtenha a lista atual de funções vinculadas a este evento.
             */
            var handlers = events[type];

            /**
             * Inicie a fila do manipulador de eventos.
             */
            if (!handlers)
            {
                handlers = events[type] = {};

                /**
                 * E vincule o manipulador de eventos global ao elemento.
                 */
                if (element.addEventListener)
                {
                    element.addEventListener(type, handle, false);
                } else
                {
                    element.attachEvent("on" + type, handle);
                }
            }

            /**
             * Adicione a função à lista de manipuladores do elemento.
             */
            handlers[handler.guid] = handler;

            /**
             * Acompanhe quais eventos foram usados, para acionamento global.
             */
            this.global[type] = true;
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
            var events = jQuery.data(element, "events"),
                ret,
                index;

            /**
             * Manipuladores de eventos com namespace.
             */
            if (typeof type == "string")
            {
                var parts = type.split(".");
                type = parts[0];
            }

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

                        for (handler in events[type])
                        {
                            /**
                             * Lidar com a remoção de eventos com namespace.
                             */
                            if (!parts[1] || events[type][handler].type == parts[1])
                            {
                                delete events[type][handler];
                            }
                        }
                    }

                    /**
                     * Remova o manipulador de eventos genérico se não
                     * existirem mais manipuladores.
                     */
                    for (ret in events[type])
                    {
                        break;
                    }

                    if (!ret)
                    {
                        if (element.removeEventListener)
                        {
                            element.removeEventListener(type, jQuery.data(element, "handle"), false);
                        } else
                        {
                            element.detachEvent("on" + type, jQuery.data(element, "handle"));
                        }

                        ret = null;
                        delete events[type];
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
                    jQuery.removeData(element, "events");
                    jQuery.removeData(element, "handle");
                }
            }
        },

        /**
         *
         */
        trigger: function(type, data, element, donative, extra)
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
                /**
                 * Acione apenas se alguma vez vincularmos um
                 * evento a ele.
                 */
                if (this.global[type])
                {
                    jQuery("*").add([window, document]).trigger(type, data);
                }

                /**
                 * Lidar com o acionamento de um único elemento.
                 */
            } else
            {
                var val, ret, fn = jQuery.isFunction(element[type] || null),
                    /**
                     * Verifique se precisamos fornecer um evento falso ou não.
                     */
                    evt = !data[0] || !data[0].preventDefault;

                /**
                 * Passe adiante um evento falso.
                 */
                if (evt)
                {
                    data.unshift(
                        this.fix({
                            type: type,
                            target: element
                        })
                    );
                }

                /**
                 * Acione o evento.
                 */
                if (jQuery.isFunction(jQuery.data(element, "handle")))
                {
                    val = jQuery.data(element, "handle").apply(element, data);
                }

                /**
                 * Lidar com o acionamento de manipuladores .onfoo nativos.
                 */
                if (!fn && element["on" + type] && element["on" + type].apply(element, data) === false)
                {
                    val = false;
                }

                /**
                 * Funções extras não podem ser obtidas do objeto de evento
                 * personalizado.
                 */
                if (evt)
                {
                    data.shift();
                }

                /**
                 * Lidar com o acionamento de funções extras.
                 */
                if (extra && extra.apply(element, data) === false)
                {
                    val = false;
                }

                /**
                 * Acione os eventos nativos (exceto cliques em links).
                 */
                if (fn && donative !== false && val !== false && !(jQuery.nodeName(element, 'a') && type == "click"))
                {
                    this.triggered = true;
                    element[ type ]();
                }

                this.triggered = false;
            }

            return val;
        },

        /**
         *
         */
        handle: function(event)
        {
            /**
             * Retornou indefinido ou falso.
             */
            var val;

            /**
             * O objeto vazio é para eventos acionados sem dados.
             */
            event = jQuery.event.fix(event || window.event || {});

            /**
             * Manipuladores de eventos com namespace.
             */
            var parts = event.type.split(".");
                event.type = parts[0];

            var c = jQuery.data(this, "events") && jQuery.data(this, "events")[event.type], args = Array.prototype.slice.call(arguments, 1);
                args.unshift( event );

            for (var j in c)
            {
                /**
                 * Passe uma referência à própria função do manipulador.
                 * Para que possamos removê-lo posteriormente.
                 */
                args[0].handler = c[j];
                args[0].data = c[j].data;

                /**
                 * Filtre as funções por classe.
                 */
                if (!parts[1] || c[j].type == parts[1])
                {
                    var tmp = c[j].apply(this, args);

                    if (val !== false)
                    {
                        val = tmp;
                    }

                    if (tmp === false)
                    {
                        event.preventDefault();
                        event.stopPropagation();
                    }
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
             * Armazene uma cópia do objeto de evento original e
             * clone para definir propriedades somente leitura.
             */
            var originalEvent = event;
            event = jQuery.extend({}, originalEvent);

            /**
             * Adicione preventDefault e stopPropagation, pois eles
             * não funcionarão no clone.
             */
            event.preventDefault = function()
            {
                /**
                 * Se preventDefault existir, execute-o no evento
                 * original.
                 */
                if (originalEvent.preventDefault)
                {
                    originalEvent.preventDefault();
                }

                /**
                 * Caso contrário, defina a propriedade returnValue
                 * do evento original como false (IE).
                 */
                originalEvent.returnValue = false;
            };

            /**
             *
             */
            event.stopPropagation = function()
            {
                /**
                 * Se stopPropagation existir, execute-o no evento
                 * original.
                 */
                if (originalEvent.stopPropagation)
                {
                    originalEvent.stopPropagation();
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

                event.pageX = event.clientX + (e && e.scrollLeft || b.scrollLeft || 0);
                event.pageY = event.clientY + (e && e.scrollTop || b.scrollTop || 0);
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
             * Observação: o botão não está normalizado, portanto não o utilize.
             */
            if (!event.which && event.button)
            {
                event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0 )));
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
        trigger: function(type, data, fn)
        {
            return this.each(function()
            {
                jQuery.event.trigger(type, data, this, true, fn);
            });
        },

        /**
         *
         */
        triggerHandler: function(type, data, fn)
        {
            if (this[0])
            {
                return jQuery.event.trigger(type, data, this[0], false, fn);
            }
        },

        /**
         *
         */
        toggle: function()
        {
            /**
             * Salve a referência aos argumentos para acesso no
             * encerramento.
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
                return a[this.lastToggle].apply( this, [e] ) || false;
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
                 * Verifique se mouse(over|out) ainda está dentro do
                 * mesmo elemento pai.
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
             * Anexe os ouvintes.
             */
            bindReady();

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
                 * Remova o ouvinte de eventos para evitar vazamento
                 * de memória.
                 */
                if (jQuery.browser.mozilla || jQuery.browser.opera)
                {
                    document.removeEventListener( "DOMContentLoaded", jQuery.ready, false );
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
     *
     */
    var readyBound = false;

    /**
     *
     */
    function bindReady()
    {
        if (readyBound)
        {
            return;
        }

        readyBound = true;

        /**
         * Se o Mozilla for usado.
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

                    jQuery.ready();
                };
            }

            /**
             * Limpe da memória.
             */
            script = null;

            /**
             * Se o Safari for usado.
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
                    jQuery.safariTimer = null;

                    /**
                     * E execute quaisquer funções de espera.
                     */
                    jQuery.ready();
                }
            }, 10); 
        }

        /**
         * Um substituto para window.onload, que sempre
         * funcionará.
         */
        jQuery.event.add(window, "load", jQuery.ready);
    }

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        load: function(url, params, callback)
        {
            if (jQuery.isFunction(url))
            {
                return this.bind("load", url);
            }

            var off = url.indexOf(" ");
            if (off >= 0)
            {
                var selector = url.slice(off, url.length);

                url = url.slice(0, off);
            }

            /**
             *
             */
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

            /**
             *
             */
            var self = this;

            /**
             * Solicite o documento remoto.
             */
            jQuery.ajax({
                url: url,
                type: type,
                data: params,

                /**
                 *
                 */
                complete: function(res, status)
                {
                    /**
                     * Se for bem-sucedido, injete o HTML em todos os
                     * elementos correspondentes.
                     */
                    if (status == "success" || status == "notmodified")
                    {
                        /**
                         * Veja se um seletor foi especificado.
                         */
                        self.html( selector ?
                            /**
                             * Crie um div fictício para armazenar os resultados.
                             */
                            jQuery("<div/>")
                                /**
                                 * Injete o conteúdo do documento, removendo os
                                 * scripts para evitar erros de 'Permissão
                                 * negada' no IE.
                                 */
                                .append(res.responseText.replace(/<script(.|\s)*?\/script>/g, ""))

                                /**
                                 * Localize os elementos especificados.
                                 */
                                .find(selector) :

                            /**
                             * Caso contrário, basta injetar o resultado
                             * completo.
                             */
                            res.responseText
                        );
                    }

                    /**
                     * Adicione atraso para compensar o atraso do Safari
                     * no globalEval.
                     */
                    setTimeout(function()
                    {
                        self.each(callback, [res.responseText, status, res]);
                    }, 13);
                }
            });

            return this;
        },

        /**
         *
         */
        serialize: function()
        {
            return jQuery.param(this.serializeArray());
        },

        /**
         *
         */
        serializeArray: function()
        {
            return this.map(function()
            {
                return jQuery.nodeName(this, "form") ? jQuery.makeArray(this.elements) : this;
            })
            .filter(function()
            {
                return this.name && !this.disabled &&  (this.checked || /select|textarea/i.test(this.nodeName) || /text|hidden|password/i.test(this.type));
            })
            .map(function(i, elem)
            {
                var val = jQuery(this).val();

                return val == null ? null : val.constructor == Array ?
                    jQuery.map(val, function(i, val)
                    {
                        return {
                            name: elem.name,
                            value: val
                        };
                    }) : {
                        name: elem.name,
                        value: val
                    };
            }).get();
        }
    });

    /**
     * Anexe um monte de funções para lidar com eventos
     * AJAX comuns.
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
    var jsc = (new Date).getTime();

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        get: function(url, data, callback, type)
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
                dataType: type
            });
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
         * Cache de título modificado pela última vez para a
         * próxima solicitação.
         */
        lastModified: {},

        /**
         *
         */
        ajax: function(s)
        {
            var jsonp, jsre = /=(\?|%3F)/g, status, data;

            /**
             * Estenda as configurações, mas estenda novamente os 's'
             * para que possam ser verificados novamente mais tarde (no
             * conjunto de testes, especificamente).
             */
            s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));

            /**
             * Converter dados se ainda não for uma string.
             */
            if (s.data && s.processData && typeof s.data != "string")
            {
                s.data = jQuery.param(s.data);
            }

            /**
             * Divida os dados em uma única string.
             */
            var q = s.url.indexOf("?");
            if (q > -1)
            {
                s.data = (s.data ? s.data + "&" : "") + s.url.slice(q + 1);
                s.url = s.url.slice(0, q);
            }

            /**
             * Lidar com Callbacks de parâmetro JSONP.
             */
            if (s.dataType == "jsonp")
            {
                if (!s.data || !s.data.match(jsre))
                {
                    s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
                }

                s.dataType = "json";
            }

            /**
             * Crie uma função JSONP temporária.
             */
            if (s.dataType == "json" && s.data && s.data.match(jsre))
            {
                jsonp = "jsonp" + jsc++;
                s.data = s.data.replace(jsre, "=" + jsonp);

                /**
                 * Precisamos ter certeza de que uma resposta no estilo
                 * JSONP seja executada corretamente.
                 */
                s.dataType = "script";

                /**
                 * Lidar com o carregamento no estilo JSONP.
                 */
                window[jsonp] = function(tmp)
                {
                    data = tmp;
                    success();

                    /**
                     * Coleta de lixo.
                     */
                    window[jsonp] = undefined;

                    try
                    {
                        delete window[jsonp];
                    } catch(e)
                    {
                    }
                };
            }

            if (s.dataType == "script" && s.cache == null)
            {
                s.cache = false;
            }

            if (s.cache === false && s.type.toLowerCase() == "get")
            {
                s.data = (s.data ? s.data + "&" : "") + "_=" + (new Date()).getTime();
            }

            /**
             * Se os dados estiverem disponíveis, anexe os dados
             * ao URL para obter solicitações.
             */
            if (s.data && s.type.toLowerCase() == "get")
            {
                s.url += "?" + s.data;

                /**
                 * O IE gosta de enviar dados obtidos e postados,
                 * evite isso.
                 */
                s.data = null;
            }

            /**
             * Fique atento a um novo conjunto de solicitações.
             */
            if (s.global && ! jQuery.active++)
            {
                jQuery.event.trigger("ajaxStart");
            }

            /**
             * Se estivermos solicitando um documento remoto e tentando
             * carregar JSON ou Script.
             */
            if (!s.url.indexOf("http") && s.dataType == "script")
            {
                var head = document.getElementsByTagName("head")[0];
                var script = document.createElement("script");
                    script.src = s.url;

                /**
                 * Lidar com o carregamento do script.
                 */
                if (!jsonp && (s.success || s.complete))
                {
                    var done = false;

                    /**
                     * Anexe manipuladores para todos os navegadores.
                     */
                    script.onload = script.onreadystatechange = function()
                    {
                        if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete"))
                        {
                            done = true;
                            success();
                            complete();
                            head.removeChild(script);
                        }
                    };
                }

                /**
                 *
                 */
                head.appendChild(script);

                /**
                 * Lidamos com tudo usando a injeção de elemento de script.
                 */
                return;
            }

            var requestDone = false;

            /**
             * Crie o objeto de solicitação; A Microsoft não conseguiu
             * implementar corretamente o XMLHttpRequest no IE7, por isso
             * usamos o ActiveXObject quando ele está disponível.
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
             * Defina o título para que o script chamado saiba que
             * é um XMLHttpRequest.
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
                if (!requestDone && xml && (xml.readyState == 4 || isTimeout == "timeout"))
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
                    status = isTimeout == "timeout" && "timeout" || !jQuery.httpSuccess(xml) && "error" || s.ifModified && jQuery.httpNotModified( xml, s.url ) && "notmodified" || "success";

                    /**
                     *
                     */
                    if (status == "success")
                    {
                        /**
                         * Procure e detecte erros de análise de documentos XML.
                         */
                        try
                        {
                            /**
                             * Processar os dados (executa o xml por meio de
                             * httpData independentemente do callback).
                             */
                            data = jQuery.httpData(xml, s.dataType);
                        } catch(e)
                        {
                            status = "parsererror";
                        }
                    }

                    /**
                     * Certifique-se de que a solicitação foi bem-sucedida
                     * ou não foi modificada.
                     */
                    if (status == "success")
                    {
                        /**
                         * Título Last-Modified em cache, se estiver no
                         * modo ifModified.
                         */
                        var modRes;

                        /**
                         * Exceção de obter lançada por FF se o título não
                         * estiver disponível.
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
                         * JSONP lida com seu próprio callback de sucesso.
                         */
                        if (!jsonp)
                        {
                            success();
                        }
                    } else
                    {
                        jQuery.handleError(s, xml, status);
                    }

                    /**
                     * Envia os manipuladores completos.
                     */
                    complete();

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
             *
             */
            if (s.async)
            {
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
             * Retorne XMLHttpRequest para permitir o aborto da
             * solicitação, etc.
             */
            return xml;

            /**
             *
             */
            function success()
            {
                /**
                 * Se um callback local foi especificado, acione-o e
                 * transmita os dados.
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
            }

            /**
             *
             */
            function complete()
            {
                /**
                 * Resultado do processo.
                 */
                if (s.complete)
                {
                    s.complete(xml, status);
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
                if (s.global && !--jQuery.active)
                {
                    jQuery.event.trigger("ajaxStop");
                }
            }
        },

        /**
         *
         */
        handleError: function(s, xml, status, e)
        {
            /**
             * Se um callback local foi especificado,
             * envie-o.
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
         *
         */
        httpData: function(r, type)
        {
            var ct = r.getResponseHeader("content-type");
            var xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0;
            var data = xml ? r.responseXML : r.responseText;

            if (xml && data.documentElement.tagName == "parsererror")
            {
                throw "parsererror";
            }

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

            return data;
        },

        /**
         * Serialize um vetor de elementos de formulário ou um conjunto
         * de chaves/valores em uma string de consulta.
         */
        param: function(a)
        {
            var s = [];

            /**
             * Se um array foi passado, suponha que seja um array
             * de elementos de formulário.
             */
            if ( a.constructor == Array || a.jquery )
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
                 * Caso contrário, suponha que seja um objeto de pares
                 * chave/valor.
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
            return s.join("&").replace(/%20/g, "+");
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

                    if (jQuery.css(this,"display") == "none")
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
            var opt = jQuery.speed(speed, easing, callback);

            return this[opt.queue === false ? "each" : "queue"](function()
            {
                opt = jQuery.extend({}, opt);
                var hidden = jQuery(this).is(":hidden"), self = this;

                for (var p in prop)
                {
                    if (prop[p] == "hide" && hidden || prop[p] == "show" && !hidden)
                    {
                        return jQuery.isFunction(opt.complete) && opt.complete.apply(this);
                    }

                    if (p == "height" || p == "width")
                    {
                        /**
                         * Armazene a propriedade de exibição.
                         */
                        opt.display = jQuery.css(this, "display");

                        /**
                         * Certifique-se de que nada escape.
                         */
                        opt.overflow = this.style.overflow;
                    }
                }

                if (opt.overflow != null)
                {
                    this.style.overflow = "hidden";
                }

                opt.curAnim = jQuery.extend({}, prop);
                jQuery.each( prop, function(name, val)
                {
                    var e = new jQuery.fx(self, opt, name);

                    if (/toggle|show|hide/.test(val))
                    {
                        e[
                            val == "toggle" ? hidden ? "show" : "hide" : val
                        ](prop);
                    } else
                    {
                        var parts = val.toString().match(/^([+-]?)([\d.]+)(.*)$/),
                            start = e.cur(true) || 0;

                        if (parts)
                        {
                            end = parseFloat(parts[2]),
                            unit = parts[3] || "px";

                            /**
                             * Precisamos calcular o valor inicial.
                             */
                            if (unit != "px")
                            {
                                self.style[name] = end + unit;
                                start = (end / e.cur(true)) * start;
                                self.style[name] = start + unit;
                            }

                            /**
                             * Se um token +/- foi fornecido, estamos fazendo
                             * uma animação relativa.
                             */
                            if (parts[1])
                            {
                                end = ((parts[1] == "-" ? -1 : 1) * end) + start;
                            }

                            e.custom(start, end, unit);
                        } else
                        {
                            e.custom(start, val, "");
                        }
                    }
                });

                /**
                 * Para conformidade estrita de JS.
                 */
                return true;
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

            if (!arguments.length)
            {
                return queue(this[0], type);
            }

            return this.each(function()
            {
                if (fn.constructor == Array)
                {
                    queue(this, type, fn);
                } else
                {
                    queue(this, type).push(fn);

                    if (queue(this, type).length == 1)
                    {
                        fn.apply(this);
                    }
                }
            });
        },

        /**
         *
         */
        stop: function()
        {
            var timers = jQuery.timers;

            return this.each(function()
            {
                for (var i = 0; i < timers.length; i++)
                {
                    if (timers[i].elem == this)
                    {
                        timers.splice(i--, 1);
                    }
                }
            }).dequeue();
        }
    });

    /**
     *
     */
    var queue = function(elem, type, array)
    {
        if (!elem)
        {
            return;
        }

        var q = jQuery.data(elem, type + "queue");

        if (!q || array)
        {
            q = jQuery.data(elem, type + "queue", array ? jQuery.makeArray(array) : []);
        }

        return q;
    };

    /**
     *
     */
    jQuery.fn.dequeue = function(type)
    {
        type = type || "fx";

        return this.each(function()
        {
            var q = queue(this, type);

            q.shift();
            if (q.length)
            {
                q[0].apply(this);
            }
        });
    };

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
                jQuery(this).dequeue();
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
        timers: [],

        /**
         *
         */
        fx: function(elem, options, prop)
        {
            this.options = options;
            this.elem = elem;
            this.prop = prop;

            if (!options.orig)
            {
                options.orig = {};
            }
        }
    });

    /**
     *
     */
    jQuery.fx.prototype = {
        /**
         * Função simples para definir um valor de estilo.
         */
        update: function()
        {
            if (this.options.step)
            {
                this.options.step.apply(this.elem, [this.now, this]);
            }

            (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);

            /**
             * Defina a propriedade de exibição para bloquear
             * animações de altura/largura.
             */
            if (this.prop == "height" || this.prop == "width")
            {
                this.elem.style.display = "block";
            }
        },

        /**
         * Obtenha o tamanho atual.
         */
        cur: function(force)
        {
            if (this.elem[this.prop] != null && this.elem.style[this.prop] == null)
            {
                return this.elem[this.prop];
            }

            /**
             *
             */
            var r = parseFloat(jQuery.curCSS(this.elem, this.prop, force));

            /**
             *
             */
            return r && r > -10000 ? r : parseFloat(jQuery.css(this.elem, this.prop)) || 0;
        },

        /**
         * Inicie uma animação de um número para outro.
         */
        custom: function(from, to, unit)
        {
            this.startTime = (new Date()).getTime();
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;
            this.update();

            var self = this;
            function t()
            {
                return self.step();
            }

            t.elem = this.elem;
            jQuery.timers.push(t);

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
        },

        /**
         * Função 'show' simples.
         */
        show: function()
        {
            /**
             * Lembre-se de onde começamos, para que possamos
             * voltar mais tarde.
             */
            this.options.orig[this.prop] = jQuery.attr(this.elem.style, this.prop);
            this.options.show = true;

            /**
             * Comece a animação.
             */
            this.custom(0, this.cur());

            /**
             * Certifique-se de começar com uma largura/altura pequena
             * para evitar qualquer flash de conteúdo.
             */
            if (this.prop == "width" || this.prop == "height")
            {
                this.elem.style[this.prop] = "1px";
            }

            /**
             * Comece mostrando o elemento.
             */
            jQuery(this.elem).show();
        },

        /**
         * Função 'hide' simples.
         */
        hide: function()
        {
            /**
             * Lembre-se de onde começamos, para que possamos
             * voltar mais tarde.
             */
            this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
            this.options.hide = true;

            /**
             * Comece a animação.
             */
            this.custom(this.cur(), 0);
        },

        /**
         * Cada etapa de uma animação.
         */
        step: function()
        {
            var t = (new Date()).getTime();
            if (t > this.options.duration + this.startTime)
            {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();
                this.options.curAnim[this.prop] = true;

                var done = true;
                for (var i in this.options.curAnim)
                {
                    if (this.options.curAnim[i] !== true)
                    {
                        done = false;
                    }
                }

                if (done)
                {
                    if (this.options.display != null)
                    {
                        /**
                         * Redefina o overflow.
                         */
                        this.elem.style.overflow = this.options.overflow;

                        /**
                         * Reinicialize a tela.
                         */
                        this.elem.style.display = this.options.display;
                        if (jQuery.css(this.elem, "display") == "none")
                        {
                            this.elem.style.display = "block";
                        }
                    }

                    /**
                     * Oculte o elemento se a operação "hide" (ocultar ?)
                     * tiver sido realizada.
                     */
                    if (this.options.hide)
                    {
                        this.elem.style.display = "none";
                    }

                    /**
                     * Redefina as propriedades, se o item estiver oculto
                     * ou exibido.
                     */
                    if (this.options.hide || this.options.show)
                    {
                        for (var p in this.options.curAnim)
                        {
                            jQuery.attr(this.elem.style, p, this.options.orig[p]);
                        }
                    }
                }

                /**
                 * Se um callback foi fornecido, execute-o.
                 */
                if (done && jQuery.isFunction(this.options.complete))
                {
                    /**
                     * Execute a função completa.
                     */
                    this.options.complete.apply(this.elem);
                }

                return false;
            } else
            {
                var n = t - this.startTime;
                this.state = n / this.options.duration;

                /**
                 * Execute a função de atenuação, o padrão é swing.
                 */
                this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
                this.now = this.start + ((this.end - this.start) * this.pos);

                /**
                 * Execute a próxima etapa da animação.
                 */
                this.update();
            }

            return true;
        }
    };

    /**
     *
     */
    jQuery.fx.step = {
        /**
         *
         */
        scrollLeft: function(fx)
        {
            fx.elem.scrollLeft = fx.now;
        },

        /**
         *
         */
        scrollTop: function(fx)
        {
            fx.elem.scrollTop = fx.now;
        },

        /**
         *
         */
        opacity: function(fx)
        {
            jQuery.attr(fx.elem.style, "opacity", fx.now);
        },

        /**
         *
         */
        _default: function(fx)
        {
            fx.elem.style[fx.prop] = fx.now + fx.unit;
        }
    };

    /**
     * O método de deslocamento. parte do Dimension Plugin.
     * http://jquery.com/plugins/project/dimensions.
     */
    jQuery.fn.offset = function()
    {
        var left = 0, top = 0, elem = this[0], results;

        if (elem)
        {
            with (jQuery.browser)
            {
                var absolute = jQuery.css(elem, "position") == "absolute",
                    parent = elem.parentNode,
                    offsetParent = elem.offsetParent,
                    doc = elem.ownerDocument,
                    safari2 = safari && !absolute && parseInt(version) < 522;

                /**
                 * Use getBoundingClientRect se disponível.
                 */
                if (elem.getBoundingClientRect)
                {
                    box = elem.getBoundingClientRect();

                    /**
                     * Adicione os deslocamentos de rolagem do documento.
                     */
                    add(
                        box.left + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
                        box.top  + Math.max(doc.documentElement.scrollTop, doc.body.scrollTop)
                    );

                    /**
                     * O IE adiciona a borda do elemento HTML, por padrão
                     * é média que tem 2px. Modo peculiar do IE 6 e IE 7,
                     * a largura da borda pode ser substituída pelo seguinte
                     * css html { border: 0; }. Modo de padrões do IE 7, a
                     * borda é sempre 2px.
                     */
                    if (msie)
                    {
                        var border = jQuery("html").css("borderWidth");
                            border = (border == "medium" || jQuery.boxModel && parseInt(version) >= 7) && 2 || border;

                        add(-border, -border);
                    }

                    /**
                     * Caso contrário, faça um loop pelos offsetParents
                     * e parentNodes.
                     */
                } else
                {
                    /**
                     * Deslocamentos do elemento inicial.
                     */
                    add(elem.offsetLeft, elem.offsetTop);

                    /**
                     * Obter parent offsets.
                     */
                    while (offsetParent)
                    {
                        /**
                         * Adicione deslocamentos offsetParent.
                         */
                        add(offsetParent.offsetLeft, offsetParent.offsetTop);

                        /**
                         * Mozilla e Safari > 2 não incluem a borda dos pais
                         * deslocados. No entanto, a Mozilla adiciona a borda
                         * para as células da tabela.
                         */
                        if (mozilla && /^t[d|h]$/i.test(parent.tagName) || !safari2)
                        {
                            border(offsetParent);
                        }

                        /**
                         * Safari <= 2 duplica os deslocamentos do corpo com
                         * um elemento ou pai absolutamente posicionado.
                         */
                        if (safari2 && !absolute && jQuery.css(offsetParent, "position") == "absolute")
                        {
                            absolute = true;
                        }

                        /**
                         * Obtenha o próximo offsetParent.
                         */
                        offsetParent = offsetParent.offsetParent;
                    }

                    /**
                     * Obtenha deslocamentos de rolagem pai.
                     */
                    while (parent.tagName && /^body|html$/i.test(parent.tagName))
                    {
                        /**
                         * Contorne o bug do opera inline/table scrollLeft/Top.
                         */
                        if (/^inline|table-row.*$/i.test(jQuery.css(parent, "display")))
                        {
                            /**
                             * Subtraia os deslocamentos de rolagem pai.
                             */
                            add(-parent.scrollLeft, -parent.scrollTop);
                        }

                        /**
                         * A Mozilla não adiciona a borda para um pai que
                         * tenha overflow != visible.
                         */
                        if (mozilla && jQuery.css(parent, "overflow") != "visible")
                        {
                            border(parent);
                        }

                        /**
                         * Obtenha o próximo parent.
                         */
                        parent = parent.parentNode;
                    }

                    /**
                     * O Safari duplica os deslocamentos do corpo com
                     * um elemento ou pai absolutamente posicionado.
                     */
                    if (safari && absolute)
                    {
                        add(-doc.body.offsetLeft, -doc.body.offsetTop);
                    }
                }

                /**
                 * Retorna um objeto com propriedades superior e esquerda.
                 */
                results = {
                    top: top,
                    left: left
                };
            }
        }

        /**
         *
         */
        return results;

        /**
         *
         */
        function border(elem)
        {
            add(
                jQuery.css(elem, "borderLeftWidth"),
                jQuery.css(elem, "borderTopWidth")
            );
        }

        /**
         *
         */
        function add(l, t)
        {
            left += parseInt(l) || 0;
            top += parseInt(t) || 0;
        }
    };
})();
