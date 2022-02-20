"use strict";
(function() {
  const random = _ => Math.random();
  const floor = _ => Math.floor(_);
  const int = _ => parseInt(_);

  const rndMinMaxInt = (min, max) => floor(random() * (max - min + 1)) + min;
  const rndCoinBool = _ => (~~floor(random() * 2) === 0);
  const rndFromArray = arr => arr[rndMinMaxInt(0, arr.length - 1)];
  const rndId = (l = 6) => {
    let res = ''
    for(let i = 0; i < l; i++) res += rndFromArray(`_abcdef0123456789`.split(''));
    return res;
  };
  const qs = (slctr, ctx = null, mode = 'querySelector') => (ctx ? ctx : document.body)[mode](slctr);
  const sortRndAlt = array => array.sort(() => random() - 0.5);
  const createEl = type => document.createElement(type);
  const insert = (child, parent = null) => parent ? parent.appendChild(child) : document.body.appendChild(child);
  const insertAlt = (child, position = 'afterbegin', parent = null ) => parent ? parent.insertAdjacentElement(position, child) : document.body.insertAdjacentElement(position, child);
  const aHtml = (html, position = 'afterbegin', parent = null ) => parent ? parent.insertAdjacentHTML(position, html) : document.body.insertAdjacentHTML(position, html);
  const addTx = (el, text) => el.innerText = text;
  const cls = (el, cls, mode = 'contain') => el.classList[mode](cls);
  const co = o => JSON.parse(JSON.stringify(o));
  const px = unit => `${unit}px`;
  const remAttr = (el, key) => el.removeAttribute(key);
  const setAttr = (el, key, val) => el.setAttribute(key, val);
  const getAttr = (el, key) => el.getAttribute(key);

  const formatNumber = number => {
    return String(number).split('').reverse().join('').replace(/(.{3})/gim, '$1 ').split('').reverse().join('').trim();
  };

  class Accordion {
    /* common reference:
     * https://css-tricks.com/how-to-animate-the-details-element-using-waapi/
     * Thank You!
     * /
    /* elements*/
    elRoot = null;
    elSummary = null;
    elContent = null;

    /* properties */
    name = 'unnamed';
    animation = false;
    isOpen = false;
    inProcessOpen = false;
    inProcessClose = false;

    duration = 150;
    easing = 'ease-out';

    /* static props */
    static elements = [];

    constructor(el) {
      this.elRoot = el;
      this.elSummary = qs('summary', el);
      this.elContent = qs('summary + *', el);

      this.name = this.elSummary.innerText;

      this.isOpen = el.open;

      const duration = getAttr(this.elRoot, 'duration');
      if(duration) {
        this.duration = int(duration);
      } else {
        const hContent = this.elContent.offsetHeight;
        this.duration = (hContent > 150 && hContent < 600) ? hContent : (hContent < 150) ? 150 : (hContent > 600) ? 600 : 'Oh Crap!';
      }

      this.elSummary.addEventListener('click', event => this.summaryHandler(event));
    }

    summaryHandler(event) {
      event.preventDefault();
      this.elRoot.style.overflow = 'hidden';
      if(!this.isOpen || !this.elRoot.open) this.open();
      else if(this.isOpen || this.elRoot.open) this.close();
    }

    open() {
      this.elRoot.style.height = `${this.elRoot.offsetHeight}px`;
      this.elRoot.open = true;
      this.isOpen = true;
      setAttr(this.elRoot, 'aria-expanded', true);
      setAttr(this.elContent, 'aria-hidden', false);
      window.requestAnimationFrame(_ => this.expand());
    }
    close() {
      setAttr(this.elRoot, 'aria-expanded', false);
      setAttr(this.elContent, 'aria-hidden', true);
      this.shrink();
    }

    expand() {
       this.inProcessOpen = true;
       const hRoot = this.elRoot.offsetHeight;
       const hSummary = this.elSummary.offsetHeight;
       const hContent = this.elContent.offsetHeight;

       const startHeight = px(hRoot);
       const endHeight = px(hSummary + hContent);

       if (this.animation) this.animation.cancel();

       this.animation = this.elRoot.animate({
         height: [startHeight, endHeight]
       }, {
         duration: this.duration,
         easing: this.easing
       });
       this.animation.onfinish = () => this.onAnimationFinish(true);
       this.animation.oncancel = () => this.inProcessOpen = false;
    }

    shrink() {
      this.inProcessClose = true;

      const hRoot = this.elRoot.offsetHeight;
      const hSummary = this.elSummary.offsetHeight;

      const startHeight = px(hRoot);
      const endHeight = px(hSummary);

      if (this.animation) this.animation.cancel();

      this.animation = this.elRoot.animate({
        height: [startHeight, endHeight]
      }, {
        duration: this.duration,
        easing: this.easing
      });

      this.animation.onfinish = () => this.onAnimationFinish(false);
      this.animation.oncancel = () => this.inProcessClose = false;
    }

    onAnimationFinish(open) {
      this.elRoot.open = open;
      this.isOpen = open;
      this.animation = null;
      this.inProcessClose = false;
      this.inProcessOpen = false;
      this.elRoot.style.height = '';
      this.elRoot.style.overflow = '';
      if(getAttr(this.elRoot, 'style').length === 0) remAttr(this.elRoot, 'style');
    }

    /* static methods */
    static init({ selector, ctx = null }) {
      [...qs(selector, ctx, 'querySelectorAll')]
      .forEach(el => this.addElement(new this(el)));
      return this;
    }

    static log() {
      console.log(this.elements);
      return this;
    }

    static addElement(el) {
      if(!el) return false;
      // console.log(`%c${el.name}`, 'background: repeating-radial-gradient(rgba(255,255,255,0.1), rgba(0,0,0,0.1) 1rem); padding: 1rem; color: white; border-left: 5px solid white;');
      this.elements.push(el);
      return this;
    }
  };




  window.utils = {
    Accordion,
    sortRndAlt,
    random,
    floor,
    rndMinMaxInt,
    rndCoinBool,
    rndFromArray,
    rndId,
    createEl,
    insert,
    insertAlt,
    aHtml,
    addTx,
    cls,
    co,
    remAttr,
    setAttr,
    getAttr,
    formatNumber,
    int
  };
})();
