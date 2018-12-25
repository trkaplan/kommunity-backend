import type App from '$/lib/app';
import uuid from 'uuid';
import md5 from 'md5';

const COMMUNITY_VISIBILITY_PUBLIC = 'public';

export default (app: App) => {
  const Query = {
    getCommunityMembers: (parent: {}, args: { uuid: uuid }) => {
      // returns community members for given community id
      return app.models.Community.findOne({
        include: [
          { model: app.models.User },
          { model: app.models.CommunityUser },
        ],
        where: { uuid: args.uuid },
      });
    },
    getLoggedInUserDetails: (parent: {}, args: {}, user: AppUser) => {
      return app.models.User.findOne({
        include: [{ model: app.models.Community }],
        where: { uuid: user.uuid },
      });
    },
    getUserDetailsByUuid: (parent: {}, args: { uuid: uuid }) => {
      return app.models.User.findOne({
        include: [{ model: app.models.Community }],
        where: { uuid: args.uuid },
      });
    },
    getLoggedInUserCommunities: (parent: {}, args: {}, user: AppUser) => {
      // returns user communities
      return app.models.Community.findAll({
        include: [
          {
            model: app.models.User,
            where: { uuid: user.uuid },
          },
        ],
      });
    },
    getUserCommunitiesByUuid: (parent: {}, args: { uuid: uuid }) => {
      // returns public user communities
      return app.models.Community.findAll({
        include: [
          {
            model: app.models.User,
            where: { uuid: args.uuid },
          },
        ],
        where: { visibility: COMMUNITY_VISIBILITY_PUBLIC },
      });
    },
    popularCommunities: () => {
      // returns communities with most members
      return app.models.Community.findAll({
        limit: 10,
        subQuery: false,
        attributes: [
          'uuid',
          'name',
          'tagline',
          'desc',
          'location',
          [app.sequelize.fn('COUNT', 'CommunityUser.userUuid'), 'userCount'],
        ],
        include: [
          {
            model: app.models.CommunityUser,
            attributes: [],
          },
        ],
        where: { visibility: COMMUNITY_VISIBILITY_PUBLIC },
        group: ['uuid'],
        order: [[app.sequelize.literal('"userCount"'), 'DESC']],
      }).map(data => data.toJSON());
    },
    searchCommunities: (parent: {}, args: { name: string }) => app.models.Community.findAll({
      include: [{ model: app.models.User }],
      where: {
        name: {
          $ilike: `%${args.name}%`,
        },
      },
    }),
    searchUsers: (parent: {}, args: { queryText: string }) => {
      const queryTextArray = args.queryText.split(' ');
      const orQuery = queryTextArray.map((text) => {
        return {
          $iLike: `%${text}%`,
        };
      });
      return app.models.User.findAll({
        where: {
          $or: {
            firstName: {
              $or: orQuery,
            },
            lastName: {
              $or: orQuery,
            },
            username: {
              $or: orQuery,
            },
          },
        },
      });
    },
  };
  const Mutation = {
    // creates community and returns it
    createCommunity: (
      parent: {},
      args: {
        name: string,
        tagline: string,
        desc: string,
        location: string,
        tier: string,
        visibility: string,
      },
    ) => {
      // TODO avatarUploadUuid, socialLinks
      return app.models.Community.create({
        uuid: uuid(),
        name: args.name,
        tagline: args.tagline,
        desc: args.desc,
        location: args.location,
        tier: args.tier,
        visibility: args.visibility,
      });
    },
    createUser: (
      parent: {},
      args: {
        email: string,
        password: string,
        username: string,
        firstName: string,
        lastName: string,
        userAttributes: string,
        location: string,
      },
    ) => {
      const passwordHash = md5(args.password);
      return app.models.User.create({
        uuid: uuid(),
        email: args.email,
        passwordHash,
        username: args.username,
        firstName: args.firstName,
        lastName: args.lastName,
        userAttributes: args.userAttributes,
        location: args.location,
        // avatar uuid
        avatarUploadUuid: uuid(),
      });
    },
  };

  return {
    Query,
    Mutation,
  };
};
