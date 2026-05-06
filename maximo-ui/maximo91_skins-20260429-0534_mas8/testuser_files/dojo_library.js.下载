/*
 * Licensed Materials - Property of IBM
 * "Restricted Materials of IBM"
 * 5724-U18, 5737-M66
 * (C) COPYRIGHT IBM CORP. 2009,2025 All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 *
 */

/**
 * Used to keep track of files that have already been loaded using the function
 * loadfile().
 */
document.filesloaded = "";
this.dojohelper = {};
var dh = dojohelper;
var pickerPopup;
var defaultTime;
var RICH_TEXT_MARKER = "<!-- RICH TEXT -->";

/**
 * Parses any dojo widgets contained by the specified element. If the widget was
 * already registered, it is destroyed before being parsed again.
 */
dojohelper.parseDojo = function(elementId) {
	if (dijit.byId(elementId) != undefined) {
		// if we're reloading the page, destroy the old widgets.
		dijit.byId(elementId).destroyRecursive();
	}

	dojo.parser.parse(dojo.byId(elementId).parentNode);
};


/**
 * Returns the popup id for the specified HTML element.
 */
dojohelper.getPopupId = function(node)
{
	return node.id + "_popup";
};


dojohelper.showPickerPopup = function(element) {
	// The constraints are a string that must be turned into a json object.
	var options = dojo.fromJson(element.getAttribute("constraints"));
	var button = element.tagName == "BUTTON";
	dojo.removeAttr(element, "gregorian");
	var datePackage = element.getAttribute("datePackage");
	var dateLocaleModule = dojo.getObject(datePackage ? datePackage + ".locale" : "dojo.date.locale", false);
	var dateClassObj = dojo.getObject(datePackage ? datePackage + ".Date" : "Date", false);
	var dataType = element.getAttribute("datatype"); //3 = DATE, 4 = DATETIME, 5 = TIME
	if(!dataType) {
		dataType = '';
	}
	var value;
	if (options.selector && !element.value)
	{
		value = undefined;
		currentFocus = new dateClassObj();
	}
	else
	{
		value = new dateClassObj(parseInt(element.getAttribute("dojovalue")));
		if (options.timePattern) {
			if ((element.classList.contains("tablefilterfield") || element.classList.contains("queryField")) && element.value == "") {
				value = new Date();
				var strValue = value.toString();
				value = new Date(strValue.substr(0,strValue.indexOf(value.toTimeString())));
			}
			else if(dataType.includes("5") && !element.classList.contains("tablefilterfield")){
		
		        var dojovalue;
		        var minutes;
		        var timeString;
		        var today = new Date();
        
			//Turn dojovalue into hours (from milliseconds)
				dojovalue = (parseInt(element.getAttribute("dojovalue"))) / 60 / 1000 / 60;
			//If the time selected is 4:45 A.M. dojovalue will return 4.75. Time selected 4:00 A.M dojovalue returns 4. Time selected 4:30 P.M dojovalue returns 16.5
			//new dateClassObj(parseInt(element.getAttribute("dojovalue"))).getMinutes() is typically but not always accurate as there is some time zone adjustment being done within dateClassObj which affects the time returned
				timeString = dojovalue.toLocaleString().split('');

			//Check if dojovalue has minutes
				if(timeString.includes('.')){
				//If dojovalue hours is single digit value
					if(timeString[1] == "."){
					//If dojovalue minutes is double digit value		
						if(!isNaN(timeString[3])){
					//With dojovalue as 4.75, convert ".75" and multiply by 60 to get 45(minutes)			
						minutes = parseFloat(timeString[1] + timeString[2] + timeString[3]) * 60;
						}
						else{
						minutes = parseFloat(timeString[1] + timeString[2]) * 60;
						}
					}
				//If dojovalue hours is double digit value		
					else if(timeString[2] == "."){
						if(!isNaN(timeString[4])){
						minutes = parseFloat(timeString[2] + timeString[3] + timeString[4]) * 60;
						}
						else{
						minutes = parseFloat(timeString[2] + timeString[3]) * 60;
						}
					}
      			}
				else{
					minutes = 0;
				}
        //No time zone adjustment is necessary since we are using today's date with dateClassObj (comes from machine TZ. Accounts for DST)
				value = new dateClassObj(today.getFullYear(), today.getMonth(), today.getDate(), dojovalue, minutes);
			}
	}
		//Exclude date only calendar from tzAdjustment; limit adjustment to dateTime and filterfield			
			if ((dataType.includes("4") || (element.classList.contains("tablefilterfield")) && !dataType.includes("3") && element.value != "")) {
				value = new dateClassObj(parseInt(element.getAttribute("dojovalue")) + tzAdjustment);
			}
		currentFocus = value;
	}

	var picker = dijit.byId(dh.getPopupId(element));
	if(!picker) {
		var pickerClass = dojo.getObject(element.getAttribute("PopupType"), false);
		picker = new pickerClass({
			id: dh.getPopupId(element),
			lang: element.lang,
			lng: element.lng,
			dir: document.body.dir,
			constraints: options,
			value: value,
			maxHeight: '150',
			currentFocus: currentFocus,
			datePackage: element.getAttribute("datePackage"),
			_close: function () {
				dijit.popup.close(picker);
				picker.destroy();
				delete picker;
			},
			onChange: function (value){
				var options = dojo.fromJson(element.getAttribute("constraints"));
				if(element.readOnly){
					element.focus();
					dojohelper.closePickerPopup();
					var msg = tpaeConfig.readOnlyMsg;//
					if(options.label){
						msg = msg.replace('{0}', options.label);
					}
					else {
						msg = msg.replace('{0} ','');
					}
					
					showCustomPopup({
						focus: true, 
						systemdialog: true,
						content: "<p style=\"width:350px; margin:5px 0px 5px 0px\">" + msg + "</p>", 
						icon: "st_MessageCritical.png", 
						closeX: false,
						buttons: [{
					        	  id: "ro_button1",
					        	  text: 'Ok',
					        	  event: "processYesNoCancelButton(this, event, 1);"
					    }]
					});
					return;
				}
				var dateStr = "";
				var timeStr = "";
				var newValue= "";
				var dNodeValue;
				
				// Started with no date/time and the default was chosen and default is today.
				var defaultDate = new Date(defaultTime).setHours(0,0,0,0);
				var sysDate = new Date(systemDate).setHours(0,0,0,0);
				var pickedTime = Math.floor(value.valueOf() / 1000) * 1000;  // truncate to seconds
				var ptime = new Date(pickedTime);
				if (!element.value && (pickedTime == defaultTime && !(ptime.getHours() == 0 && ptime.getMinutes() == 0 && ptime.getSeconds() == 0)) && (defaultDate == sysDate))
				{
					var adjustment = 0;
					if (clientTimer)
					{
						adjustment = new Date().getTime() - clientDate;
					}
					var adjustedDate = new Date(systemDate + adjustment);
					value.setHours(adjustedDate.getHours(), adjustedDate.getMinutes(), adjustedDate.getSeconds());
				}

				dNodeValue = this.get('value');
				if(!dNodeValue || !dNodeValue.toGregorian) {
					dNodeValue = null;
				}
				else {
					dNodeValue = dNodeValue.toGregorian();
				}
				if(!undef(options.datePattern))
				{
					var dateOnlyOption = { selector: 'date', datePattern: options.datePattern, locale: options.locale};
					if(dateOnlyOption.datePattern.indexOf("yyyy") == -1)
					{
						var ind = dateOnlyOption.datePattern.indexOf("yy");
						if(ind > -1)
						{
							dateOnlyOption.datePattern = dateOnlyOption.datePattern.substr(0,ind) + "yy" + dateOnlyOption.datePattern.substr(ind)
						}
					}

					dateStr = dateLocaleModule.format(value, dateOnlyOption);
					if(dateLocaleModule && dNodeValue) {
						dojo.attr(element, {"gregorian":  dateLocaleModule.format(dNodeValue, dateOnlyOption)});
					}
					// Handle special case for es-mx short months, because some of the short month values returned from 
					// the dojo calendar widget doesn't match the short month values used for validation (from jvm).
					if (dateOnlyOption.locale == "es-mx")
					{
						if (dateStr.indexOf("febr.") > 0)
							dateStr = dateStr.replace("febr.","feb.");
						else if (dateStr.indexOf("mzo.") > 0)
							dateStr = dateStr.replace("mzo.","mar.");
						else if (dateStr.indexOf("my.") > 0)
							dateStr = dateStr.replace("my.","may.");
						else if (dateStr.indexOf("ag.") > 0)
							dateStr = dateStr.replace("ag.","ago.");
						else if (dateStr.indexOf("set.") > 0)
							dateStr = dateStr.replace("set.","sep.");
					}
					if ((dateOnlyOption.locale === "en-gb" || dateOnlyOption.locale === "en-au") && dateStr.indexOf("Sept") > 0) {
						dateStr = dateStr.replace("Sept","Sep");
					}
					newValue = dateStr;
				}
				if(!undef(options.timePattern))
				{
					var timeOnlyOption = { selector: 'time', timePattern: options.timePattern, locale: options.locale};
					timeStr = dateLocaleModule.format(value, timeOnlyOption);
					if(dateLocaleModule && dNodeValue) {
						dojo.attr(element, {"gregorian":  dateLocaleModule.format(dNodeValue, timeOnlyOption)});
					}
					// Fix bug where spaces in AM or PM don't validate against the format used for jvm validation
					timeStr = timeStr.replace(/a\.\sm\./g,"a.m.");
					timeStr = timeStr.replace(/A\.\sM\./g,"A.M.");
					timeStr = timeStr.replace(/p\.\sm\./g,"p.m.");
					timeStr = timeStr.replace(/P\.\sM\./g,"P.M.");
					
					newValue = timeStr;
				}
				if((!undef(options.datePattern))&&(!undef(options.timePattern)))
				{
					newValue = dateStr +" "+ timeStr;
					if(dateLocaleModule && dNodeValue) {
						dojo.attr(element, {"gregorian":  dateLocaleModule.format(dNodeValue, dateOnlyOption) +" "+ timeStr});
					}
				}
				if(element.tagName != "BUTTON")
				{
					element.valueSelected = true;
					element.focus();
					if (newValue != element.value)
					{
						element.setAttribute("prekeyvalue", element.value);
						element.value = newValue;
						element.setAttribute("dojovalue", value.valueOf() - tzAdjustment);
						if(document.createEvent)
						{
							// explicitly create and dispatch a change event as it doesn't get triggered when the 
							// value is programmatically set.				
							// First build the fake event.
							var changeEvent = document.createEvent("HTMLEvents");
							changeEvent.initEvent('change', /*bubbles up*/true, /*cancelable*/true);
							// Now dispatch the event
							element.dispatchEvent(changeEvent);
						}
						else
						{
							element.fireEvent('onchange');
						}
						sendEvent("setvalue", element.id, newValue);
					}
				}
				if(button)
				{
					sendEvent(element.getAttribute("selectevent"), element.id, value.valueOf());
				}
				element.focus();
				dojohelper.closePickerPopup();
			}
		});
		if(picker.monthWidget != null)
		{//datetime picker does not have a month widget
			dojo.connect(picker.monthWidget.dropDown, "onClick", function(evt){
				evt.stopPropagation();
			});
		}
		if(options.datePattern){
        	require(["dojo/_base/event"], function(event){
        		dojo.connect(picker, "onClick", function(e){
	        		event.stop(e);
	        	});
	        });
		}
		else {
			require(["dojo/_base/event"], function(event){
        		dojo.connect(picker.domNode, "click", function(e){
	        		event.stop(e);
	        	});
	        });
		}
	}
	else
	{
		picker.onChange = new function() {};
		picker.set("value", value);
		picker.set("currentFocus", currentFocus);
	}
	aroundNode=element;
	if(!button && element.tagName!="INPUT") {
		aroundNode=element.parentNode.parentNode;
	}
	let rtl = dojo.attr(document.body,"dir")=="rtl";
	dijit.popup.open({ 
		popup: picker, 
		orient: (rtl?{ 'BR': 'TR', 'TR': 'BR' }:{ 'BL': 'TL', 'TL': 'BL' }),
		around: aroundNode
	});
	pickerPopup=picker;
	let scroller = document.getElementById('SystemNavAppContent-sc_div');
	let pickerNode = pickerPopup.domNode.parentNode;
	if(pickerNode.getBoundingClientRect()[rtl?'left':'right'] > window.innerWidth){
		dijit.popup.open({ 
			popup: picker, 
			orient: (rtl?{ 'BL': 'TL', 'TL': 'BL'}:{'BR': 'TR', 'TR': 'BR'}),
			around: aroundNode
		});
	}	
	document.querySelector('.dijitCalendarSelectedDate') ? document.querySelector('.dijitCalendarSelectedDate').focus() : null;
	/* During refresh, fields are removed. Therefore, we must refresh the internal node used for the popup prior to any repositioning */
	require(['dojo/aspect', 'dojo/dom'], function(aspect, dom){
		aspect.before(dijit.popup, '_repositionAll', function(){
			var fANode = dijit.popup._firstAroundNode;
			if(fANode){ //only do it if there is a node
				dijit.popup._firstAroundNode = dom.byId(fANode.id)
			}
		});
	});

	if (picker.tNode)
	{
		var pickerDate = picker.tNode.get('value');
		defaultTime = Math.floor(pickerDate.valueOf() / 1000) * 1000;  // truncate to seconds
		var hour = pickerDate.getHours();
		var minute = pickerDate.getMinutes();
		var timeMenu = picker.timeNode.childNodes;
		var menuIndex = Math.floor(timeMenu.length * ((hour + (minute / 60)) / 24));
		picker.timeNode.scrollTop = timeMenu[menuIndex].offsetTop;
	}
	else
	{
		defaultTime = null;
	}
};

