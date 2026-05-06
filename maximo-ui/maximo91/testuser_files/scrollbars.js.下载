/*
 *	Licensed Materials - Property of IBM
 *	"Restricted Materials of IBM"
 *	5724-U18, 5737-M66
 *	(C) COPYRIGHT IBM CORP. 2021,2025 All Rights Reserved.
 *	US Government Users Restricted Rights - Use, duplication or
 *	disclosure restricted by GSA ADP Schedule Contract with
 *	IBM Corp.
 **/

const CustomScrollableSize = {
  size: 16,
  gap: 2
}

const CustomScrollableDefaultConfiguration = {
  debug: false,
  dragContent: false,
  trackColor: 'transparent',
  barColor: '#999999',
  cornerColor: 'rgb(200,200,200, 0.25)',
  size: CustomScrollableSize.size,
  gap: CustomScrollableSize.gap,
  transparentOpacity: 0.25,
  hoverOpacity: 0.75,
  overflowX: 'auto',
  overflowY: 'auto',
  innerPadding: { //these should double the size setting above
    paddingInlineEnd: `${CustomScrollableSize.size}px`,
    paddingBottom: `${CustomScrollableSize.size}px`,
  },
  disposable: false,
  onScroll: ()=>{
    if(!showingMenu){
      hideAllMenus();
    }
  }
};

let customScrollers = [];

class CustomScrollable{
  constructor(element, configuration){
    this.outerElement = element;
    this.createScrollElement = this.createScrollElement.bind(this);
    this.setScrollStyle = this.setScrollStyle.bind(this);
    this.setupScrollbars = this.setupScrollbars.bind(this);
    this.getConfiguration = this.getConfiguration.bind(this);
    this.setScrollbarVisibilityBasedOnSize = this.setScrollbarVisibilityBasedOnSize.bind(this);
    this.dragScrollBar = this.dragScrollBar.bind(this);
    this.dragContent = this.dragContent.bind(this);
    this.positionScrollbar = this.positionScrollbar.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
    this.moveBarToClick = this.moveBarToClick.bind(this);
    this.setAriaValues = this.setAriaValues.bind(this);
    this.ratio = {
      vertical: 1,
      horizontal: 1
    }
    this.configuration = this.getConfiguration(configuration);
    this.scrollerIndex = customScrollers.length;
    if(!this.configuration.disposable){
      customScrollers.push(this);
    }

    let createCSSClass = (name,rules) => {
      var style = document.createElement('style');
      style.type = 'text/css';
      document.getElementsByTagName('head')[0].appendChild(style);
      if(!(style.sheet||{}).insertRule) {
        (style.styleSheet || style.sheet).addRule(name, rules);
      }
      else {
        style.sheet.insertRule(name+"{"+rules+"}",0);
      }
    }

    createCSSClass('.custom-scroller::-webkit-scrollbar','display: none; overflow: auto');
    createCSSClass('.custom-scroller','-ms-overflow-style: none; scrollbar-width: none; overflow: auto');
    createCSSClass('.custom-scroller-corner:hover','background: rgb(200,200,200) !important;');
    createCSSClass('.custom-scroller-outer[dragging] > .custom-scroller-track, .custom-scroller-outer:hover > .custom-scroller-track',`opacity: ${this.configuration.hoverOpacity} !important`);
    
    createCSSClass('.custom-scroller-outer[data-dragging-vertical=true] .custom-scroller-track[aria-orientation=vertical], .custom-scroller-track[aria-orientation=vertical]:hover',`width: ${this.configuration.size*1.25 + this.configuration.gap*1.25}px !important; transition: width .2s; border-radius: 10px !important;`);
    createCSSClass('.custom-scroller-outer[data-dragging-vertical=true] .custom-scroller-track[aria-orientation=vertical] > div, .custom-scroller-track[aria-orientation=vertical]:hover > div',`width: ${this.configuration.size*1.25}px !important; transition: width .2s; border-radius: 10px !important;`);
    
    createCSSClass('.custom-scroller-outer[data-dragging-horizontal=true] .custom-scroller-track[aria-orientation=horizontal], .custom-scroller-track[aria-orientation=horizontal]:hover',`height: ${this.configuration.size*1.25 + this.configuration.gap*1.25}px !important; transition: height .2s; border-radius: 10px !important;`);
    createCSSClass('.custom-scroller-outer[data-dragging-horizontal=true] .custom-scroller-track[aria-orientation=horizontal] > div, .custom-scroller-track[aria-orientation=horizontal]:hover > div',`height: ${this.configuration.size*1.25}px !important; transition: height .2s; border-radius: 10px !important;`);

    this.RTL = document.body.getAttribute('dir')==='rtl';

    let borderRadius = `${this.configuration.size - (this.configuration.gap*2)}px`;

    this.CSS = {
      outer : {
        overflow: 'hidden',
      },
      horizontal: {
        track: {
          position: 'absolute',
          width: `calc(100% - ${this.configuration.size}px`,
          height: `${this.configuration.size}px`,
          bottom: '0px',
          background: this.configuration.trackColor,
          opacity: this.configuration.transparentOpacity,
          borderRadius: borderRadius,
          overflow: 'hidden',
          zIndex: '2'
        },
        bar: {
          position: 'absolute',
          height: `${this.configuration.size-(this.configuration.gap*2)}px`,
          background: this.configuration.barColor,
          left: '0px',
          margin: `${this.configuration.gap}px`,
          borderRadius: borderRadius
        }
      },
      vertical: {
        track: {
          position: 'absolute',
          height: `calc(100% - ${this.configuration.size}px`,
          width: `${this.configuration.size}px`,
          background: this.configuration.trackColor,
          top: '0',
          opacity: this.configuration.transparentOpacity,
          borderRadius: borderRadius,
          overflow: 'hidden',
          zIndex: '2'
        },
        bar: {
          position: 'absolute',
          width: `${this.configuration.size-(this.configuration.gap*2)}px`,
          background: this.configuration.barColor,
          top: '0',
          margin: `${this.configuration.gap}px`,
          borderRadius: borderRadius
        },
      },
      cover: {
        width: '100%',
        height: '100%',
        top: '0',
        position: 'absolute',
        zIndex: '2',
        display: 'none',
        background: 'rgba(255,255,255,0.05)'
      },
      inner: {
        maxWidth: '100%',
        top: '0px',
        width: '100%',
        height: '100%',
        overflow: 'auto'
      },
      innerChild: {
        /* nothing yet */
      },
      bottomCorner: {
        width: `${this.configuration.size - (this.configuration.gap *2)}px`,
        height: `${this.configuration.size - (this.configuration.gap *2)}px`,
        background: this.configuration.cornerColor,
        position: 'absolute',
        bottom: `${this.configuration.gap}px`,
        opacity: this.configuration.transparentOpacity,
        borderRadius: borderRadius
      }
    }
    this.setupScrollbars();
    this.outerElement.querySelectorAll('*').forEach(descendant => { descendant.addEventListener('dragstart', evt => { evt.preventDefault() } ) });
  }

