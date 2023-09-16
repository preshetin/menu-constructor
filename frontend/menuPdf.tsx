import React from "react";
import showdown from "showdown";
import Html from "react-pdf-html";
import Record from "@airtable/blocks/dist/types/src/models/record";
import i18next from "./i18n";
import {
  Page,
  Text,
  Document,
  StyleSheet,
  Font,
  View,
} from "@react-pdf/renderer";
import {
  calculateTolalByPersonCount,
  getIngredientsForMealsList,
  getMeasureTotalPointByIngredientName,
  getPersonCountByMeal,
  IngredientWithPortion,
  RECIPE_FIELD_NAME,
} from "./shared";
import { globalConfig } from "@airtable/blocks";

type ReferenceType = {
  id: "string";
  name: "string";
};

type ReferenceRecordType = ReferenceType[] | null;

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    fontFamily: "Roboto",
  },
  title: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 0,
    marginLeft: 6,
    marginRight: 6,
    fontFamily: "Roboto",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 2,
  },
  listItem: {
    marginLeft: 8,
    fontSize: 8,
    fontFamily: "Roboto",
  },
  text: {
    margin: 6,
    fontSize: 8,
    // textAlign: 'justify',
    fontFamily: "Roboto",
  },
});

type MenuProps = {
  dayRecord: Record;
  mealsRecords: Record[];
  mealIngredientsRecords: Record[];
  ingredientsRecords: Record[];
};

