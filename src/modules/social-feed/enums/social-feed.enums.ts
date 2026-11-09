/**
 * UniConnect Social Feed - Shared Domain Enums (Student 2)
 */

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  SUPPORT = 'support',
  INSIGHTFUL = 'insightful',
}

export enum PostMediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum PostVisibility {
  COMMUNITY = 'community',
}

// Backward-compatible alias for existing entity imports
export { PostMediaType as MediaType };

