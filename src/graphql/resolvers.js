import type App from '$/lib/app';
import uuid from 'uuid';

const COMMUNITY_VISIBILITY_PUBLIC = 'public';

export default (app: App) => {
  return {
    Query: {
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
      getLoggedInUserCommunities: async (parent: {}, args: {}, user: AppUser) => {
        // returns public and private communities
        const foundUser = await app.models.User.findOne({
          include: [{ model: app.models.Community }],
          where: { uuid: user.uuid },
        });

        return foundUser.Communities || [];
      },
      getUserCommunitiesByUuid: async (parent: {}, args: { uuid: uuid }) => {
        // returns public communities
        const user = await app.models.User.findOne({
          include: [{ model: app.models.Community }],
          where: { uuid: args.uuid },
        });

        return (user.Communities || []).filter((community) => {
          return community.visibility === COMMUNITY_VISIBILITY_PUBLIC;
        });
      },
      // returns communities with most members
      findPopularCommunities: async () => {
        // executing 2 queries here, can we do it in 1?
        const popularCommunities = await app.models.CommunityUser.findAll({
          group: ['community_uuid'],
          attributes: ['community_uuid', [app.sequelize.fn('COUNT', 'community_uuid'), 'count']],
          limit: 10,
          order: [[app.sequelize.literal('count'), 'DESC']],
        });
        const uuids = popularCommunities.map(community => community.community_uuid);
        return app.models.Community.findAll({
          include: [{ model: app.models.User }],
          where: {
            uuid: {
              $in: uuids,
            },
          },
        });
      },
      searchCommunities: (parent: {}, args: { name: string }) => app.models.Community.findAll({
        include: [{ model: app.models.User }],
        where: {
          name: {
            $like: `%${args.name}%`,
          },
        },
      }),
    },
    Mutation: {
      // creates community and returns it
      createCommunity: (parent: {}, args: {
        name: string,
        tagline: string,
        desc: string,
        location: string,
        tier: string,
        visibility: string,
      }) => {
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
    },
  };
};
