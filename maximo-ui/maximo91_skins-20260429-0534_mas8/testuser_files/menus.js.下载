/*
 * Licensed Materials - Property of IBM
 * "Restricted Materials of IBM"
 * 5724-U18, 5737-M66
 * (C) COPYRIGHT IBM CORP. 2013,2025 All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 *
 */


var menuWorking = false;
var showingMenu = false;
var mock = ''; // use the following to mock menus   '<b style="color: #999">MOCKED Lorem ipsum dolor sit amet.</b>';

function MenuController(id,next,previous,search,searchFor)
{
	if(id=="shared"){
		require(["dojo/topic"], function(topic){
		    topic.subscribe("request/"+REQUESTTYPE_SYNC, function(){
		        hideAllMenus(false);
		    });
		});
	}
	
	this.resources = {	"next"		: next,
			"previous"	: previous,
			"search" 	: search,
			"searchfor" : searchFor
	};

	this.settings = {	
			"scroll": true
	};

	this.typeahead = { "settings" : { 	"minimumchars"	: 0,
		"usepages"		: true,
		"showsearch"	: true,
		"menulength"	: 8,
		"separator"		: " : ",
		"shownextcount"	: false,
		"showprevcount"	: false,
		"instantfetch"	: false
		}
	};

	this.topMenu;
	this.RTL=false;
	this.holder = document.getElementById('menuholdertd');
	this.cache = null;
	this.filterDataStore = null;
	this.menuIndex = topLevelMenus.length;
	this.menutimer = null;
	this.id = id;
	topLevelMenus[this.id] = this;
	
	/**
	 * Used to build a menu based on JSON Example struct is: { "id":"mainmenu",
	 * "items":[ {"id":"menuitem0","text":"menuitem
	 * 0","image":"modimg_plans.gif","event":"","sub":""},
	 * {"id":"menuitem1","text":"menuitem
	 * 1","image":"modimg_pm.gif","event":"","sub": {"id":"sub1","items":[
	 * {"id":"submenuitem0","text":"menuitem
	 * 0","image":"","event":"","sub":"sub2"},
	 * {"id":"submenuitem1","text":"menuitem
	 * 1","image":"","event":"","sub":""}}, {"id":"menuitem2","text":"menuitem
	 * 2","image":"modimg_problem.gif","event":"","sub":""} ]} ]}
	 */
	this.buildMenu=function(target,menuDef,useTheme){ //theme ['dark','light']
    let theme = 'maximo-menu-light';
    if(useTheme){
      theme = `maximo-menu-${useTheme}`;
    }
    return this.buildMenuLevel(0,target,menuDef, theme, null);
	};
	
	this.buildMenuLevel=function(level,target,menuDef,theme,parentItem){
    if(!this.holder)
			return;
		if(level>0 && this.staticMenu) {
			this.holder = document.body;
		}
			
		if(menuDef.id == "0") {
			menuDef.id = target + "_menu";
		}
    if(window.headerMenuPosition){
      theme = 'maximo-menu-dark';
    }
	 	this.baseClassName = (menuDef.baseClassName)? menuDef.baseClassName : menuDef.type===1?"menus ns_goto":menuDef.type===5?"menus ns_report":"menus";
	 	this.hasSubClassName = (menuDef.hasSubClassName)? menuDef.hasSubClassName : "submenu";
	 	this.subClassName = (menuDef.subClassName)? menuDef.subClassName : "menus";
	 	this.staticMenu = (menuDef.staticMenu)? menuDef.staticMenu : false;
		this.RTL=(document.body.dir=="rtl");
		var menuId = menuDef.id;
		var items = menuDef.items;
		if(undef(items) || items.length==0)
			return;
		var typeAheadMenu = (menuDef.typeahead==true);
		if(menuDef && menuDef.items && menuDef.items[0] && 'recentApps' === menuDef.items[0].id){
			menuDef.items.shift();
		}
		if(menuDef && menuDef.id === 'menu0' && menuDef.items){
			menuDef.items.some((item, index, arr) => {
				if(item.id === 'SEARCHMORE_OPTION') {
					arr.splice(index, 1);
				}
			});
		}
		if(menuDef.mxevent=="changeapp" && level == 0 && MAXRECENTAPPS > 0) {
			var recentAppList = getRecentAppList();
			if(recentAppList && recentAppList.length>0) {
				menuDef.addedRecent = true;
				var recentItem = {"id":"recentApps","className":"navSubmenu recentAppsMenuItem","image":"Left_Nav_white/modimg_recentapps.svg","border":false,"text":RECENTAPPTEXT,searchable: false,"sub":{"id":"recentAppList","mxevent":menuDef.mxevent,"items":recentAppList}};
				menuDef.items[0]["border"]=true;
				menuDef.items.splice(0,0,recentItem);
			}
		}
		var menu = document.createElement("ul");
		var objs = document.getElementsByTagName("OBJECT");
		dojo.attr(menu, 
				{  }
			);
		if(this.staticMenu) {
	 		dojo.connect(this.holder.parentNode, "mousedown", this.holder.parentNode, (evt)=>{
        		if(!evt.target.classList.contains('menus')){
          			hideAllMenusNF()
        		}
     		 });
			//Incase inside iframe close menu on Top level mouse down 
			if(top)	{
        try {
				  dojo.connect(top, "mousedown", this.holder.parentNode, hideAllMenusNF);
        }
        catch(error){
          dojo.connect(window, "mousedown", this.holder.parentNode, hideAllMenusNF);
        }
			}
	 		dojo.connect(this.holder.parentNode, "scroll", this.holder.parentNode, hideAllMenusNF);
	 		dojo.attr(menu,{"static":"true"});	
		}
		dojo.attr(menu,{
			'overlay': menuDef.overlay,
			'target': target,
			'topOffset': menuDef.topOffset
		});
		if(!undef(menuDef.prevIndex)) {
			menu.setAttribute("prevIndex", menuDef.prevIndex);
		}
		if(!undef(menuDef.nextIndex)) {
			menu.setAttribute("nextIndex", menuDef.nextIndex);
		}
		dojo.attr(menu, {
			"role":"menu",
			"menutype":menuDef.type,
			"id":menuId,
			"level":level,
			"static":this.staticMenu,
			"aria-labelledby":menuDef.labelledBy
		});
		if(level==0) {
			this.trueTop = menuId;	
		}
		menu.setAttribute("role","menu");
		if(menuDef.issearch){
			menu.setAttribute("issearch",true);
		}
		menu.setAttribute("menutype",menuDef.type);
		menu.setAttribute("id",menuId);
		menu.setAttribute("level",level);
		if(!undef(menuDef.openat)) {
			dojo.attr(menu, {"openat":menuDef.openat});
		}
		var typeAheadMenu=(menuDef.typeahead==true);
		if(typeAheadMenu) {
			dojo.attr(menu, {"typeahead":"true"})
		}
		var firstSub;
		if(menuDef.overflow){
			items.push(menuDef.overflow);
		}
		for(var i=0;i<items.length;i++)
		{
			var item = items[i];
			//If a sub us expected, but has no items, don't bother with this item
			if(!undef(item.sub) && (undef(item.sub.items) || item.sub.items.length==0)) {
				continue;
			}
			var menuItem = document.createElement("li");
      if((item.eventvalue && item.eventvalue.toLowerCase() === APPID.toLowerCase()) && (item.event === 'changeapp' || menuDef.mxevent === 'changeapp')){
        item.className += ' menu-item-highlight';
      }
			menuItem.setAttribute("role","none");
      if(item.searchable===false){
        menuItem.setAttribute('data-no-search','true');
      }
      if(item.content){
        if(item.className) {
					menuItem.className = item.className;
				}
        var menuImage = document.createElement("img");
        menuImage.className="menuimg";
        menuImage.setAttribute("alt","");
        menuImage.src=IMAGE_PATH+'modimg_analytics.png';
        menuItem.appendChild(menuImage);
        menuItem.appendChild(item.content);
        menu.appendChild(menuItem);
        continue;
      }
			var menuItemId = ""
			if (!undef(item.value)){
				item.value = item.value;
			}
			if(!undef(item.sub) || (!item.event && !menuDef.mxevent)){
				menuItemId = menu.id+"_"+(item.id?item.id:item.value);
			}
			else {
				menuItemId = menu.id+"_"+(item.event?item.event:menuDef.mxevent)+"_"+item.eventvalue;
			}
			dojo.attr(menuItem,{"draggable":"false"});
			dojo.connect(menuItem, "keydown", this, this._menuKey);			
			var itemText;
			var menuItemA =  document.createElement("a");
			var tabIndex = -1;
			if(i==0){//} || i==items.length-1){
				tabIndex = 0;
			}
			var menuItemAId = menuItemId+"_a";
			this.applyPadding(menuItemA, item.padding);
			dojo.attr(menuItemA,{"id":menuItemAId,"role":"menuitem","tabindex":tabIndex, "draggable":"false","clickId":item.clickId});
			var that = this;
			dojo.connect(menuItemA, "focus", this, function(e){
				var menu = event.currentTarget.closest('UL');
				if(menu.getAttribute('level') === '0'){
					setCurrentfocusFromId(null, event.currentTarget.id);
				}
				that._menuItemFocus(getSourceElement(e));
			});
			var disabled = (!undef(item.disabled) && (item.disabled==true || item.disabled=="true"));
			var href = "javascript: //"+item.text;
			if(!disabled && (undef(item.sub) || typeAheadMenu))
			{
				if(!typeAheadMenu && !item.value && !this.staticMenu) {
					item.value=item.id;
				}
				if(undef(item.targetId)) {
					item.target=target;
				}
				else {
					item.target=item.targetId;
				}
				if(item.mxevent)
				{
					item.event = item.mxevent;
					dojo.attr(menuItemA,{"eventType":item.event});
					this.addEventStateHandler(menuItem);
				}
				else if(item.event=='changeapp' && (item.apptype=='APP' || item.apptype=='WC'))
				{
					item.mxevent=item.event;
					item.value=item.appname;
					dojo.attr(menuItemA,{"eventType":item.event});
					this.addEventStateHandler(menuItem);
				}
				else
				{
					if(menuDef.mxevent)
					{
						item.event=menuDef.mxevent;
					}
					else
					{
						item.event = "click";
					}
				}
				if(item.eventvalue) {
					item.value = item.eventvalue;
				}
				href = "javascript: //"+item.text;
				menuItem.setAttribute("eventtype",item.event);
				this.addEventStateHandler(menuItem);
				dojo.attr(menuItem,{"anchorId":menuItemAId})
				var menuController = this;
				require(["dojo/on"], function(on){
					on(menuItemA, 'keydown', function(event){
						if(!hasKeyCode(event,'KEYCODE_SPACEBAR|KEYCODE_ENTER')){
							return;
						}
						this.click();
						cancelEvent(event);
					});
				});
			}
			menuItemA.setAttribute("href",href);
			let menuInfo = {
				menu: topLevelMenus[this.id],
				menuClick:  menuDef.menuClick || topLevelMenus[this.id].menuClick,
				menuItemId: menuItemId,
				menuItem: item,
				menuItemAId: menuItemAId
			}			  
			menuItemA.addEventListener('click', (event)=>{
				if(menuInfo.menuItemAId){
					if(SCREENREADER && this.isNavItem(menuInfo.menuItemAId)){ 
						setCurrentfocusFromId(event,menuInfo.menuItemId);
					};
			
					if(typeof menuInfo.menuClick === 'string') {
						menuInfo.menuClick = window[menuInfo.menuClick];
					}
					if(typeAheadMenu) {
						menuInfo.menu.menuClick(menuInfo.menuItem, menuInfo.menu.id);
					}
					else {
						menuInfo.menuClick(menuInfo.menuItem, menuInfo.menu.id);
					}
					if(!typeAheadMenu && (!menuInfo.menuItem.sub || menuInfo.menuItem.sub.length===0)){
						let topMenu = dojo.byId(menus.trueTop);
						if(topMenu) {
							menus._hideMenu(topMenu);
						}
					}
				}
			});
      menuItem.appendChild(menuItemA);
			menu.appendChild(menuItem);

			dojo.attr(menuItem,{"id":menuItemId});
      let mainDiv = document.createElement('div');

      mainDiv.style.paddingInlineStart = `${(level) * 10}px`;
      mainDiv.style.overflow='hidden';
      mainDiv.style.textOverflow='ellipsis';
      menuItemA.appendChild(mainDiv);
			if(typeAheadMenu)
			{
				itemText=item.display;

				if(i==menuDef.matchedRow) {
					appendClass(menuItem, "tadefault");
				}
				menuItem.style.padding="0px 4px 0px 4px";
				menuItem.style.lineHeight="18px";
			}
			else
			{
				// the id?
				itemText=item.text;
				if(item.image!=""){// && !menuDef.issearch){
					var menuImage = document.createElement("img");
					menuImage.className="menuimg";
					menuImage.setAttribute("alt","");
					if(undef(item.image))
					{
						menuImage.src=IMAGE_PATH+"menus/blank.gif";
					}
					else
					{
						menuImage.src=IMAGE_PATH+item.image;
					}
					mainDiv.appendChild(menuImage);
				}
				if(!undef(item.sub))
				{
          menuItem.setAttribute('menu-sub-expanded', 'false');
					menuItemA.setAttribute("aria-haspopup","true");
					menuItemA.setAttribute("aria-expanded","false");
					menuItem.className = this.hasSubClassName;
					if(!item.sub.modifiedId){
						item.sub.id = menuId + "_"+ item.id+"_sub";
						item.sub.modifiedId = true;
					}
					dojo.attr(menuItem,{"subid":item.sub.id});
			 	 	item.sub.baseClassName = this.baseClassName;
			 	 	item.sub.hasSubClassName = this.hasSubClassName;
			 	 	item.sub.subClassName = this.subClassName;
			 	 	item.sub.staticMenu = this.staticMenu;
			 	 	item.sub.labelledBy = menuItem.id;
					var sub = this.buildMenuLevel(level+1,target,item.sub, theme, menuItem);
					if(undef(sub)) { //If the sub doesn't build for any reason we should remove the menu item. 
						menu.removeChild(menuItem);
					}
					if(!firstSub) {
						firstSub = sub;
					}
				}
				if(item.className) {
					menuItem.className = item.className  + (menuDef.issearch?' dojoEllipsis':'');
				}
				menuItem.className += (menuDef.issearch?' dojoxEllipsis':'');
				if(level < 1 && this.staticMenu) {
					menuItemA.className += " dojoxEllipsis";
				}
			}
			var tNode = document.createElement("SPAN");
			if(item.overflow){
				menuItem.className = menuItem.className + " menuOverflow";
			}
			mainDiv.appendChild(tNode);

			if(item.innerClassName) {
				tNode.className = item.className;
			}
			if ((typeAheadMenu) || (itemText=="&nbsp;")) {
				tNode.innerHTML = itemText + mock;
			} 
			else 
			{
				dojo.require("dojox.html.entities");
        
        tNode.innerHTML = this.applyPadding(itemText, item.padding) + mock;
				var accessKey = item['accesskey'];
				if(!accessKey){
					accessKey="";
				}
				if(this.staticMenu){
		          if(item.event && accessKey){
		        	  var keyTarget = menuItemAId;
		        	  addLoadMethod("addHotKey('"+accessKey+"','"+keyTarget+"','click');");
		          }
				  if (SCREENREADER || !(item.event && accessKey)) {
			          	menuItemA.setAttribute('title', itemText);
				  }
				}
			}
			tNode.id = menuItemA.id+"_tnode";
			if(item.border==true || item.border=="true") {
				menuItem.className+=" menuborder";
			}
			if(disabled)
			{
				menuItemA.className="off";
				menuItemA.setAttribute("aria-disabled","true");
				dojo.attr(menuItem,{"active":"false"});
			}
      addListener(menuItem, "click", function(event) { 
        menus._showSub(event); 
        menus._menuItemFocus(dojo.attr(this, "anchorId"));
      } , false);
			dojo.connect(menuItem, "mouseover", this, function(event){ 
					this.stopHideMenuTimer(); 
					stopBubble(event);
				}
			);
      if(!undef(item.sub)){
        let subImage = document.createElement('img');
        subImage.src= `menu_sub${theme==='maximo-menu-dark'?'_dark':''}.svg`;
        subImage.className='menu-sub-image';
        menuItemA.appendChild(subImage);
		subImage.setAttribute("aria-hidden","true");
      }
		}
		menu.style.display="none";
		dojo.connect(menu, "mousedown", this, function(event){stopBubble(event)});
		dojo.connect(menu, "keydown", this,  function(event){stopBubble(event)});
		dojo.connect(menu, "keyup", this,  function(event){stopBubble(event)});
		dojo.connect(menu, "click", this,  function(event){stopBubble(event)});
		menu.className = `${this.baseClassName} ${theme}`;
		if(level > 0) {
			menu.className = `${this.subClassName} ${theme}`;
    }
    else if(!this.staticMenu){
	    menu.style.position="absolute";
    }
		if(typeAheadMenu) {
			menu.style.background="#fbfbfb";
		}

    if(level === 0){
        let menuDiv = document.createElement('div');
        menu.setAttribute('data-menu-div', 'true');
        menuDiv.appendChild(menu);
        this.holder.appendChild(menuDiv);
    }
    else {
        this.holder.appendChild(menu);
    }
		
		if(level==0){
			this.moveSubsUnderParents(menu);
		}
		
		return menu;
	};


  this.hideSearch = function(top){
    if(CLEAR_SEARCH){
      let searchField = dojo.byId('nav_search_field');
      if(searchField.classList.contains('with-value')){
        CLEAR_SEARCH(searchField);
      }
    }
    if(!top){
      top = document.body;
    }
    let searchResults = top.querySelectorAll('.menu-search-results');
    searchResults.forEach(search => {
      if(search){
        search.innerHTML='';
      }

      let menuHolder = dojo.byId(search.getAttribute('data-menu-holder-id'));
      if(menuHolder){
        menuHolder.style.display='initial';
        let searchField = dojo.byId(search.getAttribute('data-search-input-id'));
        if(searchField){
          searchField.value = '';
        }
      }
    })
    
  }

  this.collapseAll = function(top){
    if(!top){
      top = document.body;
    }
    top.querySelectorAll('UL[role="menu"]').forEach(menu=>{
      if(!menu.classList.contains('searchMenu')){
        this._hideMenu(menu);
      }
    })
  }

	this.isNavItem = function(id){
		var UL = document.getElementById(id).closest('UL');
		return UL && UL.className.includes('navMenus');
	} 
	
	this.moveSubsUnderParents = function(menu){
		var parents = dojo.query(menu, 'li[subid]');
		var menuController = this;
		dojo.forEach(dojo.query('li[subid]', menu), function(item) {
			var sub = dojo.byId(dojo.attr(item,'subid'));
			item.appendChild(sub);
			menuController.moveSubsUnderParents(sub);
		});
	};
	
	this.addEventStateHandler = function(menuItem) {
		dojo.subscribe("appeventstate", null, function(message){
			if(message.eventtype != dojo.attr(menuItem, "eventtype"))
				return;
			if(message.enabled){
				require(["dojo/dom-attr"], function(domAttr){
					dojo.forEach(dojo.query("img", menuItem), function(element) {
						removeClass(element, "opacity_20");
					});
					dojo.forEach(dojo.query("span", menuItem), function(element) {
						removeClass(element, "opacity_20");
						domAttr.remove(element, 'disabled');
					});
					domAttr.set(menuItem, {'enabled':'true', 'aria-disabled':'false'});
					dojo.forEach(dojo.query("a", menuItem), function(element) {
						var clickMethod = element.getAttribute("clickMethod");
						if(clickMethod){
							domAttr.set(element, "href", clickMethod);
							domAttr.remove(element, "clickMethod");
						}
					});
				});
			}
			else {
				require(["dojo/dom-attr"], function(domAttr){
					dojo.forEach(dojo.query("img", menuItem), function(element) {
						appendClass(element, "opacity_20");
					});
					dojo.forEach(dojo.query("span", menuItem), function(element) {
						appendClass(element, "opacity_20");
						domAttr.set(element, "disabled", "disabled");
					});
					domAttr.set(menuItem, {'enabled':'false', 'aria-disabled':'true'});
					dojo.forEach(dojo.query("a", menuItem), function(element) {
						var href = element.getAttribute("href");
						if(href){
							domAttr.set(element, "clickMethod", href);
							domAttr.remove(element, "href");
						}
					});
				});
			}
		});
	};
	
	this.menuStateHandler=function(data) {
		var element = dojo.byId(this.elementId+"_a");
		if(!element || undef(dojo.attr(element,"eventType")) || undef(data.eventtype) || dojo.attr(element,"eventType")!=data.eventtype){
			return;
		}
		if(data.enabled.toString()=="false") {
			element.onclick=function(event) {return false;};	
		}
		else {
			element.onclick=null;
		}
		
		element.className=(!data.enabled)?"off":"";
		element.setAttribute("aria-disabled",!data.enabled);
		dojo.attr(dojo.byId(this.elementId),{"active":data.enabled});
	};
	
	/*
	 * Positions the menuholder where the click was fired and set it as visible
	 */
	this._showMenu=function(id,foc)
	{
		var menu = getElement(id);
        var useDiv = false;
        var realMenu = null;
        if(menu.hasAttribute('data-menu-div')){
            menu = menu.parentNode;
            useDiv = true;
            realMenu = menu.querySelector('ul');
            realMenu.style.position = 'relative';
        }
    let menuUl = menu.querySelector('ul');
    let dataQueryDropdown = menuUl.getAttribute('data-query-dropdown')==='true';
    if(dataQueryDropdown){
      menu.style.opacity='0';
      lastClickElement.setAttribute('data-menu-open', 'true');
      lastClickElement.parentNode.setAttribute('aria-expanded', 'true');
      lastClickElement.parentNode.setAttribute('data-menu-open', 'true');
    }
		if(undef(menu))
		{
			return;
		}

    if(lastClickElement?.id){
      menuUl.setAttribute('data-opener-id', lastClickElement.id);
    }
    
		if(undef(foc))
		{
			foc=true;
		}
		var clientArea=document.getElementById(clientAreaId);
		var headerScrollDiv = document.getElementById(headerScrollDivId);
		this.topMenu=id;
		if(!this.trueTop) {
			this.trueTop = id;
		}
		menu.style.display = "";
        if(realMenu){
            realMenu.style.display = "";
        }
		var openat = menu.getAttribute("openat") || realMenu.getAttribute("openat");
		var top = 0;
		var left = 0;
    if(lastClickElement){
      var	lastClickID=lastClickElement.id;
      if(!undef(lastClickID))
        lastClickElement=document.getElementById(lastClickID);
    }
		if(!undef(clickX) && !undef(clickY))
		{
			left = clickX;
			top = clickY;
			clickX=null;
			clickY=null;
		}
		else if (openat == "northwest")
		{
			// Context menus
			top = getTopPosition(lastClickElement);
			left = getLeftPosition(lastClickElement);
			if((USERLANG=="AR")||(USERLANG=="HE"))
			{
				left+=lastClickElement.offsetWidth;
			}
		}
		else if (openat == "parentsouthwest")
		{
			var lc=lastClickElement.getAttribute("lc");
			var posEl;
			if(!undef(lc))
			{
				posEl = document.getElementById(lc);
				setClickPosition(posEl);
			}
			if(!undef(posEl))
			{
				top= getTopPosition(posEl) + posEl.offsetHeight - 1;
				left = getLeftPosition(posEl) + 1;

				if((USERLANG=="AR")||(USERLANG=="HE"))
				{
					left+=(posEl.offsetWidth-menu.offsetWidth);
				}
			}
			else
			{
				//Due to structural differences in combobox and toolbarcombobox
				// we must make sure we get the correct element to use for the
				// left
				var testElement=lastClickElement.parentNode.parentNode.parentNode;
				var dynDropDownSR = (SCREENREADER && lastClickElement.firstChild.firstElementChild?.getAttribute("src")?.includes("dynamicmenudrop"));
				top = getTopPosition(testElement) + testElement.offsetHeight - 1;
				try
				{
					if(!undef(testElement.getAttribute("control")) && !dynDropDownSR)
					{

						if(isIE())
							testElement=lastClickElement.parentNode.previousSibling;// .parentNode;
						else
							testElement=lastClickElement.parentNode.previousSibling.parentNode;
						if(testElement.firstNode)
							testElement=testElement.firstNode;
						else
							testElement=testElement.firstChild;
					}
					left = getLeftPosition(testElement) + 1;
				}
				catch(error)
				{
					testElement=lastClickElement.parentNode;
					left = getLeftPosition(testElement) + 1;
				}
				if((USERLANG=="AR")||(USERLANG=="HE"))
				{
					left+=testElement.offsetWidth;
				}
			}
		}
		else if(openat=='overlay'){
			var overlayElement = getElement(dojo.attr(menu,'overlay'));
			overlayElement.style.overflowX = 'hidden';
			overlayElement.style.overflowY = 'hidden';
			top = parseInt(getTopPosition(overlayElement)) + parseInt(dojo.attr(menu,'topOffset'));
			left = getLeftPosition(overlayElement);
			height = overlayElement.offsetHeight;
			width = overlayElement.offsetWidth;
			menu.style.top = top + "px";
			menu.style.left = left + "px";
			menu.style.borderTop = "0px";
			menu.style.width = overlayElement.offsetWidth+'px';
			menu.style.height = overlayElement.offsetHeight+'px';
			menu.style.padding = '3px';
			this.showShim(menu);
			return;
		}
		else
		{
      let headerMenuPos = window['headerMenuPosition'];
      if(headerMenuPos){
        top = 0;
        left = headerMenuPos.left;
        window.headerMenuPosition = null;
      }
      else {
			  top = getTopPosition(lastClickElement) + lastClickElement.offsetHeight - 1;
			  left = getLeftPosition(lastClickElement);
        if((USERLANG=="AR")||(USERLANG=="HE"))
        {
          left+=lastClickElement.offsetWidth-menu.offsetWidth;
        }
      }
		}

		var scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
		top+=scrollTop;
		if(!isIE() || (USERLANG!="AR" && USERLANG!="HE"))
			left+=document.documentElement.scrollLeft;// Bidi menus not showing in the

		if((USERLANG=="AR")||(USERLANG=="HE"))
		{
			if( left < 0 )
			{
				left = 0;
			}

			if (isIE() && (document.documentElement.scrollHeight > document.body.offsetHeight))
			{
				if(openat != "parentsouthwest")
					left -= 16;
			}
		}
		var type = menu.menutype;
		if(type=="-1" && openat!="parentsouthwest")
			top=top-15;
        menu.style.position = 'absolute';
		menu.style.top = top + "px";
    let dd = lastClickElement?.classList.contains('cbt');
    if(openat==='match' || dd){
      menu.style.minWidth = (lastClickElement.offsetWidth - 1) + 'px';
    }
		menu.style.left = left-1 + "px";
		if(!this.staticMenu) {
            menu.className = realMenu.className;
            setTimeout(()=>{
                let menuRect = realMenu.getBoundingClientRect();
                let overflow = menuRect.bottom - window.innerHeight;
                if(dataQueryDropdown){
                  menu.className+=' queryDropdownMenu';
                }
                if(overflow > 0){
                    menu.style.top = (top - overflow>0?top - overflow:0)  + 'px';
                }
                overflow = menuRect.right - window.innerWidth;
                if(overflow > 0){
                    menu.style.left = parseInt(menu.style.left) - overflow - 2 + 'px';
                }
                realMenu.style.maxHeight = `calc(100vh - ${parseInt(menu.style.top - document.scrollingElement.scrollTop)}px)`
                let customScroller;
                if(!dataQueryDropdown){
                  customScroller = new CustomScrollable(menu, {disposable: true, dragContent: true, onScroll: null, maxHeight: '95vh'});
                }
                if(!menu.hasAttribute('issearch')){
                    dojo.connect(customScroller?.outerElement || menu, "mouseleave", this, function(event) {
                        if(tpaeConfig.menuHideDelay>0 && !menu.searchHasFocus) {
                            if(this.menutimer!=null) {
                                this.stopHideMenuTimer();
                            }
                            var menuId = (this.topMenu)?((this.topMenu.id)? this.topMenu.id: this.topMenu):this.trueTop;
                            this.menutimer = window.setTimeout("topLevelMenus['shared']._hideMenu('"+menuId+"'); topLevelMenus['shared']._highlight('"+this.trueTop+"');", tpaeConfig.menuHideDelay);
                        }
                    });
                }
                menu.addEventListener('click', (evt)=>{
                    //do nothing
                    evt.stopPropagation();
                })
                if(dataQueryDropdown){
                    let height = menuUl.offsetHeight;
                    menu.style.height='0px';
                    setTimeout(()=>{
                      menu.style.opacity='1';
                      menu.style.transition='height .2s';
                      menu.style.height = height + 3 +'px';
                    }, 100);
                }
                setTimeout(()=>{
                    let box = menu.getBoundingClientRect();
                    if(box.right>window.innerWidth){
                        menu.style.left = window.innerWidth - box.width + "px";
                    }
                    if(foc){
                        this._focusFirstItem(menu);
                    }
                }, 10);
            }, 10)
            
			this.showShim(menu);
		}
		addMouseDownEventsForPopups();
		
   
	};

	
	this.stopHideMenuTimer=function() 
	{
		if(this.menutimer) {
			window.clearTimeout(this.menutimer);
			this.menutimer = null;
		}
	};
	
	
	/*
	 * Gets shim. Creates one if one does not exist.
	 */
	this.getShim=function(menu, create)
	{
		if(undef(create)) {
			create = true;
		}
		var shim = dojo.byId(dojo.attr(menu, "parentmenuid")+"_shim");
		if(!shim && create) {
			shim = document.createElement("IFRAME");
			shim.id = dojo.attr(menu, "parentmenuid")+"_shim";
			shim.className = "menuShim";
			dojo.attr(shim, {"role":"presentation","aria-hidden":"true"});
			menu.parentElement.insertBefore(shim, menu);
		}
		return shim;
	};
	
	this.hideShim=function(menu)
	{
		var shim = this.getShim(menu, false);
		if(shim) {
			dojo.style(shim,{"display":"none"});
		}
	};
	
		this.findObjects=function( doc )
	{
		if( doc.getElementsByTagName("OBJECT").length > 0 )
		{
			return true;
		}
		
	 	var frames = doc.getElementsByTagName("IFRAME");
		var l = frames.length;
		for(var i = 0; i < l; i ++ )
		{
			var f = frames[i];
			if( f == undefined ) continue;

			var doc =  f.contentWindow.document;
			if( doc == undefined ) continue;
			
			var autoHide = f.getAttribute("autoHide"); 
			if( autoHide != undefined && (autoHide == true || autoHide == "true" ))
			{
				return true;
			}
			
			if( doc.getElementsByTagName("OBJECT").length > 0 )
			{
				return true;
			}
		}
		return false;
	}

	this.showShim=function(menu) 
	{
		if( !this.findObjects( document ) )
		{
			return;
		}
		var shim = this.getShim(menu);
		var shadow = 1;
		//	menu.style.height and width are strings that already have uom appended
		//	menu.offsetHeight and Width are integers that do not have uom appended
		menu.parentNode.insertBefore(shim, menu);
		dojo.style(shim, {	"top": parseInt(menu.style.top)+"px",
							"left": parseInt(menu.style.left) + "px",
							"position":"fixed",
							"height":(menu.offsetHeight + shadow) + "px",
							"width":(menu.offsetWidth + shadow) + "px",
							"role" : "presentation",
							"ariaHidden" : "true",
							"display":"",
							"zIndex":"50000"
		});
		dojo.style(menu, {	
			"zIndex":"50001",
			"boxShadow": "0px 0px 0px #fff",
			"borderRadius": "0px"
		});
	};
	
	this.getMenuData=function(dsId)
	{
		try
		{
			if(!dataSets)
				return;
			var set = dataSets[dsId];
			return set;
		}
		catch(error)
		{

		}
	};

	this.menuClick=function(item)
	{
		var topMenu = document.getElementById(this.topMenu);
		var comp = document.getElementById(item.target);
		stopFocus = false;
		if(topMenu && topMenu.getAttribute("typeahead")=="true")
		{
			if(comp)
			{
				var offset = item.offset; 
				if(offset>=0) // ellipses items
				{
					this.typeAhead(comp,item.offset);
					this._focusFirstItem('typeaheadmenu');
					return;
				}
				else if(item.value=="search")
				{
					comp.setAttribute("stopvalidate",true);
					fldInfo = comp.getAttribute("fldInfo");
					if(fldInfo)
					{
						fldInfo = dojo.fromJson(fldInfo);
						var dataStoreInfo = getDataStoreInfo(fldInfo);
						if (dataStoreInfo != null)
						{
							var lookupInfo = {  "ta_attrs" : dataStoreInfo.typeahead.attributes,
												"value" : comp.value 
										};
							sendEvent('selectvalue',comp.id,dojo.toJson(lookupInfo));
						}
					}
				}
				else
				{
					comp.value=item.value;
					input_forceChanged(comp); 
				}
			}
		}
		else // standard item
		{
			if(item.clickId){
				var click = dojo.byId(item.clickId);
				if(click){
					click.click();
				}
			}
			else {
				showingMenu=false;
				if(item.event === 'changeapp' && (item.apptype === 'APP' || item.apptype === 'WC')){
					if(APPTARGET==='changepswd'){
						sendEvent(item.event,item.target,item.value);
					}
					else{
						if (item.appuid)
						{
							if(item.custapptype=='REACT'){
								sessionStorage.setItem('_return-to-app-description', APPDESCRIPTION);
								openNextGenApp(item.value.toLowerCase(),'?_graphite-ctx=appdetails&appdetails={"uid":'+item.appuid+'}&_graphite-return-to='+APPTARGET+'',null,null,item.custapptype,item.ismafmobileapp);
							} else{
								openNextGenApp(item.value.toLowerCase() + '/detail', '?uid=' + item.appuid,item.apptype,null,item.custapptype,item.ismafmobileapp);	
							}
						}
						else
						{
							openNextGenApp(item.value.toLowerCase(), '', item.apptype, item.text, item.custapptype, item.ismafmobileapp);
						}
					}
				}
				else {
					let openerId = topMenu?.getAttribute('data-opener-id');
					if(openerId){
					  	let opener = document.getElementById(openerId);
						let openerLcId = opener?.getAttribute('lc');
						setCurrentfocusFromId({type:'click-menu-item'}, openerLcId?openerLcId:openerId);
						window.setTimeout(()=>{ //need to allow time for hiddenform to update
							sendEvent(item.event,item.target,item.value);
						}, 250);
					}
					else if(item.event && item.target) {
						window.setTimeout(()=>{ //need to allow time for hiddenform to update
							sendEvent(item.event,item.target,item.value);
						}, 250);
					}
				}
			}
		}
		if(!topMenu) {
			topMenu = dojo.byId(this.trueTop);
		}
		if(topMenu) {
			this._hideMenu(this.topMenu);
		}
		if(comp){
			comp.focus(); 
		}
	};

	this.buildAutoFillFilter=function(dataStoreInfo)
	{
		var dataFilter = new FilterObject(true);
		var filters = dataStoreInfo.filters;
		for(var filterAttribute in filters)
		{
			var filterIds = filters[filterAttribute];
			for(var index = 0; index < filterIds.length; index++)
			{
				var id = filterIds[index];
				var component = getComponentOnCurrentDataRow(id);
				if(component)
				{
					if(component.value!="")
					{
						dataFilter.add(filterAttribute, component.value);
						break;
					}
				}
			}
		}
		return dataFilter;
	};

	this.filterOnSiteOrg=function(dataStoreInfo, fldInfo)
	{
		var dataFilter = new FilterObject(true);
		try
		{
			if(fldInfo.sofid)
			{
				var pageAutoFillInfo = getAutoFillInfoForPage(fldInfo);
				if (pageAutoFillInfo)
				{
					var siteorgValues = pageAutoFillInfo.siteorgvalues[fldInfo.sofid];
					if(siteorgValues)
					{
						var orgFilter = new FilterObject(true);
						orgFilter.add("orgid", siteorgValues["orgid"]);
						this.filterDataStore.filter(orgFilter);
						var siteFilter = new FilterObject(true);
						siteFilter.add("siteid", siteorgValues["siteid"]);
						this.filterDataStore.filter(siteFilter);
					}
				}
			}
		}
		catch(error)
		{
			console.error(error);
			// nothing for filtering from autoFillInfo
		}
		return dataFilter;
	};

	this.buildTAFilter=function(dataStore, value)
	{
		var dataFilter = new FilterObject(false);
		var dataStoreAttributes = dataStore.typeahead.attributes;
		for(var i =0;i<dataStoreAttributes.length;i++)
		{
			dataFilter.add(dataStoreAttributes[i], value);
		}
		return dataFilter;
	};

	this.typeAheadInstant=function(component,pageOffset)
	{
		if(!tpaeConfig.clientDataValidation)
			return;
		this._destroyMenus();
		if(component.value.length<this.typeahead.settings.minimumchars)
			return;
		var fldInfo = component.getAttribute("fldInfo");
		if(!fldInfo)
			return;
		fldInfo = fldInfo ? dojo.fromJson(fldInfo) : fldInfo;
		var dataStoreId = fldInfo.dsid;
		if(!dataStoreId)
			return;

		if (this.typeahead.settings.instantfetch == true)
		{
			this.filterDataStore = getDynamicBundle(this, component, pageOffset, fldInfo);
		}
		else
		{
			if (this.filterDataStore == null || component.value.indexOf(domain.lastFilterTerm)!=0)
			{
				this.filterDataStore = getDataStore(fldInfo.dsid);
				domain.lastFilterTerm = component.value;
				component.setAttribute("fldInfo",dojo.toJson(fldInfo));
			}
			return this.buildTAMenu(component, pageOffset, fldInfo);
		}
	};

	this.buildTAMenu=function(component, pageOffset, fldInfo)
	{
		var dataStoreInfo = getDataStoreInfo(fldInfo);
		if(!dataStoreInfo)
		{
			return;
		}
		var value = component.value;
		var menuId = "typeaheadmenu";
		if(undef(this.filterDataStore))
			return;

		if (this.typeahead.settings.instantfetch != true)
		{
			this.filterDataStore.filter(this.buildTAFilter(dataStoreInfo,value));
			if(undef(this.filterDataStore))
				return;
		}
		var newDataSet = new Array();
		if(pageOffset>0 && this.typeahead.settings.usepages)
		{
			var prev = this.resources["previous"];
			if(this.typeahead.settings.showprevcount&& pageOffset>0)
				prev+= " <small style='color:#C0C0C0'>("+(pageOffset)+")</small>";
			newDataSet.push({"value":"...","display":prev,"offset":(pageOffset-this.typeahead.settings.menulength)});
		}
		else if(value.trim()=="" && !fldInfo.required)
		{
			newDataSet.push({"value":"","display":"&nbsp;"});
		}
		var rowCount=-1;
		for(var rowIndex = 0; rowIndex < this.filterDataStore.length(); rowIndex ++)
		{
			rowCount++;
			if(rowCount<pageOffset) // not on correct page of values yet
			{
				continue;
			}
			if(this.typeahead.settings.usepages && newDataSet.length==this.typeahead.settings.menulength)
			{
				var next = this.resources["next"];
				if(this.typeahead.settings.shownextcount)
					next += " <small style='color:#C0C0C0'>("+(this.filterDataStore.length()-(rowCount+1))+")</small>";
				item = {"value":"...","display":next,"offset":(pageOffset+this.typeahead.settings.menulength)};
				item.border=true;
				newDataSet.push(item);
				break;
			}

			var domainAttributes= dataStoreInfo.ta_attrs;
			dataStoreInfotchedRow = false;
			var display="";
			for(var i=0;i<domainAttributes.length;i++)
			{
				var attrValue = this.filterDataStore.getValue(rowIndex, domainAttributes[i]);
				if(!attrValue)
				{
					continue;
				}
				var displayCheck = dojox.html.entities.decode(attrValue.toLowerCase());
				var start = displayCheck.indexOf(value.toLowerCase());
				if(display.length>0)
				{
					display += "<td style='white-space:nowrap;'> : </td>";
				}
				if(start>=0) // attribute contains match
				{
					var item;
					var end = start + value.length;
					display += attrValue.substring(0,start)+"<span class='tamatch'>"+attrValue.substring(start,end)+"</span>"+attrValue.substring(end);
					matchedRow=true;
				}
				else
					display += attrValue;
			}
			if(matchedRow)
			{
				var itemValue = this.filterDataStore.getValue(rowIndex, dataStoreInfo.typeahead.keyattribute);
				itemValue = dojox.html.entities.decode(itemValue);
				if(itemValue)
				{
					item = {"value":itemValue,"display":display};
					if((pageOffset>0 && newDataSet.length==1) && this.typeahead.settings.usepages)
						item.border=true;
					newDataSet.push(item);
				}
			}
		}
		if(fldInfo.lookup && this.typeahead.settings.showsearch)
		{
			var srch = this.resources["search"];
			if(value.trim().length>0)
				srch = this.resources["searchfor"].replace("{0}","<span class='tamatch'>"+escapeHTML(value)+"</span>");
			item = {"value":"search","display":"<img class='menuimg' style='margin:0px' src='"+IMAGE_PATH+"img_lookup.gif'/>"+srch};
			item.border = true;
			newDataSet.push(item);
		}
		if(newDataSet.length>0)
		{
			var menu = this.buildMenu(0, component.id,{"typeahead":true,"offset":pageOffset,"id":menuId,"items":newDataSet});
			menu.setAttribute('openat','typeahead');
			component.setAttribute('menu',menuId);
			lastClickElement=component;
			this._showMenu(menu.id,false);
			setFieldState(component,new ValidationError(0,""));
			dojo.connect(component, "keyup", this, this.menuTargetEvent);
			dojo.connect(component, "keydown", this, this.menuTargetEvent);
		}
	};

	this.typeAhead=function(component,pageOffset)
	{
		if(!tpaeConfig.clientDataValidation || component.readOnly == true)
			return;
		var menuId = "typeaheadmenu";
		this._destroyMenus();
		var value = component.value;
		if(value.length<this.typeahead.settings.minimumchars)
			return;
		var fldInfo = component.getAttribute("fldInfo");
		if(!fldInfo)
		{
			return;
		}
		fldInfo = fldInfo ? dojo.fromJson(fldInfo) : fldInfo;
		var dataStoreInfo = getDataStoreInfo(fldInfo);
		if(!dataStoreInfo)
		{
			return;
		}
		this.filterDataStore = getDataStore(fldInfo.dsid);
		if(undef(this.filterDataStore))
		{
			return;
		}

		//neeed to do org and site filters
		this.filterOnSiteOrg(dataStoreInfo, fldInfo);
		this.filterDataStore.filter(this.buildTAFilter(dataStoreInfo, value));
		var dataFilter = this.buildAutoFillFilter(dataStoreInfo);
		if(dataFilter)
		{
			this.filterDataStore.filter(dataFilter);
		}
		if(undef(this.filterDataStore))
		{
			return;
		}

		var newDataSet = new Array();
		var nextIndex, prevIndex;
		if(pageOffset > 0 && this.typeahead.settings.usepages)
		{
			var prev = this.resources["previous"];
			if(this.typeahead.settings.showprevcount)
				prev += " <small style='color:#C0C0C0'>(" + pageOffset + ")</small>";
			prevIndex = newDataSet.length; 
			newDataSet.push({"value":"...","display":prev,"offset":(pageOffset-this.typeahead.settings.menulength)});
		}
		if(pageOffset == 0 && value.trim() == "" && !fldInfo.required)
		{
			newDataSet.push({"value":"","display":"&nbsp;"});
		}
		var rowCount = 0;
		var item, matchedRowNum;
		dojo.removeAttr(component,"ta_match");
		for(var rowIndex = pageOffset; rowIndex < this.filterDataStore.length() && rowCount < this.typeahead.settings.menulength; rowIndex++)
		{
			var domainAttributes= dataStoreInfo.typeahead.attributes;
			var matchedRow = false;
			var display = "";
			for(var i=0;i<domainAttributes.length;i++)
			{
				var attrValue = this.filterDataStore.getValue(rowIndex, domainAttributes[i]);
				dojo.require("dojox.html.entities");
				attrValue = dojox.html.entities.decode(attrValue);
				if(!attrValue)
				{
					continue;
				}
				var displayCheck = attrValue.toLowerCase();
				var start = displayCheck.indexOf(value.toLowerCase());
				if(display.length>0)
				{
					display += "<td style='white-space:nowrap;'> : </td>";
				}
				if(start>=0) // attribute contains match
				{
					var end = start + value.length;
					display += attrValue.substring(0,start)+"<span class='tamatch'>"+attrValue.substring(start,end)+"</span>"+attrValue.substring(end);
					var itemValue = this.filterDataStore.getValue(rowIndex, dataStoreInfo.typeahead.keyattribute);
					itemValue = dojox.html.entities.decode(itemValue);
					if(value.length > 0 && start==0 &&  (dataStoreInfo.typeahead.keyattribute == domainAttributes[i]))
					{
						if (rowIndex==0 || value.toUpperCase()==itemValue.toUpperCase()) {
							dojo.attr(component,{"ta_match" : itemValue});
							matchedRowNum = rowIndex;
						}
					}
					matchedRow=true;
				}
				else
					display += attrValue;
			}
			if(matchedRow)
			{
				var itemValue = this.filterDataStore.getValue(rowIndex, dataStoreInfo.typeahead.keyattribute);
				itemValue = dojox.html.entities.decode(itemValue);
				if(itemValue)
				{
					item = {"value":itemValue, "display":display};
					if(pageOffset > 0 && rowCount == 0 && this.typeahead.settings.usepages)
						item.border = true;
					newDataSet.push(item);
					rowCount++;
				}
			}
		}
		if(this.typeahead.settings.usepages && pageOffset + rowCount < this.filterDataStore.length())
		{
			var next = this.resources["next"];
			if(this.typeahead.settings.shownextcount)
				next += " <small style='color:#C0C0C0'>("+(this.filterDataStore.length()-(rowIndex+1))+")</small>";
			item = {"value":"...","display":next,"offset":(pageOffset+this.typeahead.settings.menulength)};
			item.border=true;
			nextIndex = newDataSet.length;
			newDataSet.push(item);
		}

		if(fldInfo.lookup && this.typeahead.settings.showsearch)
		{
			var srch = this.resources["search"];
			if(value.trim().length>0)
				srch = this.resources["searchfor"].replace("{0}","<span class='tamatch'>"+escapeHTML(value)+"</span>");
			item = {"value":"search","display":"<img class='menuimg' style='margin:0px' src='"+IMAGE_PATH+"img_lookup.gif'/>"+srch};
			item.border=true;
			newDataSet.push(item);
		}
		if(newDataSet.length>0)
		{
			var menu = this.buildMenu(component.id,{"typeahead":true,"offset":pageOffset,"id":menuId,"items":newDataSet, "matchedRow" : matchedRowNum});
			menu.setAttribute('openat','typeahead');
			component.setAttribute('menu',menuId);
			lastClickElement=component;
			this._showMenu(menu.id,false);
			setFieldState(component,new ValidationError(0,""));
			dojo.connect(component, "keyup", this, this.menuTargetEvent);
			dojo.connect(component, "keydown", this, this.menuTargetEvent);
		}
	};

	this.menuTargetEvent=function(event)
	{
		event = (event) ? event : ((window.event) ? window.event : "");
		if(event.type=="keyup")
		{
			if(event.keyCode==KEYCODE_DOWN_ARROW)
			{
				var el = getSourceElement(event);
				if(el)
				{
					var menu = el.getAttribute('menu');
					if(!undef(menu))
						menu = document.getElementById(menu);
					if(!menu || menu.style.display=="none")
						return;
					this._focusFirstItem(menu);
					cancelEvent(event);
				}
			}
		}
		else if (event.type=="keydown")
		{
			if(event.keyCode==KEYCODE_DOWN_ARROW)
			{
				cancelEvent(event);
			}
			else if(event.keyCode==KEYCODE_ESC)
			{
				var el = getSourceElement(event);
				if(el)
				{
					var menu = el.getAttribute('menu');
					if(menu)
					{
						this._hideMenu(menu);
						cancelEvent(event);
					}
				}
			}
		}
	};

	this._focusFirstItem=function(menuOrId)
	{
		var menu = getElement(menuOrId);
		if(!menu)
			return;
		require(["dojo/query"], function(query){

      var items = Array.from(menu.querySelectorAll("a")).filter(item=>{
        return window.getComputedStyle(item.parentElement).display !== 'none';
      });
      let first = items[0];
			if(first){
				dojo.attr(first, {'tabindex':'0'});
				first.focus();
			}
		});
	};

	/**
	 * Focus on a menu item
	 */
	this._menuItemFocus=function(anc)
	{
//		this._hideOtherMenus();
		var focusClass = "current";
		if(!anc) {
			return;
		}
		if(!anc.parentNode) {
			return;
		}
		var parentMenu = anc.parentNode.parentNode;
		if(parentMenu.getAttribute("typeahead")=="true")
			focusClass="s"+focusClass;
		dojo.attr(parentMenu, {'focusClass':focusClass});
		if(dojo.attr(anc, 'tabindex') == '0') {
			this._highlight(parentMenu, anc.parentNode);
		}
		else if(anc.parentNode.id != dojo.attr(parentMenu,"currentid")){
			this._highlight(parentMenu);
		}
	};

	/**
	 * Show a sub menu based on an event
	 */
	this._showSub=function(event)
	{
		event = (event) ? event : ((window.event) ? window.event : "");
		var el = getSourceElement(event);
		if(el)
		{
			if(el.closest('UL').getAttribute('level')==='0'){
				setCurrentfocusFromId(null, el.id);
			}
			if(el.tagName=="LI"){
				el=el.childNodes.item(0);
			}
			if(event.currentTarget.hasAttribute('subid') || el.parentElement.hasAttribute('subid')){
				this._showSubMenu(el,false);
			}
		}
		stopBubble(event);
	};

	/**
	 * Show a sub menu based on an element
	 */
	this._showSubMenu=function(anc,foc)
	{
		while(anc && anc.tagName!="A" && anc.tagName!="UL")
		{
			anc=anc.parentNode;
		}
		if(undef(anc))
			return;
		if(foc)
		{
			anc.focus();
		}
		var parentMenu = anc.parentNode.parentNode;
		var oldSubId = parentMenu.getAttribute("submenu");
		var li = anc.parentNode;	
		var sub = this._getSubMenu(li);

    if(sub){
      let open = sub.style.display==='none'
      sub.style.display = open?'block':'none';
      li.setAttribute('menu-sub-expanded',open+'');
      anc.setAttribute('aria-expanded', open+'');
    } 

    sub.setAttribute("parentmenuid",parentMenu.id);
    sub.setAttribute("parentitemid",li.id);
    parentMenu.setAttribute("submenu",sub.id);
    appendClass(li,"current");
    if(this.staticMenu && undef(dojo.attr(parentMenu,"parentmenuid"))) {
      this.topMenu = sub;
    }
    var subItems = sub.getElementsByTagName("li");
    let scrollIndex = 0;
    Array.from(subItems).forEach(subMenuItem =>{
      if(scrollIndex <= 3 && scrollIndex < subItems.length - 2){
        scrollIndex++;
      }
    });
    let scrollItem = subItems[scrollIndex];
    let scroller = li.closest('.custom-scroller');
    if(scroller && scrollItem && scrollItem.getBoundingClientRect().bottom > scroller.offsetHeight){
      subItems[scrollIndex].scrollIntoView({behavior: 'smooth', block: 'end'});
    } 
    if(foc)
    {
      var firstItem = subItems.item(0);
      var anc = firstItem.childNodes.item(0);
      dojo.attr(anc, {'tabindex':'0'});
      anc.focus();
    }
		//}
		this._highlight(li.parentNode, li);
	if(!sub.className.includes("subNavMenu")){
		setTimeout(()=>{
			var menuPos = parentMenu.closest('div.menus');
			var menuBox = parentMenu.getBoundingClientRect();
			var diffY = menuBox.bottom - window.innerHeight;
			var diffX = menuBox.right - window.innerWidth;
			if(diffY>0){
			    menuPos.style.top = (parseInt(menuPos.closest('div.menus').style.top) - diffY) + 'px'
			}
			if(diffX>0){
			    menuPos.style.left = (parseInt(menuPos.closest('div.menus').style.left) - diffX) + 'px'
			}			
		}, 100);
	 }		
	};

	this._highlight = function(menuOrId, menuItem)
	{
		var menu = dojo.byId(menuOrId);
		if(!menu) {
			return;
		}
		var focusClass = dojo.attr(menu,'focusClass');
		if(!focusClass){
			focusClass = 'current';
		}
		var currentItemId = dojo.attr(menu,"currentid");
		if(currentItemId && currentItemId!="")
		{
			var currentItem = document.getElementById(currentItemId);
			if(currentItem){
				removeClass(currentItem,focusClass);
			}
		}
		if(menuItem){
			dojo.attr(menu,{"currentid":menuItem.id});
			appendClass(menuItem,focusClass);
		}
	};
	
	/**
	 * hide a menu for an event
	 */
	this._hideMenuForEvent=function(event)
	{
		event = (event) ? event : ((window.event) ? window.event : "");
		var source = getSourceElement(event);
    var menu = getSourceElement(event).parentNode.parentNode;
    if(source.parentNode.getAttribute('menu-sub-expanded') === 'true'){
      menu = source.parentNode.querySelector('UL');
    }
		this._hideMenu(menu);
		var focusItem = document.getElementById(menu.getAttribute("parentitemid"));
		if(focusItem && focusItem.tagName=="LI")
		{
			var anc = focusItem.childNodes.item(0);
			dojo.attr(anc, {'tabindex':'0'});
			anc.focus();
		}
	};

	/**
	 * hide a menu using an id
	 */
	this._hideMenu=function(menuOrId)
	{
		var menu = dojo.byId(menuOrId);
		if(!menu)
			return;
		var target = menu.getAttribute("target");
		if(!undef(target)) {
			target = document.getElementById(target);
		}
		if(dojo.attr(menu,'issearch')){
			var srchField = getElement(dojo.attr(menu,'searchFieldId'));
			if(srchField && document.activeElement !== srchField){
				srchField.value = '';
			}
		}
		if((dojo.attr(menu,"static")!="true" && dojo.attr(menu,"static")!=true)|| !undef(dojo.attr(menu,"parentmenuid"))) {
			menu.style.display="none";
			var parentNodeId = menu.hasAttribute('parent-id')? menu.getAttribute('parent-id'):menu.getAttribute('parentnodeid');
			if(parentNodeId){
				var parent = getElement(parentNodeId);
				if(parent){
					parent.appendChild(menu);
					let controller = topLevelMenus[menu.getAttribute('controller-id')];
					if(controller && controller.topMenu === menu){
						controller.topMenu = null;
					}
				}
			}
			this._highlight(menu.id);
		}
		var parentId =menu.getAttribute("parentmenuid");
		if(parentId){
			var parentMenu = document.getElementById(parentId);
			if(parentMenu){
				var parentAnchor = menu.parentNode.querySelector('A');
				if(parentAnchor){
					parentAnchor.setAttribute('aria-expanded','false');
				}
				parentMenu.removeAttribute("submenu");
			}
			this._highlight(menu.id);
		}
		var subId = menu.getAttribute("submenu");
		menu.removeAttribute("submenu");
    let parentItem = menu.parentNode;
    if(parentItem.tagName === 'LI'){
      parentItem.setAttribute('menu-sub-expanded', 'false')
    }
		if(!undef(subId))
			this._hideMenu(subId);
		if(target){
			focusElement(target);
		}
		if(menu.id==this.topMenu)
		{
			this._destroyMenus();
			this.topMenu=null;
			if(document.activeElement != target){
				if(menu.id=='menu0'){
					const ShellCommunicator = window.MaximoShellCommunicator.get();
					ShellCommunicator.emit("mas-shell-suite-header-set-focus", window.headerFocusId);
				}
				else {
					//need delay as events bubble too quickly and keys can be sent to item getting focus.
					delayedFocus(getFocusId(),false,100);
				}
			}
		}
    let openerId = menu.getAttribute('data-opener-id');
    if(lastClickElement){
      menu.removeAttribute('data-opener-id', lastClickElement.id);
    }
    if(openerId){
      let opener = document.getElementById(openerId);
      if(opener){
        opener.removeAttribute('data-menu-open');
        opener.parentNode.removeAttribute('data-menu-open');
        opener.focus();
      }
    }
		this.hideShim(menu);
	};
	
	this._destroyMenus=function()
	{
		while (this.holder.hasChildNodes())
		{
			this.holder.removeChild(this.holder.firstChild);
		}
	};

	/**
	 * Menu Key handler
	 */
	this._menuKey=function(event,li)
	{
		event = (event) ? event : ((window.event) ? window.event : "");
		appHotkey(event);
		if(undef(li))
		{
			li = getSourceElement(event).parentNode;
		}
		var menu = li.parentNode;
		var typeAhead = (menu.getAttribute("typeahead") == "true");
		var items = menu.childNodes;
		if(event.keyCode!=KEYCODE_ENTER)
			stopBubble(event);
		dojo.attr(menu,{'keyed':'true'});
		switch(event.keyCode)
		{
			case KEYCODE_ENTER:
				if(this._getSubMenu(li))
				{
					cancelEvent(event);
					this._showSub(event);
					stopBubble(event);
				}
				return;
			case KEYCODE_ESC:
				if(!menu.hasAttribute('issearch')){
					this._hideMenuForEvent(event);
				}
				else {
					var srchField = getElement(dojo.attr(menu,'searchFieldId'));
					if(srchField){
						srchField.focus();
					}
					event.preventDefault();
				}
				showingMenu = false;
				cancelEvent(event);
				return;
			case KEYCODE_LEFT_ARROW:
				if(!this.RTL)
				{
          let menuItem = event.currentTarget;
          let menu = menuItem.parentElement;
          let subId = menuItem.getAttribute('subid');

          if(subId && document.getElementById(subId).style.display!=='none'){
            this._hideMenuForEvent(event);
            return;
          }
          if(menu.hasAttribute('parentmenuid')){
            menuItem.parentElement.parentElement.querySelector('a').focus();
          }
				}
				else
				{
          if(event.target.parentElement.getAttribute('menu-sub-expanded') === 'true'){
            event.target.parentElement.querySelector('UL').querySelector('A').focus();
          }
          else {
					  this._showSub(event);
          }
				}
				return;
			case KEYCODE_RIGHT_ARROW:
				if(!this.RTL)
				{
          if(event.target.parentElement.getAttribute('menu-sub-expanded') === 'true'){
            event.target.parentElement.querySelector('UL').querySelector('A').focus();
          }
          else {
					  this._showSub(event);
          }
				}
				else
				{
					this._hideMenuForEvent(event);
				}
				return;
			case KEYCODE_TAB:
				hideAllMenusNF();
				if(!dojo.attr(menu, "static") && menu.getAttribute('parentitemid')!=='nav_search_field'){
					this._hideMenu(menu.id);
				}
				else {
					if(SCREENREADER){
						if(!document.getElementById('focusAnchor')){
							var focusAnchor = document.createElement('A');
							focusAnchor.href='#';
							focusAnchor.id = 'focusAnchor';
							document.body.insertBefore(focusAnchor, document.body.firstChild);
						}
						var topMenu = this.getTopMenu(menu.id);
						if(topMenu){
							findNavSection=function(element){
								var navSection;
								while(!navSection && element.parentElement){
									if(element.parentElement){
										element = element.parentElement;
										if(element.className.includes('navSection')){
											navSection = element;
										}
									}
								}
								return navSection;
							}
							var navSection = findNavSection(topMenu);
							if(navSection){
								if(event.shiftKey){
									var focusTo = navSection.parentElement.querySelectorAll("input")[2];
									if(focusTo){
										window.setTimeout(function(){
											document.body.focus();
											focusTo.focus();
											if(focusAnchor){
												focusAnchor.remove();
											}
										}, 50)
									}
									return;
								}
								var nextEl = null;
								if(navSection.nextElementSibling == null){
									nextEl = document.querySelectorAll('.navSep')[0];
									nextEl.firstElementChild.focus();
									return;
								}
								else {
									nextEl = navSection.nextElementSibling;
								}
								var nodes = Array.prototype.slice.call(nextEl.querySelectorAll("*"));
								nodes.some(function(child){
									if(child.getAttribute('tabindex') == '0'){
										window.setTimeout(function(){child.focus();}, 50)
										if(focusAnchor){
											focusAnchor.remove();
										}
										return true;
									}
								})
							}
						}
					}
					var anchors = dojo.query('a', menu).filter(function(node) {
						var disabled = node.disabled || dojo.attr(node, "disabled");
						return disabled != true && disabled != "true" && disabled != "disabled";
					});
					var next;
					if(event.shiftKey && !this.RTL || !event.shiftKey && this.RTL) {
						next = anchors[0];
						dojo.attr(next, {'tabindex':'0'});
					}
					else {
						next = anchors[anchors.length - 1];
						dojo.attr(next, {'tabindex':'-1'});
					}
					if(next) {
						next.focus();
						var currentItemId = menu.getAttribute("currentid");
						if(currentItemId && currentItemId!="")
						{
							var currentItem = document.getElementById(currentItemId);
							if(currentItem) {
								removeClass(currentItem.parentNode,"current");
							}
						}
					}
				}
				return;
		}
		for(var i = 0; i < items.length; i++)
		{
			if(items.item(i) != li)
			{
				continue;
			}
			var currentIndex = i;
      let focusItem;
			switch(event.keyCode)
			{
				case KEYCODE_UP_ARROW:
          if(event.currentTarget.previousElementSibling){
            if(!(focusItem = this.focusChildMenuItem(event.currentTarget.previousSibling, true))){
              focusItem = event.currentTarget.previousElementSibling.querySelector('a');
            }
          }
          else if(parseInt(event.currentTarget.parentElement.getAttribute('level'))>0){ // on a sub
            focusItem = event.currentTarget.parentElement.previousElementSibling;
          }
					break;
				case KEYCODE_DOWN_ARROW:
          focusItem = this.focusChildMenuItem(event.currentTarget, false)
          if(!focusItem){
            if(event.currentTarget.nextElementSibling){
              focusItem = event.currentTarget.nextElementSibling.querySelector('a');
            }
            else if(parseInt(event.currentTarget.parentElement.getAttribute('level'))>0){ //on a sub
              let next = event.currentTarget.parentElement.parentElement.nextElementSibling;
              if(next){
                focusItem = next.querySelector('a');
              }
            }
          }
					break;
			}

      if(focusItem){
        event.preventDefault();
        event.stopPropagation();
        dojo.attr(focusItem, {'tabindex':'0'});
        focusItem.focus();
        return;
      }
		}
	};

  this.focusChildMenuItem=function(listItem, last){
    let subid = listItem.getAttribute('subid');
    if(subid){
      let sub = listItem.querySelector(`#${subid}`);
      if(sub && sub.style.display !== 'none'){
        let childItems = sub.querySelectorAll('a');
        if(childItems.length>0){
          let focusItem = childItems[last?childItems.length-1:0];
          if(focusItem){
            focusItem.focus();
            return focusItem;
          }
        }
      }
    }
    return false;
  }

	this.getTopMenu=function(menuId){
		var menu = document.getElementById(menuId)
		while(menu && menu.hasAttribute('parentmenuid')){
			menu = document.getElementById(menu.getAttribute('parentmenuid'));
		}
		return menu;
	}
	
	this._getSubMenu=function(li)
	{
		var subId = li.getAttribute("subid");
		var subMenu = null;
		if(!undef(subId))
		{
			subMenu = document.getElementById(subId);
		}
		return subMenu;
		// if the menus are built in one structure
		// return (li.getElementsByTagName("ul")[0]);
	};

	this.hasLocalStorage=function()
	{
		try
		{
			return 'localStorage' in window && window['localStorage'] !== null;
		}
		catch (e)
		{
			return false;
		}

	};

	this.createMenuCache=function(menuDef)
	{
		var hasLocalStorage = this.hasLocalStorage();
		if(hasLocalStorage)
		{
			// Removing preexisting normal (without encrypted) key from local storage
			if(localStorage.getItem("menucache_"+USERNAME+"_"+USERLANG) != null) {
				localStorage.removeItem("menucache_"+USERNAME+"_"+USERLANG);
			}
			if(undef(menuDef))
			{
				menuDef=dojo.fromJson(localStorage.getItem("menucache_"+SECURE_USERNAME+"_"+USERLANG));
			}
			else
			{
				localStorage.setItem("menucache_"+SECURE_USERNAME+"_"+USERLANG, dojo.toJson(menuDef));
			}
		}
		var hiddenForm = getHiddenForm();
		var inputs = hiddenForm.elements;
		inputs.namedItem("localStorage").value = hasLocalStorage;
		this.cache = menuDef;
	};

	this._showCachedMenu=function(eventtype,componentid,val)
	{
		if(!this.cache || (eventtype!="showmenu" && eventtype!="click"))
			return false;
		var cachedMenu = this.cache[val];
		if(undef(cachedMenu)) // some menus will be stored with the launching
			// component id prefixed
		{
			var component = dojo.byId(componentid);
			if(component)
			{
				var menuType = component.getAttribute("menutype");
				if(menuType)
				{
					menuType=menuType.toUpperCase();
					cachedMenu = this.cache[componentid+"_"+menuType];
					if(undef(cachedMenu))
						cachedMenu = this.cache[menuType];
				}
			}
		}
		if(!undef(cachedMenu) && !undef(cachedMenu.items))
		{
			this.buildMenu(componentid,cachedMenu,null);
			this._showMenu(cachedMenu.id,true);
			return true;
		}
		return false;
	};
	
	this._hideOtherMenus=function() {
		for(var menuIndex in topLevelMenus) {
	 		var menu = topLevelMenus[menuIndex];
	 		if(menu!=this) {
	 			var top = dojo.byId(menu.trueTop);
	 			if(!top) {
	 				top = dojo.byId(menu.topMenu);
	 			}
	 			if(top) {
	 				var currentItemId = dojo.attr(top,"currentid");
	 				if(currentItemId && currentItemId!="")
	 				{
	 					var currentItem = document.getElementById(currentItemId);
	 					if(currentItem)
	 						removeClass(currentItem.parentNode,"current");
	 				}
	 			}
	 			if(menu!=null && this!=null && 
	 				menu.topMenu != this.topMenu) {
	 				if(menu._hideMenu) {
	 					menu._hideMenu(menu.topMenu);
	 				}
	 			}
	 		}
	 	}
	};

	this.menuSearch = function(searchContainerOrId, fillContainerOrId, searchField, groupBy){
		var searchString = searchField.value;
		if(!searchString || searchString==''){
			menus.hideSearch();
			return;
		}
		this._hideMenu(searchField.parentNode.parentNode.getAttribute("submenu"));
		searchField.focus();
		var upperSearchString = searchString.toUpperCase();
		var searchContainer = getElement(searchContainerOrId);
    var menuClassName = searchContainer.firstElementChild.className;
		var fillContainer = getElement(fillContainerOrId);
		var controller = this;
		require(["dojo/query", "dojo/dom", "dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dojo/dom-attr","dojo/on","dojo/_base/array"], 
				function(query, dom, construct, geom, domStyle, domAttr, on, array){
			var count = 0;
			var newMenu = new Array();
			var groups = [searchContainer];
			if(groupBy){
				groups = query(groupBy.group, searchContainer);	
			}
			groups.forEach((group)=>{
				var beginMatch = [];
				var anyMatch = [];
				var titles = [];
				//standard menus
				var items;
				if(groupBy){
					items = query("#"+group.id+" > ul > li > a[role='menuitem']");
					if(items.length==0){ //navsection menus
						items = query("#"+group.id+" > div:nth-child(2) > div > ul li > a[role='menuitem']")
					}
				}
				else {
					items = query("#"+group.id+" a[role='menuitem']");
				}
				var title,titleImg,titleLevels;
				if(groupBy && groupBy.title){
					title = query(groupBy.title, group)[0];
					titleImg = query("img",title)[0];
					if(dojo.attr(titleImg,'src').indexOf('blank')>=0){
						titleImg = null;
					}
					var level = dojo.attr(title.parentNode.parentNode,'level');
					if(level){
						level = parseInt(level);
					}
					else {
						level = 0;
					}
					titleLevels = level;
				}
				items.forEach(function(anchor, index, nodelist){
					var menuItem = anchor.parentNode;
					//don't show subs in results
					if(!domAttr.get(menuItem,'subid') && menus.getMenuText(anchor).toUpperCase().indexOf(upperSearchString)==0){
						var mi = controller.decodeMenuItem(menuItem);
						if(mi.clickId.indexOf('recentAppList')==-1){
							var dup = array.indexOf(titles, mi.text) >= 0;
							if(!dup){
								titles.push(mi.text);
								beginMatch.push(mi);
							} 
							else if(DEBUGLEVEL>=1){
								console.log("Duplicate entry '"+mi.text+"' found and ignored.")
							}
						}
					}
				});
				beginMatch.sort(controller.sortMenu);
				items.forEach(function(anchor, index, nodelist){
					var menuItem = anchor.parentNode;
					//don't show subs in results
					if(!domAttr.get(menuItem,'subid') && menus.getMenuText(anchor).toUpperCase().indexOf(upperSearchString)>0){
						var mi = controller.decodeMenuItem(menuItem);
						if(mi.clickId.indexOf('recentAppList')==-1){
							var dup = array.indexOf(titles, mi.text) >= 0;
							if(!dup){
								titles.push(mi.text);
								anyMatch.push(mi);
							}
							else if(DEBUGLEVEL>=1){
								console.log("Duplicate entry '"+mi.text+"' found and ignored.")
							}
						}
					}
				});
				anyMatch.sort(controller.sortMenu);
				if(title && (anyMatch.length>0 || beginMatch.length>0)){
					//'image':(titleImg?titleImg.src:''),
					//'padding':titleLevels
					beginMatch.unshift({'id':'navSearchItem'+title.id,'text':menus.getMenuText(title),'padding':1,'className':'searchHeading','disabled':true, image: (titleImg?titleImg.src:'')});
				}
				newMenu = newMenu.concat(beginMatch.concat(anyMatch));
			});
			var box = geom.getContentBox(searchField);
			//controller._destroyMenus();
			controller.holder = document.getElementById("menuholdertd"); 
			var noMatch = 'No Matches ';
			if(document.documentElement.lang!="en"){
				noMatch = ' ';
			}
			if(newMenu.length==0){
				newMenu.push({'id':'navSearchItem_NONE','text':noMatch,'className':'searchHeading','disabled':true});
			}
			var offset = 0;
			if(fillContainer.contains(searchField)){
				offset = searchField.parentNode.offsetHeight;
			}
			var menu = controller.buildMenu(searchField.id+"_menu",{"id":searchField.id+"_menu",baseClassName: `${menuClassName} searchMenu`,"labelledBy":searchField.id,"issearch":true,searchable:false,"topOffset":offset,"items": newMenu,"type":-1,"openat":"overlay","overlay":fillContainer.id},null);
			if(!menu){
				return;
			}
			dojo.attr(searchField, {'searchMenuId': menu.id});
			dojo.attr(menu, {'searchFieldId': searchField.id, 'role':'alert'});
			lastClickElement = searchField;
			domStyle.set(menu.id, {'parentitemid':searchField.id,'min-width':box.w+'px','overflowY':'auto'});
			searchContainer.style.display='none'
      searchField.parentElement.setAttribute('data-search-container-id', searchContainerOrId.id);
      fillContainer.innerHTML='';
      fillContainer.appendChild(menu);
      menu.style.display='initial';
      //controller._showMenu(menu.id,false);
			domAttr.set(menu, {'parentitemid':searchField.id});
			items = query("li > a[role='menuitem']", menu);
      if(items.length>0){
        setTimeout(()=>{
          if(items[1]){
            items[1].setAttribute('tabindex','0');
          }
        }, 500)
      }
			if(!SCREENREADER){
				items.forEach(function(anchor, index, nodelist){
					var begin = menus.getMenuText(anchor).toUpperCase().indexOf(upperSearchString);
					if(anchor.parentNode.className.indexOf('searchHeading')==-1){
						var text = menus.getMenuText(anchor);
						anchor.innerHTML = text.substring(0,begin)+"<span class='tamatch'>"+text.substring(begin,begin+searchString.length)+"</span>"+text.substring(begin+searchString.length);
					}
				});
			}
			on.once(window, 'resize', function(){
        menus.hideSearch();
			});

			if(!searchField.extraHandler){
				require(["dojo/topic"], function(topic){
					topic.subscribe('navContainerState', function(){
            menus.hideSearch();
          });
				});
				searchField.extraHandler = on(searchField, 'keydown', function(event){
					var menuId = dojo.attr(searchField, 'searchMenuId');
					if(menuId){
						var menu = dojo.byId(menuId);
						if(menu){
							if(hasKeyCode(event, KEYCODE_DOWN_ARROW)){
								menus._focusFirstItem(menu);
								event.preventDefault();
								event.returnValue  = false;
								stopBubble(event);
							}
							if(hasKeyCode(event, KEYCODE_ESC)){
								this.value = '';
                menus.hideSearch()
								event.preventDefault();
								event.returnValue  = false;
								stopBubble(event);
							}
						}
					}
				});
        // on(searchField.nextElementSibling, 'keydown', function(event){
        //   if(hasKeyCode(event, KEYCODE_TAB) && !event.shiftKey){
        //     searchField.value = '';
        //     //we cannot do a standard hidemenu as it will set focus back to field
        //     menu.style.display = 'none';
        //     menus._highlight(menu.id);
        //     menus.hideSearch()
        //     //hideSearchresults();
        //     menus.topMenu = null;
        //   }
        // });
				on(searchField, 'focus', function(event){
					var menuId = dojo.attr(this, 'searchMenuId');
					if(menuId){
						var menu = dojo.byId(menuId);
						if(menu){
							menus._highlight(menu);
						}
					}
				});
				on(searchField, 'mousedown', function(event){
					stopBubble(event);
				});
			}
		});
	};

	this.getMenuText = function(item){
		//var spans = dojo.query('span', item);
    var span = item.querySelector('span');
//		if(spans.length>0){
		// 	var span = spans[spans.length-2];
			if(span){
				return span.innerHTML.replace(/&amp;/g, "&");
			}
	//		return '';
//		}
		for(nodeIndex in item.childNodes){
			var node = item.childNodes[nodeIndex];
			if(node.nodeType == 3){
				return node.data;
			}
		}
		return '';
	};
	
	this.sortMenu = function (a, b){
	  if(a.text<b.text){
		  return -1;
	  }
	  if(a.text>b.text){
		  return 1;
	  }
	  return 0;
	};

	this.decodeMenuItem = function(li){
		var attrs;
		require(["dojo/query"], function(query){
			var img = query("img", li)[0];
			var anchor = query("a", li)[0];
			var levels = parseInt(dojo.attr(anchor.parentNode.parentNode,'level'));
			//'padding':levels
			attrs = {'id':'navSearchItem'+anchor.id,'text':menus.getMenuText(anchor),'padding':1,'clickId':anchor.id,'className':'indent'};
			if(img){
				attrs['image'] = img.src;
			}
		});
		return attrs;
	}
	
	this.applyPadding = function(string,levels){
		var indent = '';
		for(var level = -1; level<levels;level++){
			indent += "    ";
		}
		return indent + string;
	}

}

