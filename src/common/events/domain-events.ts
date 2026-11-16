/**
 * UniConnect - Domain Events
 * Decoupled event classes for cross-module communication between
 * SocialFeed, Connections, and Notifications domains.
 */

export class PostCommentedEvent {
  constructor(
    public readonly postId: string,
    public readonly postAuthorId: string,
    public readonly commentId: string,
    public readonly commenterId: string,
  ) {}
}

export class PostReactedEvent {
  constructor(
    public readonly postId: string,
    public readonly postAuthorId: string,
    public readonly reactorId: string,
    public readonly reactionType: string,
  ) {}
}

export class ConnectionRequestedEvent {
  constructor(
    public readonly connectionId: string,
    public readonly requesterId: string,
    public readonly receiverId: string,
  ) {}
}

export class ConnectionAcceptedEvent {
  constructor(
    public readonly connectionId: string,
    public readonly requesterId: string,
    public readonly receiverId: string,
  ) {}
}

