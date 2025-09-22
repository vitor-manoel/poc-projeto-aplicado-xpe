import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getAllMessages,
  updateMessageStatus,
  deleteMessage,
  clearAllMessages,
  getMessageStats,
  Message,
} from '../../database/db';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function QueueScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    done: 0,
    failed: 0,
  });
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const loadMessages = async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    try {
      const messagesData = getAllMessages();
      const statsData = getMessageStats();
      setMessages(messagesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadMessages();
  };

  const handleStatusUpdate = async (id: number, status: Message['status']) => {
    try {
      await updateMessageStatus(id, status);
      await loadMessages();
    } catch (error) {
      Alert.alert('Error', 'Failed to update message status');
    }
  };

  const handleDelete = (id: number, payload: string) => {
    Alert.alert(
      'Delete Message',
      `Are you sure you want to delete "${payload.length > 50 ? payload.substring(0, 50) + '...' : payload}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMessage(id);
              await loadMessages();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete message');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Messages',
      'Are you sure you want to delete all messages? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllMessages();
              await loadMessages();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear messages');
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadMessages(true);
    }, [])
  );

  const getStatusColor = (status: Message['status']) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'processing':
        return '#3b82f6';
      case 'done':
        return '#10b981';
      case 'failed':
        return '#ef4444';
      default:
        return colors.icon;
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'processing':
        return 'refresh-outline';
      case 'done':
        return 'checkmark-circle-outline';
      case 'failed':
        return 'close-circle-outline';
      default:
        return 'help-outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageItem, { borderColor: colors.icon + '20' }]}>
      <View style={styles.messageHeader}>
        <View style={styles.statusContainer}>
          <Ionicons
            name={getStatusIcon(item.status)}
            size={20}
            color={getStatusColor(item.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item.id, item.payload)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <Text style={[styles.messageId, { color: colors.icon }]}>ID: {item.id}</Text>
      <Text style={[styles.messagePayload, { color: colors.text }]}>{item.payload}</Text>
      <Text style={[styles.messageDate, { color: colors.icon }]}>
        Created: {formatDate(item.created_at)}
      </Text>

      <View style={styles.actionButtons}>
        {item.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
              onPress={() => handleStatusUpdate(item.id, 'processing')}
            >
              <Text style={styles.actionButtonText}>Start Processing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#10b981' }]}
              onPress={() => handleStatusUpdate(item.id, 'done')}
            >
              <Text style={styles.actionButtonText}>Mark Done</Text>
            </TouchableOpacity>
          </>
        )}
        
        {item.status === 'processing' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#10b981' }]}
              onPress={() => handleStatusUpdate(item.id, 'done')}
            >
              <Text style={styles.actionButtonText}>Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
              onPress={() => handleStatusUpdate(item.id, 'failed')}
            >
              <Text style={styles.actionButtonText}>Mark Failed</Text>
            </TouchableOpacity>
          </>
        )}

        {(item.status === 'done' || item.status === 'failed') && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
            onPress={() => handleStatusUpdate(item.id, 'pending')}
          >
            <Text style={styles.actionButtonText}>Reset to Pending</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.icon + '20',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 15,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    statLabel: {
      fontSize: 12,
      color: colors.icon,
      marginTop: 2,
    },
    clearAllButton: {
      backgroundColor: '#ef4444',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignSelf: 'center',
      marginTop: 15,
    },
    clearAllButtonText: {
      color: 'white',
      fontWeight: '600',
    },
    listContainer: {
      flex: 1,
    },
    messageItem: {
      backgroundColor: colors.background,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    messageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusText: {
      marginLeft: 6,
      fontSize: 12,
      fontWeight: '600',
    },
    deleteButton: {
      padding: 4,
    },
    messageId: {
      fontSize: 12,
      marginBottom: 4,
    },
    messagePayload: {
      fontSize: 16,
      marginBottom: 8,
      lineHeight: 22,
    },
    messageDate: {
      fontSize: 12,
      marginBottom: 12,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    actionButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    actionButtonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 18,
      color: colors.icon,
      textAlign: 'center',
      marginTop: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.emptyText, { marginTop: 16 }]}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Message Queue</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#3b82f6' }]}>{stats.processing}</Text>
            <Text style={styles.statLabel}>Processing</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#10b981' }]}>{stats.done}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#ef4444' }]}>{stats.failed}</Text>
            <Text style={styles.statLabel}>Failed</Text>
          </View>
        </View>
        {stats.total > 0 && (
          <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAll}>
            <Text style={styles.clearAllButtonText}>Clear All ({stats.total})</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.listContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color={colors.icon} />
            <Text style={styles.emptyText}>
              No messages in queue.{'\n'}Add some messages to get started!
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
