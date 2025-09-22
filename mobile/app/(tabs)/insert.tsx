import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { enqueueMessage } from '../../database/db';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function InsertScreen() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleInsert = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    setIsLoading(true);
    try {
      await enqueueMessage(message.trim());
      setMessage('');
      Alert.alert('Success', 'Message added to queue!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add message to queue');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleMessage = () => {
    const samples = [
      'Process order #12345',
      'Send welcome email to user',
      'Update inventory for product X',
      'Generate monthly report',
      'Backup database',
      'Send push notification',
      'Clean temporary files',
      'Sync user preferences',
    ];
    const randomMessage = samples[Math.floor(Math.random() * samples.length)];
    setMessage(randomMessage);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.icon,
      marginBottom: 40,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    textInput: {
      borderWidth: 2,
      borderColor: colors.icon,
      backgroundColor: colors.background,
      color: colors.text,
      padding: 15,
      borderRadius: 10,
      fontSize: 16,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      gap: 15,
    },
    primaryButton: {
      backgroundColor: colors.tint,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    primaryButtonDisabled: {
      backgroundColor: colors.icon,
    },
    primaryButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.tint,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    secondaryButtonText: {
      color: colors.tint,
      fontSize: 16,
      fontWeight: '600',
    },
    messageCounter: {
      alignSelf: 'flex-end',
      color: colors.icon,
      fontSize: 12,
      marginTop: 5,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Message Queue</Text>
          <Text style={styles.subtitle}>Add messages to the processing queue</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Message Content</Text>
            <TextInput
              style={styles.textInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Enter your message here..."
              placeholderTextColor={colors.icon}
              multiline
              maxLength={500}
            />
            <Text style={styles.messageCounter}>{message.length}/500</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (isLoading || !message.trim()) && styles.primaryButtonDisabled,
              ]}
              onPress={handleInsert}
              disabled={isLoading || !message.trim()}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Adding to Queue...' : 'Add to Queue'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={generateSampleMessage}
            >
              <Text style={styles.secondaryButtonText}>Generate Sample Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
