import { gql } from 'apollo-server-express';

export default gql`
  scalar Date

  enum CommunityTier {
    free
    tier1
    tier2
    tier3
  }

  enum CommunityType {
    public
    private
    secret
  }

  enum ConversationCategoryType {
    public
    private
    secret
  }

  enum ConversationCategoryRole {
    guest
    member
    moderator
    admin
  }

  enum UploadedItemType {
    user_avatar
    community_avatar
    post_attachment
  }

  type LoggedInUserDetails {
    uuid: ID!
    email: String!
    username: String
    firstName: String
    lastName: String
    userAttributes: String
    location: String
    avatarUploadUuid: ID
    lastSeenAt: Date
  }

  type UserDetails {
    uuid: ID!
    firstName: String
    lastName: String
    username: String
    location: String
    avatarUploadUuid: ID
    lastSeenAt: Date
    CommunityUser: CommunityUser
  }

  type Community {
    uuid: String
    name: String
    tagline: String
    desc: String
    location: String
    tier: CommunityTier
    visibility: CommunityType
    Users: [UserDetails]
  }

  type CommunityUser {
    communityUuid: String
    userUuid: String
    status: String
    role: String
  }

  type PopularCommunity {
    uuid: String
    name: String
    tagline: String
    desc: String
    location: String
    userCount: Int
  }

  type Query {
    getCommunityMembers(uuid: ID!): Community
    getLoggedInUserDetails: LoggedInUserDetails
    getUserDetailsByUuid(uuid: ID!): UserDetails
    getLoggedInUserCommunities: [Community]
    getUserCommunitiesByUuid(uuid: ID!): [Community]
    searchCommunities(name: String!): [Community]
    searchUsers(queryText:String!): [UserDetails]
    popularCommunities: [PopularCommunity]
  }

  type Mutation {
    createCommunity(
      name: String
      tagline: String
      desc: String
      location: String
      tier: CommunityTier
      visibility: CommunityType
    ): Community
    createUser(
      email: String
      password: String
      username: String
      firstName: String
      lastName: String
      userAttributes: String
      location: String
    ): UserDetails
  }
`;
