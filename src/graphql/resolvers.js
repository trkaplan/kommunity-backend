import type App from '$/lib/app';
import { PubSub, withFilter } from 'graphql-subscriptions';
import uuid from 'uuid';
import md5 from 'md5';

export const pubsub = new PubSub();

const COMMUNITY_VISIBILITY_PUBLIC = 'public';
const PAGE_SIZE = 20;

const channels = [
  {
    uuid: '23ea1110-d6a1-11e8-9f8b-f2801f1b9fd1',
    name: 'General',
    desc: 'life stuff..',
  },
  {
    uuid: '11ae3e22-d6a1-11e8-9f8b-f2801f1b9fd1',
    name: 'React',
    desc: 'discussions on react..',
  },
];

const messages = {
  '23ea1110-d6a1-11e8-9f8b-f2801f1b9fd1': [
    {
      channelUUID: '23ea1110-d6a1-11e8-9f8b-f2801f1b9fd1',
      uuid: uuid(),
      sender: 'selmank',
      text: 'hello!',
      ts: Date.now().toString(),
    },
    {
      channelUUID: '23ea1110-d6a1-11e8-9f8b-f2801f1b9fd1',
      uuid: uuid(),
      sender: 'mehmet',
      text: 'whats up',
      ts: Date.now().toString(),
    },
  ],
  '11ae3e22-d6a1-11e8-9f8b-f2801f1b9fd1': [],
};

export default (app: App) => {
  const Query = {
    getChannels: (parent: {}, args: {}, user: AppUser) => {
      return channels;
    },
    getMessagesForChannel: (parent: {}, args: {}, user: AppUser) => {
      const paginatedMessages = messages[args.channelUUID];

      // 0 mesaj var, page size 20
      // -- 0 mesaji dondur

      // 10 mesaj var, page size 20, page = 1
      // -- 10 mesaji dondur

      // 10 mesaj var, page size 20, page = 2
      // -- 0 mesaji dondur

      // 30 mesaj var, page size 20, page = 1
      // -- 10-30 dondur

      // 30 mesaj var, page size 20, page = 2
      // -- 0 - 10 dondur

      // 30 mesaj var, page size 20, page = 3
      // -- []

      if (paginatedMessages.length < PAGE_SIZE) {
        return {
          messages: paginatedMessages,
          nextCursor: null,
        };
      }

      // 30 mesaj var, page size 20, page = 2
      // -- 0 - 10 dondur

      const cursor = args.cursor || 1;
      const start = paginatedMessages.length - PAGE_SIZE * cursor;
      return {
        nextCursor: start <= 0 ? null : cursor + 1,
        messages: paginatedMessages.slice(
          start < 0 ? 0 : start,
          start + PAGE_SIZE,
        ),
      };
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
    // CHAT
    sendMessage: (parent: {}, args: {
      channelUUID: string,
      sender: string,
      text: string,
    }) => {
      const message = {
        uuid: uuid(),
        channelUUID: args.channelUUID,
        sender: args.sender.slice(0, 10),
        text: args.text.slice(0, 100),
        ts: Date.now().toString(),
      };
      messages[args.channelUUID].push(message);
      pubsub.publish('MESSAGE_SENT', { messageSent: message });
      return message;
    },
  };

  const Subscription = {
    messageSent: {
      subscribe: withFilter(() => pubsub.asyncIterator('MESSAGE_SENT'), (payload, variables) => {
        return payload.messageSent.channelUUID === variables.channelUUID;
      }),
    },
  };

  return {
    Query,
    Mutation,
    Subscription,
  };
};
