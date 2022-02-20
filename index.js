"use strict";
(function() {

  const {
    Accordion,
    int,
    sortRndAlt,
    co,
    addTx,
    cls,
    createEl,
    aHtml,
    insert,
    insertAlt,
    remAttr,
    setAttr,
    getAttr,
    rndId,
    rndMinMaxInt,
    rndCoinBool,
    rndFromArray,
    formatNumber
  } = window.utils;

  const { entries } = Object;

  class Style {
    static rules = {};
    static elRoot  = null;
    constructor() { }
    static update() {
      const { rules } = this;
      let res = entries(rules)
      .reduce((sum, [key, val]) => {
        if(/^%past_/gim.test(key)) sum += val;
        else sum += `${key}{${val}}`;
        return sum;
      }, '')
      .replace(/\n/gim, '')
      .replace(/[\s\t]/gim, ' ')
      .replace(/\s+/gim, ' ')
      .replace(/\; *\}/gim, '}')
      .replace(/\; /gim, ';')
      .replace(/(\/\*.*?\*\/)/gim, '')
      .replace(/\{ /gim, '{')
      .replace(/\: /gim, ':');
      if(!this.elRoot) {
        this.elRoot = createEl('style');
        insertAlt(this.elRoot, 'beforeend', document.head)
      }
      addTx(this.elRoot, res);
    }

    static add(selector, rules) { this.rules[selector] = rules; }
    static past(rules) { this.rules[`%past_${this.rules.length}`] = rules; }
  }

  class Matrix {
    // props
    width = 1;
    height = 1;
    matrix = [];
    matrixView = [];
    total = 0;

    isShuffle = false;

    // events
    eventMutate = null;

    // play / stop
    isPlay = false;
    timer = null;
    timerCount = 0;
    timeout = 270;
    timeoutShort = 270;
    timeoutLong = 2000;

    // fn
    gen = null;

    // elements
    elRoot = null;
    elements = [];

    constructor({width = 1, height = 1, gen = null }) {
      this.width = width;
      this.height = height;

      this.setGen(gen);
      this.eventMutate = new CustomEvent('matrix-mutate', { detail: {ctx: this}});
      this.createStyle();
      this.createData();
      this.createElements();
      this.calculateSum();
      this.render();
    };

    defaultGen({index, row, column, ctx}) {
      return {
        index,
        value: index,
        valueView: 0,
        mult: 1
      };
    };
    setGen(fn = null) {
      if(fn === null) this.gen = this.defaultGen;
      else this.gen = fn;
    }
    setShuffleOn() {
      console.log('shuffle on');
      this.isShuffle = true;
    }
    setShuffleOff() {
      console.log('shuffle off');
      this.isShuffle = false;
    }
    createStyle() {
      const { width } = this;
      Style.add('.matrix', `
        display: grid;
        grid-template-columns: repeat(${width}, 1fr);
        gap: 1rem;
        padding: 1rem;
        max-width: 100%;
        min-width: 420px;
        width: 70vh;
        aspect-ratio: 1;
        background-color: var(--bg-matrix);
        position: relative;
        border-radius: var(--rad-ui-layout);
        order: -1;
        z-index: 1;
      `);
      Style.add('.matrix__cell', `
        transition: background-color var(--trz-eo-025), outline var(--trz-eo-025), color var(--trz-eo-025);

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        aspec-ratio: 1;
        position: relative;
        z-index: 2;

        text-align: center;

        border-radius: 0.5rem;
        border: 1px solid var(--clr-cell-border);
        outline: 0px solid hsla(0deg, 100%, 50%, 0);

        background-color: var(--bg-cell-regular);
        color: var(--clr-cell);

        font-size: 1.6rem;
        line-height: 1;

      `);

      Style.add('.matrix__cell::selection', `
        background-color: var(--bg-matrix);
      `);

      Style.add('.matrix__cell_zero', `
        background-color: var(--bg-cell-zero);
        color: var(--clr-cell-zero);
      `);
      Style.add('.matrix__cell_extra\\:2', `outline: 0.14rem solid var(--clr-m-2); `);
      Style.add('.matrix__cell_extra\\:3', `outline: 0.37rem solid var(--clr-m-3); `);
      Style.add('.matrix__cell_extra\\:4', `outline: 0.49rem solid var(--clr-m-4); `);
    }
    createData() {
      const { width, height } = this;
      let index = 0;
      for (let h = 0; h < height; h++) {
        let row = [];
        for (let w = 0; w < width; w++) {
          index++;
          row.push(this.gen({ index, row: h, column: w, ctx: this}));
        }
        this.matrix.push(row);
      }
    }

    mutateData() {
      const { width, height } = this;
      let index = 0;
      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          index++;
          this.matrix[h][w] = this.gen({ index, row: h, column: w, ctx: this});
          this.matrix[h][w].valueView = this.matrix[h][w].value * this.matrix[h][w].mult;
        }
      }
      this.elRoot.dispatchEvent(this.eventMutate);
    }

    shuffle() {
      console.log('shuffle');
      let { width, height, matrix } = this;
      let arr = co(matrix);
      // matrix = sortRndAlt(matrix);
      // matrix = matrix.map(a => sortRndAlt(a));
      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          let rndH = rndMinMaxInt(0, height - 1);
          let rndW = rndMinMaxInt(0, width - 1);
          let swapVal = arr[rndH][rndW];
          let curVal = arr[h][w];
          arr[h][w] = co(swapVal);
          arr[rndH][rndW] = co(curVal);
        }
      }
      return arr;
    }
    createElements() {
      const { width, height } = this;
      this.elRoot = createEl('div');
      cls(this.elRoot, 'matrix', 'add');
      insertAlt(this.elRoot);
      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          let el = createEl('div');
          cls(el, 'matrix__cell', 'add');
          insertAlt(el, 'afterbegin', this.elRoot);
          this.elements.push(el);
        }
      }
    };

    calculateSum() {
      const { width, height, matrix } = this;
      let res = 0;
      for (let h = height - 1; h >= 0; h--) {
        for (let w = width - 1; w >= 0; w--) {
          res += int(matrix[h][w].valueView);
        }
      }
      this.total = res;
    };

    getTotal() {
      this.calculateSum();
      return this.total;
    }

    postProcessingCell(el, { mult, valueView, value }) {
      const { innerText } = el;
      if(int(innerText) === 0) cls(el, 'matrix__cell_zero', 'add');
      else cls(el, 'matrix__cell_zero', 'remove');
      cls(el, 'matrix__cell_extra:2', 'remove');
      cls(el, 'matrix__cell_extra:3', 'remove');
      cls(el, 'matrix__cell_extra:4', 'remove');
      if(mult !== 1) cls(el, `matrix__cell_extra:${mult}`, 'add');
    }

    render() {
      const { matrix, height, width } = this;
      this.mutateData();
      this.matrixView = this.isShuffle ? this.shuffle() : co(this.matrix);
      let count = 0;
      for (let h = height - 1; h >= 0; h--) {
        for (let w = width - 1; w >= 0; w--) {
          addTx(this.elements[count], this.matrixView[h][w].valueView);
          this.postProcessingCell(this.elements[count], this.matrixView[h][w]);
          count++;
        }
      }
    };

    play() {
      this.isPlay = true;
      this.timeout = this.timeoutShort;
      this.loop();
    }

    stop() {
      this.isPlay = false;
      this.timeout = this.timeoutLong;
    }
    clearLoop() {
      clearTimeout(this.timer);
    }
    loop() {
      const self = this;
      self.clearLoop();
      const process = _ => {
        if(self.isPlay) {
          self.timerCount++;
          if(self.timerCount > rndMinMaxInt(4, 12)) {
            self.timerCount = 0;
            self.timeout = rndMinMaxInt(800, 4000);
          } else {
            self.timeout = rndMinMaxInt(150, 600);
          }
          self.render();
        }
        self.timer = setTimeout(process, self.timeout);
      };
      process();
    }
    log() {
      console.dir(this);
    }
  };

  class UI {
    // props
    matrix = null;
    modes = [ 'Mode 1', 'Mode 2' ];
    selectedMode = '';
    isPlay = false;

    extraQ = [
      {val: 2, probQ: 10},
      {val: 3, probQ: 5},
      {val: 4, probQ: 2},
    ];

    extra = null;
    sumHistory = [];

    // elements
    elRoot = null;
    elinfo = null;
    elSum = null;
    elMiddle = null;
    elMode = null;
    elPlay = null;
    elDetails = { details: null, summary: null, content: null, };
    elAdd = { group: null, label: null, input: null, };
    elOrder = { group: null, label: null, input: null, };
    elExtra = { group: null, label: null, input: null, };
    elZero = { group: null, label: null, input: null, };

    constructor({matrix}) {
      this.createExtra();
      this.createStyle();
      this.createElements();
      this.setBehaviorElements();
      this.matrix = matrix;
      this.orderController();
      this.extraController();
      this.zerosController();
      this.modeController();
      this.setTotal(this.matrix.getTotal());

      this.matrix.render();
      this.matrix.elRoot.addEventListener('matrix-mutate', e => this.setTotal(this.matrix.getTotal()));
    }

    createExtra() {
      this.extra = this.extraQ.map(({val, probQ}) => {
        let res = [];
        for(let i = 0; i < probQ; i++) res.push(val);
        return res;
      }).flat();
    };

    createStyle() {
      Style.add('.ui', `
        padding: 1rem;
        max-width: 100%;
        min-width: 420px;
        margin-top: 1rem;
        border-radius: var(--rad-ui-layout);
        width: 70vh;
        display: grid;
        grid-template-columns: repeat(2, 1fr);

        background-color: var(--bg-matrix);
      `);

      Style.add('.ui__info', `
        grid-column: 1 / 1;
        position: absolute;
      `);
      Style.add('.ui__info > span:not(:last-child)', `
        margin-right: 1rem
      `);
      Style.add('.ui__sum', ` `);
      Style.add('.ui__middle', ` `);

      Style.add('.ui__details', `
        margin-left: auto;
        grid-column: 1 / 7;
        display: block;
        width: 100%;
        text-align: right;
      `);

      Style.add('.ui__summary', `
        cursor: pointer;
        display: inline-flex;
        justify-content: flex-end;
        border-bottom: 1px dashed currentcolor;

      `);

      Style.add('.ui__summary:after', `
        transition: transform var(--trz-eo-015);
        content: '>';
        display: block;
        transform: scale(1.5, 1) translateY(-0.2rem) rotate(90deg);
        padding-left: 0.5rem;
      `);

      Style.add('.ui__details[open] .ui__summary:after', `
        transform: scale(1.5, 1) translateY(0.2rem) rotate(-90deg);
      `);

      Style.add('.ui__content', `
        text-align: left;
        margin-top: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
      `);

      Style.add('.ui__play', `
        font-size: 1rem;
        padding: 0.5rem 1rem;
        background-color: #ffffff;
        border-style: none;
      `);
      Style.add('.ui__mode', `
        font-size: 1rem;
        padding: 0.5rem 1rem;
        background-color: #ffffff;
        border-style: none;
        margin-left: auto;
      `);
      Style.add('.ui__group', `
        display: flex;
        flex-direction: row;
        align-items: center;
      `);
      Style.add('.ui__group label', `
        white-space: pre;
        padding-right: 0.25rem;
      `);
      Style.add('.ui__group_w\\:1\\/2', `
        flex-basis: ${100 / 2}%;
      `);
      Style.add('.ui__group_w\\:1\\/6', `
        flex-basis: calc(${100 / 6} - 2rem%);
      `);
      Style.add('.ui__group_ta\\:right', `
        text-align: right;
      `);
      Style.add('.ui__group_nw', `
        flex-wrap: nowrap;
      `);
      Style.add('.ui__group input[type="number"]', `
        font-size: 1rem;
        padding: 0.5rem 1rem;
        background-color: #ffffff;
        border-style: none;
        width: 100%;
      `);
    }
    createElements() {
      this.elRoot = createEl('div');
      cls(this.elRoot, 'ui', 'add');
      insertAlt(this.elRoot);



      this.elInfo = createEl('p');
      cls(this.elInfo, 'ui__info', 'add');
      insertAlt(this.elInfo, 'beforeend', this.elRoot);

      this.elSum = createEl('span');
      cls(this.elSum, 'ui__sum', 'add');
      insertAlt(this.elSum, 'beforeend', this.elInfo);

      this.elMiddle = createEl('span');
      cls(this.elMiddle, 'ui__middle', 'add');
      insertAlt(this.elMiddle, 'beforeend', this.elInfo);



      this.elDetails.details = createEl('details');
      this.elDetails.summary = createEl('summary');
      this.elDetails.content = createEl('div');

      cls(this.elDetails.details, 'ui__details', 'add');
      cls(this.elDetails.summary, 'ui__summary', 'add');
      cls(this.elDetails.content, 'ui__content', 'add');

      addTx(this.elDetails.summary, 'Options');

      insertAlt(this.elDetails.summary, 'beforeend', this.elDetails.details);
      insertAlt(this.elDetails.content, 'beforeend', this.elDetails.details);
      insertAlt(this.elDetails.details, 'beforeend', this.elRoot);

      Accordion.init({selector: '.ui__details'})

      this.elAdd.group = createEl('div');
      this.elAdd.label = createEl('label');
      this.elAdd.input = createEl('input');

      setAttr(this.elAdd.input, 'id', rndId());
      setAttr(this.elAdd.label, 'for', getAttr(this.elAdd.input, 'id'));
      addTx(this.elAdd.label, 'Add / Cut');
      setAttr(this.elAdd.input, 'type', 'number');
      setAttr(this.elAdd.input, 'value', 0);
      cls(this.elAdd.group, 'ui__group', 'add');
      cls(this.elAdd.group, 'ui__group_w:1/2', 'add');
      cls(this.elAdd.group, 'ui__group_nw', 'add');

      insertAlt(this.elAdd.label, 'beforeend', this.elAdd.group);
      insertAlt(this.elAdd.input, 'beforeend', this.elAdd.group);
      insertAlt(this.elAdd.group, 'beforeend', this.elDetails.content);


      this.elZero.group = createEl('div');
      this.elZero.label = createEl('label');
      this.elZero.input = createEl('input');

      setAttr(this.elZero.input, 'id', rndId());
      setAttr(this.elZero.label, 'for', getAttr(this.elZero.input, 'id'));
      addTx(this.elZero.label, 'With Zeros');
      setAttr(this.elZero.input, 'type', 'checkbox');
      this.elZero.input.checked = false;
      cls(this.elZero.group, 'ui__group', 'add');
      cls(this.elZero.group, 'ui__group_w:1/6', 'add');
      cls(this.elZero.group, 'ui__group_ta:right', 'add');

      insertAlt(this.elZero.label, 'beforeend', this.elZero.group);
      insertAlt(this.elZero.input, 'beforeend', this.elZero.group);
      insertAlt(this.elZero.group, 'beforeend', this.elDetails.content);



      this.elOrder.group = createEl('div');
      this.elOrder.label = createEl('label');
      this.elOrder.input = createEl('input');

      setAttr(this.elOrder.input, 'id', rndId());
      setAttr(this.elOrder.label, 'for', getAttr(this.elOrder.input, 'id'));
      addTx(this.elOrder.label, 'In Order');
      setAttr(this.elOrder.input, 'type', 'checkbox');
      this.elOrder.input.checked = false;
      cls(this.elOrder.group, 'ui__group', 'add');
      cls(this.elOrder.group, 'ui__group_w:1/6', 'add');
      cls(this.elOrder.group, 'ui__group_ta:right', 'add');


      insertAlt(this.elOrder.label, 'beforeend', this.elOrder.group);
      insertAlt(this.elOrder.input, 'beforeend', this.elOrder.group);
      insertAlt(this.elOrder.group, 'beforeend', this.elDetails.content);



      this.elExtra.group = createEl('div');
      this.elExtra.label = createEl('label');
      this.elExtra.input = createEl('input');

      setAttr(this.elExtra.input, 'id', rndId());
      setAttr(this.elExtra.label, 'for', getAttr(this.elExtra.input, 'id'));
      addTx(this.elExtra.label, 'With Extra');
      setAttr(this.elExtra.input, 'type', 'checkbox');
      this.elExtra.input.checked = true;
      cls(this.elExtra.group, 'ui__group', 'add');
      cls(this.elExtra.group, 'ui__group_w:1/6', 'add');
      cls(this.elExtra.group, 'ui__group_ta:right', 'add');


      insertAlt(this.elExtra.label, 'beforeend', this.elExtra.group);
      insertAlt(this.elExtra.input, 'beforeend', this.elExtra.group);
      insertAlt(this.elExtra.group, 'beforeend', this.elDetails.content);



      this.elMode = createEl('select');
      this.modes.forEach(mod => {
        let el = createEl('option');
        setAttr(el, 'value', mod);
        addTx(el, mod);
        insertAlt(el, 'beforeend', this.elMode);
      })
      cls(this.elMode, 'ui__mode', 'add');
      insertAlt(this.elMode, 'beforeend', this.elDetails.content);

      this.elPlay = createEl('button');
      cls(this.elPlay, 'ui__play', 'add');
      addTx(this.elPlay, this.isPlay ? 'Stop' :  'Play');
      insertAlt(this.elPlay, 'beforeend', this.elDetails.content);
    }

    getGen() {
      const self = this;
      const getPrev = (index, row, column, ctx) => {
        const { matrix } = ctx;
        let isRun = true;
        let mHeight = matrix.length - 1;
        let mWidth = matrix[0].length - 1;
        let h = row;
        let w = column;
        let p = null;
        if(index === 0) return index;
        while (isRun) {
          w -= 1;
          if(w < 0) {
            h -= 1;
            w = mWidth;
          }
          if(h < 0) {
            return 0;
          }
          p = matrix[h][w].value;
          return p;
        }
      };
      const add = self.getAddCut();
      const isExtra = self.getIsExtra();
      const isZeros = self.getIsZeros();
      const mode = self.getMode();
      let value = 1;
      let mult = 1;
      return ({index, row, column, ctx}) => {
        if(mode === 'Mode 1') {
          let prev = getPrev(index, row, column, ctx) || (isZeros?0:1);
          let cur = (index <= 0 || index - 1 <= 0) ? (isZeros?0:1) : index - 1;
          if(isZeros) value = prev + cur + add;
          else value = prev + ((cur + add > 1) ? cur + add : cur);
        } else if(mode === 'Mode 2') {
          if(isZeros) value = index + add;
          else value = index + add > 0 ? index + add : index;
        }
        if(isZeros && value < 0) value = 0;
        if(isExtra) {
          if(value > 0) {
            if(rndCoinBool() && rndCoinBool()) mult = rndFromArray(this.extra);
            else mult = 1;
          } else {
            mult = 1;
          }
        } else if(!isExtra) {
          mult = 1
        }
        return { index, value, valueView: 0, mult };
      };
    }

    getAddCut() {
      let val = Number(this.elAdd.input.value);
      return isNaN(val) ? 0 : val;
    }
    getInOrder() {
      return this.elOrder.input.checked;
    }
    getIsExtra() {
      return this.elExtra.input.checked;
    }
    getIsZeros() {
      return this.elZero.input.checked;
    }
    getMode() {
      return this.elMode.value;
    }
    orderController() {
      const isShuffle = this.getInOrder() === false;
      if(isShuffle) this.matrix.setShuffleOn();
      else this.matrix.setShuffleOff();
      this.matrix.render();
    }
    extraController() {
      this.middleFlush();
      const gen = this.getGen();
      this.matrix.setGen(gen);
      this.matrix.render()
    }
    zerosController() {
      this.middleFlush();
      const gen = this.getGen();
      this.matrix.setGen(gen);
      this.matrix.render()
    }
    modeController() {
      const mode = this.getMode();
      if(mode !== this.selectedMode) this.middleFlush();
      this.selectedMode = mode;
      this.matrix.setGen(this.getGen());
      this.matrix.render();
    }

    setBehaviorElements() {
      this.elPlay.addEventListener('click', _ => {
        this.isPlay  = !this.isPlay;
        addTx(this.elPlay, this.isPlay ? 'Stop' :  'Play');
        this.isPlay ? this.matrix.play() : this.matrix.stop();
      });
      this.elAdd.input.addEventListener('input', _ => {
        this.elAdd.input.value = this.elAdd.input.value
        .replace(/^0{2,}/gim, '0')
        .replace(/^0(\d)/gim, '$1');
        if(this.elAdd.input.value === '') this.elAdd.input.value = 0;
        this.matrix.setGen(this.getGen());
        this.matrix.render();
      });
      this.elAdd.input.addEventListener('change', _ => {
        this.middleFlush();
        this.matrix.setGen(this.getGen());
        this.matrix.render();
      });
      this.elOrder.input.addEventListener('change', _ => this.orderController());
      this.elExtra.input.addEventListener('change', _ => this.extraController());
      this.elZero.input.addEventListener('change', _ => this.zerosController());
      this.elMode.addEventListener('change', _ => this.modeController());
    }

    setTotal(val) {
      this.middlePush(val);
      this.setMiddle();
      addTx(this.elSum, `Σ ${formatNumber(val)}`)
    }
    middleFlush() {
      this.sumHistory = [];
    }
    middlePush(val) {
      this.sumHistory.push(int(val));
    }
    setMiddle() {
      let { length } = this.sumHistory;
      let sum = this.sumHistory.reduce((s, c) => (s += int(c), s), 0);
      let res = int(sum / length);
      addTx(this.elMiddle, `μ ${formatNumber(res)}`)
    }

    log() {
      console.dir(this);
    }
  }
  class Github {
    elRoot = null;
    elIcon = null;
    elText = null;
    constructor() {
      this.createStyle();
      this.createElements();
    }
    createStyle() {
      Style.add('.github', ` `);
      Style.add('.github_modf', `
        position: absolute;
        right: 2rem;
        bottom: 2rem;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        opacity: 0.5;
        transition: opacity var(--trz-eo-015);
      `);
      Style.add('.github_modf:hover', `
        opacity: 1;
      `);
      Style.add('.github__text', `
        padding-right: 0.5rem;
        color: var(--clr-text);
        transform: translateY(0.25rem);
      `);
      Style.add('.github__icon', `
        background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4PSIwcHgiIHk9IjBweCIgaGVpZ2h0PSIzMiIgd2lkdGg9IjMyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNiAxNjsiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOCAwQzMuNTggMCAwIDMuNTggMCA4YzAgMy41NCAyLjI5IDYuNTMgNS40NyA3LjU5LjQuMDcuNTUtLjE3LjU1LS4zOCAwLS4xOS0uMDEtLjgyLS4wMS0xLjQ5LTIuMDEuMzctMi41My0uNDktMi42OS0uOTQtLjA5LS4yMy0uNDgtLjk0LS44Mi0xLjEzLS4yOC0uMTUtLjY4LS41Mi0uMDEtLjUzLjYzLS4wMSAxLjA4LjU4IDEuMjMuODIuNzIgMS4yMSAxLjg3Ljg3IDIuMzMuNjYuMDctLjUyLjI4LS44Ny41MS0xLjA3LTEuNzgtLjItMy42NC0uODktMy42NC0zLjk1IDAtLjg3LjMxLTEuNTkuODItMi4xNS0uMDgtLjItLjM2LTEuMDIuMDgtMi4xMiAwIDAgLjY3LS4yMSAyLjIuODIuNjQtLjE4IDEuMzItLjI3IDItLjI3LjY4IDAgMS4zNi4wOSAyIC4yNyAxLjUzLTEuMDQgMi4yLS44MiAyLjItLjgyLjQ0IDEuMS4xNiAxLjkyLjA4IDIuMTIuNTEuNTYuODIgMS4yNy44MiAyLjE1IDAgMy4wNy0xLjg3IDMuNzUtMy42NSAzLjk1LjI5LjI1LjU0LjczLjU0IDEuNDggMCAxLjA3LS4wMSAxLjkzLS4wMSAyLjIgMCAuMjEuMTUuNDYuNTUuMzhBOC4wMTMgOC4wMTMgMCAwMDE2IDhjMC00LjQyLTMuNTgtOC04LTh6Ij48L3BhdGg+PC9zdmc+DQo=');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center right;
        height: 2rem;
        width: 2rem;
        display: block;
      `);
    }
    createElements() {
      this.elRoot = createEl('a');
      cls(this.elRoot, 'github', 'add');
      cls(this.elRoot, 'github_modf', 'add');
      setAttr(this.elRoot, 'href', 'https://github.com/Silksofthesoul/e6');
      setAttr(this.elRoot, 'target', '_blank');
      insertAlt(this.elRoot);

      this.elText = createEl('span');
      cls(this.elText, 'github__text', 'add');
      addTx(this.elText, 'GitHub');
      insertAlt(this.elText, 'beforeend', this.elRoot);

      this.elIcon = createEl('span');
      cls(this.elIcon, 'github__icon', 'add');
      insertAlt(this.elIcon, 'beforeend', this.elRoot);
    }
  }
  class Scene {
    matrix = null;
    ui = null;
    github = null;
    static height = 7;
    static width = 7;
    static instance = null;
    constructor() {
      const {width, height} = Scene;
      this.matrix = new Matrix({width, height});
      this.ui = new UI({ matrix: this.matrix });
      this.matrix.log();
      this.ui.log();
      this.github = new Github();
    }

    static initStyles() {
      Style.update();
    }

    static init() {
      console.log('Scene init');
      this.instance = new this();
      this.initStyles();
    }
  };

  Style.past(`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
  `);
  Style.add(':root', `
    --bg-common: rgba(255, 255, 255, 1);
    --bg-matrix: hsla(199deg, 100%, 88%, 50%);
    --clr-cell-border: hsla(198deg, 100%, 86%, 1);
    --bg-cell-zero: rgba(255, 255, 255, 0);
    --bg-cell-regular: rgba(255, 255, 255, 1);


    --clr-m-2: hsla(291deg, 100%, 84%, 1);
    --clr-m-3: hsla(238deg, 100%, 76%, 1);
    --clr-m-4: hsla(332deg, 100%, 50%, 1);

    --clr-text: hsla(240deg, 10%, 36%, 1);
    --clr-cell: var(--clr-text);
    --clr-cell-zero: hsla(240deg, 10%, 36%, 0.5);

    --ff-roboto: 'Roboto', sans-serif;

    --rad-ui-layout: 0.23rem;

    --trz-eo-015: /*prop*/ 0.15s 0s ease-out;
    --trz-eo-025: /*prop*/ 0.15s 0s ease-out;
  `);

  Style.add('*', `
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  `);

  Style.add('html, body', `


    height: 100%;
    background-color: var(--bg-common);
  `);


  Style.add('body', `
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-items: center;
    padding: 1rem;

    font-family: var(--ff-roboto);
    font-weight: 400;
    font-size: 18px;
  `);

  Scene.init();

})();
