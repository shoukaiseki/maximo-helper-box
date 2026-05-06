/*
 * Licensed Materials - Property of IBM
 * "Restricted Materials of IBM"
 * 5724-U18
 * (C) COPYRIGHT IBM CORP. 2006,2026 All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 *
 */

var movingItem = null;
var modelessTopZ = 10000;
var modalTopZ = 10000;
var highlightid = "";
var highlighttitle = "";
var TIMED_WAIT = false;

var lastClickElement = null;

var waitLocked = false;
var currentTimerId = null;
var currentQueryId = null;
var itemMoveClass = "opacity_70";
var waitOn = true;
var dialogCount = 0;
var objsHidden = false;
var working = true;
var rerenderedItems = new Array();
var passwordFields = new Array();
var CANVASID = "";
var tableHotkeys = new Array();
tableHotkeys[KEYCODE_UP_ARROW]    = new Array(true, false, "previousrow");
tableHotkeys[KEYCODE_DOWN_ARROW]  = new Array(true, false, "nextrow");
tableHotkeys[KEYCODE_LEFT_ARROW]  = new Array(true, false, "previouspage");
tableHotkeys[KEYCODE_RIGHT_ARROW] = new Array(true, false, "nextpage");
tableHotkeys[KEYCODE_Z]           = new Array(true, false, "togglefilter");
var clickX, clickY;
var stopFocus = false;
var FADE_VALUE = 100;
var FADE_SPEED = 1;
var moveRestrict = null;
var messageTimeout = null;
var showingPopup = false;
var popupCount=0;
var tableRowEnterKeyFlag = 0;
var modalWaitLayers = new Array();
var viewportHeight = 0;
var viewportWidth = 0;
var isBidiEnabled = false; // bidi-HCG-AS
var hiddenCheck = null;
var TRANSACTIONTIME = null;
var CONNECTIONWARNINGINTERVAL = 15000;
var CONNECTIONRECHECKINTERVAL = 2000;
var HIDDENFRAMEERRORWARNINGINTERVAL = 15000;
var xmlhreq;
var hiddenAjaxCheck = null;
var hiddenAjaxConnectiononlyCheck = null;
var hiddenformStatusCheck = null;
var addedCommInputs = new Array();
var saveButton = null;
var inputchanged = false;
var rowMarkerStart = '[R:';
var rowMarkerEnd = ']';
var autoFillInfo;
var compInitialized = new Array();
var lastField = {};
var lastKeyPress = null;
var movable = null;
var lastRTEToGetFocus = false;
var rteOnFocusTime = 0;
var changingTabs = false;

/* c8 ignore start */
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
      if (typeof start !== 'number') {
        start = 0;
      }
      if (start + search.length > this.length) {
        return false;
      } else {
        return this.indexOf(search, start) !== -1;
      }
    };
}
/* c8 ignore stop */

function _maximo_logout(timeout){
    var url = LOGOUTURL.replace('.jsp','_old.jsp');
    if(timeout)
        url+="&timeout=1";
    warnExit=false;
    if(WEBREPLAY)
        parent.document.location=url;
    else
        document.location=url;
}

/*
 * This should be used by all events after sign-out to wrap functionality. It is
 * called from RequestManager.java, WebClientSession.java and from
 * sessiontimer.js the timeout should be false in all cases except when called
 * from sessiontimer.js
 */
function showLoginPage(timeout)
{
    if(self === window.top){
        _maximo_logout();
        return;
    }
    masSessionTimeout();
}

/**
 * No longer needed as hidden frame no longer exists.
 * Keeping around for backwards compatibility.
 * @deprecated use {@link document.getElementById()}
 */
function getHFElement(id)
{
	return document.getElementById(id);
}


function getElement(elementOrId)
{
	if(typeof elementOrId=="object")
		return elementOrId;
	return document.getElementById(elementOrId);
}

function submitHidden()
{
	var hiddenForm = getHiddenForm();
	if(hiddenForm)
	{	
		try {
			// Submit form using XHR.
			sendXHRFromHiddenForm();
		} catch {
			// Do Nothing
		}
	}
}

/**
 * @deprecated
 */
function submitHiddenajaxconnectiononly()
{
	submitHidden();
}

function createXMLDoc(txt)
{
	if(DEBUGLEVEL>0)
	{
		console.log(new Date() + " : " + txt);
	}

	var xmlDoc;
	if(IE)
	{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="true";
		xmlDoc.loadXML(txt);
	}
	else
	{
		try // Firefox, Mozilla, Opera, etc.
		{
			var parser = new DOMParser();
			xmlDoc = parser.parseFromString(txt,"text/xml");
		}
		catch(e)
		{
			return;
		}
	}
	
	if(undef(xmlDoc))
		alert("bad document structure");
	else
		return xmlDoc;
}

function killAjaxTimeout()
{
	window.clearTimeout(hiddenAjaxCheck);
	hiddenAjaxCheck=null;
	window.clearTimeout(hiddenAjaxConnectiononlyCheck);
	hiddenAjaxConnectiononlyCheck=null;
	window.clearTimeout(hiddenformStatusCheck);
	hiddenformStatusCheck=null;
}

/**
 * Returns a reference to the hidden form that is used to store information to be sent to the
 * server.
 *
 * @return reference to the hidden form element.
 */
function getHiddenForm()
{
	var hiddenForm = document.getElementById("hiddenform");
	if(!hiddenForm)
	{
		throw "Error: The Hidden Form is missing!";
	}
	return hiddenForm;
}

function reloadAfterRequestTimeout()
{
	warnExit=false;
	document.location = document.location;
}

function handleLostconnectionWarnDialog(eventType)
{
	if (eventType == 'connectionlost')
	{
		showLostConnectionMsg();
	}
	else
	{
		showConnectionRestoredMsg();
	}
}

/**
 * @deprecated use dojo.xhrGet() or dojo.xhrPost()
 */
