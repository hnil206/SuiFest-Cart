interface XUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  verified?: boolean;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

interface XApiResponse<T> {
  data?: T;
  errors?: Array<{
    title: string;
    detail: string;
    type: string;
  }>;
}

export class XApiClient {
  private bearerToken: string;
  private baseUrl = 'https://api.twitter.com/2';

  constructor(bearerToken: string) {
    this.bearerToken = bearerToken;
  }

  private async makeRequest<T>(endpoint: string): Promise<XApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`X API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get user information by user ID
   */
  async getUserById(userId: string): Promise<XUser | null> {
    const endpoint = `/users/${userId}?user.fields=name,username,profile_image_url,verified,public_metrics`;

    try {
      const response = await this.makeRequest<XUser>(endpoint);

      if (response.errors) {
        console.error('X API errors:', response.errors);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  /**
   * Get user information by username
   */
  async getUserByUsername(username: string): Promise<XUser | null> {
    const endpoint = `/users/by/username/${username}?user.fields=name,username,profile_image_url,verified,public_metrics`;

    try {
      const response = await this.makeRequest<XUser>(endpoint);

      if (response.errors) {
        console.error('X API errors:', response.errors);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  }

  /**
   * Get username by user ID (convenience method)
   */
  async getUsernameById(userId: string): Promise<string | null> {
    const user = await this.getUserById(userId);
    return user?.username || null;
  }
}
