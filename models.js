const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
  title: {type: String, required: true},
  dueDate: {type: Date},
  description: {type: String},
  subGoals: {type: Array}
});

goalSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    title: this.title,
    dueDate: this.dueDate,
    description: this.description,
    subGoals: this.subGoals
  };
}

const Goal = mongoose.model('Goal', goalSchema);

module.exports = {Goal};
