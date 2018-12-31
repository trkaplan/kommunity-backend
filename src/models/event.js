import Sequelize, { type DataTypes } from 'sequelize';


module.exports = (sequelize: Sequelize, dataTypes: DataTypes) => {
  const Event = sequelize.define('Event', {
    uuid: {
      type: dataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      field: 'uuid',
      validate: {
        isUUID: 4,
      },
    },
    communityUuid: {
      type: dataTypes.UUID,
      field: 'community_uuid',
      validate: {
        isUUID: 4,
      },
    },
    imageUuid: {
      type: dataTypes.UUID,
      field: 'image_uuid',
      validate: {
        isUUID: 4,
      },
    },
    title: {
      type: dataTypes.STRING(255),
      allowNull: false,
      field: 'title',
      validate: {
        len: [2, 255],
      },
    },
    content: {
      type: dataTypes.STRING(5000),
      allowNull: false,
      field: 'content',
      validate: {
        len: [2, 5000],
      },
    },
    timeStart: {
      type: dataTypes.DATE,
      field: 'time_start',
      validate: {
        isDate: true,
      },
    },
    timeEnd: {
      type: dataTypes.DATE,
      field: 'time_end',
      validate: {
        isDate: true,
      },
    },
    timeZone: {
      type: dataTypes.STRING(30),
      field: 'time_zone',
    },
    location: {
      type: dataTypes.ENUM('unplanned', 'online', 'address'),
      allowNull: false,
      field: 'location',
      validate: {
        isIn: [['unplanned', 'online', 'address']],
      },
    },
    venueName: {
      type: dataTypes.STRING(50),
      field: 'venue_name',
      validate: { len: [1, 50] },
    },
    address1: {
      type: dataTypes.STRING(50),
      field: 'address_1',
      validate: { len: [1, 50] },
    },
    address2: {
      type: dataTypes.STRING(50),
      field: 'address_2',
      validate: { len: [1, 50] },
    },
    city: {
      type: dataTypes.STRING(30),
      field: 'city',
      validate: { len: [1, 30] },
    },
    state: {
      type: dataTypes.STRING(30),
      field: 'state',
      validate: { len: [1, 30] },
    },
    zip: {
      type: dataTypes.INTEGER,
      field: 'zip',
      validate: {
        len: [4, 5],
      },
    },
    country: {
      type: dataTypes.STRING(30),
      field: 'country',
      validate: { len: [1, 30] },
    },
    latitude: {
      type: dataTypes.DECIMAL,
      field: 'latitude',
      validate: {
        min: -90,
        max: 90,
      },
    },
    longitude: {
      type: dataTypes.DECIMAL,
      field: 'longitude',
      validate: {
        min: -180,
        max: 180,
      },
    },
  },
  {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'events',
  });

  Event.associate = (models) => {
    Event.belongsTo(models.Community);
    Event.belongsToMany(models.User, { through: models.UserEvent });
  };

  return Event;
};
