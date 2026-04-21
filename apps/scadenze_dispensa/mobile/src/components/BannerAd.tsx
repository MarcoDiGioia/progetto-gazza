import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd as RNBannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import { ADS_CONFIG } from '@shared/utils/constants';

interface BannerAdProps {
  size?: BannerAdSize;
}

export default function BannerAd({ size }: BannerAdProps) {
  return (
    <View style={styles.container}>
      <RNBannerAd
        unitId={ADS_CONFIG.BANNER_ID}
        size={size??BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
});
