export interface TwitterTokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface TweetResponse {
  id_str: string;
  text: string;
  user: {
    screen_name: string;
    name: string;
  };
  entities: {
    media?: Array<{
      media_url_https: string;
      type: string;
    }>;
  };
}

export interface AuthError extends Error {
  response?: {
    data?: any;
    status?: number;
  };
}
