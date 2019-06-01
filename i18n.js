import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
			'slogon'		: 'hi, I\'m dadiorchen! I do right thing.',
			'intro'		: 'yes, this is me, I am a full-stack developer.',
			'skill'		: 'my skills, currently I focus on JS-stack',
			'skill.button'		: 'check detail',
			'work'		: 'I created Midinote, ',
			'work.link'		: 'try it out',
    }
  },
  zh: {
    translation: {
			'slogon'		: '嗨, 我是陈征, 我选择 做正确的事',
			'intro'		: '对, 这就是我, 一个全栈开发者',
			'skill'		: '我的技能, 目前专注于JS技术栈',
			'skill.button'		: '查看细节',
			'work'		: '我创造了Midinote, ',
			'work.link'		: '试用',
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
