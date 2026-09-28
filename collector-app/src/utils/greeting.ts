import { Language } from '../types';

export function getTimeBasedGreeting(lang: Language): string {
  const hour = new Date().getHours();

  // 5:00 AM (5) to 11:59 AM (11) -> morning
  // 12:00 PM (12) to 4:59 PM (16) -> afternoon
  // 5:00 PM (17) to 8:59 PM (20) -> evening
  // 9:00 PM (21) to 4:59 AM (4) -> night
  let period: 'morning' | 'afternoon' | 'evening' | 'night';

  if (hour >= 5 && hour < 12) {
    period = 'morning';
  } else if (hour >= 12 && hour < 17) {
    period = 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    period = 'evening';
  } else {
    period = 'night';
  }

  const greetings: Record<Language, Record<typeof period, string>> = {
    en: {
      morning: 'Good morning, Collector',
      afternoon: 'Good afternoon, Collector',
      evening: 'Good evening, Collector',
      night: 'Good night, Collector',
    },
    hi: {
      morning: 'शुभ प्रभात, कलेक्टर',
      afternoon: 'शुभ दोपहर, कलेक्टर',
      evening: 'शुभ संध्या, कलेक्टर',
      night: 'शुभ रात्रि, कलेक्टर',
    },
    mr: {
      morning: 'शुभ प्रभात, कलेक्टर',
      afternoon: 'शुभ दुपार, कलेक्टर',
      evening: 'शुभ संध्या, कलेक्टर',
      night: 'शुभ रात्री, कलेक्टर',
    },
  };

  return greetings[lang]?.[period] || greetings['en'][period];
}
