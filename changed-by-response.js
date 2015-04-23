module.exports = ChangedByResponse;

function ChangedByResponse(attributes) {
  var attrs = attributes || {};
  this.firstName = attrs.firstName;
  this.lastName = attrs.lastName;
  this.userRole = attrs.userRole;
  this.emailAddress = attrs.emailAddress;
  this.userName = attrs.userName;
}
