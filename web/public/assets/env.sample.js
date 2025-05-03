(function (window) {
  window['env'] = window['env'] || {};

  // Environment variables
  window['env']['API_BASE_URL'] = '${API_BASE_URL}';
  window['env']['ASSISTANT_BASE_URL'] = '${ASSISTANT_BASE_URL}';
})(this);
