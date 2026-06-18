import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical, 
  Send, 
  Smile, 
  Camera, 
  Mic,
  Image as ImageIcon,
  X
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { spacingForWidth } from '../utils/responsive';
import TypingIndicator from '../components/TypingIndicator';

const IndividualChatScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { compact } = spacingForWidth(width);
  const { userName, userImage } = route.params || { 
    userName: 'Meet Patel', 
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' 
  };

  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [messages, setMessages] = useState([]);

  const flatListRef = useRef();

  const handleSend = () => {
    if (message.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    setIsTyping(false);
    
    // Simulate other user typing back
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyMessage = {
          id: (Date.now() + 1).toString(),
          text: "That looks amazing! 🔥",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'other',
        };
        setMessages(prev => [...prev, replyMessage]);
      }, 3000);
    }, 1500);
    
    // Auto scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.otherMessageRow]}>
        {!isMe && <Image source={{ uri: userImage }} style={styles.messageAvatar} />}
        <View style={[styles.bubbleContainer, isMe ? styles.myBubbleContainer : styles.otherBubbleContainer]}>
          {isMe ? (
            <LinearGradient
              colors={['#FF8C00', '#008000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.myBubble}
            >
              <Text style={styles.myMessageText}>{item.text}</Text>
            </LinearGradient>
          ) : (
            <View style={styles.otherBubble}>
              <Text style={styles.otherMessageText}>{item.text}</Text>
            </View>
          )}
          <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.otherTimeText]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.userInfo}
              onPress={() => setShowFullImage(true)}
              activeOpacity={0.8}
            >
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: userImage }} style={styles.headerAvatar} />
                <View style={styles.onlineStatus} />
              </View>
              <View>
                <Text style={styles.headerName}>{userName}</Text>
                <Text style={styles.headerStatus}>Online</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.headerRight, compact && styles.headerRightCompact]}>
            <TouchableOpacity style={styles.headerIconButton}>
              <Phone size={compact ? 18 : 20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton}>
              <Video size={compact ? 18 : 20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton}>
              <MoreVertical size={compact ? 18 : 20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Full Image Modal */}
        <Modal
          visible={showFullImage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowFullImage(false)}
        >
          <Pressable 
            style={styles.fullImageOverlay}
            onPress={() => setShowFullImage(false)}
          >
            <View style={styles.fullImageHeader}>
              <TouchableOpacity onPress={() => setShowFullImage(false)} style={styles.closeBtn}>
                <X size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.fullImageTitle}>{userName}</Text>
            </View>
            <Image 
              source={{ uri: userImage }} 
              style={styles.fullImage}
              resizeMode="contain"
            />
          </Pressable>
        </Modal>

        {/* Chat Content */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListFooterComponent={() => isTyping ? <TypingIndicator /> : <View style={{ height: 10 }} />}
        />

        {/* Input Bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, compact && styles.inputWrapperCompact]}>
              <TouchableOpacity style={styles.inputIcon}>
                <Smile size={24} color="#999" />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <TouchableOpacity style={styles.inputIcon}>
                <Camera size={24} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputIcon}>
                <ImageIcon size={24} color="#999" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleSend}>
              <LinearGradient
                colors={['#FF8C00', '#008000']}
                style={styles.sendButton}
              >
                {message.trim().length > 0 ? (
                  <Send size={22} color="white" />
                ) : (
                  <Mic size={22} color="white" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    paddingTop: Platform.OS === 'android' ? 35 : 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineStatus: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    maxWidth: 135,
  },
  headerStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
  },
  headerRightCompact: {
    gap: 4,
  },
  headerIconButton: {
    padding: 5,
  },
  messageList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 6,
    maxWidth: '85%',
  },
  myMessageRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherMessageRow: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  bubbleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  myBubbleContainer: {
    alignItems: 'flex-end',
  },
  otherBubbleContainer: {
    alignItems: 'flex-start',
  },
  myBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  myMessageText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 20,
  },
  otherMessageText: {
    color: '#333',
    fontSize: 15,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 10,
    color: '#ADB5BD',
    marginTop: 4,
  },
  myTimeText: {
    marginRight: 4,
  },
  otherTimeText: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 25,
    paddingHorizontal: 12,
    marginRight: 10,
    minHeight: 44,
  },
  inputWrapperCompact: {
    paddingHorizontal: 8,
  },
  inputIcon: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImageHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
  },
  fullImageTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  fullImage: {
    width: '100%',
    height: '75%',
  },
});

export default IndividualChatScreen;