  getConfiguration(configuration){
    return {...CustomScrollableDefaultConfiguration, ...configuration}
  }

  createScrollElement(type, style, attributes){
    let newElement = document.createElement(type);
    this.setScrollStyle(newElement, style);
    if(attributes){
      Object.keys(attributes).forEach(key=>{
        newElement.setAttribute(key, attributes[key]);
      })
    }
    return newElement;
  }

  setScrollStyle(element, style) {
    Object.assign(element.style, style);
  }

  log(value){
    if(this.configuration.debug){
      console.log(value);
    }
  }

  scrollHandler(evt){
    this.log('scrollHandler');
    try {
        this.configuration.onScroll();
    }
    catch(error){}
    let horizontalPos = this.scrollInner.scrollLeft / this.ratio.horizontal;
    let verticalPos = (this.scrollInner.scrollTop / this.ratio.vertical);

    this.verticalBar.style.top = `${verticalPos}px`;
    
    this.horizontalBar.style[this.RTL?'right':'left'] = `${Math.abs(horizontalPos)}px`;
  }

  setScrollbarVisibilityBasedOnSize(){
    this.log('setScrollbarVisibilityBasedOnSize');
    if(this.configuration.innerPadding){
      this.scrollInnerChild.style.marginInlineEnd = this.verticalTrack.style.display !=='none' ? this.configuration.innerPadding.paddingInlineEnd:'0';
      this.scrollInnerChild.style.marginBottom = this.horizontalTrack.style.display !=='none' ? this.configuration.innerPadding.paddingInlineEnd:'0';
    }

    this.horizontalTrack.style.display = this.configuration.overflowX === 'none' || this.scrollInner.scrollWidth <= this.scrollInner.offsetWidth?'none':'block';
    
    this.verticalTrack.style.display = this.scrollInner.scrollHeight <= this.scrollInner.offsetHeight?'none':'block';
    
    this.ratio.horizontal = 1;
    this.ratio.vertical = 1;
    
    this.outerElement.classList[this.horizontalTrack.style.display==='none'?'remove':'add']('custom-scroller-horiztonal');
    this.outerElement.classList[this.verticalTrack.style.display==='none'?'remove':'add']('custom-scroller-vertical');

    let horizontalBarSize = this.outerElement.offsetWidth - (this.scrollInnerChild.offsetWidth - this.outerElement.offsetWidth);
    let verticalBarSize = this.outerElement.offsetHeight - (this.scrollInnerChild.offsetHeight - this.outerElement.offsetHeight);
        
    this.ratio.horizontal = this.scrollInnerChild.scrollWidth > this.outerElement.offsetWidth ? this.scrollInnerChild.scrollWidth / this.outerElement.offsetWidth : 1;
    horizontalBarSize = this.outerElement.offsetWidth  / this.ratio.horizontal;
    
    this.ratio.vertical = this.scrollInnerChild.scrollHeight > this.outerElement.offsetHeight ? this.scrollInnerChild.scrollHeight / this.outerElement.offsetHeight : 1;
    verticalBarSize = this.outerElement.offsetHeight / this.ratio.vertical;
    
    this.ratio.horizontal = this.scrollInnerChild.scrollWidth > this.outerElement.offsetWidth ? this.scrollInnerChild.scrollWidth / this.outerElement.offsetWidth : 1;
    this.ratio.vertical = this.scrollInnerChild.scrollHeight > this.outerElement.offsetHeight ? this.scrollInnerChild.scrollHeight / this.outerElement.offsetHeight: 1;
    
    this.horizontalBar.style.width = `${horizontalBarSize}px`;
    this.verticalBar.style.height = `${verticalBarSize}px`;

    if(this.horizontalTrack.style.display === 'block' || this.verticalTrack.style.display === 'block'){
      this.scrollInner.addEventListener('scroll', this.scrollHandler);
    }
    else {
      this.scrollInner.removeEventListener('scroll', this.scrollHandler);
    }
    this.setAriaValues();
  }

