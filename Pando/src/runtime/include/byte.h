#ifndef BYTE_HEADER_FILE
#define BYTE_HEADER_FILE

typedef unsigned char byte;

int byteSize = 0;

long fileSize(FILE* f_ptr) {
	int prev = ftell(f_ptr);
	fseek(f_ptr, 0L, SEEK_END);
	long sz = ftell(f_ptr);
	fseek(f_ptr,prev,SEEK_SET);
	return sz;
}

byte* readByteCode(char* targetFile) {
	FILE* f_ptr;
	f_ptr = fopen(targetFile, "rb");

	byteSize = fileSize(f_ptr);
	byte* byteStream = ( byte* )malloc( byteSize );
	fread(byteStream, sizeof(byteStream), byteSize, f_ptr);

	fclose(f_ptr);

	return byteStream;
}

#endif