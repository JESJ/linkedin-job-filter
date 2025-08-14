const api = typeof browser !== 'undefined' ? browser : chrome;
api.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'OPEN_OPTIONS') {
    if (api.runtime.openOptionsPage) {
      api.runtime.openOptionsPage();
      sendResponse({ok: true});
    } else {
      const url = api.runtime.getURL('options.html');
      api.tabs.create({ url });
      sendResponse({ok: true, via: 'tabs.create'});
    }
  }
});