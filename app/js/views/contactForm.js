ContactManager.Views.ContactForm = Backbone.View.extend({
  template: _.template($('#tpl-new-contact').html()),

  events: {
    'submit .contract-form': 'onFormSubmit',
      "click .log-out": "logOut"
  },

  render: function() {
    var html = this.template(_.extend(this.model.toJSON(), {
      isNew: this.model.isNew()
    }));
    this.$el.append(html);
    return this;
  },

  onFormSubmit: function(e) {
    e.preventDefault();

	saveProducts();
    this.trigger('form:submitted', {
      name: this.$('.contact-name-input').val(),
      price: this.$('.contact-price-input').val(),
      unit: this.$('.contact-unit-input').val(),
      description: this.$('.contact-description-input').val()
    });
	
  },
    /**
  saveProducts: function() {
	  var Product = Parse.Object.extend("Product");
	  var product = new Product();
	  
	  var name = this.$('.contact-name-input').val();
      var price = this.$('.contact-price-input').val();
      var unit = this.$('.contact-unit-input').val();
      var description = this.$('.contact-description-input').val();
	  
	  product.set("name", name);
	  product.set("price", price);
	  product.set("unit", unit);
	  product.set("description", description);
	  
	  product.save(null, {
		  success: function() {
			  console.log("saved!");
		  },
		  error: function() {
			  console.log(error.message);
		  }
	  })
  };**/
  
    // Logs out the user and shows the login view
    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
      this.undelegateEvents();
      delete this;
    },

});
