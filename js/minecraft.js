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
    class Minecraft {
        constructor(numOfRows,numOfColumns) {
            this.numOfRows = numOfRows || 15;
            this.numOfColumns = numOfColumns || 50;
            this.toolsArray = ['pickaxe', 'shovel', 'axe', 'bucket', 'pump'];
            this.tilesArray = ['wood', 'waves', 'water', 'stone', 'leaves', 'grass', 'earth', 'cloud', 'tree'];
            this.inventory = new Map();
        }
        createPixels() {
            var world = $('#world');
            var pixel = $('<div/>');
            pixel.addClass('pixel');
            for (var i = 0; i < (this.numOfRows * this.numOfColumns); i++) {
                world.append(pixel.clone());
            }
            this.pixels = $('.pixel');
        }
        setGridCss() {
            var world = $('#world');
            world.css('grid-template', `repeat(${this.numOfRows}, 1fr) / repeat(${this.numOfColumns}, 1fr)`);
            var pixels = $('.pixel');
            var worldInitialWidth = parseInt(window.getComputedStyle(document.querySelector('#world')).getPropertyValue('width'));
            var worldInitialHeight = parseInt(window.getComputedStyle(document.querySelector('#world')).getPropertyValue('height'));
            pixels.css('width', `${parseFloat(worldInitialWidth / this.numOfColumns)}px`);
            pixels.css('height', `${parseFloat(worldInitialHeight / this.numOfRows)}px`);
        }
        createMatrix() {
            //creating the matrix
            this.matrix = [];
            for (var i = 0; i < this.numOfRows; i++) {
                this.matrix[i] = new Array(this.numOfColumns);
            }
            var tilesArray = this.tilesArray;
            var earthOptions = ['stone', 'earth', 'earth', 'earth', 'earth', 'earth', 'earth', 'earth', 'earth'];
            var cloudOptions = ['cloud', undefined, undefined, undefined, undefined];
            var greeneryOptions = ['wood', 'tree', undefined, undefined, undefined];
            var stoneOptions = ['stone', undefined];
            var treeOptions = ['wood', 'leaves'];
            var leavesOptions = ['leaves', undefined];
            

            //creating clouds
            for (var i = (this.matrix.length / 8) | 0; i < (this.matrix.length / 4 | 0); i++) {
                let cloudsArray = new Array(this.numOfColumns);
                for (var j = 0; j < this.numOfColumns; j++) {
                    cloudsArray[j] = cloudOptions[Math.random() * cloudOptions.length | 0];
                }
                this.matrix[i] = cloudsArray;
            }
            //creating ground
            for (var i = (this.matrix.length - 1); i >= (this.matrix.length / 1.5 | 0); i--) {
                let earthArray = new Array(this.numOfColumns);
                for (var j = 0; j < this.numOfColumns; j++) {
                    if (i + 1 < this.matrix.length && this.matrix[i + 1][j] === 'water') {
                        earthArray[j] = 'water';
                    } else if (j >= (this.matrix[i].length / 4 | 0) && j <= (this.matrix[i].length / 2 |0)) {
                        earthArray[j] = 'water';
                    }
                    else {
                        earthArray[j] = earthOptions[Math.random() * earthOptions.length | 0];
                    }
                }
                this.matrix[i] = earthArray;
                if (i === (this.matrix.length / 1.5 | 0)) {
                    //creating the surface section
                    let surfaceArray = new Array(this.numOfColumns);
                    for(var j=0; j < this.numOfColumns; j++) {
                        if(this.matrix[i+1][j] === 'water') {
                            surfaceArray[j] = tilesArray[tilesArray.indexOf('waves')];
                        } else {
                            surfaceArray[j] = tilesArray[tilesArray.indexOf('grass')];
                        }
                    }
                    this.matrix[i] = surfaceArray;
                }
            }
            //creating greenery and stones
            for (var i = (this.matrix.length / 1.5 | 0) - 1; i >= (this.matrix.length / 2.4 | 0) ;i--) {
                let greeneryArray = new Array(this.numOfColumns);
                for (var j = 0; j < this.numOfColumns; j++) {
                    if(this.matrix[i+1][j] === 'grass') {
                        greeneryArray[j] = greeneryOptions[Math.random() * greeneryOptions.length | 0];
                    } else if (this.matrix[i + 1][j] === 'wood') {
                        greeneryArray[j] = treeOptions[Math.random() * treeOptions.length | 0];
                    } else if (this.matrix[i + 1][j] === 'leaves') {
                        greeneryArray[j] = leavesOptions[Math.random() * leavesOptions.length | 0];
                    }
                }
                this.matrix[i] = greeneryArray;
            }
        }
        connectMatrixDom() {
            //connect between the matrix to the dom grid
            for (var i = 0; i < this.matrix.length; i++) {
                for (var j = 0; j < this.matrix[i].length; j++) {
                    let currentPixel = this.pixels.eq(i * this.numOfColumns + j);
                    currentPixel.data("i", i).data("j", j).data("tile", `${this.matrix[i][j]}`);
                    if (this.matrix[i][j] !== undefined) {
                        currentPixel.addClass(`${this.matrix[i][j]}`);
                    }
                }
            }
        }
        createToolsButtons() {
            var menu = $('#menu');
            for(var i=0; i < this.toolsArray.length; i++) {
                let newTool = $('<div/>');
                newTool.addClass('tool-button');
                newTool.attr('id', `${this.toolsArray[i]}`);
                menu.append(newTool);
            }
        }
        createInventory() {
            var menu = $('#menu');
            var inventory = $('<div/>');
            inventory.attr('id', 'inventory');
            menu.append(inventory);
            for (var i=0; i <this.tilesArray.length; i++) {
                let newInventoryItem = $('<div/>');
                newInventoryItem.addClass('inventory-item');
                newInventoryItem.attr('id', `${this.tilesArray[i]}`);
                newInventoryItem.addClass(`${this.tilesArray[i]}`);
                newInventoryItem.addClass('empty');
                inventory.append(newInventoryItem);
                this.inventory.set(this.tilesArray[i], 0);
            }
        }
        bindActiveChoice() {
            $('.inventory-item').on('click', function() {
                $('#menu div').removeClass('active');
                $(this).addClass('active');
            });
            $('.tool-button').on('click', function() {
                $('#menu div').removeClass('active');
                $(this).addClass('active');
            });
        }
        bindCursorImage() {
            $('#world').on('mouseenter', function() {
                var activeChoice = $('.active');
                if(activeChoice.hasClass('inventory-item')) {
                    document.body.style.cursor = `url('./media/minecraft-cursor.png'), auto`;    
                } else {
                    document.body.style.cursor = `url('./media/${activeChoice.attr('id')}-cursor.png'), auto`;
                }
            });
            $('#world').on('mouseleave', function () {
                document.body.style.cursor = `auto`;
            });
        }
        bindOnPixelClick() {
            var self = this;
            var pixels = $('.pixel');
            pixels.on('click', function() {
                var activeChoice = $('.active');
                var clickedTile = $(this);
                if(activeChoice.hasClass('tool-button')) {
                    switch(activeChoice.attr('id')) {
                        case 'axe':
                            if(clickedTile.hasClass('wood')) {
                                clickedTile.removeClass('wood');
                                self.addToInventory('wood');
                            } else if (clickedTile.hasClass('leaves')) {
                                clickedTile.removeClass('leaves');
                                self.addToInventory('leaves');
                            } else if(clickedTile.hasClass('tree')) {
                                clickedTile.removeClass('tree');
                                self.addToInventory('tree');
                            }
                            else {
                                activeChoice.addClass('ilegal');
                                setTimeout(function() {
                                    activeChoice.removeClass('ilegal');
                                }
                                ,500);
                            }
                            break;
                        case 'shovel':
                            if (clickedTile.hasClass('earth')) {
                                clickedTile.removeClass('earth');
                                self.addToInventory('earth');
                            } else if(clickedTile.hasClass('grass')) {
                                clickedTile.removeClass('grass');
                                self.addToInventory('grass');
                            } else{
                                activeChoice.addClass('ilegal');
                                setTimeout(function () {
                                    activeChoice.removeClass('ilegal');
                                }
                                , 500);
                            }
                            break;
                        case 'pickaxe':
                            if (clickedTile.hasClass('stone')) {
                                clickedTile.removeClass('stone');
                                self.addToInventory('stone');
                            } else {
                                activeChoice.addClass('ilegal');
                                setTimeout(function () {
                                    activeChoice.removeClass('ilegal');
                                }
                                , 500);
                            }
                            break;
                        case 'bucket':
                            if (clickedTile.hasClass('waves')) {
                                clickedTile.removeClass('waves');
                                self.addToInventory('waves');
                            } else if (clickedTile.hasClass('water')) {
                                clickedTile.removeClass('water');
                                self.addToInventory('water');
                            }
                            else {
                                activeChoice.addClass('ilegal');
                                setTimeout(function () {
                                    activeChoice.removeClass('ilegal');
                                }
                                    , 500);
                            }
                            break;
                        case 'pump':
                            if (clickedTile.hasClass('cloud')) {
                                clickedTile.removeClass('cloud');
                                self.addToInventory('cloud');
                            }
                            else {
                                activeChoice.addClass('ilegal');
                                setTimeout(function () {
                                    activeChoice.removeClass('ilegal');
                                }
                                    , 500);
                            }
                            break;
                        default:
                            break;
                    }
                } else if (activeChoice.hasClass('inventory-item') && clickedTile.attr('class') === 'pixel') {
                    var currentInventory = activeChoice.attr('id');
                    clickedTile.addClass(currentInventory).hide().fadeIn();
                    self.removeFromInventory(currentInventory);
                } else if (activeChoice.hasClass('inventory-item') && clickedTile.attr('class') !== 'pixel') {
                    activeChoice.addClass('ilegal');
                    setTimeout(function () {
                        activeChoice.removeClass('ilegal');
                    }
                    , 500);
                }
            });
        } // end of on click logic
        addToInventory(tileType) {
            var inventoryToAdd = $(`#${tileType}.inventory-item`);
            if (this.inventory.get(tileType) === 0) {
                inventoryToAdd.removeClass('empty');
            }
            this.inventory.set(tileType, this.inventory.get(tileType) + 1);
            inventoryToAdd.text(this.inventory.get(tileType));
        }
        removeFromInventory(tileType) {
            var inventoryToDelete = $(`#${tileType}.inventory-item`);
            if (inventoryToDelete.text() === '1') {
                inventoryToDelete.contents().remove();
                inventoryToDelete.addClass('empty');
                inventoryToDelete.removeClass('active');
                document.body.style.cursor = `auto`;
                this.inventory.set(tileType, 0);
            } else {
                this.inventory.set(tileType, this.inventory.get(tileType) - 1);
                inventoryToDelete.text( (inventoryToDelete.text()-1).toString() );
            }
        }
        runGame() {
            this.createPixels();
            this.setGridCss();
            this.createMatrix();
            this.connectMatrixDom();
            this.createToolsButtons();
            this.createInventory();
            this.bindActiveChoice();
            this.bindCursorImage();
            this.bindOnPixelClick()
        }
    }
    
    var myMinecraft = new Minecraft();

    myMinecraft.runGame();

});