toggleSideNav = function(){
  if(NEW_APPLINK){
    return;
  }
  let locked = document.body.hasAttribute('data-navbar-locked');
  if(locked){
    document.body.removeAttribute('data-navbar-locked');
  }
  else {
    document.body.setAttribute('data-navbar-locked', 'true');
    setTimeout(()=>{
      let search = document.getElementById('AppNavSearchInput');
      if(search){
        search.focus();
      }
    }, 200);
  }
}
	//These will override the old implementations
	
	/*
	 * Hides all open menus
	 */
	hideAllMenus=function(nf)
	{
		hidePopup();
		if(MOBILEDATEPICKER){
			closeDatePicker();
		}
		dojohelper.closePickerPopup();
		stopPopOver();
		for(var menuIndex in topLevelMenus) {
			var menu = topLevelMenus[menuIndex];
			if(menu.topMenu) {
				var tm = dojo.byId(menu.topMenu);
				if(!tm) {
					return;
				}
				menus._highlight(menu.topMenu)
			}
			if(menu._hideMenu) {
				menu._hideMenu(menu.topMenu);
			}
		}
		if(nf){
			delayedFocus(getFocusId(),true,100);
		}
	};
	
	/*
	 * Hides all open menus no focus
	*/
	hideAllMenusNF=function()
	{
		hidePopup();
		for(var menuIndex in topLevelMenus) {
			var menu = topLevelMenus[menuIndex];
			if(menu._hideMenu) {
				menu._hideMenu(menu.topMenu);
			}
		}
	};

	sendHeaderEvent=function(args){
		var posAndId = args.pop();
		var eventAndApp = args.pop();

		window.headerFocusId = posAndId.id;
		setFocusToId(posAndId.id);
		delete posAndId.id;
		if(eventAndApp.eventType=='showmenu')
			window.headerMenuPosition = posAndId;
		sendEvent(eventAndApp.eventType, eventAndApp.targetid, eventAndApp.value);
	}

