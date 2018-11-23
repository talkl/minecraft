$(document.body).ready(function () {
    // Document is loaded and DOM is ready
    function createWorldButtons() {
        for (let w = 0; w < worldTypes.length; w++) {
            let newBtn = $('<button/>');
            newBtn.addClass("button").html(worldTypes[w]).attr('id', worldTypes[w]);
            $('#world-type').append(newBtn);
        }
    }
    function bindWorldsButtons() {
        $('#sunny').on('click', function() {
            $('#world').css('width', '2000px');
            var SunnyMinecraft = new Minecraft(20, 50);
            SunnyMinecraft.runGame();
            changeTheme($(this).attr('id'), SunnyMinecraft.tilesArray);
            $('#start-screen').hide();
            $('#menu').fadeIn();
            $('#world').fadeIn();
        });
        $('#desert').on('click', function () {
            $('#world').css('width', '85vw');
            var otherMinecraft = new Minecraft(20, 25);
            otherMinecraft.runGame();
            changeTheme($(this).attr('id'), otherMinecraft.tilesArray);
            $('#start-screen').hide();
            $('#menu').fadeIn();
            $('#world').fadeIn();
        });
        $('#dark').on('click', function () {
            $('#world').css('width', '85vw');
            var darkMinecraft = new Minecraft(20, 25);
            darkMinecraft.runGame();
            changeTheme($(this).attr('id'), darkMinecraft.tilesArray);
            $('#start-screen').hide();
            $('#menu').fadeIn();
            $('#world').fadeIn();
        });
    }
    function changeTheme(theme, tilesArray) {
        var styleElement = $("head").children(':last');
        var cssHtml = '';
        for(var i=0; i < tilesArray.length; i++) {
            cssHtml += `.${tilesArray[i]}{background-image: url(./media/${theme}/${tilesArray[i]}.png);}\n`;
        }
        cssHtml += `#world {background-image: url(./media/${theme}/BG.png);}`;
        cssHtml= cssHtml.trim();
        styleElement.html(cssHtml);
    }

    class Minecraft {
        constructor(numOfRows,numOfColumns) {
            this.numOfRows = numOfRows || 20;
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
                    } else if (i <= this.matrix.length - 4 && j >= (this.matrix[i].length / 4 | 0) && j <= (this.matrix[i].length / 2 |0)) {
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
        createNewGameButton() {
            var newGameBtn = $('<button/>');
            newGameBtn.attr('id', 'new-game-button').addClass('button').text('New Game');
            newGameBtn.css('font-size', '1vw').css('width', '60%').css('height', '5%');
            $('#menu').append(newGameBtn);
        }
        bindNewGameButton() {
            var self = this;
            $('#new-game-button').on('click', function() {
                $('#menu').hide();
                $('#world').hide();
                self = null;
                $('#menu').empty();
                $('#world').empty();
                $('#start-screen').fadeIn();
            });
        }
        runGame() {
            this.createPixels();
            this.setGridCss();
            this.createMatrix();
            this.connectMatrixDom();
            this.createToolsButtons();
            this.createInventory();
            this.createNewGameButton();
            this.bindNewGameButton();
            this.bindActiveChoice();
            this.bindCursorImage();
            this.bindOnPixelClick()
        }
    }


    // main
    $('#menu').hide();
    $('#world').hide();
    var worldTypes = ['dark', 'desert', 'sunny'];
    createWorldButtons();
    bindWorldsButtons();

});