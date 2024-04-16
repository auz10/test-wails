(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let nanoid = (size2 = 21) => {
  let id = "";
  let i = size2;
  while (i--) {
    id += urlAlphabet[Math.random() * 64 | 0];
  }
  return id;
};
const runtimeURL = window.location.origin + "/wails/runtime";
const objectNames = {
  Call: 0,
  Clipboard: 1,
  Application: 2,
  Events: 3,
  ContextMenu: 4,
  Dialog: 5,
  Window: 6,
  Screens: 7,
  System: 8,
  Browser: 9
};
let clientId = nanoid();
function newRuntimeCallerWithID(object, windowName) {
  return function(method, args = null) {
    return runtimeCallWithID(object, method, windowName, args);
  };
}
function runtimeCallWithID(objectID, method, windowName, args) {
  let url = new URL(runtimeURL);
  url.searchParams.append("object", objectID);
  url.searchParams.append("method", method);
  let fetchOptions = {
    headers: {}
  };
  if (windowName) {
    fetchOptions.headers["x-wails-window-name"] = windowName;
  }
  if (args) {
    url.searchParams.append("args", JSON.stringify(args));
  }
  fetchOptions.headers["x-wails-client-id"] = clientId;
  return new Promise((resolve, reject) => {
    fetch(url, fetchOptions).then((response) => {
      if (response.ok) {
        if (response.headers.get("Content-Type") && response.headers.get("Content-Type").indexOf("application/json") !== -1) {
          return response.json();
        } else {
          return response.text();
        }
      }
      reject(Error(response.statusText));
    }).then((data) => resolve(data)).catch((error) => reject(error));
  });
}
const call$8 = newRuntimeCallerWithID(objectNames.Application, "");
const HideMethod = 0;
const ShowMethod = 1;
const QuitMethod = 2;
function Hide$1() {
  return call$8(HideMethod);
}
function Show$1() {
  return call$8(ShowMethod);
}
function Quit() {
  return call$8(QuitMethod);
}
const Application = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hide: Hide$1,
  Quit,
  Show: Show$1
}, Symbol.toStringTag, { value: "Module" }));
const call$7 = newRuntimeCallerWithID(objectNames.Browser, "");
const BrowserOpenURL = 0;
function OpenURL(url) {
  return call$7(BrowserOpenURL, { url });
}
const Browser = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  OpenURL
}, Symbol.toStringTag, { value: "Module" }));
const call$6 = newRuntimeCallerWithID(objectNames.Clipboard, "");
const ClipboardSetText = 0;
const ClipboardText = 1;
function SetText(text) {
  return call$6(ClipboardSetText, { text });
}
function Text() {
  return call$6(ClipboardText);
}
const Clipboard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SetText,
  Text
}, Symbol.toStringTag, { value: "Module" }));
let call$5 = newRuntimeCallerWithID(objectNames.System, "");
const systemIsDarkMode = 0;
const environment = 1;
function invoke(msg) {
  if (window.chrome) {
    return window.chrome.webview.postMessage(msg);
  }
  return window.webkit.messageHandlers.external.postMessage(msg);
}
function IsDarkMode() {
  return call$5(systemIsDarkMode);
}
function Capabilities() {
  let response = fetch("/wails/capabilities");
  return response.json();
}
function Environment() {
  return call$5(environment);
}
function IsWindows() {
  return window._wails.environment.OS === "windows";
}
function IsLinux() {
  return window._wails.environment.OS === "linux";
}
function IsMac() {
  return window._wails.environment.OS === "darwin";
}
function IsAMD64() {
  return window._wails.environment.Arch === "amd64";
}
function IsARM() {
  return window._wails.environment.Arch === "arm";
}
function IsARM64() {
  return window._wails.environment.Arch === "arm64";
}
function IsDebug() {
  return window._wails.environment.Debug === true;
}
const System = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Capabilities,
  Environment,
  IsAMD64,
  IsARM,
  IsARM64,
  IsDarkMode,
  IsDebug,
  IsLinux,
  IsMac,
  IsWindows,
  invoke
}, Symbol.toStringTag, { value: "Module" }));
window.addEventListener("contextmenu", contextMenuHandler);
const call$4 = newRuntimeCallerWithID(objectNames.ContextMenu, "");
const ContextMenuOpen = 0;
function openContextMenu(id, x, y, data) {
  void call$4(ContextMenuOpen, { id, x, y, data });
}
function contextMenuHandler(event) {
  let element = event.target;
  let customContextMenu = window.getComputedStyle(element).getPropertyValue("--custom-contextmenu");
  customContextMenu = customContextMenu ? customContextMenu.trim() : "";
  if (customContextMenu) {
    event.preventDefault();
    let customContextMenuData = window.getComputedStyle(element).getPropertyValue("--custom-contextmenu-data");
    openContextMenu(customContextMenu, event.clientX, event.clientY, customContextMenuData);
    return;
  }
  processDefaultContextMenu(event);
}
function processDefaultContextMenu(event) {
  if (IsDebug()) {
    return;
  }
  const element = event.target;
  const computedStyle = window.getComputedStyle(element);
  const defaultContextMenuAction = computedStyle.getPropertyValue("--default-contextmenu").trim();
  switch (defaultContextMenuAction) {
    case "show":
      return;
    case "hide":
      event.preventDefault();
      return;
    default:
      if (element.isContentEditable) {
        return;
      }
      const selection = window.getSelection();
      const hasSelection = selection.toString().length > 0;
      if (hasSelection) {
        for (let i = 0; i < selection.rangeCount; i++) {
          const range = selection.getRangeAt(i);
          const rects = range.getClientRects();
          for (let j = 0; j < rects.length; j++) {
            const rect = rects[j];
            if (document.elementFromPoint(rect.left, rect.top) === element) {
              return;
            }
          }
        }
      }
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        if (hasSelection || !element.readOnly && !element.disabled) {
          return;
        }
      }
      event.preventDefault();
  }
}
function GetFlag(keyString) {
  try {
    return window._wails.flags[keyString];
  } catch (e) {
    throw new Error("Unable to retrieve flag '" + keyString + "': " + e);
  }
}
const Flags = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GetFlag
}, Symbol.toStringTag, { value: "Module" }));
const call$3 = newRuntimeCallerWithID(objectNames.Screens, "");
const getAll = 0;
const getPrimary = 1;
const getCurrent = 2;
function GetAll() {
  return call$3(getAll);
}
function GetPrimary() {
  return call$3(getPrimary);
}
function GetCurrent() {
  return call$3(getCurrent);
}
const Screens = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GetAll,
  GetCurrent,
  GetPrimary
}, Symbol.toStringTag, { value: "Module" }));
const center = 0;
const setTitle = 1;
const fullscreen = 2;
const unFullscreen = 3;
const setSize = 4;
const size = 5;
const setMaxSize = 6;
const setMinSize = 7;
const setAlwaysOnTop = 8;
const setRelativePosition = 9;
const relativePosition = 10;
const screen = 11;
const hide = 12;
const maximise = 13;
const unMaximise = 14;
const toggleMaximise = 15;
const minimise = 16;
const unMinimise = 17;
const restore = 18;
const show = 19;
const close = 20;
const setBackgroundColour = 21;
const setResizable$1 = 22;
const width = 23;
const height = 24;
const zoomIn = 25;
const zoomOut = 26;
const zoomReset = 27;
const getZoomLevel = 28;
const setZoomLevel = 29;
const thisWindow = Get("");
function createWindow(call2) {
  return {
    Get: (windowName) => createWindow(newRuntimeCallerWithID(objectNames.Window, windowName)),
    Center: () => call2(center),
    SetTitle: (title) => call2(setTitle, { title }),
    Fullscreen: () => call2(fullscreen),
    UnFullscreen: () => call2(unFullscreen),
    SetSize: (width2, height2) => call2(setSize, { width: width2, height: height2 }),
    Size: () => call2(size),
    SetMaxSize: (width2, height2) => call2(setMaxSize, { width: width2, height: height2 }),
    SetMinSize: (width2, height2) => call2(setMinSize, { width: width2, height: height2 }),
    SetAlwaysOnTop: (onTop) => call2(setAlwaysOnTop, { alwaysOnTop: onTop }),
    SetRelativePosition: (x, y) => call2(setRelativePosition, { x, y }),
    RelativePosition: () => call2(relativePosition),
    Screen: () => call2(screen),
    Hide: () => call2(hide),
    Maximise: () => call2(maximise),
    UnMaximise: () => call2(unMaximise),
    ToggleMaximise: () => call2(toggleMaximise),
    Minimise: () => call2(minimise),
    UnMinimise: () => call2(unMinimise),
    Restore: () => call2(restore),
    Show: () => call2(show),
    Close: () => call2(close),
    SetBackgroundColour: (r, g, b, a) => call2(setBackgroundColour, { r, g, b, a }),
    SetResizable: (resizable2) => call2(setResizable$1, { resizable: resizable2 }),
    Width: () => call2(width),
    Height: () => call2(height),
    ZoomIn: () => call2(zoomIn),
    ZoomOut: () => call2(zoomOut),
    ZoomReset: () => call2(zoomReset),
    GetZoomLevel: () => call2(getZoomLevel),
    SetZoomLevel: (zoomLevel) => call2(setZoomLevel, { zoomLevel })
  };
}
function Get(windowName) {
  return createWindow(newRuntimeCallerWithID(objectNames.Window, windowName));
}
function Center() {
  thisWindow.Center();
}
function SetTitle(title) {
  thisWindow.SetTitle(title);
}
function Fullscreen() {
  thisWindow.Fullscreen();
}
function SetSize(width2, height2) {
  thisWindow.SetSize(width2, height2);
}
function Size() {
  return thisWindow.Size();
}
function SetMaxSize(width2, height2) {
  thisWindow.SetMaxSize(width2, height2);
}
function SetMinSize(width2, height2) {
  thisWindow.SetMinSize(width2, height2);
}
function SetAlwaysOnTop(onTop) {
  thisWindow.SetAlwaysOnTop(onTop);
}
function SetRelativePosition(x, y) {
  thisWindow.SetRelativePosition(x, y);
}
function RelativePosition() {
  return thisWindow.RelativePosition();
}
function Screen() {
  return thisWindow.Screen();
}
function Hide() {
  thisWindow.Hide();
}
function Maximise() {
  thisWindow.Maximise();
}
function UnMaximise() {
  thisWindow.UnMaximise();
}
function ToggleMaximise() {
  thisWindow.ToggleMaximise();
}
function Minimise() {
  thisWindow.Minimise();
}
function UnMinimise() {
  thisWindow.UnMinimise();
}
function Restore() {
  thisWindow.Restore();
}
function Show() {
  thisWindow.Show();
}
function Close() {
  thisWindow.Close();
}
function SetBackgroundColour(r, g, b, a) {
  thisWindow.SetBackgroundColour(r, g, b, a);
}
function SetResizable(resizable2) {
  thisWindow.SetResizable(resizable2);
}
function Width() {
  return thisWindow.Width();
}
function Height() {
  return thisWindow.Height();
}
function ZoomIn() {
  thisWindow.ZoomIn();
}
function ZoomOut() {
  thisWindow.ZoomOut();
}
function ZoomReset() {
  thisWindow.ZoomReset();
}
function GetZoomLevel() {
  return thisWindow.GetZoomLevel();
}
function SetZoomLevel(zoomLevel) {
  thisWindow.SetZoomLevel(zoomLevel);
}
const Window = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Center,
  Close,
  Fullscreen,
  Get,
  GetZoomLevel,
  Height,
  Hide,
  Maximise,
  Minimise,
  RelativePosition,
  Restore,
  Screen,
  SetAlwaysOnTop,
  SetBackgroundColour,
  SetMaxSize,
  SetMinSize,
  SetRelativePosition,
  SetResizable,
  SetSize,
  SetTitle,
  SetZoomLevel,
  Show,
  Size,
  ToggleMaximise,
  UnMaximise,
  UnMinimise,
  Width,
  ZoomIn,
  ZoomOut,
  ZoomReset
}, Symbol.toStringTag, { value: "Module" }));
const EventTypes = {
  Windows: {
    SystemThemeChanged: "windows:SystemThemeChanged",
    APMPowerStatusChange: "windows:APMPowerStatusChange",
    APMSuspend: "windows:APMSuspend",
    APMResumeAutomatic: "windows:APMResumeAutomatic",
    APMResumeSuspend: "windows:APMResumeSuspend",
    APMPowerSettingChange: "windows:APMPowerSettingChange",
    ApplicationStarted: "windows:ApplicationStarted",
    WebViewNavigationCompleted: "windows:WebViewNavigationCompleted",
    WindowInactive: "windows:WindowInactive",
    WindowActive: "windows:WindowActive",
    WindowClickActive: "windows:WindowClickActive",
    WindowMaximise: "windows:WindowMaximise",
    WindowUnMaximise: "windows:WindowUnMaximise",
    WindowFullscreen: "windows:WindowFullscreen",
    WindowUnFullscreen: "windows:WindowUnFullscreen",
    WindowRestore: "windows:WindowRestore",
    WindowMinimise: "windows:WindowMinimise",
    WindowUnMinimise: "windows:WindowUnMinimise",
    WindowClose: "windows:WindowClose",
    WindowSetFocus: "windows:WindowSetFocus",
    WindowKillFocus: "windows:WindowKillFocus",
    WindowDragDrop: "windows:WindowDragDrop",
    WindowDragEnter: "windows:WindowDragEnter",
    WindowDragLeave: "windows:WindowDragLeave",
    WindowDragOver: "windows:WindowDragOver"
  },
  Mac: {
    ApplicationDidBecomeActive: "mac:ApplicationDidBecomeActive",
    ApplicationDidChangeBackingProperties: "mac:ApplicationDidChangeBackingProperties",
    ApplicationDidChangeEffectiveAppearance: "mac:ApplicationDidChangeEffectiveAppearance",
    ApplicationDidChangeIcon: "mac:ApplicationDidChangeIcon",
    ApplicationDidChangeOcclusionState: "mac:ApplicationDidChangeOcclusionState",
    ApplicationDidChangeScreenParameters: "mac:ApplicationDidChangeScreenParameters",
    ApplicationDidChangeStatusBarFrame: "mac:ApplicationDidChangeStatusBarFrame",
    ApplicationDidChangeStatusBarOrientation: "mac:ApplicationDidChangeStatusBarOrientation",
    ApplicationDidFinishLaunching: "mac:ApplicationDidFinishLaunching",
    ApplicationDidHide: "mac:ApplicationDidHide",
    ApplicationDidResignActiveNotification: "mac:ApplicationDidResignActiveNotification",
    ApplicationDidUnhide: "mac:ApplicationDidUnhide",
    ApplicationDidUpdate: "mac:ApplicationDidUpdate",
    ApplicationWillBecomeActive: "mac:ApplicationWillBecomeActive",
    ApplicationWillFinishLaunching: "mac:ApplicationWillFinishLaunching",
    ApplicationWillHide: "mac:ApplicationWillHide",
    ApplicationWillResignActive: "mac:ApplicationWillResignActive",
    ApplicationWillTerminate: "mac:ApplicationWillTerminate",
    ApplicationWillUnhide: "mac:ApplicationWillUnhide",
    ApplicationWillUpdate: "mac:ApplicationWillUpdate",
    ApplicationDidChangeTheme: "mac:ApplicationDidChangeTheme!",
    ApplicationShouldHandleReopen: "mac:ApplicationShouldHandleReopen!",
    WindowDidBecomeKey: "mac:WindowDidBecomeKey",
    WindowDidBecomeMain: "mac:WindowDidBecomeMain",
    WindowDidBeginSheet: "mac:WindowDidBeginSheet",
    WindowDidChangeAlpha: "mac:WindowDidChangeAlpha",
    WindowDidChangeBackingLocation: "mac:WindowDidChangeBackingLocation",
    WindowDidChangeBackingProperties: "mac:WindowDidChangeBackingProperties",
    WindowDidChangeCollectionBehavior: "mac:WindowDidChangeCollectionBehavior",
    WindowDidChangeEffectiveAppearance: "mac:WindowDidChangeEffectiveAppearance",
    WindowDidChangeOcclusionState: "mac:WindowDidChangeOcclusionState",
    WindowDidChangeOrderingMode: "mac:WindowDidChangeOrderingMode",
    WindowDidChangeScreen: "mac:WindowDidChangeScreen",
    WindowDidChangeScreenParameters: "mac:WindowDidChangeScreenParameters",
    WindowDidChangeScreenProfile: "mac:WindowDidChangeScreenProfile",
    WindowDidChangeScreenSpace: "mac:WindowDidChangeScreenSpace",
    WindowDidChangeScreenSpaceProperties: "mac:WindowDidChangeScreenSpaceProperties",
    WindowDidChangeSharingType: "mac:WindowDidChangeSharingType",
    WindowDidChangeSpace: "mac:WindowDidChangeSpace",
    WindowDidChangeSpaceOrderingMode: "mac:WindowDidChangeSpaceOrderingMode",
    WindowDidChangeTitle: "mac:WindowDidChangeTitle",
    WindowDidChangeToolbar: "mac:WindowDidChangeToolbar",
    WindowDidChangeVisibility: "mac:WindowDidChangeVisibility",
    WindowDidDeminiaturize: "mac:WindowDidDeminiaturize",
    WindowDidEndSheet: "mac:WindowDidEndSheet",
    WindowDidEnterFullScreen: "mac:WindowDidEnterFullScreen",
    WindowDidEnterVersionBrowser: "mac:WindowDidEnterVersionBrowser",
    WindowDidExitFullScreen: "mac:WindowDidExitFullScreen",
    WindowDidExitVersionBrowser: "mac:WindowDidExitVersionBrowser",
    WindowDidExpose: "mac:WindowDidExpose",
    WindowDidFocus: "mac:WindowDidFocus",
    WindowDidMiniaturize: "mac:WindowDidMiniaturize",
    WindowDidMove: "mac:WindowDidMove",
    WindowDidOrderOffScreen: "mac:WindowDidOrderOffScreen",
    WindowDidOrderOnScreen: "mac:WindowDidOrderOnScreen",
    WindowDidResignKey: "mac:WindowDidResignKey",
    WindowDidResignMain: "mac:WindowDidResignMain",
    WindowDidResize: "mac:WindowDidResize",
    WindowDidUpdate: "mac:WindowDidUpdate",
    WindowDidUpdateAlpha: "mac:WindowDidUpdateAlpha",
    WindowDidUpdateCollectionBehavior: "mac:WindowDidUpdateCollectionBehavior",
    WindowDidUpdateCollectionProperties: "mac:WindowDidUpdateCollectionProperties",
    WindowDidUpdateShadow: "mac:WindowDidUpdateShadow",
    WindowDidUpdateTitle: "mac:WindowDidUpdateTitle",
    WindowDidUpdateToolbar: "mac:WindowDidUpdateToolbar",
    WindowDidUpdateVisibility: "mac:WindowDidUpdateVisibility",
    WindowShouldClose: "mac:WindowShouldClose!",
    WindowWillBecomeKey: "mac:WindowWillBecomeKey",
    WindowWillBecomeMain: "mac:WindowWillBecomeMain",
    WindowWillBeginSheet: "mac:WindowWillBeginSheet",
    WindowWillChangeOrderingMode: "mac:WindowWillChangeOrderingMode",
    WindowWillClose: "mac:WindowWillClose",
    WindowWillDeminiaturize: "mac:WindowWillDeminiaturize",
    WindowWillEnterFullScreen: "mac:WindowWillEnterFullScreen",
    WindowWillEnterVersionBrowser: "mac:WindowWillEnterVersionBrowser",
    WindowWillExitFullScreen: "mac:WindowWillExitFullScreen",
    WindowWillExitVersionBrowser: "mac:WindowWillExitVersionBrowser",
    WindowWillFocus: "mac:WindowWillFocus",
    WindowWillMiniaturize: "mac:WindowWillMiniaturize",
    WindowWillMove: "mac:WindowWillMove",
    WindowWillOrderOffScreen: "mac:WindowWillOrderOffScreen",
    WindowWillOrderOnScreen: "mac:WindowWillOrderOnScreen",
    WindowWillResignMain: "mac:WindowWillResignMain",
    WindowWillResize: "mac:WindowWillResize",
    WindowWillUnfocus: "mac:WindowWillUnfocus",
    WindowWillUpdate: "mac:WindowWillUpdate",
    WindowWillUpdateAlpha: "mac:WindowWillUpdateAlpha",
    WindowWillUpdateCollectionBehavior: "mac:WindowWillUpdateCollectionBehavior",
    WindowWillUpdateCollectionProperties: "mac:WindowWillUpdateCollectionProperties",
    WindowWillUpdateShadow: "mac:WindowWillUpdateShadow",
    WindowWillUpdateTitle: "mac:WindowWillUpdateTitle",
    WindowWillUpdateToolbar: "mac:WindowWillUpdateToolbar",
    WindowWillUpdateVisibility: "mac:WindowWillUpdateVisibility",
    WindowWillUseStandardFrame: "mac:WindowWillUseStandardFrame",
    MenuWillOpen: "mac:MenuWillOpen",
    MenuDidOpen: "mac:MenuDidOpen",
    MenuDidClose: "mac:MenuDidClose",
    MenuWillSendAction: "mac:MenuWillSendAction",
    MenuDidSendAction: "mac:MenuDidSendAction",
    MenuWillHighlightItem: "mac:MenuWillHighlightItem",
    MenuDidHighlightItem: "mac:MenuDidHighlightItem",
    MenuWillDisplayItem: "mac:MenuWillDisplayItem",
    MenuDidDisplayItem: "mac:MenuDidDisplayItem",
    MenuWillAddItem: "mac:MenuWillAddItem",
    MenuDidAddItem: "mac:MenuDidAddItem",
    MenuWillRemoveItem: "mac:MenuWillRemoveItem",
    MenuDidRemoveItem: "mac:MenuDidRemoveItem",
    MenuWillBeginTracking: "mac:MenuWillBeginTracking",
    MenuDidBeginTracking: "mac:MenuDidBeginTracking",
    MenuWillEndTracking: "mac:MenuWillEndTracking",
    MenuDidEndTracking: "mac:MenuDidEndTracking",
    MenuWillUpdate: "mac:MenuWillUpdate",
    MenuDidUpdate: "mac:MenuDidUpdate",
    MenuWillPopUp: "mac:MenuWillPopUp",
    MenuDidPopUp: "mac:MenuDidPopUp",
    MenuWillSendActionToItem: "mac:MenuWillSendActionToItem",
    MenuDidSendActionToItem: "mac:MenuDidSendActionToItem",
    WebViewDidStartProvisionalNavigation: "mac:WebViewDidStartProvisionalNavigation",
    WebViewDidReceiveServerRedirectForProvisionalNavigation: "mac:WebViewDidReceiveServerRedirectForProvisionalNavigation",
    WebViewDidFinishNavigation: "mac:WebViewDidFinishNavigation",
    WebViewDidCommitNavigation: "mac:WebViewDidCommitNavigation",
    WindowFileDraggingEntered: "mac:WindowFileDraggingEntered",
    WindowFileDraggingPerformed: "mac:WindowFileDraggingPerformed",
    WindowFileDraggingExited: "mac:WindowFileDraggingExited"
  },
  Linux: {
    SystemThemeChanged: "linux:SystemThemeChanged"
  },
  Common: {
    ApplicationStarted: "common:ApplicationStarted",
    WindowMaximise: "common:WindowMaximise",
    WindowUnMaximise: "common:WindowUnMaximise",
    WindowFullscreen: "common:WindowFullscreen",
    WindowUnFullscreen: "common:WindowUnFullscreen",
    WindowRestore: "common:WindowRestore",
    WindowMinimise: "common:WindowMinimise",
    WindowUnMinimise: "common:WindowUnMinimise",
    WindowClosing: "common:WindowClosing",
    WindowZoom: "common:WindowZoom",
    WindowZoomIn: "common:WindowZoomIn",
    WindowZoomOut: "common:WindowZoomOut",
    WindowZoomReset: "common:WindowZoomReset",
    WindowFocus: "common:WindowFocus",
    WindowLostFocus: "common:WindowLostFocus",
    WindowShow: "common:WindowShow",
    WindowHide: "common:WindowHide",
    WindowDPIChanged: "common:WindowDPIChanged",
    WindowFilesDropped: "common:WindowFilesDropped",
    WindowRuntimeReady: "common:WindowRuntimeReady",
    ThemeChanged: "common:ThemeChanged"
  }
};
const Types = EventTypes;
window._wails = window._wails || {};
window._wails.dispatchWailsEvent = dispatchWailsEvent;
const call$2 = newRuntimeCallerWithID(objectNames.Events, "");
const EmitMethod = 0;
const eventListeners = /* @__PURE__ */ new Map();
class Listener {
  constructor(eventName, callback, maxCallbacks) {
    this.eventName = eventName;
    this.maxCallbacks = maxCallbacks || -1;
    this.Callback = (data) => {
      callback(data);
      if (this.maxCallbacks === -1)
        return false;
      this.maxCallbacks -= 1;
      return this.maxCallbacks === 0;
    };
  }
}
class WailsEvent {
  constructor(name, data = null) {
    this.name = name;
    this.data = data;
  }
}
function setup() {
}
function dispatchWailsEvent(event) {
  let listeners = eventListeners.get(event.name);
  if (listeners) {
    let toRemove = listeners.filter((listener) => {
      let remove = listener.Callback(event);
      if (remove)
        return true;
    });
    if (toRemove.length > 0) {
      listeners = listeners.filter((l) => !toRemove.includes(l));
      if (listeners.length === 0)
        eventListeners.delete(event.name);
      else
        eventListeners.set(event.name, listeners);
    }
  }
}
function OnMultiple(eventName, callback, maxCallbacks) {
  let listeners = eventListeners.get(eventName) || [];
  const thisListener = new Listener(eventName, callback, maxCallbacks);
  listeners.push(thisListener);
  eventListeners.set(eventName, listeners);
  return () => listenerOff(thisListener);
}
function On(eventName, callback) {
  return OnMultiple(eventName, callback, -1);
}
function Once(eventName, callback) {
  return OnMultiple(eventName, callback, 1);
}
function listenerOff(listener) {
  const eventName = listener.eventName;
  let listeners = eventListeners.get(eventName).filter((l) => l !== listener);
  if (listeners.length === 0)
    eventListeners.delete(eventName);
  else
    eventListeners.set(eventName, listeners);
}
function Off(eventName, ...additionalEventNames) {
  let eventsToRemove = [eventName, ...additionalEventNames];
  eventsToRemove.forEach((eventName2) => eventListeners.delete(eventName2));
}
function OffAll() {
  eventListeners.clear();
}
function Emit(event) {
  return call$2(EmitMethod, event);
}
const Events = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Emit,
  Off,
  OffAll,
  On,
  OnMultiple,
  Once,
  Types,
  WailsEvent,
  setup
}, Symbol.toStringTag, { value: "Module" }));
window._wails = window._wails || {};
window._wails.dialogErrorCallback = dialogErrorCallback;
window._wails.dialogResultCallback = dialogResultCallback;
const DialogInfo = 0;
const DialogWarning = 1;
const DialogError = 2;
const DialogQuestion = 3;
const DialogOpenFile = 4;
const DialogSaveFile = 5;
const call$1 = newRuntimeCallerWithID(objectNames.Dialog, "");
const dialogResponses = /* @__PURE__ */ new Map();
function generateID$1() {
  let result;
  do {
    result = nanoid();
  } while (dialogResponses.has(result));
  return result;
}
function dialog(type, options = {}) {
  const id = generateID$1();
  options["dialog-id"] = id;
  return new Promise((resolve, reject) => {
    dialogResponses.set(id, { resolve, reject });
    call$1(type, options).catch((error) => {
      reject(error);
      dialogResponses.delete(id);
    });
  });
}
function dialogResultCallback(id, data, isJSON) {
  let p = dialogResponses.get(id);
  if (p) {
    if (isJSON) {
      p.resolve(JSON.parse(data));
    } else {
      p.resolve(data);
    }
    dialogResponses.delete(id);
  }
}
function dialogErrorCallback(id, message) {
  let p = dialogResponses.get(id);
  if (p) {
    p.reject(message);
    dialogResponses.delete(id);
  }
}
const Info = (options) => dialog(DialogInfo, options);
const Warning = (options) => dialog(DialogWarning, options);
const Error$1 = (options) => dialog(DialogError, options);
const Question = (options) => dialog(DialogQuestion, options);
const OpenFile = (options) => dialog(DialogOpenFile, options);
const SaveFile = (options) => dialog(DialogSaveFile, options);
const Dialogs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Error: Error$1,
  Info,
  OpenFile,
  Question,
  SaveFile,
  Warning
}, Symbol.toStringTag, { value: "Module" }));
function sendEvent(eventName, data = null) {
  let event = new WailsEvent(eventName, data);
  Emit(event);
}
function addWMLEventListeners() {
  const elements = document.querySelectorAll("[wml-event]");
  elements.forEach(function(element) {
    const eventType = element.getAttribute("wml-event");
    const confirm = element.getAttribute("wml-confirm");
    const trigger = element.getAttribute("wml-trigger") || "click";
    let callback = function() {
      if (confirm) {
        Question({ Title: "Confirm", Message: confirm, Detached: false, Buttons: [{ Label: "Yes" }, { Label: "No", IsDefault: true }] }).then(function(result) {
          if (result !== "No") {
            sendEvent(eventType);
          }
        });
        return;
      }
      sendEvent(eventType);
    };
    element.removeEventListener(trigger, callback);
    element.addEventListener(trigger, callback);
  });
}
function callWindowMethod(windowName, method) {
  let targetWindow = Get(windowName);
  let methodMap = WindowMethods(targetWindow);
  if (!methodMap.has(method)) {
    console.log("Window method " + method + " not found");
  }
  try {
    methodMap.get(method)();
  } catch (e) {
    console.error("Error calling window method '" + method + "': " + e);
  }
}
function addWMLWindowListeners() {
  const elements = document.querySelectorAll("[wml-window]");
  elements.forEach(function(element) {
    const windowMethod = element.getAttribute("wml-window");
    const confirm = element.getAttribute("wml-confirm");
    const trigger = element.getAttribute("wml-trigger") || "click";
    const targetWindow = element.getAttribute("wml-target-window") || "";
    let callback = function() {
      if (confirm) {
        Question({ Title: "Confirm", Message: confirm, Buttons: [{ Label: "Yes" }, { Label: "No", IsDefault: true }] }).then(function(result) {
          if (result !== "No") {
            callWindowMethod(targetWindow, windowMethod);
          }
        });
        return;
      }
      callWindowMethod(targetWindow, windowMethod);
    };
    element.removeEventListener(trigger, callback);
    element.addEventListener(trigger, callback);
  });
}
function addWMLOpenBrowserListener() {
  const elements = document.querySelectorAll("[wml-openurl]");
  elements.forEach(function(element) {
    const url = element.getAttribute("wml-openurl");
    const confirm = element.getAttribute("wml-confirm");
    const trigger = element.getAttribute("wml-trigger") || "click";
    let callback = function() {
      if (confirm) {
        Question({ Title: "Confirm", Message: confirm, Buttons: [{ Label: "Yes" }, { Label: "No", IsDefault: true }] }).then(function(result) {
          if (result !== "No") {
            void OpenURL(url);
          }
        });
        return;
      }
      void OpenURL(url);
    };
    element.removeEventListener(trigger, callback);
    element.addEventListener(trigger, callback);
  });
}
function Reload() {
  addWMLEventListeners();
  addWMLWindowListeners();
  addWMLOpenBrowserListener();
}
function WindowMethods(targetWindow) {
  let result = /* @__PURE__ */ new Map();
  for (let method in targetWindow) {
    if (typeof targetWindow[method] === "function") {
      result.set(method, targetWindow[method]);
    }
  }
  return result;
}
const WML = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Reload
}, Symbol.toStringTag, { value: "Module" }));
window._wails = window._wails || {};
window._wails.callResultHandler = resultHandler;
window._wails.callErrorHandler = errorHandler;
const CallBinding = 0;
const call = newRuntimeCallerWithID(objectNames.Call, "");
let callResponses = /* @__PURE__ */ new Map();
function generateID() {
  let result;
  do {
    result = nanoid();
  } while (callResponses.has(result));
  return result;
}
function resultHandler(id, data, isJSON) {
  const promiseHandler = getAndDeleteResponse(id);
  if (promiseHandler) {
    promiseHandler.resolve(isJSON ? JSON.parse(data) : data);
  }
}
function errorHandler(id, message) {
  const promiseHandler = getAndDeleteResponse(id);
  if (promiseHandler) {
    promiseHandler.reject(message);
  }
}
function getAndDeleteResponse(id) {
  const response = callResponses.get(id);
  callResponses.delete(id);
  return response;
}
function callBinding(type, options = {}) {
  return new Promise((resolve, reject) => {
    const id = generateID();
    options["call-id"] = id;
    callResponses.set(id, { resolve, reject });
    call(type, options).catch((error) => {
      reject(error);
      callResponses.delete(id);
    });
  });
}
function Call(options) {
  return callBinding(CallBinding, options);
}
function ByName(name, ...args) {
  if (typeof name !== "string" || name.split(".").length !== 3) {
    throw new Error("CallByName requires a string in the format 'package.struct.method'");
  }
  let [packageName, structName, methodName] = name.split(".");
  return callBinding(CallBinding, {
    packageName,
    structName,
    methodName,
    args
  });
}
function ByID(methodID, ...args) {
  return callBinding(CallBinding, {
    methodID,
    args
  });
}
function Plugin(pluginName, methodName, ...args) {
  return callBinding(CallBinding, {
    packageName: "wails-plugins",
    structName: pluginName,
    methodName,
    args
  });
}
const Call$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ByID,
  ByName,
  Call,
  Plugin
}, Symbol.toStringTag, { value: "Module" }));
window._wails = window._wails || {};
window._wails.setResizable = setResizable;
window._wails.endDrag = endDrag;
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseup", onMouseUp);
let shouldDrag = false;
let resizeEdge = null;
let resizable = false;
let defaultCursor = "auto";
function dragTest(e) {
  let val = window.getComputedStyle(e.target).getPropertyValue("--webkit-app-region");
  if (!val || val === "" || val.trim() !== "drag" || e.buttons !== 1) {
    return false;
  }
  return e.detail === 1;
}
function setResizable(value) {
  resizable = value;
}
function endDrag() {
  document.body.style.cursor = "default";
  shouldDrag = false;
}
function testResize() {
  if (resizeEdge) {
    invoke(`resize:${resizeEdge}`);
    return true;
  }
  return false;
}
function onMouseDown(e) {
  if (IsWindows() && testResize() || dragTest(e)) {
    shouldDrag = !!isValidDrag(e);
  }
}
function isValidDrag(e) {
  return !(e.offsetX > e.target.clientWidth || e.offsetY > e.target.clientHeight);
}
function onMouseUp(e) {
  let mousePressed = e.buttons !== void 0 ? e.buttons : e.which;
  if (mousePressed > 0) {
    endDrag();
  }
}
function setResize(cursor = defaultCursor) {
  document.documentElement.style.cursor = cursor;
  resizeEdge = cursor;
}
function onMouseMove(e) {
  shouldDrag = checkDrag(e);
  if (IsWindows() && resizable) {
    handleResize(e);
  }
}
function checkDrag(e) {
  let mousePressed = e.buttons !== void 0 ? e.buttons : e.which;
  if (shouldDrag && mousePressed > 0) {
    invoke("drag");
    return false;
  }
  return shouldDrag;
}
function handleResize(e) {
  let resizeHandleHeight = GetFlag("system.resizeHandleHeight") || 5;
  let resizeHandleWidth = GetFlag("system.resizeHandleWidth") || 5;
  let cornerExtra = GetFlag("resizeCornerExtra") || 10;
  let rightBorder = window.outerWidth - e.clientX < resizeHandleWidth;
  let leftBorder = e.clientX < resizeHandleWidth;
  let topBorder = e.clientY < resizeHandleHeight;
  let bottomBorder = window.outerHeight - e.clientY < resizeHandleHeight;
  let rightCorner = window.outerWidth - e.clientX < resizeHandleWidth + cornerExtra;
  let leftCorner = e.clientX < resizeHandleWidth + cornerExtra;
  let topCorner = e.clientY < resizeHandleHeight + cornerExtra;
  let bottomCorner = window.outerHeight - e.clientY < resizeHandleHeight + cornerExtra;
  if (!leftBorder && !rightBorder && !topBorder && !bottomBorder && resizeEdge !== void 0) {
    setResize();
  } else if (rightCorner && bottomCorner)
    setResize("se-resize");
  else if (leftCorner && bottomCorner)
    setResize("sw-resize");
  else if (leftCorner && topCorner)
    setResize("nw-resize");
  else if (topCorner && rightCorner)
    setResize("ne-resize");
  else if (leftBorder)
    setResize("w-resize");
  else if (topBorder)
    setResize("n-resize");
  else if (bottomBorder)
    setResize("s-resize");
  else if (rightBorder)
    setResize("e-resize");
}
window.wails = window.wails || {};
window._wails = window._wails || {};
window.wails = {
  Application,
  Browser,
  Call: Call$1,
  Clipboard,
  Dialogs,
  Events,
  Flags,
  Screens,
  System,
  Window,
  WML
};
invoke("wails:runtime:ready");
let isReady = false;
document.addEventListener("DOMContentLoaded", function() {
  isReady = true;
});
function whenReady(fn) {
  if (isReady || document.readyState === "complete") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
whenReady(() => {
  Reload();
});
async function Greet(name) {
  return ByName("main.GreetService.Greet", ...Array.prototype.slice.call(arguments, 0));
}
const resultElement = document.getElementById("result");
const timeElement = document.getElementById("time");
window.doGreet = () => {
  let name = document.getElementById("name").value;
  if (!name) {
    name = "anonymous";
  }
  Greet(name).then((result) => {
    resultElement.innerText = result;
  }).catch((err) => {
    console.log(err);
  });
};
On("time", (time) => {
  timeElement.innerText = time.data;
});
