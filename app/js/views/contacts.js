var ViewsContacts = Parse.View.extend({
  template: _.template($('#tpl-contacts').html()),

  events: {
    "click .log-out": "logOut"
  },

  renderOne: function(contact) {
    var itemView = new ContactManager.Views.Contact({model: contact});
    this.$('.contacts-container').append(itemView.render().$el);
  },

  render: function() {
    var html = this.template();
    this.$el.html(html);

    this.collection.each(this.renderOne, this);

    return this;
  },

    // Logs out the user and shows the login view
    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
      this.undelegateEvents();
      delete this;
    }

});