  dragScrollBar(bar) {
    let scroller = this;
    let offsetX = 0, offsetY = 0;
    let orientation;
    let track;
    bar.addEventListener('mousedown', barMouseDown); 
    function barMouseDown(evt) {
      scroller.outerElement.setAttribute('dragging', 'true');
      orientation = evt.currentTarget.parentElement.getAttribute('aria-orientation');
      scroller.outerElement.setAttribute(`data-dragging-${orientation}`, 'true');
      track = evt.currentTarget.parentElement;
      evt.preventDefault();
      evt.stopPropagation();
      let trackRect = track.getBoundingClientRect();
      offsetX = evt.offsetX + (document.body.dir ==='rtl'?0:trackRect.left);
      offsetY = evt.offsetY + trackRect.top;
      document.addEventListener('mouseup', barMouseUp);
      document.addEventListener('mousemove', barDrag);
    }

    function barDrag(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if(scroller.configuration.overflowX !== 'none' && orientation === 'horizontal'){
        let value = (evt.clientX - offsetX);// * scroller.ratio.horizontal;
        if(document.body.dir ==='rtl'){
          value = scroller.scrollInner.scrollWidth - scroller.horizontalTrack.offsetWidth - value;
        }
        scroller.log('barDrag ' + value);
        scroller.positionScrollbar(bar, value);
      }
      if(scroller.configuration.overflowY !== 'none' && orientation === 'vertical'){
        scroller.positionScrollbar(bar, (evt.clientY - offsetY));
      }
      scroller.setAriaValues();
    }

    function barMouseUp(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      setTimeout(()=>{
        scroller.outerElement.removeAttribute('dragging');
        scroller.outerElement.removeAttribute('data-dragging-horizontal');
        scroller.outerElement.removeAttribute('data-dragging-vertical');
      }, 50);
      scroller.horizontalTrack.style.opacity = scroller.configuration.transparentOpacity;
      scroller.verticalTrack.style.opacity = scroller.configuration.transparentOpacity;
      document.removeEventListener('mouseup', barMouseUp);
      document.removeEventListener('mousemove', barDrag);
    }
  }

