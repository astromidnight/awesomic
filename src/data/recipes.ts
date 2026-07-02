import type { Recipe, Ingredient, RecipeStep, Difficulty, Diet, Intolerance, Equipment } from './types'
import pastaCard from '../assets/food/pasta-card.jpg'
import pastaHero from '../assets/food/pasta-hero.jpg'
import lemonChicken from '../assets/food/lemon-chicken.jpg'
import misoSalmon from '../assets/food/miso-salmon.jpg'
import veggieTacos from '../assets/food/veggie-tacos.jpg'
import result1 from '../assets/food/result-1.jpg'
import result2 from '../assets/food/result-2.jpg'
import result3 from '../assets/food/result-3.jpg'
import result4 from '../assets/food/result-4.jpg'

export const heroImages: Record<string, string> = {
  'creamy-garlic-pasta': pastaHero,
}

/** Ingredients the onboarding flow detects by default. */
export const defaultPantry = [
  'pasta', 'garlic', 'parmesan', 'olive oil', 'salt', 'black pepper',
  'chili flakes', 'parsley', 'onion', 'rice', 'eggs', 'soy sauce',
  'lemon', 'chicken breast', 'tomatoes', 'spinach', 'oats', 'milk',
  'honey', 'tortillas', 'bell pepper', 'avocado', 'bread', 'cheddar',
  'green beans', 'cinnamon',
]

const ing = (id: string, quantity: number, unit: string, substitutable = false): Ingredient => ({
  id,
  name: id,
  quantity,
  unit,
  substitutable,
})

const step = (text: string, timerSeconds?: number): RecipeStep => ({ text, timerSeconds })

// Warm gradient placeholders extracted from the Figma frames
const G = {
  wheat: ['#F6E0B0', '#E7AF5F'],
  honey: ['#FAE7A3', '#EFBD5A'],
  coral: ['#FACBAF', '#E66F5A'],
  sage: ['#D8ECC4', '#96C773'],
  lilac: ['#ECCFEA', '#BD8CCE'],
  amber: ['#F6DAA5', '#E09852'],
  mint: ['#D4EACD', '#7ABA82'],
  peach: ['#F9CFB4', '#E78266'],
  moss: ['#CFE7BD', '#8ABF73'],
  sand: ['#F2E5C7', '#D9BC7E'],
} satisfies Record<string, [string, string]>

interface Seed {
  id: string
  title: string
  image?: string
  gradient: [string, string]
  rating: number
  ratingCount: number
  timeMinutes: number
  difficulty: Difficulty
  kcal: number
  ingredients: Ingredient[]
  steps: RecipeStep[]
  tags?: string[]
  equipment?: Equipment[]
  diets?: Diet[]
  freeOf?: Intolerance[]
}

const make = (s: Seed): Recipe => ({
  tags: [],
  equipment: ['Stovetop'],
  diets: [],
  freeOf: [],
  ...s,
})

