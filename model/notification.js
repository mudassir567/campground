var mongoose = require("mongoose");

var notificationSchema = new mongoose.Schema({

	
	isRead:  { type: Boolean, default: false }
});

module.exports = mongoose.model("Notification", notificationSchema);