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

  type PopularCommunity {
    uuid: String
    name: String
    tagline: String
    desc: String
    location: String
    userCount: Int
  }

  type Message {
    channelUUID: String
    uuid: String
    sender: String
    text: String
    ts: String
  }

  type Channel {
    uuid: String
    name: String
    desc: String
  }

  type ChannelMessages {
    nextCursor: Int
    messages: [Message]
  }

  type Query {
    getChannels: [Channel]
    getMessagesForChannel(channelUUID: String!, cursor: Int): ChannelMessages
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
    sendMessage(
      channelUUID: String
      sender: String,
      text: String,
    ) : Message
  }

  type Subscription {
    messageSent(channelUUID: String!): Message
  }
`;
