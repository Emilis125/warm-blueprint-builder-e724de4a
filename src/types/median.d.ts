interface MedianGoogleLoginSuccess {
  idToken?: string;
  accessToken?: string;
  type?: string;
  userId?: string;
  userDetails?: {
    email?: string;
    name?: string;
    imageURL?: string;
  };
}

interface MedianGoogleLoginError {
  error: string;
  type?: string;
}

type MedianGoogleLoginResponse = MedianGoogleLoginSuccess & Partial<MedianGoogleLoginError>;

interface Window {
  median?: {
    socialLogin: {
      google: {
        login: (options: {
          callback: (response: MedianGoogleLoginResponse) => void;
          scope?: string;
        }) => void;
      };
    };
  };
}