export const recipes: Recipe[] = [
  // ————— The hero recipe: fully cookable, matches every hi-fi frame —————
  make({
    id: 'creamy-garlic-pasta',
    title: 'Creamy Garlic Pasta',
    image: pastaCard,
    gradient: G.wheat,
    rating: 4.8,
    ratingCount: 312,
    timeMinutes: 25,
    difficulty: 'Easy',
    kcal: 620,
    ingredients: [
      ing('pasta', 2, 'cups'),
      ing('butter', 3, 'tbsp', true),
      ing('garlic', 4, 'cloves'),
      ing('heavy cream', 1, 'cup', true),
      ing('parmesan', 0.5, 'cup', true),
      ing('olive oil', 1, 'tbsp'),
      ing('salt', 1, 'tsp'),
      ing('black pepper', 0.5, 'tsp'),
      ing('parsley', 2, 'tbsp'),
      ing('chili flakes', 0.25, 'tsp'),
    ],
    steps: [
      step('Bring a large pot of salted water to a boil, then add the pasta.', 8 * 60),
      step('Add the butter and minced garlic. Stir for 2 minutes until fragrant.', 2 * 60),
      step('Pour in the cream and parmesan. Simmer gently until the sauce thickens.', 4 * 60),
      step('Toss the drained pasta through the sauce until every strand is coated.'),
      step('Season with salt, pepper and chili flakes. Loosen with pasta water if needed.', 60),
      step('Plate up, top with parsley and extra parmesan. Buon appetito!'),
    ],
    tags: ['Comfort food', 'One-pan', '15-min'],
    equipment: ['Stovetop'],
    diets: ['Vegetarian'],
    freeOf: ['Nut-free'],
  }),

  // ————— Home carousel + recommended —————
  make({
    id: 'lemon-chicken-bowl',
    title: 'Lemon Chicken Bowl',
    image: lemonChicken,
    gradient: G.honey,
    rating: 4.6, ratingCount: 204, timeMinutes: 30, difficulty: 'Easy', kcal: 480,
    ingredients: [
      ing('chicken breast', 2, 'pieces', true), ing('rice', 1, 'cup'),
      ing('lemon', 1, 'whole'), ing('garlic', 2, 'cloves'), ing('olive oil', 2, 'tbsp'),
      ing('spinach', 2, 'cups'), ing('greek yogurt', 0.5, 'cup', true), ing('cucumber', 1, 'whole'),
    ],
    steps: [
      step('Cook the rice in salted water until fluffy.', 12 * 60),
      step('Sear the chicken in olive oil with garlic until golden.', 6 * 60),
      step('Squeeze over the lemon and let it bubble into a glaze.', 2 * 60),
      step('Build the bowl: rice, spinach, chicken, yogurt and cucumber.'),
    ],
    tags: ['High-Protein', 'Meal prep'],
    diets: [], freeOf: ['Gluten-free', 'Nut-free'],
  }),
  make({
    id: 'spicy-ramen-bowl',
    title: 'Spicy Ramen Bowl',
    gradient: G.coral,
    rating: 4.7, ratingCount: 188, timeMinutes: 20, difficulty: 'Medium', kcal: 540,
    ingredients: [
      ing('ramen noodles', 2, 'portions', true), ing('eggs', 2, 'large'),
      ing('garlic', 3, 'cloves'), ing('soy sauce', 2, 'tbsp'), ing('chili flakes', 1, 'tsp'),
      ing('onion', 0.5, 'whole'), ing('spinach', 1, 'cup'), ing('chicken breast', 1, 'pieces', true),
      ing('sesame oil', 1, 'tbsp', true), ing('mushrooms', 1, 'cup'),
    ],
    steps: [
      step('Simmer the broth with garlic, soy and chili flakes.', 5 * 60),
      step('Soft-boil the eggs and slice the chicken.', 7 * 60),
      step('Cook the noodles right in the broth.', 3 * 60),
      step('Top with spinach, mushrooms, egg and a drizzle of sesame oil.'),
    ],
    tags: ['Spicy', 'Comfort food'],
  }),
  make({
    id: 'avocado-toast',
    title: 'Avocado Toast',
    gradient: G.sage,
    rating: 4.5, ratingCount: 143, timeMinutes: 10, difficulty: 'Easy', kcal: 320,
    ingredients: [
      ing('bread', 2, 'slices'), ing('avocado', 1, 'whole'), ing('eggs', 2, 'large'),
      ing('lemon', 0.5, 'whole'), ing('olive oil', 1, 'tbsp'), ing('salt', 0.5, 'tsp'),
      ing('black pepper', 0.25, 'tsp'), ing('chili flakes', 0.25, 'tsp'),
      ing('tomatoes', 0.5, 'cup'), ing('feta', 0.25, 'cup', true),
    ],
    steps: [
      step('Toast the bread until deeply golden.', 3 * 60),
      step('Mash the avocado with lemon, salt and olive oil.'),
      step('Fry the eggs sunny side up.', 3 * 60),
      step('Stack, top with tomatoes, feta and chili flakes.'),
    ],
    tags: ['15-min', 'Vegetarian'],
    diets: ['Vegetarian'], freeOf: ['Nut-free'],
  }),
  make({
    id: 'berry-overnight-oats',
    title: 'Berry Overnight Oats',
    gradient: G.lilac,
    rating: 4.8, ratingCount: 231, timeMinutes: 5, difficulty: 'Easy', kcal: 390,
    ingredients: [
      ing('oats', 1, 'cup'), ing('milk', 1, 'cup', true), ing('honey', 1, 'tbsp', true),
      ing('cinnamon', 0.5, 'tsp'), ing('lemon', 0.25, 'whole'), ing('salt', 0.13, 'tsp'),
      ing('mixed berries', 1, 'cup'),
    ],
    steps: [
      step('Stir the oats, milk, honey, cinnamon and salt together.'),
      step('Fold through half the berries.'),
      step('Refrigerate overnight; top with the rest of the berries to serve.'),
    ],
    tags: ['Meal prep', 'Under 500 kcal'],
    equipment: ['Microwave'],
    diets: ['Vegetarian'], freeOf: ['Gluten-free', 'Nut-free'],
  }),
  make({
    id: 'sheet-pan-fajitas',
    title: 'Sheet-Pan Fajitas',
    gradient: G.amber,
    rating: 4.6, ratingCount: 167, timeMinutes: 35, difficulty: 'Easy', kcal: 510,
    ingredients: [
      ing('chicken breast', 2, 'pieces', true), ing('bell pepper', 2, 'whole'),
      ing('onion', 1, 'whole'), ing('olive oil', 2, 'tbsp'), ing('tortillas', 6, 'pieces'),
      ing('garlic', 2, 'cloves'), ing('lime', 1, 'whole', true), ing('cumin', 1, 'tsp'),
      ing('sour cream', 0.5, 'cup', true), ing('cilantro', 0.25, 'cup', true),
    ],
    steps: [
      step('Heat the oven to 220°C with a sheet pan inside.', 10 * 60),
      step('Toss chicken, peppers and onion with oil, garlic and cumin.'),
      step('Roast until charred at the edges.', 18 * 60),
      step('Warm the tortillas and serve with lime, sour cream and cilantro.'),
    ],
    tags: ['One-pan', 'High-Protein'],
    equipment: ['Oven'],
    freeOf: ['Nut-free'],
  }),
  make({
    id: 'green-curry-noodles',
    title: 'Green Curry Noodles',
    gradient: G.mint,
    rating: 4.9, ratingCount: 275, timeMinutes: 25, difficulty: 'Medium', kcal: 560,
    ingredients: [
      ing('rice noodles', 2, 'portions'), ing('green curry paste', 2, 'tbsp'),
      ing('coconut milk', 1, 'cup'), ing('garlic', 2, 'cloves'), ing('onion', 0.5, 'whole'),
      ing('spinach', 2, 'cups'), ing('soy sauce', 1, 'tbsp'), ing('lime', 1, 'whole', true),
      ing('chili flakes', 0.5, 'tsp'),
    ],
    steps: [
      step('Fry the curry paste with garlic and onion until fragrant.', 2 * 60),
      step('Pour in the coconut milk and simmer.', 5 * 60),
      step('Soak the noodles, then fold them into the sauce with spinach.', 4 * 60),
      step('Finish with soy, lime and chili flakes.'),
    ],
    tags: ['Vegan', 'Spicy'],
    diets: ['Vegan', 'Vegetarian'], freeOf: ['Dairy-free', 'Gluten-free'],
  }),
  make({
    id: 'miso-glazed-salmon',
    title: 'Miso Glazed Salmon',
    image: misoSalmon,
    gradient: G.peach,
    rating: 4.9, ratingCount: 321, timeMinutes: 30, difficulty: 'Medium', kcal: 520,
    ingredients: [
      ing('salmon', 2, 'fillet'), ing('miso paste', 2, 'tbsp'),
      ing('soy sauce', 2, 'tbsp'), ing('honey', 1, 'tbsp', true), ing('garlic', 2, 'cloves'),
      ing('rice', 1, 'cup'), ing('spinach', 2, 'cups'), ing('lemon', 0.5, 'whole'),
      ing('sesame seeds', 1, 'tbsp'),
    ],
    steps: [
      step('Whisk miso, soy, honey and garlic into a glaze.'),
      step('Brush the salmon and let it marinate.', 10 * 60),
      step('Roast until the glaze caramelises.', 12 * 60),
      step('Serve over rice with wilted spinach, lemon and sesame.'),
    ],
    tags: ['High-Protein'],
    equipment: ['Oven'],
    diets: ['Pescatarian'], freeOf: ['Dairy-free'],
  }),
  make({
    id: 'crunchy-veggie-tacos',
    title: 'Crunchy Veggie Tacos',
    image: veggieTacos,
    gradient: G.moss,
    rating: 4.7, ratingCount: 198, timeMinutes: 20, difficulty: 'Easy', kcal: 450,
    ingredients: [
      ing('tortillas', 6, 'pieces'), ing('avocado', 1, 'whole'), ing('tomatoes', 1, 'cup'),
      ing('onion', 0.5, 'whole'), ing('cheddar', 0.5, 'cup', true), ing('chili flakes', 0.5, 'tsp'),
      ing('olive oil', 1, 'tbsp'), ing('black beans', 1, 'cup'), ing('corn', 0.5, 'cup'),
      ing('lime', 1, 'whole', true),
    ],
    steps: [
      step('Crisp the tortillas in a dry pan.', 3 * 60),
      step('Warm the beans and corn with chili flakes.', 4 * 60),
      step('Chop the salsa: tomatoes, onion, lime.'),
      step('Load the shells and top with avocado and cheddar.'),
    ],
    tags: ['Vegetarian', '15-min'],
    diets: ['Vegetarian'], freeOf: ['Gluten-free', 'Nut-free'],
  }),

  // ————— "garlic pasta" search results (24 incl. the hero + pesto pasta) —————
  make({
    id: 'garlic-butter-shrimp',
    title: 'Garlic Butter Shrimp',
    image: result2,
    gradient: G.peach,
    rating: 4.6, ratingCount: 178, timeMinutes: 20, difficulty: 'Easy', kcal: 410,
    ingredients: [
      ing('shrimp', 300, 'g'), ing('butter', 2, 'tbsp', true), ing('garlic', 4, 'cloves'),
      ing('olive oil', 1, 'tbsp'), ing('lemon', 1, 'whole'), ing('parsley', 2, 'tbsp'),
      ing('chili flakes', 0.5, 'tsp'), ing('salt', 0.5, 'tsp'), ing('white wine', 0.25, 'cup', true),
    ],
    steps: [
      step('Melt the butter with olive oil and garlic.', 90),
      step('Add the shrimp in one layer; sear both sides.', 4 * 60),
      step('Deglaze with wine and lemon; reduce slightly.', 2 * 60),
      step('Shower with parsley and chili flakes.'),
    ],
    tags: ['15-min', 'High-Protein'],
    diets: ['Pescatarian'], freeOf: ['Gluten-free', 'Nut-free'],
  }),
  make({
    id: 'roasted-garlic-soup',
    title: 'Roasted Garlic Soup',
    image: result3,
    gradient: G.sand,
    rating: 4.9, ratingCount: 254, timeMinutes: 35, difficulty: 'Medium', kcal: 280,
    ingredients: [
      ing('garlic', 2, 'heads'), ing('onion', 1, 'whole'), ing('olive oil', 2, 'tbsp'),
      ing('salt', 1, 'tsp'), ing('black pepper', 0.5, 'tsp'), ing('bread', 2, 'slices'),
      ing('milk', 0.5, 'cup', true), ing('parsley', 1, 'tbsp'), ing('spinach', 1, 'cup'),
      ing('vegetable stock', 3, 'cups'),
    ],
    steps: [
      step('Roast the garlic heads until soft and sweet.', 20 * 60),
      step('Sweat the onion, then add stock and the squeezed garlic.', 5 * 60),
      step('Blend silky-smooth with milk.', 2 * 60),
      step('Serve with torn toasted bread and parsley.'),
    ],
    tags: ['Comfort food', 'Under 500 kcal'],
    equipment: ['Oven', 'Stovetop'],
    diets: ['Vegetarian'], freeOf: ['Nut-free'],
  }),
  make({
    id: 'garlic-naan-flatbread',
    title: 'Garlic Naan Flatbread',
    image: result4,
    gradient: G.wheat,
    rating: 4.7, ratingCount: 143, timeMinutes: 30, difficulty: 'Medium', kcal: 350,
    ingredients: [
      ing('flour', 2, 'cups'), ing('yeast', 1, 'tsp'), ing('greek yogurt', 0.5, 'cup', true),
      ing('garlic', 3, 'cloves'), ing('milk', 0.5, 'cup', true), ing('salt', 1, 'tsp'),
      ing('honey', 1, 'tsp', true), ing('eggs', 1, 'large'),
    ],
    steps: [
      step('Knead a soft dough and let it rise.', 15 * 60),
      step('Divide and roll into teardrops.'),
      step('Blister in a screaming-hot pan.', 4 * 60),
      step('Brush with garlicky butter and serve warm.'),
    ],
    tags: ['Comfort food'],
    diets: ['Vegetarian'], freeOf: ['Nut-free'],
  }),
  make({
    id: 'garlic-herb-focaccia',
    title: 'Garlic Herb Focaccia',
    gradient: G.honey,
    rating: 4.7, ratingCount: 209, timeMinutes: 45, difficulty: 'Hard', kcal: 300,
    ingredients: [
      ing('flour', 3, 'cups'), ing('yeast', 1.5, 'tsp'), ing('garlic', 4, 'cloves'),
      ing('olive oil', 4, 'tbsp'), ing('salt', 1.5, 'tsp'), ing('parsley', 2, 'tbsp'),
      ing('honey', 1, 'tsp', true), ing('tomatoes', 0.5, 'cup'),
    ],
    steps: [
      step('Mix a wet dough; rest until doubled.', 25 * 60),
      step('Dimple with oily fingers and stud with garlic and tomatoes.'),
      step('Bake until deeply golden.', 18 * 60),
      step('Finish with parsley and flaky salt.'),
    ],
    tags: ['Comfort food'],
    equipment: ['Oven'],
    diets: ['Vegan', 'Vegetarian'], freeOf: ['Dairy-free', 'Nut-free'],
  }),
  make({
    id: 'creamy-garlic-mushrooms',
    title: 'Creamy Garlic Mushrooms',
    gradient: G.sand,
    rating: 4.6, ratingCount: 132, timeMinutes: 20, difficulty: 'Easy', kcal: 240,
    ingredients: [
      ing('mushrooms', 400, 'g'), ing('garlic', 3, 'cloves'), ing('olive oil', 2, 'tbsp'),
      ing('onion', 0.5, 'whole'), ing('milk', 0.5, 'cup', true), ing('parsley', 2, 'tbsp'),
      ing('salt', 0.5, 'tsp'), ing('black pepper', 0.5, 'tsp'), ing('spinach', 1, 'cup'),
    ],
    steps: [
      step('Sear the mushrooms hard — no crowding.', 5 * 60),
      step('Soften the onion and garlic in the same pan.', 3 * 60),
      step('Splash in the milk and let it turn glossy.', 3 * 60),
      step('Fold in spinach and parsley; season well.'),
    ],
    tags: ['Under 500 kcal', 'Vegetarian'],
    diets: ['Vegetarian'], freeOf: ['Gluten-free', 'Nut-free'],
  }),
  make({
    id: 'garlic-lemon-salmon',
    title: 'Garlic Lemon Salmon',
    gradient: G.coral,
    rating: 4.9, ratingCount: 287, timeMinutes: 25, difficulty: 'Medium', kcal: 430,
    ingredients: [
      ing('salmon', 2, 'fillet'), ing('garlic', 3, 'cloves'), ing('lemon', 1, 'whole'),
      ing('olive oil', 2, 'tbsp'), ing('salt', 1, 'tsp'), ing('black pepper', 0.5, 'tsp'),
      ing('parsley', 2, 'tbsp'), ing('honey', 1, 'tbsp', true), ing('capers', 1, 'tbsp'),
    ],
    steps: [
      step('Pat the salmon dry and season.'),
      step('Sear skin-side down until crisp.', 4 * 60),
      step('Baste with garlic, honey and lemon.', 2 * 60),
      step('Rest, then scatter capers and parsley.'),
    ],
    tags: ['High-Protein', 'Keto'],
    diets: ['Pescatarian', 'Keto'], freeOf: ['Gluten-free', 'Dairy-free', 'Nut-free'],
  }),
  make({
    id: 'roasted-garlic-hummus',
    title: 'Roasted Garlic Hummus',
    gradient: G.sand,
    rating: 4.5, ratingCount: 118, timeMinutes: 15, difficulty: 'Easy', kcal: 180,
    ingredients: [
      ing('chickpeas', 1, 'can'), ing('garlic', 1, 'heads'), ing('olive oil', 3, 'tbsp'),
      ing('lemon', 1, 'whole'), ing('salt', 0.5, 'tsp'), ing('black pepper', 0.25, 'tsp'),
      ing('chili flakes', 0.25, 'tsp'), ing('parsley', 1, 'tbsp'), ing('bread', 2, 'slices'),
      ing('tomatoes', 0.5, 'cup'),
    ],
    steps: [
      step('Roast the garlic until caramel-soft.', 8 * 60),
      step('Blitz chickpeas, garlic, lemon and oil until whipped.', 2 * 60),
      step('Season, swirl onto a plate, drizzle with chili oil.'),
      step('Serve with warm bread and tomatoes.'),
    ],
    tags: ['Vegan', 'Under 500 kcal'],
    diets: ['Vegan', 'Vegetarian'], freeOf: ['Dairy-free'],
  }),
  make({
    id: 'garlic-butter-steak-bites',
    title: 'Garlic Butter Steak Bites',
    gradient: G.lilac,
    rating: 4.8, ratingCount: 246, timeMinutes: 20, difficulty: 'Medium', kcal: 560,
    ingredients: [
      ing('steak', 400, 'g'), ing('butter', 3, 'tbsp', true), ing('garlic', 4, 'cloves'),
      ing('olive oil', 1, 'tbsp'), ing('salt', 1, 'tsp'), ing('black pepper', 1, 'tsp'),
      ing('parsley', 2, 'tbsp'), ing('rosemary', 1, 'sprig'),
    ],
    steps: [
      step('Cube the steak and season aggressively.'),
      step('Sear in batches until crusty.', 5 * 60),
      step('Return everything with butter, garlic and rosemary; baste.', 2 * 60),
      step('Rest a minute, then shower with parsley.'),
    ],
    tags: ['Keto', 'High-Protein'],
    diets: ['Keto'], freeOf: ['Gluten-free', 'Nut-free'],
  }),
  make({
    id: 'garlic-fried-rice',
    title: 'Garlic Fried Rice',
    gradient: G.moss,
    rating: 4.7, ratingCount: 165, timeMinutes: 15, difficulty: 'Easy', kcal: 380,
    ingredients: [
      ing('rice', 2, 'cups'), ing('garlic', 5, 'cloves'), ing('eggs', 2, 'large'),
      ing('soy sauce', 2, 'tbsp'), ing('onion', 0.5, 'whole'), ing('chili flakes', 0.5, 'tsp'),
      ing('olive oil', 2, 'tbsp'), ing('spinach', 1, 'cup'),
      ing('sesame oil', 1, 'tsp', true), ing('scallions', 2, 'stalks'),
    ],
    steps: [
      step('Crisp the garlic in oil; set half aside.', 2 * 60),
      step('Scramble the eggs, then add cold rice and toss hard.', 3 * 60),
      step('Season with soy and chili; wilt in the spinach.', 2 * 60),
      step('Top with scallions, sesame oil and the crispy garlic.'),
    ],
    tags: ['15-min', 'One-pan'],
    diets: ['Vegetarian'], freeOf: ['Dairy-free', 'Nut-free'],
  }),
  make({
    id: 'garlic-chicken-alfredo',
    title: 'Garlic Chicken Alfredo',
    image: result1,
    gradient: G.wheat,
    rating: 4.6, ratingCount: 226, timeMinutes: 30, difficulty: 'Medium', kcal: 640,
    ingredients: [
      ing('pasta', 2, 'cups'), ing('chicken breast', 2, 'pieces', true), ing('garlic', 4, 'cloves'),
      ing('parmesan', 0.5, 'cup', true), ing('salt', 1, 'tsp'), ing('black pepper', 0.5, 'tsp'),
      ing('butter', 2, 'tbsp', true), ing('heavy cream', 1, 'cup', true),
      ing('cream cheese', 2, 'tbsp'), ing('nutmeg', 0.13, 'tsp'),
    ],
    steps: [
      step('Boil the pasta; save a mug of pasta water.', 9 * 60),
      step('Sear the seasoned chicken and slice.', 7 * 60),
      step('Melt butter with garlic; whisk in cream and cheeses.', 4 * 60),
      step('Toss it all together with a grating of nutmeg.'),
    ],
    tags: ['Comfort food'],
    freeOf: ['Nut-free'],
  }),
  make({
    id: 'garlic-knots',
    title: 'Garlic Knots',
    gradient: G.honey,
    rating: 4.8, ratingCount: 174, timeMinutes: 35, difficulty: 'Medium', kcal: 220,
    ingredients: [
      ing('flour', 2.5, 'cups'), ing('garlic', 4, 'cloves'), ing('olive oil', 3, 'tbsp'),
      ing('salt', 1, 'tsp'), ing('parsley', 2, 'tbsp'), ing('honey', 1, 'tsp', true),
      ing('eggs', 1, 'large'), ing('milk', 0.5, 'cup', true),
    ],
    steps: [
      step('Make a soft dough and rest it.', 15 * 60),
      step('Roll ropes and tie loose knots.'),
      step('Bake until puffed and golden.', 12 * 60),
      step('Toss hot knots in garlic oil and parsley.'),
    ],
    tags: ['Comfort food'],
    equipment: ['Oven'],
    diets: ['Vegetarian'], freeOf: ['Nut-free'],
  }),
  make({
    id: 'garlic-shrimp-scampi',
    title: 'Garlic Shrimp Scampi',
    gradient: G.coral,
    rating: 4.9, ratingCount: 301, timeMinutes: 22, difficulty: 'Medium', kcal: 410,
    ingredients: [
      ing('pasta', 2, 'cups'), ing('shrimp', 300, 'g'), ing('garlic', 5, 'cloves'),
      ing('lemon', 1, 'whole'), ing('olive oil', 2, 'tbsp'), ing('chili flakes', 0.5, 'tsp'),
      ing('parsley', 3, 'tbsp'), ing('butter', 2, 'tbsp', true), ing('white wine', 0.33, 'cup', true),
    ],
    steps: [
      step('Boil the pasta until just shy of al dente.', 8 * 60),
      step('Sizzle garlic and chili in oil; add the shrimp.', 3 * 60),
      step('Deglaze with wine and lemon; mount with butter.', 2 * 60),
      step('Toss with pasta and lots of parsley.'),
    ],
    tags: ['High-Protein'],
    diets: ['Pescatarian'], freeOf: ['Nut-free'],
  }),
  make({
    id: 'garlic-mashed-potatoes',
    title: 'Garlic Mashed Potatoes',
    gradient: G.sand,
    rating: 4.7, ratingCount: 152, timeMinutes: 25, difficulty: 'Easy', kcal: 290,
    ingredients: [
      ing('potatoes', 700, 'g'), ing('garlic', 4, 'cloves'), ing('milk', 0.5, 'cup', true),
      ing('salt', 1, 'tsp'), ing('black pepper', 0.5, 'tsp'), ing('olive oil', 2, 'tbsp'),
      ing('parsley', 1, 'tbsp'), ing('cheddar', 0.25, 'cup', true), ing('onion', 0.25, 'whole'),
      ing('butter', 2, 'tbsp', true),
    ],
    steps: [
      step('Simmer potatoes and garlic until tender.', 15 * 60),
      step('Warm the milk and butter together.'),
      step('Mash, then whip in the warm milk.', 2 * 60),
      step('Fold in cheddar; top with parsley.'),
    ],
    tags: ['Comfort food'],
    diets: ['Vegetarian'], freeOf: ['Gluten-free', 'Nut-free'],
  }),
  make({
    id: 'garlic-tomato-bruschetta',
    title: 'Garlic Tomato Bruschetta',
    gradient: G.peach,
    rating: 4.5, ratingCount: 129, timeMinutes: 15, difficulty: 'Easy', kcal: 160,
    ingredients: [
      ing('bread', 4, 'slices'), ing('tomatoes', 2, 'cups'), ing('garlic', 2, 'cloves'),
      ing('olive oil', 2, 'tbsp'), ing('salt', 0.5, 'tsp'), ing('black pepper', 0.25, 'tsp'),
      ing('parsley', 1, 'tbsp'), ing('basil', 0.25, 'cup', true), ing('balsamic', 1, 'tbsp'),
    ],
    steps: [
      step('Grill the bread until charred at the edges.', 3 * 60),
      step('Rub each slice with a raw garlic clove.'),
      step('Spoon over dressed tomatoes and basil.'),
      step('Finish with balsamic and good oil.'),
    ],
    tags: ['15-min', 'Vegan'],
    diets: ['Vegan', 'Vegetarian'], freeOf: ['Dairy-free', 'Nut-free'],
  }),
  make({
    id: 'garlic-basil-pesto-pasta',
    title: 'Garlic Basil Pesto Pasta',
    gradient: G.mint,
    rating: 4.8, ratingCount: 217, timeMinutes: 20, difficulty: 'Easy', kcal: 590,
    ingredients: [
      ing('pasta', 2, 'cups'), ing('garlic', 2, 'cloves'), ing('olive oil', 3, 'tbsp'),
      ing('parmesan', 0.5, 'cup', true), ing('salt', 1, 'tsp'), ing('lemon', 0.5, 'whole'),
      ing('basil', 2, 'cups', true), ing('pine nuts', 0.33, 'cup', true),
      ing('ricotta', 0.25, 'cup'), ing('cherry tomatoes', 1, 'cup'),
    ],
    steps: [
      step('Boil the pasta; keep it al dente.', 8 * 60),
      step('Blitz basil, garlic, nuts, parmesan and oil.', 2 * 60),
      step('Loosen the pesto with pasta water off the heat.'),
      step('Toss with ricotta and burst tomatoes.'),
    ],
    tags: ['Vegetarian'],
    diets: ['Vegetarian'],
  }),
  make({
    id: 'garlic-roasted-broccoli',
    title: 'Garlic Roasted Broccoli',
    gradient: G.sage,
    rating: 4.6, ratingCount: 112, timeMinutes: 18, difficulty: 'Easy', kcal: 140,
    ingredients: [
      ing('broccoli', 1, 'head'), ing('garlic', 3, 'cloves'), ing('olive oil', 2, 'tbsp'),
      ing('salt', 0.5, 'tsp'), ing('black pepper', 0.25, 'tsp'), ing('chili flakes', 0.25, 'tsp'),
      ing('lemon', 0.5, 'whole'), ing('parmesan', 0.25, 'cup', true), ing('soy sauce', 1, 'tsp'),
      ing('honey', 1, 'tsp', true),
    ],
    steps: [
      step('Heat the air-fryer to 200°C.', 3 * 60),
      step('Toss florets with oil, garlic and seasoning.'),
      step('Air-fry until the edges frazzle.', 10 * 60),
      step('Hit with lemon, parmesan and a honey-soy drizzle.'),
    ],
    tags: ['Under 500 kcal', 'Air-fryer'],
    equipment: ['Air-fryer'],
    diets: ['Vegetarian'], freeOf: ['Gluten-free', 'Nut-free'],
  }),
  make({
    id: 'garlic-naan-pizza',
    title: 'Garlic Naan Pizza',
    gradient: G.amber,
    rating: 4.7, ratingCount: 189, timeMinutes: 25, difficulty: 'Easy', kcal: 480,
    ingredients: [
      ing('naan', 2, 'pieces'), ing('garlic', 3, 'cloves'), ing('tomatoes', 1, 'cup'),
      ing('cheddar', 0.5, 'cup', true), ing('olive oil', 1, 'tbsp'), ing('chili flakes', 0.5, 'tsp'),
      ing('mozzarella', 1, 'cup', true), ing('basil', 0.25, 'cup', true),
    ],
    steps: [
      step('Heat the oven to 240°C with a tray inside.', 8 * 60),
      step('Rub the naan with garlic oil; top with tomatoes and cheeses.'),
      step('Bake until bubbling.', 8 * 60),
      step('Scatter basil and chili flakes.'),
    ],
    tags: ['Comfort food', '15-min'],
    equipment: ['Oven'],
    diets: ['Vegetarian'], freeOf: ['Nut-free'],
  }),
  make({
    id: 'garlic-chili-oil-noodles',
    title: 'Garlic Chili Oil Noodles',
    gradient: G.coral,
    rating: 4.9, ratingCount: 342, timeMinutes: 15, difficulty: 'Easy', kcal: 520,
    ingredients: [
      ing('rice noodles', 2, 'portions', true), ing('garlic', 5, 'cloves'),
      ing('chili flakes', 1, 'tbsp'), ing('soy sauce', 2, 'tbsp'), ing('onion', 0.25, 'whole'),
      ing('honey', 1, 'tsp', true), ing('eggs', 1, 'large'), ing('olive oil', 3, 'tbsp'),
      ing('sesame oil', 1, 'tsp', true), ing('scallions', 2, 'stalks'),
    ],
    steps: [
      step('Soak the noodles until just tender.', 4 * 60),
      step('Pile garlic, chili and scallions in a bowl; pour over smoking oil.'),
      step('Season with soy and honey; toss the noodles through.'),
      step('Top with a jammy egg.', 6 * 60),
    ],
    tags: ['Spicy', '15-min'],
    diets: ['Vegetarian'], freeOf: ['Dairy-free', 'Nut-free'],
  }),
  make({
    id: 'garlic-ranch-potatoes',
    title: 'Garlic Ranch Potatoes',
    gradient: G.sand,
    rating: 4.6, ratingCount: 137, timeMinutes: 35, difficulty: 'Easy', kcal: 340,
    ingredients: [
      ing('potatoes', 600, 'g'), ing('garlic', 3, 'cloves'), ing('olive oil', 2, 'tbsp'),
      ing('salt', 1, 'tsp'), ing('black pepper', 0.5, 'tsp'), ing('parsley', 2, 'tbsp'),
      ing('cheddar', 0.33, 'cup', true), ing('ranch seasoning', 1, 'tbsp'),
    ],
    steps: [
      step('Parboil the potato chunks.', 8 * 60),
      step('Toss with oil, garlic and ranch seasoning.'),
      step('Air-fry until shatteringly crisp.', 16 * 60),
      step('Toss with cheddar and parsley while hot.'),
    ],
    tags: ['Air-fryer', 'Comfort food'],
    equipment: ['Air-fryer'],
    diets: ['Vegetarian'], freeOf: ['Gluten-free', 'Nut-free'],
  }),
  make({
    id: 'garlic-butter-cod',
    title: 'Garlic Butter Cod',
    gradient: G.wheat,
    rating: 4.7, ratingCount: 163, timeMinutes: 24, difficulty: 'Medium', kcal: 380,
    ingredients: [
      ing('cod', 2, 'fillet'), ing('butter', 2, 'tbsp', true), ing('garlic', 3, 'cloves'),
      ing('lemon', 1, 'whole'), ing('olive oil', 1, 'tbsp'), ing('salt', 0.5, 'tsp'),
      ing('black pepper', 0.25, 'tsp'), ing('parsley', 2, 'tbsp'), ing('chili flakes', 0.25, 'tsp'),
    ],
    steps: [
      step('Pat the cod dry; season both sides.'),
      step('Sear in oil until golden underneath.', 4 * 60),
      step('Add butter, garlic and lemon; baste gently.', 3 * 60),
      step('Spoon the pan sauce over; finish with parsley.'),
    ],
    tags: ['High-Protein', 'Under 500 kcal'],
    diets: ['Pescatarian', 'Keto'], freeOf: ['Gluten-free', 'Nut-free'],
  }),
  make({
    id: 'garlic-parmesan-wings',
    title: 'Garlic Parmesan Wings',
    gradient: G.honey,
    rating: 4.8, ratingCount: 268, timeMinutes: 40, difficulty: 'Medium', kcal: 520,
    ingredients: [
      ing('chicken wings', 800, 'g'), ing('garlic', 4, 'cloves'), ing('parmesan', 0.5, 'cup', true),
      ing('olive oil', 2, 'tbsp'), ing('salt', 1, 'tsp'), ing('black pepper', 0.5, 'tsp'),
      ing('honey', 1, 'tbsp', true), ing('chili flakes', 0.5, 'tsp'),
      ing('baking powder', 1, 'tbsp'), ing('butter', 2, 'tbsp', true),
    ],
    steps: [
      step('Dry the wings and toss with baking powder and salt.'),
      step('Air-fry, flipping once, until crackling.', 22 * 60),
      step('Warm butter with garlic, honey and chili.', 2 * 60),
      step('Toss the wings; bury them in parmesan.'),
    ],
    tags: ['Air-fryer', 'High-Protein'],
    equipment: ['Air-fryer'],
    freeOf: ['Gluten-free', 'Nut-free'],
  }),
  make({
    id: 'garlic-green-beans',
    title: 'Garlic Green Beans',
    gradient: G.sage,
    rating: 4.4, ratingCount: 96, timeMinutes: 12, difficulty: 'Easy', kcal: 120,
    ingredients: [
      ing('green beans', 400, 'g'), ing('garlic', 3, 'cloves'), ing('olive oil', 2, 'tbsp'),
      ing('salt', 0.5, 'tsp'), ing('black pepper', 0.25, 'tsp'), ing('chili flakes', 0.25, 'tsp'),
      ing('lemon', 0.5, 'whole'), ing('soy sauce', 1, 'tsp'), ing('honey', 1, 'tsp', true),
    ],
    steps: [
      step('Blister the beans in a dry, hot pan.', 4 * 60),
      step('Add oil, garlic and chili; toss for a minute.', 60),
      step('Glaze with soy, honey and lemon.'),
    ],
    tags: ['Under 500 kcal', '15-min', 'Vegan'],
    diets: ['Vegan', 'Vegetarian'], freeOf: ['Dairy-free', 'Gluten-free', 'Nut-free'],
  }),
  make({
    id: 'garlic-lentil-soup',
    title: 'Garlic Lentil Soup',
    gradient: G.amber,
    rating: 4.5, ratingCount: 141, timeMinutes: 30, difficulty: 'Easy', kcal: 260,
    ingredients: [
      ing('lentils', 1, 'cup'), ing('garlic', 4, 'cloves'), ing('onion', 1, 'whole'),
      ing('olive oil', 2, 'tbsp'), ing('salt', 1, 'tsp'), ing('black pepper', 0.5, 'tsp'),
      ing('chili flakes', 0.5, 'tsp'), ing('tomatoes', 1, 'cup'), ing('spinach', 2, 'cups'),
    ],
    steps: [
      step('Sweat the onion and garlic in olive oil.', 4 * 60),
      step('Add lentils, tomatoes and water; simmer.', 18 * 60),
      step('Season and wilt in the spinach.', 2 * 60),
      step('Blend half for body; serve with chili oil.'),
    ],
    tags: ['Vegan', 'Under 500 kcal', 'Meal prep'],
    diets: ['Vegan', 'Vegetarian'], freeOf: ['Dairy-free', 'Gluten-free', 'Nut-free'],
  }),
]

export const recipeById = (id: string): Recipe | undefined => recipes.find((r) => r.id === id)

/** Home "Cook with what you have" carousel order (matches the hi-fi frame). */
export const carouselIds = [
  'creamy-garlic-pasta', 'lemon-chicken-bowl', 'spicy-ramen-bowl', 'avocado-toast',
  'berry-overnight-oats', 'sheet-pan-fajitas', 'green-curry-noodles',
]

/** Home "Recommended for you" grid (matches the hi-fi frame). */
export const recommendedIds = ['miso-glazed-salmon', 'crunchy-veggie-tacos']

export const quickTags = [
  '15-min', 'High-Protein', 'Vegan', 'Under €5', 'Air-fryer', 'One-pan',
  'Comfort food', 'Under 500 kcal', 'Meal prep', 'Spicy',
]
