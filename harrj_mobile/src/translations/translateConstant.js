import EnglishLan from '../translations/en.json';
import ArabicLan from '../translations/ar.json';
import LocalizedStrings from 'react-native-localization';

const strings = new LocalizedStrings({
  ar: ArabicLan,
  en: EnglishLan,
});

export default strings;
