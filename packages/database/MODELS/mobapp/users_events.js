/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users_events', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.TEXT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: true
    },
    event_id: {
      type: DataTypes.TEXT,
      allowNull: true,
      references: {
        model: 'events',
        key: 'id'
      }
    }
  }, {
    tableName: 'users_events'
  });
};
