import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const translationEnglish = {
  ingredientsForCountPeople:
    "Ingredients for {{studentsCount}} people",
  line2:
    "Space exploration is a study of the cosmos. There are many aspects of the universe that we do not fully understand.",
  line3:
    "Astronauts visit space and report back to us on their experiences there.",
};

const translationRussian = {
  ingredientsForCountPeople:
    "Ингредиенты для {{studentsCount}} человек",
  line2:
    "L'exploration spatiale est une étude du cosmos. Il y a de nombreux aspects de l'univers que nous ne comprenons pas entièrement.",
  line3:
    "Les astronautes visitent l'espace et nous rapportent leurs expériences là-bas.",
};

//---Using translation
const resources = {
    en: {
        translation: translationEnglish,
    },
    ru: {
        translation: translationRussian,
    },
    // fr: {
    //     translation: translationFrench,
    // },
}

//---Using different namespaces
// const resources = {
//   en: {
//     home: translationEnglish,
//   },
//   ru: {
//     home: translationRussian,
//   },
//   //    fr: {
//   //        home: translationFrench,
//   //    },
// };

i18next.use(initReactI18next).init({
  resources,
  lng: "ru", //default language
});

export default i18next;