dojohelper.closePickerPopup = function() {
	if(pickerPopup==null)
		return;
	var picker = dojo.byId(pickerPopup);
	if(!picker)
		return;
	dijit.popup.close();
	picker.destroy();
	pickerPopup=null;
	delete picker;
};

/**
 * Delegates to input_changed_value.
 */
dojohelper.input_changed = function(event) {
	dojohelper.input_changed_value(this.domNode, arguments[0]);
};

dojohelper.widget_input_changed = function (event) {
	if (!working && !this.readOnly) {
		var hiddenForm = getHiddenForm();
		var inputs = hiddenForm.elements;
		var value = this.attr("value");
		
		if ((this.declaredClass == "dijit.form.TimeTextBox") || (this.declaredClass == "dijit.form.DateTextBox") || (this.declaredClass == "ibm.tivoli.mbs.dijit.form.DateTimeTextBox")) {
			var dateValue = new Date(this.attr("value").valueOf());
			var constraints = this.attr("constraints");
			constraints.locale = USERLOCALE;
			value = dojo.date.locale.format(dateValue, constraints);
		}

		inputs.namedItem("changedcomponentid").value = this.focusNode.id;
		inputs.namedItem("changedcomponentvalue").value = value;
		this.setAttribute("changed", "true");
	}
};

