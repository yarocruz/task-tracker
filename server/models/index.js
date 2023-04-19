const Tasks = require('./Tasks');
const User = require('./User');

Tasks.belongsTo(User, {
    foreignKey: 'user_id',
});

User.hasMany(Tasks, {
    foreignKey: 'user_id',
});

module.exports = { Tasks, User };