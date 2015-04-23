var ChangedByResponse = require('./changed-by-response');

module.exports = StatusResponse;

function StatusResponse(attributes) {
  var attrs = attributes || {};
  this.dateChanged = new Date(attrs.dateChanged || 0);
  this.description = attrs.description || '';
  this.reason = attrs.reason || '';
  this.statusType = attrs.statusType || 'STOP';
  this.changedBy = new ChangedByResponse(attrs.changedBy || {});
}
