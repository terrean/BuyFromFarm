var ModelsContact = Parse.Object.extend("Contact", {
  defaults: {
    name: null,
    price: null,
    unit: null,
    description: null,
    avatar: null
  },

  initialize: function() {
    this.set('avatar', _.random(1, 15) + '.jpg');
  }
});
