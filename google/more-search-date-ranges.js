// ==UserScript==
// @name        [Google] More Search Date Ranges
// @name:ja     Google Search Various Ranges
// @name:zh-CN  Google Search Various Ranges
// @description Add more time ranges on Google search.
// @description:ja Google検索の期間指定の選択肢を増やします。
// @description:zh-CN 增加Google搜索中指定期间的选项。
// @namespace   knoa.jp
// @include     https://www.google.*/search?*
// @version     2.0.2
// @grant       none
// ==/UserScript==

(function () {
    const SCRIPTNAME = 'GoogleSearchVariousRanges';
    const DEBUG = false;/*
  [update] 2.0.2
  fixed the layout bug.
    */
    if (window === top) console.time(SCRIPTNAME);
    const LANGS = ['en', 'ja', 'fr', 'ru', 'zh', 'es', 'ar'];
    const RANGES = {
        qdr_h: {
            h: ["Past hour", "1 時間以内", "Moins d'une heure", "За час", "过去 1 小时内", "Última hora", "آخر ساعة"],
            //h2: ["Past 2 hours",  "2 時間以内",  "Moins de 2 heures",   "За 2 часа",   "过去 2 小时内",  "Últimas 2 horas",   "آخر ساعتين"],
            h12: ["Past 12 hours", "12 時間以内", "Moins de 12 heures", "За 12 часов", "过去 12 小时内", "Últimas 12 horas", "آخر ١٢ ساعة"],
        },
        qdr_d: {
            d: ["Past day", "1 日以内", "Moins d'un jour", "За 1 дня", "过去 1 天内", "Último 1 día", "آخر 24 ساعة"],
            //d2: ["Past 2 days",   "2 日以内",    "Moins de 2 jours",    "За 2 дня",    "过去 2 天内",    "Últimos 2 días",    "آخر يومين"],
            //d3: ["Past 3 days",   "3 日以内",    "Moins de 3 jours",    "За 3 дня",    "过去 3 天内",    "Últimos 3 días",    "آخر ٣ أيام"],
        },
        qdr_w: {
            w: ["Past week", "1 週間以内", "Moins d'une semaine", "За неделю", "过去 1 周内", "Última semana", "آخر أسبوع"],
            //w2: ["Past 2 weeks",  "2 週間以内",  "Moins de 2 semaines", "За 2 недели", "过去 2 周内",    "Últimas 2 semanas", "آخر أسبوعين"],
        },
        qdr_m: {
            m: ["Past month", "1 か月以内", "Moins d'un mois", "За месяц", "过去 1 个月内", "Último mes", "آخر شهر"],
            m2: ["Past 2 months", "2 か月以内", "Moins de 2 mois", "За 2 месяца", "过去 2 个月内", "Últimos 2 meses", "آخر شهرين"],
            m6: ["Past 6 months", "6 か月以内", "Moins de 6 mois", "За 6 месяца", "过去 6 个月内", "Últimos 6 meses", "آخر ٦ شهور"],
        },
        qdr_y: {
            y: ["Past year", "1 年以内", "Moins d'une an", "За год", "过去 1 年内", "Último año", "آخر سنة"],
            y2: ["Past 2 years", "2 年以内", "Moins de 2 ans", "За 2 года", "过去 2 年内", "Últimos 2 años", "آخر سنتين"],
            y5: ["Past 5 years", "5 年以内", "Moins de 5 ans", "За 5 года", "过去 5 年内", "Últimos 5 años", "آخر ٥ سنوات"],
        },
    };
    const PERIODS = [
        // You can edit or add below.
        //{
        //  "in '90s": ['1/1/1990', '12/31/1999'],
        //  "in '00s": ['1/1/2000', '12/31/2009'],
        //  "in '10s": ['1/1/2010', '12/31/2019'],
        //},
        //{
        //  "Before 2000": ['', '12/31/1999'],
        //  "After 2000" : ['1/1/2000', ''],
        //},
    ];
    const PADDING = 30 + 44;/*default left+right padding size of each range items*/
    let elements = {}, sizes = {};
    let core = {
        initialize: function () {
            core.ready();
        },
        ready: function () {
            let qdr = document.querySelector('#qdr_'), a = document.querySelector('li[id^="qdr_"] a[href*="qdr:"]');
            if (qdr === null || a === null) return setTimeout(core.ready, 250);
            elements.ul = qdr.parentNode;
            elements.a = a;
            /* DOM operations */
            core.rebuildRanges();
            core.addCustomPeriods();
            core.replaceSelectedCheckmark();
            core.calculateWidth();
        },
        rebuildRanges: function () {
            let lang = document.documentElement.lang.split('-')[0];
            let lindex = (LANGS.includes(lang)) ? LANGS.indexOf(lang) : 0;
            let lis = elements.ul.querySelectorAll('li[id^="qdr_"]');
            for (let i = 1; lis[i]; i++) {
                if (RANGES[lis[i].id]) {
                    for (let range in RANGES[lis[i].id]) {
                        let a = elements.a.cloneNode(true);
                        a.href = a.href.replace(/(qdr:)[a-z][0-9]*/, '$1' + range);
                        a.textContent = RANGES[lis[i].id][range][lindex];
                        lis[i].appendChild(a);
                    }
                    lis[i].removeChild(lis[i].firstChild);
                } else {
                    lis[i].style.display = 'none';
                }
            }
        },
        addCustomPeriods: function () {
            let cdr = elements.ul.querySelector('#cdrlnk');/*Custom range...*/
            for (let i = 0; PERIODS[i]; i++) {
                let line = document.createElement('div');
                for (let key in PERIODS[i]) {
                    let a = elements.a.cloneNode(true);
                    a.href = a.href.replace(/(qdr:)[a-z][0-9]*/, `cdr:1,cd_min:${PERIODS[i][key][0]},cd_max:${PERIODS[i][key][1]}`);
                    a.textContent = key;
                    line.appendChild(a);
                }
                cdr.parentNode.appendChild(line);
            }
        },
        replaceSelectedCheckmark: function () {
            let sel = elements.ul.querySelector('li[id*="dr_"].hdtbSel');
            if (sel && sel.id !== 'qdr_'/*Any time*/) {
                let a, cdruri = location.href.match(/cdr:1,cd_min:[0-9\/]*,cd_max:[0-9\/]*/);
                if (cdruri) {/*has period*/
                    a = elements.ul.querySelector(`li[id^="cdr_"] a[href*="${cdruri[0]}"]`);
                } else {
                    let qdr = sel.id.split('_')[1];
                    a = elements.ul.querySelector(`li[id^="qdr_"] a[href*="qdr:${qdr}&"]`);
                }
                if (a) {
                    a.classList.add('hdtbSel');
                    sel.classList.remove('hdtbSel');
                }
            }
        },
        calculateWidth: function () {
            /* for calculating width */
            elements.ul.style.visibility = 'visible';
            elements.ul.style.visibility = 'hidden';
            elements.ul.style.display = 'block';
            sizes.maxwidth = 0;
            /* calculate */
            let as = elements.ul.querySelectorAll('li[id^="qdr_"] a[href*="qdr:"]');
            for (let i = 0, a; a = as[i]; i++) {
                if (sizes.maxwidth < a.offsetWidth) sizes.maxwidth = a.offsetWidth;
            }
            if (sizes.maxwidth === 0) return setTimeout(core.calculateWidth, 250);
            /* restore */
            elements.ul.style.visibility = '';
            elements.ul.style.display = '';
            core.addStyle();
        },
        addStyle: function () {
            (function (css) {
                let head = document.querySelector('head');
                let style = document.createElement('style');
                style.type = 'text/css';
                style.textContent = css;
                head.appendChild(style);
            })(`
          #hdtb li[id^="qdr_"].hdtbItm a,
          #hdtb li[id^="cdr_"].hdtbItm a{
            display: inline-block !important;
            width: ${sizes.maxwidth - PADDING}px !important;
            padding-right: 20px !important;
          }
        `);
        },
    };
    let log = (DEBUG) ? console.log.bind(null, SCRIPTNAME + ':') : function () { };
    core.initialize();
    if (window === top) console.timeEnd(SCRIPTNAME);
})();