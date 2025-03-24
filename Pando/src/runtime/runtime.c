#include "runtime.h"

int main(int argc, char *argv[]) {
	targetFile = argv[1];
	byteStream = readByteCode(targetFile);

	init();

	// while (pos < byteSize) {
	// 	printf("BYTE_CODE: '%d'\n", b_current);
	// 	b_current = byteStream[++pos];
	// }

	while (status && pos < byteSize) {
		if (b_current == 1) {
			pando_print(byteStream, &pos);
			continue;
		}

		b_current = byteStream[++pos];
	}

	return 0;
}