// Create Document Component
function MenuDocument({
  dayRecord,
  mealIngredientsRecords,
  mealsRecords,
  ingredientsRecords,
}: MenuProps) {

  const studentsCount = globalConfig.get('studentsCount') as unknown as number;
  const newStudentsCount = globalConfig.get('newStudentsCount') as unknown as number;

  const breakfastMeals = dayRecord.getCellValue("Завтрак")
    ? (dayRecord.getCellValue("Завтрак") as ReferenceType[])
    : [];
  const lunchMeals = dayRecord.getCellValue("Обед")
    ? (dayRecord.getCellValue("Обед") as ReferenceType[])
    : [];
  const teaMeals = dayRecord.getCellValue("Полдник")
    ? (dayRecord.getCellValue("Полдник") as ReferenceType[])
    : [];

  let dayMeals: ReferenceType[] = [];
  dayMeals = dayMeals.concat(breakfastMeals);
  dayMeals = dayMeals.concat(lunchMeals);
  dayMeals = dayMeals.concat(teaMeals);

  const breakfastCookMealDocuments = breakfastMeals.filter(meal => {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    return mealRecord.getCellValueAsString('Тип блюда') !== 'Раздача'
  }).map((meal) => {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    return (
      <MealDocument
        key={meal.id}
        mealIngredientsRecords={mealIngredientsRecords}
        mealRecord={mealRecord}
        ingredientsRecords={ingredientsRecords}
      />
    );
  });

  const breakfastDistributionMealDocuments = breakfastMeals.filter(meal => {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    return mealRecord.getCellValueAsString('Тип блюда') === 'Раздача'
  }).map((meal) => {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    return (
      <MealDocument
        key={meal.id}
        mealIngredientsRecords={mealIngredientsRecords}
        mealRecord={mealRecord}
        ingredientsRecords={ingredientsRecords}
      />
    );
  });

  const lunchCookMealDocuments = lunchMeals.filter(meal => {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    return mealRecord.getCellValueAsString('Тип блюда') !== 'Раздача'
  }).map((meal) => {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    return (
      <MealDocument
        key={meal.id}
        mealIngredientsRecords={mealIngredientsRecords}
        mealRecord={mealRecord}
        ingredientsRecords={ingredientsRecords}
      />
    );
  });

  const lunchDistributionMealDocuments = lunchMeals.filter(meal => {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    return mealRecord.getCellValueAsString('Тип блюда') === 'Раздача'
  }).map((meal) => {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    return (
      <MealDocument
        key={meal.id}
        mealIngredientsRecords={mealIngredientsRecords}
        mealRecord={mealRecord}
        ingredientsRecords={ingredientsRecords}
      />
    );
  });


  const teaCookMealDocuments = teaMeals.filter(meal => {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    return mealRecord.getCellValueAsString('Тип блюда') !== 'Раздача'
  }).map((meal) => {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    return (
      <MealDocument
        key={meal.id}
        mealIngredientsRecords={mealIngredientsRecords}
        mealRecord={mealRecord}
        ingredientsRecords={ingredientsRecords}
      />
    );
  });


  const teaDistributionMealDocuments = teaMeals.filter(meal => {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    return mealRecord.getCellValueAsString('Тип блюда') === 'Раздача'
  }).map((meal) => {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    return (
      <MealDocument
        key={meal.id}
        mealIngredientsRecords={mealIngredientsRecords}
        mealRecord={mealRecord}
        ingredientsRecords={ingredientsRecords}
      />
    );
  });

  const ingredientsForTheDayArr = getIngredientsForMealsList(dayMeals, {mealsRecords, mealIngredientsRecords, ingredientsRecords, studentsCount, newStudentsCount});

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <Text style={{ ...styles.title, marginBottom: 10 }}>{dayRecord.name} — Раздача </Text>
        {breakfastDistributionMealDocuments.length && (
          <View style={{ marginBottom: 0 }}>
            <Text
              style={{
                ...styles.title,
                border: 1,
                borderBottom: 0,
                backgroundColor: "lightgray",
              }}
            >
              Завтрак
            </Text>
            <View style={{ border: 1, borderTop: 0, borderBottom: 0, padding: 5 }}>{breakfastDistributionMealDocuments}</View>
          </View>
        )}
        {lunchDistributionMealDocuments.length && (
          <View style={{ marginBottom: 0 }}>
            <Text
              style={{
                ...styles.title,
                border: 1,
                borderBottom: 0,
                backgroundColor: "lightgray",
              }}
            >
              Обед
            </Text>
            <View style={{ border: 1, borderTop: 0, borderBottom: 0, padding: 5 }}>{lunchDistributionMealDocuments}</View>
          </View>
        )}
        {teaDistributionMealDocuments.length && (
          <View style={{ marginBottom: 0 }}>
            <Text
              style={{
                ...styles.title,
                border: 1,
                borderBottom: 0,
                backgroundColor: "lightgray",
              }}
            >
              Полдник
            </Text>
            <View style={{ border: 1, borderTop: 0, padding: 5 }}>{teaDistributionMealDocuments}</View>
          </View>
        )}
      </Page>
      <Page size="A4" style={styles.body}>
        <Text style={{ ...styles.title, marginBottom: 10 }}>{dayRecord.name} — Меню для повара </Text>
        {breakfastCookMealDocuments.length && (
          <View style={{ marginBottom: 0 }}>
            <Text
              style={{
                ...styles.title,
                border: 1,
                borderBottom: 0,
                backgroundColor: "lightgray",
              }}
            >
              Завтрак
            </Text>
            <View style={{ border: 1, borderTop: 0, borderBottom: 0, padding: 5 }}>{breakfastCookMealDocuments}</View>
          </View>
        )}
        {lunchCookMealDocuments.length && (
          <View style={{ marginBottom: 0 }}>
            <Text
              style={{
                ...styles.title,
                border: 1,
                borderBottom: 0,
                backgroundColor: "lightgray",
              }}
            >
              Обед
            </Text>
            <View style={{ border: 1, borderTop: 0, borderBottom: 0, padding: 5 }}>{lunchCookMealDocuments}</View>
          </View>
        )}
        {teaCookMealDocuments.length && (
          <View style={{ marginBottom: 0 }}>
            <Text
              style={{
                ...styles.title,
                border: 1,
                borderBottom: 0,
                backgroundColor: "lightgray",
              }}
            >
              Полдник
            </Text>
            <View style={{ border: 1, borderTop: 0, padding: 5 }}>{teaCookMealDocuments}</View>
          </View>
        )}
        <View wrap={false}>
          <Text style={{ ...styles.title, marginTop: 20, marginBottom: 10 }}>
            Все продукты дня {" "}
          </Text>
          <Text style={{ ...styles.text }}>
            Указано количество нетто (без кожуры)
          </Text>
          {ingredientsForTheDayArr.map((el) => (
            <IngredientItem ingredientWithPortion={el} />
          ))}
        </View>
      </Page>
    </Document>
  );
}

