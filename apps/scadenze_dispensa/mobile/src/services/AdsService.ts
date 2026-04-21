import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { ADS_CONFIG } from '@shared/utils/constants';

class AdsService {
  private static instance: AdsService;
  private interstitialAd: InterstitialAd | null = null;
  private prodottiAggiunti = 0;
  private voceSpesaAggiunta = 0;
  private adLoaded = false;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): AdsService {
    if (!AdsService.instance) {
      AdsService.instance = new AdsService();
    }
    return AdsService.instance;
  }

  init(): void {
    if (this.isInitialized) return;

    this.preloadInterstitial();
    this.isInitialized = true;
  }

  private preloadInterstitial(): void {
    try {
      this.interstitialAd = InterstitialAd.createForAdRequest(
        ADS_CONFIG.INTERSTITIAL_ID
      );

      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        this.adLoaded = true;
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        this.adLoaded = false;
        this.preloadInterstitial();
      });

      this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('Interstitial ad error:', error);
        this.adLoaded = false;
      });

      this.interstitialAd.load();
    } catch (error) {
      console.error('Error preloading interstitial:', error);
    }
  }

  onProdottoAggiunto(): void {
    this.prodottiAggiunti++;
    if (this.prodottiAggiunti % 5 === 0 && this.adLoaded) {
      this.showInterstitial();
    }
  }

  onVoceSpesaAggiunta(): void {
    this.voceSpesaAggiunta++;
    if (this.voceSpesaAggiunta % 5 === 0 && this.adLoaded) {
      this.showInterstitial();
    }
  }

  private showInterstitial(): void {
    try {
      if (this.interstitialAd && this.adLoaded) {
        this.interstitialAd.show();
      }
    } catch (error) {
      console.error('Error showing interstitial:', error);
    }
  }

  getBannerId(): string {
    return ADS_CONFIG.BANNER_ID;
  }

  resetProdottiCounter(): void {
    this.prodottiAggiunti = 0;
  }

  resetVoceSpesaCounter(): void {
    this.voceSpesaAggiunta = 0;
  }
}

export const adsService = AdsService.getInstance();
