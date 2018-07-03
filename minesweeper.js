function init(length, width, mines) {
	length = Math.floor(length)
	width = Math.floor(width)
	mines = Math.floor(mines)

	if (length > 26 || width > 40 || length < 5 || width < 15 || mines > (0.9 * (length * width)) || mines < 1) {
		return null
	}

	//0: safe, 1: mine, 2: revealed
	field = []
	for (i = 0; i < length; i++) {
		field.push([])
		for (j = 0; j < width; j++) {
			field[i].push(0)
		}
	}

	//populate mines
	populated = 0
	while (populated < mines) {
		x = Math.floor(Math.random() * width)
		y = Math.floor(Math.random() * length)

		if (field[y][x] == 0) {
			field[y][x] = 1
			populated++
		}
	}

	return field
}

function checkAdj(field, y, x) {
	adj = 0

	if (y-1 >= 0) {
		//check row of 3 above
		for (x_i = x-1; x_i <= x+1; x_i++) {
			if (x_i >= 0 && x_i < field[y-1].length) {
				if (field[y-1][x_i] == 1) {
					adj++
				}
			}
		}
	}

	if (y+1 < field.length) {
		//check row of 3 below
		for (x_i = x-1; x_i <= x+1; x_i++) {
			if (x_i >= 0 && x_i < field[y+1].length) {
				if (field[y+1][x_i] == 1) {
					adj++
				}
			}
		}
	}

	//check left & right
	if (x-1 >= 0) {
		if (field[y][x-1] == 1) {
			adj++
		}
	}
	if (x+1 < field[y].length) {
		if (field[y][x+1] == 1) {
			adj++
		}
	}

	return adj
}

function draw(field) {
	//X: hidden, 0-8: adjacent mines
	for (i = 0; i < field.length; i++) {
		for (j = 0; j < field[i].length; j++) {
			if (field[i][j] != 2) {
				process.stdout.write('X')
			} else {
					process.stdout.write(checkAdj(field, i, j).toString())
			}
		}
		process.stdout.write('\n')
	}
}

function drawRaw(field) {
	//*: mine, 0-8: adjacent mines
	for (i = 0; i < field.length; i++) {
		for (j = 0; j < field[i].length; j++) {
			if (field[i][j] == 1) {
				process.stdout.write('*')
			} else {
					process.stdout.write(checkAdj(field, i, j).toString())
			}
		}
		process.stdout.write('\n')
	}
}


function main() {
	f = init(5, 15, 25)
	draw(f)

	process.stdin.resume()
	process.stdin.setEncoding('utf8')

	process.stdout.write("Enter row and column (row col): ")

	process.stdin.on('data', (text) => {
		index = text.trim().split(' ')
		row = index[0]
		col = index[1]

		if (f[row][col] == 1) {
			drawRaw(f)
			console.log("You Lose!")
			process.exit()
		} else {
			f[row][col] = 2
			draw(f)
			process.stdout.write("Enter row and column (row col): ")
		}
	})
}

main()
