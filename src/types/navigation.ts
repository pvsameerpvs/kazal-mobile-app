export type AppRoutes = {
  '/(tabs)/home': undefined;
  '/(tabs)/services': undefined;
  '/(tabs)/opportunities': undefined;
  '/(tabs)/profile': undefined;
  '/(tabs)/chat': undefined;
  '/login': undefined;
  '/contact': undefined;
  '/service/[id]': { id: string };
  '/opportunity/[id]': { id: string };
  '/chat/[id]': { id: string };
};