function IngredientItem({
  ingredientWithPortion,
}: {
  ingredientWithPortion: IngredientWithPortion;
}) {
  return (
    <View
      style={{
        ...styles.row,
        margin: 1,
      }}
    >
      <View style={{ flex: 3, borderBottom: 0.5 }}>
        <Text style={styles.listItem}>{ingredientWithPortion.ingredient}</Text>
      </View>
      <View style={{ flex: 1, borderBottom: 0.5 }}>
        <Text style={styles.listItem}>
          {Math.round(ingredientWithPortion.count * 10) / 10}
        </Text>
      </View>
      <View style={{ flex: 1, borderBottom: 0.5 }}>
        <Text style={styles.listItem}>{ingredientWithPortion.type}</Text>
      </View>
      <View style={{ flex: 7 }}></View>
    </View>
  );
}

export default MenuDocument;

type MealDocumentProps = {
  mealRecord: Record;
  mealIngredientsRecords: Record[];
  ingredientsRecords: Record[];
};

function MealDocument({
  mealRecord,
  mealIngredientsRecords,
  ingredientsRecords,
}: MealDocumentProps): JSX.Element {
  const currentMealIngredients = mealIngredientsRecords.filter((el) => {
    const cell = el.getCellValue("Meal") as any; // TODO: find out Type
    return cell[0].name === mealRecord.name;
  });

  const studentsCount = globalConfig.get('studentsCount') as unknown as number;
  const newStudentsCount = globalConfig.get('newStudentsCount') as unknown as number;

  const personCount = getPersonCountByMeal(mealRecord, {studentsCount, newStudentsCount});

  const ingredients = currentMealIngredients.map((el) => (
    <View style={styles.row}>
      <View style={styles.right}>
        <Text style={styles.listItem}>
          {el.getCellValueAsString("Ingredient")}
        </Text>
      </View>
      <View style={styles.left}>
        <Text style={styles.listItem}>
          {calculateTolalByPersonCount({
            personCount,
            count: el.getCellValue("Count") as number,
            measurePoint: getMeasureTotalPointByIngredientName( ingredientsRecords, el.getCellValueAsString("Ingredient"))
          }
          )}
        </Text>
      </View>
      <View style={styles.left}>
        <Text style={styles.listItem}>
          {getMeasureTotalPointByIngredientName(
            ingredientsRecords,
            el.getCellValueAsString("Ingredient")
          )}
        </Text>
      </View>
    </View>
  ));

  const recipe = mealRecord.getCellValue(
    i18next.t("recipeFieldName")
  ) as string;
  const converter = new showdown.Converter();
  converter.setOption('simpleLineBreaks', true);
  const recipeHtml = converter.makeHtml(recipe);
  return (
    <View wrap={false}>
      <Text style={styles.subtitle}>{mealRecord.name}</Text>
      <View style={[styles.row, {}]}>
        <View style={styles.left}>
          <Text style={styles.text}>
            {i18next.t("ingredientsForCountPeople", { personCount })}:
          </Text>
          {ingredients}
        </View>
        <View style={styles.right}>
          <Html style={{ fontSize: 8 }}>{recipeHtml}</Html>
        </View>
      </View>
    </View>
  );
}
