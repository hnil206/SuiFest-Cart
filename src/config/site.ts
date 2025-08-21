import { appConfig } from '.';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  appUrl: appConfig.appUrl,
  name: 'SuiFest Card',
  metaTitle: 'SuiFest Card',
  description: 'SuiFest Card',
  ogImage: `${appConfig.appUrl}/og-image.jpg`,
};