/**
 * Analagous to input_forceChanged() in library.js.  This sets the hidden changed fields so that if 
 * OK or Cancel is pressed, the clieck event sent up instead of setvalue.  And the changed value is 
 * stored in the changecomponent fields.
 */
dojohelper.input_changed_value = function(component, value) {
	// The check to see if working is true is for an issue in IE where a sendevent occurs which calls focus() on
	// on the body of the document.  This ultimately results in a call to this function which messes up the values
	// for the changed component.
	
	if (undef(component) || component.readOnly || working)
		return;
	var hiddenForm = getHiddenForm();
	var inputs = hiddenForm.elements;
	if (component.dojotype)
	{
		var widgetComponent = dijit.byId(component.id);
		
		var value =  widgetComponent.attr("value");

		if ((component.declaredClass == "dijit.form.TimeTextBox") || (component.declaredClass == "dijit.form.DateTextBox") || (component.declaredClass == "ibm.tivoli.mbs.dijit.form.DateTimeTextBox") )
		{
			var dateValue = new Date(widgetComponent.attr("value").vateOf());		
			var constraints = widgetComponent.attr("constraints");
			constraints.locale = USERLOCALE;
			value = dojo.date.locale.format(dateValue, constraints);
		}
		
		inputs.namedItem("changedcomponentid").value = component.id;
		inputs.namedItem("changedcomponentvalue").value = value;
	}
	else
	{
		inputs.namedItem("changedcomponentid").value = component.id;
		inputs.namedItem("changedcomponentvalue").value = value;
	}
	component.setAttribute("changed", true);
};

