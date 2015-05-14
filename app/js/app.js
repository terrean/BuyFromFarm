
$(function() {

  Parse.$ = jQuery;

  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("lHJYleNOWl4VA3EMnGW9cDoPt4UAgZgXLmkvAaxK", "E5Fcsd8PPtAzAEiWwA9c5WWkoxVEtQWeBjYE1v4v");

	var ViewsContacts = Parse.View.extend({
		template: _.template($('#tpl-contacts').html()),

		events: {
			"click .log-out": "logOut"
		},

		renderOne: function(contact) {
			var itemView = new ViewsContact({model: contact});
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

  var LogInView = Parse.View.extend({
    events: {
      "submit form.login-form": "logIn",
      "submit form.signup-form": "signUp"
    },

    el: ".content",
    
    initialize: function() {
		
      $('.main-container').html(_.template($("#login-hide").html()));
      _.bindAll(this, "logIn", "signUp");
      this.render();
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();
	  //var hide = this.$el;
     
      Parse.User.logIn(username, password, {
        success: function(user) {
			new ManageView();
			self.undelegateEvents();
			delete self;
        },

        error: function(user, error) {
            self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
            self.$(".login-form button").removeAttr("disabled");
        }
      });

      this.$(".login-form button").attr("disabled", "disabled");

      return false;
    },

    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val();
      var password = this.$("#signup-password").val();

      Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
        success: function(user) {
			new ManageView();
            self.undelegateEvents();
            delete self;
        },

        error: function(user, error) {
          self.$(".signup-form .error").html(_.escape(error.message)).show();
          self.$(".signup-form button").removeAttr("disabled");
        }
      });

      this.$(".signup-form button").attr("disabled", "disabled");

      return false;
    },

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
      this.delegateEvents();
    }
  });

  // The main view that lets a user manage their items
  var ManageView = Parse.View.extend({

    initialize: function() {
		
        // Create our collection of contacts
        this.contacts = new CollectionsContacts;

        // Setup the query for the collection to look for contacts from the current user
        this.contacts.query = new Parse.Query(ModelsContact);
        this.contacts.query.equalTo("user", Parse.User.current());
        
		this.start({
		  this.contacts
		});
    },
	
	start: function(data) {
		var contacts = new CollectionsContacts(data.contacts),
			router = new Router();

		$('.content').html(_.template($("#login-hide").html()));

	router.on('route:home', function() {
	  router.navigate('contacts', {
		trigger: true,
		replace: true
	  });
	});

	router.on('route:showContacts', function() {
	  var contactsView = new ViewsContacts({
		collection: contacts
	  });

	  $('.main-container').html(contactsView.render().$el);
	});

	router.on('route:newContact', function() {
	  var newContactForm = new ViewsContactForm({
		model: new ModelsContact()
	  });

	  newContactForm.on('form:submitted', function(attrs) {
		attrs.id = contacts.isEmpty() ? 1 : (_.max(contacts.pluck('id')) + 1);
		contacts.add(attrs);
		router.navigate('contacts', true);
	  });

	  $('.main-container').html(newContactForm.render().$el);
	});

	router.on('route:editContact', function(id) {
	  var contact = contacts.get(id),
		  editContactForm;

	  if (contact) {
		editContactForm = new ViewsContactForm({
			model: contact
		});

		editContactForm.on('form:submitted', function(attrs) {
		  contact.set(attrs);
		  router.navigate('contacts', true);
		});

		$('.main-container').html(editContactForm.render().$el);
	  } else {
		router.navigate('contacts', true);
	  }
	});

	}
  });

	// The main view for the app
	var AppView = Parse.View.extend({
		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.

		initialize: function() {
		  this.render();
		},

		render: function() {
		  if (Parse.User.current()) {
			new ManageView();
		  } else {
			new LogInView();
		  }
		}
	});

    new Router;
    new AppView;

    Parse.history.start();
});
