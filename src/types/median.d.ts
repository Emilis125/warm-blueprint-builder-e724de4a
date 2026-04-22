interface Window {
  median?: {
    socialLogin: {
      google: {
        login: () => void;
      };
    };
  };
  median_social_login_callback?: (data: {
    status: string;
    platform: string;
    email?: string;
    idToken?: string;
    error?: string;
  }) => void;
}