dojohelper.onBeforeActivate = function(event) {
	this._restoreSelection();
};

/**
 * Analagous to input_onfocus() in library.js. This is called when a component gets focus. 
 * If any other component has changed, it does a sendEvent to set the value on the server.
 */
dojohelper.on_focus = function(event) {
	var component = this.domNode;
	if (undef(component) || component.readOnly == true)
		return;

	var hiddenForm = getHiddenForm();
	var inputs = hiddenForm.elements;
	inputs.namedItem("currentfocus").value = component.id;
	var ccId = inputs.namedItem("changedcomponentid").value;
	var ccVal = inputs.namedItem("changedcomponentvalue").value;
	var clicked = component.getAttribute("clicked");
	if (ccId != "" && (component == null || component.id != ccId)
			&& clicked != "true") { // Something was changed
		arguments.caller = null; // running into a IE bug in stacktrace()
		sendEvent("setvalue", ccId, ccVal);
	}
};

/**
 * Called when the input for the rich text editor has changed.
 */
dojohelper.rte_input_changed = function(event) {
	var newValue = arguments[0];
	newValue = newValue.replace(RICH_TEXT_MARKER,"");
	if (!newValue.endsWith(RICH_TEXT_MARKER))
		newValue += RICH_TEXT_MARKER;
	dojohelper.input_changed_value(this.domNode, newValue);
};

