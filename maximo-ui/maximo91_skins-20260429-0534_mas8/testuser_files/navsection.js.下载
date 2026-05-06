/*
 *	Licensed Materials - Property of IBM
 *	"Restricted Materials of IBM"
 *	5724-U18, 5737-M66
 *	(C) COPYRIGHT IBM CORP. 2012,2025 All Rights Reserved.
 *	US Government Users Restricted Rights - Use, duplication or
 *	disclosure restricted by GSA ADP Schedule Contract with
 *	IBM Corp.
 **/

     var navContainerMinWidth = 75;
     var navIconWidth = 0; //50
/**
 * Resize the navsections. Each open section will get an equal percentage of vertical space. 
 * If a section uses less than it is given that space is shared among others. 
 * @param containerOrId
 * @param contHeight
 * @return
 */

function sizeNavSections(containerOrId, contHeight) {
	if(DESIGNMODE)
		return;
	var closedHeadingHeights = 0;
	var totalHeadingHeights = 0;
	var open = new Array();
	var containerOrId = dojo.byId(containerOrId);
	var containerState = dojo.attr(containerOrId, "state");
	if(containerState=="closed"){
		return;
	}
	var navSections = eval(containerOrId.id + "navSections");
	var sectionCount = getObjectLength(navSections);
	var open = new Array();
	for (id in navSections) {
		var secDef = navSections[id];
		var tempHeight = dojo.byId(id+"_head").offsetHeight;
		if(tempHeight == 0)
			tempHeight = 30;
		totalHeadingHeights += (secDef.headingHeight = tempHeight + 1);
		if(secDef.state == "min") {
			closedHeadingHeights += secDef.headingHeight;
		}
		else {
			open.push(id);
		}
	}
	var reclaimed = 0;
	var scrolled = new Array();
	var lastOpen;
	var distributedHeight = Math.ceil((contHeight - closedHeadingHeights) / open.length);
	for (id in navSections) {
		var secDef = navSections[id];
		var menuContainer = dojo.byId(id + "_content");
		var sec = dojo.byId(id);
		switch (secDef.state) {
			case "min":
				dojo.style(menuContainer, {"display":"none"});
				dojo.style(sec, {"height" : secDef.headingHeight + "px"});
				break;
			case "normal":
			case "max":
				var height = distributedHeight;
				lastOpen = id;
				dojo.style(sec, {"height" : height + "px"});
				var inner = dojo.byId(menuContainer.id + "_inner");
				dojo.style(sec, {"height" : height + "px"});
				dojo.style(menuContainer, {"height":"", "overflowY":"auto", "overflowX":"hidden", "display":""});
				dojo.style(inner, {"display":""});
				var adjust = 1; //deals with unexplained div offset in IE
				var extra = (height - secDef.headingHeight) - inner.offsetHeight - adjust;
				if(extra>=0) {
					if(dojo.isIE > 0) {
						adjust = 2;
					}
					reclaimed += extra + adjust;
					height -= extra - adjust;
				}
				else {
					scrolled.push(id);
				}
				dojo.style(sec, {"height" : height + "px"});
				dojo.style(menuContainer, {"height":(height - secDef.headingHeight) + "px", "overflowY":"auto", "overflowX":"hidden"});
				break;
		}
	}
	if(reclaimed > 0) {
		if(scrolled.length == 0 && lastOpen) {
			scrolled.push(lastOpen);
		}
		if(scrolled.length>0) {
			//distribute reclaimed amount across all scrolled
			var unused = 0;
			reclaimed = Math.ceil((reclaimed / scrolled.length));
			for(var i = 0;i<scrolled.length;i++) {
				reclaimed += unused;
				var sizeContent = dojo.byId(scrolled[i] + "_content");
				var unused = (sizeContent.offsetHeight + reclaimed) - sizeContent.scrollHeight;
				var secDef = navSections[scrolled[i]];
				if(unused < 0 || scrolled[i]==lastOpen) {
					unused = 0;  
				}
				var height = (sizeContent.offsetHeight+(reclaimed-unused));
				dojo.style(sizeContent,{"height":height-1+"px","overflowY":"auto","overflowX":"hidden"});
				dojo.style(sizeContent.parentNode,{"height":(height+secDef.headingHeight)+"px"});
				if(unused > 0) {
					dojo.style(sizeContent,{"overflowY":"hidden"});
				}
			}
			if(unused > 0) {
				var sizeContent = dojo.byId(lastOpen + "_content");
				var height = sizeContent.offsetHeight+unused;
				dojo.style(sizeContent,{"height":height+"px"});
				dojo.style(sizeContent.parentNode,{"height":(height+secDef.headingHeight)+"px"});
			}
		}
	}
}

/**
 * Find out how much extra space this element is using
 * @param content
 * @param headHeight
 * @return
 */
function getExtraSpace(content, headHeight) {
	var contentHeight = (content.parentNode.offsetHeight - headHeight) - 3;
	var inner = dojo.byId(content.id + "_inner");
	return (contentHeight - inner.offsetHeight);
}

/**
 * Used to resize the navbar and adjacent column
 * We allow supression of section sizing as the scrolling is reset on them and we don't really want to do that if
 * user closes and open the whole container
 * @param containerOrId
 * @return
 */
var dragScroll = false;
function sizePanes(containerOrId, sections) {
  //does nothing now
}

/**
 * Used to remove any visble trace of the navcontainer from the page
 * @param navContainerId
 * @return
 */ 
function killNavContainer(navContainerId) {
	var navContainer = dojo.byId(navContainerId);
	if (!navContainer)
		return;
	var sectionCol = findParent(navContainer, "td", 2);
	if(!sectionCol)
		return;
	sectionCol.style.display="none";
	var section = findParent(sectionCol, "table", 1);
	if(!section)
		return;
	dojo.attr(section, {
		"cellspacing": "0"
		});
	dojo.style(section, {
		"padding": "0px", 
		"borderSpacing" : "0px"
	});
	var adjacentCol = section.rows[0].cells[sectionCol.cellIndex+1];
	pageScrollArea = adjacentCol;
	dojo.style(adjacentCol, {
		"padding": "0px" 
	});

}

