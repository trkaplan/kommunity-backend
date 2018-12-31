import Sequelize, { type DataTypes } from 'sequelize';

module.exports = (sequelize: Sequelize, dataTypes: DataTypes) => {
  const UserEvent = sequelize.define('UserEvent', {
    eventUuid: {
      type: dataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'event_uuid',
      validate: {
        isUUID: 4,
      },
    },
    userUuid: {
      type: dataTypes.UUID,
      allowNull: false,
      field: 'user_uuid',
      validate: {
        isUUID: 4,
      },
    },
    role: {
      type: dataTypes.ENUM('guest', 'host'),
      allowNull: false,
      field: 'role',
      validate: {
        isIn: [['guest', 'host']],
      },
    },
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'user_events',
  });
  UserEvent.associate = (models) => {
    UserEvent.belongsTo(models.Event);
  };

  return UserEvent;
};
