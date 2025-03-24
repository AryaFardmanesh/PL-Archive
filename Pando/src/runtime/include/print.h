#ifndef PRINT_HEADER_FILE
#define PRINT_HEADER_FILE

#define RED   "\x1B[31m"
#define GRN   "\x1B[32m"
#define YEL   "\x1B[33m"
#define BLU   "\x1B[34m"
#define MAG   "\x1B[35m"
#define CYN   "\x1B[36m"
#define WHT   "\x1B[37m"
#define RESET "\x1B[0m"

void pando_print(byte* byteStream, int* pos) {
	byte typeCode = byteStream[++(*pos)];

	if (typeCode == 25) {
		printf(MAG "null" RESET);
	}else if (typeCode == 24) {
		byte byteVal = byteStream[++(*pos)];

		if (byteVal == 0) {
			printf(MAG "false" RESET);
		}else {
			printf(MAG "true" RESET);
		}
	}else if (typeCode == 23) {
		byte byteVal = byteStream[++(*pos)];
		printf(MAG "%f" RESET, (double)byteVal);
	}else if (typeCode == 22) {
		byte byteVal = byteStream[++(*pos)];
		printf(MAG "%d" RESET, byteVal);
	}else if (typeCode == 22) {
		byte byteVal = byteStream[++(*pos)];
		printf(MAG "%d" RESET, (char)byteVal);
	}else if (typeCode == 21) {
		byte byteVal = byteStream[++(*pos)];
		printf(MAG "%c" RESET, byteVal);
	}else if (typeCode == 20) {
		byte byteVal = byteStream[++(*pos)];

		while (byteVal != 0) {
			printf(GRN "%c", byteVal);
			byteVal = byteStream[++(*pos)];
		}

		printf(RESET);
	}
}

#endif