
"use strict";

const chalk = require("chalk");
const prompt = require("prompt-sync")({ sigint: true});
const cakeRecipes = require("./cake-recipes.json");



// variable containing stored recipes
let savedRecipes = [];


// funktion 1: find and display authors

function getUniqueAuthors(recipes) {
  const authors = []; // empty Array, collecting authors
  recipes.forEach((recipe) => {
    const author = recipe.Author;
    if (!authors.includes(author)) {
      authors.push(author);
    }
  });
  return authors;
}


// function 2: search for and display recipes names

function printRecipeNames(recipes) {
  if (recipes.length === 0) {
    console.log("no recipes found");
    return;
  }
  recipes.forEach((recipe) => {
    const { Name } = recipe;
    console.log(Name);
  });
}


// function 3: recipes by author

function getRecipesByAuthor(recipes, authorName) {
  return recipes.filter((recipe) => recipe.Author === authorName);
}


// function 4: search for recipes by ingredient

function getRecipesByIngredient(recipes, ingredient) {
  return recipes.filter((recipe) =>
  recipe.Ingredients.some((item) => item.includes(ingredient))
  );
}


// function 5 listing the ingredients of saved recipes

function getRecipeByName(recipes, name) {
  return recipes.find((recipe) => recipe.Name.toLowerCase().includes(name.toLowerCase()));
}


// function 6 show saved recipes

function getAllIngredients(recipes) {
        return recipes.reduce((getAllIngredients, recipe) => {
          return getAllIngredients.concat(recipe.Ingredients);
        }, []);
      }


// Part 2

const displayMenu = () => {
  console.log(chalk.green("\nRecipe Management System Menu:"));
  console.log(chalk.green("1. Show All Authors"));
  console.log(chalk.green("2. Show Recipe names by Author"));
  console.log(chalk.green("3. Show Recipe names by Ingredient"));
  console.log(chalk.green("4. Get Recipe by Name"));
  console.log(chalk.green("5. Get All Ingredients of Saved Recipes"));
  console.log(chalk.green("0. Exit"));
  const choice = prompt(chalk.green("Enter a number (1-5) or 0 to exit: "));
  return parseInt(choice);
};

let choice;

do {
  choice = displayMenu();

  switch (choice) {
    case 1:
      console.log("Unique Authors:");
      getUniqueAuthors(cakeRecipes).forEach((author) => console.log("- " + author));
    break;

    case 2:
      const authorsName = prompt("Enter author´s name: ");
      const recipesByAuthor = getRecipesByAuthor(cakeRecipes, authorsName);
      if (recipesByAuthor.length === 0) {
        console.log("no recipes found by this author.");
      } else {
        printRecipeNames(recipesByAuthor);
      }
      break;

    case 3:
      const ingredient = prompt("Enter ingredient to search for: ");
      const recipesWithIngredient = getRecipesByIngredient(cakeRecipes, ingredient);
      if (recipesWithIngredient.length === 0) {
        console.log("No recipes found with that ingredient");
      } else {
        printRecipeNames(recipesWithIngredient);
      }
      break;

    case 4:
      const searchName = prompt("Enter recipe name to search for: ");
      const foundRecipe = getRecipeByName(cakeRecipes, searchName);
      if (!foundRecipe) {
        console.log("No recipe found with that name.");
      } else {
        console.log("Recipe found:");
        console.log("Name:", foundRecipe.Name);
        console.log("Author:", foundRecipe.Author);
        console.log("Ingredients:");
        foundRecipe.Ingredients.forEach((ing) => console.log("- " + ing));

        const save = prompt("Save this recipe for your shopping list= (yes/no): ");
        if(save.toLowerCase() === "yes") {
          savedRecipes.push(foundRecipe);
          console.log("recipe saved!");
        }
      }
      break;

    case 5:
      if (savedRecipes.length === 0) {
        console.log("No recipes saved yet.");
      } else {
      console.log("All ingredients from saved recipes:");
      const allIngredients = getAllIngredients(savedRecipes);
      allIngredients.forEach((ingredient) => console.log("- " + ingredient));
}
      break;

    case 0:
      console.log("K Bye!");
      break;
    default:
      console.log("Invalid input. Please enter a number between 0 and 5.");
  }
} while (choice !== 0);
