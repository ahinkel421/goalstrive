const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
  destination: {type: String, required: true},
  eta: {type: Date},
  description: {type: String},
  subGoals: {type: Array, default: []},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

goalSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    destination: this.destination,
    eta: this.eta,
    description: this.description,
    subGoals: this.subGoals,
    userId: this.userId
  };
}

const Goal = mongoose.model('Goal', goalSchema);

module.exports = {Goal};
