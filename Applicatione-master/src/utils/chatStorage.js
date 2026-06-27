import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAT_STORAGE_KEY = "localChatConversations";
const DEFAULT_CHAT_SCOPE = "guest";
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop";

const getStringHash = (value) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash.toString(36);
};

const getChatStorageKey = async () => {
  const token = await AsyncStorage.getItem("userToken");
  const scope = token ? getStringHash(token) : DEFAULT_CHAT_SCOPE;

  return `${CHAT_STORAGE_KEY}:${scope}`;
};

const createId = (prefix = "chat") =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getDate = (dateValue) => {
  const date = new Date(dateValue);

  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const formatMessageTime = (dateValue) =>
  getDate(dateValue).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatConversationTime = (dateValue) => {
  const date = getDate(dateValue);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  if (isToday) {
    return formatMessageTime(date);
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const getMessagePreview = (message) => {
  if (!message) {
    return "Start a conversation";
  }

  if (message.type === "file") {
    return message.fileName || message.text || "Attachment";
  }

  return message.text || "Message";
};

export const normalizeChatMessage = (message = {}, index = 0) => {
  const createdAt = message.createdAt || new Date().toISOString();

  return {
    ...message,
    id: message.id || createId(`message-${index}`),
    text: message.text || "",
    sender: message.sender || "other",
    type: message.type || "text",
    time: message.time || formatMessageTime(createdAt),
    createdAt,
  };
};

export const normalizeConversation = (conversation = {}) => {
  const messages = Array.isArray(conversation.messages)
    ? conversation.messages.map(normalizeChatMessage)
    : [];
  const lastMessage = messages[messages.length - 1];
  const updatedAt =
    conversation.updatedAt ||
    lastMessage?.createdAt ||
    new Date().toISOString();

  return {
    id: conversation.id || createId(),
    name: conversation.name || conversation.userName || "Candidate",
    image: conversation.image || conversation.userImage || DEFAULT_AVATAR,
    role: conversation.role || conversation.userRole || "",
    unread: Number.isFinite(conversation.unread) ? conversation.unread : 0,
    isGroup: Boolean(conversation.isGroup),
    messages,
    message: conversation.message || getMessagePreview(lastMessage),
    time: conversation.time || formatConversationTime(updatedAt),
    updatedAt,
  };
};

const sortConversations = (conversations) =>
  [...conversations].sort(
    (first, second) =>
      getDate(second.updatedAt).getTime() - getDate(first.updatedAt).getTime(),
  );

const saveConversations = async (conversations) => {
  const storageKey = await getChatStorageKey();
  const normalizedConversations = sortConversations(
    conversations.map(normalizeConversation),
  );

  await AsyncStorage.setItem(
    storageKey,
    JSON.stringify(normalizedConversations),
  );

  return normalizedConversations;
};

export const getConversations = async () => {
  const storageKey = await getChatStorageKey();
  const rawConversations = await AsyncStorage.getItem(storageKey);

  if (!rawConversations) {
    return [];
  }

  try {
    const conversations = JSON.parse(rawConversations);

    return Array.isArray(conversations)
      ? sortConversations(conversations.map(normalizeConversation))
      : [];
  } catch {
    return [];
  }
};

export const getConversationById = async (conversationId) => {
  const conversations = await getConversations();

  return conversations.find(
    (conversation) => conversation.id === conversationId,
  );
};

export const upsertConversation = async (conversation) => {
  const conversations = await getConversations();
  const currentConversation = conversations.find(
    (item) => item.id === conversation.id,
  );
  const nextConversation = normalizeConversation({
    ...currentConversation,
    ...conversation,
    messages: currentConversation?.messages?.length
      ? currentConversation.messages
      : conversation.messages || [],
    updatedAt:
      conversation.updatedAt ||
      currentConversation?.updatedAt ||
      new Date().toISOString(),
  });
  const nextConversations = [
    nextConversation,
    ...conversations.filter((item) => item.id !== nextConversation.id),
  ];

  await saveConversations(nextConversations);

  return nextConversation;
};

export const appendMessageToConversation = async (conversation, message) => {
  const conversations = await getConversations();
  const currentConversation = conversations.find(
    (item) => item.id === conversation.id,
  );
  const baseConversation = normalizeConversation(
    currentConversation || conversation,
  );
  const nextMessage = normalizeChatMessage(
    message,
    baseConversation.messages.length,
  );
  const nextConversation = normalizeConversation({
    ...baseConversation,
    ...conversation,
    messages: [...baseConversation.messages, nextMessage],
    message: getMessagePreview(nextMessage),
    time: formatConversationTime(nextMessage.createdAt),
    updatedAt: nextMessage.createdAt,
  });
  const nextConversations = [
    nextConversation,
    ...conversations.filter((item) => item.id !== nextConversation.id),
  ];

  await saveConversations(nextConversations);

  return nextConversation;
};