function getAdjacentCol(navContainerId) {
	var navContainer = dojo.byId(navContainerId);
	var adjacentColId = dojo.attr(navContainer, "adjacentColId");
	var sectionCol = findParent(navContainer, "td", 2);
	var sectionRow = sectionCol.parentNode;
	var adjacentCol;
	if(adjacentColId) {
		adjacentCol = dojo.byId(adjacentColId);
	}
	else {
		adjacentCol = sectionRow.cells[sectionCol.cellIndex + 1];
		if(adjacentCol && dojo.attr(adjacentCol, "className")=="navSep") {
			adjacentCol = sectionRow.cells[sectionCol.cellIndex + 2];
		}
	}
	
	var handleOffset = 1;
	var collapseDir = "L";
	if (!adjacentCol) {
		try
		{
			adjacentCol = sectionRow.cells[sectionCol.cellIndex - 1];
			if(adjacentCol) {
				collapseDir = "R";
				handleOffset = 0;
			}
		}
		catch(error)
		{} //safety for bad colindex
	}
	if(sectionCol) {
		dojo.attr(navContainer, {"navcolId" : sectionCol.id});
		dojo.style( sectionCol , {"background":"#efefef"});
	}
	pageScrollArea = adjacentCol;
	return {"adjacentCol":adjacentCol,"collapseDir":collapseDir,"handleOffset":handleOffset};
}

/**
 * Called after initial render to allow us to create the control structure
 * within the existing DOM
 * 
 * @param navContainerId
 * @return
 */
