import { navigate } from 'gatsby';

export const usePageRedirection = () => {
  const redirect = (pathname: string) => {
    navigate(`/${pathname}`);
  };

  return redirect;
};
