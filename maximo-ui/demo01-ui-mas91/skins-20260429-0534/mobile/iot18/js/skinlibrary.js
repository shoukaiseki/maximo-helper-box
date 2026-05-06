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

/* override method for this skin */
function getDialogConstraints() { 
	return {"minheight":200,"minwidth":300,"h":20,"v":130};
}

function finishPortlet(id) {
	dojo.style(dojo.byId("load_"+id), {"display":"none"});
	if(!SCREENREADER) {
		dojo.query(".hbouter").forEach(
				function(header) {
					dojo.query("img", header).forEach(
						function(img) {
							if(img.src.indexOf("portlet")>=0) {
								dojo.style(img,{"visibility":"hidden"});
								dojo.connect(header, "onmouseover", header, function(){dojo.style(dojo.byId(img.id),{"visibility":"visible"})});
								dojo.connect(header, "onmouseout", header, function(){dojo.style(dojo.byId(img.id),{"visibility":"hidden"})});
							}
						}
					);
				}
		);
	}
	dojo.query("rect", dojo.byId("portletbox_"+id)).forEach(
		    function(node) {
		        if(node.getAttribute("stroke-opacity")=="0") {
		            node.setAttribute("fill-opacity","0");
		        }
		        else {
		            node.className = "dimension";
		        }
		    }
		);
		
	if (typeof processLoadMethods === 'function') {	
		processLoadMethods();
	}		
}

function messageShowEffect(message,innerElement) {
	adjustMessageLocation(message);
	dojo.style(message,{"top":-message.offsetHeight});
	message.style.left = innerElement.style.left;
	innerElement.style.left="";
	message.style.visibility="visible";
	var image = dojo.byId(innerElement.id+"_image");
	if(image && image.style.visibility=="hidden") {
		var src= image.src;
		if(src.indexOf('information')>=0){
			src = "confirm_iot18.png";
		}
		else {
			src = src.substring(0,src.indexOf('.')) + "_iot18.png";
		}
		image.src = src;
		image.style.visibility="visible";
		image.style.width="";
	}
	var lft=(document.body.clientWidth/2)-(message.clientWidth/2);
	message.style.left=lft + "px";
	slideElement(message,getLeftPosition(message),0);
}

function messageHideEffect(message) {
	slideElement(message,getLeftPosition(message),-(message.offsetHeight));
	return true;
}


function slideElement(element, posX, posY){
	dojo.fx.slideTo({
		node: element,
		left: posX, 
		top: posY,
		unit: 'px'
	}).play();
}

function forceElementToLoc(id, left, top) {
	var element = dojo.byId(id);
	if(element) {
		element.style.left=left+"px";
		element.style.top=top+"px";
	}
}

function adjustMessageLocation(message) {
	if(message.parentNode!=document.body) {
		document.body.appendChild(message);
	}
}