dojohelper.fixPopupZIndex = function() {
	dojo.require('dijit.Dialog');
	dijit.Dialog._DialogLevelManager._beginZIndex = 100000;
	dojo.require('dijit._base.popup');
	dojo.connect(dijit.popup, 'open', function(args){
		var currentNode = args.around;
		var zindex = 100000;
		while (currentNode && (!currentNode.style || !currentNode.style.zIndex))
		{
			currentNode = currentNode.parentNode;
		}
		if(currentNode) {
			zindex += Number(currentNode.style.zIndex);
		}
		args.popup.domNode.parentNode.style.zIndex = zindex;
	});
	dojo.require('dijit.Tooltip');
	dijit.hideTooltip(); //Make sure dijit._masterTT is valid, would be better if we could connect to constructor
	dojo.connect(dijit._masterTT, 'show', function(innerHTML, aroundNode, position) {
		var currentNode = aroundNode;
		var zindex = 100000;
		while (currentNode && (!currentNode.style || !currentNode.style.zIndex))
		{
			currentNode = currentNode.parentNode;
		}
		if(currentNode) {
			zindex += Number(currentNode.style.zIndex);
		}
		this.domNode.style.zIndex = zindex;
	});
};

/**
 * Returns true if the specified file has already been loaded.
 */
dojohelper.isFileLoaded = function(filename, context) {
	var result = false;
	if (document.filesloaded.indexOf("[" + filename + "]") != -1 && context == null) {
		result = true;
	} else if (context != null) {
		if (typeof (context.filesloaded) != "undefined"
				&& context.filesloaded.indexOf("[" + filename + "]") != -1) {
			result = true;
		}
	}
	return result;
};

/**
 * Loads the specified file linked to by the fileUrl.  Two file types are supported, either "js" or "css".
 * If necessary, a context may be specified which will be used with the function indirectEval to provide a scope
 * when evaluating javascript.  The implementation of the indirectEval function should simply call eval(contents).
 *
 * If a specified file has already been loaded, it will not be loaded again.
 */
dojohelper.loadfile = function(fileUrl, filetype, context, indirectEval) {
	if (!dh.isFileLoaded(fileUrl, context)) {
		if (filetype == "js") {
			var contents = dh.getText(fileUrl);
			if (!contents) {
				return;
			}

			contents = "(function(){ " + contents + "})()";
			if (context != null) {
				indirectEval.call(context, contents);
				context.filesloaded += "[" + fileUrl + "]\n";
			} else {
				eval(contents);
				document.filesloaded += "[" + fileUrl + "]\n";
			}
			
		} else if (filetype == "css") {
			var fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", fileUrl);

			document.getElementsByTagName("head")[0].appendChild(fileref);
			document.filesloaded += "[" + fileUrl + "]\n";
		}
	}
};

dojohelper.getXhrObj = function() {
	var xhrObj = null;
	try {
		xhrObj = new XMLHttpRequest();
	} catch (trymicrosoft) {
		try {
			xhrObj = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (othermicrosoft) {
			try {
				xhrObj = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (failed) {
				throw new Error("XMLHTTP not available: " + failed);
			}
		}
	}
	return xhrObj;
};

dojohelper.isDocumentOk = function(http) {
	var stat = http.status || 0;
	return (stat >= 200 && stat < 300) || stat == 304 || stat == 1223;
};

dojohelper.getText = function(url) {
	var xhrObj = dh.getXhrObj();

	xhrObj.open('GET', url, false);
	xhrObj.send(null);
	if (!dh.isDocumentOk(xhrObj)) {
		var err = Error("Error loading " + url + " status: " + xhrObj.status);
		err.status = xhrObj.status;
		err.responseText = xhrObj.responseText;
		throw err;
	}
	return xhrObj.responseText;
};
