#ifndef RUNTIME_HEADER_FILE
#define RUNTIME_HEADER_FILE

#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>

#include "include/byte.h"
#include "include/print.h"

char* targetFile;
byte* byteStream;

bool status;
int pos;
byte b_current;

void init() {
	status = true;
	pos = 0;
	b_current = byteStream[pos];
}

byte peek(int p) {
	const int index = p + pos;

	if (index < byteSize) {
		return byteStream[index];
	}

	// Return EOF (0)
	return byteStream[byteSize - 1];
}

#endif