  dragContent() {
    if(!this.configuration.dragContent){
      return;
    }
    let scroller = this;
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let top, left;
    let scrolled = false;
    this.scrollInner.addEventListener('mousedown', contentMouseDown, true); 
    let cover = this.createScrollElement('div', this.CSS.cover);
    scroller.outerElement.appendChild(cover);
    function contentMouseDown(evt) {
      pos3 = evt.clientX;
      pos4 = evt.clientY;
      top = parseInt(scroller.verticalBar.style.top);
      left = parseInt(scroller.horizontalBar.style.left);
      document.addEventListener('mouseup', contentMouseUp, true);
      document.addEventListener('mousemove', contentDrag);
    }

    function contentDrag(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      pos1 = pos3 - evt.clientX;
      pos2 = pos4 - evt.clientY;
      if(Math.abs(pos1) > 5 || Math.abs(pos2) > 5){
        scroller.dragging = true;
        scroller.outerElement.setAttribute('dragging', 'true');
        cover.style.display = 'block';
        scroller.scrollInner.classList.add('no-pointer-events');
        if(scroller.configuration.overflowX !== 'none'){
          scroller.positionScrollbar(scroller.horizontalBar, left + pos1);
        }
        if(scroller.configuration.overflowY !== 'none'){
          scroller.positionScrollbar(scroller.verticalBar, top + pos2);
        }
      }
    }

    function contentMouseUp(evt) {
      if(scroller.outerElement.getAttribute('dragging')){
        evt.preventDefault();
        evt.stopPropagation();
      }
      scroller.outerElement.removeAttribute('dragging');
      scroller.horizontalTrack.style.opacity = scroller.configuration.transparentOpacity;
      scroller.verticalTrack.style.opacity = scroller.configuration.transparentOpacity;
      document.removeEventListener('mouseup', contentMouseUp, true);
      document.removeEventListener('mousemove', contentDrag);
      scroller.scrollInner.classList.remove('no-pointer-events');
      cover.style.display = 'none';
    }
  }

  positionScrollbar(bar, location){
    let vertical = bar.parentElement.getAttribute('aria-orientation') === 'vertical';
    let rtl = document.body.dir==='rtl';
    let position = vertical?'top':(rtl?'right':'left');
    let measure = vertical?'Height':'Width';
    if(rtl && bar === this.horizontalBar){
      if(location + bar.offsetWidth > this.horizontalTrack.offsetWidth){
        location = this.horizontalTrack.offsetWidth - bar.offsetWidth;
      }
      if(location < 0){
        location = 0;
      }
    }
    else {
      if(location < 0){
        location = 0;
      }
      else if(location + bar[`offset${measure}`] > bar.parentElement[`offset${measure}`]){
        location = bar.parentElement[`offset${measure}`] - bar[`offset${measure}`];
      }
    }

    bar.style[position] =  `${location}px`;
    let value, offset = 1;
    let add = 0;

    if(bar === this.horizontalBar){
      offset = 1+(this.configuration.size/(bar.parentElement.offsetWidth - bar.offsetWidth));
      value = parseInt(bar.style[document.body.dir==='rtl'?'right':'left']) * offset;
      this.scrollInner.scrollLeft = (document.body.dir==='rtl'?-Math.abs(value):value) * this.ratio.horizontal;
    }
    else {
      offset = 1+ (this.configuration.size/(bar.parentElement.offsetHeight - bar.offsetHeight));
      value = (parseInt(this.verticalBar.style.top)) * offset;
      this.scrollInner.scrollTop = value * this.ratio.vertical;
    }
    
    this.setAriaValues();
  }

  moveBarToClick(evt){
    if(this.outerElement.hasAttribute('dragging')){
      return;
    }
    this.log('moveBarToClick');
    if(evt.target === evt.currentTarget){
      let track = evt.currentTarget;
      let vertical = track.getAttribute('aria-orientation') === 'vertical';
      let bar = track.firstElementChild;
      let position = vertical?'Top':'Left';
      let measure = vertical?'Height':'Width';
      let coordinate = vertical?'Y':'X';
      if(document.body.dir!=='rtl' || vertical){
        this.positionScrollbar(bar, evt[`offset${coordinate}`] - (bar[`offset${measure}`]/2));
      }
      else { //horizontal and rtl
        this.positionScrollbar(bar, track.offsetWidth - evt[`offset${coordinate}`] - (bar[`offset${measure}`]/2));
      }
    }
  }

  setAriaValues(){ //use to set for calculated values. initialize with roles etc... when element is created.
    this.horizontalTrack.setAttribute('aria-valuenow', parseInt(this.horizontalBar.style.left));
    this.horizontalTrack.setAttribute('aria-valuemax', this.horizontalBar.offsetWidth);
    this.verticalTrack.setAttribute('aria-valuenow', parseInt(this.verticalBar.style.top));
    this.verticalTrack.setAttribute('aria-valuemax', this.verticalBar.offsetHeight);
  }

