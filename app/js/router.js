var Router = Parse.Router.extend({
  routes: {
    '': 'home',
    'contacts': 'showContacts',
    'contacts/new': 'newContact',
    'contacts/edit/:id': 'editContact'
  },
    initialize: function(options) {
    }

});
