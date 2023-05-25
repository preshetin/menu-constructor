import React from "react";
import Record from "@airtable/blocks/dist/types/src/models/record";
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
} from "./shared";

type ReferenceType = {
  id: "string";
  name: "string";
};

type ReferenceRecordType = ReferenceType[] | null;

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
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
    fontSize: 9,
    // textAlign: 'justify',
    fontFamily: "Roboto",
  },
});

type MenuProps = {
  menuItem: Record;
  mealsRecords: Record[];
  mealIngredientsRecords: Record[];
  studentsCount: number;
  ingredientsRecords: Record[];
};

// Create Document Component
function MenuDocument({
  menuItem,
  mealIngredientsRecords,
  mealsRecords,
  studentsCount,
  ingredientsRecords,
}: MenuProps) {
  const dayNumber = menuItem.name;
  const dayMeals = menuItem.getCellValue("Блюда") as ReferenceRecordType;

  const mDocs = dayMeals.map((meal) => {
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

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <Text style={styles.title}>{dayNumber} </Text>
        {mDocs}
      </Page>
    </Document>
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
          {calculateTolalByPersonCount(
            studentsCount,
            el.getCellValue("Count") as number
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

  const recipe = mealRecord.getCellValueAsString("Рецепт приготовления");
  return (
    <View wrap={false}>
      <Text style={styles.subtitle}>{mealRecord.name}</Text>
      <View style={[styles.row, {}]}>
        <View style={styles.left}>
          <Text style={styles.text}>
            Ингредиенты для {studentsCount} человек:
          </Text>
          {ingredients}
        </View>
        <View style={styles.right}>
          <Text style={styles.text}>{recipe}</Text>
        </View>
      </View>
    </View>
  );
}