  setupScrollbars(){
    this.log('setupScrollbars');
    if(!this.configuration.disposable && this.outerElement.className.includes('custom-scroller-outer')){
      return;
    }

    this.setScrollStyle(this.outerElement, this.CSS.outer);
    this.outerElement.classList.add('custom-scroller-outer');
    if(!this.outerElement.id){
      this.outerElement.id = `custom_scrollbar_${this.scrollerIndex}`;
    }
    this.scrollInner = this.createScrollElement('div', this.CSS.inner, {class: 'custom-scroller'});
    this.scrollInnerChild = this.createScrollElement('div', this.CSS.innerChild);

    this.scrollInner.setAttribute('tabindex', '-1');

    Array.from(this.outerElement.childNodes).forEach(child => {
      this.scrollInnerChild.appendChild(child);
    });
    this.scrollInner.appendChild(this.scrollInnerChild);
    this.scrollInner.style.maxHeight = this.configuration.maxHeight || ''
    this.outerElement.appendChild(this.scrollInner);
    
    this.verticalTrack = this.createScrollElement('div', this.CSS.vertical.track, 
    {
      role: 'scrollbar',
      'aria-controls': this.outerElement.id,
      'aria-orientation': 'vertical',
      'aria-valuemax': '100', //calculated later
      'aria-valuemin': '0',
      'aria-valuenow': '0', //set as we scroll
      class: 'custom-scroller-track'
    });
    this.verticalTrack.style[document.body.dir==='rtl'?'left':'right'] = '0px';
    this.verticalBar = this.createScrollElement('div', this.CSS.vertical.bar);
    this.verticalTrack.appendChild(this.verticalBar);
    this.outerElement.appendChild(this.verticalTrack);

    this.horizontalTrack = this.createScrollElement('div', this.CSS.horizontal.track, 
    {
      role: 'scrollbar',
      'aria-controls': this.outerElement.id,
      'aria-orientation': 'horizontal',
      'aria-valuemax': '100', //calculated later
      'aria-valuemin': '0',
      'aria-valuenow': '0', //set as we scroll
      class: 'custom-scroller-track'
    });
    this.horizontalBar = this.createScrollElement('div', this.CSS.horizontal.bar);
    this.horizontalBar.style[document.body.dir==='rtl'?'right':'left'] = '0px';
    this.horizontalBar.style[document.body.dir==='rtl'?'left':'right']= 'auto';
    this.horizontalTrack.appendChild(this.horizontalBar);
    this.outerElement.appendChild(this.horizontalTrack);

    this.bottomCorner = this.createScrollElement('div', this.CSS.bottomCorner, {class: 'custom-scroller-corner'});
    this.bottomCorner.style[document.body.dir==='rtl'?'left':'right'] = `${this.configuration.gap}px`;
    this.outerElement.appendChild(this.bottomCorner);
    this.bottomCorner.addEventListener('click', ()=>{
      scroller.scrollInner.scrollLeft = scroller.scrollInner.scrollWidth;
      scroller.scrollInner.scrollTop = scroller.scrollInner.scrollHeight;
    });

    this.dragScrollBar(this.verticalBar);
    this.dragScrollBar(this.horizontalBar);
    
    this.dragContent();
    
    this.horizontalTrack.addEventListener('click', this.moveBarToClick);
    this.verticalTrack.addEventListener('click', this.moveBarToClick);

  	// DT457642: This code adds a scroll event listener to the main content scroller that closes all detail menus on page scroll.
  	// Exception is if user is on list page and the table header is docked.
  	let dockedTable = document.querySelector('.tblListView');  	
	let mainScroller = dojo.byId('SystemNavAppContent-sc_div');
	if(!mainScroller){
		mainScroller = dojo.byId('SystemNavAppContentg-sc_div');
	}
	if(mainScroller){
		let scroller = mainScroller.querySelector('.custom-scroller');
		if (scroller) {
 			if (dockedTable) {
				scroller.removeEventListener('scroll',hideAllMenusNF);
			}
			else {
				scroller.addEventListener('scroll',hideAllMenusNF);
			}
		}
	}
    
    this.setScrollbarVisibilityBasedOnSize();

    let scroller = this;
    this.resizeObserver = new ResizeObserver(entries => {
      setTimeout(()=>{
        scroller.setScrollbarVisibilityBasedOnSize();
      },50);
    });

    setTimeout(()=>{
      this.resizeObserver.observe(this.scrollInnerChild);
      this.resizeObserver.observe(this.outerElement);
    })
  }
}
