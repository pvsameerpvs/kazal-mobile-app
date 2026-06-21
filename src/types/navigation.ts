export type AppRoutes = {
  '/(tabs)/home': undefined;
  '/(tabs)/services': undefined;
  '/(tabs)/opportunities': undefined;
  '/(tabs)/chat': undefined;
  '/(tabs)/profile': undefined;
  '/login': undefined;
  '/contact': undefined;
  '/service/[id]': { id: string };
  '/opportunity/[id]': { id: string };
  '/chat/[id]': { id: string };
};