function createXMLHttpRequest()
{
	var xmlhreq = null;
	if (window.XMLHttpRequest)
	{
		xmlhreq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject) // branch for IE/Windows ActiveX version
	{
		xmlhreq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xmlhreq;
}

function setCommInput(id,value)
{
	if(working)
		return;

	try
	{
		getHiddenForm().elements.namedItem(id).value = value;
	}
	catch(error)
	{
		alert("did not set! :"+id);
	}
}

function addCommInput(name, value)
{
	if(working)
		return;

	var newInput = document.createElement("input");
	newInput.setAttribute("type","text");
	newInput.setAttribute("name",name);
	newInput.setAttribute("value",value);
	newInput.setAttribute("id",name);

	addedCommInputs.push(name);

	getHiddenForm().appendChild(newInput);
}

function setButtonEnabled(ctrlid, enabled)
{
	setButtonState(ctrlid, enabled, true);
}

function setButtonState(ctrlid, enabled, publish)
{
	if(ctrlid == saveButton){
		if(enabled == true){
			enabled = saveUnlocked;
		}
		window.parent.postMessage({[EMBEDDED_MESSAGE_PREFIX+'inner-app-dirty'	]: enabled});
	}
	var li = getElement(ctrlid);
	var anchor;
	if(li) {
		anchor = li.firstChild;
	}
	if(tpaeConfig.validationOn)
	{
		if(li)
		{
			var img = anchor.firstChild;
			if(enabled)
			{
				li.removeAttribute("disabled");
				anchor.removeAttribute("disabled");
				anchor.className = "on";
				inputchanged = false;
			}
			else
			{
				li.setAttribute("disabled", "true");
				anchor.setAttribute("disabled", "disabled");
				anchor.className = "off";
			}
		}
		if(anchor){ 
			if(enabled) {
				removeClass(anchor, "opacity_20");
				dojo.attr(anchor, {
					"disabled" : "",
					"tabindex" : "0"
					});
			}
			else {
				appendClass(anchor, "opacity_20");
				dojo.attr(anchor, {
					"disabled" : "true",
					"tabindex" : "-1"
				}); 
			}
		}
	}
	if(anchor && !SCREENREADER) {		
		dojo.publish("appeventstate",[{
			"eventtype" : dojo.attr(anchor, "eventtype"),
			"enabled" : enabled}]);
	}
}

function processEvent(jsEvent)
{
	if(!jsEvent.jsevent && (!jsEvent.eventtype || !jsEvent.targetid))
	{
		return;
	}

	if(jsEvent.jsevent)
	{
		eval(jsEvent.jsevent);
	}
	else
	{
		sendEvent(jsEvent.eventtype, jsEvent.targetid, jsEvent.value);
	}
}

function sendEvent(eventtype, targetid, value)
{
	/* Test whether the target is not disabled */
	var el = getElement(targetid);
	if(el && !canClick(el))
		return;
	var hiddenForm = getHiddenForm();
	if(!hiddenForm)
		return;
	var inputs = hiddenForm.elements;

	if(eventtype)
	{
		inputs.namedItem("event").value = eventtype;
	}
	else
	{
		console.error("Cannot send an event with no type! ["+targetid+", "+value+"]");
	}


	if(targetid != null)
	{
		inputs.namedItem("targetid").value = targetid;
		if (targetid == saveButton && tpaeConfig.validationOn)
		{
			//save is clicked, disable the button
			setButtonEnabled(saveButton, false);
		}
	}

	if(value != null)
		inputs.namedItem("value").value = value;
	/*
	 * Why were we ever doing this? else { var valueInput =
	 * inputs.namedItem("value"); if(valueInput) { var valueInputParent =
	 * valueInput.parentNode; valueInputParent.removeChild(valueInput); } }
	 */
	var ccId = inputs.namedItem("changedcomponentid").value;
	var ccVal = inputs.namedItem("changedcomponentvalue").value;
	var cfId = inputs.namedItem("currentfocus").value;
	if(!undef(MAINDOC.body))
	{
		inputs.namedItem("scrolltoppos").value = MAINDOC.body.scrollTop;
		inputs.namedItem("scrollleftpos").value = MAINDOC.body.scrollLeft;
	}

	if(DEBUGLEVEL>=5)
	{
		if(DEBUGLEVEL>=7)
			window.status="Waiting to submit";
		else
			window.setTimeout("submitHidden()",3000);
	}
	else
	{
		//We need to stop the connection check code until it is updated

		// had to delay submit for dialog cancel on Mozilla
		// Strange that with a minimal delay it works 07-24320
//		if(DESIGNMODE)
//		{
		submitHiddenDelay();
		/*
		 * } else { if (SHOWLOSTCONNECTIONWARNINGONLY) {
		 * submitHiddenDelayajax(submitHiddenajaxconnectiononly); } else {
		 * submitHiddenDelay(); } }
		 */
	}
}

function submitHiddenDelay()
{
	if(SCREENREADER) { //ScreenReader mode seems to need a little more time for save when on FF.
		window.setTimeout(submitHidden,200);
	}
	else {
		window.setTimeout(submitHidden,10);
	}
}

function submitHiddenDelayajax(functionname)
{
	window.setTimeout(functionname,10);
}

/* fixes issues where nextSibling returns invalid items */
function getNextSibling(component)
{
	var el = component.nextSibling;
	while(el!=null && el.nodeType!=1)
	{
		el = el.nextSibling;
	}	
	return el;
}

function getPrevSibling(component)
{
	var el = component.previousSibling;
	while(el!=null && el.nodeType!=1)
	{
		el = el.previousSibling;
	}
	return el;
}


function input_forceChanged(component)
{
	if(undef(component) || component.readOnly == true)
		return;
	var hiddenForm = getHiddenForm();
	var inputs = hiddenForm.elements;
	inputs.namedItem("changedcomponentid").value = component.id;
	var oldVal = inputs.namedItem("changedcomponentvalue").value;
	var value = component.value;
	if(isBidiEnabled && component.getAttribute("bidiAttributes") && component.getAttribute("bidiAttributes").indexOf("expr:") != 0)
		value = removeMarkers(value);

	// Reformat the Value to gregorian value
	if (component.getAttribute("PopupType"))
	{
		value = formatToMXCalendar(component,value);
	}

	inputs.namedItem("changedcomponentvalue").value = value;
	component.setAttribute("prekeyvalue", value);
	setMatchingFieldStates(component,false);
	if(saveButton && oldVal!=value)
	{
		var fldInfo = component.getAttribute("fldInfo");
		if(fldInfo)
			fldInfo = dojo.fromJson(fldInfo);
		if(!fldInfo || !fldInfo.query)
			setButtonEnabled(saveButton, true);
	}
	// mark field as no longer having been changed
	component.setAttribute("changed_by_user","true");
	component.setAttribute("changed", true);
}

function input_changed(event, component)
{
	var preKeyValue = component.getAttribute("prekeyvalue");
	var exc = component.getAttribute("exc");

	if((!exc || exc=="0") && ((undef(preKeyValue) && preKeyValue!="") || component.value==preKeyValue))
	{	 // only mark this as changed if the valuechanged or there is an exception
		return;
	}
	var srcEl = getSourceElement(event);
	if(!undef(srcEl))
	{
		var ch=srcEl.getAttribute("changed");
		if(event.keyCode == 229 || event.charCode == 229) // bad keycode of non-key event sent to fields
			// when using korean IME
		{
			if(undef(ch))
				return false;
		}
	}

	if(event != null)
	{
		if(showFieldHelp(event, component))
			return;
		var cancel = false;
		var exc=(component.getAttribute("exc")=="1");
		if(hasKeyCode(event, 'KEYCODE_ESC') && !exc)
		{
			stopPopWait();
			stopPopOver();
			var val = component.getAttribute("originalvalue");
			if(val)
			{
				var ccId = getHiddenForm().elements.namedItem("changedcomponentid").value;
				cancel=true;
				if(component.id==ccId || component.getAttribute("exc")=="1")
				{
					component.value=val;
					inputs.namedItem("changedcomponentvalue").value=val;
					inputs.namedItem("changedcomponentid").value=component.id;
					cancel=false;
				}
			}

		}
		if(hasKeyCode(event, 'KEYCODE_ESC|KEYCODE_ALT|KEYCODE_SHIFT|KEYCODE_TAB|KEYCODE_END|KEYCODE_HOME|KEYCODE_CTRL'))
			cancel=true;
		if(cancel)
			return;
	}
	inputchanged = true;
	input_forceChanged(component);
}

function setCurrentfocusFromId(event, componentid)
{
	var component = getElement(componentid);
	if(component)
	{
		var hiddenForm = getHiddenForm();
		var inputs = hiddenForm.elements;
		inputs.namedItem("currentfocus").value = component.id;
	}
}

function getFocusId()
{
	var hiddenForm = getHiddenForm();
	if(hiddenForm)
	{
		var inputs = hiddenForm.elements;
		if(inputs)
		{
			var cf = inputs.namedItem("currentfocus");
			return cf.value;
		}
	}
	return "";
}

function setFocusToId(compId){
	if(compId){
		var hiddenForm = getHiddenForm();
		var inputs = hiddenForm.elements;
		inputs.namedItem("currentfocus").value = compId;
	}
}

function setFocusId(event,component)
{
	try
	{
		var setfocus = component.getAttribute("sf")!="0";
		if (setfocus)
		{
			var compId = component.id;
			if(!compId)
				compId=component.getAttribute("compid");
			setFocusToId(compId)
		}
	}
	catch(error)
	{}
}

function setValueForFocusChange(event, component)
{
	var hiddenForm = getHiddenForm();
	var inputs = hiddenForm.elements;
	var ccId = inputs.namedItem("changedcomponentid").value;
	var ccVal = inputs.namedItem("changedcomponentvalue").value;
	var clicked = false;
	if(component)
		clicked=component.getAttribute("clicked");
	if(ccId != "" && (component == null || component.id != ccId) && clicked!="true") // Something
		// was
		// changed
		sendEvent("setvalue", ccId, ccVal);
}

function setCurrentfocusId(event, component)
{
	var focusId = getFocusId();
	setFocusId(event,component);
	if(!undef(focusId))
	{
		var focusEl = getElement(focusId);
		if(!undef(focusEl))
		{
			var menuId = focusEl.getAttribute("menu");
			if(!undef(menuId))
			{
				menus._destroyMenus();
			}
		}
	}

	setValueForFocusChange(event, component);
}

function input_mousedown(event, component)
{
	component.setAttribute("clicked", "true");
}

function input_onfocus(event, component)
{
	/* Test disabled */
	if(!SCREENREADER && (component.disabled || (component.tagName!="INPUT" && component.tagName!="TEXTAREA") && component.getAttribute("ctype")!="checkbox" && component.getAttribute("ctype")!="select") )
		return false;

	// stopuseredit is only true if component has
	// getProperty('usereditable').equals("false")
	var stopUserEdit = component.getAttribute("sue");
	var ontr = component.getAttribute("ontr");
	var cType = dojo.attr(component,"ctype");
	if(component.readOnly == true && stopUserEdit!="1")
	{
		if(component.className.indexOf("masked")==-1 && cType!="checkbox") {
			appendClass(component, "ffro");
		}
		setCurrentfocusId(event, component);
	}
	else
	{
		component.setAttribute("originalvalue",component.value);
		if(!SCREENREADER && cType!="checkbox") {
			appendClass(component, "ffAS");
		}
		if(component.getAttribute("num") == "1" && component.getAttribute("sa") != "1")
			component.style.textAlign = "left";

		setCurrentfocusId(event, component);
	}
}

function enableComponent(component)
{
	component.disabled = false;
	component.style.cursor = "pointer";
	component.tabIndex = "0";
	var clr = component.getAttribute("originalcolor");
	if(undef(clr))
		clr = "";
	component.style.color = clr;
}

function disableComponent(component)
{
	component.disabled = true;
	component.style.cursor = "default";
	component.tabIndex = "-1";
	component.setAttribute("originalcolor", component.style.color);
	component.style.color = "#C0C0C0";
}

function canClick(component)
{
	if(DESIGNMODE)
		return true;
	try
	{
		var dis = component.getAttribute("disabled");
		if(undef(dis))
			return true;
		if(dis == "false" || dis == false)
			return true;

		return false;
	}
	catch(error)
	{
		return true;
	}
}


function showFieldHelpById(event, id)
{
	if(event.ctrlKey != true && (anyAltPressed(event) == true))
	{
		var helpEvent = "";
		if(hasKeyCode(event, "KEYCODE_F1"))
			helpEvent = "fieldhelp";
		else if(hasKeyCode(event, "KEYCODE_I"))
			helpEvent = "internalhelp";
		if(helpEvent != "")
		{
			sendEvent(helpEvent, id, "");
			cancelEvent(event);
			return true;
		}
	}
	return false;
}

function showFieldHelp(event, component)
{
	var compId = component.id;
	return showFieldHelpById(event, compId);
}

function numericcheck(event, component)
{
	var num = component.getAttribute("num");
	if(num!="1")
		return;
	var re = /^[0-9-'.'-',']*$/;
	if (!re.test(component.value))
	{
		component.value = component.value.replace(/[^0-9-'.'-',':']/g,"");
		return false;
	}
}

function datespin(event, fld)
{
	var alt = event.altKey;
	var shift = event.shiftKey;
	var ctrl = event.ctrlKey;
	if(alt || (shift && ctrl))
	{
		var dateClass = fld.getAttribute("datePackage")? fld.getAttribute("datePackage")+".Date" : "Date";
		var dateClassObj = dojo.getObject(dateClass, false);
		var val = fld.getAttribute("dojovalue");
		if(val)
		{
			var newDate;
			var currentDate = new Date;
			if(val!="")
			{
				newDate = new dateClassObj(parseInt(val));
				currentDate = new dateClassObj(parseInt(currentDate.valueOf()));
			}
			else
			{
				if(hebrew)
				{
					newDate = new dojox.date.hebrew.Date();
				}
				else if(islamic)
				{
					newDate = new dojox.date.islamic.Date();
				}
				else
					newDate = new Date;
				currentDate = newDate;
			}
			var adj = 0;
			var mod = false;
			switch(event.keyCode)
			{
			case KEYCODE_UP_ARROW:
				adj=2;
			case KEYCODE_DOWN_ARROW:
				adj-=1;
				if(alt)
				{
					mod=true;
					newDate.setDate(newDate.getDate()+adj);
				}
				else if(ctrl && shift)
				{
					mod=true;
					newDate.setFullYear(newDate.getFullYear()+adj);
				}
				break;
			case KEYCODE_RIGHT_PAREN:
				adj=2;
			case KEYCODE_LEFT_PAREN:
				adj-=1;
				if(ctrl && shift)
				{
					mod=true;
					newDate.setMonth(newDate.getMonth()+adj);
				}
				break;
			case KEYCODE_AMP:
				adj=0;
				if(ctrl && shift)
				{
					mod=true;
					newDate=currentDate;
				}
				break;
			}
			if(mod)
			{
				stopBubble(event);
				var selectEvent=fld.getAttribute("selectevent");
				if(!undef(selectEvent))
				{
					sendEvent(selectEvent,fld.id,newDate.valueOf());
				}
				else
				{
					var options =  dojo.fromJson(fld.getAttribute("constraints"));
					var pattern = "";
					if(options!=null && options!="")
					{
						if(!undef(options.datePattern))
						{
							pattern=options.datePattern;
						}

						if(!undef(options.timePattern))
						{
							if(!undef(pattern))
								pattern=pattern+" ";
							pattern+=options.timePattern;
						}
						if(!undef(pattern))
						{
							var newValue = dojo.date.locale.format(newDate, {
								locale: USERLOCALE,
								selector: "date",
								datePattern: pattern
							});
							fld.value=newValue;
							fld.setAttribute("dojoValue",newDate.valueOf());
							input_forceChanged(fld);
						}
					}
				}
			}
		}
	}
}

function input_lengthCheck(event,component,len)
{
	var key = event.keyCode;
	if(component.value.length>=len && document.selection.createRange().text=="")
	{
		if(event.ctrlKey!=true && (altPressed(event)!=true))
		{
			switch(key)
			{
			case KEYCODE_PAGEUP:
			case KEYCODE_PAGEDOWN:
			case KEYCODE_LEFT_ARROW:
			case KEYCODE_RIGHT_ARROW:
			case KEYCODE_UP_ARROW:
			case KEYCODE_DOWN_ARROW:
			case KEYCODE_DELETE:
			case KEYCODE_HOME:
			case KEYCODE_END:
			case KEYCODE_BACKSPACE:
			case KEYCODE_TAB:
			case KEYCODE_CTRL:
				break;
			case KEYCODE_ENTER:
				if(event.ctrlKey!=true)
				{
					event.returnValue=false;
					return false;
				}
				break;
			default:
				event.returnValue=false;
			return false;
			}
		}
		else if(event.ctrlKey==true && key==KEYCODE_PASTE)
			return false;
	}
	return true;
}

function input_keydown(event, component)
{
	/* Test disabled */
	if(component.disabled)
	{
		event.returnValue=false;
		return true;
	}
	stopPopOver();
	if(hasKeyCode(event, "KEYCODE_ENTER") && event.ctrlKey)
	{
		try
		{
			var exc=(component.getAttribute("exc")=="1");
			if(exc && event.shiftKey)
			{
				startPopOver(event,component,true);
			}
			else
			{
				var lbId = component.getAttribute("li");
				if(!undef(lbId))
				{
					var el=document.getElementById(lbId);
					if(el)
					{
						frontEndEvent(el, "click");
					}
				}
			}
		}
		catch(error)
		{
		}
	}
}

function input_onblur(event, component)
{
	/* Test disabled */
	if(component.disabled)
		return false;
	// stopuseredit is only true if component has
	// getProperty('usereditable').equals("false")
	var stopUserEdit = component.getAttribute("sue");
	var async = component.getAttribute("async");
	if(component.readOnly == true && stopUserEdit!="1")
	{
		removeClass(component, "ffro");
	}
	else
	{
		if(!SCREENREADER)
		{
			removeClass(component, "ffAS");
		}
		if(component.getAttribute("num") == "1" && component.getAttribute("sa") != "1")
			component.style.textAlign = "right";
	}
}

function changeImageSrc(id, src)
{
	var cb = getElement(id);
	if(cb)
		cb.src = src;
}

function clickElement(id)
{
	var el = getElement(id);
	if(el)
		el.click();
}

function toggleMinimize(objectId)
{
	if (objectId.indexOf("dialog_image2") > - 1)
	{
		// user clicked the MINIMIZE icon
		objectId = objectId.substring(0, objectId.indexOf("_image2"));
		objectId += "_dialog";
	}
	else if(objectId.indexOf("debug_event") > - 1 || objectId.indexOf("debug_stacktrace") > - 1)
	{
		// user clicked MINIMIZE on debug window
		var el = document.getElementById(objectId + "_inner");
		if(el)
		{
			if(el.style.display == '')
				el.style.display = 'none';
			else
				el.style.display = '';
		}
		return;
	}
	else if(objectId.indexOf("dialog_dialog") > - 1)
	{
		// user double - clicked on the header bar
		// do nothing, just fall thru
	}
	else
	{
		// some other image was clicked so exit.
		return;
	}

	var obj = getElement(objectId + "_inner");
	if(!obj)
		return;
	obj.style.width = obj.clientWidth + "px";

	// strip off _dialog and concatenate id with _image2
	var baseId = objectId.substring(0, objectId.indexOf("_dialog"));
	var image = getElement(baseId + "_image2");
	if(!image)
		return;

	var mainContent = getElement(objectId + "_content1");
	var shadowContent = getElement(objectId + "_bottomshadow");

	if(mainContent.style.display == "none")
	{
		if(image.src.indexOf("maximize.gif") > - 1)
			image.src = IMAGE_PATH + "minimize.gif";
		else
			image.src = IMAGE_PATH + "minimizesection.gif";
		mainContent.style.display = "";
		shadowContent.style.display = "";
	}
	else
	{
		if(image.src.indexOf("minimize.gif") > - 1)
			image.src = IMAGE_PATH + "maximize.gif";
		else
			image.src = IMAGE_PATH + "maximizesection.gif";
		mainContent.style.display = "none";
		shadowContent.style.display = "none";
	}
}

/* used to set the width of blanklines used for headerbar spacers to maintain widths on collapse */
function fixSpacers()
{
	var spacers = document.getElementsByTagName("DIV");
	for(var i = 0; i < spacers.length; i ++ )
	{
		var spacer = spacers[i];
		if(spacer && spacer.className.indexOf("spacer") >= 0)
		{
			spacer.style.width = spacer.clientWidth;
		}
	}
}

/* Used to suppress link visibility in status window */
function noStatus()
{
	try
	{
		window.status='Done';
		return true;
	}
	catch(error)
	{
	}
}

function listbox_selectitem(event, component)
{
	component.className = "lis";
	/*
	 * deselect all other items is that going to be server side
	 */
}

function lockWait()
{
	waitLocked = true;
}

function unLockWait()
{
	waitLocked = false;
}

//Takes focus off of page during wait periods
function focusWait()
{
	if(!SCREENREADER)
		document.body.focus();
}

function showWait(element)
{
	if(DESIGNMODE)
	{
		if(!element)
		{
			parent.lockWait();
			if(!parent.waitOn)
				parent.showWait();
		}
		return;
	}

	if(element)
	{
		if(!isModal(element))
			return;
		// no wait needed
	}

	var waitLayer;
	if(element) // determine which wait to use, new one, or standard stop all
		waitLayer = getElement(element.id + "_dialogwait");
	else
		waitLayer = getElement("wait");

	if(waitLayer)
	{
		waitOn = true;
		document.body.cursor = "wait";
		waitLayer.style.cursor = "wait";
		sizeWait(waitLayer);
		if(!element){
			waitLayer.style.opacity = '0';
			window.setTimeout(function(){
				waitLayer.style.opacity = '1';	
			}, 300);
		}

		// Bidi_BDL: PMR 54898,003,756: no special handling for RTL here, since dojo always treats constrainedMoveable as LTR
		if(false && document.body.dir == "rtl")
		{
			// Bidi_BDL: Fix for 53064,003,756.
			// Use 'static' positioning in viewport coordinate system.
			waitLayer.style.position = "static";
			waitLayer.style.right = "0px";
		}
		else
		{
			waitLayer.style.position = "absolute";
			waitLayer.style.left = "0px";
		}
		waitLayer.style.top = "0px";
		waitLayer.style.display = "block";
	}
}

function sizeWait(waitLayer)
{
	// necessary to size div before positioning because some browsers will size the body to fit the content early
	waitLayer.style.height = document.documentElement.scrollHeight + "px";
	waitLayer.style.width = document.documentElement.scrollWidth + "px";
}

function addModalWaitLayer(id)
{
	require(["dojo/window"], function(win){
		var el = document.getElementById(id);
		if(el)
		{
			modalWaitLayers.push(el);
			var vs = win.getBox();
			el.style.height = ((vs.h > document.body.offsetHeight)? vs.h : document.body.offsetHeight) +"px";
			var lastWaitLayerNum = modalWaitLayers.length-2;
			if(lastWaitLayerNum>=0)
			{
				modalWaitLayers[lastWaitLayerNum].className="wait";
			}
			if(SCREENREADER && SKIN.indexOf("tivoli09"))
			{
				el.className="wait_modal wait_modal_ACC";
			}
			else
			{
				el.className="wait_modal";
			}
		}
	});
}

function removeModalWaitLayer()
{
	modalWaitLayers.pop();
	var lmwlength=modalWaitLayers.length;
	if(lmwlength>0)
	{
		var lmw=modalWaitLayers[lmwlength-1];
		if(lmw)
			lmw.className="wait_modal";
	}
}

function sizeModalWaits()
{
	if(modalWaitLayers.length==0)
		return;
	var len=modalWaitLayers.length;
	for(var i=0;i<len;i++)
	{
		var mLayer=modalWaitLayers[i];
		sizeWait(mLayer);
	}
}

var hideWaitInterval = null;
function hideWait()
{
	if(waitLocked)
		return;

	if(TIMED_WAIT)
		hideWaitInterval = window.setInterval(hideWaitTimed, 10);
	else
		window.setTimeout(waitOff, 150);
	if(DESIGNMODE)
	{
		parent.unLockWait();
		parent.hideWait();
	}
}

function waitOff()
{
	var waitLayer = getElement("wait");
	if(waitLayer)
	{
		waitLayer.style.display = "none";
		waitLayer.style.cursor = "default";
		document.body.cursor = "default";
		waitOn = false;
		waitLayer.style.opacity = '0';
	}
}

function hideWaitTimed()
{
	var waitLayer = getElement("wait");
	if(waitLayer)
	{
		var wHeight = waitLayer.clientHeight;
		waitLayer.style.height = (wHeight - 700) + "px";
		if(wHeight <= 1000)
		{
			waitLayer.style.height = "0px";
			window.clearInterval(hideWaitInterval);
			hideWaitInterval = null;
			waitOff();
		}
	}
}

function bringDialogToTop(elementOrId)
{
	var dialog = getElement(elementOrId);
	var td = dialog.parentNode;
	if(td.tagName=="TD")
	{
		var tr = td.parentNode;
		var lastElementChild = tr.lastElementChild;
		if(!lastElementChild) {
			//IE < 9 doesn't have .lastElementChild
			lastElementChild = tr.lastChild;
			while(lastElementChild && lastElementChild.nodeType != 1) {
				lastElementChild = lastElementChild.previousSibling;
			}
		}
		if(lastElementChild != td)
		{
			if(dojo.isIE && dojo.isQuirks) //IE quirks has issues moving elements
			{
				var newTd = tr.insertCell(-1);
				newTd.appendChild(dialog);
				newTd.setAttribute("aria-live","polite");
				tr.removeChild(td);
			}
			else
			{
				dojo.place(td, tr, "last");
			}
		}
	}
}

function bringElementToTop(elementorId)
{
	var element = getElement(elementorId);
	element.parentNode.appendChild(element);
}

/* BEGIN moveable */
function moveable_onmousedown(event, ctrlInst)
{
	var srcEl = getSourceElement(event);
	bringElementToTop(ctrlInst);
	if(srcEl.className.indexOf("dh") > - 1 || ctrlInst.id=="dockedHiddenFrame")
	{
		if(event.layerY) // non-IE
		{
			ctrlInst.offsetY = event.layerY;
			ctrlInst.offsetX = event.layerX;
		}
		else
		{
			ctrlInst.offsetY = event.offsetY + (getTopPosition(srcEl) -  getTopPosition(ctrlInst));
			ctrlInst.offsetX = event.offsetX + (getLeftPosition(srcEl) -  getLeftPosition(ctrlInst));
		}

		movingItem = ctrlInst;

		if(isModal(movingItem))
			appendClass(movingItem, itemMoveClass);

		if(MAINDOC.capturEvents)
		{
			MAINDOC.captureEvents(Event.MOUSEMOVE);
			MAINDOC.captureEvents(Event.MOUSEUP);
			MAINDOC.onmousemove = moveItem;
			MAINDOC.onmouseup = releaseMoveItem;
		}
		else
		{
			addListener(window.document, "mousemove", moveItem, true );
			addListener(window.document, "mouseup", releaseMoveItem, true );
		}
		var moveRestrict = ctrlInst.getAttribute("direction");
		if(undef(moveRestrict))
		{
			var customCurs = ctrlInst.getAttribute("movecursor");
			if((!undef(customCurs) && ctrlInst.style.cursor!=customCurs )|| ctrlInst.style.cursor!="move")
			{
				ctrlInst.setAttribute("oldcursor",ctrlInst.style.cursor);
				if(!undef(customCurs))
					ctrlInst.style.cursor=customCurs;
				else
					ctrlInst.style.cursor="move";
			}
		}

		if(ctrlInst.scrollList)
		{
			var scrollList = ctrlInst.scrollList.split(",");
			for(var scrollItem = 0; scrollItem < scrollList.length;scrollItem ++ )
			{
				var scrll = getElement(scrollList[scrollItem]);
				if(scrll)
					scrll.style.overflowX = "none";
			}
		}
		cancelEvent(event);
	}
}

function moveItem(event)
{
	cancelEvent(event);
	if(undef(movingItem))
		return;
	var ctrlInst = movingItem;
	if(!undef(ctrlInst))
	{
		if(undef(moveRestrict) || moveRestrict=="vertical")
		{
			var y = event.clientY - ctrlInst.offsetY;
			if (y < -20)
				y = -20;
			ctrlInst.style.top = y;
		}
		if(undef(moveRestrict) || moveRestrict=="horizontal")
		{
			ctrlInst.style.left = event.clientX - ctrlInst.offsetX;
		}
	}
	var moveMethod = movingItem.getAttribute("movemethod");
	if(!undef(moveMethod))
	{
		var meth=moveMethod+"('"+ctrlInst.id+"')";
		eval(meth);
	}
	movingItem.setAttribute("hasmoved","true");
}

function releaseMoveItem(event)
{
	cancelEvent(event);
	var ctrlInst = movingItem;
	if(ctrlInst)
	{
		if(MAINDOC.capturEvents)
		{
			MAINDOC.releaseEvents(Event.MOUSEMOVE);
			MAINDOC.releaseEvents(Event.MOUSEUP);
			MAINDOC.onmousemove = "";
			MAINDOC.onmouseup = "";
		}
		else
		{
			removeListener(window.document, "mousemove", moveItem, true );
			removeListener(window.document, "mouseup", releaseMoveItem, true );
		}
		if(ctrlInst.scrollList)
		{
			var scrollList = ctrlInst.scrollList.split(",");
			for(var scrollItem = 0; scrollItem < scrollList.length; scrollItem ++ )
			{
				var scrll = getElement(scrollList[scrollItem]);
				if(scrll)
					scrll.style.overflowX = "auto";
			}
		}

		if(isModal(movingItem))
			removeClass(movingItem, itemMoveClass);
		var x = movingItem.style.left;
		var y = movingItem.style.top;
		movingItem.setAttribute("x", x);
		movingItem.setAttribute("y", y);
		var dialogId = movingItem.id.substring(0, movingItem.id.indexOf("_inner"));
		movingItem.style.cursor=movingItem.getAttribute("oldcursor");
		moveRestrict=null;
		var releaseMethod = movingItem.getAttribute("releasemethod");
		if(!undef(releaseMethod))
		{
			var meth=releaseMethod+"('"+movingItem.id+"')";
			eval(meth);
		}
		if(movingItem.id=="dockedHiddenFrame")
			HFDocked="";
		else if(!isModal(movingItem) && movingItem.getAttribute("hasmoved")=="true")
			sendEvent("setposition", dialogId, x + ":" + y);
		// movingItem.setAttribute("hasmoved","false");
		movingItem = null;
	}
}


function moveable_onfocus(ctrlInst)
{
	var prefix;
	if(ctrlInst.id.indexOf("_last") != - 1)
	{
		prefix = ctrlInst.id.substring(0, ctrlInst.id.indexOf("_dialog_last"));
		var im = document.getElementById(prefix + "_image2");
		if(im && !MOBILE)
			im.focus();
		else
		{
			im = document.getElementById(prefix + "_image2");
			var labelId = ctrlInst.getAttribute("labelid");
			if(!undef(labelId))
			{
				var label = dojo.byId(labelId);
				if(label)
				{
					label=label.parentNode;
					label.tabIndex="0";
					if(!MOBILE){
						label.focus();
					}
				}
			}
		}
	}
	else if(ctrlInst.id.indexOf("_first") != - 1)
	{
		prefix = ctrlInst.id.substring(0, ctrlInst.id.indexOf("_first"));
		var last = document.getElementById(prefix + "_last");
		var button = document.getElementById(last.getAttributeNode("lastbuttonid").value);
		if(button && !MOBILE)
		{
			button.focus();
		}
	}
}
/* END moveable */

function resizeTextArea(itId)
{
	var it=document.getElementById(itId);
	if(undef(it))
		return;
	var ownerid=it.getAttribute("ownerid");
	var ownerEl=document.getElementById(ownerid);
	if(undef(ownerEl))
		return;

	var w=getLeftPosition(it) + it.clientWidth - getLeftPosition(ownerEl)-1;
	var h=getTopPosition(it) + it.clientHeight - getTopPosition(ownerEl)-1;
	if(w>it.clientWidth)
		ownerEl.style.width = w + "px";
	else
		positionTextAreaResizer(ownerEl.id);
	if(h>it.clientHeight)
		ownerEl.style.height= h + "px";
	else
		positionTextAreaResizer(ownerEl.id);
}

function setTextAreaSize(resId)
{
	var res=document.getElementById(resId);
	if(undef(res))
		return;
	var taId=res.getAttribute("ownerid");
	if(undef(taId))
		return;
	var ta=document.getElementById(taId);
	if(undef(ta))
		return;
	var w=ta.offsetWidth;
	var h=ta.offsetHeight;
	sendEvent("resize", taId, "'"+w+":"+h+"'");
}

function positionTextAreaResizer(taId)
{
	var ta=document.getElementById(taId);
	var res=document.getElementById(taId+"_res");
	if(undef(res)||undef(ta))
		return;
	res.style.position="absolute";
	var t=parseInt(ta.offsetHeight-res.offsetHeight + getTopPosition(ta) -1);
	res.style.top=t;
	var l=parseInt(ta.offsetWidth-res.offsetWidth + getLeftPosition(ta) -1);
	res.style.left=l;
}

function isModal(ctrlInst)
{
	var modal = ctrlInst.getAttribute("modal");
	if(modal == null || modal != "false")
		return true;
	else
		return false;
}

function setItemVisibility(id, visible)
{
	var el = getElement(id);
	if(el)
	{
		el.style.visibility = visible;
	}
}

function setItemDisplay(id,disp)
{
	var el = getElement(id);
	if(el)
	{
		el.style.display = disp;
	}
}

function refreshValue(id, value, title)
{
	var el = getElement(id);
	if(el)
	{
		el.value = value;
		el.title = title+" "+value;
	}
}

function makeReadOnly(id, ro)
{
	var el = getElement(id);
	if(el)
	{
		if(ro)
		{
			appendClass(el, "readonly");
			el.readOnly = true;
			el.tabIndex = "-1";
		}
		else
		{
			removeClass(el, "readonly");
			el.readOnly = false;
			el.tabIndex = "0";
		}
	}
}

/*
 * Stores the x, y position of the last click
 */
function setClickPosition(el, event)
{
	lastClickElement = el;
}

/*
 * Stores the x, y position of the last click
 */
function setClickElementId(id)
{
	var el = dojo.byId(id);
	if(el)
		lastClickElement = el;
}

function setExactClickPosition(event,el)
{
//	clickX=getLeftPosition(el);
//	clickY=getTopPosition(el);
	clickX=event.clientX-10;
	clickY=event.clientY+10;
	if(DESIGNMODE)
	{
		clickX+=document.documentElement.scrollLeft;
		clickY+=document.documentElement.scrollTop;
	}
}

/*
 * Gets the absolute position of obj
 */
function getLeftPosition(obj)
{
	return dojo.position(obj).x;
}

/*
 * Gets the absolute position of obj
 */
function getTopPosition(obj)
{
	return dojo.position(obj).y;
}


var dragWindowHandler;
var dragMouseUpHandler;
function _initDialog(dialogId, ctrlId, maxHeight, modal)
{
	setDialogPosition(dialogId, ctrlId, maxHeight);
	dialogCount++;
	hideObjs();
	if(modal)
	{
		addModalWaitLayer(dialogId + '_inner_dialogwait');
	}

	var dialog = dojo.byId(dialogId + '_inner');
	if(dialog)
	{
		dojo.connect(dialog, 'mousedown', dialog, function() {
			bringDialogToTop(this);
		});
		
		let btnGrp;
		if(dialog.querySelector('.dbottom')) {
			btnGrp = dialog.querySelector('.dbottom').querySelector('div[ctype=buttongroup]')
		} else if(dialog.getAttribute("id") === 'msgbox-dialog_inner') {
			btnGrp = dialog.querySelector('div[ctype=buttongroup]')
		}
		const pushBtns = btnGrp ? btnGrp.querySelectorAll("button") : false;
		if (btnGrp) {
			if (pushBtns && pushBtns.length === 3) {
				btnGrp.setAttribute("data-three-buttons", "true");
			} else {
				btnGrp.setAttribute("data-three-buttons", "false");
			}
    	}
		//increase dialog width on 3-button dialog if push button content(label) overflows
		if(!DESIGNMODE && dialog.querySelector('div[data-three-buttons=true]')){
			let dialog_Pb = dialog.getElementsByClassName('pb');
			for(let i = 0; i < dialog_Pb.length; i++){
				let pbOverflow = dialog_Pb[i].clientWidth < dialog_Pb[i].scrollWidth;
				while(pbOverflow) {
					dialog.width = parseInt(dialog.width) + 50;
					pbOverflow = dialog_Pb[i].clientWidth < dialog_Pb[i].scrollWidth;
				}
			}
		}

		if(!(MOBILE && isSafari())) //moveable overrides the close x on mobile safari
		{
			movable = new dojo.dnd.move.constrainedMoveable(dialog, {
				constraints : function() {
					// PMR 54898,003,756: in RTL constrainedMoveable should be constrained from the right
					if (document.body.dir == "rtl") {
						return {'t': 0, 'l': -1 * (dialog.clientWidth - 50), 'w': document.documentElement.scrollWidth + 2 * (dialog.clientWidth - 50)};
					}
					return {'t': 0, 'l': -1 * (dialog.clientWidth - 50)};
				},
				within: true,
				skip: true,
				handle: dojo.byId(dialogId + '_content0'),
				delay: 1
			});
			dojo.connect(movable, 'onFirstMove', function(mover) {
				dialog.setAttribute('hasmoved','true');
				require(["dojo/_base/sniff"], function(has){
					if(dojo.isIE <= 8 || dojo.isFF || (!has("ie") && has("trident") > 6) || dojo.isChrome){ // IE8 and lower, FF, and IE11 do not handle mouseup at the window level
						dragWindowHandler = dojo.connect(document.body, "onmouseleave,pointerup", mover, function(event) {
							mover.destroy();
							dojo.disconnect(dragMouseUpHandler);
							window.setTimeout("dojo.disconnect(dragWindowHandler)",100);
						});
					}
				})
				dragMouseUpHandler = dojo.connect(this, "onMouseUp", mover, function(event) {
					mover.destroy();
					dojo.disconnect(dragWindowHandler);
					dojo.disconnect(dragMouseUpHandler);
				});
			});
		}
		dojo.connect(movable, 'onMouseDown', null, function() {
			reFocusItem();
			bringDialogToTop(dialog);
		});
		dojo.publish("showdialog",[{"id":dialogId+"_inner"}]);
		if(MOBILE || SCREENREADER){
			dialog.setAttribute('tabindex','-1');
			dialog.focus();
		}
	}
}

function fixDialogPosition(id,ctrlId,max)
{
	var dialog = getElement(id+"_inner");
	if(!dialog)
		return;
	// reset dialog height in case it's smaller than browser window now
	var sized = !undef(dialog.getAttribute("sized"));
	var hasMoved = (dialog.getAttribute("hasmoved")=="true");
	if(hasMoved)
		return;
	var positionAtTop = dialog.getAttribute("positionAtTop")=="true";
	if(sized || positionAtTop)
	{
		dialog.removeAttribute("positionX");
		dialog.removeAttribute("positionX");
		dialog.removeAttribute("sized");
	}
	var dialogbottom = dialog.offsetHeight;
	try
	{
		dialogbottom +=getTopPosition(dialog);
	}
	catch(error)
	{}
	if((MOBILE) || (dialogbottom>document.body.offsetHeight) || (dialog.offsetHeight>document.body.offsetHeight))
		setDialogPosition(id,ctrlId,max);
	else if(sized)
		setDialogLeftTop(dialog);
}

function makeDialogScroll(id, ctrlId, max) {
	if(!MOBILE) {
		makeDialogScrollable(id, ctrlId, max);
	}
}

function makeDialogScrollable(id, ctrlId, max) {
	window.setTimeout(function(){
		require(["dojo/window"], function(win){
			var constraints = getDialogConstraints();
			var dialog = getElement(id + "_inner");
			var scrollDiv = getElement(ctrlId + "_bodydiv");
			var widthset = false;
			var heightset = false;
			if(scrollDiv)
			{
				// Reset dialog and scrollable width so they resize appropriately
				dialog.style.width = '';
				scrollDiv.style.width = '';
				if(MOBILE)
				{
					if (dialog.id.indexOf("msgbox") >= 0)
						scrollDiv.style.height = "100px";
					else
						scrollDiv.style.height = "250px";
					scrollDiv.style.overflow = "auto";
					scrollDiv.style.height = scrollDiv.scrollHeight+30 + "px";
					scrollDiv.style.width = scrollDiv.scrollWidth + "px";
					scrollDiv.style.position = "relative";
					dialog.setAttribute("sized", "true");
					widthset = true;
				}
				else
				{
					if(dialog.offsetWidth > document.body.offsetWidth)
					{
						dialog.style.width = document.body.offsetWidth - 80 + "px";
						var width = document.body.offsetWidth - 70;
						if(width < constraints.minwidth)
						{
							width = constraints.minwidth;
							alignBeginning = true;
						}
						scrollDiv.style.width = width + "px";
						window.setTimeout(function(){
							scrollDiv.style.position = "relative";
						},200);
						scrollDiv.style.overflow = "scroll";
						dialog.setAttribute("sized", "true");
						widthset = true;
					}
		
				    var vs = win.getBox();
					if(max < 0)
					{
						max = vs.h - constraints.v;
					}
					if(max > 0 && scrollDiv.offsetHeight > max)
					{
						if(max < constraints.minheight)
						{
							max = constraints.minheight;
							alignTop = true;
						}
						scrollDiv.style.height = max + "px";
						if(scrollDiv.style.overflow != "auto")
						{
							var width = scrollDiv.clientWidth + constraints.h;
							scrollDiv.style.width = width + "px";
						}
						scrollDiv.style.position = "relative";
						scrollDiv.style.overflow = "auto";
						dialog.setAttribute("sized", "true");
						heightset = true;
	          //new CustomScrollable(scrollDiv);  This causes a problem with dialog resizing. see GRAPHITE-32970
					}
					else if(scrollDiv.style.overflow == "auto"){
						var diff = parseInt(scrollDiv.style.height) - parseInt(dojo.query("table", scrollDiv)[0].clientHeight);
						if(diff>0) {
							scrollDiv.style.height = ""; 
						}
					}
				}
				if(dialog.getAttribute("hasmoved")!="true") {
					var dialogBox = dojo.marginBox(dialog);
					var windowBox = dojo.marginBox(document.body);
					var tooWide = (dialogBox.l + dialogBox.w) > windowBox.w;
					var tooTall = (dialogBox.t + dialogBox.h) > windowBox.h;
					if(widthset || heightset || tooTall || tooWide) {
						setDialogLeftTop(dialog, false, false);			
					}
				}
			}
		});
    }, 1);
}


var dialogResizeHandlers = {};
var dialogResizeTimer;
/*
 * Positions the dialog in the middle of the screen
 */
function setDialogPosition(id,ctrlId,max)
{
	var dialog = getElement(id + "_inner");
	if(SCREENREADER) {
		if(!dialogResizeHandlers[id]){
			dialogResizeHandlers[id] = window.addEventListener('resize', function(){
				dialogResizeTimer = window.setTimeout(function(){
					if(dialogResizeTimer){
						window.clearTimeout(dialogResizeTimer);
					}
					dialogResizeTimer = setTimeout(function(){
						var resizeDialog = getElement(id + "_inner");
						if(!dialog){
							delete dialogResizeHandlers[id];
							return;
						}
						setDialogPosition(id, ctrlId, max);
					}, 250);
				});
			});
		}
	}
	// Removing fix for 320192. It must be fixed in a different way.
	//dialog.click();
	var scrollDiv = getElement(ctrlId + "_bodydiv");
	var widthset = false;
	var alignTop = false;
	var alignBeginning = false;
	makeDialogScrollable(id, ctrlId, max);
	dialog.style.top = "-5000";
	dialog.style.visibility = "hidden";
	scrollDiv.tabIndex = "-1";

	if(dialog.offsetHeight > document.body.offsetHeight && !MOBILE)
	{
		var height = document.body.offsetHeight - 100;
		if(height < 200)
		{
			height = 200;
		}
		dialog.style.maxHeight = height;
	}

	if(widthset)
	{
		scrollDiv.style.width = dialog.offsetWidth - 10 + "px";
	}

	setDialogLeftTop(dialog, alignTop, alignBeginning);
	fadeDialog(id);
	bindEventsArray(dialog, eventBindObjects);
	showWait(dialog);
	if (DESIGNMODE)
	{
		sizeCanvasForDialog(parseInt(dialog.offsetWidth) + parseInt(dialog.style.left) + 10, parseInt(dialog.offsetHeight) + parseInt(dialog.style.top) + 10);
	}
}

function setDialogLeftTop(dialog, alignTop, alignBeginning)
{
	if(!dialog)
		return;

	if(MOBILE)
	{
		var scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
		if(isIE())
		{
			dialog.style.top = scrollTop - 18;
			if(document.body.dir != "rtl")
			{
				dialog.style.left = document.documentElement.scrollLeft - 3 + "px";
			}
			else
			{
				dialog.style.left = 0 - (dialog.offsetWidth + 3 + document.documentElement.scrollLeft) + "px";
			}
		}
		else if(dojo.isFF)
		{
			dialog.style.top = scrollTop + "px";
			if(document.body.dir != "rtl")
			{
				dialog.style.left = document.documentElement.scrollLeft + "px";
			}
			else
			{
				dialog.style.right = document.documentElement.scrollLeft + "px";
				dialog.style.left = document.body.offsetWidth - dialog.offsetWidth - document.documentElement.scrollLeft + "px";
			}
		}
		else
		{
			dialog.style.top = scrollTop + "px";

			if(dialog.offsetHeight < window.innerHeight){
				dialog.style.top = ((window.innerHeight - dialog.offsetHeight ) / 2 ) + scrollTop + "px"; 
			}
			
			if(document.body.dir != "rtl")
			{
				dialog.style.left = document.documentElement.scrollLeft + "px";
			}
			else
			{
				dialog.style.left = document.body.offsetWidth - dialog.offsetWidth - document.documentElement.scrollLeft + "px";
			}
		}
	}
	else if(DESIGNMODE || dialog.getAttribute("positionAtTop") == "true")
	{
		dialog.style.top = 20;
		if(document.body.dir != "rtl")
		{
			dialog.style.left = 20 + "px";
		}
		else
		{
            dialog.style.left = document.body.offsetWidth - dialog.offsetWidth - 20 + "px";
		}
	}
	else
	{
		var viewport = dojo.window.getBox();
		var dialogBox = dojo.marginBox(dialog);

		var left;
		if(alignBeginning)
		{
			left = 0;
		}
		else
		{
			var x = dialog.getAttribute("positionX");
			if(x)
			{
				left = parseInt(x);
			}
			else
			{
				left = (viewport.w - dialogBox.w) / 2;
			}
		}
		if(document.body.dir == "rtl")
		{
			// Per PMR 54898,003,756, 'fixed' positioning of dialog holder element will be used (see page.jsp),
			// 'static' breaks dialog "modalness"
			var right = left;

			if(dojo.isIE)
				viewport.l = viewport.l - (document.documentElement.scrollWidth - viewport.w);

			var maxRight = viewport.w - dialogBox.w;
			if(right > maxRight)
			{
				right = maxRight;
			}
			else if(right < 0)
			{
				right = 0;
			}
			else if(isIE()){
				right = maxRight - right; 
			}
			dojo.style(dialog, {
				left: right + "px"
			});
		}
		else
		{
			left += viewport.l;
			var maxLeft = document.documentElement.scrollWidth - dialogBox.w;
			if(left > maxLeft)
			{
				left = maxLeft;
			}
			if(left < 0)
			{
				left = 0;
			}
			dojo.style(dialog, {
				left: left + "px"
			});
		}

		var top;
		if(alignTop)
		{
			top = 0;
		}
		else
		{
			var y = dialog.getAttribute("positionY");
			if(y)
			{
				top = parseInt(y);
			}
			else
			{
				top = (viewport.h - dialogBox.h) / 2;
			}
		}
		top += viewport.t;
		var maxTop = document.height - dialogBox.h;
		if(document.height < viewport.t + viewport.h)
		{
			maxTop = viewport.t + viewport.h - dialogBox.h;
		}
		if(top > maxTop)
		{
			top = maxTop;
		}
		if(top < 0)
		{
			top = 0;
		}

		dojo.style(dialog, {
			top: top + "px"
		});
	}
}

function fadeDialog(id)
{
	var dialog = getElement(id+"_inner");
	dialog.setAttribute("originalClass",dialog.className);
	if(FADE_VALUE<100)
		appendClass(dialog,"opacity_0");
	dialog.style.visibility="visible";
	if(FADE_VALUE<100)
		window.setTimeout("opacityUp('"+id+"',"+FADE_VALUE+")",FADE_SPEED);
}


function opacityUp(id, op)
{
	var dialog = getElement(id+"_inner");
	replaceClass(dialog,"opacity_"+(op-FADE_VALUE), "opacity_"+op);
	if(op<100)
		window.setTimeout("opacityUp('"+id+"',"+(op+FADE_VALUE)+")",FADE_SPEED);
	else
		dialog.className=dialog.getAttribute("originalClass");
}


//removes leading and trailing whitespaces
function trim(value)
{
	return LTrim(RTrim(value));
}

//Removes leading whitespaces
function LTrim(value)
{
	var re = /\s*((\S+\s*)*)/;
	return value.replace(re, "$1");
}

//Removes ending whitespaces
function RTrim(value)
{
	var re = /((\s*\S+)*)\s*/;
	return value.replace(re, "$1");
}

/*
 * Checks the CSS class of an element for a particular class.
 */
function classContains(id, className)
{
	var el = getElement(id);
	if(!el)
		return;
	var cName=el.className;
	if(undef(cName))
		return;
	if(el.className.indexOf(className) > - 1)
		return true;
	return false;
}

/*
 * Appends a CSS class to the existing class value.
 */
function appendClass(ctrlInst, cssClass)
{
	if(undef(ctrlInst))
		return;
	var oldClass = ctrlInst.className;
	if(!undef(oldClass))
	{
		if(!undef(ctrlInst) && oldClass.indexOf(cssClass)==-1)
		{
			ctrlInst.className = trim(oldClass) + " " + trim(cssClass);
		}
	}
	else
	{
		ctrlInst.className=cssClass;
	}
}

/*
 * Prepends a CSS class to the existing class value.
 */
function prependClass(ctrlInst, cssClass)
{
	if(undef(ctrlInst))
		return;
	var oldClass = ctrlInst.className;
	if(!undef(oldClass))
	{
		if(!undef(ctrlInst) && oldClass.indexOf(cssClass)==-1)
		{
			ctrlInst.className = trim(cssClass) + " " + trim(oldClass);
		}
	}
	else
	{
		ctrlInst.className=cssClass;
	}
}


/*
 * Completely removes a CSS class from the control.
 */
function removeClass(ctrlInst, cssClass)
{
	if(undef(ctrlInst))
		return;
	var oldClass = ctrlInst.className;
	if(!undef(ctrlInst) && !undef(oldClass) && oldClass.indexOf(cssClass) > -1 )
	{
		oldClass = oldClass.replace(cssClass, "");
		oldClass = oldClass.replace(/'  '+/g, '');
		ctrlInst.className = trim(oldClass);
	}
}

/*
 * Replaces a CSS class with another.
 */
function replaceClass(ctrlInst, cssClass, cssClassReplaceWith)
{
	if(undef(ctrlInst))
		return;
	var controlClass = ctrlInst.className;
	if(!undef(ctrlInst) &&!ctrlInst.disabled && controlClass.indexOf(cssClass) > -1 )
	{
		controlClass = controlClass.replace(cssClass, cssClassReplaceWith);
		controlClass = controlClass.replace(/'  '+/g, '');
		ctrlInst.className =  trim(controlClass);
	}
}


/*
 * Checks to see if a value is null, empty or undefined
 */
function undef(p)
{
	var bUndef = false;
	switch(typeof(p))
	{
	case "undefined" :
		bUndef = true;
		break;
	case "null" :
		bUndef = true;
		break;
	case "object" :
		if(p == null)
			bUndef = true;
		break;
	case "number" :
		if(null == p)
			bUndef = true;
		break;
	case "string" :
		if("" == p)
			bUndef = true;
		else if("undefined" == p)
			bUndef = true;
		break;
	}
	return bUndef;
}

/*
This method is used inside the bulletinboardportlet component
It expands / contracts messages inside the bulletinboard.
Since there is no interaction with the backend and this functionality is purely front - end,
this method is needed here. Modified by Venky for BB on 11/9/07
 */
function bboard_displayMessage(componentId, bbindex, expandOnlyOne,bulletinboarduid)
{
	var msgboxdiv = getElement(componentId + '_bbmessagemain_' + bbindex);
	var msgdiv = getElement(componentId + '_bbmessage_' + bbindex);
	var msglink = getElement(componentId + '_bbmessagelink_' + bbindex);
	var msgdate = getElement(componentId + '_bbmessagedate_' + bbindex);
	var msgtable = getElement(componentId + '_table');
	var shortmsg = getElement(componentId + '_bbmsg_'+bulletinboarduid);
	var fullsub = getElement(componentId + '_bbfullsub_'+bulletinboarduid);
	var shortsub = getElement(componentId + '_bbshortsub_'+bulletinboarduid);

	if(msgboxdiv.style.display == 'none')
	{
		msglink.className = "text bbmlo";
		// msgdate.className = "text bbmdo";

		msgboxdiv.style.display = 'inline';
		if(!undef(shortmsg))
			shortmsg.style.display='none';
		fullsub.style.display='flex';
		shortsub.style.display='none';
		fullsub.setAttribute("aria-label",fullsub.textContent+" "+EXPANDED);
		shortsub.removeAttribute("aria-label");

		// This message is clicked to expand so it is Viewed/read. call the bean
		// method to add this
		// message to table
		sendEvent('bbmsgviewed', componentId, bulletinboarduid);
		setCurrentfocusId(null, fullsub);

		if(expandOnlyOne)
		{
			if(msgtable.selectedMsgIndex != - 1)
			{
				var oldOpened = msgtable.selectedMsgIndex;
				var oldmsglink = getElement(componentId + '_bbmessagelink_' + oldOpened);
				var oldmsgdate = getElement(componentId + '_bbmessagedate_' + oldOpened);
				var oldmsgboxdiv = getElement(componentId + '_bbmessagemain_' + oldOpened);
				var oldshortmsg = getElement(componentId + '_bbmsg_'+bulletinboarduid);
				var oldfullsub = getElement(componentId + '_bbfullsub_'+bulletinboarduid);
				var oldshortsub = getElement(componentId + '_bbshortsub_'+bulletinboarduid);

				if(oldmsgboxdiv)
				{
					oldmsgboxdiv.style.display = 'none';
					oldshortmsg.style.display='inline';
					oldfullsub.style.display='none';
					oldshortsub.style.display='flex';
					oldshortsub.setAttribute("aria-label",oldshortsub.textContent+" "+COLLAPSED);
					oldfullsub.removeAttribute("aria-label");
					if(oldmsg)
					{
						oldmsglink.className = "text bbmlc";
						oldmsgdate.className = "text bbmdc";
					}
				}
			}
		}
		msgtable.selectedMsgIndex  = bbindex;
	}
	else
	{
		msglink.className = "text bbmlc";
		// msgdate.className = "text bbmdc";
		msgboxdiv.style.display = 'none';
		if(!undef(shortmsg))
			shortmsg.style.display='inline';
		fullsub.style.display='none';
		shortsub.style.display='flex';
		shortsub.setAttribute("aria-label",shortsub.textContent+" "+COLLAPSED);
		fullsub.removeAttribute("aria-label");
	}
}

/** @deprecated use console.log() */
function log(stringVal, stamp)
{
	if(stamp !== false)
		console.log(new Date() + " : " + stringVal);
	else
		console.log(stringVal);
}

/** @deprecated use console.log() */
function fileLog(stringVal, stamp)
{
	log(stringVal, stamp);
}

function radiobutton_onkeypress(event, button, groupid)
{
	var el;
	if(hasKeyCode(event, 'KEYCODE_RIGHT_ARROW|KEYCODE_DOWN_ARROW'))
	{
		el=document.getElementById(button.getAttribute("nextrb"));
		if(el)
		{
			el.focus();
			cancelEvent(event);
		}
		return;
	}
	else if(hasKeyCode(event, 'KEYCODE_LEFT_ARROW|KEYCODE_UP_ARROW'))
	{
		el=document.getElementById(button.getAttribute("prevrb"));
		if(el)
		{
			el.focus();
			cancelEvent(event);
		}
		return;
	}
	showFieldHelpById(event,groupid);
}

function finishPortlet(id) {
//	dojo.style(dojo.byId("load_"+id), {"display":"none"});
	hideShowElement("load_"+id,false);
	if (typeof processLoadMethods === 'function') {	
		processLoadMethods();
	}
}

function deadPortlet(id) {
	markPortletFailed(id);
	var retryLink = dojo.byId(id+"_retryanchor");
	if(retryLink) {
		retryLink.style.display="none";
	}
}

function setupPortlet(def) {
	//id, title, layoutId, headerId, reload
	var headerLabelTD = dojo.byId(def.headerId+"_header_0");
	var headerRow = headerLabelTD.parentNode;
	var cellNum = 2;
	//search to find the correct placement
//	for(var index=0;index<headerRow.cells.length;index++)
//	{
//		var cell = headerRow.cells[index];
//		var firstDiv = dojo.query("div, .ts", cell);
//		if(firstDiv.length>0) {
//			cellNum = index+1;
//			break;
//		}
//	}
	var spacerDiv = dojo.query("div, .ts", headerRow);
	if(spacerDiv[0]) {
		cellNum = spacerDiv[0].parentNode.cellIndex + 1;
	}
	
	var newCell = headerRow.insertCell(cellNum);
	newCell.className = headerLabelTD.className;
	var refLink = document.createElement("A");
	var refImg = document.createElement("IMG");
	if(!SCREENREADER) {
		dojo.style(refLink, {"visibility":"hidden"});
		dojo.connect(headerRow, "onmouseover", headerRow, function(){dojo.style(dojo.byId(def.id+"_reflink"),{"visibility":"visible"})});
		dojo.connect(headerRow, "onmouseout", headerRow, function(){dojo.style(dojo.byId(def.id+"_reflink"),{"visibility":"hidden"})});
	}
	refLink.addEventListener('focus', function(event){
		setCurrentfocusId(event, event.currentTarget);
	});
	dojo.attr(refLink, {"id":def.id+"_reflink","href":"javascript: sendEvent('refreshdata','"+def.id+"','refresh')","title":def.reload});
	dojo.attr(refImg, {"src":IMAGE_PATH+"small_refresh.png","alt":def.reload, "aria-hidden":"true"});
	dojo.style(refImg, {"padding":"0px"});
	refLink.appendChild(refImg);
	newCell.appendChild(refLink); 
}

function refreshPortlet(compId, layoutId) {
	var action = PORTLETACTION+'&pcompid='+compId;
	var holder = dojo.byId("portletbody_"+layoutId);
	if(holder) {
		holder.innerHTML = "";
	}
	var progress = dojo.byId("load_"+layoutId);
	if(progress) {
//		dojo.style(progress, {"display":""});
		hideShowElement(progress,true);
		var img = dojo.byId(compId+"_image");
		if(img) {
			var progress = dojo.byId("load_"+layoutId);
			img.src = IMAGE_PATH+"progressbar.gif";
			var loadingLabel = dojo.attr(img,"loadinglabel");
			dojo.attr(img,{"ariaHidden":"true"});

            if(SCREENREADER){
                makeChildrenMoreAccessible();
            }
		}
	}
	var proc = processPortletXHR;
	sendXHRGet(action ,'xml' , proc, failedPortlet);
	
}

function processPortletXHR(responseObj, ioArgs, componentId) 
{
	if (ioArgs.xhr.responseText && responseObj.parseError && responseObj.parseError.errorCode != 0)
	{
		var error = responseObj.parseError;
		console.error("Error on line " + error.line + " character " + error.linePos +
				"\nError Code: " + error.errorCode +
				"\nError Reason: " + error.reason +
			"Src: " + error.srcText);
		failedPortlet(responseObj, ioArgs);
	}
	else if (ioArgs.xhr.responseText && responseObj.documentElement && responseObj.documentElement.nodeName == "parsererror")
	{
		console.error(responseObj.documentElement.childNodes[0].nodeValue);
		failedPortlet(responseObj, ioArgs);
	}
	else
	{
		processXHR(responseObj, ioArgs);
	}
};

function failedPortlet(error, ioArgs) {
	var uriLoc = ioArgs.url.indexOf("?");
	if(uriLoc==-1) {
		return;
	}
	uriLoc++;
	var uri = ioArgs.url.substring(uriLoc);
	var nameValuePairs = uri.split("&");
	var compId = "";
	var title = "";
	for(var i=0;i<nameValuePairs.length;i++) {
		var nameAndValue = nameValuePairs[i].split("=");
		if(nameAndValue[0]=="pcompid") {
			compId = nameAndValue[1]; 
		}
		if(nameAndValue[0]=="title") {
			title = nameAndValue[1]; 
		}
	}
	markPortletFailed(compId);
}

function markPortletFailed(compId)
{
	if(compId!="") {
		var img = dojo.byId(compId+"_image");
		if(img) {
			img.src = IMAGE_PATH+"st_MessageWarning.png";
		}
		var retryLink = dojo.byId(compId+"_retrylink");
		if(retryLink) {
			hideShowElement(retryLink,true);
//			dojo.style(retryLink,{"display":"inline"});	
		}
	}
}

function rsportlet_onmouseup(component) {
	if (isIE() && !hasFocus(component))
		component.focus();
}

/*
This method is used inside the resultsetportlet component for filter inputs.
It changes the background color of the input fields.
Since these inputs are not standard textfields, we need this custom behaviour.
 */
function rsportlet_filterActivate(component, isActive)
{
	if(isActive) {
		appendClass(component, "ff");
		if (isBidiEnabled)
			input_bidi_onfocus(null, component);
	}
	else {
		removeClass(component, "ff");
		if (isBidiEnabled)
			input_bidi_onblur(null, component);
	}
}

/*
This method fires the setValue of the resultset filter field. It works like input_changed
except that setvalue should go to the portelt control
 */
var previousQbe;
function rsportlet_onchange(event,component,componentId,controlId)
{
	var inputs = getHiddenForm().elements;
	inputs.namedItem("changedcomponentid").value = controlId;

	var attribname = componentId.substr(0, componentId.indexOf("@"));
	var value = component.value;
	var qbe = attribname + "~^" + value;

	previousQbe = qbe;

	if (isBidiEnabled)
		processBidiKeys(null,component);

	inputs.namedItem("changedcomponentvalue").value = previousQbe;

}

/*
This method is used inside the resultsetportlet component for setting QBE through filter inputs.
Since these inputs are not standard textfields, we need this custom behaviour.
 */
function rsportlet_onkeypress(event, portletId, componentId)
{
	if(hasKeyCode(event, "KEYCODE_ENTER"))
	{
		var element  = getElement(componentId);
		var attribname = componentId.substr(0, componentId.indexOf("@"));
		var value = element.value;
		var qbe = attribname + "~^" + value;
		sendEvent('setqbeandfilter', portletId, qbe);
	}
}

/*
A wrapper around setInterval used to set periodic calls to a method
It is necessary to use MAINDOC, there are problems if this is attempted
through the hidden frame
 */
function addTimeout(methodName, time)
{
	window.setTimeout(methodName, time);
}

var timeoutID = null;
/*
 * Kills the old timeout (who's id is stored in the timeoutID var) and replaces
 * it with a new one. The new timeout id is stored in timeoutID var. Sending a
 * time less than 1 will just clear the timeout and not add a new one
 */

function replaceTimeout(methodName, time)
{
	if (timeoutID != null)
	{
		window.clearTimeout(timeoutID);
	}
	if (time > 0)
	{
		timeoutID =window.setTimeout(methodName, time);
	}
}

function addQueryTimeout(methodName, time)
{
	currentQueryId = window.setInterval(methodName, time);
}


function cancelQueryTimeout()
{
	if(!undef(currentQueryId))
	{
		clearInterval(currentQueryId);
		currentQueryId = null;
	}
	clearLongOpTimeOut();
}

function callPeriodically(methodName, period)
{
	// setTimeout(methodName, 0);
	currentTimerId = setInterval(methodName, period);
	return currentTimerId;
}

function cancelTimerCalls()
{
	if(!undef(currentTimerId))
	{
		clearInterval(currentTimerId);
		currentTimerId = null;
	}
}
var longOpFunction = null;

/*
Calls longopcheck on the long op dialog.
Unfortunately, the dialog name has to been hardcoded
 */
function dolongopcheck()
{
	longOpFunction = "dolongopcheck();";
	queueManager.flush;  //make sure no other events are sent with longop check
	sendXHREvent("longopcheck", "longopwait", null, REQUESTTYPE_SYNC);
}

function dolongopquerycheck()
{
	longOpFunction = "dolongopquerycheck();";
	queueManager.flush;  //make sure no other events are sent with longop check
	sendXHREvent("longopquerycheck", "query_longopwait", null, REQUESTTYPE_SYNC);
}

var longOpTimeOut = null;

function addLongOpTimeout(methodName, time)
{
	longOpTimeOut = window.setTimeout(methodName, time);
}

function clearLongOpTimeOut()
{
	if (longOpTimeOut != null)
	{
		window.clearTimeout(longOpTimeOut);
		longOpTimeOut = null;
	}
}

function showMessage(type, text, dialog)
{
	var messageImageElement=null;
	var messageElement=null;
	if(dialog)
		messageElement = getElement("dialogmessage");
	else
	{
    if(OUTER_APPLICATION){
      let messageId = EMBEDDED_MESSAGE_PREFIX+'embedded-app-notify';
      let embeddedType = type;
      switch(type){
        case 1:
          embeddedType = 'info';
          break;
        case 2: 
          embeddedType = 'warning';
          break;
        case 3:
          embeddedType = 'error';
          break;
        default:
          embeddedType = 'success';
      }
		  window.top.postMessage({[messageId]:{type: embeddedType, text: text}},'*');
      return;
    }
    else {
		  messageElement = getElement("titlebar_error");
		  messageImageElement = getElement("titlebar_error_image");
    }
	}
	if(!messageElement)
		return;
	
	(dialog?messageElement:getElement('titlebar_error_table')).addEventListener('click', function(){
		removeUserMessage(dialog);
	});
	
	if(messageImageElement)
	{
		if(type===0 && SKIN.indexOf("mas8")>-1){
			type = 1;
		}
		var messageImage = IMAGE_PATH;
		switch(type)
		{
		case 0 :
			messageImage = "";
			break;
		case 1 :
			// information
			messageImage += "information.gif";
			break;
		case 2 :
			// warning
			messageImage += "exclamation.gif";
			break;
		case 3 :
			// error
			messageImage += "error.gif";
			break;
		default :
			return;
		}
		messageImageElement.style.visibility="hidden";
		if(messageImage != "")
		{
			messageImageElement.src = messageImage;
			messageImageElement.style.visiblity="visible";
		}
	}
	messageElement.innerHTML = "";
	messageElement.style.height = 'auto';
	getElement('titlebar_error_table').setAttribute("data-message-type",type);
	messageElement.style.visibility = "visible";
	if(!dialog)
		messageElement.style.position="absolute";
	messageElement.innerHTML = text + "&nbsp;&nbsp;&nbsp;";

	if(!dialog)
	{
		var lft=(document.body.clientWidth/2)-(messageElement.clientWidth/2);
		messageElement.style.left=lft + "px";
		messageShowEffect(getElement("titlebar_error_table"),messageElement,document.body.dir == "rtl");
	}
	if(messageTimeout!=null)
	{
		window.clearTimeout(messageTimeout);
	}
	messageTimeout=window.setTimeout("removeUserMessage("+dialog+")", 5000);
}

function removeUserMessage(dialog)
{
	var messageElement;
	if(dialog) {
		messageElement = getElement("dialogmessage");
	}
	else {
		messageElement = getElement("titlebar_error");
	}
	if(messageElement) {
		if(!dialog && messageHideEffect(getElement("titlebar_error_table"), document.body.dir == "rtl")) {
			messageTimeout=null;
			return;
		}
		messageElement.innerHTML = "&nbsp;";
		if(!dialog)
			messageElement.style.position="";
		messageElement.style.visibility = "hidden";
		messageElement.style.height = '0px';
	}
	if(!dialog) {
		var messageImageElement = getElement("titlebar_error_image");
		if(messageImageElement)
			messageImageElement.style.visibility = "hidden";
	}
	messageTimeout=null;
}

function sendClick(id)
{
	var el = document.getElementById(id);
	if(el)
	{
		sendEvent('click', id, '');
	}
}

function stopTheRowFocus(event,el)
{
	event = (event) ? event : ((window.event) ? window.event : "");
	var src=getSourceElement(event);
	if(src.tagName!="A" && src.tagName!="SPAN")
		stopFocus=true;
}


function focusItem(id,sel)
{
	if(stopFocus)
	{
		stopFocus=false;
		return;
	}
	if(SCREENREADER)
	{
		var element = document.getElementById(id); 
		if(element){
			var lcId = element.getAttribute('lc');
			if(lcId){
				var lc = document.getElementById(lcId);
				if(lc){
					id = lcId;
				}
			}
		}
		else {
			window.MaximoShellCommunicator.get().emit("mas-shell-suite-header-set-focus", window.headerFocusId);
		}
		if(!showingMenu)
			delayedFocus(id,sel,FOCUSDELAY);
		else
			showingMenu=false;
	}
	else
		delayedFocus(id,sel,FOCUSDELAY);
}

function focusElement(element)
{
	if(!element) {
		return;
	}
	try
	{
		var widget;
		require(["dijit/registry"], function(registry){
			widget = registry.byId(element.id);
		});

		if(widget)
		{
			if(!MOBILE)
				widget.focus();
		}
		else
		{
		    // IV37290: textarea on IE will not always get focus correctly 
		    if(isIE() && element.tagName=="TEXTAREA")
		    {
		    	retryFocus(element, 300);
		    }
		    else
		    {
		    	if(element.hasAttribute('disabled')){
		    		element.disabled = false;
		    		if(!MOBILE)
		    			element.focus();
		    		if(!SCREENREADER){
		    			if (element.type == "radio"){
		    				dojo.connect(element, "blur", element, function() {
	    					    this.disabled = true;
		    				});
		    			}
		    			else {
		    				element.disabled = true;
		    			}
		    		}
		    	}
		    	else if(!MOBILE){
					if(element.offsetParent){
						element.focus();
					}
					else{
						if(lastClickElement){
							window.setTimeout(function(){document.getElementById(lastClickElement.id).focus()}, 50);
						}
						else{
							element.focus();
						}
					}
		    	}
		    	if(pageScrollArea && element && pageScrollArea.contains(element)){
		    		require(["dojo/dom-geometry"], function(domGeom){
		    			var psaBox = domGeom.position(pageScrollArea);
		    			var elementBox = domGeom.position(element);
		    			if((elementBox.y + elementBox.h) < psaBox.y){ //needs to scroll up
		    				element.scrollIntoView(true);
		    			}
		    			else if(elementBox.y > psaBox.y + psaBox.h){
		    				if(element.tagName != 'BUTTON' || SCREENREADER){
		    					element.scrollIntoView(false);
		    				}
		    			}
		    		});
		    	}
		    }
		}
	}
	catch (error)
	{
		//Element was not focused. Usually an error in IE if element is not visible.
	}
}

// IV37290: Keep retrying to get focus until it finally works
function retryFocus(element, timer)
{
	if(!hasFocus(element) && !MOBILE)
	{
		element.focus();
		if(timer > 0)
		{
			window.setTimeout(function(){retryFocus(element, timer - 10)}, 10);
		}
	}
}

//Called to focus on an item, whether default focus for a container or a
//specifically focused component
function focusOnItem(id,sel)
{
	if(id.length==0)
		return;
	var el = document.getElementById(id);
	if(!el)
	{
		var rowIndex = id.indexOf("[R:");
		if(rowIndex>-1)// this is a safety check
		{
			el = document.getElementById(id.substring(0,rowIndex));
		}
	}

	if(el && el.tagName === 'LI'){
		el = el.querySelector('A')
	}
	
	if(el)
	{
		if((el.tabIndex != "0" && el.tagName != 'A') && el.tagName!='INPUT' && el.classList && !el.classList.contains("dijitEditor"))
		{
			// Some elements may set focus ID, but may not actually take
			//  the focus. Their parent does.
			el = el.parentNode;
		}
		if(el.tagName=="TEXTAREA")
		{
			sel = false;
		}
		var hiddenForm = getHiddenForm();
		if(hiddenForm)
		{
			var inputs = hiddenForm.elements;
			if(inputs)
			{
				var cf = inputs.namedItem("currentfocus");
				if(!(SCREENREADER && (el.getAttribute("ctype")!="menuitem" || el.getAttribute("ctype")!="acmenuitem")))
				{
					if(cf && el.getAttribute("ctype")!="menuitem")
						cf.value = id;
				}
			}
		}
		if(!stopFocus)
		{
			if(sel && !id.className)
			{
				if(el.className.indexOf('noselect')==-1)
				{
					if (!inputchanged)
					{
						if(el.select)
							el.select();
						else
							document.getElementById("tempselect").select();
					}
				}
			}
			focusElement(el);
			if(!SCREENREADER)
				hideFocus(el);
		}
	}
}

function componentIsReadonly(id)
{
	return classContains(id, 'readonly');
}


function loadkpigraph(id, servpath)
{
	var el = getElement(id);
	if(!undef(el))
		el.src = servpath;
}

function handleLostSession(app){
	if((LIGHTNINGPORTALMODE || PORTALMODE) && app.indexOf('logout.jsp') > -1 && window.top.$M){
		let messageId = EMBEDDED_MESSAGE_PREFIX+'inner-app-lost-session';
		window.top.postMessage({[messageId]:true},'*');
	}
}

function setAppInfo(appInfo){
  try{
    console.table(JSON.parse(appInfo));
  }
  catch(error){
    console.log('AppInfo could not be parsed. ['+appInfo+']');
  }
}

function appSaved(appInfo){
	if((LIGHTNINGPORTALMODE || PORTALMODE)){
		let messageId = EMBEDDED_MESSAGE_PREFIX+'inner-app-saved';
		window.top.postMessage({[messageId]: JSON.parse(appInfo)},'*');
	}
}

function appNotify(message){
	if((LIGHTNINGPORTALMODE || PORTALMODE)){
		let messageId = EMBEDDED_MESSAGE_PREFIX+'inner-app-notification';
		window.top.postMessage({[messageId]: message},'*');
	}
}

function doclinkuploadbutton(event, ctrlInst)
{
    if(getElement("upload_iframe").parentNode.parentNode.parentNode.style.display=="none")
    {
        sendEvent("dialogok", ctrlInst.id, "");
        return;
    }
	showWait();
	setValueForFocusChange(null,null);
	window.setTimeout("doclinkuploadbuttonClick(null,null)",1000);
}

function doclinkuploadbuttonClick(event, ctrlInst)
{
	var uploadFrameDoc = getElement('upload_iframe').contentWindow.document;
	var uploadForm = uploadFrameDoc.getElementById('IMPORT');
	var iFrameSrc = getElement('upload_iframe').src
	try{
		let myResp;
		myResp = (evt) => {
			uploadFrameDoc = getElement('upload_iframe').contentWindow.document;
			if(!uploadFrameDoc.body || 
				uploadFrameDoc.body.innerHTML.length < 30 ||
				uploadFrameDoc.body.querySelector('h1[data-translate=block_headline]') != null) {
				hideWait();
				getElement('upload_iframe').contentWindow.document.location.reload();
				let errType = 2;
				let errMsg = UPLOAD_FAIL_WARN;
				if(uploadFrameDoc.body.querySelector('h1[data-translate=block_headline]') != null){
					errType = 3;
					errMsg = UPLOAD_FAIL_REASON + 
					uploadFrameDoc.body.querySelector('h1[data-translate=block_headline]').textContent;
				}
				showMessage(errType, errMsg);
				getElement('upload_iframe').src = iFrameSrc;
			}
			getElement('upload_iframe').removeEventListener('load',myResp);
		}
		getElement('upload_iframe').addEventListener('load',myResp);
		uploadForm.submit();
	}
	catch(error)
	{
		// IV26959 - Remove the wait or browser appears to freeze up.
		hideWait();
		alert(WebClientRuntime.replaceString(INVALIDFILENAMEMSG,"{0}",""));
	}
}

function submituploadform(ctrlInst)
{
	var upload_iframeDoc = getElement("upload_iframe").contentWindow.document;
	var uploadForm = upload_iframeDoc.getElementById("UPLOADIMPORT");
	try
	{
		uploadForm.submit();
	}
	catch(error)
	{
		alert('The file is invalid. ');
	}
}

function setPopupPosition(id)
{
	var popup = getElement(id);

	var clientArea=document.getElementById(clientAreaId);
	var header = document.getElementById(headerId);
	var top = getTopPosition(lastClickElement);
	var left = getLeftPosition(lastClickElement);
	var hrequired = parseInt(document.body.offsetWidth-2) - parseInt(popup.offsetWidth)-10 + document.documentElement.scrollLeft;
	var vrequired = parseInt(document.body.offsetHeight-2) - parseInt(popup.offsetHeight) + document.documentElement.scrollTop;

	if ((USERLANG == "AR") || (USERLANG == "HE"))
	{
		left -= (popup.offsetWidth - lastClickElement.offsetWidth);
		if (left < 0)
		{
			left += (popup.offsetWidth + 13);
			left=1;
		}

		if (isIE() && (document.documentElement.scrollHeight > document.body.offsetHeight))
		{
			left += 16;
		}

		/* Fix menu opening off limits */
		if (left > hrequired)
		{
			left = document.body.offsetWidth - popup.offsetWidth - 10;
		}
	}
	if (top > vrequired)
	{
		top = document.body.offsetHeight - popup.offsetHeight - 3;
	}

	if (MOBILE)
	{
		if(isIE())
		{
			top = document.documentElement.scrollTop + ((parseInt(document.body.clientHeight) - parseInt(popup.clientHeight))/2);
			left = document.documentElement.scrollLeft + ((parseInt(document.body.clientWidth) - parseInt(popup.clientWidth))/2);
		}
		else if(isAndroid())
		{
			top = document.documentElement.scrollTop + 75;
			left = document.documentElement.scrollLeft;
		}
		else
		{
			top = window.pageYOffset + document.documentElement.scrollTop + ((parseInt(window.innerHeight) - parseInt(popup.clientHeight))/2);
			left = window.pageXOffset + document.documentElement.scrollLeft + ((parseInt(window.innerWidth) - parseInt(popup.clientWidth))/2);
		}

	}

	top+=document.documentElement.scrollTop;
	left+=document.documentElement.scrollLeft;

	popup.style.top = top + "px";
	popup.style.left = left + "px";

	addMouseDownEventsForPopups(clientArea, header);

}

function addMouseDownEventsForPopups(notUsed1, notUsed2)
{
	addPopupMouseDowns();
}

function addPopupMouseDowns()
{
	addListener(document.body, "mousedown", (evt)=>{
    if(!evt.target.classList.contains('menus')){
      hideAllMenusNF()
    }
  },false);
}

function hidePopup()
{
	var popupNode = getElement("popup");
	// all we have to do is hide the popup since any event sent to a non-popup
	// page while a popup is open will kill it
	if(!undef(popupNode) && !undef(popupNode.parentNode))
		popupNode.parentNode.style.display="none";
	popupCount=0;
}

function enablePopupEvents()
{
	var popupNode = getElement("popup");

	if(IE)
		removeListener(popupNode, "click", cancelEvent, true);
	else
		removeListener(popupNode, "click", cancelEvent, true);
}

function disablePopupEvents()
{
	var popupNode = getElement("popup");

	if(IE)
		addListener(popupNode, "click", cancelEvent, true);
	else
		addListener(popupNode, "click", cancelEvent, false);
}

function anyAltPressed(event)
{
	return event.altKey;
}

function tableHotkey(event, element)
{
	if(SCREENREADER){
		tableHotkeys[KEYCODE_UP_ARROW]    = new Array(true, true, "previousrow");
		tableHotkeys[KEYCODE_DOWN_ARROW]  = new Array(true, true, "nextrow");
		tableHotkeys[KEYCODE_LEFT_ARROW]  = new Array(true, true, "previouspage");
		tableHotkeys[KEYCODE_RIGHT_ARROW] = new Array(true, true, "nextpage");
		tableHotkeys[KEYCODE_Z]           = new Array(true, true, "togglefilter");
	}
	var hk = tableHotkeys[event.keyCode];
	if ( hk != undefined  &&  hk[0] == event.ctrlKey  &&  (hk[1] == altPressed(event)))
	{
		// if a hotkey requires that alt not be pressed, we should check left and right
		if(hk[1]==false && anyAltPressed(event))
			return;
		var target = element.id;
		var eventname = hk[2];
		var src=getSourceElement(event);
		if(src)
		{
			id=src.id;
			var rowPart = id.substring(id.indexOf("[R:")+3);
			row=rowPart.substring(0,id.indexOf("]")-1);
		}
		sendEvent(eventname, target, row);
		cancelEvent(event);
	}
}

//appHotkeys gets populated at the bottom of page.jsp
var appHotkeys = new Array();

function addHotKey(accessKey, elementId, event){
	var element = getElement(elementId);
	if(!element){
		return;
	}
	var charCode = accessKey.charCodeAt(accessKey.length - 1)
	var ctrl = accessKey.indexOf("CTRL")>-1 || accessKey.indexOf("STRG")>-1;
	var alt = accessKey.indexOf("ALT")>-1;
	var keyList = appHotkeys[charCode];
	if(!keyList){
		appHotkeys[charCode] = new Array(
				new Array(ctrl, alt, elementId, event)
		);
	}
	else {
		require(["dojo/_base/array"], function(array){
			var matchIndex = -1;
			array.forEach(keyList, function(item, index){
				if(item[0]==ctrl && item[1]==alt){
					matchIndex = index;
				}
			});
			if(matchIndex >=0){
				keyList.splice(matchIndex, 1);
			}
			keyList.push(new Array(ctrl, alt, elementId, event));
			appHotkeys[charCode] = keyList;
		});
	}
	var toolTip = tpaeConfig.hotKeyLabel.replace("{0}", "<span class='navMenuHint'>"+accessKey+"</span>");
	var title = getElement(elementId).title;
	if(!isNaN(charCode)){
		dojo.attr(element, {'hotkey' : charCode});
	}
	if(title.indexOf(accessKey)<=0){
		var span = dojo.query('span', element)[0];
		if(span){
			if(SCREENREADER){
				accessKey = tpaeConfig.hotKeyLabel.replace('{0}', accessKey);
				span.title = span.innerHTML + '   ' + accessKey;
        let anchor = span.closest('a');
        if(anchor && anchor.getAttribute('role')==='menuitem'){
          let hotkeySpan = document.createElement('span');
          hotkeySpan.className = 'menuHotkey';
          hotkeySpan.innerText = accessKey;
          anchor.appendChild(hotkeySpan);
          anchor.parentElement.style.maxHeight = '3rem';
          anchor.style.maxHeight = '3rem';
        }
        else{
				  span.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;<span class="menuHotkey">' + accessKey + '</span>';
        }
			}
			else {
				title += span.innerHTML + '   '+accessKey;
				dojo.attr(element, {'title':title});
			}
		}
	}
}

function isHotkey(event)
{
	var hotkeysForKeycode = appHotkeys[event.keyCode];
	if (hotkeysForKeycode == undefined)
		return false;
	if(dialogCount>0)
		return false; // application hotkeys are not allowed on dialogs

	for (var i = 0; i < hotkeysForKeycode.length; i++ )
	{
		var params = hotkeysForKeycode[i];
		if ( event.ctrlKey == params[0] && (altPressed(event) == params[1]))
		{
			// if a hotkey requires that alt not be pressed, we should check left and right
			if(!params[1] && anyAltPressed(event))
				return false;
			return true;
		}
	}
	return false;
}

function appHotkey(event)
{
	var params;
	var hotkeysForKeycode = appHotkeys[event.keyCode];
	if (hotkeysForKeycode == undefined)
		return false;
	if(dialogCount>0)
		return; // application hotkeys are not allowed on dialogs

	for (var i = 0; i < hotkeysForKeycode.length; i ++ )
	{
		params = hotkeysForKeycode[i];
		if ( event.ctrlKey == params[0] && (altPressed(event) == params[1]))
		{
			// if a hotkey requires that alt not be pressed, we should check left and right
			if(!params[1] && anyAltPressed(event))
				return false;
			var target = params[2];
			var eventname = params[3];
			lastClickElement = getElement(target);
			if(!lastClickElement || (dojo.attr(lastClickElement, "enabled")!="false" && dojo.attr(lastClickElement.parentNode, "enabled")!="false")){
				var hk = dojo.attr(lastClickElement,'hotkey');
				if(!hk){
					continue;
				}
				var char = parseInt(hk);
				if(isNaN(char)){
					char = hk.charCodeAt(0)					
				}
				if(char != event.keyCode && char != event.charCode){
					continue;
				}
				if(lastClickElement && dojo.attr(lastClickElement,'disabled')!='true'){
					require(["dojo/on"], function(on){
						var newTarget;
						if(lastClickElement.tagName =='LI'){
							newTarget = dojo.query('A',lastClickElement)[0];
						}
						else if(lastClickElement.tagName =='A'){
							newTarget = lastClickElement;
						}
						if(newTarget){
							var href = newTarget.href;
							if(href.toLowerCase().startsWith('javascript:')){
								if(!href.toLowerCase().startsWith('javascript: //')){
									eval(decodeURI(href.substring(11)));
								} else {
									newTarget.click();
								}
								return true;
							}
						}
						on.emit(lastClickElement, "mousedown", {
						    bubbles: true,
						    cancelable: true
						});
						on.emit(lastClickElement, "mouseup", {
						    bubbles: true,
						    cancelable: true
						});
						on.emit(lastClickElement, "click", {
						    bubbles: true,
						    cancelable: true
						});
					});
					return true;					
				}
			}
			cancelEvent(event);
			return false;
		}
	}
	return false;
}

function hideObjs()
{
	if(objsHidden)
		return;

	var objs = document.getElementsByTagName("OBJECT");
	var len = objs.length;
	for(var i = 0; i < len; i ++ )
	{
		var obj = objs[i];

		// if obj has visibility callback, then notify object
		// of visibility change
		try { obj.visibilityCallback(false); } catch (e) {}
		
		if(dojo.attr(obj, 'mxhideapplet')=='false'){
			objsHidden = true;
			return;
		}
		var ch = obj.clientHeight;
		var cw = obj.clientWidth;
		if(ch > 1)
		{
			var back = document.getElementById(obj.id + "_back");
			if(back)
			{
				back.style.height = obj.offsetHeight + "px";
				back.style.width = obj.offsetWidth + "px";
				back.style.display = "";
			}
			
			if (obj.height.indexOf("%") > - 1)
				obj.setAttribute("dimensionHeight",obj.height);
			else
				obj.setAttribute("dimensionHeight",ch);

			if (obj.width.indexOf("%") > - 1)
				obj.setAttribute("dimensionWidth",obj.width);
			else
				obj.setAttribute("dimensionWidth",cw);
			
			obj.style.height = "1px";
			obj.style.width = "1px";

			objsHidden = true;
		}
	}
}

function showObjs()
{
	if ((objsHidden == false) || (dialogCount > 0))
		return;

	objsHidden = false;
	var objs = document.getElementsByTagName("OBJECT");
	var len = objs.length;
	for(var walkobjs = 0; walkobjs < len; walkobjs ++ )
	{
		var obj = objs[walkobjs];

		// if obj has visibility callback, then notify 
		// the object of visibiliy change
		try { obj.visibilityCallback(true); } catch (e) {}
		
		if(dojo.attr(obj, 'mxhideapplet')=='false'){
			return;
		}
		var back = document.getElementById(obj.id + "_back");
		if(back)
			back.style.display = "none";

		var dimHeight = obj.getAttribute("dimensionHeight");
		if(dimHeight && (dimHeight.indexOf("px")==-1 && dimHeight.indexOf("%")==-1)){
			dimHeight = dimHeight+"px";
		}
		var dimWidth = obj.getAttribute("dimensionWidth");
		if(dimWidth && (dimWidth.indexOf("px")==-1 && dimWidth.indexOf("%")==-1)){
			dimWidth = dimWidth+"px";
		}
		if (dimHeight) {
			obj.style.height = dimHeight;
			obj.height = dimHeight;
		}
		if (dimWidth) {
			obj.style.width = dimWidth;
			obj.width = dimWidth;
		}
	}
}

function addPasswordField(id)
{
	passwordFields[passwordFields.length]=id;
}

function replaceAllItems()
{
	//first set is non-default
	var len = rerenderedItems.length;
	for(var i=0;i<len;i++)
	{
		replaceItem(rerenderedItems[i]);
	}
	rerenderedItems=new Array();

	// this set is defaultrender=true
	var rerenders = HIDDENDOC.getElementsByTagName("DIV");
	len = rerenders.length;
	for(i=0;i<len;i++)
	{
		var it = rerenders[i];
		var needsRef = it.getAttribute("needsrefresh");
		if(needsRef=="true")
			replaceItem(it);
	}
	rerenders=null;

}

function fixPasswordFields()
{
	var len = passwordFields.length;
	for(var i=0;i<len;i++)
	{
		var pwdField = getElement(passwordFields[i]);
		if(pwdField)
		{
			var hasValue = pwdField.getAttribute("hasvalue");
			if(hasValue=="1")
				pwdField.value="XXXXXXXXXX";
		}
	}
	//passwordFields=new Array();
}

function renderItem(id,vis)
{
	this.id=id;
	this.vis=vis;
}

function addRerendered(itemid,vis)
{
	if(undef(vis) || (vis!=true && vis!=false))
		vis=true;
	rerenderedItems[rerenderedItems.length]=new renderItem(itemid,vis);
}

function replaceItem(holderItem)
{
	try
	{
		var newHolder = document.getElementById(holderItem.id);
		var oldHolder = MAINDOC.getElement(holderItem.id);
		var newVis = true;
		var nv = newHolder.getAttribute("vis");
		if(!undef(nv) && nv=="false")
			newVis=false;
		var vis = holderItem.vis;
		if(undef(vis))
			vis=true;
		if(newHolder && oldHolder)
		{
			if(!vis || !newVis || newHolder.style.display=="none")
			{
				oldHolder.style.display="none";
			}
			else
			{
				oldHolder.innerHTML = newHolder.innerHTML;
				oldHolder.style.display="inline";
			}
			// we need to remove these elements from the hiddenframe so JAWS does not pick them up in it's lists
			// This is now done in the hiddenframefooter
			// newHolder.innerHTML="";
			// newHolder.parentNode.removeChild(newHolder);
		}
	}
	catch(error)
	{
	}
}

function setChangingTabs(aBool){
	changingTabs = aBool;
}

function scrollScreen(scrolltop, scrollleft)
{
	if(showingMenu){
		return;
	}
	let mainScroller = dojo.byId('SystemNavAppContent-sc_div')
	if(!mainScroller){
		mainScroller = dojo.byId('SystemNavAppContentg-sc_div')
	}
	if(mainScroller){
		let scroller = mainScroller.querySelector('.custom-scroller');
		if(scroller){
			 if(changingTabs){
				if(scrollleft > 0) {
					scroller.scrollLeft = scrollleft;
				} 
				if(scrolltop > 0) {
					scroller.scrollTop = scrolltop;	
				}
			}
			else{
				scroller.scrollTo(scroller.scrollLeft, scroller.scrollTop);
			}
		}
	}
}

function scrollToMiddle( parentDiv,elementIntoDiv)
{
	parentDiv.scrollTop = getTopPos(elementIntoDiv) - getTopPos(parentDiv) - 16;
}

function getTopPos(el)
{
	var cursortop = 0;
	if (el.offsetParent)
	{
		while (el.offsetParent)
		{
			cursortop += el.offsetTop;
			el = el.offsetParent;
		}
	} else if (el.y)
	{
		cursortop += el.y;
	}
	return cursortop;
}

function updateValue(id,val)
{
	var el = document.getElementById(id);
	if(el)
		el.value=val;
}


function updateDisplay(id,disp)
{
	const el = getElement(id);
	const dialog = el.closest('table[role=dialog]');
	const btnGrp = dialog ? dialog.querySelector('div[data-three-buttons]') : false;
	if(btnGrp){
		const pushBtns = btnGrp.querySelectorAll("button");
		if(pushBtns && pushBtns.length === 3) {
			// Select the first <button> inside the <div> (which is the target for unwrapping)
			const button = pushBtns[0];
			// Check if the button exists
			if (button.hasAttribute('data-hassigoption')) {
				// Get the parent <div> and the parent <td>
				const div = button.parentNode;
				if (div.tagName === 'DIV') {
					const parent = div.parentNode;
					// Move the button out of the <div> into the <td>
				 	parent.insertBefore(button, div);
					// Remove the now-empty <di> since it's no longer needed
  					parent.removeChild(div);
				}
			}
			btnGrp.setAttribute("data-three-buttons", "true");
		}
	}
	hideShowElement(id, disp);
}

function updateClass(id,css)
{
	var el = document.getElementById(id);
	if(el)
		el.className=css;
}

function fixRecordImageSize(id)
{
	var dv = document.getElementById(id);
	if(dv)
	{
		if(dv.offsetHeight>(document.body.offsetHeight-250))
		{
			dv.style.height=document.body.offsetHeight-250 + "px";
			dv.style.width=dv.style.height + "px";
		}
		if(dv.offsetWidth>document.body.offsetWidth)
			dv.style.width=document.body.offsetWidth-50 + "px";
	}
}

function forceFocus(id)
{
	var el = document.getElementById(id);
	if(!el)
		return false;
	focusElement(el);
}

function focusItemNow(id)
{
	try
	{
		if(!stopFocus)
		{
			var el = document.getElementById(id);
			if(!el)
				return false;
			focusElement(el);
			if(!SCREENREADER)
				hideFocus(el);
		}
	}
	catch(error)
	{
		return false;
	}
	return true;
}

function delayedFocus(id,sel,menuDelay)
{
	if(undef(menuDelay))
		menuDelay=300;
	//window.setTimeout("focusOnItem('"+id+"',"+sel+")",menuDelay);
	window.setTimeout(function() {
		focusOnItem(id,sel);
	},menuDelay);
}


function reFocusItem()
{
	var hiddenForm = getHiddenForm();
	if(hiddenForm)
	{
		var inputs = hiddenForm.elements;
		if(inputs)
		{
			var focId = inputs.namedItem("currentfocus").value;
			if(!undef(focId))
				delayedFocus(focId,false,100);
			// focusItemNow(focId);
		}
	}
}

function setCanvasURL(canvasId,url)
{
	var canvas = document.getElementById(canvasId);
	if (canvas!=null)
		canvas.src = url;
	unLockWait();
}


/************************  NEW **************************/

function tabSelect(id)
{
	if(classContains(id+"_middle", "off"))
	{
		sendEvent("select",id,"");
	}
}


function tcClick(event,id)
{
	event = (event) ? event : ((window.event) ? window.event : "");
	var src = getSourceElement(event);
	var thisEl = document.getElementById(id);
	if(dojo.attr(thisEl.parentNode,'filter')=='true'){
		return;
	}
	if(thisEl.parentNode.getAttribute("currentrow") == "true")
	{
		var cName = thisEl.className;
		if(cName.indexOf("nrm")==-1){
			return;  // No click needed on current row
		}
	}
	if((src==thisEl || src.tagName=="INPUT" || src.tagName=="LABEL" || src.tagName=="DIV" || src.hasAttribute("wrapoff") ||
			src.tagName=="TD" || (src.tagName=="IMG" && src.getAttribute("ph")=="1")) && src.getAttribute('ctype') !== 'togglebutton')
	{
		setFocusId(event,src);
		// stopTheRowFocus(event,this);
		var targetId = id;
		if((src.tagName=="DIV" || src.tagName=="SPAN") && !src.hasAttribute("wrapoff"))
		{
			targetId = src.id;
		}
		sendEvent('click',targetId,'','');
		stopBubble(event);
	}

}

function tr_key(event,component)
{
	if(hasKeyCode(event,KEYCODE_ENTER))
	{
		sendEvent('filterrows',component.id,'');
		cancelEvent(event);
	}
}


function hideElement(idOrElement)
{
	hideShowElement(idOrElement,"none");
}

function showElement(idOrElement)
{
	hideShowElement(idOrElement,"");
}

/**
 * Toggles style.display and aria-hidden
 * @param idOrElement - can be called with id or element object
 * @param disp - can be a boolean (true - shows element, false - hides it) or a string of "", "inline", "none", "block", etc
 * @return
 */
function hideShowElement(idOrElement,disp)
{
	var el=getElement(idOrElement);
	if(el)
	{
		if(typeof disp == "boolean")
		{
			if(disp)
			{
				disp="";
			}
			else
			{
				disp="none";
			}
		}
		dojo.style(el, {"display":disp+""});
		dojo.attr(el, {"aria-hidden":(disp=="none" || disp=="NONE")+""});
		
		var inputs = dojo.query("input,textarea", el);
		var ro = (disp=="none")?true:false;
		for(i=0;i<inputs.length;i++) {
			var input = inputs[i];
			dojo.style(input,{"display":disp+""});
		}
		setLastEditableField();
	}
}

function sizeClientArea()
{
	if(!MOBILE)
	{
		var headerScrollDiv = document.getElementById(headerScrollDivId);
		if(!SYSTEMNAVBAR)
		{
			var clientArea = document.getElementById(clientAreaId);
			var header = document.getElementById(headerId);
			var scrollBarWidth = 0;

			var breadcrumbsHeight = 0;
			if (typeof breadcrumbsId != 'undefined') {
				var breadCrumbs = dojo.byId(breadcrumbsId);
				if(breadCrumbs) {
					breadcrumbsHeight = dojo.marginBox(breadCrumbs).h;
				}
			}

			if (clientArea && header)
			{
				headerScrollDiv.style.width = window.innerWidth;
				headerScrollDiv.scrollTop = 0;
				var newHeight = window.innerHeight - dojo.position(clientArea).y - 1 - breadcrumbsHeight;
				if(newHeight<2) {
					newHeight = 2;
				}
				clientArea.style.height = newHeight + "px";
				clientArea.style.width = window.innerWidth - dojo.position(clientArea).x - 1 + "px";
			}
		}
		
		// Get percentage of the frame that the app name takes up. If the toolbar and appname overlap, set the toolbar element position to start where the app name ends with some added cushion
		var tbAppName = document.getElementById("toolbar2-chld_appName");
		var tbChild = document.getElementById("toolbar2-chld");
		if(tbAppName)
		{
			var appNamePrcnt = ((tbAppName.getBoundingClientRect().width / document.getElementById("psuedoForm").getBoundingClientRect().width) * 100) + 5;
			var stringPrcnt = appNamePrcnt.toString() + "%"
			if((tbAppName.getBoundingClientRect().width + tbChild.getBoundingClientRect().width) > document.getElementById("psuedoForm").getBoundingClientRect().width)
			{
				dojo.style(tbChild, {"padding-inline-start":stringPrcnt});

			}
			else
			{
				tbChild.style.removeProperty('padding-inline-start');
			}
		}

		if(headerScrollDiv) {
			headerScrollDiv.style.width = document.documentElement.offsetWidth + "px";
			dojo.style(headerScrollDiv, {"overflowX":"auto", "min-width":"100vw"});
			dojo.attr(document.body, {"scroll":"no","overflow":"hidden"});
			dojo.style(document.body, {"overflow":"hidden"});
			if(dojo.isIE > 0) { //IE does not apply scrollbars correctly
				dojo.style(headerScrollDiv, {"height":""});
				if((headerScrollDiv.offsetHeight - headerScrollDiv.clientHeight) > 14){
					dojo.style(headerScrollDiv, {"height":headerScrollDiv.offsetHeight + 15 + "px"});
					dojo.attr(headerScrollDiv, {"fixed": "true"});
				}
			}
		}
	}
	sizeModalWaits();
	hidePopup();
}

function hideURLbar()
{
	if (dialogCount == 0)
	{
		window.scrollTo(0, 1);
	}
}

function sizeCanvas()
{
	if(dialogCount>0)
	{
		return false;
	}
	var canvas = null;
	if (DESIGNMODE)
	{
		canvas = parent.document.getElementById("canvas_iframe");
	}
	else
	{
		canvas = MAINDOC.getElementById("canvas_iframe");
	}

	if (canvas)
	{
		var clientArea = document.getElementById(canvas.contentWindow.PAGEID);
		if (clientArea)
		{
			clientArea.style.width = parseInt(viewportWidth) + "px";
			clientArea.style.height = parseInt(viewportHeight) + "px";
			if(clientArea)
				canvas.style.width = clientArea.scrollWidth + "px";
			if(clientArea)
				canvas.style.height = clientArea.scrollHeight + "px";
		}
	}
}

function sizeCanvasForDialog(width, height)
{
	var canvas = parent.document.getElementById("canvas_iframe");

	if (canvas)
	{
		var clientArea = document.getElementById(canvas.contentWindow.PAGEID);
		if (clientArea)
		{
			clientArea.style.width = parseInt(viewportWidth) + "px";
			clientArea.style.height = parseInt(viewportHeight) + "px";



			if(clientArea)
				canvas.style.width = clientArea.scrollWidth + 2 + "px";
			if(clientArea)
				canvas.style.height = clientArea.scrollHeight + 1 + "px";

			if(width>parseInt(canvas.style.width))
			{
				canvas.style.width = width + "px";
			}

			if(height>parseInt(canvas.style.height))
			{
				canvas.style.height = height + "px";
			}

		}
	}
}

var canvasId = "";

function setCanvasId(cid)
{
	canvasId = cid;
	// alert("canvasId="+canvasId);
}

function getCanvasId()
{
	return canvasId;
}


/*
BEGIN SPECIFIC COMPONENT HANDLERS
used to reduce bandwidth by reducing inline script attachment
 */

/* toggle button handler */
function togglebutton_(eventOrComponent){
	eventOrComponent = (eventOrComponent) ? eventOrComponent : ((window.event) ? window.event : "");
  var eventType = eventOrComponent.type;
  if(undef(eventType)) 
  {
	  if(eventOrComponent.getAttribute("mxejse") == "cbupld") 
	  {
		  cbupld(eventOrComponent,"init", null, null, false);
	  }
	  return;
  }
  var ro = this.getAttribute("aria-readonly")=="true";
  switch(eventOrComponent.type)
	{
	  case "click":
      if(!ro){
        setCurrentfocusId(eventOrComponent, this);
        sendEvent('toggle',this.id,'');
      }
      break;
    case "focus":
      setCurrentfocusId(eventOrComponent, this);
      break;
    case "keydown":
      if(!ro && hasKeyCode(eventOrComponent,'KEYCODE_SPACEBAR|KEYCODE_ENTER'))
      {
        setCurrentfocusId(eventOrComponent, this);
        this.setAttribute('aria-checked', this.getAttribute('aria-checked')!=='true'+'');
        sendEvent('toggle',this.id,'');
        cancelEvent(eventOrComponent);
      }
	  showFieldHelp(eventOrComponent,this);
    break;
  }
}

function bg_(component)
{
  let defaultButton = component.querySelector('button.default');
  if(!defaultButton){
    defaultButton = component.querySelector('button[dub="1"]');
  }
  if(defaultButton){
    defaultButton.parentElement.appendChild(defaultButton);// move to end
  }
}

/* checkbox handler */
function cb_(eventOrComponent)
{
	eventOrComponent = (eventOrComponent) ? eventOrComponent : ((window.event) ? window.event : "");
	var eventType = eventOrComponent.type;
	var ttIcon;
    if(undef(eventType)) 
    {
        if(eventOrComponent.getAttribute("mxejse") == "cbupld") 
        {
            cbupld(eventOrComponent,"init", null, null, false);
        }
        return;
	}
	if(DESIGNMODE)
		return;
	var imgId=this.getAttribute("imgid");
	var imgEl=getElement(imgId);
	var ro = (imgEl.getAttribute("aria-readonly")=="true" || imgEl.getAttribute("readonly")=="true");
	switch(eventOrComponent.type)
	{
	case "blur":
		input_onblur(eventOrComponent,this);
		hightlightCheckbox(eventOrComponent, eventOrComponent.type);
		break;
	case "click":
		if(!ro)
			sendEvent('toggle',this.id,'');
		break;
	case "focus":
		input_onfocus(eventOrComponent,this);
		hightlightCheckbox(eventOrComponent, eventOrComponent.type);
		break;
	case "keydown":
		if(!ro && hasKeyCode(eventOrComponent,'KEYCODE_SPACEBAR|KEYCODE_ENTER'))
		{
			sendEvent('toggle',this.id,'');
			cancelEvent(eventOrComponent);
		}
		showFieldHelp(eventOrComponent,this);
		break;
	case "mousedown":
		input_mousedown(eventOrComponent,this);
		break;
	case "mouseover":
		input_mousedown(eventOrComponent,this);
	case "mouseout":
		hightlightCheckbox(eventOrComponent,eventOrComponent.type);
		return noStatus();
	}
}

function hightlightCheckbox(eventOrComponent, type) {
	var component = (eventOrComponent.type)?getSourceElement(eventOrComponent):eventOrComponent;
	var imgId = dojo.attr(component,"imgid");
	while(!imgId) {
		component = component.parentNode;
		imgId = dojo.attr(component,"imgid");
	}
	var imgEl = dojo.byId(imgId);
	if(imgEl &&  dojo.attr(imgEl,"readonly")!="true")
	{
 		if(type=="mouseout" || type=="blur") {
			if(document.activeElement == component) {
				return;
			}
			dojo.attr(component,{"clicked":"false"});
		}
		var imageType = dojo.attr(imgEl,"imgtype");
		if(!undef(imageType))
		{
			var imageName = dojo.attr(imgEl,"imgname");
			var checked = dojo.attr(imgEl,"checked");
			var over=".";
			if(type=="mouseover" || type=="focus") {
				over="_over.";
			}
			imgEl.src=IMAGE_PATH+imageName+checked+over+imageType;
		}
	}
}

/* tooltip image handler */
function tti_(eventOrComponent)
{
    eventOrComponent = (eventOrComponent) ? eventOrComponent : ((window.event) ? window.event : "");
    var eventType = eventOrComponent.type;
    var ttIcon;
    if(undef(eventType)) {
        eventType = "init";
        ttIcon = eventOrComponent;
    }
    else {
        ttIcon = getSourceElement(eventOrComponent);
    }
	var relatedComponent = dojo.byId(dojo.attr(ttIcon, "compid"));
	if(!relatedComponent){
		relatedComponent = ttIcon.parentElement;
	}
    switch(eventType)
    {
    case "init":
        if(!relatedComponent){
            relatedComponent = ttIcon.parentNode;
        }
        var vPos;
        var pos = "left";
        var hPos = relatedComponent.clientWidth;
        var rtl = (document.body.dir == "rtl");
        dojo.attr(relatedComponent, {"title":""});
        if(SKIN.indexOf("iot18")==-1){
            appendClass(ttIcon, "noMargin");
        }
        dojo.connect(relatedComponent, "mouseenter", relatedComponent, function() {
            if(dojo.attr(this,"ttTimer_icon")){
                return;
            }
            window.clearTimeout(dojo.attr(this,"ttCloseTimer"));
            if(relatedComponent.id == currentPopoverField) {
                return;
            }
            dojo.removeAttr(this, "ttopen");
            var comp = this;
            var ttTimer = window.setTimeout(function(){
                createExtendedTooltip(comp.id);
                dojo.attr(comp, {"ttopen":"true"});
            },tpaeConfig.extendedTooltipShowDelay);
            
            dojo.attr(this, {"ttTimer_comp":ttTimer});
        });
        dojo.connect(ttIcon, "mouseenter", relatedComponent, function() {
            if(dojo.attr(this,"ttTimer_comp")){
                return;
            }
            window.clearTimeout(dojo.attr(this,"ttCloseTimer"));
            if(this.id == currentPopoverField) {
                return;
            }
            dojo.removeAttr(this, "ttopen");
            var comp = this;
            var ttTimer = window.setTimeout(function(){
                createExtendedTooltip(comp.id);
                dojo.attr(comp, {"ttopen":"true"});
            },tpaeConfig.extendedTooltipShowDelay);
            
            dojo.attr(this, {"ttTimer_icon":ttTimer});
        });
        dojo.connect(relatedComponent, "mousedown", relatedComponent, function() {
            window.clearTimeout(dojo.attr(this,"ttCloseTimer"));
            window.clearTimeout(dojo.attr(this,"ttTimer_comp"));
            window.clearTimeout(dojo.attr(this,"ttTimer_icon"));
            dojo.removeAttr(this, "ttTimer_comp");
            dojo.removeAttr(this, "ttTimer_icon");
            var tooltipIcon = dojo.byId(relatedComponent.id+ "_tt");
            if(tooltipIcon) {
                hideShowElement(tooltipIcon,false);
            }
            stopPopWait();
            stopPopOver();
        });
        if(DEBUGLEVEL<=1) {
            dojo.connect(relatedComponent, "mouseleave", relatedComponent, function(event) {
                if(dojo.attr(this,"ttTimer_icon")){
                    return;
                }
                if(LEAVETOOLTIPOPEN && dojo.attr(this,"ttopen")){
                    return;
                }
                if(event.relatedTarget && event.relatedTarget.id == "wait") {
                    return;
                }
                var tooltipIcon = dojo.byId(relatedComponent.id+ "_tt");
                if(tooltipIcon) {
                    hideShowElement(tooltipIcon,true);    
                }
                window.clearTimeout(dojo.attr(this,"ttTimer_comp"));
                window.clearTimeout(dojo.attr(this,"ttTimer_icon"));
                dojo.removeAttr(this, "ttTimer_comp");
                dojo.removeAttr(this, "ttTimer_icon");
                var ttCloseTimer = window.setTimeout("stopPopOver()",tpaeConfig.extendedTooltipHideDelay);
                dojo.attr(this, {"ttCloseTimer":ttCloseTimer});
            });
            dojo.connect(ttIcon, "mouseleave", relatedComponent, function(event) {
                if(dojo.attr(this,"ttTimer_comp")){
                    return;
                }
                if(LEAVETOOLTIPOPEN && dojo.attr(this,"ttopen")){
                    return;
                }
                if(event.relatedTarget && event.relatedTarget.id == "wait") {
                    return;
                }
                var tooltipIcon = dojo.byId(relatedComponent.id+ "_tt");
                if(tooltipIcon) {
                    hideShowElement(tooltipIcon,true);    
                }
                window.clearTimeout(dojo.attr(this,"ttTimer_comp"));
                window.clearTimeout(dojo.attr(this,"ttTimer_icon"));
                dojo.removeAttr(this, "ttTimer_comp");
                dojo.removeAttr(this, "ttTimer_icon");
                var ttCloseTimer = window.setTimeout("stopPopOver()",tpaeConfig.extendedTooltipHideDelay);
                dojo.attr(this, {"ttCloseTimer":ttCloseTimer});
            });
        }
        var cName = ttIcon.className;
        ttIcon.className = cName + " tt_"+relatedComponent.tagName.toLowerCase();
        switch(relatedComponent.tagName){
            case "INPUT":
                var vPos = -10;
                if(dojo.isIE > 0) {
                    vPos = -4;
                }
                //could not use dojo.style to set the right pos so we use the
                ttIcon.style.top = vPos + "px";
                break;
            case "TEXTAREA":
                var vPos = -30;
                if(dojo.isIE > 0) {
                    vPos = -4;
                }
                //could not use dojo.style to set the right pos so we use the
                ttIcon.style.top = vPos + "px";
                break;
            case "SPAN":
            case "LABEL":
                ttIcon.style.top = "-5px";
                hPos = relatedComponent.offsetWidth;
                if(rtl) {
                    ttIcon.style.right = (hPos+5)+"px";
                }
                else {
                    ttIcon.style.left = (hPos+5)+"px";
                }
                relatedComponent.style.width=relatedComponent.clientWidth + ttIcon.offsetWidth;
                break;
            default:
                ttIcon.style.top = "-5px";
                break;
        }
        if(dojo.isWebKit && rtl) { //Strange problem where element shows under the textbox (rtl on webkit only)
            dojo.style(ttIcon,{"position":"relative","top":"0px"});
        }
        break;
    case "blur":
        if(SCREENREADER || MOBILE) {
            input_onblur(eventOrComponent,ttIcon);
        }
        break;
    case "focus":
        if(SCREENREADER || MOBILE) {
            setFocusId(eventOrComponent,ttIcon);
        }
        break;
    case "click":
        setFocusId(eventOrComponent,ttIcon);
        createExtendedTooltip(relatedComponent.id);
        stopBubble(eventOrComponent);
        break;
    case "keydown":
        if(SCREENREADER || MOBILE) {
            setFocusId(eventOrComponent,ttIcon);
            if(eventOrComponent.keyCode==KEYCODE_ESC){
                stopPopWait();
                stopPopOver();
            }
            else if(eventOrComponent.type=="click" || hasKeyCode(eventOrComponent,'KEYCODE_SPACEBAR|KEYCODE_ENTER')) {
                createExtendedTooltip(relatedComponent.id);
                stopBubble(eventOrComponent);
            }
        }
        break;
    case "mouseover":
        break;
    case "mouseout":
        if(SKIN.indexOf("iot18")==-1){
            dojo.attr(ttIcon, {"src":IMAGE_PATH+"btn10_moreInfo.png"});
        }
        if(!SCREENREADER && !MOBILE) {
            dojo.style(ttIcon, {"cursor":"default"});
            window.clearTimeout(dojo.attr(ttIcon,"ttTimer"));
            dojo.removeAttr(ttIcon, "ttTimer");
        }
        break;
    }
}

function gridCell_(event){
	event = (event) ? event : ((window.event) ? window.event : "");
	var eventValue=this.getAttribute("ev");
	if(this.className.indexOf("tsrs")!=-1){
		return;
	}
	switch(event.type)
	{
		case "click":
			tcClick(event,this.id);
			break;
		case "mouseover":
			appendClass(this.parentNode,'trh');
			break;
		case "mouseout":
			removeClass(this.parentNode,'trh');
			break;
	}
}

function mockRow_(event){
	event = (event) ? event : ((window.event) ? window.event : "");
	var eventValue=this.getAttribute("ev");
	switch(event.type)
	{
		case "click":
			cancelEvent(event);
			setCurrentfocusFromId(event,this.id);
			sendEvent('click',this.id,'setcurrent');
			break;
		case "mouseover":
			if(this.parentNode.getAttribute('currentrow')!='true'){
				appendClass(this.parentNode,dojo.attr(this, "hoverclass"));
			}
			break;
		case "mouseout":
			removeClass(this.parentNode,dojo.attr(this, "hoverclass"));
			break;
	}
	
}

function sizeTabGroup(tgid){
	var leftNavWidth = 0;
  var navContainerWidth = 0;
  try {
	navContainerWidth = document.getElementsByClassName("navContainer")[0].clientWidth;
	leftNavWidth = document.getElementsByClassName("Left-Navigation-Menu")[0].clientWidth;
  }
  catch(error){
    //do nothing;
  }
  	// Since MAS env uses the common nav bar from MAS Common UI while the manage still uses the old nav,
	// the width of left nav bar was manually added if leftNavWidth is 0 to resolve MAXUIF-2905.
	leftNavWidth = (leftNavWidth === 0) ? 48 : leftNavWidth;
	var windowWidth = window.innerWidth - (leftNavWidth + navContainerWidth + 70);
	var container = dojo.byId(tgid).getElementsByClassName('tabContainer')[0];
	let tabMenu = dojo.byId(tgid).getElementsByClassName('tabMenuDiv')[0];

  if(container){
	  var isScrolled = container.scrollWidth >= windowWidth;
	  if(isScrolled){
  		container.style.width=windowWidth+"px";
		container.getElementsByClassName('tabScroll_right')[0].style.display='block';
		tabMenu.style.display = 'block';
	  }
	  else {
  		container.style.width="";
		var arrows = container.getElementsByClassName('tabScroller');
		Array.from(arrows).forEach((arrow)=> {
		arrow.style.display='none';
		tabMenu.style.display = 'none';
		})
	  }
  }
}

function scrollToCurrentTab(tgid){
	window.setTimeout(() => {
		var tabgroup = dojo.byId(tgid).getElementsByClassName('tabgroup')[0];
		var tgRect = tabgroup.getBoundingClientRect();
		var selectedTab = tabgroup.getElementsByClassName('tablabelon')[0];
        if(selectedTab){
            selectedTab = selectedTab.parentElement;
		    var stRect = selectedTab.getBoundingClientRect();
		    tabgroup.scrollLeft = (stRect.left - tgRect.left)-50; //adjust by 50 to accomodate the scroll arrow
		    setTabArrowDisplay(tabgroup);
		    // Add padding to body section below when tabgrup is showing because tab bar is now position=fixed
		    if(tabgroup.closest('.tabgroupback') && !tabgroup.closest('.dsc1')){
    			var tabgroupbackTR = tabgroup.closest('.tabgroupback').parentElement;
                if(!DESIGNMODE){
					if(tabgroupbackTR.nextElementSibling) {
                        if(SCREENREADER){
                            tabgroupbackTR.nextElementSibling.firstElementChild.style.paddingTop='4rem';
                        }
                        else {
                            tabgroupbackTR.nextElementSibling.firstElementChild.style.paddingTop='3rem';
                        }
					}
                }
		    }
        }
	}, 200);
}

function buildTabMenu(e){
	setTimeout(()=>{
		menus._destroyMenus();
		menus.holder = document.getElementById("menuholdertd");

		var shell = e.target.closest('.tabgroupShell');
		var ul = shell.getElementsByClassName('tabgroup')[0];
		var liItems = ul.getElementsByTagName('LI');
		var mcId = e.target.id+"_MC";
		var menu = {};
		menu.id = mcId;
		var items = new Array();
		Array.from(liItems).forEach(li => {
			var obj = {};
			obj.id = li.id+'_mi';
			obj.targetId = li.id;
			var a = li.getElementsByTagName('a')[0];
			obj.text = a.text;
			obj.image = '';
			obj.clickId = a.id;
			obj.sub = '';
			items.push(obj);
		})
		menu.items = items;
		menus.buildMenu(e.target,menu);

		showingMenu = true;
		stopFocus = true;
		setClickElementId(e.target.id);
		menus._showMenu(mcId,true);
	}, 100);
}

function isLastTabVisible(tg){
	var tabgroupRightEdge = tg.offsetLeft+tg.offsetWidth+tg.scrollLeft;
	var tabs = tg.getElementsByTagName('LI');
	var lastTab = tabs[tabs.length-1];
	var lastTabRightEdge = lastTab.offsetLeft+lastTab.offsetWidth;
	return tabgroupRightEdge >= lastTabRightEdge;
}

function setTabArrowDisplay(tg){
	
	var container = tg.closest('div.tabContainer')
	var start = container.querySelector('.tabScroll_left');
	var end = container.querySelector('.tabScroll_right');
	var myScrollLeft = tg.scrollLeft;
	if(document.body.dir == "rtl"){
		// swap the above button locaters
		end = container.querySelector('.tabScroll_left');
		start = container.querySelector('.tabScroll_right');	
		// it is 1 instead of 0 in rtl mode so adjust for future math
		myScrollLeft = Math.abs(tg.scrollLeft - 1);
	}
	if (tg.clientWidth < tg.scrollWidth) {
		if(myScrollLeft == 0){
			dojo.style(start, {"display": "none"});
			dojo.style(end, {"display": "block"});
		}
		else {
				if(tg.clientWidth+myScrollLeft >= tg.scrollWidth || isLastTabVisible(tg)) {
					dojo.style(start, {"display": "block"});
					dojo.style(end, {"display": "none"});
				}
				else {
				dojo.style(start, {"display": "block"});
				dojo.style(end, {"display": "block"});
			}
		}
	}
	else{ //no need for either scrollbar
		dojo.style(start, {"display": "none"});
		dojo.style(end, {"display": "none"});
	}
}

function tabScrollLeft(e){
	var left = e.target.parentElement;
	var container = left.closest('.tabContainer');
	var tabGroup = container.getElementsByClassName('tabgroup')[0];
	var currPos = tabGroup.scrollLeft;
	var goToPos = currPos - (container.clientWidth-100);
	tabGroup.scroll({left: goToPos,behavior: 'smooth'});
	window.setTimeout(()=>{setTabArrowDisplay(tabGroup)},600);
}

function tabScrollRight(e){
	var right = e.target.parentElement;
	var container = right.closest('.tabContainer');
	var tabGroup = container.getElementsByClassName('tabgroup')[0];
	var currPos = tabGroup.scrollLeft;
	var goToPos = (currPos + container.clientWidth-100);
	tabGroup.scroll({left: goToPos,behavior: 'smooth'});
	window.setTimeout(()=>{setTabArrowDisplay(tabGroup)},600);
}

function resizeTabs() {
	document.querySelectorAll('table.tabg').forEach((tg) => {
		this.sizeTabGroup(tg.id);
	});
}

/* image handler */
function im_(event)
{
	event = (event) ? event : ((window.event) ? window.event : "");
	var eventValue=this.getAttribute("ev");
	var active=!(this.getAttribute("active")=="0");
	switch(event.type)
	{
	case "blur":
		input_onblur(event,this);
		break;
	case "click":
		if(active && !SCREENREADER)
		{
			toggleMinimize(this.id);
			var lc=this.getAttribute("lc");
			if(lc!="")
				setCurrentfocusFromId(event,lc);
			setClickPosition(this,event);
			var menuType = this.getAttribute("menutype");
			if(undef(menuType))
				sendEvent('click',this.id,eventValue);
			else
				sendEvent('showmenu',this.id,menuType);
		}
		break;
	case "focus":
		setCurrentfocusId(event,this);
		break;
	case "keydown":
		if(active && !SCREENREADER && hasKeyCode(event,'KEYCODE_SPACEBAR|KEYCODE_ENTER'))
		{
			setClickPosition(this,event);
			sendEvent('click',this.id,eventValue);
			cancelEvent(event);
		}
		break;
	case "mousedown":
		input_mousedown(event,this);
		break;
	case "mouseover":
		var imageType=this.getAttribute("imgtype");
		if(active)
		{
			if(!undef(imageType) && !this.className.includes('dButton')){
				var src=this.getAttribute("source");
				this.src=IMAGE_PATH+src+"_over"+imageType;
			}
			if(!this.hasAttribute('no-bg-hover')){
				dojo.style(this, {"background-image": "url(detail_bkg.gif)"});
			}
		}
		break;
	case "mouseout":
		imageType=this.getAttribute("imgtype");
		if(active)
		{
			if(!undef(imageType)){
				src=this.getAttribute("source");
				this.src=IMAGE_PATH+src+imageType;
			}
			if(!this.hasAttribute('no-bg-hover')){
				dojo.style(this, {"background-image": ""});
			}
		}
		break;
	}
}

function relocateTableButtons(tableId,isRenderStr,renderOnlyPlusIcon){
	
	var tableOuter = dojo.byId(tableId+"-to");
	var headerBar = dojo.byId(tableId+"-hb");
	if(!headerBar){
		return;
	}
	var hbSegments = headerBar.querySelectorAll('.hb'); //headerBar segments

	var buttonGroups = tableOuter.querySelectorAll('.tablebuttongroup');
	var buttonGroup = null;
	//search all button groups to find correct one for this table (because there is nesting)
	buttonGroups.forEach(bg => {
		if(bg.id.startsWith(tableId)){
			buttonGroup = bg;
		}
	})
	if(buttonGroup == null){
		//because there are no buttons to relocate found in THIS table 
		//sometimes buttons get found in a table inside this table so need the OR section
		return;
	}
	var buttonWithSigOption = buttonGroup.querySelectorAll("[data-hassigoption]")[0];
	var isRender = isRenderStr=="true";
	if(!isRender || 
		(buttonWithSigOption !== undefined && !buttonWithSigOption) ){
		if(tpaeConfig.tableButtonPlacement=="1"){
			buttonGroup.parentElement.style.display="none";
		}
	}

	var addButtonId = undefined;
	var addButton = buttonGroup.querySelectorAll("[data-addrow]")[0];
	if(addButton){
		addButtonId = addButton.id;
	}

	var buttonsList = buttonGroup.querySelectorAll('button');
	var tempButtons = Array.from(buttonsList);

	var buttons = [];
	tempButtons.forEach(button => {
		if(button.id == addButtonId || (button.style.display && button.style.display =="none")){
            //do nothing, these should not be included in the processing
		}
		else{
			buttons.push(button);
		}
	})
	var buttonsCount = buttons.length;
	
	if(buttons && isRender){
		if(addButtonId){
			var firstExistingButton = headerBar.querySelectorAll("a[ctype=toggleimage]")[2];
			var addButtonAnchor = document.createElement("a"); 
			let el = getElement(addButtonId);
			addButtonAnchor.id = addButtonId+"_addrow_a";
			addButtonAnchor.setAttribute("role","button");
			addButtonAnchor.classList.add("addNewRowbtn");
			if(el && canClick(el) === false) {
				// Disable the + icon, if the application only has read access
				addButtonAnchor.setAttribute("tabindex","-1");
				addButtonAnchor.setAttribute("aria-disabled","true");
				addButtonAnchor.style.cssText = "opacity: 0.3; filter: alpha(opacity=30); cursor: not-allowed";
			} else {
				addButtonAnchor.setAttribute("tabindex","0");
				addButtonAnchor.onclick = function() { sendEvent("click",addButtonId,""); };
				addButtonAnchor.setAttribute("href","javascript:setClickElementId('"+addButtonId+"')");
			}
			addButtonAnchor.setAttribute("title",NEWROW);
			var addButton = document.createElement("img");
			addButton.style.display = "initial";
			addButton.id = tableId+"_addrow";
			addButton.src = "nav_icon_insertkey.gif";
			var row = headerBar.getElementsByTagName('tr')[0];
			var firstExistingButtonTD = firstExistingButton.parentElement;
			var firstButtonIdx = 0;
			for(var i=0;i<hbSegments.length;i++)
			{
				var segment = hbSegments[i];
				if(segment.id == firstExistingButtonTD.id){
					firstButtonIdx = i+1;
				}
			}
			var col = row.insertCell(firstButtonIdx);
			col.id = tableId+"-hb_addrow";
			col.classList.add("hb", "thb", "hbsh");
			col.valign = "middle";
			col.role = "presentation";
			col.style.padding = "0px";
			col.style.whiteSpace = "nowrap";
			col.width="100%"
			addButtonAnchor.appendChild(addButton);
			col.appendChild(addButtonAnchor);
			hbSegments = headerBar.querySelectorAll('.hb');	//recalculate the segments after adding new row button
		}
	}
	var rtl = document.body.dir == "rtl";
	if(!isRender){
		//delete all buttons in header bar to start new for refresh
		var hbButtons = headerBar.querySelectorAll('button');
		hbButtons.forEach(hbBtn => {
			hbBtn.parentElement.remove();
		})
	}
	if(buttonsCount > 1 && renderOnlyPlusIcon === "true") {
		//multiple action buttons
		var actionsButton = document.createElement("BUTTON");
		var actionText = ACTIONS;
		actionsButton.style.display = "initial";
		actionsButton.id = tableId+"_actions";
		actionsButton.onclick = function(evt) { evt.stopPropagation(); buildTableButtonMenu(this, buttons); }; 
		actionsButton.onkeypress = function() {if(event.key === 'Enter'){event.target.click();}};
		actionsButton.classList.add("text", "pb", "default");
		var actionsIcon = document.createElement("IMG");
		actionsIcon.src = "btn_action-chevron.svg";
		actionsIcon.style.padding = "0px 8px";
		actionsButton.innerHTML = actionText+actionsIcon.outerHTML;
		var row = headerBar.getElementsByTagName('tr')[0];
		var col = row.insertCell(hbSegments.length+1);
		if(rtl){
			actionsButton.style.paddingLeft = "1rem"
			col.style.paddingLeft = "0.5rem"
		}
		else{
			actionsButton.style.paddingRight = "1rem"
			col.style.paddingRight = "0.5rem"
		}
		col.appendChild(actionsButton);
	}
	else if(buttonsCount == 1 && renderOnlyPlusIcon === "true"){
		//one action button
		var newButton = buttons[0].cloneNode();
		newButton.setAttribute("data-clonedId",buttons[0].id);
		var newButtonTD = buttons[0].parentElement.cloneNode();
		if(rtl){
			newButtonTD.style.paddingLeft = "0.5rem"
		}
		else{
			newButtonTD.style.paddingRight = "0.5rem"
		}
		newButton.textContent = buttons[0].textContent;
		//if button contained image, copy it too
		var buttonImg = buttons[0].firstElementChild;
		if(buttonImg){
			var newButtonImg = buttonImg.cloneNode();
			newButton.appendChild(newButtonImg);
		}
		newButton.classList.add('default');
		bindElementEvents(newButton,'button',true);
		if(tpaeConfig.tableButtonPlacement=="2") {
			// Copying buttons but displaying both so modify id of new one
			newButton.id += "_action";
		}

		var lastSegment = hbSegments[hbSegments.length - 1];
		newButtonTD.appendChild(newButton);
		lastSegment.insertAdjacentElement('afterend', newButtonTD);
	}

	// Finally, if tableButtonPlacement is 1, hide original button group
	if(tpaeConfig.tableButtonPlacement=="1"){
		buttonGroup.parentElement.style.display="none";
	}
}

function enableDisablePlusIcon(tableId) {
	var tableOuter = dojo.byId(tableId+"-to");
	var buttonGroups = tableOuter.querySelectorAll('.tablebuttongroup');
	var buttonGroup = null;

	//search all button groups to find correct one for this table (because there is nesting)
	buttonGroups.forEach(bg => {
		if(bg.id.startsWith(tableId)){
			buttonGroup = bg;
		}
	})

	var addButtonId = undefined;
	var addButton = buttonGroup.querySelectorAll("[data-addrow]")[0];

	if(addButton){
		addButtonId = addButton.id;
	}

	let el = getElement(addButtonId);
	var addButtonAnchor = document.getElementById(addButtonId+"_addrow_a");

	if(el && canClick(el) === false) {
		// Disable the + icon, if the application only has read access
		addButtonAnchor.setAttribute("tabindex","-1");
		addButtonAnchor.setAttribute("aria-disabled","true");
		addButtonAnchor.style.cssText = "opacity: 0.3; filter: alpha(opacity=30); cursor: not-allowed";
	} else {
		addButtonAnchor.setAttribute("tabindex","0");
		addButtonAnchor.setAttribute("aria-disabled","false");
		addButtonAnchor.onclick = function() { sendEvent("click",addButtonId,""); };
		addButtonAnchor.setAttribute("href","javascript:setClickElementId('"+addButtonId+"')");
		addButtonAnchor.style.cssText = "opacity: 1; filter: alpha(opacity=100); cursor: pointer";
	}
}

function buildTableButtonMenu(e, buttons){
	menus._destroyMenus();
	menus.holder = document.getElementById("menuholdertd");
	var mcId = e.id+"_MC";
	var menu = {};
	menu.id = mcId;

	var items = new Array();
	Array.from(buttons).forEach(button => {
		if(button.getAttribute("data-addrow")!='true'){
			var obj = {};
			obj.id = button.id+'_mi';
			obj.targetId = button.id;
			obj.text = button.textContent;
			obj.image = button.querySelector('img') == null ? '' : "menu_sub.svg";
			obj.mxevent = "click";
			obj.sub = '';
			obj.className = 'mi_ti'; //menu item with trailing icon
			items.push(obj);
		}
	})
	menu.items = items;
	menus.buildMenu(e,menu);

	showingMenu = true;
	stopFocus = true;
	setClickElementId(e.id);
	menus._showMenu(mcId,true);
}

/* label handler */
function label_(event)
{
	event = (event) ? event : ((window.event) ? window.event : "");
	if(event.target && event.target.classList && event.target.classList.contains("anchor") &&
		event.target.parentElement && event.target.parentElement.getAttribute("tablecell") === "1"){
			//don't stop bubble
	}
	else {
		stopBubble(event);
	}
	var nc=this.getAttribute("noclick");
	switch(event.type)
	{
    case 'click':
		let elClasses = this.getAttribute("class");
		// If the table is empty, the 'nrm' class is added to the label element through TableEmptyRow.java
		if(!SCREENREADER && this.hasAttribute('for') && !elClasses.includes('nrm')){
			event.stopPropagation();
			let elementId = this.getAttribute("for");
			let focusElement = dojo.byId(elementId);
			sendEvent("internalhelp",elementId,"");
		} else {
			let parentEl = event.target.parentNode.id;
			// clicking on the parent element to referesh the table
			(parentEl) ? tcClick(event, parentEl) : '';
		}
      break;
	case "focus":
		setCurrentfocusId(event,this);
		break;
	case "mousedown":
		input_mousedown(event,this);
		break;
	case "mouseout":
		var ul=this.getAttribute("ul");
		if(nc!="1" && ul!="1")
			this.style.textDecoration="";
		break;
	case "mouseover":
		var ul2=this.getAttribute("ul");
		if(nc!="1" && ul2!="1")
			this.style.textDecoration="underline";
		break;
	case "keydown":
		if(!hasKeyCode(event,'KEYCODE_ENTER|KEYCODE_SPACEBAR'))
		{
			break;
		}
		case "mouseup":
			//cannot click on labels in FF so we use mouseup
			if (this.getAttribute("clicked")){
				if(nc!="1")
				{
					var eventValue=this.getAttribute("ev");
					var mxevent=this.getAttribute("mxevent");
					if(!undef(mxevent))
					{
						cancelEvent(event);
						var targetid=this.getAttribute("targetid");
						setClickPosition(this,event);
						sendEvent(mxevent,targetid,eventValue);
		
					}
				}
			}
		break;
	}
}

/* sortlabel handler */
function sortlabel_(event)
{
	event = (event) ? event : ((window.event) ? window.event : "");
	stopBubble(event);
	var nc=this.getAttribute("noclick");
	switch(event.type)
	{
	case "keypress":
		if(!hasKeyCode(event,'KEYCODE_ENTER'))
		{
			break;
		}
	case "mouseup":
		//cannot click on labels in FF so we use mouseup
		if(nc!="1")
		{
			var eventValue=this.getAttribute("ev");
			var mxevent=this.getAttribute("mxevent");
			if(!undef(mxevent))
			{
				cancelEvent(event);
				setCurrentfocusId(event, null);
				var targetid=this.getAttribute("targetid");
				setClickPosition(this,event);
				if(!event.ctrlKey) 
				{
					addCommInput("multi", "true");
				}
				sendEvent(mxevent, targetid, eventValue);
			}
		}
		break;
	}
};

/* pushbutton handler */
function pb_(event)
{
	event = (event) ? event : ((window.event) ? window.event : "");
	if(this.disabled || DESIGNMODE)
		return;
	switch(event.type)
	{
	case "keypress":
		if(event.keyCode != KEYCODE_ENTER){
			break;
		}
		stopBubble(event);
	case "click":
		setClickPosition(this,event);
		if(this.getAttribute("dub")=="1")
			doclinkuploadbutton(event,this);
		else {
			var targetId = this.id;
			if(event.target.getAttribute('data-clonedid')){
				targetId = event.target.getAttribute('data-clonedid');
			}
			sendEvent('click',targetId,'');
		}
		break;
	case "focus":
		setCurrentfocusId(event,this);
		break;
	case "mousedown":
		input_mousedown(event,this);
		break;
	case "mouseout":
		removeClass(this,'pbo');
		this.setAttribute("clicked","false");
		break;
	case "mouseover":
		appendClass(this,'pbo');
		break;
	}
}

/* radiobutton handler */
function rb_(event)
{
	event = (event) ? event : ((window.event) ? window.event : "");
	if(DESIGNMODE)
		return;
	var disabled = this.disabled || dojo.attr(this, 'aria-disabled')=='true'
	switch(event.type)
	{
	case "click":
		if(!disabled)
		{
			setClickPosition(this,event);
			sendEvent('click',this.id,'');
		}
		break;
	case "mousedown":
		input_mousedown(event,this);
		break;
	case "focus":
		setCurrentfocusId(event, this);
		break;
	case "keydown":
		if(!disabled){
			var rbsId=this.getAttribute("rbsId");
			radiobutton_onkeypress(event,this,rbsId);
		}
		break;
	case "keypress":
		if(!disabled && hasKeyCode(event, 'KEYCODE_ENTER'))
			sendEvent('click',this.id,'');
		break;
	}
}

/* select handler */
function sel_(event)
{
	event = (event) ? event : ((window.event) ? window.event : "");
	if(DESIGNMODE)
		return;
	var ro = this.readOnly;
	var exc=(this.getAttribute("exc")=="1");

//	alert("event type = " + event.type);
	switch(event.type)
	{
	case "mouseup":
		if (isIE() && !hasFocus(this))
		{
			this.focus();
		}
		if (isBidiEnabled)
		{
			adjustCaret(event, this);
		}
		break;
	case "blur":
		if (this.getAttribute("PopupType"))
		{
			// Need to handle the case when the focus is moved to the popup widget, such as the calendar.
			dojohelper.picker_onblur(event, this);
		}
		else
		{
			input_onblur(event,this);
			if (isBidiEnabled)
				input_bidi_onblur(event, this);
		}
		break;
	case "change":
		if(!ro)
		{
			input_changed(event,this);
			var hiddenForm = getHiddenForm();
			var inputs = hiddenForm.elements;
			sendEvent("setvalue", inputs.namedItem("changedcomponentid").value, inputs.namedItem("changedcomponentvalue").value);
		}			
		break;
	case "click":
		var liclick=this.getAttribute("liclick");
		var li=this.getAttribute("li");
		if(li!="" && liclick=="1")
			frontEndEvent(getElement(li),'click');
		break;
	case "focus":
		input_onfocus(event,this);
		if (isBidiEnabled)
			input_bidi_onfocus(event, this);
		this.setAttribute("prekeyvalue",this.value);
		break;
	case "keydown":
		if(!ro)
		{
			if(isBidiEnabled)
				processBackspaceDelete(event,this);

			if((hasKeyCode(event, 'KEYCODE_TAB') || hasKeyCode(event, 'KEYCODE_ESC')) && this.getAttribute("PopupType"))
			{
				var popup = dijit.byId(dojohelper.getPopupId(this));
				if (popup)
				{
					dojohelper.closePickerPopup(popup);
					if(hasKeyCode(event, 'KEYCODE_ESC'))
					{
						if (event.preventDefault)
						{
							event.preventDefault();
						}
						else
						{
							event.returnValue  = false;
						}

						return;
					}
				}
			}
			input_keydown(event,this);
		}
		else if(hasKeyCode(event,'KEYCODE_ENTER') || (hasKeyCode(event,'KEYCODE_DOWN_ARROW') && this.getAttribute("liclick")))
		{
			var lbId = this.getAttribute("li");
			frontEndEvent(getElement(lbId),'click');
		}
		else if(hasKeyCode(event,KEYCODE_BACKSPACE))
		{
			cancelEvent(event);
		}
		break;
	case "keypress":
		if(!ro)
		{
			if(event.ctrlKey==false && hasKeyCode(event,'KEYCODE_ENTER'))
			{
				var db = this.getAttribute("db");
				if(db && db!="")
					sendClick(db);
			}
		}
		break;
	case "keyup":
		if(!ro)
		{
			if(isBidiEnabled)
				processBidiKeys(event,this);

			numericcheck(event,this);
			var min = this.getAttribute("min");
			var max = this.getAttribute("max");

			if(min && max && min!="NONE" || max!="NONE")
			{
				hiddenForm = getHiddenForm();
				inputs = hiddenForm.elements;

				if(min!="NONE" && parseInt(this.value)<parseInt(min))
				{
					this.value=min;
					inputs.namedItem("changedcomponentvalue").value = this.value;
					this.select();
					return false;
				}

				if(max!="NONE" && parseInt(this.value)>parseInt(max))
				{
					this.value=max;
					inputs.namedItem("changedcomponentvalue").value = this.value;
					this.select();
					return false;
				}
			}

			input_changed(event,this);
			datespin(event,this);
		}
		else
		{
			setFocusId(event,this);
		}
		showFieldHelp(event, this);
		break;
	}
}

/* textarea handler */
var dbcs = false;
function ta_(event)
{
	event = (event) ? event : ((window.event) ? window.event : "");
	if(DESIGNMODE)
		return;
	var ro = this.readOnly;
	if(showFieldHelp(event, this))
	{
		return;
	}
	switch(event.type)
	{
	case "click":
		if(overError(event,this))
			showFieldError(event,this,true);
		if(overInfo(event,this)){
			createExtendedTooltip(this.id);
		}			
		break;
	case "mouseover":
		this.title = this.value;
		break;
	case "mouseup":
		if (isIE() && !hasFocus(this))
			this.focus();
		if(isBidiEnabled)
			adjustCaret(event,this);
		break;
	case "blur":
		if(!ro)
		{
			input_onblur(event,this);
			if (isBidiEnabled)
				input_bidi_onblur(event, this);
			var max = parseInt(this.getAttribute("maxlength"));
			if(this.value.length > max)
			{
				this.value = this.value.substr(0, max);
			}
		}
		break;
	case "change":
		if(!ro)
		{
			var ea = this.getAttribute("escamp");
			if(ea == "true")
				this.value = this.value.replace(/&/g, '&amp;');
			var max = parseInt(this.getAttribute("maxlength"));
			if(this.value.length > max)
			{
				this.value = this.value.substr(0, max);
			}
			input_changed(event,this);
		}
		break;
	case "focus":
		input_onfocus(event,this);
		if (isBidiEnabled)
			input_bidi_onfocus(event, this);
		this.select();
		if (!ro) 
		{
			this.setAttribute("prekeyvalue",this.value);
			setCursor(this,this.value.length);
		}
		else
		{
			var element = this;
			window.setTimeout(function(){element.scrollTop = 0}, 10);
		}
		break;
	case "keydown":
		if(!ro)
		{
			lastKeyPress = event.keyCode;
			if(event.keyCode == 229 || event.charCode == 229) // keycode indicates dbcs input
				dbcs = true;
			if(isBidiEnabled)
				processBackspaceDelete(event,this);
			//var newlines = countLineBreaks(this.value);
			input_keydown(event,this);
		}
		else if(hasKeyCode(event,KEYCODE_BACKSPACE | KEYCODE_ENTER))
		{
			cancelEvent(event);
		}
		break;
	case "keyup":
		if(event.ctrlKey && hasKeyCode(event,'KEYCODE_SPACEBAR'))
			showFieldError(event,this,true);
		if(!ro)
		{
			if(isBidiEnabled)
				processBidiKeys(event,this);
			var max = parseInt(this.getAttribute("maxlength"));
			if(this.value.length > max)
			{
				if(dbcs==true && isIE()) // IV46077 - workaround for IE bug
				{
					var messageString = MAX_LENGTH.replace(" {0}","");
					alert(messageString);
					dbcs = false;
				}
				this.value = this.value.substr(0, max);
			}
			input_changed(event,this);
		}
		break;
	case "drop":
		input_onfocus(event,this);
		if (isBidiEnabled)
		{
			input_bidi_onfocus(event, this);
		}
		this.select();
		if(!ro) 
		{
			this.setAttribute("prekeyvalue",this.value);
			setCursor(this,this.value.length);
		}
	case "cut":
	case "paste":
		if(!ro)
		{
			var fldInfo = this.getAttribute("fldInfo");
			if(fldInfo)
			{
				fldInfo = dojo.fromJson(fldInfo);
				if(!fldInfo.query || fldInfo.query!=true)
				{
					setButtonEnabled(saveButton,true);
				}
			}
			window.setTimeout("inputchanged=true;input_forceChanged(dojo.byId('"+this.id+"'));", 20);
		}
		break;
	case "mousemove":
		overError(event,this);
		overInfo(event,this);
		break;
	}
}

/* textbox handler */
function tb_(eventOrComponent)
{
	eventOrComponent = (eventOrComponent) ? eventOrComponent : ((window.event) ? window.event : "");
	var textbox;
	var eventType = eventOrComponent.type;
	if(undef(eventType) || eventType == 'text' || eventType == 'password') {
		eventType = "init";
		textbox = eventOrComponent;
	}
	else {
		textbox = getSourceElement(eventOrComponent);
	}
	var role = textbox.getAttribute("role");
	if(DESIGNMODE)
		return;
	var ro = textbox.readOnly;
	var exc=(textbox.getAttribute("exc")=="1");
	switch(eventType)
	{
		case "init":
			setPromptValue(textbox.id);
			if (tpaeConfig.hc)                                                  
			{                                                                   
				tpaeConfig.hc.fieldError(textbox);                                  
			}
			let width = textbox.style.width;
			if (width) {
				try {
					textbox.setAttribute('data-field-width', parseInt(textbox.style.width));
				} catch(error){
					//do nothing
				}
			}                                                       
			break;
		case "mousedown":
			if(getFocusId()==this.id)
				this.setAttribute("stoptcclick","true");
			break;
		case "mouseup":
			if (isIE() && !hasFocus(this))
			{
				this.focus();
			}
			if (isBidiEnabled)
			{
				adjustCaret(eventOrComponent, this);
			}
			break;
		case "blur":
			input_onblur(eventOrComponent,this);
			if (isBidiEnabled)
				input_bidi_onblur(eventOrComponent, this);
			break;
		case "change":
			if(!ro)
				input_changed(eventOrComponent,this);
			break;
		case "click":
			if (overError(eventOrComponent, this)){
				showFieldError(eventOrComponent, this, true);
			}
			if (overInfo(eventOrComponent,this)){
				createExtendedTooltip(this.id);
			}
			var liclick=this.getAttribute("liclick");
			var li=this.getAttribute("li");
			if(li!="" && liclick=="1" && document.elementFromPoint(eventOrComponent.x,eventOrComponent.y) === eventOrComponent.currentTarget)
			{
				frontEndEvent(getElement(li),'click');
			}
	
			if(this.getAttribute("stoptcclick")=="true")
			{
				stopBubble(eventOrComponent);
			}
			this.setAttribute("stoptcclick","false");
			break;
		case "focus":
			if (this.id.indexOf("FontSizeDropDown") < 0 && 
				this.id.indexOf("FontNameDropDown") < 0 && 
				this.id.indexOf("FormatBlockDropDown") < 0)
			{
				input_onfocus(eventOrComponent,this);
				if (isBidiEnabled)
					input_bidi_onfocus(eventOrComponent, this);
				this.select();
				this.setAttribute("prekeyvalue",this.value);
			}
			break;
		case "keydown":
			this.setAttribute("keydown","true");
			if(!ro)
			{
				lastKeyPress = eventOrComponent.keyCode;
				if(eventOrComponent.ctrlKey && hasKeyCode(eventOrComponent,'KEYCODE_SPACEBAR')) {
					cancelEvent(eventOrComponent);
					break;
				}		
				if(isBidiEnabled)
					processBackspaceDelete(eventOrComponent,this);
				if(hasKeyCode(eventOrComponent, 'KEYCODE_DELETE') || hasKeyCode(eventOrComponent, 'KEYCODE_BACKSPACE'))
				{
					getHiddenForm().elements.namedItem("changedcomponentvalue").value = this.value;
				}
				if((hasKeyCode(eventOrComponent, 'KEYCODE_TAB') || hasKeyCode(eventOrComponent, 'KEYCODE_ESC')))
				{
					var taMatch = dojo.attr(this, "ta_match");
					if(taMatch) {
						if(taMatch.toLowerCase().indexOf(this.value.toLowerCase()) == 0)
						{
							console.log("tamatch="+taMatch);
							this.value = taMatch;
							input_keydown(eventOrComponent, this);
							dojo.attr(this, {"prekeyvalue" : ""});
							input_forceChanged(this);
							inputchanged = false;
							return; // don't want to do input_keydown again so preKeyValue will work
						}
					}
					if(this.getAttribute("PopupType"))
					{
						var popup = dijit.byId(dojohelper.getPopupId(this));
						if (popup)
						{
							dojohelper.closePickerPopup(popup);
							if(hasKeyCode(eventOrComponent, 'KEYCODE_ESC'))
							{
								if (eventOrComponent.preventDefault)
								{
									eventOrComponent.preventDefault();
								}
								else
								{
									eventOrComponent.returnValue  = false;
								}
	
								return;
							}
						}
					}
				}
				input_keydown(eventOrComponent,this);
			}
			else if(hasKeyCode(eventOrComponent,'KEYCODE_ENTER') || (hasKeyCode(eventOrComponent,'KEYCODE_DOWN_ARROW') && this.getAttribute("liclick")))
			{
				var lbId = this.getAttribute("li");
				frontEndEvent(getElement(lbId), 'click');
			}
			else if(hasKeyCode(eventOrComponent,KEYCODE_BACKSPACE))
			{
				cancelEvent(event);
			}
			else if(SCREENREADER && role=="combobox" && hasKeyCode(eventOrComponent,'KEYCODE_SPACEBAR'))
			{
				var lbId = this.getAttribute("li");
				frontEndEvent(getElement(lbId), 'click');
			}
			break;
		case "keypress":
			if(!ro)
			{
				lastKeyPress = eventOrComponent.keyCode;
				if(eventOrComponent.ctrlKey==false && hasKeyCode(eventOrComponent,'KEYCODE_ENTER'))
				{
					var db = this.getAttribute("db");
					if(db && db!="")
					{
						input_forceChanged(this);
						sendClick(db);
						// IV32363 - When default button is a new row button, then we must set focus on 
						// the button or the value in text box will be copied to the new row 
						if (db)
						{
							window.setTimeout("focusElement(document.getElementById('"+db+"'))", 10);
						}
					}
				}
			}
			break;
		case "keyup":
			var keyDown = this.getAttribute("keydown");
			this.setAttribute("keydown","false");
			if(eventOrComponent.ctrlKey && hasKeyCode(eventOrComponent,'KEYCODE_SPACEBAR'))
			{
				if(showFieldError(eventOrComponent,this,true))
				{
					return;
				}
				else
				{
					menus.typeAhead(this,0);
				}
			}
			if(!ro)
			{
				if(isBidiEnabled)
					processBidiKeys(eventOrComponent,this);
	
				numericcheck(eventOrComponent,this);
				var min = this.getAttribute("min");
				var max = this.getAttribute("max");
	
				if(min && max && min!="NONE" || max!="NONE")
				{
					if(min!="NONE" && parseInt(this.value)<parseInt(min))
					{
						this.value=min;
						getHiddenForm().elements.namedItem("changedcomponentvalue").value = this.value;
						this.select();
						return false;
					}
	
					if(max!="NONE" && parseInt(this.value)>parseInt(max))
					{
						this.value=max;
						getHiddenForm().elements.namedItem("changedcomponentvalue").value = this.value;
						this.select();
						return false;
					}
				}
				var defaultButton = false;
				if(eventOrComponent.ctrlKey==false && hasKeyCode(eventOrComponent,'KEYCODE_ENTER'))
				{
					var db = this.getAttribute("db");
					if(db && db!="")
					{
						defaultButton=true;
					}
				}
				input_changed(eventOrComponent,this);
				datespin(eventOrComponent,this);
			}
			else
			{
				setFocusId(eventOrComponent,this);
			}
			if(showFieldHelp(eventOrComponent, this))
			{
				return;
			}
			if(keyDown=="true" && hasKeyCode(eventOrComponent, 'KEYCODE_ENTER') && !eventOrComponent.ctrlKey && !eventOrComponent.altKey)
			{
				menus.typeAhead(this,0);
				return;
			}
			if(!hasKeyCode(eventOrComponent, 'KEYCODE_ENTER|KEYCODE_SHIFT|KEYCODE_CTRL|KEYCODE_ESC|KEYCODE_ALT|KEYCODE_TAB|KEYCODE_END|KEYCODE_HOME|KEYCODE_RIGHT_ARROW|KEYCODE_LEFT_ARROW')
					&& !eventOrComponent.ctrlKey && !eventOrComponent.altKey)
			{
				menus.typeAhead(this,0);
			}
			break;
		case "mouseover":
			if(this.type!="password" && !this.className.includes('tablefilterfield') && !this.hasAttribute('access-title')){
				this.title = this.value;
			}
			break;
		case "mousemove":
			overError(eventOrComponent,this);
			overInfo(eventOrComponent,this);
			break;
		case "drop":
			input_onfocus(eventOrComponent,this);
			if (isBidiEnabled)
			{
				input_bidi_onfocus(eventOrComponent, this);
			}
			this.select();
			if(!ro) 
			{
				this.setAttribute("prekeyvalue",this.value);
			}
		case "cut":
		case "paste":
			if(!ro)
			{
				var fldInfo = this.getAttribute("fldInfo");
				if(fldInfo)
				{
					fldInfo = dojo.fromJson(fldInfo);
					if(!fldInfo.query || fldInfo.query!=true)
					{
						setButtonEnabled(saveButton,true);
					}
				}
				window.setTimeout("inputchanged=true;input_forceChanged(dojo.byId('"+this.id+"'));", 20);
			}
			break;
	}
}

/* tablecell handler */
function tc_(event,component)
{
	if(DESIGNMODE)
		return;
	// bound directly from the jsp, 'this' is not valid
	var tRrow=component.parentNode;
	var row = parseInt(component.getAttribute("row"));
	switch(event.type)
	{
	case "click":
		var currentRow = (component.getAttribute("currentrow")=="true");
		if(!currentRow && row>=0)
		{
			sendEvent('click',component.id,'');
		}
		break;
	case "mouseout":
		if(row>=0)
			removeClass(tRrow,'tableRowHover');
		break;
	case "mouseover":
		if(row>=0)
			appendClass(tRrow,'tableRowHover');
		break;
	}
}

/* toggleimage handler */
function ti_(event)
{
	event = (event) ? event : ((window.event) ? window.event : "");
	if(DESIGNMODE)
		return;
	var eventValue = this.getAttribute("ev");
	var imgid = dojo.query("img", this)[0].id;
	var active = !(this.getAttribute("active")==0);
	switch(event.type)
	{
		case "blur":
			input_onblur(event,this);
			break;
		case "click":
			if(active)
			{
				var comp = getElement(this.getAttribute("compid"));
				if(!comp){
					comp = this;
				}
				setFocusId(event,comp);
				setClickPosition(comp,event);
				sendEvent('click',this.id,eventValue);
				cancelEvent(event);
			}
			break;
		case "focus":
			setCurrentfocusId(event,this);
			break;
		case "keydown":
			if(active && hasKeyCode(event,'KEYCODE_SPACEBAR|KEYCODE_ENTER'))
			{
				setClickPosition(this,event);
				sendEvent('click',this.id,eventValue);
				cancelEvent(event);
			}
			break;
		case "mousedown":
			input_mousedown(event,this);
			break;
		case "mouseover":
			var imgEl = getElement(imgid);
			if(imgEl)
			{
				var imageType=imgEl.getAttribute("imgtype");
				if(active && imageType!="")
				{
					var src=imgEl.getAttribute("source");
					imgEl.src=IMAGE_PATH+src+"_over"+imageType;
				}
				return noStatus();
			}
		case "mouseout":
			var imgEl = getElement(imgid);
			var imageType=imgEl.getAttribute("imgtype");
			if(active && imageType!="")
			{
				var src=imgEl.getAttribute("source");
				imgEl.src=IMAGE_PATH+src+imageType;
			}
			break;
	}
}

function showFieldError(event, component, focus)
{
	focusElement(component);

	var exc = component.getAttribute("exc");
	if (!exc)
	{
		return false;
	}
	var excValue = parseInt(exc);
	if(excValue == 4)
	{
		showSmartFillLookup(component.id);
	}
	else
	{
		startPopOver(event, component, focus);
		if(!undef(event))
		{
			stopBubble(event);
		}
	}
	return true;
}

function promptSessionLeave(event)
{
	event = (event) ? event : ((window.event) ? window.event : "");
	if(warnExit)
	{
		if(!IE || event.clientY<0)
		{
			leaveSession();
			return UNLOAD_WARN;
		}
	}
}

function bindEventsArray(el,tagArray,replace)
{
	if(undef(el))
		el=document;
	for(var i =0;i<tagArray.length;i++)
	{
		bindChildEvents(el,tagArray[i],replace);
	}
	
	if(SCREENREADER){
		//Fix dojo chart problem with portlet
		var portletBoxes = document.querySelectorAll('div.portletbox');
		portletBoxes.forEach(function(portlet){
			var portletTitle = portlet.querySelector('td.hbsh > h2') ? portlet.querySelector('td.hbsh > h2').innerHTML : '';
			//Fix dojo chart problem with portlet table empty column header and not title on chart table
			Array.prototype.slice.call(portlet.querySelectorAll('th.khtc')).forEach(function(th){ 
				if(th.innerHTML.includes("&nbsp;")){
					th.ariaHidden = "true";
					var parentTable = th.parentElement.closest('table');
					if(parentTable && portletTitle !== '') {
						parentTable.title = portletTitle;
					}		
				}
			});
		})
	}

	setLastEditableField();
}

function setLastEditableField() {
	var inputs = dojo.query("input,textarea", dojo.byId(clientAreaId));
	for(i=inputs.length-1;i>=0;i--) {
		var input = inputs[i];
		if(!dojo.attr(input,"readonly") && !undef(input.id)) {
			if(dojo.attr(input, "ctype")!="textbox" && dojo.attr(input, "ctype")!="textarea" || dojo.style(input,"display")=="none") {
				continue;
			}
			if(!undef(lastField) && !undef(lastField.binding)) {
				//remove old bindings
				dojo.disconnect(lastField.binding);
			}
			lastField["last"] = input.id;
			lastField["previous"] = inputs[i-1];
			var lf = dojo.byId(lastField.last);
			lastField.binding = dojo.connect(lf, "change", lf, function(){
				if(!undef(lastField.previous)) {
					if (lastKeyPress == KEYCODE_TAB)
					{
						setValueForFocusChange(event, dojo.byId(lastField.previous));
					}
				}
			});
			break;
		}
	}
}

/**
 * Binds events for a given elements children with a particular tagName
 */
function bindChildEvents(topEl,tag,replace)
{
	if(topEl==null)
		topEl=document;
	if(topEl!=document)
		type = topEl.getAttribute("ctype");
	if(!undef(type))
	{
		var tagName = topEl.tagName;
		if(tagName && tagName.toLowerCase()==tag.toLowerCase())
		{
			bindElementEvents(topEl,tag,replace); // make sure the element
			// passed in gets the
			// bindings
		}
	}
	var list = dojo.query(tag, topEl);

	for(var i=0;i<list.length;i++)
	{
		var el = list[i];
		var type = el.getAttribute("ctype");
		if(type == "")
			continue;
		bindElementEvents(el,tag,replace);
	}
	if(SCREENREADER)
	{
		//remove regions from hidden elements to overcome limitation in the RPT scanner.
		dojo.query("[role=region]").forEach(function(element){removeRegionAndGroupRoles(element);});
		dojo.query("[role=group]").forEach(function(element){removeRegionAndGroupRoles(element);});
	}
}

function removeRegionAndGroupRoles(element){
	var x = element; 
	while(x.tagName!='BODY' && x.style.display!='none') {
		x = x.parentNode; 
	} 
	if(x.tagName!='BODY') {
		dojo.removeAttr(element, 'role');
	}
}

/**
 * Binds events for all document children with a particular tagName
 */
function bindEvents(tag,replace)
{
	var found = false;
	for(var i=0;i<eventBindObjects.length;i++)
	{
		if(eventBindObjects[i]=="tag")
		{
			found =true;
			break;
		}
	}
	if(!found)
		eventBindObjects.push(tag);
	bindChildEvents(null,tag,replace);
}

/* 	Event binding code */
function bindElementEvents(el,tag,replace)
{
	if(undef(el))
		return;
	if(undef(tag))
		tag = el.tagName.toLowerCase();
	// following block is to supress image/link dragging in browsers
	if(!DESIGNMODE && (tag=="img" || tag=="a"))
	{
		if(undef(el.ondragstart))
		{
			if(tag=="img" && el.getAttribute("tabindex"))
			{
				el.setAttribute("draggable",false);
				el.ondragstart=function() { return false; };
			}
		}
	}
	var type=el.getAttribute("ctype");
	if(undef(type) || type=="null"){
		type=el.getAttribute("role");
		if(undef(type) || type=="null"){
			type = el.getAttribute("tablecell");
			if(undef(type) || type=="null"){	
				return;
			}
			type = "gridcell";
		}
	}
	var de=el.getAttribute("de");
	var bound = false;
	switch(type) // what type of component?
	{
  case "buttongroup":
    bg_(el);
    break;
	case "checkbox":
		el.onblur=cb_;
		el.onclick=cb_;
		el.onfocus=cb_;
		el.onkeydown=cb_;
		if(!DESIGNMODE)
			el.onmousedown=cb_;
		el.onmouseout=cb_;
		el.onmouseover=cb_;
		bound = true;
		cb_(el);
		break;
	case "gridcell":
		el.onclick=gridCell_;
		el.onmouseout=gridCell_;
		el.onmouseover=gridCell_;
		break;
	case "image":
		if(!DESIGNMODE || de=="1")
		{
			el.onblur=im_;
			el.onclick=im_;
			el.onfocus=im_;
			el.onkeydown=im_;
			el.onmousedown=im_;
			el.onmouseout=im_;
			el.onmouseover=im_;
			bound = true;
		}
		break;
	case "label":
    if(!DESIGNMODE || de=="1")
		{
			el.onclick=label_;
      		el.onfocus=label_;
			el.onkeydown=label_;
			el.onmousedown=label_;
			el.onmouseout=label_;
			el.onmouseover=label_;
			el.onmouseup=label_;
		}
    bound = true;
		break;
	case "mockrow":
		el.onclick=mockRow_;
		el.onmouseout=mockRow_;
		el.onmouseover=mockRow_;
		break;
	case "sortlabel": //example of mixed event bindings
		if(!DESIGNMODE || de=="1")
		{
			el.onfocus=label_;
			el.onmousedown=label_;
			el.onmouseout=label_;
			el.onmouseover=label_;
			el.onkeypress=sortlabel_;
			el.onmouseup=sortlabel_;
			bound = true;
		}
		break;
	case "pushbutton":
		if(!DESIGNMODE) // we don't want to change the pushbutton div used
			// in App Designer
		{
			el.onclick=pb_;
			el.onfocus=pb_;
			el.onmousedown=pb_;
			el.onmouseout=pb_;
			el.onmouseover=pb_;
			el.onkeypress=pb_;
			bound = true;
		}
		break;
	case "radiobutton":
		var iType=el.getAttribute("type");
		if(iType=="radio")
		{
			el.onclick=rb_;
			el.onfocus=rb_;
			el.onkeydown=rb_;
			el.onkeypress=rb_;
			el.onmousedown=rb_;
			bound = true;
		}
		break;
	case "select":
		el.onblur=sel_;
		el.onclick=sel_;
		el.onchange=sel_;
		el.onfocus=sel_;
		el.onkeydown=sel_;
		el.onkeypress=sel_;
		el.onkeyup=sel_;
		el.onmouseup=sel_;
		bound = true;
		break;
	case "togglebutton":
		el.onclick=togglebutton_;
		el.onkeydown=togglebutton_;
		el.onfocus=togglebutton_;
		togglebutton_(el);
		bound = true;
		break;
	case "textarea":
		el.onblur=ta_;
		el.onchange=ta_;
		el.onclick=ta_;
		el.oncut=ta_;
		el.onfocus=ta_;
		el.onkeydown=ta_;
		el.onkeypress=ta_;
		el.onkeyup=ta_;
		el.oncut=ta_;
		el.onpaste=ta_;
		el.onmouseover=ta_;
		el.onmousemove=ta_;
		el.onmouseup=ta_;
		bound = true;
		break;
	case "navsearch":
		tb_(el);
		break;
	case "textbox":
		el.onblur=tb_;
		el.onclick=tb_;
		el.onchange=tb_;
		el.oncut=tb_;
		el.ondrop=tb_;
		el.onfocus=tb_;
		el.onkeydown=tb_;
		el.onkeypress=tb_;
		el.onkeyup=tb_;
		el.onmousedown=tb_;
		el.onmouseover=tb_;
		el.onmousemove=tb_;
		el.onmouseup=tb_;
		el.onpaste=tb_;
		bound = true;
		tb_(el);
		break;
	case "toggleimage":
		el.onblur=ti_;
		el.onclick=ti_;
		el.onfocus=ti_;
		el.onkeydown=ti_;
		el.onmousedown=ti_;
		el.onmouseout=ti_;
		el.onmouseover=ti_;
		bound = true;
		break;
	case "ttimage":
		el.onmouseover = tti_;
		el.onmouseout = tti_;
		el.onclick = tti_;
		if(SCREENREADER || MOBILE) {
			el.onfocus = tti_;
			el.onblur = tti_;
			el.onkeydown = tti_;
		}
		tti_(el);
		break;
	}
	
	//we only want to do this on a refresh, not a straight render
	if(replace && bound && !DESIGNMODE)
	{
		try
		{
			if(el.id!="" && getFocusId()==el.id && el.setAttribute("prekeyvalue"))
			{
				focusElement(el);
			}
		}
		catch(error)
		{
			//can't focus
		}
	}

}

//This method is used to deselect text in a textarea and position cursor
//at the end of the text
function setCursor(inputEl, curPos)
{
	var cur=inputEl.getAttribute("cursor");
	if(cur!=null && cur !="")
	{
		cur=parseInt(cur);
		curPos=cur;
	}
	if (inputEl.setSelectionRange)
	{
		focusElement(inputEl);
		inputEl.setSelectionRange(curPos, curPos);
	}
	else if (inputEl.createTextRange)
	{
		var range = inputEl.createTextRange();
		range.collapse(true);
		range.moveStart('character', curPos);
		range.select();
	}
}

//Added for issue 08-19268
function callWebReplayFrame() {
	try {
		for ( var i=0; i<window.top.frames.length; i++ )
		{
			var wr_frame = window.top.frames[i];
			if (wr_frame && wr_frame.processMaximoFocusCallback)
				wr_frame.processMaximoFocusCallback();
		}
	} catch (msg) {
	}
}

//for future use
function showTreeWorking(treecontid,elemid,hide)
{
	var overlay;
	if(hide == false)
	{
		overlay = getElement(elemid);
		overlay.parentNode.removeChild(overlay);

		return;
	}

	var treecontainer = getElement(treecontid);

	var _width = treecontainer.offsetWidth;
	var _height = treecontainer.offsetHeight;
	var _top = treecontainer.offsetTop;
	var _left = treecontainer.offsetLeft;

	overlay = MAINDOC.createElement("div");
	overlay.setAttribute("id",elemid);
	overlay.style.width = _width + "px";
	overlay.style.height = _height + "px";
	overlay.style.position = "absolute";
	overlay.style.background = "#dedede";
	overlay.style.top = _top + "px";
	overlay.style.left = _left + "px";

	overlay.style.filter = "alpha(opacity=50)";
	overlay.style.opacity = "0.5";
	overlay.style.mozOpacity = "0.5";

	treecontainer.appendChild(overlay);
}

var urlValue = null;

//function called from page.jsp to open new window and set focus to new window
function openURL(url,windowId)
{
	stopFocus = true;
	var win = window.open(url, windowId, 'left=100,top=100,height=500,width=800,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,toolbar=yes');
	win.focus();
}

//method to open a new window to display an attached document for weblogic to handle the new window focus issue
function openEncodedURL(url, encodeHash, encodePercent) {
	urlValue = url;
	stopFocus = true;
	if (encodePercent) {
		url = url.replaceAll("%", "%25");
	}	
	if (encodeHash) {
		url = url.replaceAll("#", "%23");
	}

	var options = 'left=100,top=100,height=500,width=800,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,toolbar=yes';
	// workaround for lack of noopener support in ie
	if (document.documentMode || /Edge/.test(navigator.userAgent) || isIE() || dojo.isIE) {
		if(ALWAYSOPENATTACHMENTS || (url.indexOf('_tbldnld') >= 0 && HOSTNAME === window.location.hostname && (HOSTPORT === window.location.port || HOSTPORT == "80" || HOSTPORT == "443")))
		{
			warnExit = false;
			window.open(url, 'newWindow', options);
			warnExit = true;
		}
		else
		{
			openWindowWithNullOpener(url, options);
		}
	}
	else if (/Firefox/.test(navigator.userAgent) && (url.indexOf('.xlsx') >= 0 || url.indexOf('.xls') >= 0 || url.indexOf('.doc') >= 0 || url.indexOf('.ppt') >= 0 || url.indexOf('_tbldnld') >= 0)) 
	{
		warnExit = false;	
		window.open(url, '_blank', options);
		warnExit = true;
	}
 	else
 	{
		window.open(url, 'newWindow', options + ',noopener');
	}
}

function openWindowWithNullOpener(url,options)
{
	var win = window.open(null, 'newWindow', options);
	win.opener = null;
	win.location = url;
}

function newWindow()
{
	var newWindow = window.open(urlValue,'newWindow','left=100,top=100,height=500,width=800,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,toolbar=yes');
	if (newWindow)
	{
		newWindow.focus();
	}
}

function highlightTabFromFocus(over,tabid,onoff)
{
	highlightTab(over,document.getElementById(tabid),onoff);
}

function highlightTab(over,tab,onoff)
{
	if(working)
		return false;
	var tabid=tab.id;
	var index=tabid.indexOf("_anchor")-1;
	if(index>0)
	{
		tab=document.getElementById(tabid.substring(0,index+1));
		if(!tab)
		{
			return;
		}
	}
	var row=tab.rows[0];
	var anc=document.getElementById(tab.id+"_anchor");
	if(over!="over" && hasFocus(anc))
		return;
	var cell0=row.cells[0];
	var cell1=row.cells[1];
	var cell2=row.cells[2];

	cell0.className = "text tl"+onoff+over;
	cell1.className = "text tab"+onoff+over;
	var cls=anc.className;
	if(undef(cls))
		cls="";
	cls=trim(cls);
	if(over=="over")
	{
		if(!cls.endsWith("hover"))
			cls+="hover";
	}
	else
	{
		cls=cls.substring(0,cls.length-5);
	}
	anc.className=cls;
	cell2.className = "text tr"+onoff+over;
}


function getTreeNodeInfo(eventOrNode, topUL)
{
	var node = (eventOrNode.type)?getSourceElement(eventOrNode):eventOrNode;
	var info = {"children": false, "childrenfilled": false, "open": false, "node": null};
	while(node!=null && node.tagName!="LI")
	{
		node=node.parentNode;
	}
	if(node)
	{
		var nodeInfo = dojo.fromJson(node.getAttribute('nodeinfo'));
		var children = dojo.query('ul', node);
		info.div = dojo.query('div', node)[0];
		info.nodeinfo = nodeInfo;
		info.children = children.length > 0;
		info.childrenfilled = dojo.query('li', children[0]).length > 0;
		info.expanded = nodeInfo.expanded;
		info.node = node;
		info.stateimage = dojo.query('img', node)[0];
		var ul = node.parentNode;
		var siblings = dojo.query('> li', ul);
		info.levelindex = siblings.indexOf(node);
		info.parentnode = ul.parentNode;
		var allListItems = dojo.query('li', topUL);
		var fullIndex = allListItems.indexOf(node);
		info.first = allListItems[0];
		info.last = allListItems[allListItems.length-1];
		if(siblings[info.levelindex+1])
		{
			info.nextsibling = siblings[info.levelindex+1];
		}
		if(siblings[info.levelindex-1])
		{
			info.previoussibling = siblings[info.levelindex-1];
		}
		else
		{
			info.previoussibling = siblings[siblings.length-1];
		}

		if(allListItems[fullIndex+1])
		{
			info.next = allListItems[fullIndex+1];
		}
		else
		{
			info.next = allListItems[0];
		}
		if(info.next.parentNode.style.display=="none")
		{
			info.next=info.nextsibling;
		}
		if(allListItems[fullIndex-1])
		{
			info.previous = allListItems[fullIndex-1];
		}
		else
		{
			info.previous = allListItems[allListItems.length-1];
		}
		if(info.previous.parentNode.style.display=="none")
		{
			info.previous=info.previoussibling;
		}
	}
	return info;
}

function updateJSONAttribute(element, attribute, memberLevels, value)
{
	element = getElement(element);
	var obj = dojo.fromJson(element.getAttribute(attribute));
	if(memberLevels.length==1)
	{
		obj[memberLevels[0]] = value;
	}
	if(memberLevels.length==2)
	{
		obj[memberLevels[0]][memberLevels[1]] = value;
	}
	if(memberLevels.length==3)
	{
		obj[memberLevels[0]][memberLevels[1]][memberLevels[2]] = value;
	}
	if(memberLevels.length==4)
	{
		obj[memberLevels[0]][memberLevels[1]][memberLevels[2]][memberLevels[3]] = value;
	}
	if(memberLevels.length==5)
	{
		obj[memberLevels[0]][memberLevels[1]][memberLevels[2]][memberLevels[3]][memberLevels[4]] = value;
	}
	element.setAttribute(attribute, dojo.toJson(obj));
}

/*
 * Up Arrow and Down arrow keys move between visible nodes.
 * Left arrow key on an expanded node closes the node.
 * Left arrow key on a closed or end node moves focus to the node's parent.
 * Right arrow key expands a closed node, moves to the first child of an open node, or does nothing on an end node.
 * Enter key performs the default action on end nodes.
 * Typing a letter key moves focus to the next instance of a visible node whose title begins with that letter.
 * Home key moves to the top node in the tree view.
 * End key moves to the last visible node in the tree view.
N/A Ctrl+Arrow to an item with the keyboard focuses the item (but does not select it). Previous selections are maintained, provided that the Ctrl key is not released or that some other keyboard function is not performed.
N/A Ctrl+Space with focus on an item toggles the selection of the item.
N/A Shift+Up Arrow extends selection up one node.
N/A Shift+Down Arrow extends selection down one node.
N/A Shift+Home extends selection up to the top-most node.
N/A Shift+PageDown extends selection down to the last node.
N/A (asterisk) on keypad expands all nodes.
 */
function treeKey(event, topUL)
{
	var info = getTreeNodeInfo(event, topUL);
	if(!info.node)
	{
		return;
	}
	var focusDiv;
	switch(event.keyCode)
	{
	case KEYCODE_ENTER:
		if(SCREENREADER) {
			processEvent(info.nodeinfo.secondaryevent);
		}
		else {
			if(dojo.attr(info.node, "enabled")!="false") {
				var enterEvent = (info.nodeinfo.selected)? "secondaryevent" : "primaryevent";
				processEvent(info.nodeinfo[enterEvent]);
			}
		}
		cancelEvent(event);
		break;
	case KEYCODE_SPACEBAR:
		if(SCREENREADER) {
			processEvent(info.nodeinfo.secondaryevent);
		}
		else {
			if(event.ctrlKey)
			{
				if(dojo.attr(info.node, "enabled")!="false") {
					processEvent(info.nodeinfo.secondaryevent);
				}
				cancelEvent(event);
			}
		}
		break;
	case KEYCODE_HOME:
		focusDiv = dojo.query('div', info.first)[0];
		cancelEvent(event);
		break;
	case KEYCODE_END:
		focusDiv = dojo.query('div', info.last)[0];
		cancelEvent(event);
		break;
	case KEYCODE_LEFT_ARROW:
		// Left arrow key on an expanded node closes the node.
		// Left arrow key on a closed or end node moves focus to the node's
		// parent.
		if(info.stateimage)
		{
			if(info.expanded && info.children)
			{
				info.div.focus();
				info.nodeinfo.expanded=!info.nodeinfo.expanded;
				info.node.setAttribute("nodeinfo", dojo.toJson(info.nodeinfo));
				info.stateimage.src=info.stateimage.getAttribute("wait");
				processEvent(info.nodeinfo.toggleevent);
			}
			else // same as up arrow
			{
				if(info.parentnode.tagName=="LI")
					focusDiv = dojo.query('div', info.parentnode)[0];
			}
		}
		cancelEvent(event);
		break;
	case KEYCODE_RIGHT_ARROW:
		// Right arrow key expands a closed node, moves to the first child of an open node, or does nothing on an end node.
		if(info.stateimage && info.children)
		{
			if(!info.expanded)
			{
				info.div.focus();
				info.nodeinfo.expanded=!info.nodeinfo.expanded;
				info.node.setAttribute("nodeinfo", dojo.toJson(info.nodeinfo));
				info.stateimage.src=info.stateimage.getAttribute("wait");
				processEvent(info.nodeinfo.toggleevent);
			}
			else // same as down arrow
			{
				focusDiv = dojo.query('div', info.next)[0];
			}
		}
		cancelEvent(event);
		break;
		// Up Arrow and Down arrow keys move between visible nodes.
	case KEYCODE_UP_ARROW:
		focusDiv = dojo.query('div', info.previous)[0];
		cancelEvent(event);
		break;
	case KEYCODE_DOWN_ARROW:
		focusDiv = dojo.query('div', info.next)[0];
		cancelEvent(event);
		break;
	default:
		var keyPressed;
	if(event.keyCode)
	{
		keyPressed = event.keyCode;
	}
	else
	{
		keyPressed = event.charCode;
	}
	var character = String.fromCharCode(keyPressed).toLowerCase();
	var internalElements = dojo.query('a:last-of-type', topUL);
	var currentInternalElement;
	if(!internalElements || internalElements.length==0)
	{
		internalElements = dojo.query('span:last-of-type', topUL);
		currentInternalElement = dojo.query('span:last-of-type', info.div)[0];
	}
	else
	{
		currentInternalElement = dojo.query('a:last-of-type', info.div)[0];
	}

	var startIndex = internalElements.indexOf(currentInternalElement);
	internalElements.forEach(function(anchor, index, nodelist){
		if(!focusDiv && index>startIndex)
		{
			var child = anchor.childNodes[0];
			if(child.nodeType==3)
			{
				var text;
				if(child.textContent)
				{
					text = child.textContent.toLowerCase();
				}
				else
				{
					text = anchor.innerText.toLowerCase();
				}
				if(text.startsWith(character))
				{
					focusDiv = child.parentNode.parentNode;
					cancelEvent(event);
					return;
				}
			}
		}
	});
	break;
	}
	if(focusDiv)
	{
		focusTreeNode(focusDiv, topUL.id);
	}
}

function focusTreeNode(nodeDivOrId, ulId){
	if(typeof nodeDivOrId == 'string'){
		nodeDivOrId = dojo.byId(nodeDivOrId);
	}
	if(nodeDivOrId && ulId)
	{
		var topUL = dojo.byId(ulId);
		if(!topUL){
			return;
		}
		var info = getTreeNodeInfo(nodeDivOrId, topUL);
		var lastFocusId = dojo.attr(topUL, 'lastfocus');
		if(lastFocusId){
			dojo.attr(dojo.byId(lastFocusId), {'tabindex':'-1'})			
		}
		dojo.attr(nodeDivOrId, {'tabindex':'0'})
		nodeDivOrId.focus();
		dojo.attr(topUL, {'lastfocus':nodeDivOrId.id});
	}

}

/**
 * bind this handler to the onkeydown of the <li> for navigable structures and it will handle the keys for next previous and tab
 * Enabled for Bidi - left and right arrows need to swap direction to make sense in RTL
 * Struct is:
 * <ul>
 *  <li><a>text</a><a>text2</a></li>
 *   ...
 * </ul>
 */
function itemAKey(event, anchor)
{
	if(hasKeyCode(event, KEYCODE_ENTER))
	{
		return;
	}

	var rtl = document.body.dir == "rtl";

	var li = anchor.parentNode;
	var ul = li.parentNode;

	var anchors = dojo.query('a', ul).filter(function(node) {
		var disabled = node.disabled || dojo.attr(node, "disabled");
		return disabled != true && disabled != "true" && disabled != "disabled";
	});

	if(hasKeyCode(event, KEYCODE_SPACEBAR))
	{
		cancelEvent(event);
		frontEndEvent(anchor,'click');
		return;
	}
	if(hasKeyCode(event, KEYCODE_TAB))
	{
		var next;
		if(event.shiftKey && !rtl ||
				!event.shiftKey && rtl)
		{
			next = anchors[0];
		}
		else
		{
			next = anchors[anchors.length - 1];
		}

		if(next)
		{
			next.focus();
		}
	}
	else if(hasKeyCode(event, 'KEYCODE_LEFT_ARROW|KEYCODE_RIGHT_ARROW'))
	{
		var index = anchors.indexOf(anchor);

		if((hasKeyCode(event, KEYCODE_LEFT_ARROW) && !rtl) ||
				(hasKeyCode(event, KEYCODE_RIGHT_ARROW) && rtl))
		{
			index--;
		}
		else if((hasKeyCode(event, KEYCODE_RIGHT_ARROW) && !rtl) ||
				(hasKeyCode(event, KEYCODE_LEFT_ARROW)&& rtl))
		{
			index++;
		}

		if(index < 0)
		{
			index = anchors.length - 1;
		}
		else if(index > anchors.length - 1)
		{
			index = 0;
		}

		var next = anchors[index];
		if(next)
		{
			anchor.tabIndex = -1;
			next.focus();
			next.tabIndex = 0;
			cancelEvent(event);
		}
	}
}

function listboxKey(event, anchor)
{
	if(hasKeyCode(event, 'KEYCODE_ENTER|KEYCODE_SPACEBAR')) {
		if(event.altKey || event.shiftKey || event.ctrlKey) {
			cancelEvent(event);
		}
		return;
	}

	var li = anchor.parentNode;
	var ul = li.parentNode;

	var anchors = dojo.query('a', ul);

	if(hasKeyCode(event, KEYCODE_TAB)) {
		var next;
		if(event.shiftKey)
		{
			next = anchors[0];
		}
		else
		{
			next = anchors[anchors.length - 1];
		}

		if(next)
		{
			next.focus();
		}
	}
	else if(hasKeyCode(event, 'KEYCODE_UP_ARROW|KEYCODE_DOWN_ARROW')) 
	{
		var index = anchors.indexOf(anchor);

		if(hasKeyCode(event, KEYCODE_UP_ARROW)) 
		{
			index--;
		}
		else if(hasKeyCode(event, KEYCODE_DOWN_ARROW))
		{
			index++;
		}

		if(index < 0)
		{
			index = anchors.length - 1;
		}
		else if(index > anchors.length - 1)
		{
			index = 0;
		}

		var next = anchors[index];
		if(next)
		{
			next.focus();
			cancelEvent(event);
		}
	}
}

function hasFocus(el)
{
	return (el==document.activeElement);
}

function positionObject(vis,ctrlId,placeHolderId)
{
	var ctrl = document.getElementById(ctrlId);
	var ph=document.getElementById(placeHolderId);
	if(ctrl)
	{
		ctrl=getControl(ctrl);
		if(!vis)
		{
			ctrl.style.top=-5000 + "px";
			return;
		}
		if(!ph)
			ctrl.style.top=0 + "px";
		else
		{
			ph.style.height=ctrl.clientHeight+10 + "px";
			ph.style.width=ctrl.clientWidth + "px";
			var chTop=0;
			ctrl.style.top=getTopPosition(ph)-chTop + "px";
			ctrl.style.left=getLeftPosition(ph) + "px";
		}
	}
}

function addOnJsFiles(file)
{
	var doc;
	if(MAINDOC == parent)
		doc = MAINDOC.document;
	else
		doc = MAINDOC;

	var ele = doc.getElementById('addOnJsFiles');
	if (!ele)
	{
		var scripttag=doc.createElement('script');
		scripttag.src=file;
		scripttag.type='text/javascript';
		scripttag.id='addOnJsFiles';
		// scripttag.def=true;
		// document.getElementsByTagName('head').item(0).appendChild(scripttag);
		doc.getElementsByTagName('head').item(0).appendChild(scripttag);
	}
}

function setSkin(skinHref)
{
	link = document.getElementById("csslink");
	if (link) {
		link.href = skinHref;
	}
}


formatCalendar = function(inputOrId, dateValue, info) {
	var comp = dojo.byId(inputOrId);
	if (comp.getAttribute("changed_by_user") == "true")
		return;
	if((undef(dateValue))||(dateValue.length == 0))
		return;
	var element;
	if(inputOrId.tagName) {
		element = inputOrId;
	}
	else {
		element = document.getElementById(inputOrId);
	}
	if(!element) {
		return dateValue;
	}
	var options, datePackage, dojoValue;
	if(info){
		datePackage = info.dojoPackage;
		element.setAttribute("datePackage", info.dojoPackage);
		element.setAttribute("dojoValue", info.dojoValue);
		element.setAttribute("constraints", dojo.toJson(info.constraints));
	}
	datePackage = element.getAttribute("datePackage");
	if(datePackage)
	{
		dojo.require("layers.mbs.calendar");
		dojo.addOnLoad(function() {
			dojo.require(datePackage);
			dojo.require(datePackage+ ".locale");
			dojo.require("dojo.date.locale");
			dojo.addOnLoad(function(){
				options =  dojo.fromJson(element.getAttribute("constraints"));
				datePackage = element.getAttribute("datePackage");
				dojoValue = element.getAttribute("dojoValue");	

				var dateClassObj = dojo.getObject(datePackage+ ".Date", false);
				var dateLocaleModule = dojo.getObject(datePackage+ ".locale", false);
				var dojoValue = Number(dojoValue);
				var nDate = new dateClassObj(new Date(parseInt(element.getAttribute("dojoValue"))));
				var title = element.getAttribute("title");
				var newValue = dateLocaleModule.format(nDate,options);
				if(options.timePattern) {
					newValue = newValue.substring(0, newValue.indexOf(" ")) + dateValue.substring(dateValue.indexOf(" "));
				}
				if(title) {
					title = title.replace(dateValue, newValue);
					element.setAttribute("title",title);
				}
				dateValue = newValue;
				if(element.tagName=="INPUT"){
					element.value = dateValue;
				}
				else {
					element.innerHTML = dateValue; 
				}
				/*
				//Must convert the processvalue so we can display correct error and edit my value.
				var fldInfo = dojo.fromJson(dojo.attr(element, "fldinfo"));
				if(fldInfo.err) {
					var processValueDate = Date.parse(fldInfo.err.processvalue);
					if(fldInfo.err.processvalue && !isNaN(processValueDate)) {
						fldInfo.err.processvalue = dateLocaleModule.format(dateClassObj(new Date(processValueDate)),options);
						dojo.attr(element, {"fldinfo":dojo.toJson(fldInfo)});
					}
				}
				*/
			});
		});
	}
	else
	{
		element.value = dateValue;
	}
};

formatCalendarLabel = function(inputId){

	var element = document.getElementById(inputId);
	var options =  dojo.fromJson(element.getAttribute("constraints"));
	var datePackage = element.getAttribute("datePackage");
	var dojoValue = Number(element.getAttribute("dojovalue"));
	var dateValue;
	if(datePackage)
	{
		dojo.require("layers.mbs.calendar");
		dojo.addOnLoad(function() {
			dojo.require(datePackage);
			dojo.require(datePackage+ ".locale");
			dojo.addOnLoad(function() {
				var dateClassObj = dojo.getObject(datePackage+ ".Date", false);
				var dateLocaleModule = dojo.getObject(datePackage+ ".locale", false);
				var nDate = new dateClassObj(new Date(dojoValue));
				dateValue = dateLocaleModule.format(nDate,options);
				if (dojo.isIE) {
					element.innerText += dateValue;
				}
				else
				{
					element.innerHTML += dateValue;
				}
				var title = dateLocaleModule.format(nDate,options);
				element.setAttribute("title",title);
			});
		});
	}
};

formatToMXCalendar = function(element, value){
	if((undef(value))||(value.length == 0))
		return value;

	var options =  dojo.fromJson(element.getAttribute("constraints"));
	var datePackage = element.getAttribute("datePackage");
	var dateValue;
	if(datePackage)
	{
		dojo.require("layers.mbs.calendar");
		dojo.require(datePackage);
		dojo.require(datePackage+ ".locale");
		dojo.require("dojo.date.locale");

		var dateClassObj = dojo.getObject(datePackage+ ".Date", false);
		var dateLocaleModule = dojo.getObject(datePackage+ ".locale", false);
		dateValue = dateLocaleModule.parse(value,options);
		var dateOnlyOption = { selector: 'date', datePattern: options.datePattern };
		var tValue = value;
		var info = dateLocaleModule._parseInfo(dateOnlyOption);
		value = value.toString();
		var regexp = info.regexp;
		var re = new RegExp(regexp);
		var match = re.exec(tValue);
		if(match)
		{
			match = match[0].toString();
			dateValue = dateLocaleModule.parse(match, dateOnlyOption);
			var gDate = new Date(dateValue.toGregorian());
			var gsvalue = dojo.date.locale.format(gDate, dateOnlyOption);
			value = value.replace(match, gsvalue);
		}
	}

	return value;
};

/**
 * Allows addition of a single table row for 'New Row' performance
 */
function addTableRow(compHTML,XHRReplaceComponent)
{
	var tempDiv = document.getElementById("storage");
	tempDiv.innerHTML=compHTML;
	var newRowTableId = XHRReplaceComponent.getAttribute("compid")+"_rowholder";
	var newRowTable = getElement(newRowTableId);
	var tableBodyId = XHRReplaceComponent.getAttribute("tableBodyId");
	var originalTable = getElement(tableBodyId);
	if (newRowTable.rows[0].getAttribute("currentrow")=="true")
	{
		dojo.query('tr[currentrow="true"]', originalTable).forEach(function(tr){
			tr.removeAttribute('currentrow');
		});
	}
	var displayRows = parseInt(originalTable.getAttribute("displayrows"));
	var rowsPerPage = parseInt(originalTable.getAttribute("rowsperpage"));
	var offset = (dojo.attr(originalTable.rows[originalTable.rows.length-1], 'selectrows')=='true'?1:0);
	var	tempRow = originalTable.insertRow(originalTable.rows.length - offset);
	if(displayRows==0)
	{
		//hiding the 'no rows found'
		originalTable.rows[2].style.display="none";
	}
	if(displayRows>=rowsPerPage)
	{
		//delete the first data row
		originalTable.deleteRow(3);
	}
	else
	{
		//increment the number of rows displayed
		originalTable.setAttribute("displayrows", ++displayRows);
	}

	var tableBody = originalTable.tBodies[0];
	tableBody.replaceChild(newRowTable.rows[0],tempRow);
	bindEventsArray(originalTable,eventBindObjects,true);
}

function addDialog(compHTML,XHRReplaceComponent)
{
	var holder  = dojo.byId("dialogholdertd");
	var holderRow = holder.parentNode;
	var newHolder, newHolderId;
	var compHolderId = "";

	if(XHRReplaceComponent)
	{
		compHolderId=XHRReplaceComponent.getAttribute("compid")+"_holder";
		newHolder=document.getElementById(compHolderId);
	}

	if(undef(newHolder))
		newHolder=holderRow.insertCell(holderRow.cells.length);

	if(!undef(compHTML))
	{
		newHolder.innerHTML=compHTML;
	}
	else
	{
		newHolder.innerHTML=XHRReplaceComponent.innerHTML;
	}

	newHolder.id=compHolderId;
}

/**
 * Returns true if it finds a value in a given array
 *
 * @param arrayToCheck
 * @param val
 * @returns {Boolean}
 */
function arrayContains(arrayToCheck,val)
{
	if (dojo.some(arrayToCheck, function(item) {
		return item == val;
	}))
	{
		return true;
	}
	else
	{
		return false;
	}
}

/**
 * Update a rich text viewer instance
 *
 * @param id the id of the rich text viewer iframe
 * @param value the html value to apply
 * @param updateStyle true if the style of the iframe should be updated too. Typically only needed the first time.
 */
updateRichTextViewer = function(id, value, updateStyle, rtl)
{
	var viewerNode = dojo.byId(id);
	if (viewerNode)
	{
		var doc = viewerNode.contentDocument || viewerNode.contentWindow;
		if(doc.document)
		{
			doc = doc.document;
		}

		if (rtl)
		{
			doc.body.dir = "rtl";
		}
		let x = document.createElement('textarea');
		x.innerHTML=value;
		doc.body.innerHTML = x.value;

		if(updateStyle)
		{
			dojo.style(doc.body, "margin", "2px");
			dojo.style(doc.body, "fontFamily", dojo.style(viewerNode.parentNode, "fontFamily"));
			dojo.style(doc.body, "fontSize", dojo.style(viewerNode.parentNode, "fontSize"));
		}
	}
};

function hasRowMarker(id)
{
	return id.indexOf(rowMarkerStart)>-1;
}

function getRowFromId(id)
{
	var start = id.indexOf(rowMarkerStart);
	if(start<0)
	{
		return null;
	}
	start=start+rowMarkerStart.length;
	var end = id.indexOf(rowMarkerEnd,start);
	return id.substring(start,end);
}

function removeRowMarker(id)
{
	var markerIndex = id.indexOf(rowMarkerStart);
	if(markerIndex<0)
	{
		return id;
	}
	return id.substring(0,markerIndex);
}

/**
 * Adds a row marker if it does not exist and replace it with the given row if it does
 */
function setRowMarker(id, row)
{
	return removeRowMarker(id) + rowMarkerStart + row + rowMarkerEnd;
}

function setMatchingFieldStates(changedComp,commit)
{
	var fldInfo = changedComp.getAttribute("fldInfo");
	if(fldInfo)
	{
		try
		{
			fldInfo = dojo.fromJson(fldInfo);
		}
		catch(error)
		{
			console.error("Error trying to process: " + fldInfo);
			throw error;
		}
		if(!fldInfo)
		{
			return;
		}
		setComponentStates(getSharedAttributes(fldInfo), changedComp, commit);
		if(commit)
		{
			applySetValues(changedComp, fldInfo);
		}
	}
}

function applySetValues(changedComp, fldInfo)
{
	if(!undef(fldInfo.dsid))
	{
		var dataStoreInfo = getDataStoreInfo(fldInfo);
		var dataStore = getDataStore(fldInfo.dsid);
		if(!dataStore || !dataStoreInfo)
		{
			return;
		}
		var setvalues = dataStoreInfo.setvalues;
		var filterObj = new FilterObject(true);
		filterObj.add(dataStoreInfo.typeahead.keyattribute, changedComp.value);
		dataStore.filter(filterObj);
		if(dataStore.length()!=1)
		{
			return;
		}
		for(var attribute in setvalues)
		{
			var valueToSet = dataStore.getValue(0,attribute);
			if(!valueToSet)
			{
				continue;
			}
			var setValueIds = setvalues[attribute];
			var setValuePerformed = false;
			try
			{
				queueManager.hold();
				for(var i = 0; i < setValueIds.length; i++)
				{
					var setValueCompId = setValueIds[i];
					var component = getComponentOnCurrentDataRow(setValueCompId);
					if(component)
					{

						if(valueToSet)
						{
							component.value=valueToSet;
							setFieldState(component,new ValidationError(0,""));
							if(!setValuePerformed) // only need to do this once
								// for each attribute
							{
								var requestType = getRequestTypeForComponentEvent(component, "setvalue", valueToSet);
								queueManager.queueEvent(new Event("setvalue", setValueCompId, valueToSet, requestType), "text/xml", "xml", processXHR, null);
								setValuePerformed=true;
							}
						}
					}
				}
				queueManager.release();
			}
			catch(error)
			{
				queueManager.release();
			}

		}
	}
}

function removePageAutoFill(autoFillIndex)
{
	if(autoFillInfo)
	{
		delete autoFillInfo[autoFillIndex];
	}
}

function getSharedAttributes(fldInfo)
{
	if(!undef(fldInfo.saindex))
	{
		var pageAutoFillInfo = getAutoFillInfoForPage(fldInfo);
		if(!undef(pageAutoFillInfo) && !undef(pageAutoFillInfo.sharedattributes))
		{
			return pageAutoFillInfo.sharedattributes[fldInfo.saindex];
		}
	}
	return null;
}

function getAutoFillInfoForPage(fldInfo)
{
	if(!undef(autoFillInfo) && !undef(fldInfo.afindex))
	{
		return autoFillInfo[fldInfo.afindex];
	}
}

function getDataStoreInfo(fldInfo)
{
	if(!undef(fldInfo.dsid))
	{
		var pageAutoFillInfo = getAutoFillInfoForPage(fldInfo);
		if (!undef(pageAutoFillInfo) && !undef(pageAutoFillInfo.datastores))
		{
			return pageAutoFillInfo.datastores[fldInfo.dsid];
		}
	}
	return null;
}

/*
	{ "sharedattributes"	: {"0":["field1","field2"],"1":["field3","field4"]},
		 "datastores" : {
			"datastore1":	{
				"typeahead":	{	"attributes":["value", "description"],
									"keyattribute":"value"
					},
				"filters"	:	{	"f1": ["f1_1","f1_2"],
									"f2": ["f2_1","f2_2"]
					},
				"setvalues"	:	{	"sv1":	["sv1_1","sv1_2"],
									"sv2":	["sv2_1","sv2_2"]
					}
				},
			"datastore2":	{
				"typeahead":	{	"attributes":["value", "description"],
									"keyattribute":"value"
					}
				}
		 	}
		};
 */
function updateAutoFill(autoFillId, autoFillUpdates)
{
	if(undef(autoFillInfo)) // no old definitions, use the new one
	{
		autoFillInfo=autoFillUpdates;
		return;
	}

	var updateAutoFill = autoFillUpdates[autoFillId];
	var pageAutoFill = autoFillInfo[autoFillId];
	if(undef(pageAutoFill))
	{
		autoFillInfo[autoFillId] = updateAutoFill;
		return;
	}

	if(updateAutoFill.siteorgvalues)
	{
		pageAutoFill.siteorgvalues = updateAutoFill.siteorgvalues;
	}
	//Have to merge the new into the old
	if(updateAutoFill.sharedattributes)
	{ // begin shared attributes
		if(undef(pageAutoFill.sharedattributes)) // if it is not in the
			// original, just move it in
		{
			pageAutoFill.sharedattributes = updateAutoFill.sharedattributes;
		}
		else
		{
			for(var listIndex in updateAutoFill.sharedattributes)
			{
				var oldList = pageAutoFill.sharedattributes[listIndex];
				var newList = updateAutoFill.sharedattributes[listIndex];
				if(oldList)
				{
					pageAutoFill.sharedattributes[listIndex] = oldList.concat(newList);
				}
				else
				{
					pageAutoFill.sharedattributes[listIndex] = newList;
				}
			}
		}
	} // end shared attributes

	if(updateAutoFill.datastores)
	{ // begin data stores
		if(!pageAutoFill.datastores) // none defined, copy all into structure
		{
			pageAutoFill.datastores = updateAutoFill.datastores;
		}
		else
		{
			for(var dataStoreId in updateAutoFill.datastores)
			{ // begin individual data store
				if(!pageAutoFill.datastores[dataStoreId]) // if it is a new
					// dataSource
				{
					pageAutoFill.datastores[dataStoreId] = updateAutoFill.datastores[dataStoreId];
				}
				else // the datastore exists already so we must go inside and
					// do updates of individual pieces
				{
					var newDataStore = updateAutoFill.datastores[dataStoreId];
					var oldDataStore = pageAutoFill.datastores[dataStoreId];
					for(var newDataStoreObjId in newDataStore)
					{
						if(!oldDataStore[newDataStoreObjId])
						{
							oldDataStore[newDataStoreObjId]=newDataStore[newDataStoreObjId];
						}
						else if(newDataStoreObjId!="typeahead") // ds sub object
							// already
							// exists...
							// need to merge
							// their inner
							// arrays (other
							// values should
							// not change)
						{
							var newObject = newDataStore[newDataStoreObjId];
							var oldObject = oldDataStore[newDataStoreObjId];
							if(!oldObject) // was not there or just rewrite it
							{
								oldDataStore[newDataStoreObjId] = newObject;
							}
							else
							{
								for(var newObjectInner in newObject)
								{
									var newIdList = newObject[newObjectInner];
									var oldIdList = oldObject[newObjectInner];
									if(!oldIdList)
									{
										oldObject[newObjectInner] = newIdList;
									}
									else
									{
										oldObject[newObjectInner] = oldIdList.concat(newIdList);
									}
								}
							}
						}
					}
				}
			}// end individual data store
		}
	}// end data stores
}

/*count the number of lines by splitting on the newline char. */
function countLineBreaks(str)
{
	var split = str.split("\n");
	return split.length-1;
}

function removeCheckboxError(checkbox)
{
	var errorIcon = document.getElementById(checkbox.id+"_err");
	if (errorIcon)
	{
		errorIcon.style.display="none";
	}
}

function setComponentStates(fldIds,changedComp,errors)
{
	if(!fldIds)
	{
		return;
	}
	var compId = changedComp.id;
	var compHasRowMarker = hasRowMarker(compId);
	var value = changedComp.value;
	var fldInfo = changedComp.getAttribute("fldInfo");
	var ariaChecked = changedComp.getAttribute('aria-checked');
	if(!fldInfo)
	{
		return;
	}
	fldInfo = dojo.fromJson(fldInfo);
	var error;
	var iswarning = false;
	if(fldInfo.err)
	{
		iswarning = fldInfo.err.iswarning;
		if (iswarning && changedComp.getAttribute("ctype") == 'checkbox')
		{
			removeCheckboxError(changedComp);
		}
		error = new ValidationError(fldInfo.err.exceptiontype,applyValueToMessage(fldInfo.err.processvalue, fldInfo.err.exception));
	}
	else
	{
		error = new ValidationError(0,"");
	}

	for(var fldIdNum = 0; fldIdNum < fldIds.length; fldIdNum++)
	{
		var id = fldIds[fldIdNum];
		if(hasRowMarker(id))
		{
			if (compHasRowMarker && removeRowMarker(id) == removeRowMarker(compId))
			{
				continue;
			}
			//need to see if original is on a table details and set the match on the correct current row
			var rowInfo = getTableRowInfo(changedComp);
			if(rowInfo.ondetails)
			{
				id = setRowMarker(id, rowInfo.row);
			}
		}
		if(id != compId)
		{
			var field = getElement(id);
			if(!field && id.indexOf("checkbox")>-1){
				var newId = id.replace("checkbox-cb","checkbox-tb");
				field = getElement(newId);
			}
			if(!field && hasRowMarker(id)) // Still has rowMarker so it must be
				// on a dataRow
			{
				field = getComponentOnCurrentDataRow(id);
			}
			if(field)
			{
				if (field.getAttribute("ctype") == 'checkbox')
				{
					toggleChkbx(field);
					if (iswarning)
					{
						removeCheckboxError(field);
					}
				}
				else if (field.getAttribute("ctype") == "togglebutton"){
					field.setAttribute('aria-checked',ariaChecked);
				}
				else
				{
					if(errors)
					{
						field.setAttribute("ov", value);
					}
					setFieldState(field, error);
					if(field.value != null)
					{
						field.value = value;
					}
					else
					{
						//See if there is a dojo widget
						var widget = dijit.byId(id);
						if(widget)
						{
							widget.set('value', value);
						}
					}
				}
			}
		}
	}
}

function getComponentOnCurrentDataRow(id)
{
	var pipe = id.indexOf("|");
	if(pipe==-1)
	{
		return getElement(id);
	}
	var componentId = id.substring(0, pipe);
	var tableBodyId = id.substring(pipe+1);

	var tableBody = getElement(tableBodyId);
	if(tableBody)
	{
		componentId = setRowMarker(componentId, tableBody.getAttribute("rownum"));
		return getElement(componentId);
	}
	return null;
}

function getTableRowInfo(componentOrId)
{
	var component = getElement(componentOrId);
	var rowInfo = {'row':-1,'ondetails':false,'ondatarow':false};
	if(!component)
	{
		return rowInfo;
	}
	var row = getRowFromId(component.id);
	if(row != null) // in actual table row
	{
		rowInfo = {'row':parseInt(row),'ondetails':false,'ondatarow':(row>=0)};
	}
	else // is this in details
	{
		var el = component;
		while(el && el != document)
		{
			if(el.getAttribute("tabledetails") == "true")
			{
				row = el.getAttribute("rownum");
				if(row)
				{
					rowInfo = {'row':parseInt(row),'ondetails':true,'ondatarow':false};
				}
				break;
			}
			el = el.parentNode;
		}
	}
	return rowInfo;
}

function toggleChkbx(comp)
{
	if(comp.tagName!="IMG" && comp.getAttribute('ctype') !== 'togglebutton') {
		comp = document.getElementById(comp.id+"_img"); // need to use
	}
	// the image
	// rather than
	// the <a>
	if(undef(comp))
		return;
	var checked=comp.getAttribute("checked");
	if(undef(checked)){
		checked=comp.getAttribute("aria-checked");
        if(undef(checked)){
            return;
        }
    }
	var selRow = dojo.attr(comp, "selrow");
	if(!selRow || selRow!="true") {
		setButtonEnabled(saveButton,true);
	}
    if(comp.tagName === 'IMG'){
        var source=comp.src;
        if(checked=="checked")
        {
            source=source.replace(/checked/i,"unchecked");
            comp.setAttribute("checked","unchecked");
        }
        else
        {
            source=source.replace(/unchecked/i,"checked");
            comp.setAttribute("checked","checked");
        }
        comp.parentNode.setAttribute("aria-checked",(checked=="checked"));
        comp.src=source;
    }
	else{
		if(comp.getAttribute("aria-checked") == "true"){
			comp.setAttribute("aria-checked", "false");
		}
		else{
			comp.setAttribute("aria-checked", "true");

		}
	}

}
/**
 * BEGIN Component specific mxeventjshandlers
 * One of these methods will be called when a component has it defined as a mxeventjshandler in the control/component registries
 * methods must follow signature methodName(componentid, eventtype)
 * and return requesttype - type of request
 * 	REQUESTTYPE_ASYNC - Asynchronous request
 * 	REQUESTTYPE_HIGHASYNC - High priority asynchronous request
 * 	REQUESTTYPE_SYNC - Synchronous request (will lock UI and wait for all ASYNCH to be done)
 * 	REQUESTTYPE_NORENDER - No Render expected from framework. Targeted directly to handling instance with no default response processing
 *	REQUESTTYPE_NONE - Don't send a request. Use this if you will make the request in your handler or don't wish to send one at all.
 */
//checkbox pre-request Handler (We will not check async as we should
//immediately check the checkbox no matter what
function cbHdlr(comp,eventType,eventValue,requesttype,piggyBack)
{
	switch (eventType)
	{
		case "toggle":
			setCurrentfocusId(null, comp);
			toggleChkbx(comp);
			setMatchingFieldStates(comp, false);
			if(dojo.hasAttr(comp, "exc")) {
				requesttype = "none";
				//sendEvent("processIgnoreWarning",comp.id,'')
				var newEvent = new Event("processIgnoreWarning", comp.id, "", REQUESTTYPE_ASYNC);
				newEvent.setPriority(2);
				queueManager.queueEvent(newEvent, "text/xml", "xml", processXHR, null);
			}
			break;
	}
	return requesttype; // unchanged. Use what is set prior to this call
}

//Radiobutton handling the visual selection in case of async queue and also we set async explicitly
//as the information is at the radiogroup level
function rbHdlr(comp,eventType,eventValue,requesttype,piggyBack)
{
	switch (eventType)
	{
	case "click":
		var rbg  = dojo.byId(comp.getAttribute("rbsid"));
		comp.setAttribute("checked", "checked");
		comp.setAttribute("tabindex", "0");

		// This is to get any other radiobutton with in the radiobuttongroup
		// which is checked then uncheck it
		dojo.query('input:checked', rbg.id).forEach(function(node, index, nodelist)
				{
			if (node.id!=comp.id)
			{
				node.checked="";
				node.setAttribute("tabindex", "-1");
			}
				});
		setButtonEnabled(saveButton,true);
		var rbasync = comp.getAttribute("rbasync");
		if(rbasync)
		{
			requesttype = REQUESTTYPE_ASYNC;
		}
		break;
	}
	return requesttype;
}

//tableRowMock pre-request Handler
function trmHdlr(comp,eventType,eventValue,requesttype,piggyBack)
{
	switch(eventType)
	{
		case "toggleselectrow":
			subComp=comp.childNodes.item(0).childNodes.item(0);
			requesttype = cbHdlr(subComp,"toggle",eventValue,requesttype,piggyBack);
		case "click":
			if(dojo.attr(comp, 'selected')=="true" && comp.className.indexOf('anchor')>-1){
				requesttype = REQUESTTYPE_NONE;
				var newEvent = new Event("selectrecord", comp.parentNode.id, "", REQUESTTYPE_SYNC);
				queueManager.queueEvent(newEvent, "text/xml", "xml", processXHR, null);
			}
			else {
				var async = comp.getAttribute("async")=="1";
				if(async)
				{
					if(!piggyBack)
						requesttype = REQUESTTYPE_ASYNC;
				}
			}
		break;
	}
	return {"requestType":requesttype,"targetId":comp.id.substring(0,comp.id.indexOf("[C:"))};
}

function cbupld(comp,eventType,eventValue,requesttype,piggyBack)
{
    //get the <tr> for the browse file line.
    var browseBox = document.getElementById("upload_iframe").parentNode.parentNode.parentNode;
    var browseName = null;
	var directBox = null;
    if(browseBox)
    {
        var directName = getNextSibling(browseBox);
		if(VERTLABELS == "true") {
			browseName = getPrevSibling(browseBox);
			directBox = getNextSibling(directName);
		}
		if(!compInitialized[comp.id])
        {
            compInitialized[comp.id] = comp.id;
            directName.style.display = 'none';   
            if (VERTLABELS == "true")
            {
    	    	directBox.style.display = 'none';
	        }
            return requesttype;
        }
    }

    cbHdlr(comp,eventType,eventValue,requesttype,piggyBack);

    if(undef(comp))
        return requesttype;  
    
    var useFilePrompt = "false";   
	require(["dojo/_base/sniff"], function(has){
		if(USEFILEPROMPT=="1" && (has("ie") || ((!has("ie") && has("trident") > 6)))) {
			useFilePrompt = "true";
		}
	})
    if (useFilePrompt == "true") {
    	return requesttype;
    }
        
    if(comp.getAttribute('aria-checked')=='true') {
        browseBox.style.display = '';
        directName.style.display = 'none';
        if(VERTLABELS == "true") {
        	if(browseName != null) {
        		browseName.style.display = '';
        	}
        	if(directBox != null) {
        		directBox.style.display = 'none';
        	}	
        }
    }
    else
    {
        browseBox.style.display = 'none';
        directName.style.display = '';
		if(VERTLABELS == "true") {
			if(directBox != null) {
				directBox.style.display = '';
			}
			if(browseName != null) {
				browseName.style.display = 'none';
			}
		}
    }
    return requesttype;
}

function dateLookupHdlr(comp,eventType,eventValue,requesttype,piggyBack)
{
	if(eventType!="click")
		return REQUESTTYPE_SYNC;
	var lc = comp.getAttribute("lc");
	var button = (comp.tagName=="BUTTON");
	var clickedComponent;
	if(comp.tagName=="IMG" && lc) {
		clickedComponent = comp;		
	}
	if(!lc && !button)
		return REQUESTTYPE_NONE;
	if(!button)
		comp=dojo.byId(lc);
	if(button || (comp && comp.getAttribute("PopupType")))// && !comp.readOnly))
	{
		if(button)
		{
			comp.setAttribute("selectevent","expressionbuilderdate");
			comp.setAttribute("popupType","ibm.tivoli.mbs.dijit.DateTimeCalendar");
		}
		if(MOBILEDATEPICKER)
			showDatePicker(comp);
		else
			dojohelper.showPickerPopup(comp, clickedComponent);
		setCurrentfocusId(null, comp);
	}
	return REQUESTTYPE_NONE;
}

//messagebox button dialogclose event pre-request Handler
function dialogcloseHdl(dialogid)
{
	var dialogToRemove = document.getElementById(dialogid);
	if(dialogToRemove)
	{
		cancelQueryTimeout();
		dialogCount--;
		showObjs();
		dialogTD=dialogToRemove.parentNode;
		dialogRow=dialogTD.parentNode;
		dialogRow.deleteCell(dialogTD.cellIndex);
		removeModalWaitLayer();
		warnExit=false;
	}
	return REQUESTTYPE_NONE;
}

function tglsr(comp,eventType,eventValue,requesttype,piggyBack)
{
	cbHdlr(comp,"toggle",eventValue,requesttype,piggyBack);
	if(comp.getAttribute("checked")=="checked")
	{
		comp.setAttribute("source",comp.getAttribute("source").replace(/unchecked/i,"checked"));
	}
	else
	{
		comp.setAttribute("source",comp.getAttribute("source").replace(/checked/i,"unchecked"));
	}
	return requesttype;
}

//OSLC preview pre-request handler
//Allows previews to be displayed with a table-image button click instead of hover
function oslcpreview(comp,eventType,eventValue,requesttype,piggyBack)
{
	if(comp.src.indexOf("nav_icon_properties_non_native.gif") >= 0)
	{
		requesttype = "none";
		var newEvent = new Event("fetchtooltip", comp.id, "", REQUESTTYPE_HIGHASYNC);
		newEvent["compid"] = comp.id;
		queueManager.queueEvent(newEvent, "text/json", "json", showExtendedTooltipPopup, null);
	}
	
	return requesttype;
}
//Save Spatial graphic updates
function saveSpatialGraphic(comp,eventType,eventValue,requesttype,piggyBack) 
{
	var editPanel = dijit.byId("EditPanelWidget");
	if (editPanel) {
		editPanel.saveGraphicFromDialog().then(dojo.hitch(this, function() {
			editPanel.tool.disable();
		}));
		
	}
	return requesttype;
}
//Discard Spatial graphic updates
function discardSpatialGraphic(comp,eventType,eventValue,requesttype,piggyBack) 
{
	var editPanel = dijit.byId("EditPanelWidget");
	if (editPanel) {
		editPanel.tool.disable();
		
	}
	return requesttype;
}

/**
 * END Component specific mxeventjshandlers
 */

function createExtendedTooltip(componentId)
{
	var component = dojo.byId(componentId);
	var tooltipIcon = dojo.byId(componentId+ "_tt");
	var eventId = componentId;
	if(!(component)){
		return;
	}
	if(!tooltipIcon){ //check to see if it is on a simple table column
		tooltipIcon = dojo.query(".tooltipMarker", component)[0];
		eventId = dojo.attr(tooltipIcon, "labelId");
		if(!tooltipIcon){
			return;
		}
	}
	
	dojo.style(tooltipIcon, {"cursor":"progress"});
	var contentMethod = dojo.attr(tooltipIcon, "hovertooltip");    
	if(undef(contentMethod))
        return;
	// if this is there, we had done it previously, so re-use.
	var responseObj = dojo.attr(tooltipIcon, "storedtooltip");
	if(undef(responseObj)) {
		responseObj = dojo.attr(component, "storedtooltip");
	}
	if(!undef(responseObj)) {
		dojo.style(tooltipIcon, {"cursor":"default"});
		var hoverObj = dojo.fromJson(responseObj);
		var popup = showCustomPopup(hoverObj);
		return;
	}
    var requesttype = dojo.attr(tooltipIcon, "tttype");
	var fetchEvent = new Event("fetchtooltip", eventId, "", requesttype);
	fetchEvent["compid"] = component.id;
	var responseType = "text/json";
	var handleAs = "json";
	var responseHandler = showExtendedTooltipPopup;
    tooltipIcon=componentId;
	if(requesttype==REQUESTTYPE_SYNC) {
		var closeButton = (MOBILE)?true:"none";
		showCustomPopup({
			compid: tooltipIcon, 
			focus: false, 
			content: "<img class='loadingIMG' src='"+IMAGE_PATH+"progressbar.gif'/>", 
			closeX: closeButton,
			buttons: []
		});
		responseType = "text/xml";
		handleAs = "xml";
		responseHandler = processXHR;
	}
	queueManager.queueEvent(fetchEvent, responseType, handleAs, responseHandler, null);
}

//var leaveTooltipOpen = false; 

//This may not get called a second time for same tooltip as they are cached // 
function showExtendedTooltipPopupFromSync(responseObj, ioArgs) {
	var recHover = responseObj.getElementsByTagName("rechover")[0];
	if(!undef(recHover))
	{
		var content = recHover.childNodes[0].nodeValue;
		if(!undef(content))
		{
			var events = dojo.fromJson(ioArgs.args.content.events);
			var closeButton = (MOBILE)?true:"none";
			var contentJSON = {
				compid: dojo.byId(events[0].compid), 
				focus: false, 
				content: content,
				recHover: true,
				closeX: closeButton,
				buttons: [],
				store: true,
				style: "background:red;"
			}
			var x = showExtendedTooltipPopup(contentJSON, ioArgs).domNode;
			if(!LEAVETOOLTIPOPEN)
			{
				require(["dojo/on"], function(on){
					on(x, "mouseenter", function(){
						on.once(x, "mouseleave", function(){
							stopPopWait();
							stopPopOver();
						});
	  				});
				});
			}
			return x;
		}		
	}
}

function showExtendedTooltipPopup(responseObj, ioArgs)
{
	var events = dojo.fromJson(ioArgs.args.content.events);
	responseObj.compid = events[0].compid;
	var component = dojo.byId(events[0].compid);
	dojo.style(component, {"cursor":"default"});
	if(!responseObj["ascerrmsg"]) {
		responseObj["ascerrmsg"] = "";
	}
	responseObj["systemdialog"]=false;
	responseObj["focus"]= false;
	if(responseObj["closeX"] && responseObj["closeX"]!="none") {
		responseObj["closeX"]=true;
	}
	if(!responseObj["closeX"] && responseObj["closeX"]!="none") {
		dojo.connect(component, "mouseout", component, function() {
			stopPopWait();
			stopPopOver();
		});
	}
	if(responseObj["closeX"]=="none") {
		 responseObj["closeX"]=false;
	}
	if(!responseObj["buttons"]) {
		responseObj["buttons"] = [];
	}
	if(SCREENREADER) {
		responseObj.systemdialog=true;
	}
	if(component && (responseObj["store"] == true)) {
		dojo.attr(component, {"storedtooltip":dojo.toJson(responseObj)});
	}
	return showCustomPopup(responseObj);
}

function bindRecHoverEvents(recHover) {
	if(DEBUGLEVEL>1) {
		return;
	}
//	dojo.connect(recHover, "mouseleave", recHover, function() {
//		var ttCloseTimer = window.setTimeout("stopPopOver()",tpaeConfig.extendedTooltipHideDelay);
//		dojo.attr(dojo.byId(currentPopoverField), {"ttCloseTimer":ttCloseTimer});
//	});
//	dojo.connect(recHover, "mouseenter", recHover, function() {
//		window.clearTimeout(dojo.attr(dojo.byId(currentPopoverField), "ttCloseTimer"));
//	});
}

function fixDateValues(container) {
	var inputs = container.getElementsByTagName("INPUT");
	for(var i=0;i<inputs.length;i++) {
		var input = inputs[i];
		if(dojo.hasAttr(input,"dojovalue")) {
			formatCalendar(input,ibm.tivoli.mbs.html.decodeEntities(input.value));
		}
	}
}

/**
 * Used to create a simple help popup (text only)
 * @param element
 * @param message
 * @return
 */
function popHelp(element, message) {
	showCustomPopup({
		compid: element.id, 
		focus: false, 
		content: "<p style=\"margin:5px 0px 5px 0px\">" + message + "</p>", 
		closeX: false,
		buttons: []
	});
}

/**
 * used to publish a message to all destroy listeners. Message is list of listeners
 * @param obj
 * @return
 */
function publishMessage(obj)
{
	dojo.publish(obj.channel, [{"listeners":obj.message}]);
}

/**
 * Can be used to switch the skin on the fly
 * @param skin
 * @return
 */
function applySkin(skin) {
	var loc = window.location +"";
	var hasParams = loc.indexOf("?")>=0;
	if (hasParams){
		var skinLoc = loc.indexOf("skin=");
		if(skinLoc>=0) {
			var skinEnd = loc.indexOf("&",skinLoc);
			skinLoc--;
			if(skinEnd>=0) { //& after
				loc = loc.replace(loc.slice(skinLoc,skinEnd),"");
			}
			else {
				loc = loc.substring(0,skinLoc);
			}
		}
	}
	loc += (((loc.indexOf("?")>=0)?"&":"?") + "skin="+skin);
	console.log("Changing skin from "+SKIN+" to "+skin+".");
	warnExit = false;
	window.location = loc;
}

/**
 * Retrieves cached list of most recent apps
 * @return array of app objects - {"text":"<%=apptitle%>","id":"recentApp_<%=appId%>","eventvalue":"<%=appId%>"}
 */
function getRecentAppList() {
	if(browserSupportsLocalStorage()) {
		var recentApps = getLocalStorage().getItem("recentApps");
		if(recentApps) {
			recentApps = dojo.fromJson(recentApps);
			var userApps = recentApps[SECURE_USERNAME+"_"+tenantID+"_"+USERLANG];
			if(userApps) {
				return userApps;
			}
		}
	}
	return [];
}

/**
 * IE needs window.localStorage
 * @return
 */
function getLocalStorage() {
	if(dojo.isIE) {
		return window.localStorage;
	}
	return localStorage;
}

/**
 * Adds to localStorage for use in build Recent Application Menu items for goto menus
 * @param appObj - {"text":"<%=apptitle%>","id":"recentApp_<%=appId%>","eventvalue":"<%=appId%>"}
 * @return
 */
function addToAppCache(appObject) {
	if(browserSupportsLocalStorage()) {
		var userKey = SECURE_USERNAME+"_"+tenantID+"_"+USERLANG;
		var recentApps = getLocalStorage().getItem("recentApps");
		var userApps = null;
		if(recentApps==null) {
			recentApps = {};
			userApps = (recentApps[userKey] = []);
		}
		else {
			recentApps = dojo.fromJson(recentApps);
			userApps = recentApps[userKey];
			if(!userApps) {
				userApps = recentApps[USERNAME+"_"+tenantID+"_"+USERLANG];
				if (userApps) {
					recentApps[userKey] = [...userApps];
					delete recentApps[USERNAME+"_"+tenantID+"_"+USERLANG];
					userApps = recentApps[userKey];
				}
			}
			if(!userApps) {
				userApps = (recentApps[userKey] = []);
			}
		}
		if(userApps) {
			for(i=0;i<userApps.length;i++) {
				if(userApps[i].id==appObject.id) {
					userApps.splice(i,1);
					break;
				}
			}
			userApps.unshift(appObject);
			var overSized = userApps.length>MAXRECENTAPPS;
			if(overSized) {
				userApps.pop();
			}
		}
		getLocalStorage().setItem("recentApps", dojo.toJson(recentApps));
	}
}

function replaceMsgParams(value, params) {
    for(i=0;i<params.length;i++) {
        var rep = params[i];
        var re = new RegExp("\\{"+i+"\\}","g");
        value=value.replace(re ,rep);
    }
    return value;
}

function stopDocScroll() {
	if(MOBILE) {
		return;
	}
	dojo.connect(window,"onscroll",window, function() {
		document.documentElement.scrollTop=0;
		document.documentElement.scrollLeft=0;
	});
}

function programmaticEvent(element,type) {
	if (dojo.isIE)
	{
	    element.fireEvent("on"+type);
	}
	else
	{ // Not IE
	    var event = document.createEvent("HTMLEvents");
	    event.initEvent(type, false, true);
	    element.dispatchEvent(event);
	}
}

function adjustBBCountLocation() {
	var bCount = dojo.query(".bulletinCount")[0];
	if(!bCount || dojo.style(bCount,"display")=="none") {
		return;
	}
	if(dojo.isIE) {
		dojo.style(dojo.query(".bulletinCount")[0].parentNode,{'paddingRight':"18px"});
	}
	else {
		dojo.style(dojo.query(".bulletinCount")[0].parentNode,{'paddingLeft':"18px"});
	}
	dojo.style(dojo.query("span",bCount.previousSibling)[0], {"margin":"0"});
}

function escapeHTML(value){
	function replaceChars(ch){
		switch(ch){
			case "<":
				return "&lt;";
			case ">":
				return "&gt;";
			case "&":
				return "&amp;";
			case "'":
				return "&#39;";
			case '"':
				return "&quot;";
		}
		return "?";
	}
	return String(value).replace(/[<>&"']/g, replaceChars);
}

function fixMockedLink(imId){
	var im = getElement(imId);
	var cb = im.parentNode;
	var linkCol = cb.parentNode.parentNode.cells[cb.parentNode.cellIndex+1];
	var checked = dojo.attr(im, 'checked');
	if(checked=='checked'){
		removeClass(linkCol, 'anchor');
		removeClass(linkCol, 'cur_h');
		dojo.attr(linkCol, {'selected':'false'});
	}
	else {
		appendClass(linkCol, 'anchor');
		appendClass(linkCol, 'cur_h');
		dojo.attr(linkCol, {'selected':'true'})
	}
}

function fixToolbarButtons(nodeIdentifier, id){
	var matchedNodes = dojo.query(nodeIdentifier);
	if(matchedNodes.length>0){
		if(matchedNodes.length>1){
			console.log(nodeIdentifier);
		}
		var originalNode = document.getElementById(id);
		var originalImage = dojo.query("img", originalNode)[0]; 
		for(var i =0; i<matchedNodes.length;i++){
			var node = matchedNodes[i];
			node.disabled = originalNode.disabled;
			dojo.query("img", node)[0].src = originalImage.src;
		};
	}
}

function bodyEvent(event){
	switch(event.type){
		case 'click':
			var sourceElement = getSourceElement(event);
			var parent = sourceElement.parentNode;
			if(sourceElement.id=='wait' || (parent && dojo.attr(parent, 'navSearch'))) {
				cancelEvent(event);
				break;
			}
			if (!Array.from(event.target.classList).includes("dijitPopup")) {
				hideAllMenus(false);
			}
			break;
		case 'keydown':
			if(working) {
				cancelEvent(event);
			}
			if(hasKeyCode(event, 'KEYCODE_N') && event.ctrlKey && !event.altKey) {
				window.open();
				return false;
			}
			if(DESIGNMODE) {
				parent.sendDesignerKey(event)
			}
			else {
				resetLogoutTimer(false);
				if(hasKeyCode(event, 'KEYCODE_BACKSPACE') && (!getSourceElement(event).type || !(getSourceElement(event).type.indexOf('text') >= 0 || getSourceElement(event).type == 'password'))) {
					cancelEvent(event);
				}
				if (appHotkey(event) == false) { 
					if(menus) {
						menus._hideMenu();
					} 
					if(event.ctrlKey && event.altKey) {
						if(hasKeyCode(event, KEYCODE_FIND)) { 
							qsTB=getQSTB(); 
							if(qsTB) { 
								qsTB.focus();
							} 
						}
					}
				}
			}	
			break;
	}
}

/* used to make sure older browsers have a textbox placeholder mechanism */
function setPromptValue(id, value) {
	var element = dojo.byId(id);
	if(element){
		if(!value && dojo.hasAttr(element, 'promptValue')) {
			value = dojo.attr(element, 'promptValue'); 
		}
		if(!value){
			return;
		}
		var test = document.createElement('input');
		if('placeholder' in test){
			dojo.attr(element, {'placeholder': value});
		}
		else {
			if(document.activeElement != element && (element.value == '' || element.value == dojo.attr(element, 'promptValue'))) 
			{
				dojo.attr(element, {'value' : value});
				appendClass(element, 'promptvalue');
			}
			else 
			{
				removeClass(element, 'promptvalue');
			}
			dojo.connect(element, 'focus', element, function(event) {
			 	if(this.value == dojo.attr(this, 'promptValue')) {
					dojo.attr(this, {'value' : ''});
					removeClass(this, 'promptvalue');
				 }
			});
			dojo.connect(element, 'blur', element, function(event) {
				if(this.value.trim() == '') {
					dojo.attr(element, {'value' : value});
					appendClass(element, 'promptvalue');
				}
			});
		}
	}
}

/* Short Circuiting object
 * This object can disable it's own internal methods based on a boolean that is passed in or present within the passed object.
 * This can allow for less code with if/else checks by allowing an object to change itself
 * NOTE: Member with names starting with '_' will not be turned off
 */
function ShortCircuit(object, sc){
	if(sc == 'undefined'){
		if(object['shortCircuit'] == 'undefined'){
			return;
		}
		sc = object['shortCircuit'];
	}
	if(sc != 'undefined' && !sc){ //short circuit check
		for(member in object){
			if(member.indexOf('_')!=0 && member.indexOf('_false')==-1){
				//if the member has a _false implementation, switch it
				if(object[member+'_false']){
					object[member] = object[member+'_false'];
					continue;
				};
				switch(typeof object[member]){
					case 'function':
						object[member] = function() {};
						break;
					case 'object':
						ShortCircuit(object[member], sc);
						break;
					case 'string':
						object[member] = '';
						break;
					case 'boolean':
						object[member] = false;	
						break;
					case 'number':
						object[member] = -1;
						break;
				}
			}
		}
	}
}

function HighContrast(hc)
{
	this._hc = hc;
	this._isHC = function(){
		return this._hc;
	};

	this.clearFieldError = function(field){
		var errorA = field.previousSibling;
		if(errorA && dojo.attr(errorA, 'fldError') == 'true'){
			field.parentNode.removeChild(errorA);
			dojo.style(field, {'width':dojo.attr(field,'originalwidth')+'px'});
			removeClass(field, 'fld_marker');
		}
	};
	
	this.fieldError = function(field){
		if(!field){
			return;
		}
		this.clearFieldError(field);
		var fldInfo = field.getAttribute('fldInfo');
		if(fldInfo)
		{
			fldInfo = dojo.fromJson(fldInfo);
			if(fldInfo.err)
			{
				// has an exception, should do something different in HC mode
				var src = '';
				var className = ''; 
				switch(fldInfo.err.exceptiontype){
					case 0: //warning
						src = 'warning.png';
						className = 'fld_warn';
						break;
					case 2: //yes/no/cancel
						src = 'question.png';
						className = 'fld_question';
						break;
					case 1: //required field
					case 3: //error
						src = 'error.png';
						className = 'fld_error';
						break;
					case 4: //smartfill
						src = 'smartfill.png';
						className = 'fld_smartfill';
						break;
					case 5: //info
						src = 'info.png';
						className = 'fld_info';
						break;
				}
				src = 'async/'+src;
				
				var errorImg = document.createElement("IMG");
				dojo.attr(errorImg, {'src':src,'fldError':'true'});
				dojo.style(errorImg, {'verticalAlign':'middle','margin':'auto','cursor':'pointer'});
				var oldClass = dojo.attr(field, 'class');
				dojo.attr(field, {'class': oldClass.replace(className, '')+' fld_marker'});
				//only accept click as CTRL+SPACE allows error to be viewed so icon does not need focus/key support
				dojo.connect(errorImg, 'click', field, function(event){
					lastClickElement = errorImg;
					stopBubble(event);
					showFieldError(event,this,true);
				});
				var ttl = dojo.attr(field,'title');
				if(!ttl){
					ttl = '';
				}
				dojo.attr(field,{'originalwidth':field.offsetWidth,'title':ttl+' error'});
				dojo.style(field, {'width':field.offsetWidth-20+'px'});
				field.parentNode.insertBefore(errorImg, field);
				return;
			}
		}
	};
	ShortCircuit(this, this._hc);
}

function forceObjsRefresh()
{	
	var objs = document.getElementsByTagName("OBJECT");
	var len = objs.length;
	for(var walkobjs = 0; walkobjs < len; walkobjs ++ )
	{
		var obj = objs[walkobjs];
		try
		{
			obj.repaint();
		}
		catch (e)
		{}			
	}
}

function openNextGenApp(route, params, type, desc, custapptype, ismafmobileapp){
	var link = undefined;
	var ignoreApp=['opdashboard'];
	if(custapptype && custapptype == 'REACT'){
		if(webAppUrl){
			//parse oslc context from webappurl
			webAppUrl = (webAppUrl.charAt(webAppUrl.length - 1) === "/") ? webAppUrl.substring(0,webAppUrl.length - 1) : webAppUrl;
			var webAppUrl_array = webAppUrl.split('/');
			var webAppUrlContext = webAppUrl_array.pop();
			
			//check if maxrcurl which is the maximo request contains an end slash, so graphite URL can be built accordingly
			let hasTrailingSlash = MAXRCURL.charAt(MAXRCURL.length - 1) === "/";
			let seperator = (hasTrailingSlash) ? '':'/';
			
			link = MAXRCURL+seperator+webAppUrlContext+"/graphite/"+route;

			if(params){
				link = link + params;
			}

			//append returnUrl if launch in context app exists to be used to return back to original app.
			if (link?.includes('&_graphite-return-to')) {
				let url = null;
				if (window?.top?.location) {
					url = window.top.location.href;
				} else {
					url = window.location.href;
				}
				sessionStorage.setItem('_return-to-classic-url', url);
			}
		}
	} else {
		link = nextGenUrl + params + '#/'+route; //need URL to go to lightning!!!! and build up with route, simple appname or more.
	}
	
	//{"text":"<%=apptitle%>","id":"recentApp_<%=appId%>","eventvalue":"<%=appId%>"}
	if(type && desc && !ignoreApp.includes(route)){
		addToAppCache({"text":desc,"id":"recentApp_"+route,"eventvalue":route,"apptype":type,"custapptype":custapptype,"ismafmobileapp":ismafmobileapp});
	}
 
	//open new window if its a lightning application.
	if((type==='WC' || type==='APP') && !custapptype){
		window.open(link, 'nextgen');
		return;
	} 
	warnExit=false;
	window.top.location = link;
}

moveTableDetailsBack=function(tableId){
  let detailRow = document.querySelector(`[data-detail-row-for=${tableId}]`);
  let detailRowHolder = document.querySelector(`[data-detail-row-holder-for=${tableId}]`);
  if(detailRowHolder && detailRow){
    let detailRowIndex = detailRowHolder.getAttribute('data-detail-row-index');
    if(detailRowIndex)
      detailRowHolder.insertBefore(detailRow, detailRowHolder.rows[parseInt(detailRowIndex)+1]);
  }
}

var tableIDs = {};
var tableListener,tableResizeTimer;
function fixTableAndHeader(id){

  window.setTimeout(function(){
    if(MOBILE){
      document.querySelectorAll('table.tbod').forEach(function(tbody){
        if(tbody.clientWidth < tbody.parentNode.clientWidth){
          tbody.style.width = tbody.parentNode.clientWidth + 'px';
        }
      })
    }
    if(!tableListener){
      tableListener = true;
      window.addEventListener('resize', function(){
        Object.keys(tableIDs).forEach(function(id){
          tableResizeTimer = window.setTimeout(function(){
            if(tableResizeTimer){
              window.clearTimeout(tableResizeTimer);
            }
            tableResizeTimer = setTimeout(function(){
              fixTableAndHeader(id);	
            }, 250);
            
          });
        });
      });
    }
  },300);
  var outer = getElement(id+'-to_holder');
  if(outer){
    var tableOuter = outer.firstElementChild;
    var tableBody = outer.querySelector('table.tbod');
    var tfr = tableBody.querySelector('.tfr')
    let bodyDisplay = tableBody.style.display;
    if(tableOuter.rows){
        Array.from(tableOuter.rows).forEach((row,rowIndex)=>{
        if(rowIndex>0){
            row.style.display = bodyDisplay;
        }
        });
    }
    if(tfr){
          var list = tfr.querySelectorAll('td');
          var headers = tableBody.querySelectorAll('th');
          window.setTimeout(function(){
            var col;
            for(var index = 0; index<list.length; index++){
              col = list[index];
              if(!col.firstElementChild || col.firstElementChild.style.display == 'none'){
				  if(headers[col.cellIndex]){
					headers[col.cellIndex].style.width = '5px';
				  }
              }
              else if(col.scrollWidth >= col.offsetWidth){
                var span = col.querySelector('span');
                if(span){
                  col.style.width = span.innerText.length + 'ch';
                }
              }
            }
        
        let tableFooter = null;
        let footers = outer.querySelectorAll('td[data-inner-css~=tablefooter]');
		if(footers && footers.length > 0){
			tableFooter = footers[footers.length - 1];
		}
        if(tableFooter){
          tableFooter.style.display = tfr.getAttribute('data-has-data')=== 'true'?'block':'none';
        }
        var header = outer.querySelector('.hbouter');
        if(tableBody && header){
          if(tableBody.offsetWidth <= header.offsetWidth || MOBILE){
            tableBody.style.tableLayout = "auto";
            tableBody.style.width = '100%';	
          }
          else {
            tableBody.style.width = 'auto';
          }
        }
        },200);
    }
    let currentRow = tableBody.parentElement.querySelector(`#${tableBody.id} > tbody > tr[currentrow=true]`);
    if(currentRow){
      let tableId = tableBody.id.substring(0,tableBody.id.lastIndexOf('_'));
      let details = dojo.byId(`${tableId}_tdet-td_inner`) || dojo.byId(`${id}_detailsBar`);
      if(details){
        let detailRow = details.closest('tr');
        let bodyRow = detailRow.previousElementSibling;
        bodyRow.setAttribute('data-body-row-for', tableId);
        detailRow.setAttribute('data-detail-row-for', tableId);
		if(detailRow.role === 'presentation' || detailRow.role === ''){
			detailRow.removeAttribute('role');
		}
        detailRow.parentElement.setAttribute('data-detail-row-holder-for', tableId);
        detailRow.parentElement.setAttribute('data-detail-row-index', detailRow.rowIndex);
        let detailCell = detailRow.firstElementChild;
        detailCell.setAttribute('colspan','100') ;
        let tbody = currentRow.parentElement;
        if(currentRow.nextElementSibling != detailRow) {
			tbody.insertBefore(detailRow, currentRow.nextElementSibling);
		}
      }
    }
  }
  if(!tableIDs[id]){
    tableIDs[id] = true;
  }
  //If inside dialog, resize the dialog
  if(tableBody && tableBody.closest('.modal')){
	  let modal = tableBody.closest('.modal');
	  setDialogLeftTop(modal,false,false);
  }
}

function addLightningUserActivityEvent() {
	addListener(window.document, "mousemove", function(){
		window.parent.document.body.dispatchEvent( new CustomEvent("tpae-activity", { detail: {type:"mousemove"}}));
	}, true );
}

function hideOrShowNameInput(el)
{
	var iframe = document.querySelector('#upload_iframe');
	//body: iframe.parentElement.parentElement.parentElement.parentElement;
	var body = iframe.closest('tbody');
	var mptext = body.querySelector('tr.multiparttext');
	mptext.hidden=el.files.length>1;
	if (getNextSibling(mptext)) {
	  getNextSibling(mptext).hidden = el.files.length > 1;
  }
}

function systemDialogShowing(){
	return document.getElementById('systemdialog') !== null;
}
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } 
    while (el !== null && el.nodeType === 1);
    return null;
  };
}

Math.trunc = Math.trunc || function(x) {
  if (isNaN(x)) {
    return NaN;
  }
  if (x > 0) {
    return Math.floor(x);
  }
  return Math.ceil(x);
};

if (!String.prototype.includes) {
	String.prototype.includes = function(search, start) {
		if (typeof start !== 'number') {
			start = 0;
		}
		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}

/**
 * Handles the MAS menu item click events.
 */
function handleMASMenuItem(args) {
	args = args[0] ? args[0] : args;
	if(args.event==='loadlink'){
		if(args.link){
			openURL(args.link);
		} else {
			console.warn('WARNING: Only links are supported on help menu items.')
		}	
	} else {
		console.warn('WARNING: Only loadlink event menu items are supported in the MAS help menu.')
	}
}

function applinkReturnNoValue(pageIndex, url){
  //normal applink within
  if(APP_STACK_SIZE > 1){
    sendEvent('returnnovalue',APPTARGET,'');
  }
  else {
    setTimeout(()=>{ // allow for submithiddendelay
      window.postMessage({'close-tpae-iframe':{pageIndex: pageIndex, url:url}}, '*');
    }, 300);
  }
}

function postServerMessage(message){ //should be name:value
	let messageObject = JSON.parse(message);
	if(!messageObject.name){
		console.error("Invalid post message "+ messageObject);
		return;
	}
	if(messageObject['internal']){
		window.postMessage({[messageObject.name]: [messageObject['value']]}, '*');
	}
	else {
		window.parent.postMessage({[EMBEDDED_MESSAGE_PREFIX+messageObject.name]: [messageObject['value']]}, '*');		
	}
}

// Executed only when testing environment is up and running
try {
	if (process.env.NODE_ENV === 'test') {
		module.exports = {_maximo_logout, showLoginPage, getElement, submitHidden, getHiddenForm, createXMLDoc};
		var {KEYCODE_UP_ARROW, KEYCODE_DOWN_ARROW, KEYCODE_LEFT_ARROW, KEYCODE_RIGHT_ARROW, KEYCODE_Z} = require("constants.js");
	}
} catch (e) {
    // do nothing
}
