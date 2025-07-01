import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Platform, Switch } from 'react-native';
import { Stack } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { useAudio } from '@/utils/useAudio';

interface VolumeSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ value, onValueChange, disabled = false }) => {
  if (Platform.OS === 'web') {
    return (
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        style={{ width: '100%', opacity: disabled ? 0.5 : 1 }}
        disabled={disabled}
      />
    );
  }

  return (
    <Slider
      value={value}
      minimumValue={0}
      maximumValue={100}
      onValueChange={onValueChange}
      step={1}
      style={{ width: '100%', height: 40, opacity: disabled ? 0.5 : 1 }}
      disabled={disabled}
    />
  );
};

type SettingsSectionProps = {
  title: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
};

// Settings section component
const SettingsSection: React.FC<SettingsSectionProps> = ({ title, icon, children, isOpen, onToggle }) => {
  const [animation] = React.useState(new Animated.Value(isOpen ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  // Create opacity value for fade-in animation
  const opacity = animation;

  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <View style={styles.section}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeaderLeft}>
          <FontAwesome name={icon} size={20} color={tintColor} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitle, { color: tintColor }]}>{title}</Text>
        </View>
        <Animated.View
          style={{
            transform: [
              {
                rotateZ: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}
        >
          <FontAwesome name="chevron-down" size={16} color={tintColor} />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          style={[
            styles.sectionBody,
            {
              opacity,
            },
          ]}
        >
          <View style={styles.sectionContent}>{children}</View>
        </Animated.View>
      )}
    </View>
  );
};

// Audio settings content
const AudioSettings: React.FC = () => {
  const {
    isMuted,
    toggleMute,
    musicVolume,
    setMusicVolume,
    effectsVolume,
    setEffectsVolume,
    masterVolume,
    setMasterVolume,
    saveSettings,
  } = useAudio('opening'); // initial track

  return (
    <>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Mute</Text>
        <Switch 
          value={isMuted} 
          onValueChange={toggleMute}
          trackColor={{ false: "#767577", true: "#e57373" }}
          thumbColor={isMuted ? "#de2717" : "#f4f3f4"}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Master Volume: {masterVolume}</Text>
        <VolumeSlider
          value={masterVolume}
          onValueChange={setMasterVolume}
          disabled={isMuted}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Music Volume: {musicVolume}</Text>
        <VolumeSlider
          value={musicVolume}
          onValueChange={setMusicVolume}
          disabled={isMuted}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Sound Effects: {effectsVolume}</Text>
        <VolumeSlider
          value={effectsVolume}
          onValueChange={setEffectsVolume}
          disabled={isMuted}
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => {
          saveSettings();
        }}
      >
        <Text style={styles.buttonText}>Save Audio Settings</Text>
      </TouchableOpacity>
    </>
  );
}

// Controls settings content
const ControlsSettings: React.FC = () => {
  return (
    <>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Touch Sensitivity</Text>
        <View style={styles.slider}></View>
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Show Controls</Text>
        <View style={styles.toggle}></View>
      </View>
    </>
  );
}

// Account settings content
const AccountSettings: React.FC = () => {
  return (
    <>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Username</Text>
        <Text style={styles.settingValue}>Player123</Text>
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Email</Text>
        <Text style={styles.settingValue}>player@example.com</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </>
  );
}

// General settings content
const GeneralSettings: React.FC = () => {
  return (
    <>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Tutorial Tips</Text>
        <View style={styles.toggle}></View>
      </View>
    </>
  );
}

type SectionName = 'audio' | 'controls' | 'account' | 'general';

type OpenSectionsState = {
  [key in SectionName]: boolean;
};

export default function SettingsScreen(): React.ReactElement {
  const colorScheme = useColorScheme();
  const [openSections, setOpenSections] = React.useState<OpenSectionsState>({
    audio: true,
    controls: false,
    account: false,
    general: false
  });

  const toggleSection = (section: SectionName) => {
    setOpenSections(prev => {
      if (!prev[section]) {
        return {
          audio: false,
          controls: false,
          account: false,
          general: false,
          [section]: true
        };
      } else {
        // If the section is already open, just close it
        return {
          ...prev,
          [section]: false
        };
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'SETTINGS', 
        headerShown: true,
        headerTitleAlign: 'center',
      }} />

      {Platform.OS === 'web' ? (
        <View style={styles.webContainer}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <SettingsSection 
              title="Audio" 
              icon="volume-up" 
              isOpen={openSections.audio} 
              onToggle={() => toggleSection('audio')}
            >
              <AudioSettings />
            </SettingsSection>

            <SettingsSection 
              title="Controls" 
              icon="gamepad" 
              isOpen={openSections.controls} 
              onToggle={() => toggleSection('controls')}
            >
              <ControlsSettings />
            </SettingsSection>

            <SettingsSection 
              title="Account" 
              icon="user" 
              isOpen={openSections.account} 
              onToggle={() => toggleSection('account')}
            >
              <AccountSettings />
            </SettingsSection>

            <SettingsSection 
              title="General" 
              icon="cog" 
              isOpen={openSections.general} 
              onToggle={() => toggleSection('general')}
            >
              <GeneralSettings />
            </SettingsSection>
          </ScrollView>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SettingsSection 
            title="Audio" 
            icon="volume-up" 
            isOpen={openSections.audio} 
            onToggle={() => toggleSection('audio')}
          >
            <AudioSettings />
          </SettingsSection>

          <SettingsSection 
            title="Controls" 
            icon="gamepad" 
            isOpen={openSections.controls} 
            onToggle={() => toggleSection('controls')}
          >
            <ControlsSettings />
          </SettingsSection>

          <SettingsSection 
            title="Account" 
            icon="user" 
            isOpen={openSections.account} 
            onToggle={() => toggleSection('account')}
          >
            <AccountSettings />
          </SettingsSection>

          <SettingsSection 
            title="General" 
            icon="cog" 
            isOpen={openSections.general} 
            onToggle={() => toggleSection('general')}
          >
            <GeneralSettings />
          </SettingsSection>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  webContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  scrollView: {
    flex: 1,
    padding: 16,
    ...(Platform.OS === 'web' ? { maxWidth: 600, width: '100%' } : {}),
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionBody: {
    backgroundColor: '#f8f9fa',
  },
  sectionContent: {
    padding: 8,
  },
  settingItem: {
    flexDirection: 'column',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  toggle: {
    height: 24,
    width: 48,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
  },
  dropdown: {
    height: 30,
    width: 150,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#2f95dc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
