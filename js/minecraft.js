/*Assignment #6 – Minecraft (regressed)
______________________________________________________________________________________
The following Assignment is based on the following subjects:
o HTML + CSS + JavaScript
o JQuery
Submitting instructions:
o This assignment has assigned pairs/trios. One of you will submit your completed assignment to Hive.
o Push the full folder hierarchy of the project/code as you write it to your own repository on GitHub.
Please add the following in hive:
o A link to the repository
o Free text - a description of the quiz. Stuff that you found hard to implement, known bugs and
your review of this assignment
Understanding the task
Minecraft is a sandbox video game originally created by Swedish programmer Markus "Notch" Persson. The
creative and building aspects of Minecraft enable players to build constructions out of textured cubes in a 3D
procedurally generated world.
In our version of the game, we will use a 2D pre-generated world (meaning, our world will be hardcoded).
1. The user will have 3 types of tools:
a. Axe - for cutting trees
b. Pickaxe - for mining rocks
c. Shovel - for digging dirt
2. Clicking on a tool followed by clicking on a tile in the world will remove the tile. (If it is of the correct
type according to #1) and add it to the inventory
3. User can click on the tile in the inventory and place it back in the world (just the last one)
Approaching the assignment
1. Sit with your team and think about the implementation
a. Different functionalities
b. Things that should be in HTML
c. Things that should be generated on the fly using JS
2. Divide the work between the team members
3. Start small, one tool and one texture type
4. Try to make it as close to a complete product as you can
Implementation constraints
1. Use a matrix to represent the world and generate the world according to that matrix
2. Use JQuery to create and select DOM elements
3. Do not use 3D party plugins
4. Do not use concepts we haven’t learned yet
5. Try to write everything from scratch, if you copy code from the internet be sure that you and your team
members understand it completely.
Basic Requirements
1. You should implement all of the features seen in the following video.
2. You must use Git throughout the assignment (and not only commit at the end)
3. The UI/UX should look at least as good as the demo.
4. You should create a landing page with a tutorial explaining the game.
Tips
1. Prefer using CSS classes instead of dynamically changing CSS properties
2. The background-image property would be a better choice than <img> for tiles
3. Use the data in your DOM rather than global variables in the JS
Geek out
Extra Features:
● Add the ability to remember more than the last tile clicked (maintain the user’s inventory)
● Add more tools
● Add more tiles
● Make it responsive
● Allow the user to set the world width and height
● Add themes (changing a theme should change the world’s textures)
● Add more than one world type
● Make the world wider than the screen and allow scrolling
● Show the current selected tile on hover with opacity
● Add fade-in/out effect when adding/removing tiles
Unleash the ninja within
Randomize the generation of the world (make it reasonable, trees should be on grass, nothing floating in the
air, etc).*/

$(document.body).ready(function () {
    // Document is loaded and DOM is ready
    
});