function fixNavContainer(navContainerId) {
	NAV_SECTION = true;
	dojo.require("dojox.fx");
	var navContainer = dojo.byId(navContainerId);
	if (!navContainer){
	  return;
  }

  let headerHeight = 0;
  let titlbarBack = document.querySelector('.titlebarback');
  headerHeight += titlbarBack?titlbarBack.offsetHeight:0;
  let firstToolbar = document.querySelector('.tb');
  headerHeight += firstToolbar?firstToolbar.offsetHeight:0;
  if (NEW_APPLINK) {
    let breadCrumbs = document.querySelector('.appBreadCrumbs');
    headerHeight += breadCrumbs?breadCrumbs.offsetHeight:0;
  }

  let content = document.getElementById('SystemNavAppContentg-sc_div');

  let menuContainer = document.getElementById('SystemNavAppContent_menu-sc_div');
  if(menuContainer){
    setTimeout(()=>{
      let customHeader = document.querySelector('.mx--custom-header');
      let extraHeaderHeight = 0;
      if(customHeader){
        extraHeaderHeight = customHeader.getBoundingClientRect().height;
      }
      menuContainer.style.height = `calc(100vh - ${extraHeaderHeight + headerHeight}px)`;
    }, 200);
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

	var sectionCol = findParent(navContainer, "td", 2);
  if(sectionCol){
    content = content?content:sectionCol.nextElementSibling.firstElementChild;
    sectionCol.style.width = navContainer.style.width;
    sectionCol.style.paddingLeft = '8px';
    sectionCol.style.paddingRight = '8px';
    if(parseInt(sectionCol.style.width)===0){
      sectionCol.style.display='none';
    }
    else {
      sectionCol.firstElementChild.style.width = sectionCol.style.width;
      sectionCol.firstElementChild.style.position = 'relative';
      if(!DESIGNMODE && !MOBILE){
        new CustomScrollable(sectionCol.firstElementChild, {overflowX: 'none', dragContent: true,   innerPadding: { 
                paddingInlineEnd: `0px`,
             }
        });
      }
      sizePanes(navContainer, true);
    }
  }
  if(content && !DESIGNMODE){
      setTimeout(()=>{
        let customHeader = document.querySelector('.mx--custom-header');
        let extraHeaderHeight = 0;
        if(customHeader){
          extraHeaderHeight = customHeader.getBoundingClientRect().height;
        }
        if(sectionCol){
          sectionCol.firstElementChild.style.height = `calc(100vh - ${extraHeaderHeight + headerHeight}px)`;
        }
        content.style.height = `calc(100vh - ${extraHeaderHeight + headerHeight}px)`;
      }, 200);

    if(sectionCol){
      setTimeout(()=>{
        let startWidth = sectionCol.getBoundingClientRect().right;
        if(document.body.dir === 'rtl'){
          startWidth = window.innerWidth - sectionCol.getBoundingClientRect().left;
        }
		if(startWidth === 0) {
			startWidth = (window.matchMedia('(min-width: 1280px)').matches) ? "135" : "105";
		}
        setNavWidth(startWidth);
        content.style.width = `calc(100vw - var(--data-nav-width))`;
        createCSSClass('.hbouter > table',`max-width: calc(100vw - var(--data-nav-width))`);
      }, 200);
      
    }
    content.style.position = 'relative';
    if(DESIGNMODE){
      content.style.overFlowX = 'auto';
      content.style.overFlowY = 'visibleignore everything';
    }
    else {
      content.style.overflow = 'auto';
      if(!MOBILE){
        new CustomScrollable(content);
      } 
    }
  }
  
	return navContainer;
}

function setNavWidth(width){
  document.body.setAttribute('data-nav-width', width);
  document.documentElement.style.setProperty('--data-nav-width', width + "px");
}

function getNavWidth(){
  return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--data-nav-width'));
}

/**
 * Change size state of a navContrainer expanded / collapsed
 * 
 * @param img
 * @param navContainer
 * @param state
 */
function setNavContainerState(navContainer, state, dragged, init) {
	var collapseDir = dojo.attr(navContainer, "collapseDir");
	var button = dojo.byId(navContainer.id + "_collapseImage");
	var setOpen = dojo.attr(navContainer, "state");
	if(undef(state)) {
		state = setOpen;
	}
	var navCol = dojo.byId(dojo.attr(navContainer, "navcolId"));
	if(dragged || state=="icon") {
		dojo.attr( navContainer, {
			"maxwidth" : parseInt(navContainer.style.width)
		});
	}
	if(state=="icon" && navIconWidth ==0 ) {
		state = "closed";
	}
	var search = dojo.query('DIV[navSearch="true"]', navContainer.parentNode)[0];
	dojo.publish("navContainerState", state);
	if(button) {
		button.setAttribute('state',state);
		if (state=="open" || state=="icon") {
			dojo.style(search, {'display':''});
			dojo.style(button, {
				"backgroundImage" : dojo.style(button, "backgroundImage").replace("collapsed", "expanded")
			});
			dojo.attr(button, {
				"title" : navContainerStrings.collapse,
				"aria-label" : navContainerStrings.collapse
			});
			var width = (state=="icon")? navIconWidth : parseInt(navContainer.getAttribute("maxwidth"));
			if(state!="icon") {
				if(dragged) {
					width=navContainer.clientWidth;
				}
			}
			var navMenuItems = dojo.query(".navMenus", navContainer);
			for(var tnIndex=0;tnIndex<navMenuItems.length;tnIndex++) {
				var tn = navMenuItems[tnIndex];
				if(state=="icon") {
					appendClass(tn,"hide");
				}
				else {
					removeClass(tn,"hide");
				}
			}
			dojo.style(navContainer, {
				"visibility" : "visible",
				"overflow" : "hidden",
        "width": "100%",
				//"width" : width+"px",
				"position" : "",
				"left" : "0px",
				"display" : "block"
			});
		} 
		else if (state=="closed") {
			width = 1;
			dojo.style(search, {'display':'none'});
			dojo.style(button, {
				"backgroundImage" : dojo.style(button, "backgroundImage").replace("expanded", "collapsed")
			});
			dojo.attr(button, {
				"title" : navContainerStrings.expand,
				"aria-label" : navContainerStrings.expand
			});
			dojo.style(navContainer, {
				"visibility" : "hidden",
				"overflow" : "hidden",
				"width" : width+"px",
				"position" : "relative",
				"left" : "-1px"
			});
		}
		dojo.attr( navContainer, {
			"state":state
		});
		if(!init){
			queueManager.queueEvent(new Event("setleftnavwidth", APPTARGET, width, REQUESTTYPE_HIGHASYNC), "text/json", "json", null, null);
		}
	}
	sizePanes(navContainer,false);
}

function toggleNavContainer(evt){
  let button = evt.currentTarget;
  let scroller = button.closest('.custom-scroller-outer');
  if(scroller.classList.contains('minimized')){
    scroller.classList.remove('minimized');
  }
  else {
    scroller.classList.add('minimized');
  }
  
  let count = 0;
  let interval = setInterval(()=>{
    count=count+10;
    let appContent = dojo.byId('SystemNavAppContent_menu-sc');
    if(!appContent){
      appContent = button.closest('.sectioncol');
    }
    if(appContent){
        if(document.body.dir=="rtl") {
        setNavWidth(window.innerWidth - appContent.getBoundingClientRect().left);
        }
        else {
        setNavWidth(appContent.getBoundingClientRect().right);
        }
    }
    if(count>=220){
      window.clearInterval(interval);
    }
  }, 10)
}

/**
 * Allows min/max toggle when header is clicked
 * @param sectionId
 * @return
 */
function toggleSectionState(sectionId) {
	var containerId = dojo.attr(dojo.byId(sectionId), "containerId");
	var navSections = eval(containerId + "navSections");
	var navSec = navSections[sectionId];
	switch(navSec.state) {
		case 'max':
			toggleSectionView(null, sectionId, 'min');
			break;
		case 'normal':
			toggleSectionView(null, sectionId, 'max');
			break;
		case 'min':
			toggleSectionView(null, sectionId, 'normal');
			break;
	}
}

function setSectionState(section, state){
	if(!section.history){
		section.history = new Array(section.state);
	}
	section.history.push(state); //last one is always current
	section.state = state;
}

function previousSectionStates(sectionOrContainerId) {
	var navSections;
	try {
		navSections = eval(sectionOrContainerId + "navSections");
	} catch(error){
		sectionOrContainerId = dojo.attr(dojo.byId(sectionOrContainerId), "containerId");
		navSections = eval(sectionOrContainerId + "navSections");
	}
	if(navSections){
		for (id in navSections) {
			var secDef = navSections[id];
			secDef.history.pop(); //remove current
			setSectionState(secDef, secDef.history.pop()); 
		}
		sizePanes(sectionOrContainerId,true);
	}
}

/**
 * expand / collapse navsections
 * 
 * @param sectionId
 * @param type
 */
function toggleSectionView(element, sectionId, type, event) {
	var containerId = dojo.attr(dojo.byId(sectionId), "containerId");
	var navSections = eval(containerId + "navSections");
	var navSec = navSections[sectionId];
	if(type==navSec.state) {
		return;
	}
	if(type == 'normal' && navSec.state == 'max'){
		previousSectionStates(containerId);
	}
	if (!SCREENREADER) {
		dojo.forEach(dojo.query("> div.hoverButton", dojo.byId(sectionId + "_head")), function(element) {
			dojo.style(element, {
				"display" : "none"
			});
		});
	}
	if (type == 'max') {
		for (id in navSections) {
			setSectionState(navSections[id], 'min');
		}
		navSec.history.pop(); //remove min that was just added
		setSectionState(navSec, type);
		sizePanes(containerId,true);
	} 
	else if (type == 'normal') {
		for (id in navSections) {
			var secDef = navSections[id];
			if (secDef.state == "max"){
				setSectionState(secDef, 'normal');
			}
		}
		setSectionState(navSec, type);
		sizePanes(containerId,true);
	}
	else if (type == 'min') {
		var totalOpen = 0;
		for (id in navSections) {
			var secDef = navSections[id];
			if (secDef.state != "min") {
				totalOpen++;
			}
		}
		if (totalOpen == 2) {
			for (id in navSections) {
				var secDef = navSections[id];
				if (secDef.state != "min") {
					setSectionState(secDef, 'max');
				}
			}
		}
		else if (totalOpen == 1) {
			var navSectionsOrder = eval(containerId + "navSectionsOrder");
			var pos = dojo.indexOf(navSectionsOrder, sectionId);
			for (id in navSections) {
				setSectionState(navSections[id], 'min');
			}
			if(!SCREENREADER) {
				if (pos == 0) {
					setSectionState(navSections[navSectionsOrder[1]], 'max');
				}
				else {
					setSectionState(navSections[navSectionsOrder[pos-1]], 'max');
				}
			}
		}
		setSectionState(navSec, type);
		sizePanes(containerId,true);
	}
	var section = dojo.byId(sectionId);
	if(!event || event.type!='keyup'){
		programmaticEvent( section,"mouseout");
		programmaticEvent( section,"mouseover");
	}
}

function fillAppNavSection(responseObj, ioArgs){
  var events = dojo.fromJson(ioArgs.args.content.events);
	var id = events[0].navSectionId;
	var render = events[0].render;
	var cName= events[0].classname;
	var section = dojo.byId(id);
	if (undef(responseObj)) {
		section.style.display = "none";
		return;
	}
	
	if (responseObj)
		responseObj = (responseObj.menu) ? responseObj.menu : responseObj;
	dojo.require("dojox.html");
	dojo.addOnLoad(function(){
    if(!NEW_APPLINK){
      var holder = document.createElement('div');
      holder.className = 'application-navigation-menu';
	  holder.role = 'navigation';
	  if(SCREENREADER) {
		holder.ariaLabel = NAV_MENU;
	  }
      document.body.insertBefore(holder, document.body.firstElementChild);
      document.body.classList.add('has-app-nav');
      buildNavigationMenu(0, id, id, responseObj, holder, cName, events[0].showImages, events[0].isQuery, true);
    }
	});
}

/**
 * Used as callback for fetchNavigationMenu
 * 
 * @param responseObj
 * @param ioArgs
 * @return
 */
function fillNavSection(responseObj, ioArgs) {
	var events = dojo.fromJson(ioArgs.args.content.events);
	var id = events[0].navSectionId;
	var render = events[0].render;
	var cName= events[0].classname;
	var section = dojo.byId(id);
	if (undef(responseObj)) {
		section.style.display = "none";
		return;
	}
	
	if (responseObj)
		responseObj = (responseObj.menu) ? responseObj.menu : responseObj;
	responseObj["labelledBy"]=ioArgs.labelledBy;
	var holder = dojo.byId(id + "_content");
	dojo.require("dojox.html");
	dojo.addOnLoad(function(){
		buildNavigationMenu(0, id, id, responseObj, holder, cName, events[0].showImages, events[0].isQuery);
		var navSections = eval(events[0].containerId + "navSections");
		//if(!render || render != "true") {
			sizePanes(events[0].containerId,true);
		//}
	});
}

var QUERY_MENU_ITEMS = null;
var queryFieldId = 'mainQueryMenu';

// New function to update dropdown with a specific query name
function updateQueryDropdownWithName(queryName) 
{
	var queryInput = document.getElementById(queryFieldId);
	if(!queryInput || !QUERY_MENU_ITEMS || !queryName) {
		return;
	}

	// First, try to find the query in existing QUERY_MENU_ITEMS
	var foundInList = false;
	for(var i = 0; i < QUERY_MENU_ITEMS.length; i++) {
		if(QUERY_MENU_ITEMS[i].text === queryName || QUERY_MENU_ITEMS[i].value === queryName) {
			// Mark this one as current
			QUERY_MENU_ITEMS[i].innerClassName = 'checked';
			QUERY_MENU_ITEMS[i].current = true;
			foundInList = true;
		} else {
			// Unmark all others
			QUERY_MENU_ITEMS[i].innerClassName = '';
			QUERY_MENU_ITEMS[i].current = false;
		}
	}

	// Update the dropdown display regardless of whether it's in the list
	// This handles queries beyond the limit without adding them to the array
	queryInput.innerText = queryName;
	queryInput.title = queryName;

	var queryButton = document.getElementById('app_query_menu');
	if(queryButton) {
		queryButton.setAttribute('aria-label', queryName);
	}
}

function setQuery(menuItem, menuId){
  topLevelMenus[menuId].menuClick(menuItem);
  QUERY_MENU_ITEMS.forEach(function(item){
    item.current = item.value === menuItem.value;
  });
  let queryInput = document.getElementById(queryFieldId);
  if(queryInput){
    queryInput.innerText = menuItem.text;
    queryInput.title = menuItem.text;
  }
}

function getFilteredQueryItemsLength(queryMenuItems, searchValue){
  return filterQueryItems(queryMenuItems, searchValue).length;
}

function filterQueryItems(queryMenuItems, searchValue){
  if(!searchValue){
    return queryMenuItems;
  }
  searchValue = searchValue.toLowerCase();
  let returnItems = queryMenuItems.filter((item) => {
    return item.text.toLowerCase().includes(searchValue);
  });
  return (returnItems.length>0?returnItems:{});
}

function buildQueryDropdown(menuDef, additional){
  let items = menuDef.items;
  QUERY_MENU_ITEMS = menuDef.items;
  let containerId = additional.labelledBy.substring(0, additional.labelledBy.lastIndexOf('_'))+'_content_inner';
  let container = document.getElementById(containerId);
  if(container){
	if(menuDef.overflow){
		items.push(menuDef.overflow);
	}  
    let button = document.createElement('button');
    button.id = 'app_query_menu';
    let input = document.createElement('div');
    input.id = queryFieldId;
    let queryLabelElement = document.getElementById(additional.labelledBy);
    let queryLabel = queryLabelElement.innerText;
    queryLabelElement.style.display = 'none';

    input.innerText = queryLabel;
    button.setAttribute('aria-haspopup', 'menu');
	button.setAttribute('aria-label', queryLabel);
	input.setAttribute('readonly', 'true');
    input.className = 'fld text tt queryField menuSearch menuQuery';
    let currentValue = '';
    menuDef.items.some(function(item, itemIndex){
      if(item.innerClassName === 'checked'){
        input.innerText = input.title = item.text;
		setTimeout(function(){
			document.getElementById('app_query_menu').setAttribute('aria-label', input.innerText);
		}, 100);
        return true;
      }
    });

    let QueryMenu;

    function showQueryMenu(evt){
      if(evt.currentTarget.classList.contains('no-pointer-events')){
        return;
      }
      let open = evt.target.hasAttribute('data-menu-open');
      let menuId = null;
      if(!open){
        menus._destroyMenus();
        menus.holder = document.getElementById("menuholdertd"); 
        let searchValue = document.getElementById('nav_search_field').value;
        var menu = menus.buildMenu("mainrec_menus",{"id":"NORMAL","type":-1, "menuClick": "setQuery", "items":filterQueryItems(QUERY_MENU_ITEMS, searchValue),"openat":"match"},null);
        menu.setAttribute('data-query-dropdown','true');
        menu.setAttribute('target',input.id);
        input.setAttribute('data-menu-id', menu.id);
        showingMenu = true;
        stopFocus = true;
        lastClickElement = input.parentElement;
        evt.stopPropagation();
        menus._showMenu(menu.id,true);
      }
      else {
        let menuId = input.getAttribute('data-menu-id');
        menus._hideMenu(menuId);
      }
    }
    button.addEventListener('mousedown', function(evt){evt.stopPropagation()});
    button.addEventListener('click', function(evt){showQueryMenu(evt)});
    button.addEventListener('focus', function(evt){setFocusId(null,input)});
    button.addEventListener('keydown', function(evt){if(['ArrowDown'].includes(evt.key)){showQueryMenu(evt);evt.stopPropagation();}});
    button.addEventListener('keyup', function(evt){if(['Enter'].includes(evt.key)){showQueryMenu(evt);evt.stopPropagation();}});
    
    button.appendChild(input);
    button.className = 'menuQuery-button';
    
    let existingInput = document.getElementById('mainQueryMenu');
    if(!existingInput){
      let navSearch = document.querySelector('div[navsearch=true]');
      let searchResults =  document.querySelector('.menu-search-results');
      navSearch.parentElement.appendChild(button);
    }
  }
}
/**
 * Handle keyboard and mouse interactions to control sidebar visibility.
 */

function handleAccessKey() {
	const menu = document.querySelector('.application-navigation-menu');
	// Listen for keydown events
	document.addEventListener('keydown', (event) => {
		// Check if ALT + G was pressed
		if (event?.altKey && event?.code?.replace('Key', '')?.toLowerCase() === 'g') {
			menu?.classList.add('hovered');
		}

		// Close the sidebar if Escape, Enter or Space key pressed
		if (event?.key === 'Escape' || event?.key === 'Enter' || event.key === ' ') {
			document.querySelector('.application-navigation-menu')?.classList.remove('hovered');
		}
	});

	// Listen for clicks to close the sidebar if clicked outside
	document.addEventListener('click', (event) => {
		if (menu && !menu.contains(event.target)) {
			menu.classList.remove('hovered');
		}
	});
}

/**
 * Builds new navsection content menus
 * 
 * @param level
 * @param id
 * @param menuDef
 * @param holder
 * @param className
 * @return
 */
function buildNavigationMenu(level, navId, id, menuDef, holder, className, showImages, isQuery, appNav) {
	handleAccessKey() // TODO: Remove this once dynamic keyboard shortcut functionality is implemented
  if(QUERY_DROPDOWN && isQuery === 'true'){
    buildQueryDropdown(menuDef, {"labelledBy":id+"_label","args":{"content":{"events": dojo.toJson([{"navSectionId":id,"containerId" : "<%=containerId%>","showImages" : true, "isQuery" : isQuery,"render" : "true"}])}}});
    return;
  }
	var mcId = id+"_MC";
	var navMenus = topLevelMenus[mcId];
	if(!navMenus) {
		navMenus = new MenuController(mcId);
	}
 	let tempHolder = dojo.query("div", holder)[0];
  if(tempHolder){
    holder = tempHolder;
  }
 	navMenus.holder = holder;
	while (holder.hasChildNodes()) {
		holder.removeChild(holder.lastChild);
	}
	if(className && className!="") {
		className = " "+ className;
	}
	menuDef.baseClassName = "navMenus" + className;
	menuDef.hasSubClassName = "navSubmenu" + className;
	menuDef.subClassName = "subNavMenus"+ className;
	menuDef.staticMenu = true;
	menuDef.id = id+"_menu";
  let menuHolder = document.createElement('div');
  menuHolder.id = `${menuDef.id}_holder`;
  let container = holder;
  if(appNav){
    container = menuHolder;
    menuDef.items.forEach(topLevelItem=>{
      let imageName = 'modimg_default';
      if(topLevelItem.image){
        imageName = topLevelItem.image.substring(0, topLevelItem.image.lastIndexOf('.'));
      }
      topLevelItem.image = `Left_Nav_white/${imageName}.svg`;
    });
    let searchDiv = document.createElement('div');
    searchDiv.className = 'app-nav-search app-nav-dark';
    let searchImage = document.createElement('img');
    searchImage.src = 'search.svg';
	searchImage.title = navSearchString;
	if(SCREENREADER){
		searchImage.setAttribute('aria-hidden','true');
	}
    let searchField = document.createElement('input');
    Object.assign(searchField, {
      id: 'AppNavSearchInput',
      placeholder: navSearchString,
      autocomplete: 'off'
    });
    searchDiv.appendChild(searchImage);
    searchDiv.appendChild(searchField);
    if(!SCREENREADER){
      let searchClearButton = document.createElement('button');
      searchClearButton.className = 'clearButton';
      searchField.style.paddingInlineEnd = '26px';
      searchField.style.zIndex = '0';
      searchClearButton.style.marginTop = '6px';
      searchClearButton.id = 'start_nav_search_field_clear';
      searchClearButton.style.position='absolute';

      searchClearButton.style[document.body.dir!='rtl'?'right':'left']= '10px';
      let searchClearImage = document.createElement('img');
      searchClearImage.src = 'close.gif';
      searchClearImage.alt = 'Clear';
      searchClearImage.style.filter = 'invert(1)';
      searchClearImage.setAttribute('draggable','false');
      searchClearButton.appendChild(searchClearImage);
      searchDiv.appendChild(searchClearButton);
      searchClearButton.addEventListener('keypress', function(event){
        if(event.key === 'Enter'){
          searchField.value='';
          menus.menuSearch(menuHolder,searchHolder,searchField,{'group':'li.navSubmenu','title':'a'});
          searchField.focus();
        }
      });
      searchClearButton.addEventListener('click', function(event){
        searchField.value='';
        menus.menuSearch(menuHolder,searchHolder,searchField,{'group':'li.navSubmenu','title':'a'});
        searchField.focus();
      })
    }
    holder.appendChild(searchDiv);
    
    let searchHolder = document.createElement('div');
    searchHolder.className='menu-search-results app-menu-search-results';
    searchHolder.id = 'appMenuSearch';
    searchHolder.setAttribute('data-search-input-id', 'AppNavSearchInput');
    searchHolder.setAttribute('data-menu-holder-id', menuHolder.id);

    searchField.addEventListener('keyup', function(event){
      if(!hasKeyCode(event, KEYCODE_ESC)){
        if(event.currentTarget.value!==''){
          menus.menuSearch(menuHolder,searchHolder,this,{'group':'li.navSubmenu','title':'a'});
        }
        else {
          menus.hideSearch();
        }
      }
    });

    holder.appendChild(searchHolder);

    //PIN Start Center icon to SIDE NAV MENU
    if (STARTCENTERACCESS){
			let homeDiv = document.createElement('div');
			let homeAnchor = document.createElement('a');
			let titleDiv = document.createElement('div');
			titleDiv.innerText = HOME_LINK_TEXT;

			homeDiv.className = 'app-nav-home app-nav-dark' + (APPID === 'startcntr'?' menu-item-highlight':'');
				
			let homeImage = document.createElement('img');
			homeImage.src = 'Left_Nav_white/modimg_startcenter.svg';
			if (SCREENREADER){
				titleDiv.id = 'homelink';
				homeImage.setAttribute('aria-labelledby', 'homelink')
			}
			homeAnchor.href = 'Javascript: sendEvent("changeapp","startcntr","startcntr")';
			homeAnchor.appendChild(homeImage);
			homeAnchor.appendChild(titleDiv)
			homeAnchor.id="startcenter"; // TODO: Remove this once dynamic keyboard shortcut functionality is implemented
			homeDiv.appendChild(homeAnchor);
			addLoadMethod("addHotKey('ALT+C','startcenter','click');"); // TODO: Remove this once dynamic keyboard shortcut functionality is implemented
			holder.appendChild(homeDiv);
		}

		//PIN Operational Dashboard icon to SIDE NAV MENU
		if (OPDASHBOARDACCESS) {
			let opdDiv = document.createElement('div');
			let opdAnchor = document.createElement('a');
			let opdTitleDiv = document.createElement('div');
			opdTitleDiv.innerText = OPDASHBOARD_LINK_TEXT;

			opdDiv.className = 'app-nav-home app-nav-dark' + (APPID === 'opdashboard'?' menu-item-highlight':'');
				
			let opdImage = document.createElement('img');
			opdImage.src = 'Left_Nav_white/modimg_operationalDashboard.svg';
			if (SCREENREADER){
				opdTitleDiv.id = 'opdashboardLink';
				opdImage.setAttribute('aria-labelledby', 'opdashboardLink')
			}
			opdAnchor.href = "Javascript: openNextGenApp('opdashboard','','APP', OPDASHBOARD_LINK_TEXT,'REACT');";
			opdAnchor.appendChild(opdImage);
			opdAnchor.appendChild(opdTitleDiv)
			opdDiv.appendChild(opdAnchor);
			holder.appendChild(opdDiv);
		}

    holder.appendChild(menuHolder);

    holder.addEventListener('mouseenter', ()=>{
      // window.setTimeout(()=>{
      //   document.body.setAttribute('data-navbar-hovered', 'true');
      // }, 300);
    });
    
    holder.addEventListener('focusin', ()=>{
      document.body.setAttribute('data-navbar-focusin', 'true');  
    });
  
    holder.addEventListener('mouseleave', ()=>{
      document.body.removeAttribute('data-navbar-hovered');
    });
    
    holder.addEventListener('focusout', (evt)=>{
      document.body.removeAttribute('data-navbar-focusin');
      window.setTimeout(()=>{
        if(!document.body.hasAttribute('data-navbar-locked') && document.body.getAttribute('data-navbar-focusin') !== 'true'){
          menus.collapseAll(evt.currentTarget);
        }
      }, 100);
      
    });


    ['mouseleave', 'focusout'].forEach(function(e) {
      holder.addEventListener(e, ()=>{
        document.body.removeAttribute('data-navbar-hovered');
      });
    });

  }
  var menu = navMenus.buildMenuLevel(0,APPTARGET,menuDef, appNav?'maximo-menu-dark':'');
	if(undef(menu)) {
		return;
	}

  container.appendChild(menu);
	navMenus.trueTop = menu.id;
	dojo.style(holder, {"overFlow":"hidden"});
	dojo.style(menu, {"display":"", "position":"static"});
  
  if(appNav){
    menu.classList.add('Left-Navigation-Menu');
	if(menu.attributes['aria-labelledby'] && menu.attributes['aria-labelledby'].value==='undefined'){
		menu.removeAttribute('aria-labelledby')
	}
    new CustomScrollable(container.parentElement, {overflowX: 'none', innerPadding: null, dragContent: true, onScroll: ()=>{} });
    let scroller = menu.closest('.custom-scroller');
    (scroller && scroller.parentNode?scroller.parentNode:menu).addEventListener('mouseleave', (event)=>{
        if(!document.body.hasAttribute('data-navbar-locked') && document.body.getAttribute('data-navbar-focusin') !== 'true'){
          menus.collapseAll(event.currentTarget);
        }
    })
}
}
	

/**
 * expand / collapse tree items
 * 
 * @param img
 * @param sectionId
 * @return
 */
function toggleMenuView(imgOrId, sectionOrId) {
	var section = dojo.byId(sectionOrId);
	var img = dojo.byId(imgOrId);
	if (section.style.display == "none" || section.offsetHeight == 1) {
		dojo.attr(img, {
			"src" : img.src.replace("collapsed", "expanded")
		});
		img.src = img.src.replace("collapsed", "expanded");
		dojo.style(section, {
			"display" : ""
		});
	} else {
		dojo.attr(img, {
			"src" : img.src.replace("expanded", "collapsed")
		});
		img.src = img.src.replace("expanded", "collapsed");
		dojo.style(section, {
			"display" : "none"
		});
	}
}

/**
 * Add an item to the new navsection content menu
 * 
 * @param level
 * @param itemIndex
 * @param ul
 * @param item
 * @param className
 * @return
 */
function treeItemHighlight(event) {
	var div = getSourceElement(event);
	if (div.tagName != "DIV") {
		div = findParent(div, "DIV", 1);
	}
	switch (event.type) {
	case "focus":
	case "mouseover":
		div.className = div.className.replace("acMenuDIV", "acMenuhoverDIV");
		dojo.forEach(dojo.query("span", div), function(element) {
			dojo.attr(element, {
				"origclass" : element.className
			});
			dojo.attr(element, {
				"class" : "acMenuHoverText"
			});
			dojo.connect(element, "mouseover", element, function(event) {
				cancelEvent(event);
			}, true);
			dojo.style(element, {
				pointerEvents : "none"
			});
		});
		break;
	case "mouseout":
	case "blur":
		div.className = div.className.replace("acMenuhoverDIV", "acMenuDIV");
		dojo.forEach(dojo.query("span", div), function(element) {
			dojo.attr(element, {
				"class" : dojo.attr(element, "origclass")
			});
		});
		break;
	}
}

function addTreeStyleMenuItem(navId, id, level, itemIndex, ul, item, className, showImages, isQuery) {
	var li = document.createElement("li");
	if(item.disabled) {
		dojo.attr(li, {"enabled":"false","aria-disabled":"true"});
	}
	dojo.attr(li, {
		"role" : "presentation",
		"class" : "acMenuLI",
		"id": ul.id + item.id
	});
	var div = document.createElement("div");
	div.id = li.id + "_div";
	dojo.connect(div, "focus", div, function(event) {
		treeItemHighlight(event);
	});
	dojo.connect(div, "mouseover", div, function(event) {
		treeItemHighlight(event);
	});
	dojo.connect(div, "blur", div, function(event) {
		treeItemHighlight(event);
	});
	dojo.connect(div, "mouseout", div, function(event) {
		treeItemHighlight(event);
	});
	div.className = "acMenuDIV";
	if (item.sub) {
		var plusMinus = document.createElement("img");
		plusMinus.id = li.id + "_plusminus";
		plusMinus.src = IMAGE_PATH + "tasknav/" + ((item.sub) ? "node_collapsed.png" : "node_nochildren.png");
		plusMinus.className = "acMenuImg";
        plusMinus.alt = "";
		dojo.attr(plusMinus, {
			"wait" : IMAGE_PATH + "tasknav/node_collapsed.png"
		});
		div.appendChild(plusMinus);
	} else {
		if(document.body.dir=="rtl") {
			dojo.style(div, {
				"paddingRight" : "13px"
			});
		}
		else {
			dojo.style(div, {
				"paddingLeft" : "13px"
			});
		}

	}
	if (level == 0 && showImages) {
		var menuImage = document.createElement("img");
		menuImage.className = "acMenuImg";
        menuImage.alt = "";
		if(item.disabled) {
			menuImage.className += " opacity_20";
		}
		menuImage.src = IMAGE_PATH + ((undef(item.image)) ? "menus/blank.gif" : item.image);
		div.appendChild(menuImage);
	}
	var tNode = document.createElement("SPAN");
	tNode.id = li.id + "_label";
	dojo.style(tNode, {
		"display" : "inline",
		"whiteSpace" : "normal",
		"role":"presentation"
	});
	div.appendChild(tNode);
	if (level > 0) {
		tNode.className = "acSubMenuText";
	}
	if(item.disabled) {
		tNode.className += " opacity_20";
	}
	tNode.innerHTML = item.text;// uncomment for text wrapping test + " | this
	// is some extra text to make things really
	// long";
	if (level == 0 && itemIndex == 0)
		div.tabIndex = "0";
	dojo.attr(div, {
		"role" : "treeitem",
		"aria-labelledby" : tNode.id
	});
	if(!undef(item.sub)) {
		dojo.attr(div, {
			"aria-expanded" : "false",
			"aria-haspopup": "true"
		});
	}
	li.appendChild(div);
	if (item.showborder) { // use item.border for all defined menu seps
		li.className = li.className + " acMenuItemBorder";
	}
	var addItem = true;
	if (item.sub) {
		var sub = document.createElement("ul");
		sub.id = ul.id + "_" + item.sub.id;

		var toggleEvent = "toggleMenuView('" + plusMinus.id + "','" + sub.id + "_menu')";
		dojo.attr(li, {
			"nodeinfo" : dojo.toJson( {
				"children" : true,
				"childrenfilled" : true,
				"state" : "closed",
				"node" : null,
				"primaryevent" : "",
				"toggleevent" : {
					"jsevent" : toggleEvent
				}
			})
		});
		if(document.body.dir=="rtl") {
			dojo.style(sub, {
				"display" : "none",
				"marginRight": "20px"
			});			
		}
		else {
			dojo.style(sub, {
				"display" : "none",
				"marginLeft": "20px"
			});
		}
		

		dojo.attr(sub, {
			"navId" : navId,
			"role" : "group",
			"aria-live" : "polite" 
		});
		li.appendChild(sub);
		item.sub.menuevent = item.menuevent;
		var subLength = buildNavigationMenu((level + 1), navId, sub.id, item.sub, sub, className);
		if (subLength == 0) {
			addItem = false;
		}
		dojo.connect(li, "click", li, function(event) {
			if(dojo.attr(li, "enabled")!="false") {
				toggleMenuView(plusMinus.id, sub.id);
			}
			hideAllMenusNF();
			stopBubble(event);
		});
	} else {
		if(undef(item.eventvalue)) {
			item.eventvalue = "";
		}
		dojo.attr(li, {
			"nodeinfo" : dojo.toJson( {
				"children" : false,
				"childrenfilled" : false,
				"state" : "closed",
				"node" : null,
				"primaryevent" : {
					"eventtype" : ((item.mxevent) ? item.mxevent : item.menuevent),
					"targetid" : ((item.eventtarget) ? item.eventtarget : navId),
					"value" : (!isQuery) ? item.eventvalue : (item.eventvalue+"{:}"+item.text)
				},
				"toggleevent" : ""
			})
		});

		dojo.connect(li, "click", li, function(event) {
			stopBubble(event);
			hideAllMenusNF();
			if(dojo.attr(li, "enabled")!="false") {
				processEvent(dojo.fromJson(this.getAttribute("nodeinfo")).primaryevent);
			}
		});
		if(item.mxevent) {
			dojo.attr(li, {"eventtype" : item.mxevent});
			dojo.subscribe("appeventstate", null, function(message){
				if(message.eventtype!=dojo.attr(li, "eventtype"))
					return;
				if(message.enabled){
					dojo.forEach(dojo.query("img", li), function(element) {
						removeClass(element, "opacity_20");
					});
					dojo.forEach(dojo.query("span", li), function(element) {
						removeClass(element, "opacity_20");
						dojo.attr(element, {
							"disabled" : ""
						});
					});
					dojo.attr(li, {
						"enabled" : "true",
						"ariaDisabled" : "false"
					});
				}
				else {
					dojo.forEach(dojo.query("img", li), function(element) {
						appendClass(element, "opacity_20");
					});
					dojo.forEach(dojo.query("span", li), function(element) {
						appendClass(element, "opacity_20");
						dojo.attr(element, {
							"disabled" : "disabled"
						});
					});
					dojo.attr(li, {
						"enabled" : "false",
						"ariaDisabled" : "true"
					});
				}
			});
		}
	}
	if (addItem) {
		dojo.attr(li, {
			"navId" : navId
		});
		ul.appendChild(li);
	}
	return li;
}

/**
 * Creates and queues event to getData from Navsection.java using XHR
 * 
 * @param id
 * @param containerId
 * @return
 */
function fetchNavigationMenu(id, containerId, showImages, tryCache, isQuery) {
	var holder = dojo.byId(id + "_content");
	var section = dojo.byId(id);
	if (!holder || !section)
		return;
    var navSections = eval(containerId + "navSections");
	if (tryCache) {
		var menuCache = localStorage["menucache_"+SECURE_USERNAME+"_"+USERLANG];
		if (menuCache) {
			menuCache = dojo.fromJson(menuCache);
			gotoMenu = menuCache["goto"];
			if (gotoMenu) {
				if (gotoMenu.items[0].eventvalue == "startcntr") {
					gotoMenu.items.shift();
				}
				fromCache = true;
				fillNavSection(gotoMenu, {
					'args' : {
						'content' : {
							'events' : "[{'navSectionId':'" + id + "','containerId':'" + containerId + "','showImages':" + showImages + "}]"
						}
					}
				});
				return;
			}
		}
	}
	var fetchEvent = new Event("getData", id, "", REQUESTTYPE_HIGHASYNC);
	var menu = dojo.byId(id + "_menu");
	if (menu) {
		var inner = dojo.byId(holder.id + "_inner");
		if (inner) {
			inner.removeChild(menu);
		}
	}
	fetchEvent["navSectionId"] = id;
	fetchEvent["containerId"] = containerId;
	fetchEvent["showImages"] = showImages;
	fetchEvent["isQuery"] = isQuery;
	queueManager.queueEvent(fetchEvent, "text/json", "json", fillNavSection, null);
}



/* Generic helper methods */

/**
 * Walk up DOM a specified number of levels looking for a particular tagname
 */
function findParent(element, tagName, levels) {
	tagName = tagName.toUpperCase();
	var level = 0;
	element = element.parentNode;
	while (element.tagName != tagName || level < levels) {
		if (element.tagName == tagName) {
			level++;
			if (level == levels)
				break;
		}
		element = element.parentNode;
	}
	return element;
}

/*
 * Returns the number of members within a Javascript object
 */
function getObjectLength(object) {
	var element_count = 0;
	for (e in object) {
		element_count++;
	}
	return element_count;
}

function hideExtraHovers(section) {
	dojo.connect(section, "mouseout", section, function(event) {
		dojo.forEach(dojo.query(".hoverButton", dojo.byId(this.id + "_head")), function(element) {
			dojo.style(element, {
				"display" : "none"
			});
		});
	});
}

function ncEvents(navContainer, img, newTD, oldImgHandler) {
	dojo.disconnect(oldImgHandler);
	dojo.connect(img, "click", img, function(event) {
		///must toggle state
		var state = dojo.attr(navContainer,"state");
		switch (state)
		{
			case "open":
				state="icon";
				break;
			case "icon":
				state="closed";
				break;
			case "closed":
				state="open";
		}
		setNavContainerState(navContainer, state, false, false);
		stopBubble(event);
	});
	dojo.connect(img, "mouseup", img, function(event) {
		
	});
	dojo.connect(img, "mousedown", img, function(event) {
		stopBubble(event);
	});

	dojo.style(newTD, {
		"cursor" : "col-resize"
	});
	dojo.connect(newTD, "mousedown", newTD, function(event) {
		hideAllMenus();
		this.style.opacity = '0.4';
		// cancel out any text selections 
		document.body.focus(); 
		appendClass(document.body,"dragging");
		// prevent text selection in IE 
		var bodyOnSelectStart = document.body.onselectstart;
		document.body.onselectstart = function () { return false; };
		var moveHandle = dojo.connect(document, "mousemove", document, function(event) {
			hideAllMenus();
			appendClass(document.body,"dragged");
			document.body.onselectstart = function () { return false; };
			var width = parseInt(event.clientX) - 5;
			if(document.body.dir == "rtl") {
				width = parseInt(document.body.clientWidth - event.clientX) - 5;
			}
			dojo.attr(navContainer,{"maxwidth":width});
			var tbSpacer = dojo.byId("apptoolbarSpacer");
			if(tbSpacer){
				dojo.style(tbSpacer, {
					"width" : (width+10)+"px"
				});
			}
			dojo.style(navContainer, {
				"visibility" : "visible",
				"overflow" : "hidden",
				"width" : width+"px",
				"position" : "",
				"left" : "0px"
			});
			var navWidth = parseInt(navContainer.style.width);
			var navMenuItems = dojo.query(".navMenus", navContainer);
			var tooSmall = navWidth < navIconWidth + 20;
			for(var tnIndex=0;tnIndex<navMenuItems.length;tnIndex++) {
				var tn = navMenuItems[tnIndex];
				if(tooSmall) {
					appendClass(tn,"hide");
				}
				else {
					removeClass(tn,"hide");
				}
			}
			sizeAnchors(navContainer, navWidth);
			sizePanes(navContainer, false);
		}); 
		dojo.connect(document, "mouseover", document, function(event) { return false; });
		var docHandler = dojo.connect(document, "mouseup", newTD, function(event) {
			this.style.opacity = '1';
			dojo.disconnect(moveHandle);
			dojo.disconnect(docHandler);
			removeClass(document.body,"dragging");
			document.body.onselectstart = bodyOnSelectStart;
			var navWidth = parseInt(navContainer.style.width);
			if(parseInt(navContainer.style.width) < 25) {
				navContainer.style.width=parseInt(navIconWidth+1)+"px";
				setNavContainerState(navContainer,"icon",true,false);
			}
			else {
				setNavContainerState(navContainer,"open",true,false);
			}
			var width = parseInt(event.clientX) - 5;
			if(document.body.dir == "rtl") {
				width = parseInt(document.body.clientWidth - event.clientX) - 5;
			}
		});
	});
}

function sizeAnchors(navContainer, width){
	var navMenuAnchors = dojo.query(".dojoxEllipsis", navContainer);
	for(var naIndex=0;naIndex<navMenuAnchors.length;naIndex++) {
		var navAnchor = navMenuAnchors[naIndex];
		if(navAnchor.className.indexOf("navTitle") ==0) {
			continue;
		}
		dojo.removeAttr(navAnchor, "width");
		var section = navAnchor.parentNode.parentNode.parentNode.parentNode;
		var newWidth = width;
		var scrolled = (section.scrollHeight > section.clientHeight);
		if(scrolled) {
			if(dojo.isIE > 0){
				newWidth -= 7;
			}
			else {
				newWidth -= 15;
			}
		}
		newWidth-= (parseInt(dojo.style(navAnchor, "paddingRight")) + parseInt(dojo.style(navAnchor, "paddingLeft")) + 6);
		if(newWidth<0) {
			newWidth = 1; //IE issue
		}
		dojo.style(navAnchor, {"width": newWidth + "px"});
	}
}

function navHeadingKey(event, sectionId){
	var section = dojo.byId(sectionId)
	if(!section){
		return;
	}
	
	var navSections = eval(dojo.attr(section, "containerid") + "navSections");
	var secDef = navSections[sectionId];
	var state = secDef.state;
	switch(event.keyCode)
	{
		case KEYCODE_LEFT_ARROW:
		case KEYCODE_UP_ARROW:
			toggleSectionView(null, sectionId, 'min', event);
			cancelEvent(event);
			break;
		case KEYCODE_RIGHT_ARROW:
		case KEYCODE_DOWN_ARROW:
			toggleSectionView(null, sectionId, 'normal', event);
			cancelEvent(event);
			break;
		default:
	}
}


// Executed only when testing environment is up and running
try {
	if (process.env.NODE_ENV === 'test') {
		module.exports = {handleAccessKey};
	}
} catch (e) {
    // do nothing
}
