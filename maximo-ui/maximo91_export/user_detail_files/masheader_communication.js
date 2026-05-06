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

(() => {
  const ShellCommunicator = window.MaximoShellCommunicator.get();
  ShellCommunicator.configure(
    // parent frame
    window.top,
    // our frame
    document.window
  );
  ShellCommunicator.on("mas-shell-userLogout", () => {
    //prevent default (leave site) dialog from appearing when logging out
    warnExit = false;
  });

  ShellCommunicator.on("mas-shell-sendEvent", (e) => {
    sendEvent(e.type, e.targetid || APPID, e.value);
  });
  ShellCommunicator.on("mas-shell-callFunction", (e) => {
    if (window[e.functionName]) {
      window[e.functionName].call(window, [ ...e.args]);
    }
  });
  ShellCommunicator.on('mas-shell-setIdleConfig', (e) => {
    const data = {};
    data.idleTimeoutData = {};
    data.routes = {};
    if(e){
      if (!e.domain) { //ensure we have a domain before returning data
        window.setTimeout(() => {
          ShellCommunicator.emit('mas-shell-getIdleConfig');
        }, 500);
        return;
      }

      data.idleTimeoutData.timeout = e.timeout;
      data.idleTimeoutData.countdown = e.countdown;
      data.idleTimeoutData.cookieName = e.cookieName;
      data.routes.domain = e.domain;
      const IdleTimer = window.MaximoIdleTimer;
      const timer = new IdleTimer({
        timeout: data.idleTimeoutData.timeout,
        countdown: data.idleTimeoutData.countdown,
        cookieName: data.idleTimeoutData.cookieName,
        cookieDomain: data.routes.domain,
        onIdleTimeoutWarning: (countdown) => {
        // Use this callback to show the log out confirmation dialog
        // This callback is fired every second after timeout is reached, until countdown reaches 0 (use the countdown in the confirmation dialog)
        },
        onIdleTimeout: () => {
        // Use this callback to redirect to the inactivity logout end page
        warnExit = false;
        window.location.href = data.routes.logoutInactivity;
        },
        onRestart: () => {
        // Use this callback to close the log out confirmation dialog
        },
      });	
    }
  });

  const appConfig = {
    productName: "Maximo Application Suite",
    title: "Manage",
    headerActions: [],
    profileActions:[],
    helpActions:[],
    sideNav:{
      clickAction: "callFunction",
      clickArgs: { 
        functionName: "toggleSideNav",
        args: [""]
      }
    },
    skipTo:{
      clickAction: "callFunction",
      clickArgs: { 
        functionName: "focusItemNow",
        args: ["main_content"]
      }
    },
  };
  window.changeMasHeader = (args) => {
    Object.keys(args).map((key)=>{
      appConfig[key] = args[key];
    })
    ShellCommunicator.emit("mas-shell-changeHeader", args);
  };
  window.getMasHeaderConfig=()=>{
    ShellCommunicator.emit('mas-shell-getIdleConfig');
    return JSON.parse(JSON.stringify(appConfig))
  }

  window.addMasHeaderItem = (path, item, index) => {
    let headerConfig = window.getMasHeaderConfig();
    if(headerConfig){
      if(window.masHeaderHasItem(path, item.id)){
        console.log(`Item with id ${item.id} already added to ${path}`);
        return;
      }
      let pathElement = headerConfig[path];
      if(pathElement){
        if(index === undefined){
          pathElement.push(item);
        }
        else {
          pathElement.splice(index, 0, item);
        }
      }
    }
    return headerConfig;
  }

  window.masHeaderHasItem=(path, itemId)=>{
    let headerConfig = window.getMasHeaderConfig();
    if(headerConfig){
      let pathElement = headerConfig[path];
      if(pathElement){
        return pathElement.filter((item)=>{
          return item.id === itemId;
        }).length>0;
      }
    }
    return false;
  }

  window.masSessionTimeout = () => {
    ShellCommunicator.emit("mas-shell-session-timeout");
    console.warn('Manage session logout.');
  };

  //Updated shell with current query params.
  window.addEventListener('load',()=>{
    let query = Object.fromEntries(new URLSearchParams(location.search));
    if(!query['designmode']){
      //type is not part of maximo queries
      delete query['type'];
      delete query['uisessionid'];
      delete query['targetid'];
      ShellCommunicator.emit('shell-update-url-params',query)
    }
  } , false);
  
  // Event to fetch user-defined CSS
  ShellCommunicator.emit("mas-shell-fetch-css-override");
  // Override the application CSS with user-defined CSS
  ShellCommunicator.on('mas-shell-apply-css-override', async (userDefinedCSS) => {
    if(userDefinedCSS) {
      let headElement = document.getElementsByTagName('head')[0];
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = userDefinedCSS;
      headElement.appendChild(link);
    }
  });

  window.addEventListener('keydown',(event)=>{
    ShellCommunicator.emit('mas-shell-accesskey', {
      key: event.key,
      code: event.code,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
    });
  });
  
  window.manageClassicAppHasChanges = async () => {
    let appInfo = await window.queueManager?.appInfo();
    let saveneeded = appInfo?.saveneeded;
    if (saveneeded) {
      return saveneeded;
    }
    return false;
  }

  // Event to check if a Manage app has unsaved changes
  ShellCommunicator.on('manage-classic-has-changes-request', async () => {
    const hasChanges = await window.manageClassicAppHasChanges();
    ShellCommunicator.emit('manage-classic-has-changes-response', {hasChanges});
  });
  
  // Event to discard changes in a Manage app
  ShellCommunicator.on('manage-classic-discard-request', async () => {
    sendEvent("discardchangesbeforenav");
    const discarded = !(await window.manageClassicAppHasChanges());
    ShellCommunicator.emit('manage-classic-discard-response', {discarded});
  });
  
  // Event to save changes in a Manage app
  ShellCommunicator.on('manage-classic-save-request', async () => {
    sendEvent("savechangesbeforenav");
    const saved = !(await window.manageClassicAppHasChanges());
    ShellCommunicator.emit('manage-classic-save-response', {saved});
  });

})();
