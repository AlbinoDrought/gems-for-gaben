# Gems For Gaben

### Team:

Sean\
 Maninder

### How to play:

-   Drag gems on the playing field to other squares to swap them.
-   Swap gems to get at least three in a row to gain points.
-   You are limited by the amount of moves you make.

When you run out of moves, you can submit your score to the
leaderboards.

### Short Documentation:

`                     Loader.js loads sprites, sounds, and then starts the game                     The board is completely random each time. It is ensured that no matches exist on the board at the start of the game.                     When a gem is swapped, it follows this order:                     `{style="line-height: 150%"}

1.  Remove control from user
2.  Check if new locations have any matches, **if not unswap**
3.  Clear matches from board
4.  Make gems fall down
5.  Check matches on board
6.  Repeat at step \#3 until there are no matches left

Sounds played are based on the current combo. As of now there are only 3
different sounds, varied in pitch and tempo.

### Documentation:

`                 Loader.js__                 Loader.js loads all sprites, sounds, and then calls Game.start() when done                                  Game.js__                 Game.start() resets variables (in case it was just reset), and registers appropriate event handlers for gem swaps                 When a gem swap occurs, GemMouseUp() is called. This detects what gem called it and where the gem should swap to.                 If this is alright, it calls swapGemPositions([x,y] of gem one, [x,y] of gem two)                                  swapGemPositions applies an animation (tween) to both swapping gems and waits for them to finish using a callback (swapGemPositionsCallback)                 swapGemPositionsCallback moves the gems to their new positions on the grid. It checks to see if there are any matches for either gem                                  If matches exist:                 `{style="line-height: 150%"}

-   Explode all matches (**clearMatches(matches)**)
-   Fall all matched columns (**fallColumns(columns to fall)**)

*If matches don't exist:*

-   Undo tween animation

**clearMatches** goes through each match, adds the column to a list, and
then kills the gem (explodes, create particle effect, adds to score)\
 **fallMatches** goes through each column starting at the bottom. When
it moves up, it checks if the current spot on the grid is null (needs to
fall)\
 If so, it:

-   Gets a gem that is applicable for the spot (**getGemToFall**)
-   Sets the applicable gem's new spot on the grid so it is not
    over-written
-   Animates the gem to the new position and waits for it to finish
    (**gemFallCallback**)

Otherwise, it continues going up until it is out of the grid.\
 **getGemToFall** starts at a given position and goes up until it finds
a spot in the grid that is not null. It returns this gem.\
 **gemFallCallback** confirms the grid position and screen position, and
calls **gemsFinishedFalling** if all gems are finished falling\
 **gemsFinishedFalling** calls **checkBoard** **checkBoard** goes
through each gem on the board (grid), and if it has at least 2 matches
(3-in-a-row) it clears those matches, starting back at
swapGemPositionsCallback.\
 If **checkBoard** finds no matches, control is returned to the user and
they can make another move. \
\
Globals.js\_\_\
 **Globals.js** contains global variables used across the code,
including options and the grid of gems\
 \
\
Helper.js\_\_\
 **Helper.js** initializes the Crafty.js classes (Gem, GemDrag,
Selector, HotSelector, Playspace) and contains the **particleExplosion**
function

\
\
\

