import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const translationEnglish = {
  ingredientsForCountPeople:
    "Ingredients for {{studentsCount}} people",
  recipeFieldName:
    "Recipe EN",
  line3:
    "Astronauts visit space and report back to us on their experiences there.",
};

const translationRussian = {
  ingredientsForCountPeople:
    "Ингредиенты для {{studentsCount}} человек",
  recipeFieldName:
    "Рецепт приготовления",
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
