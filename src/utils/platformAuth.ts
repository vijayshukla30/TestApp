export const handlePlatformAuth = async ({
  assistant,
  consumer,
  openAuthLink,
  dispatch,
  updateConsumer,
  createUserActivity,
}: any) => {
  const platformType = assistant.platformType?.type?.toLowerCase() || "";
  const authUrl = buildAuthUrl(assistant.uuid, consumer);

  await openAuthLink(authUrl);

  await dispatch(
    createUserActivity({
      assistantUuid: assistant.uuid,
      isInstalled: true,
    })
  );
};

const buildAuthUrl = (assistantId: string, consumer: any) => {
  const base = process.env.EXPO_EXCHANGE_AUTH_URL;
  const state = encodeURIComponent(
    JSON.stringify({ assistantId, consumerId: consumer.uuid })
  );
  return `${base}?state=${state}`;
};
