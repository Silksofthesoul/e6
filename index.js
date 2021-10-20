(_ => {
  console.clear();
  document.body.innerHTML = '';
  // document.head.innerHTML = '';

  const random = _ => Math.random();
  const floor = _ => Math.floor(_);

  const rndMinMaxInt = (min, max) => floor(random() * (max - min + 1)) + min;
  const rndCoinBool = _ => (~~floor(random() * 2) === 0);
  const rndFromArray = arr => arr[rndMinMaxInt(0, arr.length - 1)];

  const createExtra = eq => eq.map(({val, probQ}) => {
    let res = [];
    for(let i =0; i < probQ; i++) res.push(val);
    return res;
   });
  const extraQ = [
    {val: 2, probQ: 10},
    {val: 4, probQ: 5},
    {val: 6, probQ: 2},
  ];
  const extra = createExtra(extraQ).flat();

  const createEl = type => document.createElement(type);
  const addEl = (parent, child) => parent.appendChild(child);
  const addTx = (el, text) => el.innerText = text;
  const clsAdd = (el, cls) => el.classList.add(cls);

  const createStyle = _ => {
    let elStyle = createEl('style');
    let style = `
    body, body *{ box-sizing: border-box; font-family: sans-serif; }
    .github {
      position: fixed;
      display: block;
      bottom: 1rem;
      right: 1rem;
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4PSIwcHgiIHk9IjBweCIgaGVpZ2h0PSIzMiIgd2lkdGg9IjMyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNiAxNjsiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOCAwQzMuNTggMCAwIDMuNTggMCA4YzAgMy41NCAyLjI5IDYuNTMgNS40NyA3LjU5LjQuMDcuNTUtLjE3LjU1LS4zOCAwLS4xOS0uMDEtLjgyLS4wMS0xLjQ5LTIuMDEuMzctMi41My0uNDktMi42OS0uOTQtLjA5LS4yMy0uNDgtLjk0LS44Mi0xLjEzLS4yOC0uMTUtLjY4LS41Mi0uMDEtLjUzLjYzLS4wMSAxLjA4LjU4IDEuMjMuODIuNzIgMS4yMSAxLjg3Ljg3IDIuMzMuNjYuMDctLjUyLjI4LS44Ny41MS0xLjA3LTEuNzgtLjItMy42NC0uODktMy42NC0zLjk1IDAtLjg3LjMxLTEuNTkuODItMi4xNS0uMDgtLjItLjM2LTEuMDIuMDgtMi4xMiAwIDAgLjY3LS4yMSAyLjIuODIuNjQtLjE4IDEuMzItLjI3IDItLjI3LjY4IDAgMS4zNi4wOSAyIC4yNyAxLjUzLTEuMDQgMi4yLS44MiAyLjItLjgyLjQ0IDEuMS4xNiAxLjkyLjA4IDIuMTIuNTEuNTYuODIgMS4yNy44MiAyLjE1IDAgMy4wNy0xLjg3IDMuNzUtMy42NSAzLjk1LjI5LjI1LjU0LjczLjU0IDEuNDggMCAxLjA3LS4wMSAxLjkzLS4wMSAyLjIgMCAuMjEuMTUuNDYuNTUuMzhBOC4wMTMgOC4wMTMgMCAwMDE2IDhjMC00LjQyLTMuNTgtOC04LTh6Ij48L3BhdGg+PC9zdmc+DQo=');
      background-repeat: no-repeat;
      background-position: center right;
      height: 32px;
      padding-right: calc(32px + 0.5rem);
      padding-top: 0.5rem;
      color: rgba(0,0,0,0.7);
      opacity: 0.3;
      transition: color 0.25s 0s ease-out, opacity 0.45s 0.45s ease-out;
    }
    .github:hover{
      color: rgba(0,0,0,1);
      opacity: 1;
    }
    .elExtraWrapper { opacity: 0.3; }
    .elExtraWrapper:hover { opacity: 1; }
    .checkboxWrapper, .buttonWrapper, .selectorWrapper, .inputWrapper {
      font-size: 1.3rem;
      padding-top: 1rem;
      padding-left: 0.6rem;
    }
    .inputWrapper label { padding-right: 0.5rem; }
    .checkboxWrapper:nth-of-type(3) { margin-left: auto; }
    .elExtraWrapper {
      width: clamp(320px, 100%, 40vw);
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: center;
    }

    .info { font-size: 1.3rem; padding-top: 1rem; opacity: 0.3; }
    .elTableWrapper {
      width: clamp(320px, 100%, 40vw);
      margin: 6vh auto;
    }
    .table {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      grid-template-rows: repeat(7, minmax(0, 1fr));
      gap: 1rem;
      font-family: monospace;
    }
    .td {
      border: 1px dotted black;
      text-align: center;
      padding: 0.25rem;
      aspect-ratio: 1;
      -font-size: 1.5rem;
      font-size: calc(14px + (26 - 14) * ((100vw - 320px) / (1920 - 320)));
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .extra {
      background-color: rgba(255, 0, 0, 0.1);
      border-style: solid;
    }
    .extra-2 {
      background-color: rgba(255, 0, 0, 0.3);
      border-width: 2px;
    }
    .extra-4 {
      background-color: rgba(255, 0, 0, 0.5);
      border-width: 3px;
    }
    .extra-6 {
      background-color: rgba(255, 0, 0, 0.7);
      border-width: 5px;
      color: #fff;
    }
    @media(max-width: 1100px) {
      .td { border-color: #ccc; }
      .extra-6{ color: #000; }
      .checkboxWrapper:nth-of-type(3) { margin-left: unset; }
      .checkboxWrapper, .buttonWrapper, .selectorWrapper, .inputWrapper {
        font-size: 1.3rem;
        padding-top: 1rem;
        padding-left: 0rem;
      }
      .elExtraWrapper{
        flex-direction: column;
        align-content: flex-start;
      }
      .buttonWrapper{ order: -1; }
    }
    `
    .replace(/\n/gim, '')
    .replace(/\s+/gim, ' ')
    .replace(/\} \}/gim, '}}')
    .replace(/\} \./gim, '}.')
    .replace(/\; \}/gim, '}')
    .replace(/ \{/gim, '{')
    .replace(/\{ /gim, '{')
    .replace(/\: /gim, ':')
    .replace(/\; /gim, ';')
    .replace(/\, /gim, ',');
    addTx(elStyle, style);
    addEl(document.head, elStyle);
  };

  const genRegularTable = num => {
    let [sum, table] = [1, []];
    for(let i = 0; i <= num; i++) {
      let cur = i === 0 ? 1 : i;
      sum = sum + cur;
      table.push(sum);
    }
    return {table: co(table), sum}
  };
  const co = o => JSON.parse(JSON.stringify(o));
  const genSumTable = (num) => {
    let [sum, table] = [0, []];
    for(let i = 0; i <= num; i++) {
      let val = i+1;
      sum += val;
      table.push(val);
    }
    return { table: co(table), sum }
  };
  let context = {
    sum: 0,
    table: 0,
    tableSum: 0,
    extraSum: 0
  };

  let settings = {
    isShuffle: true,
    isApplyExtra: true,

    genModes: ['sum', 'regular'],
    genMode: 1,
    cutadd: 0,

    elTable: null,
    elTableWrapper: null,
    elExtraWrapper: null,
    elInfo: null,
    elOrder: null,
    elExtra: null,
    elSelect: null,
    elButton: null,
    elCut: null,

    timeout: 100,
    timer: null,
    isPause: null,

    count: 48,
  }

  const createWrappers = _ => {
    settings.elTableWrapper = createEl('div');
    settings.elExtraWrapper = createEl('div');
    settings.elTable = createEl('div');
    clsAdd(settings.elTable, 'table');
    clsAdd(settings.elTableWrapper, 'elTableWrapper');
    clsAdd(settings.elExtraWrapper, 'elExtraWrapper');
    addEl(settings.elTableWrapper, settings.elTable);
    addEl(settings.elTableWrapper, settings.elExtraWrapper);
    addEl(document.body, settings.elTableWrapper);

  };

  const ffs = num => {
    const { genModes, genMode } = settings;

    let tableSum = 0
    let extraSum = 0;
    let rowLength = 7;

    const mode = settings.elSelect ? settings.elSelect.value : genModes[genMode];

    let { sum, table } = mode === 'sum' ? genSumTable(num) : genRegularTable(num);

    const isShuffle = settings.elOrder ? !settings.elOrder.checked : settings.isShuffle;
    if(isShuffle) table.sort(() => random() - 0.5);

    let cutadd = settings.elCut ? parseInt(settings.elCut.value) : parseInt(settings.cutadd);

    for(let i = 0; i < table.length; i++) {
      let item = table[i];


      let elCell = createEl('div');
      let elCellInnerWrapper = createEl('span');
      clsAdd(elCell, 'td');

      const isExtra = settings.elExtra ? settings.elExtra.checked : settings.isApplyExtra;

      if(isExtra) {
        if(rndCoinBool() && rndCoinBool()) {
          const q = rndFromArray(extra);
          clsAdd(elCell, 'extra');
          clsAdd(elCell, `extra-${q}`);
          item = item * q;
        }
      }

      if(cutadd !== 0 && item + cutadd > 0) item += cutadd;

      extraSum += item;

      addTx(elCellInnerWrapper, item);
      addEl(elCell, elCellInnerWrapper);
      addEl(settings.elTable, elCell);
    }

    tableSum = table.reduce((s, c) => (s + c), 0);

    context.sum = sum;
    context.table = table;
    context.tableSum = tableSum;
    context.extraSum = extraSum;
    return {sum, table, tableSum, extraSum};
  };

  const createInfoString = infoText => {
    const elInfo = createEl('div');
    clsAdd(elInfo, 'info');
    addTx(elInfo, `Σ ${infoText}`);
    addEl(settings.elExtraWrapper, elInfo);

    settings.elInfo = elInfo;
  };
  const createCut = _ => {
        const elWrapper = createEl('div');
    clsAdd(elWrapper, 'inputWrapper');

    const elLable = createEl('label');
    elLable.setAttribute('for', 'cut');
    addTx(elLable, 'cut/add');

    const elInput = createEl('input');
    elInput.setAttribute('type', 'text');
    elInput.setAttribute('value', settings.cutadd);

    elInput.setAttribute('id', 'cut');

    addEl(elWrapper, elLable);
    addEl(elWrapper, elInput);
    addEl(settings.elExtraWrapper, elWrapper);
    elInput.addEventListener('input', _ => {
      elInput.value = elInput.value
      .replace(/[^\-0-9]/gim, '')
      .replace(/\-0/gim, '-')
      .replace(/(^0)(\d)/gim, '$2');
    })

    settings.elCut = elInput;
  };
  const createCheckboxShuffle = _ => {
    const elWrapper = createEl('div');
    clsAdd(elWrapper, 'checkboxWrapper');

    const elLable = createEl('label');
    elLable.setAttribute('for', 'shuffle');
    addTx(elLable, 'in order');

    const elInput = createEl('input');
    elInput.setAttribute('type', 'checkbox');
    console.log(settings.isShuffle)
    if(!settings.isShuffle) elInput.setAttribute('checked', true);

    elInput.setAttribute('id', 'shuffle');

    addEl(elWrapper, elLable);
    addEl(elWrapper, elInput);
    addEl(settings.elExtraWrapper, elWrapper);

    settings.elOrder = elInput;
  };

  const createCheckboxExtra = _ => {
    const elWrapper = createEl('div');
    clsAdd(elWrapper, 'checkboxWrapper');

    const elLable = createEl('label');
    elLable.setAttribute('for', 'extra');
    addTx(elLable, 'extra');

    const elInput = createEl('input');
    elInput.setAttribute('type', 'checkbox');
    if(settings.isApplyExtra) elInput.setAttribute('checked', true);
    elInput.setAttribute('id', 'extra');

    addEl(elWrapper, elLable);
    addEl(elWrapper, elInput);
    addEl(settings.elExtraWrapper, elWrapper);

    settings.elExtra = elInput;
  };

  const createModeSelector = _ => {
    const elWrapper = createEl('div');
    clsAdd(elWrapper, 'selectorWrapper');

    const elSelect = createEl('select');

    settings.genModes.forEach(item => {
      let opt = createEl('option');
      addTx(opt, item);
      if(item === settings.genModes[settings.genMode]) opt.setAttribute('selected', true);
      addEl(elSelect, opt);
    });

    addEl(elWrapper, elSelect);
    addEl(settings.elExtraWrapper, elWrapper);

    settings.elSelect = elSelect;
  };

  const createGetButton = _ => {
    const elWrapper = createEl('div');
    clsAdd(elWrapper, 'buttonWrapper');

    const elButton = createEl('button');
    addTx(elButton, 'stop');

    addEl(elWrapper, elButton);
    addEl(settings.elExtraWrapper, elWrapper);
    elButton.addEventListener('click', _ => {
      if(settings.isPause) {
        settings.isPause = false;
        addTx(elButton, 'stop');
      } else {
        settings.isPause = true;
        addTx(elButton, 'play');
      }
    });

    settings.elButton = elButton;
  };
  const createGithub = _ => {

    const elLink = createEl('a');
    elLink.classList.add('github');
    elLink.setAttribute('href', 'https://github.com/Silksofthesoul/e6')
    elLink.setAttribute('target', '_blank');
    addTx(elLink, 'GitHub');
    addEl(document.body, elLink);
  };

  const loop = _ => {
    if(!settings.isPause) {
      addTx(settings.elTable, ``)
      addTx(settings.elInfo, `Σ ${context.extraSum}`)
      ffs(settings.count);
    }
    settings.timer = setTimeout(loop, settings.timeout);
  };

  createStyle();
  createWrappers();
  createInfoString(context.extraSum);
  createCut();
  createCheckboxShuffle();
  createCheckboxExtra();
  createModeSelector();
  createGetButton();
  createGithub();
  loop();
})();
