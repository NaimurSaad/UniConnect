import { PostMediaType } from '../enums/social-feed.enums';

export class MediaUploadResponseDto {
  media_type: PostMediaType;
  file_url: string;
  mime_type: string;
  file_size_bytes: number;
}

