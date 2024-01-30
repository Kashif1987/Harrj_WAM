import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { Icon } from '../icon';
import {
  DrawerContentScrollView,
  useIsDrawerOpen,
} from '@react-navigation/drawer';

import { useZoom } from '@zoom/react-native-videosdk';

const SDK_URL = 'https://marketplace.zoom.us';

function VersionText() {
  const [version, setVersion] = useState('');
  const zoom = useZoom();
  const isDrawerOpen = useIsDrawerOpen();

  useEffect(() => {
    isDrawerOpen && zoom.getSdkVersion().then((v: string) => setVersion(v));
  }, [zoom, isDrawerOpen]);

  return <Text style={styles.version}>Version: {version}</Text>;
}

export function MenuDrawer() {
  return (
    <DrawerContentScrollView
      contentContainerStyle={styles.container}
      scrollEnabled={false}
    >
      <SafeAreaView style={styles.contentWrapper}>
        <View>
          <Text style={styles.title}>Video SDK Playground</Text>
          <TouchableOpacity
            style={styles.itemWrapper}
            onPress={() => Linking.openURL(SDK_URL)}
          >
            <Icon name="questionBalloon" />
            <Text style={styles.itemText}>Zoom Video SDK</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </View>
        <VersionText />
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  title: {
    paddingLeft: 16,
    marginBottom: 24,
    fontSize: 20,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    marginBottom: 12,
  },
  itemText: {
    marginLeft: 24,
    fontSize: 16,
  },
  separator: {
    height: 1,
    width: '100%',
    marginLeft: 16,
    backgroundColor: '#EEE',
  },
  version: {
    alignSelf: 'center',
    color: '#666',
  },
});
