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
  getMeasureTotalPointByIngredientName,
  IngredientWithPortion,
  RECIPE_FIELD_NAME,
} from "./shared";

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
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: "Roboto",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 0,
    marginLeft: 8,
    marginRight: 8,
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
    fontSize: 9,
    fontFamily: "Roboto",
  },
  text: {
    margin: 8,
    fontSize: 8,
    // textAlign: 'justify',
    fontFamily: "Roboto",
  },
});

type MenuProps = {
  dayRecord: Record;
  mealsRecords: Record[];
  mealIngredientsRecords: Record[];
  studentsCount: number;
  ingredientsRecords: Record[];
};

// Create Document Component
function MenuDocument({
  dayRecord,
  mealIngredientsRecords,
  mealsRecords,
  studentsCount,
  ingredientsRecords,
}: MenuProps) {
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
        studentsCount={studentsCount}
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
        studentsCount={studentsCount}
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
        studentsCount={studentsCount}
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
        studentsCount={studentsCount}
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
        studentsCount={studentsCount}
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
        studentsCount={studentsCount}
        ingredientsRecords={ingredientsRecords}
      />
    );
  });


  let ingredientsForTheDayArr: IngredientWithPortion[] = [];

  for (const meal of dayMeals) {
    const mealRecord = mealsRecords.find((el) => el.id === meal.id);
    const currentMealIngredients = mealIngredientsRecords.filter((el) => {
      const cell = el.getCellValue("Meal") as any; // TODO: find out Type
      return cell[0].name === mealRecord.name;
    });
    ingredientsForTheDayArr = ingredientsForTheDayArr.concat(
      currentMealIngredients.map((el) => ({
        ingredient: el.getCellValueAsString("Ingredient"),
        count: calculateTolalByPersonCount({
          studentsCount,
          count: el.getCellValue("Count") as number,
          measurePoint: getMeasureTotalPointByIngredientName( ingredientsRecords, el.getCellValueAsString("Ingredient"))
        }),
        type: getMeasureTotalPointByIngredientName(
          ingredientsRecords,
          el.getCellValueAsString("Ingredient")
        ),
      }))
    );
  }

  let combinedIngredientsForTheDayArr: IngredientWithPortion[] = [];

  for (const ingredientForTheDay of ingredientsForTheDayArr) {
    if (
      combinedIngredientsForTheDayArr.some(
        (el) => el.ingredient === ingredientForTheDay.ingredient
      )
    ) {
      combinedIngredientsForTheDayArr.find((el, i) => {
        if (el.ingredient === ingredientForTheDay.ingredient) {
          combinedIngredientsForTheDayArr[i] = {
            ingredient: el.ingredient,
            count: el.count + ingredientForTheDay.count,
            type: el.type,
          };
        }
      });
    } else {
      combinedIngredientsForTheDayArr.push(ingredientForTheDay);
    }
  }
  combinedIngredientsForTheDayArr = combinedIngredientsForTheDayArr
    .filter((el) => el.ingredient !== "Вода")
    .sort((a, b) => b.count - a.count);

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <Text style={{ ...styles.title, marginBottom: 10 }}>{dayRecord.name} — Раздача </Text>
        {breakfastDistributionMealDocuments.length && (
          <View style={{ marginBottom: 15 }}>
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
            <View style={{ border: 1 }}>{breakfastDistributionMealDocuments}</View>
          </View>
        )}
        {lunchDistributionMealDocuments.length && (
          <View style={{ marginBottom: 15 }}>
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
            <View style={{ border: 1 }}>{lunchDistributionMealDocuments}</View>
          </View>
        )}
        {teaDistributionMealDocuments.length && (
          <View style={{ marginBottom: 15 }}>
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
            <View style={{ border: 1 }}>{teaDistributionMealDocuments}</View>
          </View>
        )}
      </Page>
      <Page size="A4" style={styles.body}>
        <Text style={{ ...styles.title, marginBottom: 10 }}>{dayRecord.name} — Меню для повара </Text>
        {breakfastCookMealDocuments.length && (
          <View style={{ marginBottom: 15 }}>
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
            <View style={{ border: 1 }}>{breakfastCookMealDocuments}</View>
          </View>
        )}
        {lunchCookMealDocuments.length && (
          <View style={{ marginBottom: 15 }}>
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
            <View style={{ border: 1 }}>{lunchCookMealDocuments}</View>
          </View>
        )}
        {teaCookMealDocuments.length && (
          <View style={{ marginBottom: 15 }}>
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
            <View style={{ border: 1 }}>{teaCookMealDocuments}</View>
          </View>
        )}
        <Text style={{ ...styles.title, marginTop: 20, marginBottom: 10 }}>
          Все продукты дня {" "}
        </Text>
        <View wrap={false}>
          {combinedIngredientsForTheDayArr.map((el) => (
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
  studentsCount: number;
  ingredientsRecords: Record[];
};

function MealDocument({
  mealRecord,
  mealIngredientsRecords,
  studentsCount,
  ingredientsRecords,
}: MealDocumentProps): JSX.Element {
  const currentMealIngredients = mealIngredientsRecords.filter((el) => {
    const cell = el.getCellValue("Meal") as any; // TODO: find out Type
    return cell[0].name === mealRecord.name;
  });

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
            studentsCount,
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
            {i18next.t("ingredientsForCountPeople", { studentsCount })}:
          </Text>
          {ingredients}
        </View>
        <View style={styles.right}>
          <Html style={{ fontSize: 9 }}>{recipeHtml}</Html>
        </View>
      </View>
    </View>
  );
}
