Minesweeper is written on vanilla javascript,

'webpack' and 'babel' are used to build the project.

jest is used for unit testing.

**Game description**

Goal of the game is to find all mines on the board.

You reveal mines by clicking at board field.

If you reveal a field with mine you lose the game.

If you reveal field without a mine it will show exact number of mines surrounding that field.

If you reveal field without number it means that there are no mines in its surroundings. In that case board will reveal all connected empty fields with its surroundings.

You can flag field by ctrl-clicking it.

**Requirements, and installation**

npm 6.7.0 or above,

Clone the repository, and install dependencies using next command:

git clone https://github.com/VKapustin/minesweeper.git

cd minesweeper

npm i

npm run build

npm run ws

After that, the game will be available at http://127.0.0.1:8000

Also you can run the game without running server. Just open index.html file in any browsers.